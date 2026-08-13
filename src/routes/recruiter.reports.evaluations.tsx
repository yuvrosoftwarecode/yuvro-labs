import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { listEvaluations } from "@/lib/recruiter";
import { getCandidates } from "@/lib/recruiterCandidates";
import { PageHead, Panel, Table, Pill } from "@/components/recruiter/reportsUi";

export const Route = createFileRoute("/recruiter/reports/evaluations")({
  head: () => ({ meta: [{ title: "Evaluation Reports — Yuvro Recruiter" }, { name: "robots", content: "noindex" }] }),
  component: EvaluationReports,
});

function EvaluationReports() {
  const evals = useMemo(() => listEvaluations(), []);
  const rows = useMemo(
    () =>
      evals.map(e => {
        const c = getCandidates(e.id, 120);
        const done = c.filter(x => x.status === "Submitted" || x.status === "Completed");
        const avgEci = done.length ? Math.round(done.reduce((a, b) => a + b.eci, 0) / done.length) : 0;
        const shortlisted = c.filter(x => x.hiringStatus === "Shortlisted" || x.hiringStatus === "Selected").length;
        return { e, invited: c.length, done: done.length, avgEci, shortlisted };
      }),
    [evals]
  );

  return (
    <div className="space-y-6">
      <PageHead title="Evaluations" desc="Compare performance across every evaluation you run." />
      <Panel>
        <Table
          head={["Evaluation", "Status", "Candidates", "Submitted", "Completion", "Avg ECI", "Shortlisted", ""]}
          rows={rows.map(r => [
            <span className="font-medium">{r.e.title}</span>,
            <Pill tone={r.e.status === "published" ? "green" : "neutral"}>{r.e.status}</Pill>,
            r.invited.toLocaleString(),
            r.done.toLocaleString(),
            `${r.invited ? Math.round((r.done / r.invited) * 100) : 0}%`,
            r.avgEci,
            r.shortlisted,
            <Link to="/recruiter/evaluations/$id/workspace" params={{ id: r.e.id }} className="text-neutral-500 hover:text-neutral-900">Open</Link>,
          ])}
        />
      </Panel>
    </div>
  );
}
