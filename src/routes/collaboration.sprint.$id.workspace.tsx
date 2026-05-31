import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCollab, fmtCountdown } from "@/lib/collab/store";
import { Avatar, RoleBadge } from "@/components/collab/Avatar";
import { DOMAIN_COLORS, ME_ID, AI_ID } from "@/lib/collab/data";
import { ArrowLeft, Lock, Clock, CheckCircle2, Circle, GitPullRequest, Send, AtSign, Hash, MessagesSquare, ListChecks, Workflow } from "lucide-react";

export const Route = createFileRoute("/collaboration/sprint/$id/workspace")({ component: Workspace });

function Workspace() {
  const { id } = Route.useParams();
  const { sprints, tickets, prs, messages, user, sendMessage, submitSprint } = useCollab();
  const sprint = sprints.find(s => s.id === id);
  const [tab, setTab] = useState<"tickets" | "team" | "pr" | "disc">("tickets");
  const [draft, setDraft] = useState("");

  if (!sprint) return <main className="p-10 text-center text-muted-foreground">Sprint not found.</main>;
  const myMember = sprint.members.find(m => m.userId === ME_ID);
  if (!myMember) return (
    <main className="p-10 text-center max-w-md mx-auto">
      <p className="text-sm text-muted-foreground mb-4">You are not a member of this sprint team.</p>
      <Link to="/collaboration/browse" className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm">Browse Sprints</Link>
    </main>
  );

  const sTickets = tickets[sprint.id] ?? [];
  const myTickets = sTickets.filter(t => t.assigneeId === ME_ID);
  const sPRs = prs[sprint.id] ?? [];
  const sMsgs = messages[sprint.id] ?? [];
  const cd = fmtCountdown(sprint.deadlineAt);
  const done = sTickets.filter(t => t.status === "Completed").length;
  const allDone = done === sTickets.length;

  return (
    <main className="mx-auto max-w-[1400px]">
      <header className="px-4 sm:px-6 py-3 border-b bg-card/40 sticky top-14 z-30">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/collaboration/sprint/$id" params={{ id: sprint.id }} className="grid h-7 w-7 place-items-center rounded hover:bg-accent"><ArrowLeft className="h-4 w-4" /></Link>
            <div className="min-w-0">
              <h1 className="font-semibold truncate">{sprint.title}</h1>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${DOMAIN_COLORS[sprint.domain]}`}>{sprint.domain}</span>
            </div>
          </div>
          <div className={`font-mono text-base sm:text-lg ${cd.tone === "destructive" ? "text-destructive animate-pulse" : cd.tone === "warning" ? "text-warning" : "text-foreground"}`}>{cd.text}</div>
          <div className="flex -space-x-1.5">{sprint.members.slice(0, 6).map((m, i) => <Avatar key={i} userId={m.userId} ai={m.status === "ai"} size={28} showStatus={m.status === "joined"} />)}</div>
          <div className="text-xs text-muted-foreground">{done}/{sTickets.length} done</div>
          <button disabled={!allDone || sprint.status === "Completed"} onClick={() => submitSprint(sprint.id)} className="rounded-md bg-success text-white px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed" title={!allDone ? "Complete all tickets to unlock" : ""}>
            {sprint.status === "Completed" ? "Submitted ✓" : "Submit Sprint"}
          </button>
        </div>

        <div className="mt-3 flex gap-1 overflow-x-auto">
          {([["tickets", ListChecks, "My Tickets"], ["team", Workflow, "Team Overview"], ["pr", GitPullRequest, "Pull Requests"], ["disc", MessagesSquare, "Discussions"]] as const).map(([k, Ico, label]) => (
            <button key={k} onClick={() => setTab(k as any)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md whitespace-nowrap ${tab === k ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"}`}>
              <Ico className="h-3.5 w-3.5" />{label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 sm:px-6 py-6">
        {tab === "tickets" && (
          <div className="grid md:grid-cols-3 gap-4">
            {(["Not Started", "In Progress", "Completed"] as const).map(col => {
              const list = myTickets.filter(t => t.status === col);
              const accent = col === "Not Started" ? "border-muted-foreground/30" : col === "In Progress" ? "border-info/40" : "border-success/40";
              return (
                <div key={col} className={`rounded-xl border bg-card p-3 border-t-4 ${accent}`}>
                  <div className="flex items-center justify-between mb-2 text-xs"><span className="font-semibold">{col}</span><span className="text-muted-foreground">{list.length}</span></div>
                  <div className="space-y-2">
                    {list.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">Nothing here.</p>}
                    {list.map(t => {
                      const blocker = t.dependsOnTicketId ? sTickets.find(x => x.id === t.dependsOnTicketId) : null;
                      const locked = blocker && blocker.status !== "Completed";
                      return (
                        <Link key={t.id} to="/collaboration/sprint/$id/ticket/$ticketId" params={{ id: sprint.id, ticketId: t.id }} className={`block rounded-lg border p-3 hover:border-primary/40 ${locked ? "opacity-60" : ""}`}>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground">#{t.id.split("-").pop()}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent">{t.points} pts</span>
                          </div>
                          <p className="text-sm font-medium mt-1">{t.title}</p>
                          <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-accent">{t.difficulty}</span>
                            {col === "In Progress" && <span className="text-info flex items-center gap-0.5"><Clock className="h-3 w-3" /> active</span>}
                            {col === "Completed" && <CheckCircle2 className="h-3 w-3 text-success" />}
                          </div>
                          {locked && (
                            <div className="mt-2 text-[10px] text-warning flex items-center gap-1"><Lock className="h-3 w-3" /> Waiting for {blocker?.role} — {blocker?.title}</div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "team" && (
          <div className="space-y-5">
            {sprint.requiredRoles.map(role => {
              const roleTickets = sTickets.filter(t => t.role === role);
              const roleDone = roleTickets.filter(t => t.status === "Completed").length;
              const member = sprint.members.find(m => m.role === role);
              return (
                <details key={role} open className="rounded-xl border bg-card">
                  <summary className="p-3 flex items-center gap-2 cursor-pointer">
                    <Avatar userId={member?.userId} ai={member?.status === "ai"} size={28} />
                    <div className="flex-1"><div className="text-sm font-semibold">{role}</div><div className="text-[10px] text-muted-foreground">{member?.status === "ai" ? "AI Member" : user(member?.userId)?.name ?? "Open"}</div></div>
                    <span className="text-xs text-muted-foreground">{roleDone}/{roleTickets.length} done</span>
                  </summary>
                  <div className="border-t divide-y">
                    {roleTickets.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-2.5 text-sm">
                        <span>{t.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${t.status === "Completed" ? "bg-success/15 text-success" : t.status === "In Progress" ? "bg-info/15 text-info" : "bg-muted text-muted-foreground"}`}>{t.status}</span>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}

            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold mb-4">Dependency Chain</h3>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {(["SQL", "Backend", "Frontend", "QA", "DevOps"] as const).map((r, i, arr) => {
                  const rTickets = sTickets.filter(t => t.role === r);
                  const rDone = rTickets.filter(t => t.status === "Completed").length;
                  const complete = rDone === rTickets.length && rTickets.length > 0;
                  return (
                    <div key={r} className="flex items-center gap-2 shrink-0">
                      <div className={`px-3 py-2 rounded-lg border text-xs text-center ${complete ? "border-success/40 bg-success/10" : rDone > 0 ? "border-info/40 bg-info/10" : "border-muted-foreground/30"}`}>
                        <div className="font-semibold">{r}</div>
                        <div className="text-[10px] text-muted-foreground">{rDone}/{rTickets.length}</div>
                      </div>
                      {i < arr.length - 1 && <div className={`w-8 border-t-2 ${complete ? "border-success border-solid" : "border-muted-foreground/30 border-dashed"}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "pr" && (
          <div className="rounded-xl border bg-card divide-y">
            {sPRs.map(pr => {
              const a = user(pr.authorId);
              const tone = pr.status === "Merged" ? "bg-muted text-muted-foreground" : pr.status === "Approved" ? "bg-success/15 text-success" : pr.status === "Changes Requested" ? "bg-warning/15 text-warning" : "bg-info/15 text-info";
              return (
                <Link key={pr.id} to="/collaboration/sprint/$id/ticket/$ticketId" params={{ id: sprint.id, ticketId: pr.ticketId }} className="flex items-center gap-3 p-3 hover:bg-accent/30">
                  <Avatar userId={pr.authorId} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-[10px] font-mono text-muted-foreground">{pr.ticketId.split("-").pop()}</span><p className="text-sm font-medium truncate">{pr.title}</p></div>
                    <p className="text-[11px] text-muted-foreground">{a?.name} · {pr.raisedAt}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${tone}`}>{pr.status}</span>
                </Link>
              );
            })}
          </div>
        )}

        {tab === "disc" && (
          <div className="grid lg:grid-cols-[1fr_360px] gap-4">
            <div className="rounded-xl border bg-card flex flex-col h-[60vh]">
              <div className="p-3 border-b text-sm font-semibold">Team Channel · Private</div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {sMsgs.map(m => {
                  const a = user(m.authorId);
                  const isAI = m.authorId === AI_ID;
                  return (
                    <div key={m.id} className="flex gap-2">
                      <Avatar userId={m.authorId} ai={isAI} size={28} />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-xs"><span className="font-medium">{isAI ? "AI Member" : a?.name}</span><span className="text-muted-foreground">· {m.at}</span></div>
                        <p className="text-sm mt-0.5">{m.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t flex gap-2">
                <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && draft.trim()) { e.preventDefault(); sendMessage(sprint.id, draft.trim()); setDraft(""); } }} placeholder="Message team... (@ mention, # ticket)" className="flex-1 px-3 py-2 text-sm rounded-md border bg-background" />
                <button onClick={() => { if (draft.trim()) { sendMessage(sprint.id, draft.trim()); setDraft(""); } }} className="rounded-md bg-primary text-primary-foreground px-3 grid place-items-center"><Send className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <ForumPane sprintId={sprint.id} />
          </div>
        )}
      </div>
    </main>
  );
}

function ForumPane({ sprintId }: { sprintId: string }) {
  const { forum, user, addThread, upvoteThread } = useCollab();
  const threads = forum[sprintId] ?? [];
  const [newOpen, setNewOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState<"Question" | "Discussion" | "Help" | "Tip">("Question");

  return (
    <div className="rounded-xl border bg-card flex flex-col h-[60vh]">
      <div className="p-3 border-b flex items-center justify-between">
        <span className="text-sm font-semibold">Sprint Forum · Public</span>
        <button onClick={() => setNewOpen(v => !v)} className="text-xs rounded-md bg-primary text-primary-foreground px-2 py-1">New Thread +</button>
      </div>
      {newOpen && (
        <div className="p-3 border-b space-y-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full px-2 py-1.5 text-xs rounded border bg-background" />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Body (markdown)" rows={3} className="w-full px-2 py-1.5 text-xs rounded border bg-background" />
          <div className="flex gap-2">
            <select value={tag} onChange={e => setTag(e.target.value as any)} className="text-xs rounded border bg-background px-2 py-1"><option>Question</option><option>Discussion</option><option>Help</option><option>Tip</option></select>
            <button onClick={() => { if (title.trim()) { addThread(sprintId, title, body, tag); setTitle(""); setBody(""); setNewOpen(false); } }} className="text-xs rounded bg-primary text-primary-foreground px-3 py-1">Post</button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto divide-y">
        {threads.map(t => (
          <div key={t.id} className="p-3">
            <div className="flex items-center gap-1.5 text-[10px] mb-1"><span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary uppercase tracking-wider">{t.tag}</span><span className="text-muted-foreground">{t.replies.length} replies · {t.at}</span></div>
            <p className="text-sm font-medium">{t.title}</p>
            <div className="mt-1.5 flex items-center gap-2 text-[11px]"><Avatar userId={t.authorId} size={16} /><span>{user(t.authorId)?.name}</span><button onClick={() => upvoteThread(sprintId, t.id)} className="ml-auto text-muted-foreground hover:text-primary">▲ {t.upvotes}</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
