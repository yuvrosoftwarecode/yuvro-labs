import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FileCheck2,
  MessageSquareText,
  ShieldCheck,
  FileText,
  UserCheck,
  Users,
  TerminalSquare,
  Bot,
  Video,
  Award,
  ArrowRight,
  Folder,
  FileCode2,
  FileJson2,
  BookOpen,
  CircleCheck,
} from "lucide-react";
import rheaAvatar from "@/assets/rhea-kapoor.jpg";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Hire with Proof — Yuvro Labs for Startups" },
      {
        name: "description",
        content:
          "Hiring solutions for high-growth startups. Every candidate arrives with a real solved engineering task and a recorded Vitarka AI interview explaining their decisions. Pay only when they start.",
      },
      { property: "og:title", content: "Hire with Proof — Yuvro Labs for Startups" },
      {
        property: "og:description",
        content:
          "Proof-checked engineers for high-growth startups: real tasks, AI-verified reasoning, pay for hire — not for search.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SolutionsPage,
});

/* ---------------------------------- tokens --------------------------------- */

const T = {
  ink: "#161A1F",
  inkSoft: "#3A4048",
  paper: "#F1F1EC",
  raised: "#FAFAF7",
  line: "#D8D7CF",
  gold: "#B4872E",
  goldDeep: "#8C6620",
  goldTint: "#FAEEDA",
  teal: "#2E5C52",
  tealTint: "#DCEDE7",
  purple: "#6F63A6",
  purpleTint: "#E7E4F4",
  coral: "#B95F3E",
  coralTint: "#F5E2D8",
  blue: "#3D6E93",
  blueTint: "#DCE9F1",
  muted: "#6B6F68",
};

const SERIF = '"Fraunces", ui-serif, Georgia, serif';
const MONO = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

/* ---------------------------------- hooks ---------------------------------- */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function useTyping(text: string, active: boolean, speed = 26, startDelay = 350) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    if (reduced) {
      setN(text.length);
      return;
    }
    setN(0);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setN(i);
      if (i < text.length) timer = setTimeout(tick, speed);
    };
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [active, text, speed, startDelay, reduced]);
  return { typed: text.slice(0, n), done: n >= text.length };
}

/* ------------------------------- small pieces ------------------------------ */

function Eyebrow({ children, color = T.gold }: { children: React.ReactNode; color?: string }) {
  return (
    <p
      className="text-[11px] font-medium uppercase"
      style={{ fontFamily: MONO, letterSpacing: "0.22em", color }}
    >
      {children}
    </p>
  );
}

function ScoreRing({
  value,
  size = 92,
  accent,
  top,
  bottom,
}: {
  value: number;
  size?: number;
  accent: string;
  top: string;
  bottom: string;
}) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={T.line} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={accent}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-[15px] font-semibold leading-none" style={{ color: T.ink, fontFamily: SERIF }}>
          {top}
        </div>
        <div className="mt-1 text-[9px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.12em", color: T.muted }}>
          {bottom}
        </div>
      </div>
    </div>
  );
}

function BarMeter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium" style={{ color: T.inkSoft }}>
          {label}
        </span>
        <span className="text-[10px]" style={{ fontFamily: MONO, color: T.muted }}>
          {value}/100
        </span>
      </div>
      <div className="mt-1.5 h-[6px] rounded-full" style={{ background: T.paper }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: color, transition: "width 700ms ease" }}
        />
      </div>
    </div>
  );
}

/* --------------------------- demo screen 1: report -------------------------- */

