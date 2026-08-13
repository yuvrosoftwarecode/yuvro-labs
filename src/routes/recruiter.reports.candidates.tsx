import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { listEvaluations } from "@/lib/recruiter";
import { getCandidates } from "@/lib/recruiterCandidates";
import { PageHead, Panel, Table, Pill, StatTile } from "@/components/recruiter/reportsUi";

export const Route = createFileRoute("/recruiter/reports/candidates")({
  head: () => ({ meta: [{ title: "Candidate Reports — Yuvro Recruiter" }, { name: "robots", content: "noindex" }] }),
  component: CandidateReports,
});

function CandidateReports() {
  const [q, setQ] = useState("");
  const evals = useMemo(() => listEvaluations(), []);
  const all = useMemo(
    () => evals.flatMap(e => getCandidates(e.id, 120).map(c => ({ ...c, evalTitle: e.title }))),
    [evals]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = s
      ? all.filter(c => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.college.toLowerCase().includes(s))
      : all;
    return [...base].sort((a, b) => b.eci - a.eci).slice(0, 60);
  }, [all, q]);

  const tone = (h: string) => (h === "Shortlisted" || h === "Selected" ? "green" : h === "Rejected" ? "red" : "amber");

  return (
    <div className="space-y-6">
      <PageHead title="Candidates" desc="Cross-evaluation candidate reporting, ranked by capability." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Total candidates" value={all.length.toLocaleString()} />
        <StatTile label="Shortlisted" value={all.filter(c => c.hiringStatus === "Shortlisted" || c.hiringStatus === "Selected").length.toLocaleString()} />
        <StatTile label="Pending review" value={all.filter(c => c.hiringStatus === "Pending Review").length.toLocaleString()} />
      </div>

      <Panel title="Top candidates" desc="Showing the highest 60 by Engineering Capability Index." right={
        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search candidates…" className="w-full rounded-lg border border-black/10 bg-white py-1.5 pl-9 pr-3 text-[12px] outline-none focus:border-black/30" />
        </div>
      }>
        <Table
          head={["Candidate", "Evaluation", "ECI", "Labs", "Assessment", "Vitarka", "Status"]}
          rows={filtered.map(c => [
            <div><div className="font-medium">{c.name}</div><div className="text-[11px] text-neutral-500">{c.email}</div></div>,
            c.evalTitle,
            c.eci,
            c.labs,
            c.assessment,
            c.vitarka,
            <Pill tone={tone(c.hiringStatus)}>{c.hiringStatus}</Pill>,
          ])}
        />
      </Panel>
    </div>
  );
}
