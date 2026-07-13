import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import {
  ChevronLeft, Calendar, X, Printer, Share2, Download, ArrowUpRight, Trophy, Minus, CheckCircle2, XCircle,
} from "lucide-react";
import { getEvaluation } from "@/lib/recruiter";
import { getCandidates, experienceBucket, vitarkaLabel, type Candidate } from "@/lib/recruiterCandidates";

const search = z.object({
  ids: z.string().default("").catch(""),
});

export const Route = createFileRoute("/recruiter/evaluations/$id/compare")({
  validateSearch: (s) => search.parse(s),
  head: () => ({ meta: [{ title: "Compare Candidates — Yuvro Labs" }, { name: "robots", content: "noindex" }] }),
  component: Compare,
});

interface Row {
  label: string;
  values: (number | string)[];
  higherIsBetter?: boolean;
  format?: (v: number | string) => string;
}

function Compare() {
  const { id } = Route.useParams();
  const { ids } = Route.useSearch();
  const nav = useNavigate();
  const ev = getEvaluation(id);
  const list = ids.split(",").filter(Boolean);
  const all = ev ? getCandidates(ev.id) : [];
  const candidates = useMemo(() => list.map((cid: string) => all.find(c => c.id === cid)).filter(Boolean) as Candidate[], [list, all]);

  if (!ev) return null;

  const backSearch = { tab: "candidates" as const };

  if (candidates.length < 2) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-3xl px-8 py-16 text-center">
          <div className="text-[11px] uppercase tracking-widest text-neutral-500">Compare Candidates</div>
          <h1 className="mt-2 text-[24px] font-medium text-white">Select 2–4 candidates to compare</h1>
          <p className="mt-2 text-[13px] text-neutral-500">Head back to the Candidates tab, tick 2 to 4 rows, and click <b>Compare</b>.</p>
          <Link to="/recruiter/evaluations/$id/workspace" params={{ id: ev.id }} search={backSearch} className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-black">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to candidates
          </Link>
        </div>
      </div>
    );
  }

  const remove = (cid: string) => {
    const next = candidates.filter(c => c.id !== cid).map(c => c.id).join(",");
    if (next.split(",").filter(Boolean).length < 2) return nav({ to: "/recruiter/evaluations/$id/workspace", params: { id: ev.id }, search: backSearch });
    nav({ to: "/recruiter/evaluations/$id/compare", params: { id: ev.id }, search: { ids: next } });
  };

  const scoreRows: Row[] = [
    { label: "Engineering Capability Index", values: candidates.map(c => c.eci), higherIsBetter: true },
    { label: "Engineering Labs", values: candidates.map(c => c.labsScore), higherIsBetter: true },
    { label: "Knowledge Assessment", values: candidates.map(c => c.assessmentScore), higherIsBetter: true },
    { label: "Vitarka Discussion", values: candidates.map(c => c.vitarkaScore), higherIsBetter: true },
    { label: "Communication", values: candidates.map(c => derive(c, 0)), higherIsBetter: true },
    { label: "Problem Solving", values: candidates.map(c => derive(c, 1)), higherIsBetter: true },
    { label: "Architecture", values: candidates.map(c => derive(c, 2)), higherIsBetter: true },
    { label: "Debugging", values: candidates.map(c => derive(c, 3)), higherIsBetter: true },
    { label: "API Development", values: candidates.map(c => derive(c, 4)), higherIsBetter: true },
    { label: "Database", values: candidates.map(c => derive(c, 5)), higherIsBetter: true },
    { label: "Coding", values: candidates.map(c => derive(c, 6)), higherIsBetter: true },
    { label: "System Thinking", values: candidates.map(c => derive(c, 7)), higherIsBetter: true },
    { label: "Leadership", values: candidates.map(c => derive(c, 8)), higherIsBetter: true },
  ];

  const meta: Row[] = [
    { label: "Time Taken", values: candidates.map(c => c.completionMinutes), higherIsBetter: false, format: (v) => `${v} min` },
    { label: "Completion Quality", values: candidates.map(c => c.status), format: (v) => String(v) },
    { label: "Recommendation", values: candidates.map(c => c.recommendation), format: (v) => String(v) },
  ];

  const act = (label: string) => alert(`${label}: applied to ${candidates.length} candidate${candidates.length === 1 ? "" : "s"}.`);

  const download = () => {
    const rows = [["Metric", ...candidates.map(c => c.name)], ...scoreRows.concat(meta).map(r => [r.label, ...r.values.map(String)])];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${ev.title}-comparison.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-black/10 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-8 pt-6 pb-4">
          <Link to="/recruiter/evaluations/$id/workspace" params={{ id: ev.id }} search={backSearch} className="inline-flex items-center gap-1.5 text-[12px] text-neutral-500 hover:text-white">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to workspace
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-neutral-500">Compare · {ev.title}</div>
              <h1 className="mt-1 text-[26px] font-medium tracking-tight text-white">Side by side · {candidates.length} candidates</h1>
              <p className="mt-1 text-[12px] text-neutral-500">Best value on each row is highlighted. Ties are marked "Even".</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <HBtn onClick={() => act("Schedule Interview")} icon={<Calendar className="h-3.5 w-3.5" />}>Schedule Interview</HBtn>
              <HBtn onClick={() => act("Moved to Next Round")} icon={<ArrowUpRight className="h-3.5 w-3.5" />}>Move to Next Round</HBtn>
              <HBtn onClick={() => act("Rejected")} icon={<XCircle className="h-3.5 w-3.5" />} tone="danger">Reject</HBtn>
              <HBtn onClick={download} icon={<Download className="h-3.5 w-3.5" />}>Download</HBtn>
              <HBtn onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Share link copied"); }} icon={<Share2 className="h-3.5 w-3.5" />}>Share</HBtn>
              <HBtn onClick={() => window.print()} icon={<Printer className="h-3.5 w-3.5" />}>Print</HBtn>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-8 py-8">
        {/* Candidate header cards */}
        <div className={`grid gap-3`} style={{ gridTemplateColumns: `240px repeat(${candidates.length}, minmax(0, 1fr))` }}>
          <div />
          {candidates.map(c => (
            <div key={c.id} className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <button onClick={() => remove(c.id)} className="absolute right-2 top-2 rounded p-1 text-neutral-500 hover:bg-white/5 hover:text-white"><X className="h-3.5 w-3.5" /></button>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full text-[13px] font-medium text-white" style={{ background: `linear-gradient(135deg, hsl(${c.avatarHue} 60% 40%), hsl(${(c.avatarHue + 60) % 360} 55% 30%))` }}>
                  {c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-medium text-white">{c.name}</div>
                  <div className="truncate text-[11px] text-neutral-500">{c.email}</div>
                </div>
              </div>
              <dl className="mt-3 space-y-1 text-[11px]">
                <Meta k="Experience" v={`${c.experience}y · ${experienceBucket(c.experience)}`} />
                <Meta k="Company" v={c.company} />
                <Meta k="College" v={c.college} />
                <Meta k="Domain" v={c.domain} />
                <Meta k="Vitarka label" v={vitarkaLabel(c.vitarkaScore)} />
              </dl>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-[30px] font-medium text-white">{c.eci}</div>
                <div className="text-[11px] text-neutral-500">ECI /100</div>
                <div className="ml-auto text-[10px] uppercase tracking-widest text-neutral-500">{c.recommendation}</div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Link to="/recruiter/evaluations/$id/candidates/$candidateId" params={{ id: ev.id, candidateId: c.id }} className="flex-1 rounded-md border border-white/10 px-2 py-1 text-center text-[11px] text-neutral-200 hover:bg-white/5">Full profile</Link>
                <button onClick={() => act(`Resume of ${c.name.split(" ")[0]} opened`)} className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-neutral-200 hover:bg-white/5">Resume</button>
              </div>
            </div>
          ))}
        </div>

        {/* Scoring rows */}
        <SectionHead>Performance</SectionHead>
        <CompareTable rows={scoreRows} candidates={candidates} />

        <SectionHead>Meta &amp; overall</SectionHead>
        <CompareTable rows={meta} candidates={candidates} />

        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-[12px] text-neutral-400">
          <b className="text-white">How to read this:</b> Green cells are the strongest value in the row (or fastest for time).
          Amber = middle of the pack. Red = weakest. Ties are labelled "Even".
        </div>
      </main>
    </div>
  );
}

