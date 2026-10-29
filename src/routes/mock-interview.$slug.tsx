import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Clock, ChevronRight, PhoneOff, MessageSquare, CheckCircle2, RotateCcw, Code2 } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { sql } from "@codemirror/lang-sql";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const LANGS = {
  javascript: { label: "JavaScript", ext: "js", ext_fn: () => javascript({ typescript: true }), starter: "function solve(input) {\n  // write your solution\n}\n" },
  python: { label: "Python", ext: "py", ext_fn: () => python(), starter: "def solve(data):\n    # write your solution\n    pass\n" },
  java: { label: "Java", ext: "java", ext_fn: () => java(), starter: "class Solution {\n    public void solve() {\n        // write your solution\n    }\n}\n" },
  cpp: { label: "C++", ext: "cpp", ext_fn: () => cpp(), starter: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n" },
  sql: { label: "SQL", ext: "sql", ext_fn: () => sql(), starter: "SELECT *\nFROM users;\n" },
};
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

  useEffect(() => { { const el = endRef.current?.parentElement; el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }; }, [log]);

  const submit = (override?: string) => {
    const text = (typeof override === "string" ? override : draft).trim();
    if (!text) return;
    const next = [...answers, text];
    setAnswers(next);
    setDraft("");
    const add: { who: "ai" | "me"; text: string }[] = [{ who: "me", text }];
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
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">Vitarka summary</div>
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
    <LiveRoom
      title={iv.name}
      left={left}
      log={log}
      speaking={speaking}
      mic={mic} setMic={setMic}
      cam={cam} setCam={setCam}
      draft={draft} setDraft={setDraft}
      submit={submit}
      onEnd={() => setPhase("done")}
      progress={`Question ${idx + 1} of ${questions.length} · ${q.skill}`}
      endRef={endRef}
    />
  );
}

function Dots({ active }: { active?: boolean }) {
  return (
    <div className="grid w-3.5 grid-cols-3 gap-[2px]">
      {Array.from({ length: 9 }).map((_, k) => (
        <span key={k} className={`h-[3px] w-[3px] rounded-full bg-success ${active ? "animate-pulse" : ""}`} style={{ animationDelay: `${k * 90}ms` }} />
      ))}
    </div>
  );
}

