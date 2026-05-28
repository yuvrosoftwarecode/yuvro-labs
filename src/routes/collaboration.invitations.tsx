import { createFileRoute } from "@tanstack/react-router";
import { invitations, joinRequests, findEngineer, findSquad } from "@/lib/collab";
import { Check, X, MessageSquare, Mail } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/collaboration/invitations")({ component: Invitations });

function Invitations() {
  const [tab, setTab] = useState<"received" | "requests">("received");
  return (
    <div className="px-6 py-6 max-w-[1100px]">
      <h1 className="text-2xl font-semibold flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Invitations</h1>
      <p className="text-sm text-muted-foreground mt-1">Manage incoming invites and squad join requests.</p>

      <div className="mt-5 flex gap-1 border-b">
        {(["received", "requests"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm border-b-2 capitalize ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>
            {t === "received" ? "Invitations Received" : "Join Requests to my Squads"}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {tab === "received" && invitations.map(i => {
          const from = findEngineer(i.from)!; const sq = findSquad(i.squad)!;
          return (
            <Card key={i.id}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-xs font-semibold">{from.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm"><b>{from.name}</b> invited you to <b>{sq.name}</b> as <b>{i.role}</b></p>
                  <p className="text-xs text-muted-foreground mt-1">"{i.message}"</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{i.time} ago</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 inline-flex items-center gap-1"><Check className="h-3 w-3" /> Accept</button>
                  <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Chat</button>
                  <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent inline-flex items-center gap-1"><X className="h-3 w-3" /> Reject</button>
                </div>
              </div>
            </Card>
          );
        })}
        {tab === "requests" && joinRequests.map(r => {
          const from = findEngineer(r.from)!; const sq = findSquad(r.squad)!;
          return (
            <Card key={r.id}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-xs font-semibold">{from.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm"><b>{from.name}</b> wants to join <b>{sq.name}</b> as <b>{r.role}</b></p>
                  <p className="text-xs text-muted-foreground mt-1">"{r.note}"</p>
                  <div className="text-[11px] text-muted-foreground mt-2 flex gap-3">
                    <span>Collab {from.collab}</span><span>Reliability {from.reliability}</span><span>Support {from.support}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 inline-flex items-center gap-1"><Check className="h-3 w-3" /> Accept</button>
                  <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent">Chat First</button>
                  <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent inline-flex items-center gap-1"><X className="h-3 w-3" /> Reject</button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border bg-card p-4">{children}</div>;
}
