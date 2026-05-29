import { createFileRoute, Link } from "@tanstack/react-router";
import { findSquad } from "@/lib/collab";
import { Trophy, Award, Share2, Download, Sparkles, Plus } from "lucide-react";

export const Route = createFileRoute("/collaboration/complete/$id")({ component: SprintComplete });

function SprintComplete() {
  const { id } = Route.useParams();
  const squad = findSquad(id) ?? { name: "Sprint", id } as any;

  return (
    <div className="px-6 py-10 max-w-[1100px] mx-auto">
      <div className="rounded-2xl border bg-gradient-to-br from-primary/15 via-card to-background p-8 relative overflow-hidden text-center">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <Trophy className="h-12 w-12 text-warning mx-auto" />
        <h1 className="text-3xl font-semibold mt-3">Sprint Complete</h1>
        <p className="text-muted-foreground mt-2">{squad.name} shipped on time. Here's your team's impact.</p>
        <div className="mt-6 inline-flex gap-2">
          <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground inline-flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> Share to network</button>
          <button className="rounded-md border px-4 py-2 text-sm hover:bg-accent inline-flex items-center gap-1"><Download className="h-3.5 w-3.5" /> Download certificate</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mt-6">
        <Metric label="Story Points" value="34" />
        <Metric label="PRs Merged" value="12" />
        <Metric label="Test Coverage" value="92%" />
        <Metric label="Incidents Resolved" value="2" />
        <Metric label="Avg Review Time" value="2.1h" />
        <Metric label="Team Grade" value="A" tone="text-success" />
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5">
        <h2 className="font-semibold flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Rewards Unlocked</h2>
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          <Reward title="+45 Reputation" sub="Collaboration, Reliability, Leadership" />
          <Reward title="Badge: Sprint Closer" sub="Shipped a sprint with zero rollbacks" />
          <Reward title="Badge: Strong Reviewer" sub="6 high-quality reviews this sprint" />
          <Reward title="Recruiter Boost" sub="Your profile is now visible to 12 hiring managers" />
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5">
        <h2 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> What's next</h2>
        <div className="mt-3 grid sm:grid-cols-3 gap-3">
          <Link to="/collaboration/retro/$id" params={{ id }} className="rounded-lg border p-4 hover:border-primary/40 bg-background/40">
            <div className="font-medium text-sm">Run Retrospective</div>
            <p className="text-xs text-muted-foreground mt-1">Reflect, give peer feedback, lock in learnings.</p>
          </Link>
          <Link to="/collaboration/create" className="rounded-lg border p-4 hover:border-primary/40 bg-background/40">
            <div className="font-medium text-sm inline-flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Start next sprint</div>
            <p className="text-xs text-muted-foreground mt-1">Re-form the squad or open it up to new teammates.</p>
          </Link>
          <Link to="/collaboration/reputation" className="rounded-lg border p-4 hover:border-primary/40 bg-background/40">
            <div className="font-medium text-sm">View reputation gains</div>
            <p className="text-xs text-muted-foreground mt-1">See how this sprint moved your engineering identity.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className={`text-2xl font-semibold ${tone ?? ""}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Reward({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-lg border bg-background/40 p-4">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
