import { createFileRoute } from "@tanstack/react-router";
import { incidents, engineers } from "@/lib/collab";
import { AlertOctagon, Activity, Server, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/collaboration/incidents")({ component: Incidents });

function sevColor(s: string) {
  return s === "SEV1" ? "bg-destructive/15 text-destructive border-destructive/30"
    : s === "SEV2" ? "bg-warning/15 text-warning border-warning/30"
    : "bg-accent text-muted-foreground border-border";
}

function Incidents() {
  return (
    <div className="px-6 py-6 max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2"><AlertOctagon className="h-5 w-5 text-destructive" /> Incident Rooms</h1>
        <p className="text-sm text-muted-foreground mt-1">Live engineering incidents — coordinate backend fixes, scaling, QA validation, and frontend fallback.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <Stat icon={Activity} label="Active" v="2" tone="text-destructive" />
        <Stat icon={Server} label="Mitigating" v="1" tone="text-warning" />
        <Stat icon={ShieldAlert} label="Resolved (24h)" v="7" tone="text-success" />
      </div>

      <div className="space-y-3">
        {incidents.map(i => {
          const resp = engineers.filter(e => i.responders.includes(e.id));
          return (
            <div key={i.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-start gap-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${sevColor(i.severity)}`}>{i.severity}</span>
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground">{i.id}</div>
                    <h3 className="font-semibold">{i.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Service: <span className="text-foreground">{i.service}</span> · Started {i.startedAt} · Status <span className={i.status === "Resolved" ? "text-success" : i.status === "Mitigating" ? "text-warning" : "text-destructive"}>{i.status}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {resp.map(r => (
                      <div key={r.id} title={r.name} className="grid h-7 w-7 place-items-center rounded-full bg-accent text-[10px] font-semibold border-2 border-card">{r.avatar}</div>
                    ))}
                  </div>
                  {i.status !== "Resolved" && (
                    <button className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90">Join Room</button>
                  )}
                </div>
              </div>

              {i.status !== "Resolved" && (
                <div className="mt-4 grid md:grid-cols-4 gap-2 text-xs">
                  <Lane title="Error Logs" items={["5xx spike 4× baseline", "p99 latency 2.4s", "DB connections saturated"]} />
                  <Lane title="Traffic" items={["+38% RPS", "Region: us-east-1", "Customer impact: high"]} />
                  <Lane title="Backend Actions" items={["Rollback v2.4.1", "Increase pool size", "Add circuit breaker"]} />
                  <Lane title="Recovery" items={["DevOps scaling +4 pods", "QA validating fix", "Frontend fallback ON"]} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon: I, label, v, tone }: any) {
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
      <div className={`grid h-9 w-9 place-items-center rounded-md bg-accent ${tone}`}><I className="h-4 w-4" /></div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xl font-semibold">{v}</div>
      </div>
    </div>
  );
}

function Lane({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border bg-background/40 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">{title}</div>
      <ul className="space-y-1">
        {items.map(i => <li key={i} className="text-muted-foreground">· {i}</li>)}
      </ul>
    </div>
  );
}
