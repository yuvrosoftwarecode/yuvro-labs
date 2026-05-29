import { createFileRoute, Link } from "@tanstack/react-router";
import { engineers } from "@/lib/collab";
import { Briefcase, Eye, MessageSquare, Bookmark, Filter, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/collaboration/recruiter")({ component: RecruiterPortal });

function RecruiterPortal() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const list = engineers.filter(e =>
    (!q || e.name.toLowerCase().includes(q.toLowerCase()) || e.stack.join(" ").toLowerCase().includes(q.toLowerCase())) &&
    (!role || e.role === role)
  );

  return (
    <div className="px-6 py-6 max-w-[1400px]">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Recruiter Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Verified engineering profiles backed by real sprint outcomes, peer reviews and incident response.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search stack, role, badge…" className="pl-8 pr-3 py-2 text-sm rounded-md border bg-background w-72" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <button onClick={() => setRole(null)} className={`text-xs px-3 py-1 rounded-full border ${!role ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>All</button>
        {["Frontend", "Backend", "QA", "DevOps", "Security"].map(r => (
          <button key={r} onClick={() => setRole(r)} className={`text-xs px-3 py-1 rounded-full border ${role === r ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>{r}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map(e => (
          <div key={e.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-sm font-semibold">{e.avatar}</div>
              <div className="flex-1 min-w-0">
                <Link to="/collaboration/engineer/$id" params={{ id: e.id }} className="font-semibold hover:underline">{e.name}</Link>
                <p className="text-xs text-muted-foreground">{e.role} · {e.sprintsCompleted} sprints shipped</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{e.handle}</p>
              </div>
              <button title="Save" className="text-muted-foreground hover:text-foreground"><Bookmark className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Mini label="Collab" v={e.collab} />
              <Mini label="Reliab" v={e.reliability} />
              <Mini label="Lead" v={e.leadership} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {e.stack.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/60">{s}</span>)}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {e.badges.map(b => <span key={b} className="text-[10px] px-1.5 py-0.5 rounded-full border bg-accent/30">{b}</span>)}
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/collaboration/engineer/$id" params={{ id: e.id }} className="flex-1 text-center rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 inline-flex items-center justify-center gap-1"><Eye className="h-3 w-3" /> View Profile</Link>
              <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-md border bg-background/40 p-2">
      <div className="text-sm font-semibold">{v}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
