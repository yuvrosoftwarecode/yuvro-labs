// Mock "who attempted this lab" data for the admin lab viewer.
// Deterministic per lab id so the drill-down is stable across renders.

export type DiffLineType = "ctx" | "add" | "del";
export interface DiffLine { type: DiffLineType; oldNo?: number; newNo?: number; text: string }
export interface DiffFile {
  path: string;
  status: "modified" | "added" | "deleted";
  additions: number;
  deletions: number;
  lines: DiffLine[];
}
export interface AttemptTicket {
  id: string;
  title: string;
  status: "Completed" | "In Progress" | "Failed";
  score: number;
  xp: number;
  timeMin: number;
  submittedAt: string;
  files: DiffFile[];
}
export interface AttemptSprint {
  id: string;
  name: string;
  progressPct: number;
  tickets: AttemptTicket[];
}
export interface LabAttemptUser {
  id: string;
  name: string;
  email: string;
  cohort: string;
  status: "Completed" | "In Progress" | "Dropped";
  progressPct: number;
  xp: number;
  lastActive: string;
  sprints: AttemptSprint[];
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
const pick = <T,>(arr: T[], n: number) => arr[n % arr.length];

const NAMES = [
  "Aarav Sharma", "Diya Patel", "Rohan Mehta", "Ishita Nair", "Kabir Reddy",
  "Ananya Iyer", "Vikram Singh", "Meera Joshi", "Arjun Rao", "Sneha Kulkarni",
  "Rahul Verma", "Tara Menon", "Nikhil Bose", "Priya Deshpande", "Aditya Ghosh",
];
const COHORTS = ["Batch 24-A", "Batch 24-B", "Batch 25-A", "Open enrollment", "Campus – VIT"];
const SPRINT_NAMES = ["Foundations", "Core Concepts", "Applied Practice", "Advanced Track"];
const TICKET_TITLES = [
  "Set up project scaffold", "Implement data model", "Handle edge cases",
  "Refactor service layer", "Add validation rules", "Optimise the query",
  "Write integration tests", "Fix failing pipeline",
];

function makeDiff(seed: number, lang: string): DiffFile[] {
  const ext = lang === "sql" ? "sql" : lang === "python" ? "py" : lang === "java" ? "java" : "ts";
  const files: DiffFile[] = [];
  const count = 1 + (seed % 3);
  for (let f = 0; f < count; f++) {
    const s = seed + f * 977;
    const path = pick(
      [`src/main.${ext}`, `src/services/handler.${ext}`, `src/models/entity.${ext}`, `tests/spec.${ext}`, `queries/report.${ext}`],
      s
    );
    const lines: DiffLine[] = [];
    let oldNo = 12 + (s % 20), newNo = oldNo;
    const body = [
      ["ctx", `import { config } from "../config";`],
      ["ctx", ``],
      ["del", `function process(input) {`],
      ["add", `function process(input: Payload): Result {`],
      ["ctx", `  const rows = load(input.id);`],
      ["del", `  if (!rows) return null;`],
      ["add", `  if (!rows?.length) {`],
      ["add", `    throw new NotFoundError(input.id);`],
      ["add", `  }`],
      ["ctx", `  return rows.map(normalise);`],
      ["ctx", `}`],
      ["ctx", ``],
      ["del", `// TODO: handle nulls`],
      ["add", `export const normalise = (r: Row) => ({ ...r, ok: true });`],
    ] as [DiffLineType, string][];
    for (const [type, text] of body) {
      if (type === "ctx") lines.push({ type, oldNo: oldNo++, newNo: newNo++, text });
      else if (type === "del") lines.push({ type, oldNo: oldNo++, text });
      else lines.push({ type, newNo: newNo++, text });
    }
    files.push({
      path,
      status: f === 0 ? "modified" : s % 5 === 0 ? "added" : "modified",
      additions: lines.filter(l => l.type === "add").length,
      deletions: lines.filter(l => l.type === "del").length,
      lines,
    });
  }
  return files;
}

export function getLabAttempts(labId: string, labTitle: string, lang = "ts"): LabAttemptUser[] {
  const base = hash(labId);
  const userCount = 5 + (base % 6);
  const users: LabAttemptUser[] = [];
  for (let u = 0; u < userCount; u++) {
    const s = base + u * 7919;
    const name = pick(NAMES, s);
    const sprintCount = 2 + (s % 3);
    const sprints: AttemptSprint[] = [];
    let total = 0, done = 0, xp = 0;
    for (let sp = 0; sp < sprintCount; sp++) {
      const ss = s + sp * 3571;
      const ticketCount = 2 + (ss % 3);
      const tickets: AttemptTicket[] = [];
      for (let t = 0; t < ticketCount; t++) {
        const ts = ss + t * 613;
        const status: AttemptTicket["status"] = ts % 7 === 0 ? "Failed" : ts % 3 === 0 ? "In Progress" : "Completed";
        const score = status === "Completed" ? 70 + (ts % 30) : status === "Failed" ? 20 + (ts % 30) : 40 + (ts % 25);
        const tXp = 40 + (ts % 60);
        total++; if (status === "Completed") { done++; xp += tXp; }
        tickets.push({
          id: `${labId.slice(0, 4).toUpperCase()}-${100 + sp * 10 + t}`,
          title: pick(TICKET_TITLES, ts),
          status, score, xp: tXp,
          timeMin: 15 + (ts % 70),
          submittedAt: `${1 + (ts % 27)} Jul 2026, ${9 + (ts % 9)}:${String(ts % 60).padStart(2, "0")}`,
          files: makeDiff(ts, lang),
        });
      }
      const spDone = tickets.filter(t => t.status === "Completed").length;
      sprints.push({
        id: `SP-${sp + 1}`,
        name: `${pick(SPRINT_NAMES, ss)} · ${labTitle.split(" ")[0]}`,
        progressPct: Math.round((spDone / tickets.length) * 100),
        tickets,
      });
    }
    const progressPct = Math.round((done / total) * 100);
    users.push({
      id: `U-${1000 + (s % 9000)}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@yuvro.dev`,
      cohort: pick(COHORTS, s),
      status: progressPct === 100 ? "Completed" : progressPct < 25 ? "Dropped" : "In Progress",
      progressPct, xp,
      lastActive: `${1 + (s % 27)} Jul 2026`,
      sprints,
    });
  }
  return users;
}
