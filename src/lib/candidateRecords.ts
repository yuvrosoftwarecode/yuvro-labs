// Master candidate ledger for an evaluation.
// Every candidate associated with the evaluation, regardless of how they entered:
// Yuvro Invite, Follow-up Setup (bulk or individual), or the shared public link.
// Deduplicated by email — one record per candidate identity.

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
  sentAt: number | null;
  accessedAt: number | null;
  status: RecordStatus;
  submittedAt: number | null;
  score: number | null;
  result: RecordResult;
  followUp: boolean;
  labsScore: number | null;
  assessmentScore: number | null;
  vitarkaScore: number | null;
  systemDesignScore?: number | null;
  eci: number | null;
  totalEarned?: number | null;
  totalPossible?: number | null;
  deadline: number | null;
  emailsSent: number;
  aiCall: boolean;
  lastActivity: number;
  activity: ActivityEvent[];
}

import { restApiAuthUtil } from "@/utils/RestApiAuthUtil";

export async function fetchCandidateRecords(evId: string): Promise<CandidateRecord[]> {
  try {
    const data = await restApiAuthUtil.get<CandidateRecord[]>(`/skill_evaluation/evaluations/${evId}/records/`);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (err) {
    console.warn("fetchCandidateRecords offline, using mock records:", err);
  }

  const names = [
    "Kadali Harshavardhan", "Medishetty Manikanta Gandhi", "Mrinal Guptha", "Mucharla Sreelekha",
    "Rohith Godugu", "Devendra Dora", "Shilpa Dora", "Priya Sharma", "Aditya Nair", "Ananya Sen",
    "Rahul Verma", "Sneha Patel", "Vikram Malhotra", "Kavya Reddy", "Arjun Mehta", "Meera Iyer",
    "Nikhil Joshi", "Divya Krishnan", "Siddharth Rao", "Aishwarya Roy", "Gaurav Agarwal",
    "Tanvi Deshmukh", "Rohan Kulkarni", "Pooja Hegde", "Karan Bhatia", "Isha Chawla", "Aman Singhania", "Rhea Kapoor"
  ];

  const now = Date.now();
  return names.map((name, i) => {
    const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, ".")}${100 + i}@gmail.com`;
    const score = 65 + ((i * 7) % 32);
    const passed = score >= 60;
    const isSubmitted = i % 8 !== 7;
    const sentAt = now - (i + 2) * 86400000;
    const accessedAt = sentAt + 3600000 * 4;
    const submittedAt = isSubmitted ? accessedAt + 3600000 * 2 : null;

    return {
      id: `rec-${evId}-${i + 1}`,
      candidateId: `cand-${i + 1}`,
      name,
      email,
      phone: `+91 98450 ${10000 + (i * 111) % 89999}`,
      source: (i % 3 === 0 ? "Shared Link" : i % 5 === 0 ? "Follow-up Setup" : "Yuvro Invite") as RecordSource,
      sentAt,
      accessedAt,
      status: (isSubmitted ? "Submitted" : "Not Submitted") as RecordStatus,
      submittedAt,
      score: isSubmitted ? score : null,
      result: (isSubmitted ? (passed ? "Passed" : "Failed") : "Not Evaluated") as RecordResult,
      followUp: i % 4 === 0,
      labsScore: Math.round(score * 0.4),
      assessmentScore: Math.round(score * 0.3),
      vitarkaScore: Math.round(score * 0.3),
      systemDesignScore: Math.round(score * 0.3),
      eci: score,
      totalEarned: score,
      totalPossible: 100,
      deadline: now + 5 * 86400000,
      emailsSent: (i % 3) + 1,
      aiCall: i % 5 === 0,
      lastActivity: isSubmitted ? (submittedAt || now) : accessedAt,
      activity: [
        { label: "Invitation sent via email", at: sentAt },
        { label: "Link opened by candidate", at: accessedAt },
        ...(isSubmitted ? [{ label: "Evaluation submitted", at: submittedAt }] : [])
      ]
    };
  });
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
