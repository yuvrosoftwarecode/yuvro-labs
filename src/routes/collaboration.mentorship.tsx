import { createFileRoute, Link } from "@tanstack/react-router";
import { engineers } from "@/lib/collab";
import { GraduationCap, Compass, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/collaboration/mentorship")({ component: Mentorship });

const paths = [
  { title: "First Squad: Frontend", level: "Beginner", steps: ["Join a Beginner squad", "Ship 1 UI ticket", "Get 1 PR reviewed"], duration: "1 week" },
  { title: "Backend Foundations", level: "Beginner", steps: ["Implement 1 API", "Write unit tests", "Pair with a senior backend"], duration: "2 weeks" },
  { title: "Incident Responder", level: "Intermediate", steps: ["Shadow a SEV2", "Co-lead a SEV3", "Write a postmortem"], duration: "3 weeks" },
  { title: "Squad Leader Track", level: "Advanced", steps: ["Lead 1 sprint", "Run retro", "Mentor 2 juniors"], duration: "4 weeks" },
];

function Mentorship() {
  const mentors = engineers.filter(e => e.leadership >= 75).slice(0, 4);

  return (
    <div className="px-6 py-6 max-w-[1300px]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Learning Paths & Mentorship</h1>
        <p className="text-sm text-muted-foreground mt-1">Guided tracks that take you from solo learner to confident team engineer.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-8">
        {paths.map(p => (
          <div key={p.title} className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">{p.level}</div>
                <h3 className="font-semibold mt-0.5">{p.title}</h3>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent">{p.duration}</span>
            </div>
            <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {p.steps.map((s, i) => (
                <li key={s} className="flex gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-semibold text-foreground">{i + 1}</span> {s}</li>
              ))}
            </ol>
            <button className="mt-4 w-full rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 inline-flex items-center justify-center gap-1"><Compass className="h-3 w-3" /> Start path</button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Suggested mentors</h2>
        <p className="text-xs text-muted-foreground mt-1">Matched to your stack, goals and timezone.</p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mentors.map(m => (
            <div key={m.id} className="rounded-lg border bg-background/40 p-4">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-semibold">{m.avatar}</div>
                <div>
                  <Link to="/collaboration/engineer/$id" params={{ id: m.id }} className="text-sm font-medium hover:underline">{m.name}</Link>
                  <p className="text-[11px] text-muted-foreground">{m.role} · Lead {m.leadership}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <button className="flex-1 text-xs rounded-md bg-primary px-2 py-1 text-primary-foreground hover:opacity-90">Request mentor</button>
                <button title="Chat" className="rounded-md border px-2 py-1 hover:bg-accent"><MessageSquare className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
