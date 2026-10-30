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
import YuvroLogo from "@/assets/YuvroLogo.png";

const LANGS = {
  javascript: { label: "JavaScript", ext: "js", ext_fn: () => javascript({ typescript: true }), starter: "function solve(input) {\n  // write your solution\n}\n" },
  python: { label: "Python", ext: "py", ext_fn: () => python(), starter: "def solve(data):\n    # write your solution\n    pass\n" },
  java: { label: "Java", ext: "java", ext_fn: () => java(), starter: "public class Solution {\n  // write your solution\n}\n" },
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
    return <Lobby iv={iv} mic={mic} cam={cam} setMic={setMic} setCam={setCam} onStart={() => setPhase("live")} />;
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
  const [lang, setLang] = useState<keyof typeof LANGS>("java");
  const [code, setCode] = useState<Record<string, string>>({});
  const [micLevel, setMicLevel] = useState(0);
  useEffect(() => {
    if (!codeMode || !p.mic || !navigator.mediaDevices?.getUserMedia) { setMicLevel(0); return; }
    let raf = 0, stream: MediaStream | null = null, ctx: AudioContext | null = null, alive = true;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      if (!alive) { s.getTracks().forEach(t => t.stop()); return; }
      stream = s; ctx = new AudioContext();
      const an = ctx.createAnalyser(); an.fftSize = 512;
      ctx.createMediaStreamSource(s).connect(an);
      const buf = new Uint8Array(an.fftSize);
      const tick = () => {
        an.getByteTimeDomainData(buf);
        let sum = 0; for (const v of buf) { const x = (v - 128) / 128; sum += x * x; }
        setMicLevel(Math.sqrt(sum / buf.length) * 3);
        raf = requestAnimationFrame(tick);
      };
      tick();
    }).catch(() => setMicLevel(0));
    return () => { alive = false; cancelAnimationFrame(raf); stream?.getTracks().forEach(t => t.stop()); ctx?.close(); };
  }, [codeMode, p.mic]);

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

  if (codeMode) {
    const lastAiText = lastAi >= 0 ? p.log[lastAi].text : "";
    const userTalking = !p.speaking && p.mic && micLevel > 0.06;
    const orb = p.speaking ? "bg-[radial-gradient(circle_at_35%_30%,#ffd08a,#f59e42_55%,#b8661c)]" : userTalking ? "bg-[radial-gradient(circle_at_35%_30%,#a8f0c6,#34d399_55%,#0f8a5f)]" : "bg-[radial-gradient(circle_at_35%_30%,#a9bcff,#6b8cf5_55%,#3a55c4)]";
    return (
      <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#0b0f17] text-[#e6e8ee]">
        <div className="relative flex h-12 shrink-0 items-center justify-between border-b border-white/5 bg-[#0b0f17] px-3">
          <div className="flex items-center gap-3">
            <Link to="/mock-interviews" className="flex items-center rounded-md bg-white px-2 py-1"><img src={YuvroLogo} alt="Yuvro" className="h-5 w-auto" /></Link>
            <span className="text-sm font-semibold text-white">{p.title}</span>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#111622] px-2.5 py-1 font-mono text-xs text-white"><Clock className="h-3.5 w-3.5" /> {fmt(p.left)}</span>
          <span />
        </div>

        <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
          <ResizablePanel defaultSize="38%" minSize="25%" maxSize="55%">
            <div className="relative flex h-full flex-col overflow-hidden bg-[#0e1322]" style={{ backgroundImage: "radial-gradient(60% 40% at 0% 100%, rgba(120,60,40,0.22), transparent 70%), radial-gradient(50% 35% at 100% 15%, rgba(60,70,120,0.18), transparent 70%)" }}>
              <div className="px-3 pt-4 text-[11px] font-semibold uppercase tracking-wider text-[#8b93a7]">Conversation</div>
              <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-4 [scrollbar-width:none]">
                <div className="text-xs font-medium text-[#f59e42]">Vitarka AI</div>
                <p className="mt-1.5 text-[15px] leading-relaxed text-white">{lastAiText}{p.speaking && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[#f59e42]" />}</p>
                <div ref={p.endRef} />
              </div>
              <div className="space-y-2 p-2.5">
                <div className={`flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-colors ${userTalking ? "border-[#34d399]/30 bg-[#0f1f1c]" : "border-white/5 bg-[#121827]"}`}>
                  <span className={`h-8 w-8 shrink-0 rounded-full transition-transform ${orb}`} style={{ transform: userTalking ? `scale(${1 + Math.min(0.25, micLevel)})` : undefined, boxShadow: userTalking ? "0 0 18px rgba(52,211,153,0.5)" : undefined }} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white">{p.speaking ? "Vitarka AI is speaking" : userTalking ? "You're speaking" : p.mic ? "Listening to you" : "Mic is off"}</div>
                    <div className="text-xs text-[#8b93a7]">{p.speaking ? "Listen to the full question first" : userTalking ? "Go on, Vitarka is listening." : p.mic ? "Take your time. Speak or type your answer." : "Turn on your mic or type your answer."}</div>
                  </div>
                  <div className="flex h-7 items-center gap-[3px]">
                    {Array.from({ length: 22 }).map((_, k) => {
                      const h = p.speaking ? 6 + ((k * 7) % 18) : userTalking ? Math.max(3, Math.min(26, micLevel * 90 * (0.5 + Math.abs(Math.sin(k * 1.7 + Date.now() / 120))))) : 2;
                      return <span key={k} className={`w-[2px] rounded-full ${p.speaking ? "animate-pulse bg-[#f59e42]" : userTalking ? "bg-[#34d399]" : "bg-[#6b8cf5]/70"}`} style={{ height: h, animationDelay: `${k * 60}ms` }} />;
                    })}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <input value={p.draft} onChange={e => p.setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") p.submit(); }} placeholder="Type your answer, or just speak" className="h-9 min-w-0 flex-1 rounded-lg border border-white/5 bg-[#121827] px-3 text-sm text-white outline-none placeholder:text-[#6b7285] focus:border-[#6b8cf5]/50" />
                  <button onClick={p.submit} disabled={!p.draft.trim()} className="h-9 rounded-lg bg-[#6b8cf5] px-3.5 text-sm font-semibold text-[#0b0f17] hover:bg-[#7d9bff] disabled:opacity-60">Send</button>
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle className="bg-white/5" />
          <ResizablePanel defaultSize="62%" minSize="40%">
            <div className="flex h-full min-w-0 flex-col bg-[#1e1e1e]">
              <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-black/40 bg-[#181818] px-3">
                <span className="font-mono text-sm text-[#a0a6b4]">Solution.{LANGS[lang].ext}</span>
                <div className="flex items-center gap-2">
                  <select value={lang} onChange={e => setLang(e.target.value as keyof typeof LANGS)} className="h-8 w-[100px] rounded-md border border-white/10 bg-[#1e1e1e] px-2 text-sm text-white outline-none">
                    {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <button onClick={submitCode} className="h-8 rounded-md bg-[#6b8cf5] px-3 text-sm font-semibold text-[#0b0f17] hover:bg-[#7d9bff]">Submit code</button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto">
                <CodeMirror value={current} onChange={v => setCode(c => ({ ...c, [lang]: v }))} theme={vscodeDark} extensions={[LANGS[lang].ext_fn()]} height="100%" className="h-full text-sm [&_.cm-editor]:h-full [&_.cm-gutters]:!bg-[#1e1e1e] [&_.cm-gutters]:!border-0" basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false }} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        <div className="flex h-[74px] shrink-0 items-center justify-center bg-[#0b0f17]">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0e1320] p-1.5">
            {[
              { l: p.mic ? "Mute" : "Unmute", f: () => p.setMic(!p.mic), i: p.mic ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-[#e06c6c]" /> },
              { l: p.cam ? "Turn camera off" : "Turn camera on", f: () => p.setCam(!p.cam), i: p.cam ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4 text-[#e06c6c]" /> },
              { l: "Type answer", f: () => setChat(!chat), i: <MessageSquare className="h-4 w-4" /> },
              { l: "Close code editor", f: () => setCodeMode(false), i: <Code2 className="h-4 w-4" /> },
            ].map(b => (
              <button key={b.l} onClick={b.f} aria-label={b.l} title={b.l} className="grid h-10 w-11 place-items-center rounded-lg border border-white/5 bg-[#1a2030] text-white hover:bg-[#232a3d]">{b.i}</button>
            ))}
            <button onClick={p.onEnd} aria-label="End interview" className="grid h-10 w-11 place-items-center rounded-lg bg-[#c94b4b] text-white hover:bg-[#d65a5a]"><PhoneOff className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    );
  }

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
          <ResizablePanelGroup orientation="horizontal" className="relative z-10 min-h-0 flex-1 pb-20">
            <ResizablePanel defaultSize="28%" minSize="20%" maxSize="50%">
              <div className="flex h-full flex-col gap-4 overflow-hidden p-5">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Conversation</div>
                {transcript(true)}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="72%" minSize="40%">
              <div className="flex h-full min-w-0 flex-col">
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4 py-2 text-xs">
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

const FUEL = [
  "One mock interview teaches more than three hours of passive videos.",
  "Your future production bug is practising on you today. Be kind to it.",
  "Interviewers remember clear thinking more than perfect answers.",
  "Saying \"I'm not sure, but here's how I'd find out\" is a great answer.",
];

const FEATURES = [
  { icon: "🎙️", title: "AI voice interviewer", body: "It speaks, listens and reacts to your voice in real time.", cls: "bg-[#86E0A8]" },
  { icon: "🎯", title: "Feels like the real thing", body: "Same pace and pressure as a live panel, minus the sweaty palms.", cls: "bg-[#E87565]" },
  { icon: "🔁", title: "Smart follow-ups", body: "Say \"HashMap\" and it will ask what happens on a collision.", cls: "bg-[#7B9CF2]" },
  { icon: "📝", title: "Detailed feedback", body: "Get a clear report: what you nailed and exactly what to improve.", cls: "bg-[#F0D45C]" },
];

function Lobby({ iv, mic, cam, setMic, setCam, onStart }: {
  iv: { name: string; icon: string }; mic: boolean; cam: boolean;
  setMic: (v: boolean) => void; setCam: (v: boolean) => void; onStart: () => void;
}) {
  const words = iv.name.replace(/\s+(Engineer|Developer|Interview)$/i, "").split(" ");
  const [first, rest] = [words[0], words.slice(1).join(" ")];
  const [fuel, setFuel] = useState(0);
  const vid = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => { const t = setInterval(() => setFuel(f => (f + 1) % FUEL.length), 4000); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (!cam) { setLive(false); return; }
    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: true }).then(s => {
      stream = s; if (vid.current) { vid.current.srcObject = s; setLive(true); }
    }).catch(() => setLive(false));
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [cam]);

  return (
    <div className="min-h-screen bg-white font-sans text-[#1B1340]">
      <div className="px-6 pt-4">
        <Link to="/mock-interviews" className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-[#1B1340]/70 hover:bg-[#1B1340]/5"><ArrowLeft className="h-4 w-4" /> Back</Link>
      </div>
      <div className="mx-auto mt-2 max-w-6xl px-6">
        <div className="flex items-center gap-4 rounded-2xl border border-[#F0D45C] bg-[#FFF8DB] px-5 py-3">
          <span className="text-3xl leading-none">😊</span>
          <div>
            <div className="text-base font-semibold md:text-lg">All the best, buddy! You've got this.</div>
            <div className="text-xs text-[#1B1340]/60">Take a breath — this is practice, so every answer helps you grow.</div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 grid max-w-6xl gap-8 px-6 pb-12 md:grid-cols-2">
        <div>
          <h1 className="font-bold leading-[1] tracking-tight">
            <span className="inline-block -rotate-2 rounded-lg bg-[#F97316] px-3 pb-1 text-4xl text-white md:text-5xl">{first}</span>
            {rest && <span className="mt-1 block text-4xl md:text-5xl">{rest}</span>}
          </h1>
          <p className="mt-4 max-w-md text-sm text-[#1B1340]/70">Your first round is a friendly chat, not an exam. Talk it out like you would with a teammate.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className={`rounded-xl p-4 text-[#1B1340] transition-transform hover:-translate-y-0.5 ${f.cls}`}>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="mt-1 text-xs leading-snug text-[#1B1340]/80">{f.body}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-[#1B1340]/25 bg-white p-4">
            <div className="text-[11px] font-medium uppercase tracking-wide text-[#1B1340]/60">Learner fuel</div>
            <div key={fuel} className="mt-1 animate-fade-in text-sm font-medium">{FUEL[fuel]}</div>
          </div>
        </div>
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#1B1340]">
            <video ref={vid} autoPlay muted playsInline className={`h-full w-full scale-x-[-1] object-cover ${live ? "" : "hidden"}`} />
            {!live && (
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-5xl">🙂</div>
                  <p className="mt-4 text-sm text-white/80">{cam ? "Waiting for camera…" : "Camera is off. Turn it on to practise eye contact."}</p>
                </div>
              </div>
            )}
            <span className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">You</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LobbyToggle on={mic} onClick={() => setMic(!mic)} icon={mic ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />} label={mic ? "Mic on" : "Mic off"} />
            <LobbyToggle on={cam} onClick={() => setCam(!cam)} icon={cam ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />} label={cam ? "Camera on" : "Camera off"} />
            <button onClick={onStart} className="ml-auto rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">Start interview</button>
          </div>
          <p className="mt-3 text-xs text-[#1B1340]/60">Tip: sit near a window, look at the lens, and smile once before you start. Speak or type — pause any time.</p>
        </div>
      </div>
    </div>
  );
}

function LobbyToggle({ on, onClick, icon, label }: { on: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 rounded-full border border-[#1B1340]/20 bg-white px-4 py-1.5 text-sm font-medium hover:bg-[#1B1340]/5">
      {icon} {label} <span className={`h-2 w-2 rounded-full ${on ? "bg-emerald-500" : "bg-[#E87565]"}`} />
    </button>
  );
}
