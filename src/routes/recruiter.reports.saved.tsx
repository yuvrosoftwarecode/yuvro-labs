import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Play, Trash2 } from "lucide-react";
import { PageHead, Panel, Table, Pill } from "@/components/recruiter/reportsUi";

export const Route = createFileRoute("/recruiter/reports/saved")({
  head: () => ({ meta: [{ title: "Saved Reports — Yuvro Recruiter" }, { name: "robots", content: "noindex" }] }),
  component: SavedReports,
});

interface Saved { id: string; name: string; scope: string; schedule: string; owner: string; updated: string }

const SEED: Saved[] = [
  { id: "1", name: "Weekly hiring summary", scope: "All evaluations", schedule: "Every Monday", owner: "You", updated: "2d ago" },
  { id: "2", name: "Shortlist — Backend Java L2", scope: "Backend Java L2", schedule: "Manual", owner: "You", updated: "5d ago" },
  { id: "3", name: "Drop-off analysis", scope: "All evaluations", schedule: "Monthly", owner: "Talent Ops", updated: "12d ago" },
  { id: "4", name: "Campus cohort performance", scope: "Campus 2026", schedule: "Manual", owner: "You", updated: "3w ago" },
];

function SavedReports() {
  const [rows, setRows] = useState<Saved[]>(SEED);
  const [msg, setMsg] = useState("");

  const run = (r: Saved) => { setMsg(`Running “${r.name}”…`); setTimeout(() => setMsg(""), 1800); };
  const remove = (id: string) => setRows(rs => rs.filter(r => r.id !== id));

  return (
    <div className="space-y-6">
      <PageHead
        title="Saved Reports"
        desc="Reusable report definitions you can run or schedule."
        action={
          <button onClick={() => setRows(rs => [{ id: String(Date.now()), name: `Untitled report ${rs.length + 1}`, scope: "All evaluations", schedule: "Manual", owner: "You", updated: "just now" }, ...rs])} className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-neutral-800">
            <Bookmark className="h-4 w-4" /> New saved report
          </button>
        }
      />
      {msg && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">{msg}</div>}
      <Panel>
        <Table
          head={["Report", "Scope", "Schedule", "Owner", "Updated", ""]}
          rows={rows.map(r => [
            <span className="font-medium">{r.name}</span>,
            r.scope,
            <Pill tone={r.schedule === "Manual" ? "neutral" : "green"}>{r.schedule}</Pill>,
            r.owner,
            r.updated,
            <div className="flex items-center gap-3">
              <button onClick={() => run(r)} className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900"><Play className="h-3.5 w-3.5" /> Run</button>
              <button onClick={() => remove(r.id)} className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>,
          ])}
        />
      </Panel>
    </div>
  );
}
