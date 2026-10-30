import { ArrowRight, CheckCircle2, ChevronDown, ClipboardCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { EvaluationReport } from "@/lib/evaluation";

const statusClass = { passed: "text-success", failed: "text-destructive", pending: "text-warning" };
const marks = (n: number) => Number(n.toFixed(2));

export function EvaluationDrawer({ report, open, onClose }: { report: EvaluationReport; open: boolean; onClose: () => void }) {
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = `${report.context.ticketId}-evaluation.json`; link.click(); URL.revokeObjectURL(url);
  };
  const strengths = report.checks.filter(c => c.status === "passed");
  const improvements = report.checks.filter(c => c.status === "failed");
  const missing = [...new Set(report.checks.flatMap(c => c.missing))];
  return <Sheet open={open} onOpenChange={v => { if (!v) onClose(); }}>
    <SheetContent side="right" overlayClassName="z-[65] bg-background/25" className="z-[70] flex h-dvh w-full flex-col gap-0 overflow-hidden border-l bg-card p-0 text-card-foreground sm:w-[45vw] sm:max-w-none motion-reduce:animate-none motion-reduce:transition-none">
      <header className="shrink-0 border-b px-5 py-5 pr-12">
        <div className="flex items-center gap-2"><ClipboardCheck className="size-4 text-primary" /><SheetTitle className="text-base">Ticket Evaluation</SheetTitle></div>
        <SheetDescription className="mt-2 text-xs leading-relaxed">{report.context.project}{report.context.sprint ? ` / ${report.context.sprint}` : ""} / <span className="font-mono">{report.context.ticketId}</span></SheetDescription>
        <p className="mt-2 text-sm font-medium">{report.context.title}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className={`size-1.5 rounded-full ${report.pending ? "bg-warning" : report.failed ? "bg-destructive" : "bg-success"}`} />{report.status}</span>
      </header>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <section className="space-y-4 border-b pb-5">
          <div className="flex items-end justify-between gap-3"><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Overall score</p><p className="mt-1 text-2xl font-semibold tabular-nums">{report.score === null ? "Awaiting review" : `${marks(report.score)} / ${marks(report.maxMarks)}`}<span className="ml-1 text-xs font-normal text-muted-foreground">{report.score === null ? "" : "pts"}</span></p></div><span className="shrink-0 text-xs text-muted-foreground">{report.completion}% verified</span></div>
          <div className="grid grid-cols-3 divide-x border-y py-3">{[{ label: "Passed", n: report.passed, cls: "text-success" }, { label: "Failed", n: report.failed, cls: "text-destructive" }, { label: "Pending", n: report.pending, cls: "text-warning" }].map(s => <div key={s.label} className="text-center"><p className={`text-xl font-semibold tabular-nums ${s.cls}`}>{s.n}</p><p className="text-[11px] text-muted-foreground">{s.label}</p></div>)}</div>
          <p className="text-xs leading-relaxed text-muted-foreground">{report.context.description}</p>
        </section>
        <section>
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Acceptance criteria · {report.checks.length} checks</h2>
          <div className="space-y-2.5">{report.checks.map(c => <details key={c.id} className="group rounded-lg border" open={c.status === "failed"}>
            <summary className="flex cursor-pointer list-none items-start gap-2 px-3 py-3 [&::-webkit-details-marker]:hidden"><span className={`mt-0.5 shrink-0 text-[10px] font-semibold uppercase ${statusClass[c.status]}`}>{c.status}</span><span className="min-w-0 flex-1 text-xs font-semibold leading-relaxed">{c.title}</span><ChevronDown className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" /></summary>
            <div className="space-y-3 border-t px-3 py-3 text-xs leading-relaxed"><p className="text-muted-foreground">{c.description}</p><div className="flex items-center justify-between"><span>Marks obtained</span><span className="font-mono">{c.marks === null ? "Pending" : marks(c.marks)} / {marks(c.maxMarks)}</span></div><p className="text-muted-foreground">{c.feedback}</p>{c.missing.length > 0 && <div><p className="mb-1 font-medium">Missing requirements</p><ul className="list-disc space-y-1 pl-4 text-muted-foreground">{c.missing.map(m => <li key={m}>{m}</li>)}</ul></div>}</div>
          </details>)}</div>
        </section>
        <section className="space-y-4 border-t pt-4 text-xs leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Evaluation summary</h2>
          <p>Total score: <b>{report.score === null ? "Pending evaluation" : `${marks(report.score)} / ${marks(report.maxMarks)}`}</b></p>
          <div><h3 className="mb-1 font-semibold">Strengths</h3>{strengths.length ? strengths.map(c => <p key={c.id} className="flex gap-2 text-muted-foreground"><CheckCircle2 className="mt-0.5 size-3 shrink-0 text-success" />{c.title}</p>) : <p className="text-muted-foreground">No verified strengths yet.</p>}</div>
          <div><h3 className="mb-1 font-semibold">Areas requiring improvement</h3>{improvements.length ? improvements.map(c => <p key={c.id} className="text-muted-foreground">{c.feedback}</p>) : <p className="text-muted-foreground">{report.pending ? "Unreviewed requirements remain pending, not failed." : "No failed checks."}</p>}</div>
          {missing.length > 0 && <div><h3 className="mb-1 font-semibold">Missing deliverables</h3><ul className="list-disc space-y-1 pl-4 text-muted-foreground">{missing.map(m => <li key={m}>{m}</li>)}</ul></div>}
          <div><h3 className="mb-1 font-semibold">Recommended next steps</h3><p className="text-muted-foreground">{missing.length ? "Add the missing deliverables, then run evaluation again. " : improvements.length ? "Resolve the failed checks and run again. " : "Continue refining the ticket requirements. "}{report.pending > 0 && "Pending criteria need a configured validator or a recorded reviewer assessment before a final score can be issued."}</p></div>
        </section>
      </div>
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t px-4 py-3"><Button variant="ghost" size="sm" onClick={download}><Download className="size-3.5" />Download report</Button><Button size="sm" onClick={onClose}>Continue working<ArrowRight className="size-3.5" /></Button></footer>
    </SheetContent>
  </Sheet>;
}