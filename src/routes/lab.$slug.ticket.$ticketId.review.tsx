import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Code2, File, FileCode2, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tickets } from "@/lib/dummy";
import { TopNav } from "@/components/TopNav";

export const Route = createFileRoute("/lab/$slug/ticket/$ticketId/review")({ component: Review });

type Submission = {
  title: string;
  files: Record<string, string>;
  starters: Record<string, string>;
  elapsed: number;
};

function readSubmission(slug: string, ticketId: string): Submission | null {
  try {
    const raw = sessionStorage.getItem(`ticket-submission:${slug}:${ticketId}`);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!value || typeof value.title !== "string" || typeof value.elapsed !== "number" || !value.files || !value.starters) return null;
    if (!Object.values(value.files).every(content => typeof content === "string") || !Object.values(value.starters).every(content => typeof content === "string")) return null;
    return value;
  } catch { return null; }
}

function Source({ content, label }: { content: string; label: string }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">{label}</div>
      <pre className="overflow-auto p-4 text-xs leading-6 font-mono" aria-label={label}>
        {content.split("\n").map((line, i) => (
          <div key={i} className="flex"><span className="mr-4 w-7 shrink-0 select-none text-right text-muted-foreground/70">{i + 1}</span><code>{line || " "}</code></div>
        ))}
      </pre>
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="flex items-center gap-2 text-base font-semibold text-foreground sm:text-lg">
      <span aria-hidden className="h-4 w-1 rounded-full bg-primary" />
      {children}
    </h2>
  );
}

function Review() {
  const { slug, ticketId } = useParams({ from: "/lab/$slug/ticket/$ticketId/review" });
  const [submission] = useState(() => readSubmission(slug, ticketId));
  const [activeFile, setActiveFile] = useState(() => Object.keys(submission?.files ?? {})[0] ?? "");
  const [showDiff, setShowDiff] = useState(false);
  const ticket = tickets.find(t => t.id === ticketId);
  const paths = Object.keys(submission?.files ?? {}).sort();
  const hasFiles = paths.length > 0;
  const title = submission?.title ?? ticket?.title ?? "Ticket review";

  return (
    <div className="min-h-screen bg-card text-card-foreground">
      <TopNav />
      <main className="w-full px-6 py-6 sm:px-10 sm:py-8">
        <Button asChild variant="ghost" className="-ml-3 text-muted-foreground">
          <Link to="/lab/$slug" params={{ slug }}><ArrowLeft />Back to Reports</Link>
        </Button>
        <header className="pb-4 pt-2">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{ticketId}: {title}</h1>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,264px)_minmax(0,1fr)] lg:gap-10">
          <section aria-labelledby="performance-heading" className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 id="performance-heading" className="text-lg font-semibold text-foreground sm:text-xl">Performance Summary</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Score", value: "40%", tone: "text-red-500" },
                { label: "Grade", value: "F", tone: "text-red-500" },
                { label: "Time Spent", value: "30m", tone: "text-foreground" },
                { label: "YP Earned", value: "0/5", tone: "text-foreground" },
              ].map(stat => (
                <div key={stat.label} className="min-w-0 rounded-xl bg-primary/[0.06] px-3.5 py-3.5">
                  <dt className="truncate text-sm text-muted-foreground">{stat.label}</dt>
                  <dd className={`mt-1 text-xl font-bold tabular-nums ${stat.tone}`}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="solution-heading">
            <div className="mb-3 flex items-center justify-between gap-4">
              <SectionHeading id="solution-heading">Submitted Solution</SectionHeading>
              <Button variant="outline" onClick={() => setShowDiff(value => !value)} aria-pressed={showDiff}>
                <GitCompareArrows />{showDiff ? "View Files" : "View Diff"}
              </Button>
            </div>
            <div className="grid min-h-[420px] grid-cols-[minmax(150px,220px)_minmax(0,1fr)] overflow-hidden rounded-lg border bg-muted/20">
              <aside className="min-w-0 border-r bg-muted/30" aria-label="Submitted files">
                <h3 className="border-b px-3 py-2.5 text-sm font-semibold">Files</h3>
                {hasFiles ? (
                  <nav className="space-y-1 p-2">
                    {paths.map(path => (
                      <Button key={path} variant="ghost" onClick={() => setActiveFile(path)} aria-pressed={activeFile === path} className={`h-auto w-full justify-start gap-2 whitespace-normal px-2 py-2 text-left text-xs ${activeFile === path ? "bg-accent" : ""}`}>
                        <FileCode2 className="shrink-0 text-muted-foreground" />
                        <span className="min-w-0 truncate">{path}</span>
                      </Button>
                    ))}
                  </nav>
                ) : (
                  <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 px-3 text-center">
                    <File className="h-7 w-7" strokeWidth={1.5} />
                    <p className="max-w-44 text-sm leading-6 text-muted-foreground">No files were submitted for this ticket.</p>
                  </div>
                )}
              </aside>
              <div className="min-w-0">
                {hasFiles && submission ? (
                  showDiff ? (
                    <div className="grid h-full grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                      <Source label="Original" content={submission.starters[activeFile] ?? ""} />
                      <Source label="Submitted" content={submission.files[activeFile] ?? ""} />
                    </div>
                  ) : <Source label={activeFile} content={submission.files[activeFile] ?? ""} />
                ) : (
                  <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 px-5 text-center">
                    <Code2 className="h-10 w-10" strokeWidth={1.5} />
                    <p className="text-sm text-muted-foreground">No files were submitted for this ticket.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
