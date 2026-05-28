import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findSquad, engineers, tickets } from "@/lib/collab";
import { Users, Clock, GitBranch, MessageSquare, ArrowRight, Activity, Shield } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/collaboration/squad/$id")({
  component: SquadDetails,
  loader: ({ params }) => {
    const s = findSquad(params.id);
    if (!s) throw notFound();
    return { squad: s };
  },
});

function SquadDetails() {
  const { squad } = Route.useLoaderData();
  const [showJoin, setShowJoin] = useState(false);
  const members = engineers.filter(e => squad.members.includes(e.id));

  return (
    <div className="px-6 py-6 max-w-[1400px]">
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-card to-background p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">{squad.type}</span>
            <h1 className="text-2xl font-semibold mt-1">{squad.name}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{squad.objective}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {squad.stack.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-accent">{s}</span>)}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowJoin(true)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Request to Join</button>
            <button className="rounded-md border px-4 py-2 text-sm hover:bg-accent inline-flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Chat With Team</button>
            <Link to="/collaboration/workspace/$id" params={{ id: squad.id }} className="rounded-md border px-4 py-2 text-sm hover:bg-accent inline-flex items-center gap-1.5">Open Workspace <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Team</h3>
          <ul className="space-y-2.5">
            {members.map(m => (
              <li key={m.id} className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-semibold">{m.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t">
            <p className="text-[11px] text-muted-foreground mb-2">Missing Roles</p>
            <div className="flex flex-wrap gap-1">
              {squad.missing.map(r => <span key={r} className="text-[10px] px-2 py-0.5 rounded-full border border-warning/50 text-warning">{r}</span>)}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Sprint Timeline</h3>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{squad.duration}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Difficulty</span><span>{squad.difficulty}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Visibility</span><span>{squad.visibility}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Progress</span><span>{squad.progress}%</span></li>
          </ul>
          <div className="mt-3 h-1.5 bg-accent rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${squad.progress}%` }} /></div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Team Analytics</h3>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between"><span className="text-muted-foreground">Sprint Velocity</span><span>{squad.velocity} pts</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Collaboration</span><span>{squad.reputation}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Reliability trend</span><span className="text-success">↑ 4%</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Open PRs</span><span>3</span></li>
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><GitBranch className="h-4 w-4 text-primary" /> Current Tickets</h3>
        <div className="space-y-2">
          {tickets.slice(0, 5).map(t => (
            <div key={t.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                <span className="truncate">{t.title}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded ${t.priority === "Critical" ? "bg-destructive/15 text-destructive" : t.priority === "High" ? "bg-warning/15 text-warning" : "bg-accent"}`}>{t.priority}</span>
                <span className="text-muted-foreground">{t.column}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showJoin && <JoinModal close={() => setShowJoin(false)} />}
    </div>
  );
}

function JoinModal({ close }: { close: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center px-4" onClick={close}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Request to Join</h3>
        <p className="text-xs text-muted-foreground mt-1">Tell the squad why you're a fit.</p>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block">Preferred Role</label>
            <select className="w-full rounded-md border bg-background px-3 py-2 text-sm"><option>Backend</option><option>Frontend</option><option>QA</option><option>DevOps</option></select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Introduction Message</label>
            <textarea rows={4} placeholder="Backend developer experienced in Spring Boot and SQL optimization." className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={close} className="rounded-md border px-4 py-2 text-sm hover:bg-accent">Cancel</button>
          <button onClick={close} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">Send Request</button>
        </div>
      </div>
    </div>
  );
}
