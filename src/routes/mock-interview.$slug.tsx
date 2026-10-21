import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Clock, ChevronRight, PhoneOff, Sparkles, CheckCircle2, RotateCcw } from "lucide-react";
import { INTERVIEWS, type Category } from "@/lib/mockInterviews";

export const Route = createFileRoute("/mock-interview/$slug")({
  head: () => ({ meta: [{ title: "Vitarka Interview | Yuvro" }, { name: "description", content: "Live AI mock interview with Vitarka." }] }),
  loader: ({ params }) => {
    const i = INTERVIEWS.find(x => x.slug === params.slug);
    if (!i) throw notFound();
    return i;
  },
  component: InterviewScreen,
});

const BANK: Record<Category, { text: string; skill: string }[]> = {
  Backend: [
    { text: "Walk me through how you'd design a REST endpoint to create an order. What validations and status codes would you return?", skill: "API design" },
    { text: "How do you handle database transactions when an operation touches multiple tables?", skill: "Data consistency" },
    { text: "A service's p99 latency doubled after a deploy. How do you investigate?", skill: "Debugging" },
    { text: "Explain how you'd add caching to a read-heavy endpoint and keep it fresh.", skill: "Caching" },
    { text: "How do you secure an API that is called by both mobile apps and other services?", skill: "Security" },
  ],
  Frontend: [
    { text: "Explain what triggers a re-render in React and how you'd prevent unnecessary ones.", skill: "Rendering" },
    { text: "How would you structure state for a large form with dependent fields?", skill: "State management" },
    { text: "A page feels slow on low-end phones. What do you measure first?", skill: "Performance" },
    { text: "How do you make a custom dropdown accessible?", skill: "Accessibility" },
    { text: "Describe how you'd handle loading and error states for data fetching.", skill: "UX patterns" },
  ],
  Data: [
    { text: "Explain the difference between INNER, LEFT and FULL joins with an example.", skill: "SQL" },
    { text: "When would you use a window function instead of GROUP BY?", skill: "Analytics" },
    { text: "A query on a 50M-row table is slow. How do you optimize it?", skill: "Indexing" },
    { text: "How would you model data for a reporting warehouse?", skill: "Data modelling" },
    { text: "How do you ensure data quality in a daily pipeline?", skill: "Pipelines" },
  ],
  "DevOps & Cloud": [
    { text: "Describe a CI/CD pipeline you'd set up for a containerized service.", skill: "CI/CD" },
    { text: "A pod keeps restarting in Kubernetes. How do you diagnose it?", skill: "Kubernetes" },
    { text: "How would you design a VPC for a public web app with a private database?", skill: "Networking" },
    { text: "What metrics and alerts would you set up for a new service?", skill: "Observability" },
    { text: "How do you reduce cloud cost without hurting reliability?", skill: "Cost" },
  ],
  "System Design": [
    { text: "Design a URL shortener. Start with requirements and capacity estimates.", skill: "Requirements" },
    { text: "How would you scale the write path to 10k requests per second?", skill: "Scalability" },
    { text: "Which database would you choose and why? What's your schema?", skill: "Storage" },
    { text: "How do you handle failure of a single region?", skill: "Reliability" },
    { text: "What trade-offs did you make, and what would you revisit?", skill: "Trade-offs" },
  ],
  "AI/ML": [
    { text: "How do you choose an evaluation metric for an imbalanced classification problem?", skill: "Evaluation" },
    { text: "Explain how a retrieval-augmented generation system works end to end.", skill: "RAG" },
    { text: "Your model performs well offline but poorly in production. Why might that be?", skill: "MLOps" },
    { text: "How would you detect and reduce hallucinations in an LLM app?", skill: "Guardrails" },
    { text: "How do you version data and models?", skill: "Reproducibility" },
  ],
  Security: [
    { text: "Explain SQL injection and how you prevent it.", skill: "OWASP" },
    { text: "How does a JWT work and what are its risks?", skill: "Auth" },
    { text: "Walk me through threat modelling a login feature.", skill: "Threat modelling" },
    { text: "How do you store user passwords safely?", skill: "Crypto" },
    { text: "What's the difference between CSRF and XSS?", skill: "Web security" },
  ],
  Behavioural: [
    { text: "Tell me about yourself and why you're interested in this role.", skill: "Introduction" },
    { text: "Describe a time you disagreed with a teammate. How did you resolve it?", skill: "Collaboration" },
    { text: "Tell me about a project you're proud of. What was your role?", skill: "Ownership" },
    { text: "Describe a failure and what you learned from it.", skill: "Growth" },
    { text: "Where do you see yourself in three years?", skill: "Goals" },
  ],
};

