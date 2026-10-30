import { Check, CircleCheck, CircleDashed, Download, GitBranch, Database, Boxes, FileText, ArrowRight, ClipboardCheck, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { DesignEvaluation } from "@/lib/systemDesignEvaluation";

export function EvaluationResults({ result, taskTitle, ticketId, open, onClose }: {
  result: DesignEvaluation; taskTitle: string; ticketId?: string; open: boolean; onClose: () => void;
}) {
  const complete = result.score === 100;
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ ticketId, taskTitle, ...result }, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = `${ticketId ?? "system-design"}-results.json`; link.click(); URL.revokeObjectURL(url);
  };
  const artifacts = [
    { icon: Boxes, label: "Components", value: String(result.artifacts.nodes) },
    { icon: GitBranch, label: "Connections", value: String(result.artifacts.edges) },
    { icon: GitBranch, label: "Sequence", value: result.artifacts.sequence ? "Provided" : "Missing" },
    { icon: Database, label: "DB schema", value: result.artifacts.schema ? "Provided" : "Missing" },
    { icon: FileText, label: "REST APIs", value: String(result.artifacts.apis) },
    { icon: FileText, label: "Notes", value: `${result.artifacts.notes}/4 tabs` },
  ];
  return <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
    <DialogContent className="z-[70] flex max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[720px] flex-col gap-0 overflow-hidden rounded-lg bg-card p-0 text-card-foreground">
      <header className="flex shrink-0 items-center gap-3 border-b px-5 py-4 pr-12">
        <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"><ClipboardCheck className="size-5" /></div>
        <div className="min-w-0"><DialogTitle className="text-base tracking-normal">System Design Evaluation</DialogTitle><DialogDescription className="mt-1 text-xs">Automated structural &amp; requirement checks</DialogDescription></div>
      </header>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="shrink-0 font-mono">{ticketId ?? "SANDBOX"}</span><span className="truncate">/ {taskTitle}</span></div>
        <section className="border-y bg-muted/30 py-5">
          <div className="flex items-center gap-4">
            <div className={`relative grid size-[76px] shrink-0 place-items-center ${complete ? "text-success" : "text-primary"}`}>
              <svg viewBox="0 0 80 80" className="absolute inset-0 size-full -rotate-90" aria-hidden="true"><circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="5" className="text-border" /><circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${result.score * 2.136} 213.6`} /></svg>
              <span className="text-lg font-semibold tabular-nums">{result.score}%</span>
            </div>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-semibold">{result.title}</h2><span className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${complete ? "border-success/20 bg-success/10 text-success" : "border-warning/20 bg-warning/10 text-warning"}`}>{complete ? "Passed" : "Needs work"}</span></div><p className="mt-1 text-xs text-muted-foreground"><b className="text-foreground">{result.score} / 100 pts</b> · {result.passed} of 4 checks satisfied</p></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">{artifacts.map(a => <div key={a.label} className="flex min-w-0 items-center gap-2 text-xs"><a.icon className="size-3.5 shrink-0 text-muted-foreground" /><span className="text-muted-foreground">{a.label}</span><span className="ml-auto font-medium tabular-nums">{a.value}</span></div>)}</div>
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between gap-3"><h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Acceptance criteria &amp; tasks</h3><span className="font-mono text-[11px] text-muted-foreground">{result.passed} of 4 passed</span></div>
          <ol className="space-y-3">{result.checks.map((c, i) => <li key={c.id} className="rounded-lg border p-3.5">
            <div className="flex items-start gap-3"><span className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${c.passed ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{c.passed ? <Check className="size-3.5" /> : i + 1}</span><p className="min-w-0 flex-1 text-xs font-semibold leading-relaxed">{c.title}</p><span className={`shrink-0 rounded border px-1.5 py-1 font-mono text-[10px] ${c.passed ? "border-success/20 text-success" : "text-muted-foreground"}`}>{c.earned} / {c.points} pts</span></div>
            <div className={`mt-3 flex items-start gap-2 rounded-md px-3 py-2.5 text-xs leading-relaxed sm:ml-9 ${c.passed ? "bg-success/5 text-muted-foreground" : "bg-muted/60 text-muted-foreground"}`}>{c.passed ? <CircleCheck className="mt-0.5 size-3.5 shrink-0 text-success" /> : <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-warning" />}<p>{c.feedback}</p></div>
          </li>)}</ol>
        </section>
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"><CircleDashed className="mt-0.5 size-3.5 shrink-0" />Structural checks only. Diagram and API counts indicate presence, not syntax validity. Task reasoning and trade-offs still need review.</p>
      </div>
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-5 py-3.5"><Button variant="ghost" size="sm" onClick={download}><Download className="size-3.5" />Download results</Button><Button size="sm" onClick={onClose}>Continue Designing<ArrowRight className="size-3.5" /></Button></footer>
    </DialogContent>
  </Dialog>;
}