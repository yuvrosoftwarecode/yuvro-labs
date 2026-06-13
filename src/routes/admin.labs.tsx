import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell, Badge, KpiCard } from "@/components/admin/AdminShell";
import { Plus, FlaskConical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { loadAdminLabs, deleteAdminLab, type AdminLab } from "@/lib/adminLabs";

export const Route = createFileRoute("/admin/labs")({ component: LabsPage });

const CATEGORIES = ["Java Backend","Python","Frontend/UI","SQL","DevOps","Security","System Design","Collaboration"];

const SEED_LABS = [
  { id: "java-backend-001", name: "Java Spring Boot Microservices", cat: "Java Backend", users: 4280, tickets: 92, sprints: 18, diff: "Hard", comp: 64, rating: 4.7 },
  { id: "frontend-002", name: "React E-Commerce UI", cat: "Frontend/UI", users: 3920, tickets: 74, sprints: 14, diff: "Medium", comp: 71, rating: 4.6 },
  { id: "sql-003", name: "SQL Query Optimization", cat: "SQL", users: 3110, tickets: 58, sprints: 9, diff: "Medium", comp: 52, rating: 4.5 },
  { id: "devops-004", name: "CI/CD with GitHub Actions", cat: "DevOps", users: 2540, tickets: 41, sprints: 7, diff: "Medium", comp: 58, rating: 4.4 },
  { id: "security-005", name: "OWASP Top 10 Hardening", cat: "Security", users: 1880, tickets: 36, sprints: 6, diff: "Hard", comp: 42, rating: 4.6 },
  { id: "sysd-006", name: "System Design: Scalable Chat", cat: "System Design", users: 1620, tickets: 28, sprints: 5, diff: "Hard", comp: 38, rating: 4.8 },
  { id: "py-007", name: "Python Data Pipelines", cat: "Python", users: 2210, tickets: 48, sprints: 8, diff: "Medium", comp: 61, rating: 4.5 },
  { id: "collab-008", name: "Cross-Team API Integration", cat: "Collaboration", users: 980, tickets: 22, sprints: 4, diff: "Medium", comp: 55, rating: 4.7 },
];

function LabsPage() {
  const [custom, setCustom] = useState<AdminLab[]>([]);
  useEffect(() => { setCustom(loadAdminLabs()); }, []);

  const labs = [...custom, ...SEED_LABS];

  const remove = (id: string) => {
    deleteAdminLab(id);
    setCustom(loadAdminLabs());
  };

  return (
    <AdminShell title="Labs" breadcrumb={["Engineering", "Labs"]} right={
      <Link to="/admin/labs/new" className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Create new lab</Link>
    }>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Total labs" value={(1284 + custom.length).toLocaleString()} color="primary" icon={FlaskConical} />
        <KpiCard label="Active learners" value="48,127" delta="+12.4%" color="success" />
        <KpiCard label="Avg completion" value="58%" color="ui" />
        <KpiCard label="Avg rating" value="4.6 / 5" color="warning" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent">{c}</button>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground bg-muted/20">
              <tr>{["Lab","Category","Active","Tickets","Sprints","Difficulty","Completion","Rating","Actions"].map(h => <th key={h} className="text-left font-medium px-4 py-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {labs.map(l => {
                const isCustom = custom.some(c => c.id === l.id);
                return (
                  <tr key={l.id} className="border-t border-border/40 hover:bg-accent/30">
                    <td className="px-4 py-2.5 font-medium">
                      {l.name} {isCustom && <Badge tone="success">new</Badge>}
                    </td>
                    <td className="px-4 py-2.5"><Badge tone="primary">{l.cat}</Badge></td>
                    <td className="px-4 py-2.5 font-mono">{l.users.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono">{l.tickets}</td>
                    <td className="px-4 py-2.5 font-mono">{l.sprints}</td>
                    <td className="px-4 py-2.5"><Badge tone={l.diff === "Hard" ? "destructive" : l.diff === "Medium" ? "warning" : "success"}>{l.diff}</Badge></td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-muted/40 overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${l.comp}%` }} /></div>
                        <span className="text-xs">{l.comp}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono">{l.rating}</td>
                    <td className="px-4 py-2.5 text-xs space-x-2">
                      <button className="text-primary hover:underline">Edit</button>
                      <button className="text-muted-foreground hover:underline">Duplicate</button>
                      <button className="text-muted-foreground hover:underline">Analytics</button>
                      {isCustom ? (
                        <button onClick={() => remove(l.id)} className="text-destructive hover:underline inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button>
                      ) : (
                        <button className="text-warning hover:underline">Archive</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
