import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findSquad, tickets, engineers } from "@/lib/collab";
import { useState } from "react";
import { ArrowLeft, GitBranch, Bell, MessageSquare, Sparkles, Terminal, Play, AlertOctagon, Users, FileCode2, Bug, CheckCircle2, XCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/collaboration/workspace/$id")({
  component: Workspace,
  loader: ({ params }) => {
    const s = findSquad(params.id);
    if (!s) throw notFound();
    return { squad: s };
  },
});

const cols = ["Todo", "In Progress", "Review", "QA", "Deployment", "Done", "Blocked"] as const;

function Workspace() {
  const { squad } = Route.useLoaderData();
  const [leftTab, setLeftTab] = useState<"board" | "tickets" | "mentions" | "git">("board");
  const [rightTab, setRightTab] = useState<"chat" | "ai" | "prs" | "analytics">("chat");
  const [bottomTab, setBottomTab] = useState<"logs" | "tests" | "ci" | "errors">("logs");
  const [openTicket, setOpenTicket] = useState<string | null>(null);

  const ticket = openTicket ? tickets.find(t => t.id === openTicket) : null;
  const members = engineers.filter(e => squad.members.includes(e.id));

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Subbar */}
      <div className="flex items-center justify-between border-b bg-card/60 px-4 h-10 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Link to="/collaboration/squad/$id" params={{ id: squad.id }} className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Exit</Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium truncate">{squad.name}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground inline-flex items-center gap-1"><GitBranch className="h-3 w-3" /> main</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> CI passing</span>
          <div className="flex -space-x-2">
            {members.map(m => (
              <div key={m.id} title={m.name} className="grid h-6 w-6 place-items-center rounded-full bg-accent text-[10px] font-semibold border-2 border-card">{m.avatar}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="flex flex-1 min-h-0">
        {/* Left */}
        <div className="w-64 shrink-0 border-r bg-card/30 flex flex-col">
          <div className="flex border-b text-xs">
            {(["board", "tickets", "mentions", "git"] as const).map(t => (
              <button key={t} onClick={() => setLeftTab(t)} className={`flex-1 py-2 capitalize ${leftTab === t ? "bg-background font-medium" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
          <div className="flex-1 overflow-auto p-2 text-xs">
            {leftTab === "tickets" && (
              <ul className="space-y-1">
                {tickets.map(t => (
                  <li key={t.id}>
                    <button onClick={() => setOpenTicket(t.id)} className={`w-full text-left rounded p-2 hover:bg-accent ${openTicket === t.id ? "bg-accent" : ""}`}>
                      <div className="font-mono text-[10px] text-muted-foreground">{t.id}</div>
                      <div className="truncate">{t.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{t.column}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {leftTab === "board" && <p className="text-muted-foreground p-2">Sprint board shown in center.</p>}
            {leftTab === "mentions" && <ul className="space-y-2 p-1">{["@alex Take a look at ENG-101", "@alex review checkout-summary", "@alex SEV1 needs you"].map(m => <li key={m} className="rounded p-2 hover:bg-accent">{m}</li>)}</ul>}
            {leftTab === "git" && <ul className="space-y-2 p-1 font-mono">{["feat: add stripe webhook", "fix: race in inventory", "chore: bump deps", "test: e2e checkout"].map(m => <li key={m} className="text-muted-foreground">→ {m}</li>)}</ul>}
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-auto p-4 min-h-0">
            {ticket ? <TicketDetail ticket={ticket} onClose={() => setOpenTicket(null)} /> : <Board onOpen={setOpenTicket} />}
          </div>
          {/* Bottom panel */}
          <div className="border-t bg-card/40 h-44 flex flex-col">
            <div className="flex border-b text-xs">
              {(["logs", "tests", "ci", "errors"] as const).map(t => {
                const Icon = t === "logs" ? Terminal : t === "tests" ? Play : t === "ci" ? CheckCircle2 : Bug;
                return (
                  <button key={t} onClick={() => setBottomTab(t)} className={`px-3 py-2 inline-flex items-center gap-1.5 capitalize ${bottomTab === t ? "bg-background font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                    <Icon className="h-3 w-3" /> {t}
                  </button>
                );
              })}
            </div>
            <div className="flex-1 overflow-auto p-3 text-xs font-mono">
              {bottomTab === "logs" && <pre className="text-muted-foreground">[10:02:11] checkout-api ready on :4000{"\n"}[10:02:14] stripe webhook verified{"\n"}[10:02:18] POST /charge 200 124ms{"\n"}[10:02:21] POST /charge 502 — retry queued{"\n"}[10:02:24] retry succeeded</pre>}
              {bottomTab === "tests" && <pre className="text-success">✓ unit/charge.test.ts (12){"\n"}✓ unit/retry.test.ts (4){"\n"}✗ e2e/checkout.spec.ts — regression in step 4</pre>}
              {bottomTab === "ci" && <pre>build ✓ · test ✗ · security ✓ · deploy ⏸ paused (awaiting fix)</pre>}
              {bottomTab === "errors" && <pre className="text-destructive">TypeError: Cannot read 'amount' of undefined{"\n"}  at chargeHandler (api/charge.ts:42)</pre>}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-72 shrink-0 border-l bg-card/30 flex flex-col">
          <div className="flex border-b text-xs">
            {(["chat", "ai", "prs", "analytics"] as const).map(t => {
              const Icon = t === "chat" ? MessageSquare : t === "ai" ? Sparkles : t === "prs" ? GitBranch : Users;
              return (
                <button key={t} onClick={() => setRightTab(t)} className={`flex-1 py-2 inline-flex items-center justify-center gap-1 capitalize ${rightTab === t ? "bg-background font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                  <Icon className="h-3 w-3" /> {t}
                </button>
              );
            })}
          </div>
          <div className="flex-1 overflow-auto p-3 text-xs space-y-3">
            {rightTab === "chat" && [
              ["Anjali", "Rolling out retry queue v2"],
              ["Rohith", "Pushed the checkout summary UI"],
              ["Meera", "Found a regression in step 4"],
              ["Dev", "Canary deploy paused on failing tests"],
            ].map(([n, m], i) => (
              <div key={i}>
                <div className="font-medium">{n}</div>
                <div className="text-muted-foreground">{m}</div>
              </div>
            ))}
            {rightTab === "ai" && (
              <div className="space-y-2">
                <div className="rounded-md border bg-background/50 p-2"><b>AI Mentor:</b> The 502 in /charge looks like a transient upstream — your retry queue should handle this. Add jitter to backoff.</div>
                <div className="rounded-md border bg-background/50 p-2"><b>Suggestion:</b> Add idempotency key to ENG-101 to avoid double-charges.</div>
              </div>
            )}
            {rightTab === "prs" && [
              ["PR #28", "Stripe webhook handler", "review"],
              ["PR #29", "Checkout summary UI", "approved"],
              ["PR #30", "Retry queue", "draft"],
            ].map(([id, t, s], i) => (
              <div key={i} className="rounded-md border p-2">
                <div className="font-mono text-[10px] text-muted-foreground">{id}</div>
                <div>{t}</div>
                <div className="text-[10px] text-primary">{s}</div>
              </div>
            ))}
            {rightTab === "analytics" && (
              <ul className="space-y-1.5">
                <li className="flex justify-between"><span className="text-muted-foreground">Velocity</span><span>{squad.velocity}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Open PRs</span><span>3</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Build success</span><span>92%</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Avg review time</span><span>1h 24m</span></li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Board({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {cols.map(c => {
        const items = tickets.filter(t => t.column === c);
        return (
          <div key={c} className="w-64 shrink-0">
            <div className="flex items-center justify-between mb-2 px-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c}</h4>
              <span className="text-[10px] text-muted-foreground">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map(t => (
                <button key={t.id} onClick={() => onOpen(t.id)} className="w-full text-left rounded-lg border bg-card p-3 hover:border-primary/40">
                  <div className="font-mono text-[10px] text-muted-foreground">{t.id}</div>
                  <div className="text-sm mt-0.5">{t.title}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className={`px-1.5 py-0.5 rounded ${t.priority === "Critical" ? "bg-destructive/15 text-destructive" : t.priority === "High" ? "bg-warning/15 text-warning" : "bg-accent"}`}>{t.priority}</span>
                    <span className="text-muted-foreground">{t.points} pts</span>
                  </div>
                  {t.build && (
                    <div className="mt-2 text-[10px] inline-flex items-center gap-1">
                      {t.build === "passing" ? <CheckCircle2 className="h-3 w-3 text-success" /> : t.build === "failing" ? <XCircle className="h-3 w-3 text-destructive" /> : <Clock className="h-3 w-3 text-warning" />}
                      <span className="text-muted-foreground">{t.pr ?? "build"}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TicketDetail({ ticket, onClose }: { ticket: any; onClose: () => void }) {
  return (
    <div>
      <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3"><ArrowLeft className="h-3 w-3" /> Back to board</button>
      <div className="rounded-xl border bg-card p-5">
        <div className="font-mono text-[10px] text-muted-foreground">{ticket.id}</div>
        <h2 className="text-xl font-semibold mt-1">{ticket.title}</h2>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-accent">{ticket.column}</span>
          <span className="px-2 py-0.5 rounded bg-accent">{ticket.priority}</span>
          <span className="px-2 py-0.5 rounded bg-accent">{ticket.points} pts</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-5">
          <div className="md:col-span-2 space-y-4">
            <Section title="Problem Statement"><p className="text-sm text-muted-foreground">Implement {ticket.title.toLowerCase()} with idempotency, retries, and full logging. Must handle 502 from upstream gracefully.</p></Section>
            <Section title="Acceptance Criteria">
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Webhook signature verified</li><li>Idempotency key honored</li><li>Failures retried with backoff</li><li>Full unit + e2e coverage</li>
              </ul>
            </Section>
            <Section title="Team Discussion">
              <div className="space-y-2 text-sm">
                <div><b>Anjali:</b> <span className="text-muted-foreground">Should we move the retry to BullMQ?</span></div>
                <div><b>Liam:</b> <span className="text-muted-foreground">+1, also use exponential backoff with jitter.</span></div>
              </div>
            </Section>
          </div>
          <div className="space-y-3">
            <Action label="Start Work" primary />
            <Action label="Move Ticket" />
            <Action label="Raise Blocker" />
            <Action label="Request Support" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Action({ label, primary }: { label: string; primary?: boolean }) {
  return <button className={`w-full rounded-md px-3 py-2 text-sm ${primary ? "bg-primary text-primary-foreground hover:opacity-90" : "border hover:bg-accent"}`}>{label}</button>;
}
