import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { ProgressRing } from "@/components/ProgressRing";
import { DiffBadge } from "@/components/Badges";
import { ArrowRight, Clock } from "lucide-react";

export const Route = createFileRoute("/mock-interviews")({
  head: () => ({ meta: [{ title: "Mock Interviews | Yuvro" }, { name: "description", content: "Practice AI-led tech mock interviews with Vitarka." }] }),
  component: MockHub,
});

import { INTERVIEWS, type Interview } from "@/lib/mockInterviews";

const KEY = "yuvro-mock-interviews-enrolled";
const load = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) || '["java-backend","react-frontend"]'); } catch { return []; } };

function MockHub() {
  const [enrolled, setEnrolled] = useState<string[]>([]);
  useEffect(() => { setEnrolled(load()); }, []);

  const mine = INTERVIEWS.filter(i => enrolled.includes(i.slug));

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">My interviews</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{mine.length} added · {mine.reduce((a, i) => a + i.completed, 0)} attempts completed</p>
          </div>
          {mine.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
              You haven't added any mock interview yet.
            </div>
          ) : (
            <HScroll>{mine.map(i => <div key={i.slug} className="w-[300px] shrink-0"><MineCard i={i} /></div>)}</HScroll>
          )}
        </section>
      </main>
    </div>
  );
}

function Meta({ i }: { i: Interview }) {
  return (
    <div className="mt-4 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5"><DiffBadge value={i.difficulty} /><span className="rounded-md border px-1.5 py-0.5 text-[10px]">{i.role}</span></div>
      <span className="text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />{i.minutes}m · {i.questions} Qs</span>
    </div>
  );
}

function MineCard({ i }: { i: Interview }) {
  const pct = Math.min(100, i.completed * 34);
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-5 hover:border-primary/50 transition">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `var(--${i.color})` }} />
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-2xl">{i.icon}</div>
          <h3 className="mt-2 font-semibold truncate">{i.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{i.description}</p>
        </div>
        <ProgressRing value={pct} color="#f7931e" />
      </div>
      <Meta i={i} />
      <Link to="/mock-interview/$slug" params={{ slug: i.slug }} className="mt-4 w-full inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
        {i.completed > 0 ? "Retake interview" : "Start interview"} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function HScroll({ children }: { children: React.ReactNode }) {
  return <div className="-mx-4 px-4 overflow-x-auto scrollbar-thin"><div className="flex gap-4 pb-2">{children}</div></div>;
}
