import { createFileRoute, Link } from "@tanstack/react-router";
import { squads } from "@/lib/collab";
import { Users, Search, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/collaboration/discover")({ component: Discover });

function Discover() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const list = squads.filter(s =>
    (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.stack.join(" ").toLowerCase().includes(q.toLowerCase())) &&
    (!filter || s.type === filter || s.difficulty === filter)
  );
  const filters = ["Beginner", "Intermediate", "Advanced", "Production Bug", "Security Incident", "Startup Sprint"];

  return (
    <div className="px-6 py-6 max-w-[1500px]">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Discover Squads</h1>
          <p className="text-sm text-muted-foreground mt-1">Find a team that needs your skills.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search stack, sprint..." className="pl-8 pr-3 py-2 text-sm rounded-md border bg-background w-64" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <button onClick={() => setFilter(null)} className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${!filter ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>All</button>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${filter === f ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>{f}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(s => (
          <div key={s.id} className="rounded-xl border bg-card p-5 hover:border-primary/40 transition">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">{s.type}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent">{s.difficulty}</span>
            </div>
            <h3 className="font-semibold">{s.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.objective}</p>

            <div className="mt-3 flex flex-wrap gap-1">
              {s.stack.map(st => <span key={st} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/60">{st}</span>)}
            </div>

            <div className="mt-3 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between"><span>Filled</span><span>{s.filled.join(", ")}</span></div>
              <div className="flex justify-between"><span>Missing</span><span className="text-warning">{s.missing.join(", ")}</span></div>
              <div className="flex justify-between"><span>Duration</span><span>{s.duration}</span></div>
              <div className="flex justify-between"><span>Reputation</span><span>{s.reputation}</span></div>
            </div>

            <div className="mt-3 h-1.5 bg-accent rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${s.progress}%` }} />
            </div>

            <div className="mt-4 flex gap-2">
              <Link to="/collaboration/squad/$id" params={{ id: s.id }} className="flex-1 text-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">View Squad</Link>
              <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent">Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
