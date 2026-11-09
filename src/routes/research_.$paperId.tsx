import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getPapers, type Paper } from "@/data/papers";

export const Route = createFileRoute("/research_/$paperId")({
  loader: ({ params }) => {
    const paper = getPapers().find((p) => p.id === params.paperId);
    if (!paper) throw notFound();
    return { paper };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.paper.title ?? "Paper"} | Yuvro Research` },
      { name: "description", content: loaderData?.paper.description ?? "Paper summary" },
      { property: "og:title", content: loaderData?.paper.title ?? "Paper summary" },
      { property: "og:description", content: loaderData?.paper.description ?? "" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-16 text-sm">
      Paper not found. <Link to="/research" search={{ view: "latest" }} className="text-primary underline">Back to research</Link>
    </div>
  ),
  component: PaperSummaryPage,
});

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const fmtAuthors = (a: string[]) => (a.length <= 3 ? a.join(", ") : `${a.slice(0, 3).join(", ")} and others`);

const simplify = (s: string) =>
  s.replace(/retrieval/gi, "finding relevant information")
    .replace(/latency/gi, "waiting time")
    .replace(/distilled/gi, "trained from a larger model")
    .replace(/regulariser/gi, "training constraint");

const sentences = (s: string) => s.split(/(?<=\.)\s+/).map((x) => x.trim()).filter(Boolean);

type Tab = "summary" | "discussions" | "related";
type Level = "standard" | "simple" | "deep";

function PaperSummaryPage() {
  const { paper } = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("summary");
  const [level, setLevel] = useState<Level>("standard");
  const [asking, setAsking] = useState(false);
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState(false);

  const t = (s: string) => (level === "simple" ? simplify(s) : s);
  const s = paper.summary;
  const sections: { title: string; body: React.ReactNode }[] = [
    { title: "Executive summary", body: <p>{t(s.about)}</p> },
    { title: "The problem", body: <p>{t(s.problem)}</p> },
    { title: "Proposed approach", body: <p>{t(s.approach)}</p> },
    { title: "Key findings", body: <p>{t(s.results)}</p> },
    { title: "Why it matters", body: <p>{t(s.why)}</p> },
    {
      title: "Key takeaways",
      body: (
        <ul className="list-disc space-y-1 pl-5">
          {[...sentences(paper.description), s.results].map((x, i) => <li key={i}>{t(x)}</li>)}
        </ul>
      ),
    },
    { title: "Limitations / what remains unclear", body: <p>{t(s.limits)}</p> },
  ];
  if (level === "deep") {
    sections.push({
      title: "Before you adopt it",
      body: (
        <ul className="list-disc space-y-1 pl-5">
          <li>Reproduce the headline result on a small slice of your own workload.</li>
          <li>Check whether the limitations above apply to your data or users.</li>
          <li>Read the method and evaluation sections of the original paper.</li>
        </ul>
      ),
    });
  }

  const related = getPapers().filter((p) => p.topic === paper.topic && p.id !== paper.id);
  const others = related.length ? related : getPapers().filter((p) => p.id !== paper.id).slice(0, 3);

  const tabCls = (k: Tab) =>
    `-mb-px border-b-2 pb-3 text-sm transition-colors ${tab === k ? "border-brand-orange text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`;
  const levelBtn = (k: Level, label: string) => (
    <Button
      variant={level === k ? "default" : "outline"}
      size="sm"
      aria-pressed={level === k}
      onClick={() => { setLevel(level === k ? "standard" : k); setTab("summary"); }}
    >
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/research" search={{ view: "latest" }} className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
          Back to research
        </Link>

        <header className="mt-6">
          <div className="text-[13px] text-muted-foreground">{paper.topic}</div>
          <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[28px]">{paper.title}</h1>
          <div className="mt-2 text-sm text-muted-foreground">
            {fmtAuthors(paper.authors)} · {paper.source} · {fmtDate(paper.date)} · {paper.citations} citations
          </div>
        </header>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b border-border">
          <nav className="flex gap-6" role="tablist">
            <button role="tab" aria-selected={tab === "summary"} className={tabCls("summary")} onClick={() => setTab("summary")}>Summary</button>
            <button role="tab" aria-selected={tab === "discussions"} className={tabCls("discussions")} onClick={() => setTab("discussions")}>Discussions</button>
            <button role="tab" aria-selected={tab === "related"} className={tabCls("related")} onClick={() => setTab("related")}>Related papers</button>
          </nav>
          <div className="flex flex-wrap gap-2 pb-3">
            <button
              type="button"
              aria-pressed={level === "deep"}
              onClick={() => { setLevel(level === "deep" ? "standard" : "deep"); setTab("summary"); }}
              className="rounded-md bg-brand-orange px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              {level === "deep" ? "Standard summary" : "Go deeper"}
            </button>
          </div>
        </div>

        {asking && (
          <div className="mt-6 border-b border-border pb-6">
            <Textarea value={question} onChange={(e) => { setQuestion(e.target.value); setAsked(false); }} placeholder="What would you like to know about this paper?" rows={3} />
            <div className="mt-3 flex items-center gap-4">
              <Button size="sm" disabled={!question.trim()} onClick={() => setAsked(true)}>Ask</Button>
              {asked && <span className="text-sm text-muted-foreground">Questions are not connected yet, so no answer was generated and no credits were used.</span>}
            </div>
          </div>
        )}

        {tab === "summary" && (
          <>
            <ol className="mt-2">
              {sections.map((sec, i) => (
                <li key={sec.title} className="border-b border-border py-6 last:border-b-0">
                  <h2 className="text-base font-semibold text-foreground">
                    <span className="mr-2">{i + 1}.</span>{sec.title}
                  </h2>
                  <div className="mt-2 text-[15px] leading-relaxed text-foreground/80">{sec.body}</div>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-[13px] text-muted-foreground">
              <span>Sample summary, not live AI. Verify against the original paper. No credits used.</span>
              <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">Read original paper</a>
            </div>
          </>
        )}

        {tab === "discussions" && (
          <p className="py-10 text-sm text-muted-foreground">No discussions yet for this paper.</p>
        )}

        {tab === "related" && (
          <ul>
            {others.map((p: Paper) => (
              <li key={p.id} className="border-b border-border py-5 last:border-b-0">
                <div className="text-[13px] text-muted-foreground">{p.topic} · {p.source} · {fmtDate(p.date)}</div>
                <Link to="/research/$paperId" params={{ paperId: p.id }} onClick={() => { setTab("summary"); setLevel("standard"); }} className="mt-1 block font-medium text-foreground hover:underline underline-offset-4">{p.title}</Link>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
