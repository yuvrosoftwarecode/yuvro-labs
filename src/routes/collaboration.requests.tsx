import { createFileRoute, Link } from "@tanstack/react-router";
import { squads } from "@/lib/collab";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/collaboration/requests")({ component: OpenRequests });

function OpenRequests() {
  const open = squads.filter(s => s.missing.length > 0);
  return (
    <div className="px-6 py-6 max-w-[1200px]">
      <h1 className="text-2xl font-semibold flex items-center gap-2"><Inbox className="h-5 w-5 text-primary" /> Open Engineering Requests</h1>
      <p className="text-sm text-muted-foreground mt-1">Squads currently looking for engineers.</p>

      <div className="mt-6 space-y-3">
        {open.map(s => (
          <div key={s.id} className="rounded-xl border bg-card p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase text-primary font-semibold">{s.type}</div>
              <h3 className="font-semibold truncate">{s.name}</h3>
              <p className="text-xs text-muted-foreground">Looking for: {s.missing.join(" · ")}</p>
            </div>
            <Link to="/collaboration/squad/$id" params={{ id: s.id }} className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90">View & Request</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
