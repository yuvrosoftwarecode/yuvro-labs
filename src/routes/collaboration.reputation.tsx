import { createFileRoute } from "@tanstack/react-router";
import { myReputation } from "@/lib/collab";
import { Shield, Star, TrendingUp, Award } from "lucide-react";

export const Route = createFileRoute("/collaboration/reputation")({ component: Reputation });

function Reputation() {
  const stats: [string, number, string][] = [
    ["Collaboration", myReputation.collab, "bg-primary"],
    ["Reliability", myReputation.reliability, "bg-success"],
    ["Support", myReputation.support, "bg-info"],
    ["Leadership", myReputation.leadership, "bg-warning"],
    ["Sprint Completion", myReputation.sprintCompletion, "bg-primary"],
  ];
  return (
    <div className="px-6 py-6 max-w-[1200px]">
      <h1 className="text-2xl font-semibold flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> My Reputation</h1>
      <p className="text-sm text-muted-foreground mt-1">Your collaboration profile — visible to teams, mentors, and recruiters.</p>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Engineering Scores</h3>
          <div className="space-y-4">
            {stats.map(([l, v, c]) => (
              <div key={l}>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{l}</span><span className="font-medium">{v}</span></div>
                <div className="h-2 bg-accent rounded-full overflow-hidden"><div className={`h-full ${c}`} style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-warning" /> Badges</h3>
          <div className="flex flex-wrap gap-2">
            {myReputation.badges.concat(["Team Mentor", "Incident Hero"]).map(b => (
              <span key={b} className="text-xs px-3 py-1.5 rounded-full border bg-accent/50 inline-flex items-center gap-1.5"><Star className="h-3 w-3 text-warning" />{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-success" /> Contribution Timeline</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>10:00 — API issue resolved in payments-api</li>
            <li>10:20 — PR #28 approved</li>
            <li>10:35 — Deployment failed in staging</li>
            <li>10:50 — Rollback successful</li>
            <li>11:10 — Reviewed PR #29 for Team Velocity</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3">Recruiter Visibility</h3>
          <p className="text-sm text-muted-foreground">Your engineering portfolio is exportable and visible to recruiters who match your stack and availability.</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90">Export Engineering Profile</button>
            <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent">Download Sprint Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
}
