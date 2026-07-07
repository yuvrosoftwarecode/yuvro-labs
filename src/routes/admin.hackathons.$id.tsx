import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { useEffect, useMemo, useState } from "react";
import { getHackathon, updateHackathon, newGoal, availableLabs, type Hackathon, type HackathonGoal } from "@/lib/hackathons";
import { ArrowLeft, Plus, Trash2, Save, Target } from "lucide-react";

export const Route = createFileRoute("/admin/hackathons/$id")({ component: EditHackathon });

function EditHackathon() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [h, setH] = useState<Hackathon | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const labs = availableLabs();

  useEffect(() => {
    const found = getHackathon(id);
    if (!found) { nav({ to: "/admin/hackathons" }); return; }
    setH(found);
    setSelectedGoalId(found.goals[0]?.id ?? null);
  }, [id, nav]);

  const selected = useMemo(() => h?.goals.find(g => g.id === selectedGoalId) ?? null, [h, selectedGoalId]);

  if (!h) return null;

  const patch = (p: Partial<Hackathon>) => setH(prev => prev ? { ...prev, ...p } : prev);
  const patchGoal = (gid: string, gp: Partial<HackathonGoal>) => setH(prev => prev ? { ...prev, goals: prev.goals.map(g => g.id === gid ? { ...g, ...gp } : g) } : prev);
  const addGoal = () => {
    const g = newGoal(labs[0]?.slug);
    setH(prev => prev ? { ...prev, goals: [...prev.goals, g] } : prev);
    setSelectedGoalId(g.id);
  };
  const removeGoal = (gid: string) => setH(prev => {
    if (!prev) return prev;
    const goals = prev.goals.filter(g => g.id !== gid);
    if (selectedGoalId === gid) setSelectedGoalId(goals[0]?.id ?? null);
    return { ...prev, goals };
  });
  const save = () => { updateHackathon(h.id, h); nav({ to: "/admin/hackathons" }); };

  const labMap = new Map(labs.map(l => [l.slug, l]));

  return (
    <AdminShell
      title={h.title}
      breadcrumb={["Engineering", "Hackathons", h.title]}
      right={
        <div className="flex items-center gap-2">
          <Link to="/admin/hackathons" className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent inline-flex items-center gap-1"><ArrowLeft className="h-3.5 w-3.5" /> Back</Link>
          <button onClick={save} className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5"><Save className="h-3.5 w-3.5" /> Save</button>
        </div>
      }
    >
      {/* Hackathon meta */}
      <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur p-5 mb-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 grid gap-3 md:grid-cols-2">
          <Field label="Title"><input value={h.title} onChange={e => patch({ title: e.target.value })} className="input" /></Field>
          <Field label="Theme"><input value={h.theme ?? ""} onChange={e => patch({ theme: e.target.value })} className="input" placeholder="e.g. FinTech" /></Field>
        </div>
        <Field label="Description" full><textarea value={h.description} onChange={e => patch({ description: e.target.value })} rows={3} className="input" /></Field>
        <Field label="Prize"><input value={h.prize ?? ""} onChange={e => patch({ prize: e.target.value })} className="input" placeholder="e.g. $1,000 + swag" /></Field>
        <Field label="Status">
          <select value={h.isActive ? "1" : "0"} onChange={e => patch({ isActive: e.target.value === "1" })} className="input">
            <option value="1">Active</option>
            <option value="0">Draft</option>
          </select>
        </Field>
        <Field label="Starts at"><input type="datetime-local" value={toLocal(h.startsAt)} onChange={e => patch({ startsAt: fromLocal(e.target.value) })} className="input" /></Field>
        <Field label="Ends at"><input type="datetime-local" value={toLocal(h.endsAt)} onChange={e => patch({ endsAt: fromLocal(e.target.value) })} className="input" /></Field>
      </div>

      {/* Goals editor */}
      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border border-border/60 bg-card/40 backdrop-blur p-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="text-xs font-medium inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> Goals ({h.goals.length})</div>
            <button onClick={addGoal} className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1"><Plus className="h-3 w-3" /> Add</button>
          </div>
          <div className="space-y-1 max-h-[65vh] overflow-y-auto">
            {h.goals.length === 0 && <div className="text-xs text-muted-foreground px-2 py-6 text-center">No goals yet.</div>}
            {h.goals.map((g, i) => {
              const l = labMap.get(g.labSlug);
              const active = g.id === selectedGoalId;
              return (
                <button key={g.id} onClick={() => setSelectedGoalId(g.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-md border ${active ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent"}`}>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="font-mono">#{String(i + 1).padStart(2, "0")}</span>
                    <span>{l?.icon}</span>
                    <span className="truncate">{l?.name ?? g.labSlug}</span>
                  </div>
                  <div className="mt-0.5 text-xs font-medium truncate">{g.title}</div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-xl border border-border/60 bg-card/40 backdrop-blur p-5">
          {!selected && <div className="text-sm text-muted-foreground text-center py-16">Select or add a goal to configure it.</div>}
          {selected && (
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Edit goal</h3>
                <button onClick={() => removeGoal(selected.id)} className="text-[11px] px-2 py-1 rounded-md border border-destructive/40 text-destructive hover:bg-destructive/10 inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Remove</button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Title" full><input value={selected.title} onChange={e => patchGoal(selected.id, { title: e.target.value })} className="input" /></Field>
                <Field label="Target lab">
                  <select value={selected.labSlug} onChange={e => patchGoal(selected.id, { labSlug: e.target.value })} className="input">
                    {labs.map(l => <option key={l.slug} value={l.slug}>{l.icon} {l.name}</option>)}
                  </select>
                </Field>
                <Field label="Difficulty">
                  <select value={selected.difficulty} onChange={e => patchGoal(selected.id, { difficulty: e.target.value as HackathonGoal["difficulty"] })} className="input">
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </Field>
                <Field label="XP"><input type="number" value={selected.xp} onChange={e => patchGoal(selected.id, { xp: Number(e.target.value) || 0 })} className="input" /></Field>
                <Field label="Est. minutes"><input type="number" value={selected.estMin} onChange={e => patchGoal(selected.id, { estMin: Number(e.target.value) || 0 })} className="input" /></Field>
              </div>
              <Field label="Description" full><textarea rows={4} value={selected.description} onChange={e => patchGoal(selected.id, { description: e.target.value })} className="input" placeholder="What must the participant deliver?" /></Field>
              <Field label="Starter code / prompt" full><textarea rows={5} value={selected.starterCode ?? ""} onChange={e => patchGoal(selected.id, { starterCode: e.target.value })} className="input font-mono text-xs" placeholder="Optional starter snippet — SQL query stub, shell command scaffold, HTML boilerplate…" /></Field>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Hints" full><textarea rows={3} value={selected.hints ?? ""} onChange={e => patchGoal(selected.id, { hints: e.target.value })} className="input" /></Field>
                <Field label="Solution (admin only)" full><textarea rows={3} value={selected.solution ?? ""} onChange={e => patchGoal(selected.id, { solution: e.target.value })} className="input font-mono text-xs" /></Field>
              </div>
            </div>
          )}
        </section>
      </div>

      <style>{`.input{width:100%;background:transparent;border:1px solid hsl(var(--border));border-radius:6px;padding:6px 10px;font-size:13px;outline:none}
        .input:focus{border-color:hsl(var(--primary))}`}</style>
    </AdminShell>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <div className="text-[11px] text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}

function toLocal(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60000);
    return local.toISOString().slice(0, 16);
  } catch { return ""; }
}
function fromLocal(v: string) {
  if (!v) return undefined;
  try { return new Date(v).toISOString(); } catch { return undefined; }
}
