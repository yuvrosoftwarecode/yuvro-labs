import { createFileRoute } from "@tanstack/react-router";
import { engineers } from "@/lib/collab";
import { GitMerge, Mic, Video } from "lucide-react";

export const Route = createFileRoute("/collaboration/pair")({ component: Pair });

function Pair() {
  const online = engineers.filter(e => e.availability === "Online");
  return (
    <div className="px-6 py-6 max-w-[1200px]">
      <h1 className="text-2xl font-semibold flex items-center gap-2"><GitMerge className="h-5 w-5 text-primary" /> Pair Programming</h1>
      <p className="text-sm text-muted-foreground mt-1">Jump into a shared editor with a partner — voice, code, debug together.</p>

      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {online.map(e => (
          <div key={e.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-xs font-semibold">{e.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{e.name}</p>
                <p className="text-[11px] text-muted-foreground">{e.role} · {e.stack.slice(0, 2).join(", ")}</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-success" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 inline-flex items-center justify-center gap-1"><GitMerge className="h-3 w-3" /> Pair Now</button>
              <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent inline-flex items-center justify-center gap-1"><Mic className="h-3 w-3" /> Voice</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
