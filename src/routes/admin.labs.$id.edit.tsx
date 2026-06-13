import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminShell, Panel } from "@/components/admin/AdminShell";
import { useEffect, useState } from "react";
import { getLab, updateLab, CATEGORIES, DIFFS, type AdminLab } from "@/lib/adminLabs";

export const Route = createFileRoute("/admin/labs/$id/edit")({ component: EditLab });

function EditLab() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [lab, setLab] = useState<AdminLab | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = getLab(id);
    if (!found) { nav({ to: "/admin/labs" }); return; }
    setLab(found);
  }, [id, nav]);

  if (!lab) return null;

  const set = <K extends keyof AdminLab>(k: K, v: AdminLab[K]) => setLab(s => s ? { ...s, [k]: v } : s);

  const save = () => {
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
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Panel title="Lab details">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <Field label="Lab name"><input value={lab.name} onChange={e => set("name", e.target.value)} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
              <Field label="Icon"><input value={lab.icon} maxLength={2} onChange={e => set("icon", e.target.value)} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
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
              <Field label="Description" full><textarea rows={4} value={lab.description} onChange={e => set("description", e.target.value)} className="w-full bg-transparent border border-border rounded-md px-3 py-2" /></Field>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Link to="/admin/labs" className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent">Cancel</Link>
              <button onClick={save} disabled={saved} className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground disabled:opacity-60">
                {saved ? "Saved" : "Save changes"}
              </button>
            </div>
          </Panel>
        </div>
        <Panel title="Preview">
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
