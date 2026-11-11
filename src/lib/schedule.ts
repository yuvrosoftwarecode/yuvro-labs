export type ContestKind = "Weekly" | "Biweekly";
export interface Contest {
  id: string; kind: ContestKind; number: number; name: string; start: number;
  duration: number; problems: number; podium: readonly number[]; top10: number; top25: number;
  streak?: number;
}
const WEEK = 7 * 86400000;
const anchors = { Weekly: Date.UTC(2026, 10, 8, 14, 30), Biweekly: Date.UTC(2026, 10, 7, 14, 30) };
export function makeContest(kind: ContestKind, offset: number): Contest {
  const weekly = kind === "Weekly", number = (weekly ? 46 : 23) + offset;
  return { id: `${kind[0]}${number}`, kind, number, name: `${kind} Contest ${number}`,
    start: anchors[kind] + offset * WEEK * (weekly ? 1 : 2), duration: weekly ? 90 : 120,
    problems: weekly ? 3 : 4, podium: weekly ? [5000, 3000, 2000] : [10000, 6000, 4000], top10: weekly ? 300 : 600, top25: weekly ? 150 : 300 };
}
export function getSchedule(now = Date.now()) {
  const upcoming: Contest[] = [], past: Contest[] = [];
  for (const kind of ["Weekly", "Biweekly"] as const) {
    const first = makeContest(kind, 0), period = WEEK * (kind === "Weekly" ? 1 : 2);
    // A running contest stays upcoming until its closing time.
    const offset = Math.floor((now - first.start - first.duration * 60000) / period) + 1;
    for (let i = 0; i < (kind === "Weekly" ? 4 : 2); i++) upcoming.push(makeContest(kind, offset + i));
    for (let i = 1; i <= (kind === "Weekly" ? 6 : 3); i++) past.push(makeContest(kind, offset - i));
  }
  return { upcoming: upcoming.sort((a, b) => a.start - b.start), past: past.sort((a, b) => b.start - a.start) };
}
export function countdown(contest: Contest, now: number) {
  const difference = contest.start - now;
  if (difference <= 0) return now < contest.start + contest.duration * 60000 ? "Live now" : "Ended";
  const seconds = Math.floor(difference / 1000), pad = (n: number) => String(n).padStart(2, "0");
  return `${Math.floor(seconds / 86400)}d ${pad(Math.floor(seconds % 86400 / 3600))}h ${pad(Math.floor(seconds % 3600 / 60))}m ${pad(seconds % 60)}s`;
}
export const formatContestDate = (start: number, short = false) => new Date(start).toLocaleString(undefined,
  short ? { day: "numeric", month: "short", year: "numeric" } : { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZoneName: "short" });
export function calendarUrl(contest: Contest) {
  const iso = (date: number) => new Date(date).toISOString().replace(/[-:]|\.\d{3}/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Yuvro ${contest.name}`)}&dates=${iso(contest.start)}/${iso(contest.start + contest.duration * 60000)}`;
}
