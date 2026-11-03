import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { ACTIONS, getWarRoom, type ActionId } from "@/lib/sreWarRooms";

export const Route = createFileRoute("/war-room/$slug")({ component: WarRoomPage });

const ORANGE = "#f7931e";

function WarRoomPage() {
  const { slug } = Route.useParams();
  const room = getWarRoom(slug);
  const [idx, setIdx] = useState(0);
  const [sla, setSla] = useState(100);
  const [score, setScore] = useState(0);
  const [budget, setBudget] = useState(1000);
  const [elapsed, setElapsed] = useState(0);
  const [hints, setHints] = useState(true);
  const [log, setLog] = useState<string[]>([]);
  const [tried, setTried] = useState<ActionId[]>([]);

  const total = room?.incidents.length ?? 0;
  const done = idx >= total || sla <= 0;

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setElapsed((e) => e + 1);
      setSla((s) => Math.max(0, +(s - 0.25).toFixed(2)));
    }, 1000);
    return () => clearInterval(t);
  }, [done]);

  const incident = room?.incidents[idx];
  const metrics = useMemo(() => {
    const m: Record<string, { err: number; cpu: number }> = {};
    room?.services.forEach((s, i) => {
      const critical = !done && incident?.service === s.key;
      m[s.key] = critical ? { err: 30 + tried.length * 8, cpu: 70 + ((elapsed * 3) % 25) } : { err: 0, cpu: (i * 3 + elapsed) % 9 };
    });
    return m;
  }, [room, incident, elapsed, done, tried.length]);

  if (!room) {
    return (
      <div className="min-h-screen"><TopNav />
        <main className="mx-auto max-w-[900px] px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">War room not found.</p>
          <Link to="/dashboard" className="mt-4 inline-block text-sm underline">Back to Simulation Labs</Link>
        </main>
      </div>
    );
  }

  const act = (id: ActionId, cost: number) => {
    if (done || !incident || budget < cost) return;
    setBudget((b) => b - cost);
    const label = ACTIONS.find((a) => a.id === id)!.label;
    if (id === incident.fix) {
      const pts = Math.max(50, 200 - tried.length * 50);
      setScore((s) => s + pts);
      setLog((l) => [`✓ ${incident.title}: ${label} resolved it (+${pts})`, ...l]);
      setTried([]);
      setIdx((i) => i + 1);
    } else {
      setSla((s) => Math.max(0, s - 6));
      setTried((t) => [...t, id]);
      setLog((l) => [`✗ ${incident.title}: ${label} did not help (−6% SLA)`, ...l]);
    }
  };

  const reset = () => { setIdx(0); setSla(100); setScore(0); setBudget(1000); setElapsed(0); setLog([]); setTried([]); };
  const fmt = `${Math.floor(elapsed / 60)}m ${String(elapsed % 60).padStart(2, "0")}s`;
  const slaColor = sla > 70 ? "hsl(var(--success))" : sla > 40 ? ORANGE : "hsl(var(--destructive))";

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground"><Link to="/dashboard" className="hover:underline">Simulation Labs</Link> · SRE · {room.domain}</p>
            <h1 className="mt-1 text-2xl font-semibold">{room.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Respond to {total} production incidents before your SLA burns to zero.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setHints((h) => !h)} className="rounded-md border px-3 py-1.5 text-xs font-medium" style={hints ? { borderColor: ORANGE, color: ORANGE } : undefined}>Hints {hints ? "on" : "off"}</button>
            <button onClick={reset} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent/50">New game</button>
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-card">
          <div className="p-4">
            <div className="flex justify-between text-xs"><span className="uppercase tracking-wide text-muted-foreground">SLA</span><span className="font-mono" style={{ color: slaColor }}>{Math.round(sla)}%</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full transition-all" style={{ width: `${sla}%`, background: slaColor }} /></div>
          </div>
          <div className="grid grid-cols-4 border-t divide-x text-center">
            {[[`${Math.min(idx + 1, total)} / ${total}`, "Incident"], [score.toLocaleString(), "Score"], [`$${budget}`, "Budget"], [fmt, "Elapsed"]].map(([v, l]) => (
              <div key={l} className="py-3"><div className="font-mono text-base">{v}</div><div className="text-[10px] uppercase tracking-wide text-muted-foreground">{l}</div></div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 content-start">
            {room.services.map((s) => {
              const m = metrics[s.key];
              const critical = m.err > 0;
              return (
                <div key={s.key} className="rounded-xl border bg-card p-4" style={critical ? { borderColor: ORANGE } : undefined}>
                  <div className="text-[10px] font-medium uppercase tracking-wide" style={{ color: critical ? ORANGE : "hsl(var(--success))" }}>● {critical ? "Critical" : "Healthy"}</div>
                  <div className="mt-2 text-sm font-medium truncate">{s.label}</div>
                  {[["ERR", m.err], ["CPU", m.cpu]].map(([k, v]) => (
                    <div key={k as string} className="mt-2">
                      <div className="flex justify-between text-[10px] text-muted-foreground"><span>{k}</span><span>{v}%</span></div>
                      <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden"><div className="h-full" style={{ width: `${v}%`, background: k === "ERR" ? "hsl(var(--destructive))" : "hsl(var(--primary))" }} /></div>
                    </div>
                  ))}
                  <div className="mt-2 font-mono text-[11px] text-muted-foreground">p99 {critical ? s.p99 * 12 : s.p99}ms</div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4">
              {done ? (
                <>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{sla <= 0 ? "SLA breached" : "All incidents resolved"}</p>
                  <h3 className="mt-1 font-semibold">{sla <= 0 ? "The pager wins this time" : "Production is stable"}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Final score {score} · SLA {Math.round(sla)}% · ${budget} left · {fmt}</p>
                  <button onClick={reset} className="mt-4 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">Play again</button>
                </>
              ) : incident && (
                <>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Active incident — {incident.id}</p>
                  <h3 className="mt-1 font-semibold">{incident.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{incident.story}</p>
                  {hints && (
                    <div className="mt-3 border-l-2 pl-3" style={{ borderColor: ORANGE }}>
                      <p className="text-[10px] uppercase tracking-wide" style={{ color: ORANGE }}>Hint</p>
                      <p className="text-sm text-muted-foreground">{incident.hint}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="rounded-xl border bg-card p-4">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Response actions</p>
              <div className="mt-3 space-y-2">
                {ACTIONS.map((a) => (
                  <button key={a.id} disabled={done || budget < a.cost || tried.includes(a.id)} onClick={() => act(a.id, a.cost)}
                    className="w-full flex justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent/50 disabled:opacity-40 disabled:cursor-not-allowed">
                    <span>{a.label}</span><span className="font-mono text-xs" style={{ color: ORANGE }}>${a.cost}</span>
                  </button>
                ))}
              </div>
            </div>

            {log.length > 0 && (
              <div className="rounded-xl border bg-card p-4">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Incident log</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">{log.slice(0, 8).map((l, i) => <li key={i}>{l}</li>)}</ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
