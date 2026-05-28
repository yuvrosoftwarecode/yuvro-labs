import { createFileRoute } from "@tanstack/react-router";
import { engineers } from "@/lib/collab";
import { Radio, FileCode2 } from "lucide-react";

export const Route = createFileRoute("/collaboration/live")({ component: Live });

const activities = [
  ["Anjali R.", "reviewing PR #18 in payments-api"],
  ["Rohith K.", "editing checkout/Summary.tsx"],
  ["Meera S.", "running E2E suite on staging"],
  ["Dev P.", "scaling auth-svc to 8 pods"],
  ["Liam K.", "debugging retry queue locally"],
];

function Live() {
  return (
    <div className="px-6 py-6 max-w-[1100px]">
      <h1 className="text-2xl font-semibold flex items-center gap-2"><Radio className="h-5 w-5 text-success" /> Live Presence</h1>
      <p className="text-sm text-muted-foreground mt-1">See who's coding, reviewing, debugging — in real time across your network.</p>

      <div className="mt-6 rounded-xl border bg-card divide-y">
        {activities.map(([n, a], i) => {
          const e = engineers[i % engineers.length];
          return (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="relative">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-semibold">{e.avatar}</div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-card" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><FileCode2 className="h-3 w-3" /> {a}</p>
              </div>
              <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent">Join</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