function ScreenReport() {
  return (
    <div className="hwp-screen flex h-full flex-col gap-3.5">
      <div className="flex items-center gap-3">
        <img
          src={rheaAvatar}
          alt="Rhea Kapoor"
          loading="lazy"
          width={512}
          height={512}
          className="h-11 w-11 rounded-full border object-cover"
          style={{ borderColor: T.line }}
        />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-tight" style={{ color: T.ink }}>
            Rhea Kapoor
          </p>
          <p className="text-[11px]" style={{ color: T.muted }}>
            Backend engineer · JAVA-101
          </p>
        </div>
        <div className="ml-auto">
          <ScoreRing value={74} size={76} accent={T.teal} top="74" bottom="of 100 · Strong" />
        </div>
      </div>

      <div className="rounded-lg border p-3.5" style={{ borderColor: T.line, background: T.raised }}>
        <p className="mb-2.5 text-[9.5px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.16em", color: T.muted }}>
          Score breakdown
        </p>
        <div className="space-y-2.5">
          <BarMeter label="Engineering labs" value={74} color={T.blue} />
          <BarMeter label="Knowledge" value={55} color={T.purple} />
          <BarMeter label="Vitarka" value={98} color={T.gold} />
        </div>
      </div>

      <div className="rounded-lg border-l-[3px] p-3" style={{ borderColor: T.gold, background: T.goldTint }}>
        <p className="text-[9px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.14em", color: T.goldDeep }}>
          From the Vitarka discussion
        </p>
        <p className="mt-1 text-[12px] italic leading-snug" style={{ color: T.inkSoft }}>
          “Writes are infrequent but must be atomic — a queue adds latency we don’t need here.”
        </p>
      </div>

      <div className="rounded-lg border p-3.5" style={{ borderColor: T.line, background: T.raised }}>
        <div className="flex items-center justify-between">
          <p className="text-[9.5px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.16em", color: T.muted }}>
            Recommendation
          </p>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
            style={{ background: T.goldTint, color: T.goldDeep, border: `1px solid ${T.gold}` }}
          >
            Hold
          </span>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-semibold" style={{ color: T.teal }}>Strengths</p>
            <ul className="mt-1 space-y-1 text-[11px] leading-snug" style={{ color: T.inkSoft }}>
              <li>· Strong hands-on Python/API work</li>
              <li>· Explains decisions clearly</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold" style={{ color: T.coral }}>Areas to explore</p>
            <ul className="mt-1 space-y-1 text-[11px] leading-snug" style={{ color: T.inkSoft }}>
              <li>· System-design depth</li>
              <li>· Transaction management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- demo screen 2: simulation ------------------------ */

const JAVA_CODE = `public class Main {
  public static void main(String[] args) {
    String msg = "Hello Java";
    System.out.println(msg);
  }
}`;

function ScreenSimulation({ active }: { active: boolean }) {
  const { typed, done } = useTyping(JAVA_CODE, active, 18, 500);
  return (
    <div className="hwp-screen flex h-full flex-col overflow-hidden rounded-lg" style={{ background: "#101317" }}>
      {/* IDE top bar */}
      <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: "#23282F", background: "#161A1F" }}>
        <span className="text-[10px] font-semibold" style={{ fontFamily: MONO, color: "#9AA3AD" }}>
          JAVA-101
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background: T.tealTint, color: T.teal }}>
            Completed
          </span>
          <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background: T.blueTint, color: T.blue }}>
            Beginner
          </span>
          <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background: T.goldTint, color: T.goldDeep }}>
            +100 XP
          </span>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-[118px_120px_1fr]">
        {/* task panel */}
        <div className="border-r p-2.5" style={{ borderColor: "#23282F" }}>
          <p className="text-[9px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.12em", color: "#6E7680" }}>
            Variables &amp; Types
          </p>
          <ul className="mt-2 space-y-1.5 text-[10px] leading-snug" style={{ color: "#B9C0C9" }}>
            <li className="flex items-start gap-1.5">
              <CircleCheck className="mt-0.5 h-3 w-3 shrink-0" style={{ color: T.teal }} /> Declare a string
            </li>
            <li className="flex items-start gap-1.5">
              <CircleCheck className="mt-0.5 h-3 w-3 shrink-0" style={{ color: T.teal }} /> Print its length
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full border" style={{ borderColor: "#4A525B" }} /> Read first char
            </li>
          </ul>
        </div>

        {/* file explorer */}
        <div className="border-r p-2.5" style={{ borderColor: "#23282F" }}>
          <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#9AA3AD" }}>
            <Folder className="h-3 w-3" style={{ color: T.gold }} /> java-101
          </div>
          <ul className="mt-1.5 space-y-1 pl-3 text-[10px]">
            <li
              className="flex items-center gap-1.5 rounded px-1 py-0.5"
              style={{ background: "#23282F", color: "#E7EAEE" }}
            >
              <FileCode2 className="h-3 w-3" style={{ color: T.coral }} /> Main.java
            </li>
            <li className="flex items-center gap-1.5 px-1 py-0.5" style={{ color: "#9AA3AD" }}>
              <FileJson2 className="h-3 w-3" style={{ color: T.blue }} /> MainTest.java
            </li>
            <li className="flex items-center gap-1.5 px-1 py-0.5" style={{ color: "#9AA3AD" }}>
              <BookOpen className="h-3 w-3" style={{ color: T.purple }} /> README.md
            </li>
          </ul>
        </div>

        {/* editor */}
        <div className="flex flex-col p-3">
          <pre
            className="flex-1 overflow-hidden text-[10.5px] leading-[1.55]"
            style={{ fontFamily: MONO, color: "#D7DDE4", whiteSpace: "pre-wrap" }}
          >
            {typed}
            {!done && <span className="hwp-caret" style={{ background: T.gold }} />}
          </pre>
          <div
            className="mt-2 rounded-md border p-2.5 transition-opacity duration-700"
            style={{ borderColor: "#2B323B", background: "#161A1F", opacity: done ? 1 : 0 }}
          >
            <p className="text-[8.5px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.14em", color: "#6E7680" }}>
              Live preview
            </p>
            <p className="mt-1 text-[10.5px]" style={{ fontFamily: MONO, color: "#8FD6C2" }}>
              Hello Java · Length: 10 · Char[0]: H
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- demo screen 3: vitarka -------------------------- */