function LiveRoom(p: {
  title: string; left: number; log: { who: "ai" | "me"; text: string }[]; speaking: boolean;
  mic: boolean; setMic: (v: boolean) => void; cam: boolean; setCam: (v: boolean) => void;
  draft: string; setDraft: (v: string) => void; submit: () => void; onEnd: () => void;
  progress: string; endRef: React.RefObject<HTMLDivElement | null>;
}) {
  const streamRef = useRef<MediaStream | null>(null);
  const [chat, setChat] = useState(false);
  const [camErr, setCamErr] = useState(false);
  const [codeMode, setCodeMode] = useState(false);
  const [lang, setLang] = useState<keyof typeof LANGS>("javascript");
  const [code, setCode] = useState<Record<string, string>>({});

  const videoRef = (el: HTMLVideoElement | null) => {
    if (el && streamRef.current && el.srcObject !== streamRef.current) el.srcObject = streamRef.current;
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (p.cam && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
        stream = s; streamRef.current = s; setCamErr(false);
        document.querySelectorAll<HTMLVideoElement>("video[data-self]").forEach(v => { v.srcObject = s; });
      }).catch(() => setCamErr(true));
    }
    return () => { stream?.getTracks().forEach(t => t.stop()); streamRef.current = null; };
  }, [p.cam]);

  const lastAi = p.log.map(m => m.who).lastIndexOf("ai");

  const transcript = (compact: boolean) => (
    <div
      className={`${compact ? "flex-1 min-h-0" : "max-h-[300px]"} space-y-7 overflow-y-auto pr-2 [scrollbar-width:none]`}
      style={compact ? undefined : { maskImage: "linear-gradient(to bottom, transparent 0, black 30%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 30%)" }}
    >
      {p.log.map((m, k) => (
        <div key={k} className="space-y-2">
          {m.who === "ai" ? <Dots active={p.speaking && k === lastAi} /> : <div className="text-[10px] uppercase tracking-widest text-muted-foreground">You</div>}
          <p className={`${compact ? "text-sm" : "text-[15px]"} leading-relaxed ${m.who === "ai" ? "text-foreground" : "text-muted-foreground"}`}>{m.text}</p>
        </div>
      ))}
      <div ref={p.endRef} />
    </div>
  );

  const camera = (
    <div className="relative aspect-video overflow-hidden rounded-xl border bg-card shadow-2xl">
      {p.cam && !camErr ? (
        <video data-self ref={videoRef} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" />
      ) : (
        <div className="grid h-full place-items-center text-sm text-muted-foreground">{camErr ? "Camera unavailable" : "Camera off"}</div>
      )}
      <div className="absolute bottom-3 right-3 flex h-7 items-end gap-[3px] rounded-md bg-background/70 px-1.5 py-1">
        {[6, 10, 8, 14].map((h, k) => (
          <span key={k} className={`w-[3px] rounded-sm ${p.mic ? "bg-primary" : "bg-muted-foreground"}`} style={{ height: p.mic ? h : 4 }} />
        ))}
      </div>
    </div>
  );

  const current = code[lang] ?? LANGS[lang].starter;
  const submitCode = () => {
    p.setDraft(`\`\`\`${lang}\n${current}\n\`\`\``);
    setTimeout(p.submit, 0);
  };

  return (
    <div className="dark">
      <div className="fixed inset-0 flex flex-col overflow-hidden bg-background text-foreground">
        {/* top bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-border/60 px-6 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Link to="/mock-interviews" className="rounded-md p-1.5 hover:bg-muted"><ArrowLeft className="h-4 w-4" /></Link>
            <span className="font-medium text-foreground">Vitarka · {p.title}</span>
            <span className="hidden sm:inline">{p.progress}</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 font-mono"><Clock className="h-3.5 w-3.5" /> {fmt(p.left)}</span>
        </div>

        {codeMode ? (
          <ResizablePanelGroup direction="horizontal" className="relative z-10 flex-1 pb-20">
            <ResizablePanel defaultSize={34} minSize={22} maxSize={60}>
              <div className="flex h-full flex-col gap-5 p-5">
                {camera}
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Conversation</div>
                {transcript(true)}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={66} minSize={35}>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-mono">solution.{LANGS[lang].ext}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={lang} onChange={e => setLang(e.target.value as keyof typeof LANGS)} className="rounded-md border bg-background px-2 py-1 text-xs outline-none">
                      {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button onClick={submitCode} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 font-medium text-primary-foreground hover:opacity-90">Submit code <ChevronRight className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-auto">
                  <CodeMirror value={current} onChange={v => setCode(c => ({ ...c, [lang]: v }))} theme={vscodeDark} extensions={[LANGS[lang].ext_fn()]} height="100%" className="h-full text-sm [&_.cm-editor]:h-full" basicSetup={{ lineNumbers: true, foldGutter: true }} />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <>
            <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 pb-40 lg:grid-cols-2">
              {transcript(false)}
              {camera}
            </div>
            <VoiceTerrain speaking={p.speaking} listening={p.mic && !p.speaking} />
          </>
        )}

        {/* answer box */}
        {chat && (
          <div className="absolute bottom-24 left-1/2 z-20 w-[min(640px,92vw)] -translate-x-1/2 rounded-xl border bg-card p-3 shadow-2xl">
            <textarea autoFocus value={p.draft} onChange={e => p.setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) p.submit(); }} rows={3} placeholder="Type your answer…" className="w-full resize-none rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Ctrl/⌘ + Enter to send</span>
              <button onClick={p.submit} disabled={!p.draft.trim()} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-40">Send <ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )}

        {/* controls */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-xl border bg-card/90 p-1.5 backdrop-blur">
          <CtrlBtn label={p.mic ? "Mute" : "Unmute"} on={p.mic} onClick={() => p.setMic(!p.mic)}>{p.mic ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}</CtrlBtn>
          <CtrlBtn label={p.cam ? "Turn camera off" : "Turn camera on"} on={p.cam} onClick={() => p.setCam(!p.cam)}>{p.cam ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}</CtrlBtn>
          <CtrlBtn label="Type answer" on={!chat} onClick={() => setChat(!chat)}><MessageSquare className="h-4 w-4" /></CtrlBtn>
          <CtrlBtn label={codeMode ? "Close code editor" : "Open code editor"} on={!codeMode} onClick={() => setCodeMode(!codeMode)}><Code2 className="h-4 w-4" /></CtrlBtn>
          <button onClick={p.onEnd} aria-label="End interview" className="grid h-9 w-11 place-items-center rounded-lg bg-destructive text-destructive-foreground hover:opacity-90"><PhoneOff className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({ on, onClick, label, children }: { on: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className={`grid h-9 w-11 place-items-center rounded-lg border transition-colors ${on ? "bg-muted/40 text-foreground hover:bg-muted" : "bg-muted text-muted-foreground"}`}>
      {children}
    </button>
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

/** Perspective dot-matrix landscape that ripples with the conversation. */
function VoiceTerrain({ speaking, listening }: { speaking: boolean; listening: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef({ speaking, listening, energy: 0 });
  state.current.speaking = speaking;
  state.current.listening = listening;

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const css = getComputedStyle(c);
    const primary = "#F97316"; // Yuvro brand orange
    const fg = css.getPropertyValue("--foreground").trim() || "white";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0; let t = 0;
    const resize = () => { const d = window.devicePixelRatio || 1; c.width = c.offsetWidth * d; c.height = c.offsetHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    resize(); window.addEventListener("resize", resize);
    const ROWS = 22, COLS = 72;
    const draw = () => {
      const s = state.current;
      const target = s.speaking ? 1 : s.listening ? 0.35 : 0.12;
      s.energy += (target - s.energy) * 0.05;
      const w = c.offsetWidth, h = c.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (let r = 0; r < ROWS; r++) {
        const z = r / (ROWS - 1);
        const persp = 0.25 + z * 0.75;
        const baseY = h * 0.25 + Math.pow(z, 1.6) * h * 0.75;
        for (let i = 0; i < COLS; i++) {
          const u = i / (COLS - 1) - 0.5;
          const x = w / 2 + u * w * (0.7 + persp * 1.1);
          const d = Math.hypot(u * 2.2, (1 - z) * 1.4);
          const wave = Math.sin(d * 9 - t * 3) * Math.exp(-d * 1.6);
          const lift = wave * 46 * s.energy * persp + Math.sin(u * 6 + t * 0.6 + r) * 3 * persp;
          const glow = Math.max(0, wave) * s.energy;
          ctx.globalAlpha = (0.08 + z * 0.35) * (0.6 + glow * 1.4);
          ctx.fillStyle = glow > 0.25 ? primary : fg;
          ctx.beginPath(); ctx.arc(x, baseY - lift, 0.6 + persp * 1.3 + glow * 1.2, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      t += reduce ? 0 : 0.016;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] w-full"
      style={{ maskImage: "linear-gradient(to top, black 55%, transparent)", WebkitMaskImage: "linear-gradient(to top, black 55%, transparent)" }}
    />
  );
}
