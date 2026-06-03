import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell, Panel, Badge } from "@/components/admin/AdminShell";
import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/labs/new")({ component: LabBuilder });

const STEPS = ["Basic info", "Environment", "Evaluation", "AI Mentor", "Publish"];

function LabBuilder() {
  const [step, setStep] = useState(0);
  const [env, setEnv] = useState<Record<string, boolean>>({ "VS Code": true, "Terminal": true, "Browser": false, "Database": true, "API Simulator": false, "Docker Environment": false, "Microservices": false, "CI/CD": false });
  const [evalConf, setEvalConf] = useState<Record<string, number>>({ Functional: 30, "Code Quality": 20, Security: 15, Performance: 15, Architecture: 10, Testing: 10 });

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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {step === 0 && (
            <Panel title="Basic info">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <Field label="Lab name"><input className="w-full bg-transparent border border-border rounded-md px-3 py-2" defaultValue="Payment Service Resilience" /></Field>
                <Field label="Category"><select className="w-full bg-transparent border border-border rounded-md px-3 py-2"><option>Java Backend</option><option>Python</option><option>Frontend/UI</option><option>SQL</option><option>DevOps</option></select></Field>
                <Field label="Difficulty"><select className="w-full bg-transparent border border-border rounded-md px-3 py-2"><option>Easy</option><option>Medium</option><option>Hard</option></select></Field>
                <Field label="Estimated duration (hrs)"><input type="number" defaultValue={6} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Skills covered" full><input placeholder="Exception handling, Retry logic, Idempotency…" className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Industry tags" full><input placeholder="Fintech, Payments, Banking" className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
                <Field label="Description" full><textarea rows={4} className="w-full bg-transparent border border-border rounded-md px-3 py-2" defaultValue="Build a resilient payment retry layer with idempotency, exponential backoff and observability." /></Field>
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
                <div className="text-xs text-muted-foreground">Total: <span className="font-mono">{Object.values(evalConf).reduce((a,b)=>a+b,0)}%</span></div>
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
                <div className="flex items-center gap-2"><Badge tone="success">ready</Badge> Basic info complete</div>
                <div className="flex items-center gap-2"><Badge tone="success">ready</Badge> Environment configured</div>
                <div className="flex items-center gap-2"><Badge tone="success">ready</Badge> Evaluation weights total 100%</div>
                <div className="flex items-center gap-2"><Badge tone="success">ready</Badge> AI Mentor rules saved</div>
                <button className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">Publish lab</button>
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