function derive(c: Candidate, seed: number) {
  // deterministic per-candidate competency score derived from ECI + seed
  const h = (c.id.charCodeAt(0) * (seed + 3) + c.eci * 7 + seed * 17) % 40;
  return Math.max(30, Math.min(98, Math.round(c.eci - 20 + h)));
}

function CompareTable({ rows, candidates }: { rows: Row[]; candidates: Candidate[] }) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-white/5">
      {rows.map((r, ri) => {
        const nums = r.values.every(v => typeof v === "number") ? (r.values as number[]) : null;
        const best = nums ? (r.higherIsBetter ? Math.max(...nums) : Math.min(...nums)) : null;
        const worst = nums ? (r.higherIsBetter ? Math.min(...nums) : Math.max(...nums)) : null;
        const allSame = nums ? nums.every(v => v === nums[0]) : new Set(r.values).size === 1;
        return (
          <div key={r.label} className={`grid items-stretch ${ri % 2 === 1 ? "bg-white/[0.015]" : ""}`} style={{ gridTemplateColumns: `240px repeat(${candidates.length}, minmax(0, 1fr))` }}>
            <div className="border-r border-white/5 px-4 py-3 text-[12px] text-neutral-300">{r.label}</div>
            {r.values.map((v, i) => {
              const isBest = nums && !allSame && v === best;
              const isWorst = nums && !allSame && v === worst && best !== worst;
              const cls = isBest ? "bg-emerald-400/10 text-emerald-300" : isWorst ? "bg-red-400/5 text-red-300" : nums ? "bg-amber-400/5 text-amber-200" : "text-neutral-200";
              return (
                <div key={i} className={`flex items-center justify-between border-r border-white/5 px-4 py-3 text-[13px] last:border-r-0 ${cls}`}>
                  <span className="truncate">{r.format ? r.format(v) : v}</span>
                  {isBest && <Trophy className="h-3.5 w-3.5" />}
                  {allSame && nums && <span className="text-[10px] uppercase tracking-widest text-neutral-500">Even</span>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function HBtn({ children, onClick, icon, tone }: { children: React.ReactNode; onClick: () => void; icon?: React.ReactNode; tone?: "danger" }) {
  const cls = tone === "danger" ? "border-red-500/30 text-red-300 hover:bg-red-500/10" : "border-white/10 text-neutral-200 hover:bg-white/5";
  return <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] ${cls}`}>{icon}{children}</button>;
}
function Meta({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-2"><dt className="text-neutral-500">{k}</dt><dd className="max-w-[60%] truncate text-neutral-200">{v}</dd></div>;
}
function SectionHead({ children }: { children: React.ReactNode }) {
  return <div className="mt-8 text-[11px] uppercase tracking-widest text-neutral-500">{children}</div>;
}
