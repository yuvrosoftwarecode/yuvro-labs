import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { hasCompletedInterview } from "@/lib/mockInterviewReports";

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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
            <h2 className="text-xl font-semibold">My interviews</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{mine.length} interviews</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">Available mock interview: <span className="font-medium text-foreground">0</span></p>
              <Dialog>
                <DialogTrigger asChild><Button size="sm">Buy</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Buy mock interviews</DialogTitle>
                    <DialogDescription>Mock interview purchases are not available yet.</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {mine.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
              You haven't added any mock interview yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:max-w-[850px]">{mine.map(i => <MineCard key={i.slug} i={i} />)}</div>
          )}
        </section>
      </main>
    </div>
  );
}

function MineCard({ i }: { i: Interview }) {
  const completed = hasCompletedInterview(i.slug, i.completed);
  return (
    <article className="flex min-w-0 flex-col rounded-lg bg-card p-6">
      <p className={`mb-3 text-xs font-medium ${completed ? "text-brand-orange" : "text-muted-foreground"}`}>{completed ? "Completed" : "Ready to start"}</p>
      <h3 className="text-base font-medium">{i.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.description}</p>
      <p className="mb-6 mt-4 text-xs text-muted-foreground">{i.minutes} minutes</p>
      <div className="mt-auto flex flex-wrap gap-3">
        {completed && <Button asChild size="sm"><Link to="/mock-interview/$slug" params={{ slug: i.slug }} search={{ report: true }}>View report</Link></Button>}
        <Button asChild size="sm" variant={completed ? "secondary" : "default"}><Link to="/mock-interview/$slug" params={{ slug: i.slug }} search={{ report: false }}>{completed ? "Retake" : "Start interview"}</Link></Button>
      </div>
    </article>
  );
}
