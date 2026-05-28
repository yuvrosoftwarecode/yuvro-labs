import { createFileRoute, Link } from "@tanstack/react-router";
import { engineers } from "@/lib/collab";
import { Search, Circle, MessageSquare, UserPlus, Bookmark } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/collaboration/marketplace")({ component: Marketplace });

function Marketplace() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const list = engineers.filter(e =>
    (!q || e.name.toLowerCase().includes(q.toLowerCase()) || e.stack.join(" ").toLowerCase().includes(q.toLowerCase())) &&
    (!role || e.role === role)
  );
  const roles = ["Frontend", "Backend", "QA", "DevOps", "Security"];

  return (
    <div className="px-6 py-6 max-w-[1500px]">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Engineering Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-1">{list.length} engineers available · matched on skills, reputation, and availability.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search engineer, stack..." className="pl-8 pr-3 py-2 text-sm rounded-md border bg-background w-72" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => setRole(null)} className={`text-xs px-3 py-1 rounded-full border ${!role ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>All Roles</button>
        {roles.map(r => (
          <button key={r} onClick={() => setRole(r)} className={`text-xs px-3 py-1 rounded-full border ${role === r ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>{r}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(e => (
          <div key={e.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary font-semibold">{e.avatar}</div>
                <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${e.availability === "Online" ? "bg-success" : e.availability === "Busy" ? "bg-destructive" : e.availability === "Idle" ? "bg-warning" : "bg-muted-foreground"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">{e.name}</h3>
                <p className="text-xs text-muted-foreground">{e.role} · {e.handle}</p>
              </div>
              {e.open && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/15 text-success">Open</span>}
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {e.stack.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-accent">{s}</span>)}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <Metric label="Collab" v={e.collab} />
              <Metric label="Reliability" v={e.reliability} />
              <Metric label="Support" v={e.support} />
              <Metric label="Sprints" v={e.sprintsCompleted} suffix="" />
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {e.badges.map(b => <span key={b} className="text-[10px] px-2 py-0.5 rounded-full border">{b}</span>)}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/collaboration/engineer/$id" params={{ id: e.id }} className="text-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">View Profile</Link>
              <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent flex items-center justify-center gap-1"><UserPlus className="h-3 w-3" /> Invite</button>
              <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent flex items-center justify-center gap-1"><MessageSquare className="h-3 w-3" /> Chat</button>
              <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent flex items-center justify-center gap-1"><Bookmark className="h-3 w-3" /> Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, v, suffix = "%" }: { label: string; v: number; suffix?: string }) {
  return (
    <div className="rounded-md border bg-background/50 px-2 py-1.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{v}{suffix}</div>
    </div>
  );
}
