import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Check, Terminal, MessageSquare, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { YuvroHiringOrbit } from "@/components/site/YuvroHiringOrbit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yuvro Labs — Verify Engineering Capability Before You Hire" },
      { name: "description", content: "Yuvro Labs is an Engineering Capability Verification Platform. Evaluate real engineering ability through Engineering Simulations, Vitarka AI interviews and a pay-only-on-hire model." },
      { property: "og:title", content: "Yuvro Labs — Verify Engineering Capability Before You Hire" },
      { property: "og:description", content: "Stop hiring developers. Start verifying engineers. Evidence-based hiring for modern engineering teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const TEAL = "#2E5C52";

function Landing() {
  return (
    <div className="min-h-screen text-[#1B1F23] antialiased selection:bg-[#2E5C52] selection:text-white" style={{ background: "#FAFAF7" }}>
      <LandingStyles />
      <SiteNav />
      <Hero />
      <About />
      <SimulationVitarkaSequence />
      <Secured />
      <PayForHire />
      <footer className="border-t border-[#E6E4DE] px-6 py-10 text-center text-[13px] text-[#8A867E]">© 2026 Yuvro Labs</footer>
    </div>
  );
}

/* ---------- Page-scoped styles ---------- */
function LandingStyles() {
  return (
    <style>{`
      @keyframes yvr-reveal { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
      .yvr-reveal { opacity: 0; }
      .yvr-reveal.is-in { animation: yvr-reveal 600ms cubic-bezier(0.16,1,0.3,1) forwards; }

      @keyframes yvr-pop { from { opacity:0; transform: scale(0.92) } to { opacity:1; transform: scale(1) } }
      .yvr-pop { animation: yvr-pop 200ms ease-out forwards; }

      @keyframes yvr-caret { 0%,49% { opacity:1 } 50%,100% { opacity:0 } }
      .yvr-caret { display:inline-block; width:7px; height:15px; background:#2E5C52; vertical-align:-2px; animation: yvr-caret 900ms step-end infinite; }

      @keyframes yvr-travel { from { top: 0% } to { top: 100% } }
      .yvr-pulse-dot { animation: yvr-travel 700ms cubic-bezier(0.4,0,0.2,1) forwards; }

      .yvr-serif { font-family: Fraunces, Georgia, serif; font-optical-sizing: auto; }

      @media (prefers-reduced-motion: reduce) {
        .yvr-reveal { opacity: 1 !important; }
        .yvr-reveal.is-in, .yvr-pop, .yvr-caret, .yvr-pulse-dot { animation: none !important; }
      }
    `}</style>
  );
}

/* ---------- helpers ---------- */
function prefersReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className={`yvr-reveal ${inView ? "is-in" : ""} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function useTypewriter(text: string, active: boolean, speed = 22, onDone?: () => void) {
  const [out, setOut] = useState("");
  const doneRef = useRef(false);
  useEffect(() => {
    if (!active || doneRef.current) return;
    if (prefersReduced()) { doneRef.current = true; setOut(text); onDone?.(); return; }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) { window.clearInterval(id); doneRef.current = true; onDone?.(); }
    }, speed);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, text]);
  return { out, done: doneRef.current };
}

/* ================================================================
   HERO — unchanged content, fitted to the screen
   ================================================================ */
function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center border-b border-[#E6E4DE]">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-8">
        <Reveal>
          <h1 className="text-[42px] lg:text-[60px] leading-[1.04] tracking-[-0.025em] font-bold text-[#0A0A0A]">
            Hire engineers with<br />
            <span className="inline-block">verified capability.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[#6B6B6B]">
            Yuvro Labs replaces resumes and guesswork with evidence. Evaluate how candidates think, debug, collaborate and execute through Engineering Simulation Labs, Knowledge Assessments and Vitarka AI Interviews.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/auth" search={{ tab: "signup" }} className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-[14px] font-medium text-white transition hover:brightness-95" style={{ background: "#F5A623" }}>
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/demo" className="inline-flex items-center gap-2 rounded-md border border-[#E8E6E1] bg-white px-5 py-3 text-[14px] font-medium text-[#0A0A0A] hover:border-[#0A0A0A] transition">
              <Play className="h-3.5 w-3.5" /> Book a Demo
            </Link>
          </div>
        </Reveal>

        <div className="relative">
          <YuvroHiringOrbit />
        </div>
      </div>
    </section>
  );
}


/* ================================================================
   1. ABOUT
   ================================================================ */
function About() {
  return (
    <section className="border-b border-[#E6E4DE] px-6 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <h2 className="yvr-serif text-[38px] lg:text-[48px] font-normal leading-[1.08] tracking-[-0.015em] text-[#0A0A0A]">
            Two systems. One picture of how someone actually engineers.
          </h2>
        </Reveal>
        <Reveal delay={80} className="space-y-5 text-[16.5px] leading-[1.75] text-[#4A4F58]">
          <p>
            Most hiring processes measure the wrong thing. A resume records where someone has been, and a whiteboard
            puzzle records how quickly they can recall an algorithm under pressure. Neither tells you how a person
            behaves inside an unfamiliar codebase on a Tuesday afternoon with an ambiguous ticket in front of them.
          </p>
          <p>
            Yuvro Labs is built around two systems that work together. An Engineering Simulation puts the candidate
            into a live environment with a real task, and Vitarka, our AI interviewer, asks them to explain the
            decisions they just made. One produces the work; the other produces the reasoning behind it.
          </p>
          <p>
            What you receive at the end is not a score in isolation. It is a picture — the diff they wrote, the paths
            they explored, the trade-offs they can articulate and the ones they cannot — assembled into a review your
            engineers can read in five minutes and trust.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   2 + 3. ENGINEERING SIMULATION → VITARKA AI (sequenced)
   ================================================================ */
const CODE_LINES = [
  "async function getInvoice(id) {",
  "  const row = await db.invoice.find(id);",
  "  if (!row) throw new NotFound(id);",
  "  return serialize(row);",
  "}",
];
const CODE_TEXT = CODE_LINES.join("\n");
const VITARKA_Q = "You added a null guard before serialize() — what breaks without it?";

function SimulationVitarkaSequence() {
  const reduced = typeof window !== "undefined" ? prefersReduced() : false;
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  const [taskDone, setTaskDone] = useState(false);
  const [pulseRunning, setPulseRunning] = useState(false);
  const [vitarkaActive, setVitarkaActive] = useState(false);

  const { out: code } = useTypewriter(CODE_TEXT, inView, 14, () => setTaskDone(true));

  useEffect(() => {
    if (!taskDone) return;
    if (reduced) { setVitarkaActive(true); return; }
    const t1 = window.setTimeout(() => setPulseRunning(true), 250);
    const t2 = window.setTimeout(() => setVitarkaActive(true), 950);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [taskDone, reduced]);

  useEffect(() => {
    if (reduced && inView) setTaskDone(true);
  }, [reduced, inView]);

  const { out: question } = useTypewriter(VITARKA_Q, vitarkaActive, 26);

  return (
    <div ref={ref}>
      {/* Engineering Simulation */}
      <section className="px-6 pt-24 lg:pt-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <div className="mb-5 inline-grid h-10 w-10 place-items-center rounded-full border" style={{ borderColor: TEAL, color: TEAL }}>
              <Terminal className="h-4.5 w-4.5" strokeWidth={1.5} />
            </div>
            <h2 className="yvr-serif text-[34px] lg:text-[42px] font-normal leading-[1.1] tracking-[-0.015em] text-[#0A0A0A]">
              A real task, in a real environment — not a puzzle.
            </h2>
            <span className="mt-4 block h-[2px] w-16" style={{ background: TEAL }} />
            <div className="mt-6 space-y-5 text-[16.5px] leading-[1.75] text-[#4A4F58]">
              <p>
                Candidates open a live workspace with a running project, a repository, dependencies and a ticket scoped
                to the role you are hiring for — fixing a defect, extending an endpoint, tightening a query. It takes
                twenty to thirty minutes, not a weekend, and it looks like the first week of the job rather than an exam.
              </p>
              <p>
                Everything is captured as it happens: the files they opened, the order they worked in, the commands they
                ran, the tests they trusted and the final diff. That record is what your team reviews — the same way you
                would review a pull request from someone already on the team.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="relative">
              <div className="overflow-hidden rounded-xl border border-[#E6E4DE] bg-white">
                <div className="flex items-center gap-2 border-b border-[#EFEDE7] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E4E2DC]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E4E2DC]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E4E2DC]" />
                  <span className="ml-2 font-mono text-[11px] text-[#8A867E]">invoices/service.ts</span>
                </div>
                <pre className="min-h-[190px] whitespace-pre px-5 py-4 font-mono text-[12.5px] leading-[1.75] text-[#1B1F23]">
{code}{!taskDone && <span className="yvr-caret" />}
                </pre>
              </div>

              {taskDone && (
                <div className="yvr-pop mt-4 inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-[12.5px] font-medium" style={{ borderColor: TEAL, color: TEAL }}>
                  <Check className="h-3.5 w-3.5" strokeWidth={2.2} /> Task complete
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Handoff connector */}
      <div className="relative mx-auto my-14 h-24 w-full max-w-6xl px-6">
        <div className="relative mx-auto h-full w-px" style={{ background: "#E6E4DE" }}>
          {pulseRunning && (
            <span
              className="yvr-pulse-dot absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
              style={{ background: TEAL, boxShadow: `0 0 0 5px ${TEAL}1A` }}
            />
          )}
        </div>
      </div>

      {/* Vitarka AI */}
      <section className="border-b border-[#E6E4DE] px-6 pb-24 lg:pb-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <div
              className="mb-5 inline-grid h-10 w-10 place-items-center rounded-full border transition-colors duration-300"
              style={{ borderColor: vitarkaActive ? TEAL : "#D9D6CF", color: vitarkaActive ? TEAL : "#A8A49C" }}
            >
              <MessageSquare className="h-4.5 w-4.5" strokeWidth={1.5} />
            </div>
            <h2 className="yvr-serif text-[34px] lg:text-[42px] font-normal leading-[1.1] tracking-[-0.015em] text-[#0A0A0A]">
              An AI interviewer that doesn't need a simulation to run — but is far sharper when it has one.
            </h2>
            <span
              className="mt-4 block h-[2px] w-16 transition-colors duration-300"
              style={{ background: vitarkaActive ? TEAL : "#DEDBD4" }}
            />
            <div className="mt-6 space-y-5 text-[16.5px] leading-[1.75] text-[#4A4F58]">
              <p>
                Vitarka can run on its own as a structured technical interview, driven by the job description and the
                skills you actually care about. It probes depth rather than recall, follows the candidate's answers
                instead of reading from a fixed list, and returns a transcript with the reasoning graded, not just the
                conclusion.
              </p>
              <p>
                It becomes considerably sharper when it runs after a simulation. Because it has the candidate's own diff
                in front of it, it can ask why a guard clause was added, why one query was rewritten and another left
                alone, what the failure mode of their approach is. Rehearsed answers do not survive that kind of
                questioning.
              </p>
              <p>
                It is not tied to one language, stack or role. Backend, frontend, data, infrastructure, mobile, QA —
                the interview adapts to the domain being hired for.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="rounded-xl border border-[#E6E4DE] bg-white">
              <div className="border-b border-[#EFEDE7] px-4 py-2.5 font-mono text-[11px] text-[#8A867E]">
                evidence · invoices/service.ts
              </div>
              <pre className="whitespace-pre px-5 py-4 font-mono text-[12.5px] leading-[1.75] text-[#6B6B6B]">
{`async function getInvoice(id) {
  const row = await db.invoice.find(id);
`}<span style={{ background: vitarkaActive ? `${TEAL}14` : "transparent", borderLeft: `2px solid ${vitarkaActive ? TEAL : "transparent"}`, paddingLeft: 6, display: "inline-block", width: "100%", color: "#1B1F23", transition: "background-color 300ms, border-color 300ms" }}>{`  if (!row) throw new NotFound(id);`}</span>{`
  return serialize(row);
}`}
              </pre>
              <div className="border-t border-[#EFEDE7] px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: vitarkaActive ? TEAL : "#A8A49C" }}>Vitarka</p>
                <p className="mt-2 min-h-[44px] text-[14.5px] leading-relaxed text-[#1B1F23]">
                  {question}{vitarkaActive && question.length < VITARKA_Q.length && <span className="yvr-caret" />}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   4. SECURED ENVIRONMENT
   ================================================================ */
const INTEGRITY = [
  "Camera verification at session start",
  "Active screen share for the full session",
  "Tab-focus and window monitoring",
  "External AI and paste tools blocked",
  "Plagiarism and originality checks on every submission",
];

function Secured() {
  return (
    <section className="border-b border-[#E6E4DE] px-6 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <div className="mb-5 inline-grid h-10 w-10 place-items-center rounded-full border" style={{ borderColor: TEAL, color: TEAL }}>
            <ShieldCheck className="h-4.5 w-4.5" strokeWidth={1.5} />
          </div>
          <h2 className="yvr-serif text-[34px] lg:text-[42px] font-normal leading-[1.1] tracking-[-0.015em] text-[#0A0A0A]">
            Every session runs under the same integrity standard.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <ul className="divide-y divide-[#EFEDE7] border-y border-[#EFEDE7]">
            {INTEGRITY.map((i) => (
              <li key={i} className="flex items-start gap-3 py-4 text-[15.5px] leading-relaxed text-[#4A4F58]">
                <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} style={{ color: TEAL }} />
                {i}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   5. PAY FOR HIRE
   ================================================================ */
const PIPELINE = [
  ["Requirement & JD", "We start from the role as your engineers describe it, not a generic title."],
  ["Account manager", "A single named owner runs the search end to end and stays accountable for it."],
  ["Recruiter match", "Our recruiters shortlist against the requirement, then hand candidates to evaluation."],
  ["Real task", "Every shortlisted candidate completes an Engineering Simulation scoped to the role."],
  ["Vitarka interview", "The AI interview runs on their own work and grades the reasoning behind it."],
  ["Proof profile", "You receive a review built from the diff, the transcript and the integrity record."],
  ["Scheduling & follow-ups", "Interviews, reminders and candidate communication are handled for you."],
  ["Hired in 20 days", "Median time from requirement to signed offer across roles we run."],
];

function PayForHire() {
  return (
    <section className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="yvr-serif max-w-3xl text-[38px] lg:text-[48px] font-normal leading-[1.08] tracking-[-0.015em] text-[#0A0A0A]">
            We share evidence, not resumes.
          </h2>
          <span className="mt-4 block h-[2px] w-16" style={{ background: TEAL }} />
          <p className="mt-6 max-w-2xl text-[16.5px] leading-[1.75] text-[#4A4F58]">
            When we send you a candidate, the first thing you see is the work — the task they completed, the reasoning
            they gave for it and the conditions the session ran under. The resume is a footnote. Here is what happens
            between your requirement and a signed offer.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-x-12 gap-y-8 border-t border-[#EFEDE7] pt-10 md:grid-cols-2">
          {PIPELINE.map(([title, body], i) => (
            <Reveal key={title} delay={i * 40}>
              <li className="flex gap-4">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[11px]" style={{ borderColor: TEAL, color: TEAL }}>
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[15.5px] font-medium text-[#0A0A0A]">{title}</span>
                  <span className="mt-1.5 block text-[14.5px] leading-relaxed text-[#6B6B6B]">{body}</span>
                </span>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120}>
          <div className="mt-16 border-t border-[#EFEDE7] pt-10">
            <p className="max-w-2xl text-[16.5px] leading-[1.75] text-[#4A4F58]">
              There is no retainer and no upfront fee. Sourcing, evaluation, interviews and follow-ups are on us — you
              pay only when a candidate we send actually starts.
            </p>
            <Link to="/demo" className="mt-7 inline-flex items-center gap-2 rounded-md px-5 py-3 text-[14px] font-medium text-white transition hover:brightness-110" style={{ background: TEAL }}>
              Book a demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
