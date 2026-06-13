import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminShell, Panel, Badge } from "@/components/admin/AdminShell";
import { useState } from "react";
import { Check, ChevronRight, Plus, Trash2 } from "lucide-react";
import { createLab, CATEGORIES, DIFFS, type AdminLab } from "@/lib/adminLabs";
import { EDITORS, LANGUAGES, newSprint, newTask, saveSprints, type LabSprint, type LabTask, type EditorKind, type Language } from "@/lib/labSprints";

export const Route = createFileRoute("/admin/labs/new")({ component: LabBuilder });

const STEPS = ["Basic info", "Sprints", "Environment", "Evaluation", "AI Mentor", "Publish"];

const diffToDifficulty: Record<"Easy" | "Medium" | "Hard", AdminLab["difficulty"]> = {
  Easy: "Beginner", Medium: "Intermediate", Hard: "Advanced",
};

function LabBuilder() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [env, setEnv] = useState<Record<string, boolean>>({ "VS Code": true, "Terminal": true, "Browser": false, "Database": true, "API Simulator": false, "Docker Environment": false, "Microservices": false, "CI/CD": false });
  const [evalConf, setEvalConf] = useState<Record<string, number>>({ Functional: 30, "Code Quality": 20, Security: 15, Performance: 15, Architecture: 10, Testing: 10 });
  const [sprints, setSprintsState] = useState<LabSprint[]>([]);
  const [activeSprint, setActiveSprint] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "🧪",
    cat: "Java Backend",
    diff: "Medium" as "Easy" | "Medium" | "Hard",
    tickets: 12,
    sprints: 4,
    duration: 6,
    skills: "",
    tags: "",
    description: "",
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(s => ({ ...s, [k]: v }));

  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const totalWeight = Object.values(evalConf).reduce((a, b) => a + b, 0);

  const publish = () => {
    if (!form.name.trim()) { setError("Lab name is required."); setStep(0); return; }
    if (!form.description.trim()) { setError("Description is required."); setStep(0); return; }
    if (totalWeight !== 100) { setError(`Evaluation weights must total 100% (currently ${totalWeight}%).`); setStep(2); return; }
    setError(null);
    createLab({
      name: form.name.trim(),
      slug: form.slug,
      icon: form.icon || "🧪",
      cat: form.cat,
      color: "custom",
      diff: form.diff,
      difficulty: diffToDifficulty[form.diff],
      users: 0,
      tickets: form.tickets,
      sprints: form.sprints,
      comp: 0,
      rating: 0,
      description: form.description.trim(),
      duration: form.duration,
      skills: form.skills,
      tags: form.tags,
    });
    setSaved(true);
    setTimeout(() => nav({ to: "/admin/labs" }), 600);
  };

  return (
    <AdminShell title="Lab Builder" breadcrumb={["Engineering", "Labs", "New"]} right={
      <Link to="/admin/labs" className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent">← Cancel</Link>
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
                <Field label="Lab name *"><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Kotlin Coroutines Bootcamp" className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Slug (URL)"><input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="auto-generated from name" className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Icon (emoji)"><input value={form.icon} onChange={e => set("icon", e.target.value)} maxLength={2} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Category">
                  <select value={form.cat} onChange={e => set("cat", e.target.value)} className="w-full bg-transparent border border-border rounded-md px-3 py-2">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Difficulty">
                  <select value={form.diff} onChange={e => set("diff", e.target.value as any)} className="w-full bg-transparent border border-border rounded-md px-3 py-2">
                    {DIFFS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Estimated duration (hrs)"><input type="number" value={form.duration} onChange={e => set("duration", Number(e.target.value))} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Tickets"><input type="number" value={form.tickets} onChange={e => set("tickets", Number(e.target.value))} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Sprints"><input type="number" value={form.sprints} onChange={e => set("sprints", Number(e.target.value))} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Skills covered" full><input value={form.skills} onChange={e => set("skills", e.target.value)} placeholder="Coroutines, Flow, Channels…" className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Industry tags" full><input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="Fintech, Mobile, Backend" className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Description *" full><textarea rows={4} value={form.description} onChange={e => set("description", e.target.value)} placeholder="What learners will build and master in this lab." className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
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
            <Panel title="Review & publish">
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2"><Badge tone={form.name ? "success" : "destructive"}>{form.name ? "ready" : "missing"}</Badge> {form.name || "Name required"} · {form.cat} · {form.diff}</div>
                <div className="flex items-center gap-2"><Badge tone="success">ready</Badge> Environment ({Object.values(env).filter(Boolean).length} tools)</div>
                <div className="flex items-center gap-2"><Badge tone={totalWeight === 100 ? "success" : "warning"}>{totalWeight}%</Badge> Evaluation weights</div>
                <div className="flex items-center gap-2"><Badge tone={form.description ? "success" : "destructive"}>{form.description ? "ready" : "missing"}</Badge> Description</div>
                <button onClick={publish} disabled={saved} className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-60">
                  {saved ? "Published — redirecting…" : "Publish lab"}
                </button>
              </div>
            </Panel>
          )}

          <div className="flex items-center justify-between">
            <button disabled={step === 0} onClick={() => setStep(s => s - 1)} className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent disabled:opacity-40">← Back</button>
            <button disabled={step === STEPS.length - 1} onClick={() => setStep(s => s + 1)} className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground disabled:opacity-40">Next →</button>
          </div>
        </div>

        <Panel title="Builder tips">
          <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
            <li>Start with a clear business problem statement.</li>
            <li>Choose only the environments learners truly need.</li>
            <li>Keep evaluation weights aligned with stated learning outcomes.</li>
            <li>Configure AI Mentor to give Socratic hints, not full answers.</li>
            <li>Preview the lab before publishing — test as a learner.</li>
          </ul>
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
