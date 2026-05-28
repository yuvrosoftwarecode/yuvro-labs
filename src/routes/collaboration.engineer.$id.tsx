import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEngineer } from "@/lib/collab";
import { ArrowLeft, MessageSquare, UserPlus, GitMerge, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/collaboration/engineer/$id")({
  component: EngineerProfile,
  loader: ({ params }) => {
    const e = findEngineer(params.id);
    if (!e) throw notFound();
    return { engineer: e };
  },
});

function EngineerProfile() {
  const { engineer: e } = Route.useLoaderData();
  const [tab, setTab] = useState<"overview" | "sprints" | "contrib" | "reviews" | "incidents" | "support" | "achievements">("overview");

  return (
    <div className="px-6 py-6 max-w-[1300px]">
      <Link to="/collaboration/marketplace" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"><ArrowLeft className="h-3 w-3" /> Back to marketplace</Link>

      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-card to-background p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-primary text-primary-foreground text-2xl font-semibold">{e.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold">{e.name}</h1>
              {e.open && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/15 text-success">Open to collaborate</span>}
            </div>
            <p className="text-sm text-muted-foreground">{e.role} Engineer · {e.handle}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {e.stack.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-accent">{s}</span>)}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {e.badges.map(b => <span key={b} className="text-[11px] px-2 py-0.5 rounded-full border bg-card flex items-center gap-1"><Star className="h-2.5 w-2.5 text-warning" />{b}</span>)}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 inline-flex items-center gap-1.5"><UserPlus className="h-3.5 w-3.5" /> Invite to Squad</button>
            <button className="rounded-md border px-3 py-2 text-xs hover:bg-accent inline-flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Message</button>
            <button className="rounded-md border px-3 py-2 text-xs hover:bg-accent inline-flex items-center gap-1.5"><GitMerge className="h-3.5 w-3.5" /> Pair</button>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          ["Collaboration", e.collab], ["Reliability", e.reliability], ["Support", e.support], ["Leadership", e.leadership]
        ].map(([l, v]) => (
          <div key={l as string} className="rounded-xl border bg-card p-4">
            <div className="text-xs text-muted-foreground">{l}</div>
            <div className="text-2xl font-semibold mt-1">{v}</div>
            <div className="mt-2 h-1 bg-accent rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${v}%` }} /></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b overflow-x-auto">
        {(["overview", "sprints", "contrib", "reviews", "incidents", "support", "achievements"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-sm border-b-2 transition whitespace-nowrap ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t === "contrib" ? "Contributions" : t === "incidents" ? "Incidents" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-5 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-sm mb-3 capitalize">{tab}</h3>
          {tab === "overview" && (
            <p className="text-sm text-muted-foreground">{e.name} has completed {e.sprintsCompleted} sprints with consistently high reliability. Frequently joins {e.role.toLowerCase()} squads and is well-regarded for support actions and PR reviews.</p>
          )}
          {tab === "sprints" && (
            <ul className="space-y-2 text-sm">
              {["Team Velocity", "Payments Strike", "Onboarding Squad"].map(s => (
                <li key={s} className="flex justify-between border-b pb-2 last:border-0"><span>{s}</span><span className="text-xs text-success">Completed</span></li>
              ))}
            </ul>
          )}
          {tab === "contrib" && <p className="text-sm text-muted-foreground">142 commits · 38 PRs · 26 reviews · 9 incident participations this quarter.</p>}
          {tab === "reviews" && <p className="text-sm text-muted-foreground">"Sharp reviewer, catches edge cases early." — Anjali R.</p>}
          {tab === "incidents" && <p className="text-sm text-muted-foreground">Participated in 4 SEV1 and 7 SEV2 incidents. Average MTTR contribution: 18 min.</p>}
          {tab === "support" && <p className="text-sm text-muted-foreground">Mentored 12 engineers. Resolved 23 blockers across squads.</p>}
          {tab === "achievements" && (
            <div className="flex flex-wrap gap-2">{e.badges.map(b => <span key={b} className="text-xs px-3 py-1 rounded-full border bg-accent/50">{b}</span>)}</div>
          )}
        </div>
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-sm mb-3">Contribution Metrics</h3>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between"><span className="text-muted-foreground">PR reviews</span><span>26</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Bugs resolved</span><span>41</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Tickets done</span><span>89</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Support actions</span><span>34</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Incident participation</span><span>11</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
