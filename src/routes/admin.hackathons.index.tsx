import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminShell, Badge, KpiCard } from "@/components/admin/AdminShell";
import { Plus, Trophy, Trash2, Pencil, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { listHackathons, createHackathon, deleteHackathon, type Hackathon } from "@/lib/hackathons";

export const Route = createFileRoute("/admin/hackathons/")({ component: HackathonsAdmin });

function HackathonsAdmin() {
  const [items, setItems] = useState<Hackathon[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const nav = useNavigate();

  useEffect(() => { setItems(listHackathons()); }, []);
  const refresh = () => setItems(listHackathons());

  const create = () => {
    const title = name.trim();
    if (!title) return;
    const h = createHackathon({ title, description: "", isActive: true });
    setShowNew(false); setName("");
    nav({ to: "/admin/hackathons/$id", params: { id: h.id } });
  };

  const totalGoals = items.reduce((a, h) => a + h.goals.length, 0);
  const active = items.filter(h => h.isActive).length;

  return (
    <AdminShell title="Hackathons" breadcrumb={["Engineering", "Hackathons"]} right={
      <button onClick={() => setShowNew(true)} className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> New hackathon</button>
    }>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <KpiCard label="Total hackathons" value={items.length} color="primary" icon={Trophy} />
        <KpiCard label="Active" value={active} color="success" />
        <KpiCard label="Goals defined" value={totalGoals} color="warning" icon={Target} />
      </div>

      <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground bg-muted/20">
              <tr>{["Hackathon","Theme","Goals","Status","Actions"].map(h => <th key={h} className="text-left font-medium px-4 py-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground text-xs">No hackathons yet. <button onClick={() => setShowNew(true)} className="text-primary hover:underline">Create one →</button></td></tr>
              )}
              {items.map(h => (
                <tr key={h.id} className="border-t border-border/40 hover:bg-accent/30 align-top">
                  <td className="px-4 py-2.5 font-medium">
                    <div className="min-w-0">
                      <div>{h.title}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[320px]">{h.description || "—"}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{h.theme || "—"}</td>
                  <td className="px-4 py-2.5"><Badge tone="primary">{h.goals.length}</Badge></td>
                  <td className="px-4 py-2.5"><Badge tone={h.isActive ? "success" : "muted"}>{h.isActive ? "Active" : "Draft"}</Badge></td>
                  <td className="px-4 py-2.5 text-xs">
                    <div className="flex items-center gap-3">
                      <Link to="/admin/hackathons/$id" params={{ id: h.id }} className="text-primary hover:underline inline-flex items-center gap-1"><Pencil className="h-3 w-3" /> Edit</Link>
                      <button onClick={() => setConfirmId(h.id)} className="text-destructive hover:underline inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4" onClick={() => setShowNew(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-sm rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-sm">Create hackathon</h3>
            <label className="mt-3 block text-xs text-muted-foreground">Name</label>
            <input autoFocus value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && create()}
              placeholder="e.g. FinTech 48h Sprint"
              className="mt-1 w-full text-sm px-3 py-1.5 rounded-md border border-border bg-transparent" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowNew(false)} className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent">Cancel</button>
              <button onClick={create} className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Create</button>
            </div>
          </div>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4" onClick={() => setConfirmId(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-sm rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-sm">Delete this hackathon?</h3>
            <p className="mt-1 text-xs text-muted-foreground">This removes it from the student side. This cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmId(null)} className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent">Cancel</button>
              <button onClick={() => { deleteHackathon(confirmId); setConfirmId(null); refresh(); }} className="text-xs px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
