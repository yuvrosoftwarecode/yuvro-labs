// Simple client-side enrollment store (localStorage).
const KEY = "yuvro-enrolled-labs";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") as string[]; } catch { return []; }
}
function write(list: string[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

// Seed a couple of enrollments so the section isn't empty on first load.
const DEFAULT_ENROLLED = ["java", "python", "ui", "sql", "git", "linux", "mongo", "datastructures"];

export function getEnrolled(): string[] {
  if (typeof window === "undefined") return DEFAULT_ENROLLED;
  const raw = localStorage.getItem(KEY);
  if (raw === null) { write(DEFAULT_ENROLLED); return [...DEFAULT_ENROLLED]; }
  try { return JSON.parse(raw) as string[]; } catch { return []; }
}

export function isEnrolled(slug: string) { return read().includes(slug); }

export function enroll(slug: string) {
  const list = read();
  if (!list.includes(slug)) { list.push(slug); write(list); }
}
export function unenroll(slug: string) {
  write(read().filter(s => s !== slug));
}
export function toggleEnroll(slug: string) {
  const list = read();
  if (list.includes(slug)) write(list.filter(s => s !== slug));
  else { list.push(slug); write(list); }
}
