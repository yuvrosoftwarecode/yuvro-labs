import { createFileRoute, Link } from "@tanstack/react-router";
import { squads } from "@/lib/collab";
import { Users2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/collaboration/squads")({ component: MySquads });

function MySquads() {
  const mine = squads.slice(0, 3);
  return (
    <div className="px-6 py-6 max-w-[1200px]">
      <h1 className="text-2xl font-semibold flex items-center gap-2"><Users2 className="h-5 w-5 text-primary" /> My Squads</h1>
      <p className="text-sm text-muted-foreground mt-1">Active sprints you're part of.</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {mine.map(s => (
          <div key={s.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-primary uppercase tracking-wider font-semibold">{s.type}</span>
                <h3 className="font-semibold mt-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.objective}</p>
              </div>
              <span className="text-xs text-muted-foreground">{s.progress}%</span>
            </div>
            <div className="mt-3 h-1.5 bg-accent rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${s.progress}%` }} /></div>
            <div className="mt-4 flex gap-2">
              <Link to="/collaboration/workspace/$id" params={{ id: s.id }} className="flex-1 text-center rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 inline-flex items-center justify-center gap-1">Open Workspace <ArrowRight className="h-3 w-3" /></Link>
              <Link to="/collaboration/squad/$id" params={{ id: s.id }} className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent">Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