const VITARKA_Q = "Why did casting pi to int truncate instead of round?";

function ScreenVitarka({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const { typed } = useTyping(VITARKA_Q, active, 34, 900);
  const [secs, setSecs] = useState(74);
  useEffect(() => {
    if (!active || reduced) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [active, reduced]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div className="hwp-screen flex h-full flex-col gap-3">
      {/* call header */}
      <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: T.line, background: T.raised }}>
        <span className="relative flex h-2 w-2">
          {!reduced && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: "#C0392B" }} />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#C0392B" }} />
        </span>
        <span className="text-[11.5px] font-medium" style={{ color: T.ink }}>
          Vitarka interview · live
        </span>
        <span className="ml-auto text-[11px]" style={{ fontFamily: MONO, color: T.muted }}>
          {mm}:{ss}
        </span>
      </div>

      <div className="grid flex-1 grid-cols-[1fr_86px] gap-3">
        {/* screen share */}
        <div className="flex flex-col overflow-hidden rounded-lg" style={{ background: "#101317" }}>
          <p className="border-b px-3 py-1.5 text-[9px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.14em", color: "#6E7680", borderColor: "#23282F" }}>
            Screen share · Main.java
          </p>
          <div className="p-3 text-[10.5px] leading-[1.7]" style={{ fontFamily: MONO, color: "#D7DDE4" }}>
            <p>double pi = 3.14159;</p>
            <div className="-mx-3 flex items-center gap-1.5 border-l-2 px-3" style={{ borderColor: T.gold, background: "rgba(180,135,46,0.22)" }}>
              <span>int whole = (int) pi;</span>
              <span
                className="ml-auto grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] font-bold"
                style={{ background: T.gold, color: "#161A1F" }}
              >
                ?
              </span>
            </div>
            <p>System.out.println(whole);</p>
          </div>
          <p className="mt-auto px-3 pb-2 text-[9px]" style={{ fontFamily: MONO, color: "#6E7680" }}>
            Vitarka is asking about the highlighted line
          </p>
        </div>

        {/* participants */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border" style={{ borderColor: T.line, background: T.raised }}>
            <span className="relative grid h-8 w-8 place-items-center rounded-full" style={{ background: T.goldTint }}>
              {!reduced && (
                <span className="absolute h-full w-full animate-ping rounded-full border-2 opacity-50" style={{ borderColor: T.gold }} />
              )}
              <Bot className="h-4 w-4" style={{ color: T.goldDeep }} />
            </span>
            <span className="text-[9px] font-medium" style={{ color: T.inkSoft }}>Vitarka AI</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border" style={{ borderColor: T.line, background: T.raised }}>
            <img
              src={rheaAvatar}
              alt="Candidate"
              loading="lazy"
              width={512}
              height={512}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-[9px] font-medium" style={{ color: T.inkSoft }}>Candidate</span>
          </div>
        </div>
      </div>

      {/* caption bar */}
      <div className="rounded-lg border px-3 py-2.5" style={{ borderColor: T.line, background: "#161A1F" }}>
        <span className="mr-2 text-[9px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.12em", color: T.gold }}>
          Vitarka
        </span>
        <span className="text-[11.5px] italic" style={{ color: "#E7EAEE" }}>
          {typed}
        </span>
      </div>
    </div>
  );
}

