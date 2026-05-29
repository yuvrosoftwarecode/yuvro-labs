import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  engineers,
  squads,
  incidents,
  notifications,
  myReputation,
  tickets,
} from "@/lib/collab";
import {
  Activity,
  AlertOctagon,
  BadgeCheck,
  Bell,
  Bot,
  Branch,
  CheckCircle2,
  ChevronRight,
  Circle,
  Code2,
  GitPullRequest,
  KanbanSquare,
  MessageSquare,
  Radio,
  Rocket,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/collaboration/")({ component: Dashboard });

const sprintColumns = ["Todo", "In Progress", "Review", "QA", "Deployment", "Blocked"] as const;

const aiActions = [
  "Assigned ENG-104 regression to Meera based on QA reliability",
  "Flagged retry-queue as architecture risk before deployment",
  "Generated PR review checklist for checkout-webhook handler",
];

function Dashboard() {
  const activeSquad = squads[0];
  const online = engineers.filter((e) => e.availability === "Online");
  const activeIncident = incidents[0];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <header className="border-b bg-card/60 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-md border bg-accent/40 px-2 py-1 font-medium text-foreground">
                <Radio className="h-3 w-3 text-success" /> Live engineering simulation
              </span>
              <span>Sprint day 3/5</span>
              <span>·</span>
              <span>{online.length} teammates active</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Collaboration Command Center</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Run a simulated startup engineering squad with tickets, PR reviews, incidents, QA gates, team reputation, and AI scrum support.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/collaboration/workspace/$id" params={{ id: activeSquad.id }} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              <TerminalSquare className="h-4 w-4" /> Open Workspace
            </Link>
            <Link to="/collaboration/discover" className="inline-flex items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm hover:bg-accent">
              <Users className="h-4 w-4" /> Join Squad
            </Link>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4 p-5 max-w-[1640px]">
        <section className="col-span-12 xl:col-span-9 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Metric label="Sprint velocity" value={`${activeSquad.velocity} pts`} detail="8 pts above target" icon={<Activity className="h-4 w-4" />} tone="success" />
            <Metric label="Open PRs" value="4" detail="2 need review" icon={<GitPullRequest className="h-4 w-4" />} tone="primary" />
            <Metric label="Build health" value="83%" detail="1 failing QA gate" icon={<ShieldCheck className="h-4 w-4" />} tone="warning" />
            <Metric label="Team reputation" value={`${activeSquad.reputation}`} detail="Recruiter-visible" icon={<BadgeCheck className="h-4 w-4" />} tone="info" />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <Panel title="Sprint board" icon={<KanbanSquare className="h-4 w-4" />} action={<Link to="/collaboration/workspace/$id" params={{ id: activeSquad.id }} className="inline-flex items-center gap-1 text-xs text-primary">Full board <ChevronRight className="h-3 w-3" /></Link>}>
              <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
                {sprintColumns.map((column) => {
                  const columnTickets = tickets.filter((ticket) => ticket.column === column).slice(0, 2);
                  return (
                    <div key={column} className="min-h-32 rounded-md border bg-background/50">
                      <div className="flex items-center justify-between border-b px-3 py-2">
                        <span className="text-xs font-semibold">{column}</span>
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">{columnTickets.length}</span>
                      </div>
                      <div className="space-y-2 p-2">
                        {columnTickets.length ? columnTickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />) : <p className="px-1 py-3 text-xs text-muted-foreground">No active ticket</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <Panel title="AI scrum master" icon={<Bot className="h-4 w-4" />} action={<span className="rounded-full bg-success/15 px-2 py-1 text-[10px] font-medium text-success">Active</span>}>
              <div className="space-y-3">
                {aiActions.map((action) => (
                  <div key={action} className="flex gap-3 rounded-md border bg-background/50 p-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-snug">{action}</p>
                  </div>
                ))}
                <div className="rounded-md border bg-accent/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sprint summary</p>
                  <p className="mt-1 text-sm">Checkout v2 is on track if ENG-104 passes QA and ENG-107 is unblocked before the canary deploy.</p>
                </div>
              </div>
            </Panel>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Shared IDE + PR review" icon={<Code2 className="h-4 w-4" />}>
              <div className="overflow-hidden rounded-md border bg-editor-bg font-mono text-xs">
                <div className="flex items-center justify-between border-b bg-editor-panel px-3 py-2 font-sans">
                  <span className="text-xs font-medium">payments-api/src/webhooks/stripe.ts</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-success"><Circle className="h-2 w-2 fill-success" /> Rohith + Anjali editing</span>
                </div>
                <div className="grid grid-cols-[2rem_1fr] gap-x-3 p-3 leading-6">
                  {["42", "43", "44", "45", "46", "47"].map((line) => <span key={line} className="text-right text-editor-gutter">{line}</span>)}
                  <code><span className="text-syntax-keyword">async function</span> <span className="text-syntax-fn">handleStripeWebhook</span>(event) &#123;</code>
                  <code><span className="text-syntax-comment">// AI: verify idempotency key before retry</span></code>
                  <code><span className="text-syntax-keyword">await</span> retryQueue.add(<span className="text-syntax-string">&quot;payment-sync&quot;</span>, payload)</code>
                  <code><span className="text-syntax-keyword">return</span> &#123; status: <span className="text-syntax-string">&quot;queued&quot;</span> &#125;</code>
                  <code>&#125;</code>
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <StatusPill label="PR #29" value="Needs review" />
                <StatusPill label="Tests" value="17/18 passing" />
                <StatusPill label="Coverage" value="91%" />
              </div>
            </Panel>

            <Panel title="Squad chat + incident bridge" icon={<MessageSquare className="h-4 w-4" />} action={<Link to="/collaboration/live" className="text-xs text-primary">Go live</Link>}>
              <div className="space-y-3">
                <ChatLine name="Meera" text="Regression confirmed only on saved-card checkout. Adding Playwright trace." time="2m" />
                <ChatLine name="Dev" text="Canary is paused. I’ll resume after QA clears ENG-104." time="4m" />
                <ChatLine name="AI Mentor" text="Suggested rollback plan attached to incident room." time="6m" ai />
              </div>
              <div className="mt-4 flex items-center justify-between rounded-md border bg-destructive/10 p-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{activeIncident.severity} · {activeIncident.title}</p>
                  <p className="text-xs text-muted-foreground">{activeIncident.service} · {activeIncident.responders.length} responders · {activeIncident.status}</p>
                </div>
                <Link to="/collaboration/incidents" className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground">Join</Link>
              </div>
            </Panel>
          </div>
        </section>

        <aside className="col-span-12 xl:col-span-3 space-y-4">
          <Panel title="Active squad" icon={<Branch className="h-4 w-4" />} action={<Link to="/collaboration/squad/$id" params={{ id: activeSquad.id }} className="text-xs text-primary">Profile</Link>}>
            <h2 className="text-lg font-semibold">{activeSquad.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{activeSquad.objective}</p>
            <div className="mt-4 space-y-3">
              <ProgressLine label="Sprint progress" value={activeSquad.progress} />
              <ProgressLine label="Collaboration" value={myReputation.collab} />
              <ProgressLine label="Reliability" value={myReputation.reliability} />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {activeSquad.stack.map((item) => <span key={item} className="rounded-full border bg-accent/50 px-2 py-1 text-[10px] text-muted-foreground">{item}</span>)}
            </div>
          </Panel>

          <Panel title="Live teammates" icon={<Users className="h-4 w-4" />}>
            <div className="space-y-3">
              {online.slice(0, 4).map((engineer) => (
                <div key={engineer.id} className="flex items-center gap-3">
                  <div className="relative grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-semibold">
                    {engineer.avatar}
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{engineer.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{engineer.role} · {engineer.stack.slice(0, 2).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Notifications" icon={<Bell className="h-4 w-4" />} action={<span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">{notifications.length}</span>}>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="flex gap-2 text-xs">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0">
                    <p className="truncate">{notification.text}</p>
                    <p className="text-[10px] text-muted-foreground">{notification.time} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Completion gates" icon={<Rocket className="h-4 w-4" />}>
            <div className="space-y-2 text-sm">
              <Gate label="PR reviewed" done />
              <Gate label="QA regression fixed" />
              <Gate label="Canary deploy approved" />
              <Gate label="Retro feedback submitted" />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Panel({ title, icon, action, children }: { title: string; icon: ReactNode; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border bg-card">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold">{icon}{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Metric({ label, value, detail, icon, tone }: { label: string; value: string; detail: string; icon: ReactNode; tone: "primary" | "success" | "warning" | "info" }) {
  const toneClass = tone === "success" ? "text-success bg-success/15" : tone === "warning" ? "text-warning bg-warning/15" : tone === "info" ? "text-info bg-info/15" : "text-primary bg-primary/15";
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`rounded-md p-1.5 ${toneClass}`}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function TicketRow({ ticket }: { ticket: (typeof tickets)[number] }) {
  const priorityClass = ticket.priority === "Critical" ? "text-destructive" : ticket.priority === "High" ? "text-warning" : "text-muted-foreground";
  return (
    <div className="rounded-md border bg-card px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold text-primary">{ticket.id}</span>
        <span className={`text-[10px] font-medium ${priorityClass}`}>{ticket.priority}</span>
      </div>
      <p className="mt-1 line-clamp-2 text-xs font-medium">{ticket.title}</p>
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{ticket.points} pts</span>
        <span>{ticket.pr ?? "No PR"}</span>
      </div>
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background/50 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-xs font-semibold">{value}</p>
    </div>
  );
}

function ChatLine({ name, text, time, ai = false }: { name: string; text: string; time: string; ai?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${ai ? "bg-primary text-primary-foreground" : "bg-accent"}`}>{ai ? "AI" : name.slice(0, 2).toUpperCase()}</div>
      <div className="min-w-0 flex-1 rounded-md border bg-background/50 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold">{name}</p>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
        <p className="mt-1 text-sm leading-snug text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function ProgressLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}%</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-accent"><div className="h-full bg-primary" style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function Gate({ label, done = false }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-background/50 px-3 py-2">
      <span>{label}</span>
      {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
}
