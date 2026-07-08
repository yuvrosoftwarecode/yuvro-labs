// Lab access tiers & sprint unlocking (client-side demo).
// Tier taxonomy:
//   - "free":     every sprint unlocked
//   - "freemium": first sprint free ("preview sprint"), rest require unlock
//   - "premium":  every sprint requires unlock
export type LabTier = "free" | "freemium" | "premium";

export const TIER_META: Record<LabTier, {
  label: string;
  short: string;
  price: string;
  blurb: string;
  tone: "success" | "warning" | "primary";
}> = {
  free:     { label: "Free Access",     short: "Free",     price: "Free",   blurb: "Every sprint is fully unlocked. Learn at your own pace.", tone: "success" },
  freemium: { label: "Freemium",        short: "Freemium", price: "₹499",   blurb: "Sprint 1 is free as a preview. Unlock the full track to continue.", tone: "warning" },
  premium:  { label: "Premium Track",   short: "Premium",  price: "₹1,499", blurb: "Curated premium track. Unlock to access every sprint.", tone: "primary" },
};

// Static assignment per lab slug (demo).
const TIER_MAP: Record<string, LabTier> = {
  programming: "free",
  git: "free",
  linux: "free",
  python: "free",

  java: "freemium",
  ui: "freemium",
  sql: "freemium",
  mongo: "freemium",
  datastructures: "freemium",
  pydjango: "freemium",
  pyflask: "freemium",

  postgres: "premium",
  javaspring: "premium",
  systemdesign: "premium",
  cybersecurity: "premium",
  qa: "premium",
};

export function getLabTier(slug: string): LabTier {
  return TIER_MAP[slug] ?? "free";
}

const KEY = "yuvro-lab-unlocks-v1";
function read(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") as string[]; } catch { return []; }
}
function write(list: string[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
}
export function isLabUnlocked(slug: string): boolean {
  return read().includes(slug);
}
export function unlockLab(slug: string) {
  const list = read();
  if (!list.includes(slug)) { list.push(slug); write(list); }
}

/** Which sprint indices (0-based) are free for this tier, ignoring paid unlock. */
export function freeSprintCount(tier: LabTier): number {
  if (tier === "free") return Infinity;
  if (tier === "freemium") return 1;
  return 0;
}

/** Whether a given sprint index is locked for the current user. */
export function isSprintLocked(slug: string, index: number): boolean {
  const tier = getLabTier(slug);
  if (tier === "free") return false;
  if (isLabUnlocked(slug)) return false;
  return index >= freeSprintCount(tier);
}
