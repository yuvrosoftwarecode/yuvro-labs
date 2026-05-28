import { createFileRoute, Link } from "@tanstack/react-router";
import { engineers, squads, incidents, notifications, myReputation } from "@/lib/collab";
import { Activity, Bell, Sparkles, Users, AlertOctagon, GitPullRequest, Zap, ChevronRight, Circle } from "lucide-react";

export const Route = createFileRoute("/collaboration/")({ component: Dashboard });

function StatBar({ label, value, color = "bg-primary" }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>
      <div className="h-1.5 bg-accent rounded-full overflow-hidden"><div className={`h-full ${color}`} style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function Dashboard() {
  const recommended = squads.slice(0, 2);
  const trending = squads.slice(1, 4);
  const online = engineers.filter(e => e.availability === "Online");

  return (
    <div className="px-6 py-6 grid grid-cols-12 gap-6 max-w-[1500px]">
      {/* Hero */}
      <div className="col-span-12 rounded-xl border bg-gradient-to-br from-primary/10 via-card to-background p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back, Alex</h1>
            <p className="text-sm text-muted-foreground mt-1">Your engineering presence is <span className="text-primary font-medium">Open to collaborate</span> · 3 squads recommended for you today.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/collaboration/create" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Create Squad</Link>
            <Link to="/collaboration/marketplace" className="rounded-md border px-4 py-2 text-sm hover:bg-accent">Find Teammates</Link>
            <Link to="/collaboration/discover" className="rounded-md border px-4 py-2 text-sm hover:bg-accent">Join Sprint</Link>
          </div>
        </div>
      </div>

      {/* Center feed */}
      <section className="col-span-12 lg:col-span-8 space-y-6">
        <Panel title="Recommended Squads" icon={Sparkles} action={<Link to="/collaboration/discover" className="text-xs text-primary inline-flex items-center gap-1">Browse all <ChevronRight className="h-3 w-3" /></Link>}>
          <div className="grid sm:grid-cols-2 gap-3">
            {recommended.map((s) => (
              <Link key={s.id} to="/collaboration/squad/$id" params={{ id: s.id }} className="rounded-lg border p-4 hover:border-primary/40 transition block bg-background/40">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-primary font-medium">{s.type}</div>
                    <h4 className="font-semibold mt-0.5">{s.name}</h4>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent">{s.difficulty}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.objective}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {s.members.length}/{s.members.length + s.missing.length}</span>
                  <span>·</span>
                  <span>Needs {s.missing.join(", ")}</span>
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Live Sprint Activity" icon={Activity}>
          <ul className="space-y-3 text-sm">
            <Activ icon="commit" text="Rohith pushed 3 commits to feature/checkout-v2" time="2m" />
            <Activ icon="review" text="Anjali approved PR #29 in Team Velocity" time="6m" />
            <Activ icon="incident" text="SEV1 incident opened on payments-api" time="12m" />
            <Activ icon="qa" text="Meera reported regression in ENG-104" time="18m" />
            <Activ icon="deploy" text="Dev triggered canary deploy to staging" time="25m" />
          </ul>
        </Panel>

        <Panel title="Active Incident Rooms" icon={AlertOctagon} action={<Link to="/collaboration/incidents" className="text-xs text-primary">View all</Link>}>
          <div className="space-y-2">
            {incidents.slice(0, 2).map(i => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${i.severity === "SEV1" ? "bg-destructive/15 text-destructive" : i.severity === "SEV2" ? "bg-warning/15 text-warning" : "bg-accent"}`}>{i.severity}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{i.title}</p>
                    <p className="text-xs text-muted-foreground">{i.service} · {i.startedAt} · {i.responders.length} responders</p>
                  </div>
                </div>
                <Link to="/collaboration/incidents" className="text-xs rounded-md bg-primary px-3 py-1.5 text-primary-foreground">Join</Link>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Trending Squads" icon={Zap}>
          <div className="space-y-2">
            {trending.map(s => (
              <Link key={s.id} to="/collaboration/squad/$id" params={{ id: s.id }} className="flex items-center justify-between rounded-md border p-3 hover:bg-accent/40">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.stack.join(" · ")}</p>
                </div>
                <span className="text-xs text-muted-foreground">Rep {s.reputation}</span>
              </Link>
            ))}
          </div>
        </Panel>
      </section>

      {/* Right column */}
      <aside className="col-span-12 lg:col-span-4 space-y-6">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Engineering Identity</h3>
            <span className="flex items-center gap-1 text-[11px] text-success"><Circle className="h-2 w-2 fill-success text-success" /> {myReputation.availability}</span>
          </div>
          <div className="mt-4 space-y-3">
            <StatBar label="Collaboration" value={myReputation.collab} />
            <StatBar label="Reliability" value={myReputation.reliability} color="bg-success" />
            <StatBar label="Support" value={myReputation.support} color="bg-info" />
            <StatBar label="Leadership" value={myReputation.leadership} color="bg-warning" />
            <StatBar label="Sprint Completion" value={myReputation.sprintCompletion} />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {myReputation.badges.map(b => (
              <span key={b} className="text-[10px] px-2 py-0.5 rounded-full border bg-accent/50">{b}</span>
            ))}
          </div>
          <Link to="/collaboration/reputation" className="mt-4 inline-flex text-xs text-primary items-center gap-1">View full reputation <ChevronRight className="h-3 w-3" /></Link>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Bell className="h-3.5 w-3.5" /> Notifications</h3>
            <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5">{notifications.length}</span>
          </div>
          <ul className="space-y-2.5">
            {notifications.slice(0, 5).map(n => (
              <li key={n.id} className="text-xs flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{n.text}</p>
                  <span className="text-muted-foreground text-[10px]">{n.time} ago</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Live Presence</h3>
          <div className="space-y-2.5">
            {online.slice(0, 5).map(e => (
              <div key={e.id} className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-accent text-[10px] font-semibold">{e.avatar}</div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success border border-card" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{e.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{e.role} · editing api/auth.ts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Panel({ title, icon: Icon, action, children }: any) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-sm flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /> {title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Activ({ icon, text, time }: { icon: string; text: string; time: string }) {
  const Map: Record<string, any> = { commit: GitPullRequest, review: GitPullRequest, incident: AlertOctagon, qa: Activity, deploy: Zap };
  const Icon = Map[icon] ?? Activity;
  return (
    <li className="flex items-start gap-3">
      <div className="grid h-7 w-7 place-items-center rounded-full bg-accent shrink-0"><Icon className="h-3.5 w-3.5" /></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{text}</p>
        <span className="text-xs text-muted-foreground">{time} ago</span>
      </div>
    </li>
  );
}
