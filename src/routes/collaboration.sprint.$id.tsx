import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCollab, fmtCountdown } from "@/lib/collab/store";
import { DOMAIN_COLORS, ME_ID, type RoleKey, type SprintMember } from "@/lib/collab/data";
import { Avatar, LevelBadge, RoleBadge } from "@/components/collab/Avatar";
import { CheckCircle2, Circle, X, AlertTriangle, Shuffle, Bot, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/collaboration/sprint/$id")({ component: SprintDetail });

function SprintDetail() {
  const { id } = Route.useParams();
  const { sprints, forum, joinSprint } = useCollab();
  const nav = useNavigate();
  const sprint = sprints.find(s => s.id === id);
  const [joinRole, setJoinRole] = useState<RoleKey | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  if (!sprint) return <main className="p-10 text-center text-muted-foreground">Sprint not found.</main>;

  const myMember = sprint.members.find(m => m.userId === ME_ID);
  const isFull = sprint.requiredRoles.every(r => sprint.members.some(m => m.role === r && (m.status === "joined" || m.status === "ai")));
  const readonly = (sprint.status === "In Progress" || sprint.status === "Completed") && !myMember;
  const threads = (forum[sprint.id] ?? []).slice(0, 3);

  return (
    <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 grid lg:grid-cols-[2fr_1fr] gap-6">
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${DOMAIN_COLORS[sprint.domain]}`}>{sprint.domain}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${sprint.status === "Open" ? "bg-success/15 text-success" : sprint.status === "In Progress" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"}`}>{sprint.status}</span>
          </div>
          <h1 className="text-3xl font-semibold">{sprint.title}</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{sprint.description}</p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-3">Objectives</h2>
          <ul className="space-y-1.5">
            {sprint.objectives.map(o => (
              <li key={o} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" /><span>{o}</span></li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-3">Dependency Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left p-2">Role</th><th className="text-left p-2">Depends On</th><th className="text-left p-2">Unlocks When</th></tr>
              </thead>
              <tbody>
                {sprint.dependencies.map(d => (
                  <tr key={d.role} className="border-t border-border/60">
                    <td className="p-2 font-medium">{d.role}</td>
                    <td className="p-2 text-muted-foreground">{d.dependsOn}</td>
                    <td className="p-2 text-muted-foreground">{d.unlocks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Sprint Discussion</h2>
            {myMember && <Link to="/collaboration/sprint/$id/workspace" params={{ id: sprint.id }} className="text-xs text-primary hover:underline">View all →</Link>}
          </div>
          {threads.length === 0 ? <p className="text-sm text-muted-foreground">No threads yet.</p> : (
            <div className="divide-y">
              {threads.map(t => (
                <div key={t.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">{t.tag}</span>
                    <span className="text-xs text-muted-foreground">· {t.replies.length} replies</span>
                  </div>
                  <p className="text-sm">{t.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-3">Team</h2>
          <div className="space-y-2.5">
            {sprint.requiredRoles.map(role => {
              const members = sprint.members.filter(m => m.role === role);
              if (members.length === 0) {
                return (
                  <SlotRow key={role} role={role} status="open" onJoin={() => setJoinRole(role)} disabled={readonly || !!myMember} />
                );
              }
              return members.map((m, i) => (
                <SlotRow key={`${role}-${i}`} role={role} status={m.status} userId={m.userId ?? undefined} onJoin={() => setJoinRole(role)} disabled={readonly || !!myMember} />
              ));
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-4">Sprint timer starts when your team clicks <b>Start Sprint</b>.</p>
          <p className="text-xs text-muted-foreground mt-2">Duration: <span className="text-foreground font-medium">{sprint.durationDays} days</span></p>

          <div className="mt-4 space-y-2">
            {myMember ? (
              <Link to="/collaboration/sprint/$id/workspace" params={{ id: sprint.id }} className="block w-full rounded-md bg-primary text-primary-foreground text-center px-3 py-2 text-sm font-medium hover:opacity-90">Go to Workspace</Link>
            ) : readonly ? (
              <button disabled className="w-full rounded-md border px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" title="Sprint is full or in progress">View Only</button>
            ) : (
              <button onClick={() => setCreateOpen(true)} className="w-full rounded-md border px-3 py-2 text-sm hover:bg-accent">Create New Team</button>
            )}
          </div>
        </div>
      </aside>

      {joinRole && (
        <RoleConfirmModal role={joinRole} onClose={() => setJoinRole(null)} onConfirm={() => {
          joinSprint(sprint.id, joinRole);
          setJoinRole(null);
          nav({ to: "/collaboration/sprint/$id/workspace", params: { id: sprint.id } });
        }} />
      )}
      {createOpen && <CreateTeamModal sprintId={sprint.id} onClose={() => setCreateOpen(false)} />}
    </main>
  );
}

function SlotRow({ role, status, userId, onJoin, disabled }: { role: RoleKey; status: SprintMember["status"]; userId?: string; onJoin: () => void; disabled?: boolean }) {
  const { user } = useCollab();
  if (status === "open") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dashed p-2.5">
        <Circle className="h-4 w-4 text-warning" />
        <span className="text-sm flex-1"><b>{role}</b> · Open</span>
        <button onClick={onJoin} disabled={disabled} className="text-xs rounded-md bg-primary text-primary-foreground px-2 py-1 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">Join</button>
      </div>
    );
  }
  if (status === "ai") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 p-2.5">
        <Avatar ai size={28} />
        <div className="flex-1"><div className="text-sm font-medium">AI Member</div><div className="text-[10px] text-warning">filling {role}</div></div>
      </div>
    );
  }
  if (status === "inactive") {
    const u = user(userId);
    return (
      <div className="flex items-center gap-2 rounded-lg border border-warning/40 p-2.5 animate-pulse">
        <Avatar userId={userId} size={28} />
        <div className="flex-1"><div className="text-sm font-medium">{u?.name}</div><div className="text-[10px] text-warning flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Inactive · {role}</div></div>
      </div>
    );
  }
  const u = user(userId);
  return (
    <div className="flex items-center gap-2 rounded-lg border p-2.5">
      <Avatar userId={userId} size={28} showStatus />
      <div className="flex-1"><div className="text-sm font-medium">{u?.name}</div><div className="text-[10px] text-muted-foreground">{role}</div></div>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success border border-success/30">Joined</span>
    </div>
  );
}

function RoleConfirmModal({ role, onClose, onConfirm }: { role: RoleKey; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-card border rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Join as</p>
            <h2 className="text-xl font-semibold">{role}</h2>
          </div>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Responsibilities</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
              {role === "Backend" && (<><li>Build authentication API</li><li>Create payment APIs</li><li>Review FE integration</li></>)}
              {role === "Frontend" && (<><li>Build UI screens</li><li>Wire up API integration</li><li>Handle errors and loading</li></>)}
              {role === "QA" && (<><li>Write E2E tests</li><li>Validate acceptance criteria</li><li>Sign off the sprint</li></>)}
              {role === "DevOps" && (<><li>Set up CI/CD</li><li>Deploy to staging</li><li>Configure monitoring</li></>)}
              {role === "SQL" && (<><li>Design schema</li><li>Add indexes</li><li>Write migrations</li></>)}
              {role === "Mobile" && (<><li>Build mobile screens</li><li>Integrate APIs</li><li>Submit to store</li></>)}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Tickets you'll receive</p>
            <p className="text-muted-foreground">2–4 tickets scoped to this role's slice of the sprint.</p>
          </div>
          <div className="rounded-md border border-warning/40 bg-warning/10 text-warning text-xs p-2.5 flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0" /> You can only join this role once in this sprint.</div>
        </div>
        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={onClose} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">Cancel</button>
          <button onClick={onConfirm} className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90">Confirm & Join</button>
        </div>
      </div>
    </div>
  );
}

const RANDOM_NAMES = ["Rocket Squad", "Night Owls", "Ship Fast", "Bug Hunters", "API Whisperers", "Pixel Pushers", "Merge Masters"];

function CreateTeamModal({ sprintId, onClose }: { sprintId: string; onClose: () => void }) {
  const { sprints, users, connections, squads, user, joinSprint, pushNotification } = useCollab();
  const nav = useNavigate();
  const sprint = sprints.find(s => s.id === sprintId)!;
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [myRole, setMyRole] = useState<RoleKey>(sprint.requiredRoles[0]);
  const [search, setSearch] = useState("");
  const [onlyConnections, setOnlyConnections] = useState(true);
  const [invited, setInvited] = useState<{ userId: string; role: RoleKey }[]>([]);
  const [squadId, setSquadId] = useState<string>("");
  const [requestRole, setRequestRole] = useState<RoleKey>(sprint.requiredRoles[1] ?? sprint.requiredRoles[0]);
  const [requestMsg, setRequestMsg] = useState("");
  const [aiFill, setAiFill] = useState(true);

  const searchPool = users.filter(u => u.id !== ME_ID && u.id !== "u-ai" && (!onlyConnections || connections.includes(u.id)))
    .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.username.includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose}>
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[520px] bg-card border-l overflow-y-auto animate-in slide-in-from-right" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Create Team · Step {step} of 2</h2>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>

        {step === 1 ? (
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Team name</label>
              <div className="mt-1 flex gap-2">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ship Fast" className="flex-1 px-3 py-2 text-sm rounded-md border bg-background" />
                <button onClick={() => setName(RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)])} className="rounded-md border px-3 py-2 text-sm hover:bg-accent inline-flex items-center gap-1"><Shuffle className="h-3.5 w-3.5" /> Random</button>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Your role</label>
              <select value={myRole} onChange={e => setMyRole(e.target.value as RoleKey)} className="mt-1 w-full px-3 py-2 text-sm rounded-md border bg-background">
                {sprint.requiredRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button disabled={!name.trim()} onClick={() => setStep(2)} className="w-full rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50">Create Team</button>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <section>
              <h3 className="text-sm font-semibold mb-2">Invite by username / connection</h3>
              <div className="flex gap-2 mb-2">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="flex-1 px-3 py-2 text-sm rounded-md border bg-background" />
                <label className="text-xs flex items-center gap-1.5"><input type="checkbox" checked={onlyConnections} onChange={e => setOnlyConnections(e.target.checked)} /> My connections</label>
              </div>
              <div className="rounded-lg border max-h-40 overflow-y-auto divide-y">
                {searchPool.slice(0, 6).map(u => (
                  <div key={u.id} className="flex items-center gap-2 p-2">
                    <Avatar userId={u.id} size={28} />
                    <div className="flex-1 min-w-0"><div className="text-xs font-medium truncate">{u.name}</div><LevelBadge level={u.level} /></div>
                    <select onChange={e => setInvited(i => [...i.filter(x => x.userId !== u.id), { userId: u.id, role: e.target.value as RoleKey }])} className="text-xs rounded border bg-background px-1.5 py-1">
                      <option value="">Role…</option>
                      {sprint.requiredRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              {invited.length > 0 && (
                <div className="mt-2 space-y-1">
                  {invited.map(inv => {
                    const u = user(inv.userId);
                    return (
                      <div key={inv.userId} className="flex items-center gap-2 text-xs bg-accent/40 rounded p-2">
                        <Avatar userId={inv.userId} size={20} /> <span className="flex-1">{u?.name}</span>
                        <RoleBadge role={inv.role} />
                        <button onClick={() => setInvited(i => i.filter(x => x.userId !== inv.userId))} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-sm font-semibold mb-2">Bring my squad</h3>
              <select value={squadId} onChange={e => setSquadId(e.target.value)} className="w-full px-3 py-2 text-sm rounded-md border bg-background">
                <option value="">Pick a squad…</option>
                {squads.map(sq => <option key={sq.id} value={sq.id}>{sq.name} ({sq.memberIds.length})</option>)}
              </select>
              {squadId && (
                <div className="mt-2 space-y-1">
                  {(squads.find(s => s.id === squadId)?.memberIds ?? []).filter(id => id !== ME_ID).map(id => {
                    const u = user(id);
                    return (
                      <label key={id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-accent/40">
                        <input type="checkbox" />
                        <Avatar userId={id} size={20} /> <span className="flex-1">{u?.name}</span>
                        <span className="text-muted-foreground">{u?.roles.join(", ")}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-sm font-semibold mb-2">Post role request</h3>
              <select value={requestRole} onChange={e => setRequestRole(e.target.value as RoleKey)} className="w-full px-3 py-2 text-sm rounded-md border bg-background mb-2">
                {sprint.requiredRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <textarea value={requestMsg} onChange={e => setRequestMsg(e.target.value)} placeholder="Looking for an experienced QA…" className="w-full px-3 py-2 text-sm rounded-md border bg-background" rows={2} />
              <button onClick={() => { pushNotification({ type: "role-request", message: `Posted public request for ${requestRole}.`, link: `/collaboration/sprint/${sprint.id}` }); setRequestMsg(""); }} className="mt-2 text-xs rounded-md border px-3 py-1.5 hover:bg-accent">Post Request</button>
            </section>

            <section>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Bot className="h-4 w-4 text-warning" /> AI fill</h3>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={aiFill} onChange={e => setAiFill(e.target.checked)} />
                Auto-fill remaining roles with AI members when sprint starts
              </label>
              <p className="text-[11px] text-muted-foreground mt-1">If a role is still open when you click Start Sprint, an AI team member will fill it automatically.</p>
            </section>

            <div className="flex gap-2 sticky bottom-0 bg-card pt-3 border-t">
              <button onClick={() => setStep(1)} className="rounded-md border px-3 py-2 text-sm hover:bg-accent">Back</button>
              <button onClick={() => {
                joinSprint(sprint.id, myRole);
                onClose();
                nav({ to: "/collaboration/sprint/$id/workspace", params: { id: sprint.id } });
              }} className="flex-1 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90">Finish & View Team</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
