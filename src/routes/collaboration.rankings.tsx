import { createFileRoute } from "@tanstack/react-router";
import { squads } from "@/lib/collab";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/collaboration/rankings")({ component: Rankings });

function Rankings() {
  const sorted = [...squads].sort((a, b) => b.reputation - a.reputation);
  return (
    <div className="px-6 py-6 max-w-[1100px]">
      <h1 className="text-2xl font-semibold flex items-center gap-2"><Trophy className="h-5 w-5 text-warning" /> Team Rankings</h1>
      <p className="text-sm text-muted-foreground mt-1">Top squads ranked by reputation, velocity, and sprint completion.</p>

      <div className="mt-6 rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-3">Rank</th><th className="text-left p-3">Squad</th>
              <th className="text-left p-3">Type</th><th className="text-right p-3">Velocity</th>
              <th className="text-right p-3">Reputation</th><th className="text-right p-3">Progress</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={s.id} className="border-t hover:bg-accent/30">
                <td className="p-3 font-semibold">{i + 1}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3 text-muted-foreground">{s.type}</td>
                <td className="p-3 text-right">{s.velocity}</td>
                <td className="p-3 text-right">{s.reputation}</td>
                <td className="p-3 text-right">{s.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
