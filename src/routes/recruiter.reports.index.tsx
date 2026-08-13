import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { listEvaluations, evaluationTotals } from "@/lib/recruiter";
import { getCandidates } from "@/lib/recruiterCandidates";
import { PageHead, Panel, StatTile, Bar, Table, Pill } from "@/components/recruiter/reportsUi";

export const Route = createFileRoute("/recruiter/reports/")({
  head: () => ({ meta: [{ title: "Reports Overview — Yuvro Recruiter" }, { name: "robots", content: "noindex" }] }),
  component: ReportsOverview,
});

function ReportsOverview() {
  const evals = useMemo(() => listEvaluations(), []);
  const cands = useMemo(() => evals.flatMap(e => getCandidates(e.id, 120)), [evals]);

  const completed = cands.filter(c => c.status === "Submitted" || c.status === "Completed");
  const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);
  const shortlisted = cands.filter(c => c.hiringStatus === "Shortlisted" || c.hiringStatus === "Selected").length;

  return (
    <div className="space-y-6">
      <PageHead title="Overview" desc="Hiring activity across every evaluation in your workspace." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Evaluations" value={evals.length} hint={`${evals.filter(e => e.status === "published").length} active`} />
        <StatTile label="Candidates" value={cands.length.toLocaleString()} hint={`${completed.length.toLocaleString()} submitted`} />
        <StatTile label="Completion Rate" value={`${cands.length ? Math.round((completed.length / cands.length) * 100) : 0}%`} />
        <StatTile label="Shortlisted" value={shortlisted.toLocaleString()} hint="Across all pipelines" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Average scores" desc="Cohort-wide signal quality.">
          <div className="space-y-4">
            <Bar label="Engineering Capability Index" value={avg(completed.map(c => c.eci))} max={100} suffix="/100" />
            <Bar label="Engineering Labs" value={avg(completed.map(c => c.labs))} max={100} suffix="/100" />
            <Bar label="Knowledge Assessment" value={avg(completed.map(c => c.assessment))} max={100} suffix="/100" />
            <Bar label="Vitarka" value={avg(completed.map(c => c.vitarka))} max={100} suffix="/100" />
          </div>
        </Panel>

        <Panel title="Recent evaluations" desc="Latest activity." right={<Link to="/recruiter/reports/evaluations" className="text-[12px] text-neutral-500 hover:text-neutral-900">View all</Link>}>
          <Table
            head={["Evaluation", "Status", "Invited", "Completed"]}
            rows={evals.slice(0, 6).map(e => {
              const t = evaluationTotals(e);
              return [
                <span className="font-medium">{e.title}</span>,
                <Pill tone={e.status === "published" ? "green" : "neutral"}>{e.status}</Pill>,
                e.candidatesInvited,
                `${e.candidatesCompleted} · ${t.duration ?? 0} min`,
              ];
            })}
          />
        </Panel>
      </div>
    </div>
  );
}