/* ------------------------- demo screen 4: proctoring ------------------------ */

function ScreenProctoring() {
  const thumbs = [T.blueTint, T.tealTint, T.goldTint, T.purpleTint, T.coralTint];
  return (
    <div className="hwp-screen flex h-full flex-col gap-3.5">
      <div className="flex items-center gap-3">
        <img
          src={rheaAvatar}
          alt="Rhea Kapoor"
          loading="lazy"
          width={512}
          height={512}
          className="h-11 w-11 rounded-full border object-cover"
          style={{ borderColor: T.line }}
        />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-tight" style={{ color: T.ink }}>
            Rhea Kapoor
          </p>
          <p className="text-[11px]" style={{ color: T.muted }}>
            Proctoring report · JAVA-101
          </p>
        </div>
        <div className="ml-auto">
          <ScoreRing value={96} size={76} accent={T.gold} top="96" bottom="of 100 · Secure" />
        </div>
      </div>

      <div className="rounded-lg border p-3.5" style={{ borderColor: T.line, background: T.raised }}>
        <p className="mb-2 text-[9.5px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.16em", color: T.muted }}>
          Session timeline
        </p>
        <div className="flex h-[10px] overflow-hidden rounded-full">
          <div style={{ width: "18%", background: "#A9ADA6" }} />
          <div style={{ width: "62%", background: T.teal }} />
          <div style={{ width: "20%", background: T.gold }} />
        </div>
        <div className="mt-2 flex items-center gap-4 text-[10px]" style={{ color: T.muted }}>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "#A9ADA6" }} />Setup</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: T.teal }} />Task work</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: T.gold }} />Review</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {thumbs.map((c, i) => (
          <div key={i} className="rounded-md border" style={{ borderColor: T.line, background: c, height: 40 }} />
        ))}
      </div>

      <div className="rounded-lg border p-3.5" style={{ borderColor: T.line, background: T.raised }}>
        <div className="flex items-baseline justify-between">
          <p className="text-[9.5px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.16em", color: T.muted }}>
            Plagiarism check
          </p>
          <span className="text-[10px] font-semibold" style={{ color: T.teal }}>
            2% similarity · Clear
          </span>
        </div>
        <div className="mt-2 h-[6px] rounded-full" style={{ background: T.paper }}>
          <div className="h-full rounded-full" style={{ width: "2%", background: T.teal }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { k: "Tab switches", v: "0" },
          { k: "Copy-paste events", v: "0" },
          { k: "Face on screen", v: "100%" },
        ].map((s) => (
          <div key={s.k} className="rounded-lg border p-2.5 text-center" style={{ borderColor: T.line, background: T.raised }}>
            <p className="text-[16px] font-semibold" style={{ fontFamily: SERIF, color: T.ink }}>
              {s.v}
            </p>
            <p className="mt-0.5 text-[8.5px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.1em", color: T.muted }}>
              {s.k}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- hero demo card ----------------------------- */

const SCREEN_LABELS = ["Evaluation report", "Engineering simulation", "Vitarka interview", "Proctoring report"];

