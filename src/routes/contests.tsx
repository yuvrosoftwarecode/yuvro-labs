import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";

export const Route = createFileRoute("/contests")({
  head: () => ({ meta: [{ title: "Contests — Yuvro" }] }),
  component: ContestsPage,
});

const WEEKLY_EPOCH = Date.UTC(2026, 0, 4, 2, 30); // Sunday 08:00 IST, contest #1
const BIWEEKLY_EPOCH = Date.UTC(2026, 0, 10, 14, 30); // Saturday 20:00 IST, contest #1
const WEEK = 7 * 864e5;

function nextOf(epoch: number, period: number, now: number) {
  const n = Math.max(0, Math.ceil((now - epoch) / period));
  return { number: n + 1, start: epoch + n * period };
}

function countdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${d}d ${h}h ${m}m ${sec}s`;
}

const fmt = (t: number) => new Date(t).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

function ContestsPage() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const [registered, setRegistered] = useState<string[]>([]);

  const weekly = nextOf(WEEKLY_EPOCH, WEEK, now);
  const biweekly = nextOf(BIWEEKLY_EPOCH, 2 * WEEK, now);
  const upcoming = [
    { id: `w${weekly.number}`, name: `Weekly Contest ${weekly.number}`, start: weekly.start, meta: "Every Sunday · 90 minutes · 4 problems" },
    { id: `b${biweekly.number}`, name: `Biweekly Contest ${biweekly.number}`, start: biweekly.start, meta: "Every other Saturday · 90 minutes · 4 problems" },
  ].sort((a, b) => a.start - b.start);

  const past = [
    ...Array.from({ length: 4 }, (_, i) => ({ name: `Weekly Contest ${weekly.number - 1 - i}`, start: weekly.start - (i + 1) * WEEK })),
    ...Array.from({ length: 2 }, (_, i) => ({ name: `Biweekly Contest ${biweekly.number - 1 - i}`, start: biweekly.start - (i + 1) * 2 * WEEK })),
  ].filter(p => p.start >= WEEKLY_EPOCH - WEEK).sort((a, b) => b.start - a.start);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1000px] px-4 py-8">
        <h1 className="text-2xl font-semibold">Contests</h1>
        <p className="text-sm text-muted-foreground mt-1">Compete in weekly and biweekly coding contests.</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Upcoming</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {upcoming.map(c => {
              const reg = registered.includes(c.id);
              return (
                <div key={c.id} className="rounded-xl border bg-card p-5">
                  <p className="text-base font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.meta}</p>
                  <p className="text-sm mt-4">{fmt(c.start)}</p>
                  <p className="text-sm text-muted-foreground">Starts in <span className="tabular-nums text-foreground">{countdown(c.start - now)}</span></p>
                  <button
                    onClick={() => setRegistered(r => reg ? r.filter(x => x !== c.id) : [...r, c.id])}
                    className={`mt-4 rounded-md px-4 py-2 text-sm ${reg ? "border" : "text-white"}`}
                    style={reg ? undefined : { background: "#f7931e" }}
                  >{reg ? "Registered ✓" : "Register"}</button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Past contests</h2>
          <ul className="mt-4 divide-y border-y">
            {past.map(p => (
              <li key={p.name} className="flex items-center justify-between py-3 text-sm">
                <span>{p.name}</span>
                <span className="text-muted-foreground">{fmt(p.start)}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
