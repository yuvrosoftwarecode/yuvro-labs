// Hackathons store (localStorage). A hackathon has goals that resemble lab
// sprint tickets — each targeting a specific lab (SQL, Linux, HTML/CSS, Java, …).
import { labs as studentLabs } from "@/lib/dummy";

export type GoalDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface HackathonGoal {
  id: string;
  title: string;
  description: string;
  labSlug: string;        // which lab this goal targets, e.g. "sql", "linux", "ui"
  difficulty: GoalDifficulty;
  xp: number;
  estMin: number;
  starterCode?: string;
  hints?: string;
  solution?: string;
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  theme?: string;
  prize?: string;
  startsAt?: string;       // ISO
  endsAt?: string;         // ISO
  isActive: boolean;
  goals: HackathonGoal[];
  createdAt: number;
}

const KEY = "yuvro-hackathons";

function readAll(): Hackathon[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED;
    return JSON.parse(raw) as Hackathon[];
  } catch { return SEED; }
}
function writeAll(list: Hackathon[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export const newId = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function listHackathons(): Hackathon[] { return readAll(); }
export function getHackathon(id: string): Hackathon | undefined { return readAll().find(h => h.id === id); }

export function createHackathon(input: Omit<Hackathon, "id" | "createdAt" | "goals"> & { goals?: HackathonGoal[] }): Hackathon {
  const list = readAll();
  const h: Hackathon = { ...input, id: newId("hk"), goals: input.goals ?? [], createdAt: Date.now() };
  writeAll([h, ...list]);
  return h;
}

export function updateHackathon(id: string, patch: Partial<Hackathon>) {
  const list = readAll().map(h => h.id === id ? { ...h, ...patch } : h);
  writeAll(list);
}

export function deleteHackathon(id: string) {
  writeAll(readAll().filter(h => h.id !== id));
}

export function newGoal(labSlug = "sql"): HackathonGoal {
  return {
    id: newId("gl"),
    title: "New goal",
    description: "",
    labSlug,
    difficulty: "Intermediate",
    xp: 150,
    estMin: 45,
    starterCode: "",
    hints: "",
    solution: "",
  };
}

export const availableLabs = () => studentLabs.map(l => ({ slug: l.slug, name: l.name, icon: l.icon, color: l.color }));

// A small seed so both admin & student sides feel populated on first visit.
const SEED: Hackathon[] = [
  {
    id: "hk-seed-fintech",
    title: "FinTech 48h Sprint",
    description: "Ship a mini banking backend + dashboard in 48 hours. Cross-stack goals across SQL, Java and UI.",
    theme: "Financial Services",
    prize: "$1,000 + interview fast-track",
    startsAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    isActive: true,
    createdAt: Date.now(),
    goals: [
      { id: "gl-s1", title: "Design accounts schema", description: "Design normalized tables for users, accounts and transactions with FKs and indexes.", labSlug: "sql", difficulty: "Intermediate", xp: 200, estMin: 60 },
      { id: "gl-s2", title: "Top spenders query", description: "Write a window-function query returning top 10 spenders per month.", labSlug: "sql", difficulty: "Advanced", xp: 250, estMin: 45 },
      { id: "gl-s3", title: "Transfer API endpoint", description: "Implement POST /transfer with validation, idempotency key and rollback on failure.", labSlug: "javaspring", difficulty: "Advanced", xp: 300, estMin: 90 },
      { id: "gl-s4", title: "Balance dashboard UI", description: "Build a responsive dashboard showing balances, recent transactions and a spending chart.", labSlug: "ui", difficulty: "Intermediate", xp: 220, estMin: 75 },
      { id: "gl-s5", title: "Harden the Linux host", description: "Configure ufw, disable root SSH, add fail2ban and document steps in a runbook.", labSlug: "linux", difficulty: "Intermediate", xp: 180, estMin: 40 },
    ],
  },
  {
    id: "hk-seed-devops",
    title: "DevOps Ninja Challenge",
    description: "Automate everything — from linting to a green production deploy.",
    theme: "Infrastructure",
    prize: "Cloud credits + swag",
    startsAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString(),
    isActive: true,
    createdAt: Date.now() - 10000,
    goals: [
      { id: "gl-d1", title: "Multi-stage Dockerfile", description: "Ship a <100MB image with a builder + runtime stage.", labSlug: "linux", difficulty: "Intermediate", xp: 180, estMin: 45 },
      { id: "gl-d2", title: "End-to-end test pipeline", description: "Wire Playwright tests into CI with matrix runs across 2 browsers.", labSlug: "qa", difficulty: "Advanced", xp: 260, estMin: 75 },
      { id: "gl-d3", title: "Query plan tuning", description: "Take a slow report query and cut it under 100ms using indexes and EXPLAIN.", labSlug: "postgres", difficulty: "Advanced", xp: 240, estMin: 60 },
    ],
  },
];
