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
      <div className="border-b bg-muted/30 px-4 py-2 text-xs text-muted-foreground">{label}</div>
      <pre className="overflow-auto p-4 text-xs leading-6 font-mono" aria-label={label}>
        {content.split("\n").map((line, i) => (
          <div key={i} className="flex"><span className="mr-4 w-7 shrink-0 select-none text-right text-muted-foreground">{i + 1}</span><code>{line || " "}</code></div>
        ))}
      </pre>
    </div>
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
      <main className="mx-auto max-w-[1080px] px-6 py-6 sm:px-12 sm:py-8">
        <Button asChild variant="ghost" className="-ml-3 text-muted-foreground">
          <Link to="/lab/$slug" params={{ slug }}><ArrowLeft />Back to Reports</Link>
        </Button>
        <header className="pb-4 pt-2">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{ticketId}: {title}</h1>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,21%)_minmax(0,1fr)] lg:gap-10">
          <section aria-labelledby="performance-heading" className="lg:py-1">
            <h2 id="performance-heading" className="text-base font-semibold text-foreground sm:text-lg">Performance Summary</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-0">
              {[
                { label: "Score", value: "40%", tone: "text-red-500" },
                { label: "Grade", value: "F", tone: "text-red-500" },
                { label: "Time Spent", value: "30m", tone: "" },
                { label: "YP Earned", value: "0/5", tone: "" },
              ].map((stat, i) => (
                <div key={stat.label} className={`min-w-0 ${i % 2 ? "border-l pl-4 sm:pl-5" : ""}`}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</dt>
                  <dd className={`mt-1 text-lg font-semibold tabular-nums sm:text-xl ${stat.tone}`}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="solution-heading" className="lg:border-l lg:pl-10">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 id="solution-heading" className="text-base font-semibold text-foreground sm:text-lg">Submitted Solution</h2>
              <Button variant="outline" onClick={() => setShowDiff(value => !value)} aria-pressed={showDiff}>
                <GitCompareArrows />{showDiff ? "View Files" : "View Diff"}
              </Button>
            </div>
            <div className="grid min-h-[380px] grid-cols-[minmax(120px,17%)_minmax(0,1fr)] overflow-hidden rounded-md border bg-muted/20">
              <aside className="min-w-0 border-r" aria-label="Submitted files">
                <h3 className="border-b px-3 py-2.5 text-sm font-semibold">Files</h3>
                {hasFiles ? (
                  <nav className="space-y-1 p-2">
                    {paths.map(path => (
                      <Button key={path} variant="ghost" onClick={() => setActiveFile(path)} aria-pressed={activeFile === path} className={`h-auto w-full justify-start whitespace-normal px-2 py-2 text-left text-xs ${activeFile === path ? "bg-accent" : ""}`}>
                        <FileCode2 className="shrink-0" /><span className="min-w-0 break-all">{path}</span>
                      </Button>
                    ))}
                  </nav>
                ) : (
                  <div className="flex min-h-[330px] flex-col items-center justify-center gap-3 px-3 text-center">
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
                  <div className="flex h-full min-h-[380px] flex-col items-center justify-center gap-3 px-5 text-center">
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
