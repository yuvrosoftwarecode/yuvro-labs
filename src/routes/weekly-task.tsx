import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { useAuth } from "@/lib/auth";
import { weeklyTask, todayIndex, getDone, setDone } from "@/lib/weeklyTask";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/weekly-task")({
  head: () => ({ meta: [{ title: "Weekly Task: Todo App — Yuvro" }] }),
  component: WeeklyTaskPage,
});

function WeeklyTaskPage() {
  const { user } = useAuth();
  const [done, setDoneState] = useState<number[]>([]);
  const [today, setToday] = useState(0);
  useEffect(() => { setDoneState(getDone()); setToday(todayIndex()); }, []);

  const toggle = (i: number) => {
    const next = done.includes(i) ? done.filter(d => d !== i) : [...done, i];
    setDoneState(next); setDone(next);
  };
  const total = weeklyTask.days.length;
  const allDone = done.length === total;

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[900px] px-4 py-8">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Back to dashboard</Link>
        <p className="mt-6 text-xs uppercase tracking-wide text-muted-foreground">Weekly task</p>
        <h1 className="text-2xl font-semibold mt-1">{weeklyTask.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{weeklyTask.description}</p>
        <div className="mt-4 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full" style={{ width: `${(done.length / total) * 100}%`, background: "#f7931e" }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">{done.length} of {total} days completed</p>

        <ol className="mt-8 divide-y border-y">
          {weeklyTask.days.map((d, i) => {
            const locked = i > today;
            const isDone = done.includes(i);
            return (
              <li key={d.day} className="relative py-5">
                <div className={locked ? "blur-sm select-none pointer-events-none" : ""} aria-hidden={locked}>
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Day {i + 1} · {d.day}{i === today ? " · Today" : ""}</p>
                      <h3 className="text-base font-medium mt-0.5">{d.title}</h3>
                    </div>
                    <button
                      onClick={() => toggle(i)}
                      className={`shrink-0 rounded-md px-3 py-1.5 text-sm ${isDone ? "border text-foreground" : "text-white"}`}
                      style={isDone ? undefined : { background: "#f7931e" }}
                    >
                      {isDone ? "Completed ✓" : "Mark complete"}
                    </button>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
                    {d.tasks.map(t => <li key={t}>{t}</li>)}
                  </ul>
                </div>
                {locked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex items-center gap-1.5 rounded-md bg-background/90 border px-3 py-1.5 text-sm">
                      <Lock className="h-3.5 w-3.5" /> Unlocks on {d.day}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Certificate</h2>
          {allDone ? (
            <div className="mt-4 border-2 p-10 text-center" style={{ borderColor: "#f7931e" }}>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Certificate of completion</p>
              <p className="mt-4 text-sm text-muted-foreground">This certifies that</p>
              <p className="mt-1 text-2xl font-semibold">{user?.name || "Learner"}</p>
              <p className="mt-3 text-sm text-muted-foreground">has completed the 7-day weekly task</p>
              <p className="mt-1 text-lg font-medium">{weeklyTask.name}</p>
              <p className="mt-6 text-xs text-muted-foreground">Yuvro Labs · {new Date().toLocaleDateString()}</p>
              <button onClick={() => window.print()} className="mt-6 rounded-md px-4 py-2 text-sm text-white" style={{ background: "#f7931e" }}>Download certificate</button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Complete all {total} days to unlock your certificate.</p>
          )}
        </section>
      </main>
    </div>
  );
}