function HeroDemoCard() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % SCREEN_LABELS.length), 5800);
    return () => clearTimeout(t);
  }, [active, reduced]);

  return (
    <div className="rounded-xl border" style={{ borderColor: T.line, background: T.raised }}>
      {/* window chrome */}
      <div className="flex items-center border-b px-4 py-2.5" style={{ borderColor: T.line }}>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#D8D7CF" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#D8D7CF" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#D8D7CF" }} />
        </div>
        <span
          className="ml-auto text-[9.5px] uppercase"
          style={{ fontFamily: MONO, letterSpacing: "0.18em", color: T.muted }}
        >
          {SCREEN_LABELS[active]}
        </span>
      </div>

      {/* active screen only — hidden screens are not in the DOM */}
      <div className="p-4" style={{ minHeight: 480 }}>
        {active === 0 && <ScreenReport />}
        {active === 1 && <ScreenSimulation active={active === 1} />}
        {active === 2 && <ScreenVitarka active={active === 2} />}
        {active === 3 && <ScreenProctoring />}
      </div>

      {/* dot navigation */}
      <div className="flex items-center justify-center gap-2 border-t py-3" style={{ borderColor: T.line }}>
        {SCREEN_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-label={`Show ${label}`}
            onClick={() => setActive(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === active ? 18 : 8,
              background: i === active ? T.gold : T.line,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ process section ----------------------------- */

const STEPS = [
  {
    icon: FileCheck2,
    color: T.blue,
    tint: T.blueTint,
    title: "A real engineering task",
    body: "Not a puzzle. Candidates work inside a live simulation — debugging an existing system, fixing a production-style issue, shipping a feature — matched to the role you're hiring for.",
  },
  {
    icon: MessageSquareText,
    color: T.coral,
    tint: T.coralTint,
    title: "Vitarka asks them to explain it",
    body: "Our AI interviewer reviews their actual solution and asks why they made the decisions they made — grounded in the work they just did, not a rehearsed story.",
  },
  {
    icon: ShieldCheck,
    color: T.gold,
    tint: T.goldTint,
    title: "You get the proof, not just the profile",
    body: "A short report with the task, the solution, and the reasoning behind it — so the first call you take is with someone you already have real evidence on.",
  },
];

function ProcessSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1120px] px-6 py-24">
      <Eyebrow>How a placement works</Eyebrow>
      <h2
        className="mt-4 max-w-2xl text-3xl leading-[1.15] md:text-[40px]"
        style={{ fontFamily: SERIF, fontWeight: 600, color: T.ink }}
      >
        Every candidate goes through the same three steps before you meet them.
      </h2>

      <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {/* arrow bubbles between cards (desktop) */}
        {[1, 2].map((i) => (
          <div
            key={i}
            className="absolute top-16 z-10 hidden h-9 w-9 -translate-x-1/2 place-items-center rounded-full border md:grid"
            style={{
              left: `${(i * 100) / 3}%`,
              borderColor: T.line,
              background: T.raised,
            }}
          >
            <ArrowRight className="h-4 w-4" style={{ color: T.gold }} />
          </div>
        ))}

        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="relative rounded-xl border p-7"
              style={{ borderColor: T.line, background: T.raised }}
            >
              <span
                className="absolute right-5 top-4 text-[12px]"
                style={{ fontFamily: MONO, color: T.line }}
              >
                0{i + 1}
              </span>
              <span
                className="grid h-12 w-12 place-items-center rounded-full"
                style={{ background: s.tint }}
              >
                <Icon className="h-5 w-5" style={{ color: s.color }} />
              </span>
              <h3 className="mt-5 text-[19px] leading-snug" style={{ fontFamily: SERIF, fontWeight: 600, color: T.ink }}>
                {s.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed" style={{ color: T.muted }}>
                {s.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------- pay-for-hire section -------------------------- */

const PIPELINE = [
  { label: "Requirement & JD", icon: FileText, color: "#6B6F68", tint: "#E9E8E2" },
  { label: "Account manager", icon: UserCheck, color: T.purple, tint: T.purpleTint },
  { label: "Recruiter match", icon: Users, color: T.coral, tint: T.coralTint },
  { label: "Real task", icon: TerminalSquare, color: T.blue, tint: T.blueTint },
  { label: "Vitarka interview", icon: Bot, color: T.teal, tint: T.tealTint },
  { label: "Proof report", icon: FileCheck2, color: T.gold, tint: T.goldTint },
  { label: "Your interview", icon: Video, color: T.purple, tint: T.purpleTint },
];

const STATS = [
  { n: "$0", label: "Upfront cost" },
  { n: "20", label: "Average days to hire" },
  { n: "50+", label: "Recruiters sourcing for you" },
  { n: "100%", label: "Candidates proof-checked before you meet them" },
];

function PayForHireSection() {
  return (
    <section style={{ background: T.tealTint }}>
      <div className="mx-auto max-w-[1120px] px-6 py-24">
        <Eyebrow>How you pay</Eyebrow>
        <h2
          className="mt-4 text-3xl leading-[1.15] md:text-[40px]"
          style={{ fontFamily: SERIF, fontWeight: 600, color: T.ink }}
        >
          Pay for hire, not for search.
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed" style={{ color: T.inkSoft }}>
          No retainers. No upfront fees. Sourcing, evaluation, and interviews are on us — you only pay
          when a candidate we send actually starts.
        </p>

        {/* pipeline — desktop: flowing connector, nodes alternate above/below */}
        <div className="relative mt-16 hidden md:block">
          <div style={{ paddingTop: "30%" }} />
          <div className="absolute left-0 top-0 h-full w-full">
            <svg
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
              className="h-full w-full"
              aria-hidden
            >
              <path
                d="M0,150 C70,60 130,60 200,150 S330,240 400,150 S530,60 600,150 S730,240 800,150 S900,80 1000,150"
                fill="none"
                stroke={T.teal}
                strokeWidth="1.5"
                strokeDasharray="6 6"
                opacity="0.55"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {PIPELINE.map((n, i) => {
              const x = 4 + i * 11.6; // 4% .. 73.6%
              const above = i % 2 === 0;
              const Icon = n.icon;
              return (
                <div
                  key={n.label}
                  className="absolute flex w-[110px] -translate-x-1/2 flex-col items-center gap-2 text-center"
                  style={{ left: `${x}%`, top: above ? "6%" : "66%" }}
                >
                  {!above && (
                    <span className="order-2 text-[9.5px] uppercase leading-tight" style={{ fontFamily: MONO, letterSpacing: "0.08em", color: T.inkSoft }}>
                      {n.label}
                    </span>
                  )}
                  <span
                    className="grid h-11 w-11 place-items-center rounded-full border"
                    style={{ background: n.tint, borderColor: n.color }}
                  >
                    <Icon className="h-4.5 w-4.5" style={{ color: n.color, width: 18, height: 18 }} />
                  </span>
                  {above && (
                    <span className="text-[9.5px] uppercase leading-tight" style={{ fontFamily: MONO, letterSpacing: "0.08em", color: T.inkSoft }}>
                      {n.label}
                    </span>
                  )}
                </div>
              );
            })}

            {/* payoff stamp */}
            <div
              className="absolute flex w-[150px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center"
              style={{ left: "90%", top: "50%" }}
            >
              <span
                className="grid h-[68px] w-[68px] place-items-center rounded-full border-2"
                style={{ background: T.goldTint, borderColor: T.gold, boxShadow: `0 0 0 6px ${T.tealTint}` }}
              >
                <Award className="h-7 w-7" style={{ color: T.goldDeep }} />
              </span>
              <span
                className="rounded-full border px-3 py-1 text-[11px] font-semibold"
                style={{ fontFamily: MONO, borderColor: T.gold, background: T.goldTint, color: T.goldDeep }}
              >
                Hired in 20 days
              </span>
            </div>
          </div>
        </div>

        {/* pipeline — mobile: simple vertical list */}
        <ol className="mt-12 space-y-3 md:hidden">
          {PIPELINE.map((n, i) => {
            const Icon = n.icon;
            return (
              <li key={n.label} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border" style={{ background: n.tint, borderColor: n.color }}>
                  <Icon className="h-4 w-4" style={{ color: n.color }} />
                </span>
                <span className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.08em", color: T.inkSoft }}>
                  {i + 1}. {n.label}
                </span>
              </li>
            );
          })}
          <li className="flex items-center gap-3 pt-1">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2" style={{ background: T.goldTint, borderColor: T.gold }}>
              <Award className="h-5 w-5" style={{ color: T.goldDeep }} />
            </span>
            <span className="rounded-full border px-3 py-1 text-[11px] font-semibold" style={{ fontFamily: MONO, borderColor: T.gold, background: T.goldTint, color: T.goldDeep }}>
              Hired in 20 days
            </span>
          </li>
        </ol>

        {/* stat strip */}
        <div className="mt-16 grid grid-cols-2 gap-y-8 border-t pt-10 md:grid-cols-4" style={{ borderColor: "rgba(22,26,31,0.18)" }}>
          {STATS.map((s) => (
            <div key={s.label} className="pr-6">
              <p className="text-3xl md:text-[36px]" style={{ fontFamily: SERIF, fontWeight: 600, color: T.gold }}>
                {s.n}
              </p>
              <p className="mt-2 text-[10px] uppercase leading-snug" style={{ fontFamily: MONO, letterSpacing: "0.12em", color: T.inkSoft }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- page ----------------------------------- */

function SolutionsPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: T.paper, color: T.ink, fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' }}>
      {/* ------------------------------- hero ------------------------------- */}
      <section className="mx-auto grid max-w-[1120px] items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-2 lg:pt-28">
        <div>
          <Eyebrow>Hiring solutions for high-growth startups</Eyebrow>
          <h1
            className="mt-5 text-[42px] leading-[1.08] md:text-[58px]"
            style={{ fontFamily: SERIF, fontWeight: 600, color: T.ink }}
          >
            Hire with proof,
            <br />
            not promises.
          </h1>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed" style={{ color: T.inkSoft }}>
            Every candidate we send comes with more than a résumé and a recruiter’s word. They come
            with a real engineering task they solved, and a recorded conversation explaining exactly
            how and why. You see the evidence before you spend an hour on a call.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/auth"
              search={{ tab: "signup" }}
              className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-[14px] font-medium transition hover:opacity-90"
              style={{ background: T.ink, color: T.raised, borderRadius: 2 }}
            >
              Talk to us about a role
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-sm border px-6 py-3 text-[14px] font-medium transition hover:bg-white/60"
              style={{ borderColor: T.ink, color: T.ink, borderRadius: 2 }}
            >
              See how it works
            </a>
          </div>
        </div>

        <HeroDemoCard />
      </section>

      <ProcessSection />
      <PayForHireSection />

      {/* ----------------------------- closing CTA ----------------------------- */}
      <section className="mx-auto max-w-[1120px] px-6 py-24 text-center">
        <h2
          className="mx-auto max-w-xl text-3xl leading-[1.15] md:text-[42px]"
          style={{ fontFamily: SERIF, fontWeight: 600, color: T.ink }}
        >
          Send us your next open role.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: T.inkSoft }}>
          Tell us who you’re hiring for, and we’ll show you what a proof profile looks like for that
          exact role.
        </p>
        <Link
          to="/auth"
          search={{ tab: "signup" }}
          className="mt-8 inline-flex items-center gap-2 rounded-sm px-7 py-3.5 text-[14px] font-medium transition hover:opacity-90"
          style={{ background: T.gold, color: "#FFFDF6", borderRadius: 2 }}
        >
          Book a call
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* -------------------------------- footer -------------------------------- */}
      <footer className="border-t" style={{ borderColor: T.line }}>
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-6">
          <span className="text-[13px]" style={{ color: T.muted }}>
            © 2026 Yuvro Labs
          </span>
          <span className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: "0.18em", color: T.muted }}>
            Hire with Proof
          </span>
        </div>
      </footer>

      <style>{`
        @keyframes hwp-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .hwp-screen { animation: hwp-in 420ms cubic-bezier(0.16,1,0.3,1) both; }
        .hwp-caret { display: inline-block; width: 6px; height: 12px; margin-left: 1px; vertical-align: -1px; animation: hwp-blink 0.9s steps(1) infinite; }
        @keyframes hwp-blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .hwp-screen { animation: none; }
          .hwp-caret { animation: none; }
        }
      `}</style>
    </div>
  );
}
