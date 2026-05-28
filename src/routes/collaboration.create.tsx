import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/collaboration/create")({ component: CreateSquad });

const steps = ["Details", "Roles", "Template", "Visibility", "Matchmaking"] as const;

function CreateSquad() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    objective: "",
    difficulty: "Intermediate",
    duration: "5 days",
    description: "",
    roles: [] as string[],
    template: "",
    visibility: "Public",
    aiMatch: true,
    publicJoin: true,
    minRep: 70,
  });

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const launch = () => navigate({ to: "/collaboration/squad/$id", params: { id: "s1" } });

  const toggleRole = (r: string) => setForm(f => ({ ...f, roles: f.roles.includes(r) ? f.roles.filter(x => x !== r) : [...f.roles, r] }));

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Create a Squad</h1>
      <p className="text-sm text-muted-foreground mt-1">Launch a sprint workspace and assemble your engineering team.</p>

      <div className="flex items-center gap-2 mt-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-7 w-7 grid place-items-center rounded-full text-xs font-medium ${i < step ? "bg-success text-success-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"}`}>
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`text-xs ${i === step ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border bg-card p-6 space-y-4">
        {step === 0 && (
          <>
            <Field label="Squad Name"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Team Velocity" className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></Field>
            <Field label="Sprint Objective"><input value={form.objective} onChange={e => setForm({ ...form, objective: e.target.value })} placeholder="What will this squad ship?" className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Difficulty">
                <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </Field>
              <Field label="Sprint Duration">
                <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option>2 days</option><option>5 days</option><option>7 days</option><option>2 weeks</option>
                </select>
              </Field>
            </div>
            <Field label="Description"><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></Field>
          </>
        )}
        {step === 1 && (
          <>
            <p className="text-sm text-muted-foreground">Select required roles for this sprint.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Frontend Engineer", "Backend Engineer", "QA Engineer", "DevOps Engineer", "Security Engineer"].map(r => (
                <button key={r} onClick={() => toggleRole(r)} className={`text-sm rounded-md border px-3 py-3 text-left transition ${form.roles.includes(r) ? "border-primary bg-primary/10" : "hover:bg-accent"}`}>
                  {r}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-sm text-muted-foreground">Choose a sprint template — workspace, board, and CI/CD are auto-configured.</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {["Startup Sprint", "Production Bug Sprint", "Security Incident Sprint", "Full Stack Sprint", "Enterprise Workflow Sprint"].map(t => (
                <button key={t} onClick={() => setForm({ ...form, template: t })} className={`text-sm rounded-md border px-3 py-3 text-left transition ${form.template === t ? "border-primary bg-primary/10" : "hover:bg-accent"}`}>
                  <div className="font-medium">{t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Pre-configured board · repo · CI/CD</div>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <p className="text-sm text-muted-foreground">Who can find and join this squad?</p>
            <div className="space-y-2">
              {["Public Squad", "Invite Only", "College Only"].map(v => (
                <button key={v} onClick={() => setForm({ ...form, visibility: v })} className={`w-full text-sm rounded-md border px-3 py-3 text-left transition ${form.visibility === v ? "border-primary bg-primary/10" : "hover:bg-accent"}`}>{v}</button>
              ))}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <label className="flex items-center justify-between rounded-md border p-3"><span className="text-sm">AI recommends teammates</span><input type="checkbox" checked={form.aiMatch} onChange={e => setForm({ ...form, aiMatch: e.target.checked })} /></label>
            <label className="flex items-center justify-between rounded-md border p-3"><span className="text-sm">Allow public join requests</span><input type="checkbox" checked={form.publicJoin} onChange={e => setForm({ ...form, publicJoin: e.target.checked })} /></label>
            <Field label={`Minimum reputation required (${form.minRep})`}><input type="range" min={0} max={100} value={form.minRep} onChange={e => setForm({ ...form, minRep: +e.target.value })} className="w-full" /></Field>

            <div className="rounded-md border bg-background/40 p-3 text-xs text-muted-foreground">
              On launch, we'll auto-create: shared board · workspace · repo · environment · team chat · CI/CD pipeline · analytics dashboard.
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button onClick={back} disabled={step === 0} className="rounded-md border px-4 py-2 text-sm hover:bg-accent disabled:opacity-40">Back</button>
        {step < steps.length - 1
          ? <button onClick={next} className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Continue</button>
          : <button onClick={launch} className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Launch Sprint Workspace</button>
        }
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
