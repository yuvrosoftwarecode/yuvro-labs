import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Users, GitPullRequest, AlertOctagon, MessageSquare, Shield, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/collaboration/handbook")({ component: Handbook });

const sections = [
  {
    icon: Users, title: "How squads work",
    body: [
      "A squad is a small cross-functional team that owns a sprint goal end-to-end.",
      "Every squad has a clear objective, a duration, and well-defined roles (Frontend, Backend, QA, DevOps, Security).",
      "You can join a public squad, be invited, or create your own and assemble the team.",
    ],
  },
  {
    icon: GitPullRequest, title: "Sprint rituals",
    body: [
      "Kickoff: align on the goal, scope, and Definition of Done.",
      "Daily sync: 10-minute async standup in team chat (yesterday, today, blockers).",
      "Reviews: aim for <4h turnaround. Be specific, kind, and concrete.",
      "Demo + retro: close every sprint with a demo and a retrospective.",
    ],
  },
  {
    icon: AlertOctagon, title: "Incident response basics",
    body: [
      "First responder declares severity (SEV1–SEV3) and opens an incident room.",
      "Assign roles immediately: Incident Commander, Comms, Scribe.",
      "Mitigate first, root-cause after. Write a blameless postmortem within 48h.",
    ],
  },
  {
    icon: MessageSquare, title: "Giving great peer feedback",
    body: [
      "Be specific: cite the PR, ticket, or moment.",
      "Separate the work from the person.",
      "Pair every piece of critical feedback with a concrete suggestion.",
    ],
  },
  {
    icon: Shield, title: "Reputation & how it's earned",
    body: [
      "Collaboration: chat engagement, helpful reviews, unblocking teammates.",
      "Reliability: shipping committed work, meeting review SLAs, on-time standups.",
      "Leadership: facilitating, mentoring juniors, owning incident comms.",
      "Reputation only goes up through verified sprint outcomes and peer signals.",
    ],
  },
];

function Handbook() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Collaboration Handbook</h1>
      <p className="text-sm text-muted-foreground mt-1">Best practices for working in squads, running sprints, and building a strong engineering reputation.</p>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <Quick title="New here?" body="Read 'How squads work' first, then join a Beginner squad." />
        <Quick title="In a sprint?" body="Skim 'Sprint rituals' before kickoff." />
        <Quick title="On-call?" body="Bookmark 'Incident response basics'." />
      </div>

      <div className="mt-6 rounded-xl border bg-card divide-y">
        {sections.map((s, i) => {
          const Icon = s.icon;
          const isOpen = open === i;
          return (
            <div key={s.title}>
              <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/30">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-accent text-primary"><Icon className="h-4 w-4" /></div>
                <span className="flex-1 font-medium text-sm">{s.title}</span>
                <span className="text-xs text-muted-foreground">{isOpen ? "Hide" : "Read"}</span>
              </button>
              {isOpen && (
                <ul className="px-5 pb-5 space-y-2 text-sm text-muted-foreground">
                  {s.body.map((b, j) => (
                    <li key={j} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" /> <span>{b}</span></li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Quick({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-sm font-medium">{title}</div>
      <p className="text-xs text-muted-foreground mt-1">{body}</p>
    </div>
  );
}
