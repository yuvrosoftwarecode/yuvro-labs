import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminShell, Panel, Badge } from "@/components/admin/AdminShell";
import { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { getLab, updateLab, CATEGORIES, DIFFS, type AdminLab } from "@/lib/adminLabs";

export const Route = createFileRoute("/admin/labs/$id/edit")({ component: EditLab });

const STEPS = ["Basic info", "Environment", "Evaluation", "AI Mentor", "Publish"];
const DEFAULT_ENV: Record<string, boolean> = { "VS Code": true, "Terminal": true, "Browser": false, "Database": true, "API Simulator": false, "Docker Environment": false, "Microservices": false, "CI/CD": false };
const DEFAULT_EVAL: Record<string, number> = { Functional: 30, "Code Quality": 20, Security: 15, Performance: 15, Architecture: 10, Testing: 10 };

function EditLab() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [lab, setLab] = useState<AdminLab | null>(null);
  const [step, setStep] = useState(0);
  const [env, setEnv] = useState(DEFAULT_ENV);
  const [evalConf, setEvalConf] = useState(DEFAULT_EVAL);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = getLab(id);
    if (!found) { nav({ to: "/admin/labs" }); return; }
    setLab(found);
  }, [id, nav]);

  if (!lab) return null;

  const set = <K extends keyof AdminLab>(k: K, v: AdminLab[K]) => setLab(s => s ? { ...s, [k]: v } : s);
  const totalWeight = Object.values(evalConf).reduce((a, b) => a + b, 0);

  const save = () => {
    if (!lab.name.trim()) { setError("Lab name is required."); setStep(0); return; }
    if (!lab.description.trim()) { setError("Description is required."); setStep(0); return; }
    if (totalWeight !== 100) { setError(`Evaluation weights must total 100% (currently ${totalWeight}%).`); setStep(2); return; }
    setError(null);
    updateLab(lab.id, {
      name: lab.name, icon: lab.icon, cat: lab.cat, diff: lab.diff,
      tickets: lab.tickets, sprints: lab.sprints, users: lab.users,
      comp: lab.comp, rating: lab.rating, description: lab.description,
    });
    setSaved(true);
    setTimeout(() => nav({ to: "/admin/labs" }), 500);
  };

  return (
    <AdminShell title={`Edit · ${lab.name}`} breadcrumb={["Engineering", "Labs", "Edit"]} right={
      <Link to="/admin/labs" className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent">← Back</Link>
    }>
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button onClick={() => setStep(i)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs ${i === step ? "border-primary bg-primary/10 text-primary" : i < step ? "border-success/40 text-success" : "border-border text-muted-foreground"}`}>
              <span className="grid h-5 w-5 place-items-center rounded-full border text-[10px]">{i < step ? <Check className="h-3 w-3" /> : i + 1}</span>
              {s}
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {error && <div className="mb-4 text-xs px-3 py-2 rounded-md bg-destructive/10 text-destructive border border-destructive/30">{error}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {step === 0 && (
            <Panel title="Basic info">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <Field label="Lab name *"><input value={lab.name} onChange={e => set("name", e.target.value)} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Icon (emoji)"><input value={lab.icon} maxLength={2} onChange={e => set("icon", e.target.value)} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Category">
                  <select value={lab.cat} onChange={e => set("cat", e.target.value)} className="w-full bg-transparent border border-border rounded-md px-3 py-2">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Difficulty">
                  <select value={lab.diff} onChange={e => set("diff", e.target.value as any)} className="w-full bg-transparent border border-border rounded-md px-3 py-2">
                    {DIFFS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Tickets"><input type="number" value={lab.tickets} onChange={e => set("tickets", Number(e.target.value))} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Sprints"><input type="number" value={lab.sprints} onChange={e => set("sprints", Number(e.target.value))} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Active users"><input type="number" value={lab.users} onChange={e => set("users", Number(e.target.value))} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Completion %"><input type="number" min={0} max={100} value={lab.comp} onChange={e => set("comp", Number(e.target.value))} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Rating"><input type="number" step={0.1} min={0} max={5} value={lab.rating} onChange={e => set("rating", Number(e.target.value))} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Description *" full><textarea rows={4} value={lab.description} onChange={e => set("description", e.target.value)} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
              </div>
            </Panel>
          )}
          {step === 1 && (
            <Panel title="Environment configuration">
              <div className="grid sm:grid-cols-2 gap-2">
                {Object.entries(env).map(([k, v]) => (
                  <label key={k} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 cursor-pointer hover:bg-accent">
                    <input type="checkbox" checked={v} onChange={() => setEnv(s => ({ ...s, [k]: !v }))} />
                    <span className="text-sm">{k}</span>
                  </label>
                ))}
              </div>
            </Panel>
          )}
          {step === 2 && (
            <Panel title="Evaluation weights (must total 100)">
              <div className="space-y-3">
                {Object.entries(evalConf).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex items-center justify-between text-xs mb-1"><span>{k}</span><span className="font-mono">{v}%</span></div>
                    <input type="range" min={0} max={50} value={v} onChange={(e) => setEvalConf(s => ({ ...s, [k]: Number(e.target.value) }))} className="w-full" />
                  </div>
                ))}
                <div className={`text-xs ${totalWeight === 100 ? "text-success" : "text-warning"}`}>Total: <span className="font-mono">{totalWeight}%</span></div>
              </div>
            </Panel>
          )}
          {step === 3 && (
            <Panel title="AI Mentor configuration">
              <div className="space-y-3 text-sm">
                {["Hint rules", "Debug rules", "Code review rules", "Learning suggestions"].map(k => (
                  <Field key={k} label={k} full><textarea rows={2} className="w-full bg-transparent border border-border rounded-md px-3 py-2" placeholder={`Guidelines for ${k.toLowerCase()}…`} /></Field>
                ))}
              </div>
            </Panel>
          )}
          {step === 4 && (
            <Panel title="Review & save">
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2"><Badge tone={lab.name ? "success" : "destructive"}>{lab.name ? "ready" : "missing"}</Badge> {lab.name || "Name required"} · {lab.cat} · {lab.diff}</div>
                <div className="flex items-center gap-2"><Badge tone="success">ready</Badge> Environment ({Object.values(env).filter(Boolean).length} tools)</div>
                <div className="flex items-center gap-2"><Badge tone={totalWeight === 100 ? "success" : "warning"}>{totalWeight}%</Badge> Evaluation weights</div>
                <div className="flex items-center gap-2"><Badge tone={lab.description ? "success" : "destructive"}>{lab.description ? "ready" : "missing"}</Badge> Description</div>
                <button onClick={save} disabled={saved} className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-60">
                  {saved ? "Saved — redirecting…" : "Save changes"}
                </button>
              </div>
            </Panel>
          )}

          <div className="flex items-center justify-between">
            <button disabled={step === 0} onClick={() => setStep(s => s - 1)} className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent disabled:opacity-40">← Back</button>
            <button disabled={step === STEPS.length - 1} onClick={() => setStep(s => s + 1)} className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground disabled:opacity-40">Next →</button>
          </div>
        </div>

        <Panel title="Live preview">
          <div className="rounded-lg border border-border/60 p-4">
            <div className="flex items-center gap-2"><span className="text-2xl">{lab.icon}</span><div><div className="font-semibold text-sm">{lab.name}</div><div className="text-[10px] text-muted-foreground">{lab.cat} · {lab.diff}</div></div></div>
            <p className="mt-3 text-xs text-muted-foreground">{lab.description}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="rounded-md border border-border/60 p-2"><div className="font-mono text-sm">{lab.tickets}</div><div className="text-muted-foreground">tickets</div></div>
              <div className="rounded-md border border-border/60 p-2"><div className="font-mono text-sm">{lab.sprints}</div><div className="text-muted-foreground">sprints</div></div>
              <div className="rounded-md border border-border/60 p-2"><div className="font-mono text-sm">{lab.comp}%</div><div className="text-muted-foreground">complete</div></div>
            </div>
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="block text-xs text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}