const FOLLOWUPS = [
  "Good. Can you give a concrete example from a project?",
  "What trade-offs would you consider there?",
  "How would that change at 10x the scale?",
  "Interesting — what could go wrong with that approach?",
];

function fmt(s: number) { return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; }

function InterviewScreen() {
  const iv = Route.useLoaderData();
  const questions = useMemo(() => BANK[iv.category], [iv.category]);
  const [phase, setPhase] = useState<"lobby" | "live" | "done">("lobby");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [log, setLog] = useState<{ who: "ai" | "me"; text: string }[]>([]);
  useEffect(() => { if (phase === "live" && log.length === 0) setLog([{ who: "ai", text: questions[0].text }]); }, [phase]);
  const [left, setLeft] = useState(iv.minutes * 60);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "live") return;
    const t = setInterval(() => setLeft(v => (v <= 1 ? (setPhase("done"), 0) : v - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "live") return;
    setSpeaking(true);
    const t = setTimeout(() => setSpeaking(false), 2200);
    return () => clearTimeout(t);
  }, [idx, followUp, phase]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [log]);

  const submit = () => {
    if (!draft.trim()) return;
    const next = [...answers, draft.trim()];
    setAnswers(next);
    setDraft("");
    const add: { who: "ai" | "me"; text: string }[] = [{ who: "me", text: draft.trim() }];
    if (!followUp && next.length % 2 === 1 && idx < questions.length - 1) {
      const f = FOLLOWUPS[idx % FOLLOWUPS.length];
      setLog(l => [...l, ...add, { who: "ai", text: f }]);
      setFollowUp(f);
      return;
    }
    if (idx < questions.length - 1) add.push({ who: "ai", text: questions[idx + 1].text });
    setLog(l => [...l, ...add]);
    setFollowUp(null);
    if (idx >= questions.length - 1) setPhase("done");
    else setIdx(idx + 1);
  };

  const q = questions[idx];

  if (phase === "lobby") {
    return (
      <Shell title={iv.name}>
        <div className="mx-auto grid max-w-4xl gap-6 px-6 py-10 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border bg-card p-6">
            <div className="text-4xl">{iv.icon}</div>
            <h1 className="mt-3 text-2xl font-semibold">{iv.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{iv.description}</p>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {questions.length} core questions with follow-ups</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {iv.minutes} minutes · {iv.difficulty} · {iv.role}</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Speak or type your answers</li>
            </ul>
            <button onClick={() => setPhase("live")} className="mt-6 inline-flex w-full items-center justify-center gap-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
              Start interview <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="grid aspect-video place-items-center rounded-2xl border bg-muted/40 text-sm text-muted-foreground">
              {cam ? "Camera preview" : "Camera off"}
            </div>
            <div className="flex gap-2">
              <Toggle on={mic} onClick={() => setMic(!mic)} onIcon={<Mic className="h-4 w-4" />} offIcon={<MicOff className="h-4 w-4" />} label="Mic" />
              <Toggle on={cam} onClick={() => setCam(!cam)} onIcon={<Video className="h-4 w-4" />} offIcon={<VideoOff className="h-4 w-4" />} label="Camera" />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (phase === "done") {
    const score = Math.min(95, 55 + answers.reduce((a, s) => a + Math.min(8, Math.floor(s.length / 40)), 0));
    return (
      <Shell title={iv.name}>
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-primary" /> Vitarka summary</div>
            <div className="mt-3 flex items-end gap-3"><div className="text-5xl font-semibold">{score}</div><div className="pb-2 text-sm text-muted-foreground">/ 100 practice score</div></div>
            <p className="mt-2 text-sm text-muted-foreground">You answered {answers.length} prompts across {Math.min(idx + 1, questions.length)} topics. Longer, example-driven answers score higher.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {questions.map((x, k) => (
                <div key={k} className="rounded-lg border p-3 text-xs">
                  <div className="font-medium">{x.skill}</div>
                  <div className="mt-1 text-muted-foreground">{k <= idx ? "Answered" : "Not reached"}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => { setPhase("lobby"); setIdx(0); setAnswers([]); setLog([]); setFollowUp(null); setLeft(iv.minutes * 60); }} className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-muted"><RotateCcw className="h-4 w-4" /> Retake</button>
              <Link to="/mock-interviews" className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Back to interviews</Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title={iv.name} right={<span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-xs"><Clock className="h-3.5 w-3.5" /> {fmt(left)}</span>}>
      <div className="mx-auto grid h-[calc(100vh-56px)] max-w-6xl gap-4 p-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-4">
          <div className="relative grid flex-1 place-items-center overflow-hidden rounded-2xl border bg-card">
            <div className="flex flex-col items-center">
              <div className={`grid h-28 w-28 place-items-center rounded-full bg-primary/15 ${speaking ? "animate-pulse" : ""}`}>
                <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles className="h-7 w-7" /></div>
              </div>
              <div className="mt-4 flex h-8 items-end gap-1">
                {Array.from({ length: 14 }).map((_, k) => (
                  <span key={k} className="w-1 rounded-full bg-primary transition-all duration-300" style={{ height: speaking ? `${8 + ((k * 37) % 24)}px` : "4px", animation: speaking ? `pulse 0.${4 + (k % 5)}s ease-in-out infinite` : undefined }} />
                ))}
              </div>
              <div className="mt-2 text-sm font-medium">Vitarka</div>
              <div className="text-xs text-muted-foreground">{speaking ? "Speaking…" : "Listening"}</div>
            </div>
            <div className="absolute bottom-3 right-3 grid h-24 w-36 place-items-center rounded-lg border bg-muted text-[11px] text-muted-foreground">{cam ? "You" : "Camera off"}</div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Toggle on={mic} onClick={() => setMic(!mic)} onIcon={<Mic className="h-4 w-4" />} offIcon={<MicOff className="h-4 w-4" />} label="Mic" />
            <Toggle on={cam} onClick={() => setCam(!cam)} onIcon={<Video className="h-4 w-4" />} offIcon={<VideoOff className="h-4 w-4" />} label="Camera" />
            <button onClick={() => setPhase("done")} className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-2 text-xs font-medium text-destructive-foreground"><PhoneOff className="h-4 w-4" /> End</button>
          </div>
        </div>

        <div className="flex min-h-0 flex-col rounded-2xl border bg-card">
          <div className="border-b px-5 py-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>Question {idx + 1} of {questions.length}</span><span>{q.skill}</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-muted"><div className="h-1 rounded-full bg-primary transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} /></div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5 text-sm">
            {log.map((m, k) => <Bubble key={k} who={m.who}>{m.text}</Bubble>)}
            <div ref={endRef} />
          </div>
          <div className="border-t p-4">
            <textarea value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }} rows={3} placeholder={mic ? "Speak or type your answer…" : "Type your answer…"} className="w-full resize-none rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Ctrl/⌘ + Enter to send</span>
              <button onClick={submit} disabled={!draft.trim()} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-40">
                {idx >= questions.length - 1 && !followUp ? "Finish" : "Submit answer"} <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/mock-interviews" className="rounded-md p-1.5 hover:bg-muted"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="text-sm font-semibold">Vitarka · {title}</div>
        </div>
        {right}
      </header>
      {children}
    </div>
  );
}

function Bubble({ who, children }: { who: "ai" | "me"; children: React.ReactNode }) {
  return (
    <div className={`flex ${who === "me" ? "justify-end" : ""}`}>
      <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed ${who === "me" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{children}</div>
    </div>
  );
}

function Toggle({ on, onClick, onIcon, offIcon, label }: { on: boolean; onClick: () => void; onIcon: React.ReactNode; offIcon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs ${on ? "" : "bg-muted text-muted-foreground"}`}>
      {on ? onIcon : offIcon} {label}
    </button>
  );
}
