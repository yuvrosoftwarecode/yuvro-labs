// Master candidate ledger for an evaluation.
// Every candidate associated with the evaluation, regardless of how they entered:
// Yuvro Invite, Follow-up Setup (bulk or individual), or the shared public link.
// Deduplicated by email — one record per candidate identity.

import { getCandidates, type Candidate } from "./recruiterCandidates";

export type RecordSource = "Yuvro Invite" | "Follow-up Setup" | "Shared Link";
export type RecordStatus = "Not Submitted" | "Submitted";
export type RecordResult = "Passed" | "Failed" | "Not Evaluated";

export interface ActivityEvent {
  label: string;
  at: number | null;
}

export interface CandidateRecord {
  id: string;
  candidateId: string;
  name: string;
  email: string;
  phone: string;
  source: RecordSource;
  sentAt: number | null; // null for Shared Link (recruiter shared externally)
  accessedAt: number | null; // registration/access timestamp (shared link)
  status: RecordStatus;
  submittedAt: number | null;
  score: number | null;
  result: RecordResult;
  followUp: boolean;
  labsScore: number | null;
  assessmentScore: number | null;
  vitarkaScore: number | null;
  eci: number | null;
  deadline: number;
  emailsSent: number;
  aiCall: boolean;
  lastActivity: number;
  activity: ActivityEvent[];
}

export const PASS_MARK = 65;

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const DAY = 24 * 60 * 60 * 1000;
const cache = new Map<string, CandidateRecord[]>();

function toRecord(c: Candidate, evId: string): CandidateRecord {
  const h = hash(`${evId}:${c.email}`);
  const r1 = (h % 1000) / 1000;
  const r2 = ((h >>> 10) % 1000) / 1000;
  const r3 = ((h >>> 20) % 1000) / 1000;

  const source: RecordSource = r1 < 0.5 ? "Yuvro Invite" : r1 < 0.78 ? "Follow-up Setup" : "Shared Link";

  const submitted = c.status === "Submitted" || c.status === "Completed";
  const submittedAt = submitted ? c.submittedAt : null;
  const baseline = submittedAt ?? Date.now() - Math.floor(r2 * 20 * DAY);
  const sentAtValue = baseline - (1 + Math.floor(r2 * 5)) * DAY - Math.floor(r3 * 8 * 60 * 60 * 1000);
  const sentAt = source === "Shared Link" ? null : sentAtValue;
  const accessedAt = source === "Shared Link" ? sentAtValue : null;

  const score = submitted ? c.eci : null;
  const result: RecordResult = !submitted ? "Not Evaluated" : c.eci >= PASS_MARK ? "Passed" : "Failed";

  const followUp = source === "Follow-up Setup" ? true : r3 < 0.32;
  const emailsSent = followUp ? 1 + Math.floor(r2 * 3) : 1;
  const aiCall = followUp && r2 > 0.65;

  const openedAt = sentAtValue + Math.floor(r3 * 2 * DAY);
  const activity: ActivityEvent[] = [
    { label: source === "Shared Link" ? "Registered via shared link" : "Invited", at: sentAtValue },
    { label: "Assessment opened", at: c.status === "Not Started" ? null : openedAt },
  ];
  if (followUp) activity.push({ label: `Follow-up reminders sent (${emailsSent})`, at: openedAt + Math.floor(r1 * DAY) });
  if (aiCall) activity.push({ label: "AI phone call placed", at: openedAt + Math.floor(r1 * DAY) + 3 * 60 * 60 * 1000 });
  activity.push({ label: "Assessment submitted", at: submittedAt });

  return {
    id: `rec-${c.id}`,
    candidateId: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    source,
    sentAt,
    accessedAt,
    status: submitted ? "Submitted" : "Not Submitted",
    submittedAt,
    score,
    result,
    followUp,
    labsScore: submitted ? c.labsScore : null,
    assessmentScore: submitted ? c.assessmentScore : null,
    vitarkaScore: submitted ? c.vitarkaScore : null,
    eci: submitted ? c.eci : null,
    deadline: sentAtValue + 7 * DAY,
    emailsSent,
    aiCall,
    lastActivity: submittedAt ?? openedAt,
    activity,
  };
}

export function getCandidateRecords(evId: string): CandidateRecord[] {
  const cached = cache.get(evId);
  if (cached) return cached;
  const seen = new Set<string>();
  const out: CandidateRecord[] = [];
  for (const c of getCandidates(evId)) {
    const key = c.email.toLowerCase();
    if (seen.has(key)) continue; // dedupe by candidate identity
    seen.add(key);
    out.push(toRecord(c, evId));
  }
  cache.set(evId, out);
  return out;
}

export function recordTotals(rows: CandidateRecord[]) {
  return {
    total: rows.length,
    notSubmitted: rows.filter((r) => r.status === "Not Submitted").length,
    submitted: rows.filter((r) => r.status === "Submitted").length,
    passed: rows.filter((r) => r.result === "Passed").length,
    failed: rows.filter((r) => r.result === "Failed").length,
  };
}

export function fmtDate(ts: number | null): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtTime(ts: number | null): string {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
