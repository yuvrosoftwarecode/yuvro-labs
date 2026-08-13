import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { listEvaluations } from "@/lib/recruiter";
import { getCandidates, experienceBucket } from "@/lib/recruiterCandidates";
import { PageHead, Panel, Bar, StatTile } from "@/components/recruiter/reportsUi";

export const Route = createFileRoute("/recruiter/reports/performance")({
  head: () => ({ meta: [{ title: "Performance Reports — Yuvro Recruiter" }, { name: "robots", content: "noindex" }] }),
  component: PerformanceReports,
});

function PerformanceReports() {
  const evals = useMemo(() => listEvaluations(), []);
  const all = useMemo(() => evals.flatMap(e => getCandidates(e.id, 120)), [evals]);
  const done = all.filter(c => c.status === "Submitted" || c.status === "Completed");

  const band = (min: number, max: number) => done.filter(c => c.eci >= min && c.eci < max).length;
  const bands = [
    { label: "90–100 · Exceptional", v: band(90, 101) },
    { label: "80–89 · Strong", v: band(80, 90) },
    { label: "70–79 · Solid", v: band(70, 80) },
    { label: "60–69 · Developing", v: band(60, 70) },
    { label: "Below 60", v: band(0, 60) },
  ];
  const maxBand = Math.max(1, ...bands.map(b => b.v));

  const byExp = new Map<string, number[]>();
  done.forEach(c => {
    const k = experienceBucket(c.experience);
    byExp.set(k, [...(byExp.get(k) ?? []), c.eci]);
  });

  const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);

  return (
    <div className="space-y-6">
      <PageHead title="Performance" desc="How cohorts perform across skills, bands and experience." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Avg ECI" value={avg(done.map(c => c.eci))} hint="Across submitted candidates" />
        <StatTile label="Avg completion time" value={`${avg(done.map(c => c.timeMinutes))} min`} />
        <StatTile label="Top-band share" value={`${done.length ? Math.round((band(80, 101) / done.length) * 100) : 0}%`} hint="ECI 80+" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Score distribution" desc="Candidates by capability band.">
          <div className="space-y-4">
            {bands.map(b => <Bar key={b.label} label={b.label} value={b.v} max={maxBand} />)}
          </div>
        </Panel>
        <Panel title="Average ECI by experience" desc="Where your strongest signal comes from.">
          <div className="space-y-4">
            {[...byExp.entries()].map(([k, xs]) => <Bar key={k} label={k} value={avg(xs)} max={100} suffix="/100" />)}
          </div>
        </Panel>
      </div>
    </div>
  );
}
