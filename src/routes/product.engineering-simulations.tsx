import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CircleHelp,
  CodeXml,
  FileCode2,
  FileJson2,
  Folder,
  MessagesSquare,
  ShieldCheck,
  UserRoundX,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";


/* ============================================================
   Engineering Simulations — B2B landing page
   Art direction: smooth, soft, spacious (andela.com inspired)
   ============================================================ */

const BG = "#F1F1EC";
const SURFACE = "#FAFAF7";
const TEAL = "#2E5C52";
const TEAL_TINT = "#DCEDE7";
const GOLD = "#B4872E";
const GOLD_TINT = "#FAEEDA";
const BLUE_TINT = "#DCE9F1";
const CORAL_TINT = "#F5E2D8";
const PURPLE_TINT = "#E7E4F4";
const INK = "#161A1F";
const BODY = "#3A4048";
const MUTED = "#6B6F68";

const SOFT_SHADOW =
  "0 24px 60px -28px rgba(22,26,31,0.16), 0 2px 10px -4px rgba(22,26,31,0.05)";
const LIFT_SHADOW =
  "0 40px 90px -32px rgba(22,26,31,0.22), 0 4px 16px -6px rgba(22,26,31,0.06)";

export const Route = createFileRoute("/product/engineering-simulations")({
  head: () => ({
    meta: [
      { title: "Engineering Simulations — Evidence, not assumptions | Yuvro Labs" },
      {
        name: "description",
        content:
          "Candidates complete a real engineering task inside a live environment, then explain their reasoning to Vitarka AI. You receive a report grounded in what they actually did.",
      },
      { property: "og:title", content: "Engineering Simulations — Yuvro Labs" },
      {
        property: "og:description",
        content:
          "Real engineering tasks plus an AI interview about the candidate's own solution. Evidence, not assumptions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EngineeringSimulationsPage,
});

/* ---------- scroll reveal ---------- */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`es-reveal ${visible ? "es-visible" : ""} ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children, color = MUTED }: { children: ReactNode; color?: string }) {
  return (
    <p
      className="font-mono text-[11px] uppercase tracking-[0.24em]"
      style={{ color }}
    >
      {children}
    </p>
  );
}

function PillPrimary({ children, to, href }: { children: ReactNode; to?: string; href?: string }) {
  const cls =
    "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5";
  const style = { background: TEAL, boxShadow: "0 14px 30px -14px rgba(46,92,82,0.55)" };
  if (href)
    return (
      <a href={href} className={cls} style={style}>
        {children}
      </a>
    );
  return (
    <Link to={to ?? "/auth"} search={{ tab: "signup" }} className={cls} style={style}>
      {children}
    </Link>
  );
}

function PillSecondary({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
      style={{ background: INK }}
    >
      {children}
    </a>
  );
}


/* ============================================================ */

function EngineeringSimulationsPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: BG, color: INK, fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' }}>
      <style>{`
        .es-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .es-visible { opacity: 1; transform: none; }
        @keyframes es-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .es-float { animation: es-float 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .es-reveal { opacity: 1; transform: none; transition: none; }
          .es-float { animation: none; }
        }
      `}</style>

      <SiteNav />

      <HeroSection />
      <GapSection />
      <CoreSection />
      <ReportSection />
      <CtaSection />
    </div>
  );
}

/* ============================================================
   SECTION 1 — HERO
   ============================================================ */
function HeroSection() {
  const checks = [
    "Real engineering tasks",
    "AI-guided reasoning",
    "Decision-ready reports",
  ];

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-white">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-center">
        <Reveal>
          <h1
            className="text-[40px] font-bold leading-[1.06] tracking-[-0.025em] sm:text-[56px] lg:text-[64px]"
            style={{ color: INK }}
          >
            Evidence, not assumptions.
            <br />
            <span style={{ color: TEAL }}>Powering production-ready hiring.</span>
          </h1>

          <p
            className="mx-auto mt-8 max-w-2xl text-[17px] leading-relaxed"
            style={{ color: BODY }}
          >
            Yuvro provides the engineering simulation layer behind modern hiring
            — real tasks, AI-guided reasoning, and decision-ready evidence. Not
            a resume, and not a guess.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-7">
            {checks.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-[15px] font-medium"
                style={{ color: INK }}
              >
                <span
                  className="grid h-5 w-5 place-items-center rounded-full"
                  style={{ background: TEAL_TINT, color: TEAL }}
                >
                  <Check size={12} strokeWidth={2.5} />
                </span>
                {item}
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center justify-center gap-4">
            <PillSecondary href="mailto:hello@yuvrolabs.com">
              Talk to us
              <ArrowRight size={16} />
            </PillSecondary>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


/* ============================================================
   SECTION 2 — THE GAP IN TECHNICAL HIRING
   ============================================================ */
const GAP_CARDS = [
  {
    icon: UserRoundX,
    tint: BLUE_TINT,
    iconColor: "#3E6B8F",
    title: "Experienced candidates opt out.",
    body: "A generic coding puzzle rarely resembles the work a senior engineer actually does. Many decline to complete it — and the strongest candidates are often lost before they're ever properly evaluated.",
  },
  {
    icon: CodeXml,
    tint: CORAL_TINT,
    iconColor: "#A85B3C",
    title: "Working code is not the same as understood code.",
    body: "Candidates who pass a coding assessment can still struggle to explain the reasoning behind their own solution. Output alone is not a reliable signal of comprehension.",
  },
  {
    icon: CircleHelp,
    tint: GOLD_TINT,
    iconColor: GOLD,
    title: "Confidence gaps persist past the interview.",
    body: "A cleared coding round and a positive culture conversation still leave one question unanswered: whether this person can perform on your systems, under your constraints.",
  },
];

function GapSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-32 pt-8">
      <Reveal className="max-w-3xl">
        <h2 className="mt-5 text-[32px] font-bold leading-[1.15] tracking-[-0.015em] sm:text-[40px]" style={{ color: INK }}>
          Coding tests measure whether a problem can be solved. They don't measure whether the job
          can be done.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {GAP_CARDS.map((card, i) => (
          <Reveal key={card.title} delay={i * 120}>
            <div
              className="flex h-full flex-col rounded-[24px] p-8 transition-transform duration-300 hover:-translate-y-1.5"
              style={{ background: SURFACE, boxShadow: SOFT_SHADOW }}
            >
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: card.tint }}
              >
                <card.icon size={22} strokeWidth={1.8} style={{ color: card.iconColor }} />
              </div>
              <h3 className="mt-6 text-[19px] font-semibold leading-snug" style={{ color: INK }}>
                {card.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: BODY }}>
                {card.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 3 — ENGINEERING LABS + VITARKA AI (centerpiece)
   ============================================================ */
function CoreSection() {
  return (
    <section
      style={{
        background: `linear-gradient(180deg, ${BG} 0%, ${TEAL_TINT} 10%, ${TEAL_TINT} 90%, ${BG} 100%)`,
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-28 lg:py-36">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="mt-5 text-[32px] font-bold leading-[1.12] tracking-[-0.015em] sm:text-[44px]" style={{ color: INK }}>
            Two signals, evaluated together, that neither a coding test nor a standalone AI
            interview can produce alone.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16.5px] leading-relaxed" style={{ color: BODY }}>
            Most assessment tools do one of two things: observe a candidate at work, or ask about
            their experience after the fact. Yuvro does both — on the same task, in immediate
            sequence.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Card 1 — Engineering Labs */}
          <Reveal>
            <div
              className="flex h-full flex-col rounded-[24px] p-9"
              style={{ background: SURFACE, boxShadow: LIFT_SHADOW }}
            >
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: TEAL_TINT }}
              >
                <FileCode2 size={22} strokeWidth={1.8} style={{ color: TEAL }} />
              </div>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: BODY }}>
                Candidates work inside a live development environment built around a real task: a
                production-style bug, an incomplete feature, an existing codebase to navigate. Each
                task is scoped to the role and experience level being evaluated, with a working time
                of twenty to thirty minutes.
              </p>

              {/* IDE mockup */}
              <div
                className="mt-8 overflow-hidden rounded-2xl"
                style={{ background: "#14181D", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-1.5 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#3A4048" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#3A4048" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#3A4048" }} />
                  <span className="ml-3 font-mono text-[10px] tracking-wide" style={{ color: "#6B7280" }}>
                    yuvro-lab — auth-service
                  </span>
                </div>
                <div className="grid grid-cols-[118px_1fr] gap-0 px-4 pb-4">
                  {/* file tree */}
                  <div className="space-y-1.5 border-r pr-3 font-mono text-[10.5px]" style={{ borderColor: "rgba(255,255,255,0.07)", color: "#9AA1AB" }}>
                    <div className="flex items-center gap-1.5">
                      <Folder size={11} style={{ color: "#6B7280" }} /> src
                    </div>
                    <div className="ml-3.5 flex items-center gap-1.5 rounded-md px-1.5 py-0.5" style={{ background: "rgba(46,92,82,0.45)", color: "#DCE9F1" }}>
                      <FileCode2 size={11} /> login.ts
                    </div>
                    <div className="ml-3.5 flex items-center gap-1.5 px-1.5">
                      <FileCode2 size={11} /> session.ts
                    </div>
                    <div className="ml-3.5 flex items-center gap-1.5 px-1.5">
                      <FileCode2 size={11} /> users.ts
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileJson2 size={11} style={{ color: "#6B7280" }} /> login.test.ts
                    </div>
                  </div>
                  {/* code */}
                  <div className="pl-4 font-mono text-[10.5px] leading-[1.75]">
                    <div style={{ color: "#5B6470" }}>
                      1&nbsp;&nbsp;<span style={{ color: "#7EB8A4" }}>export async function</span>{" "}
                      <span style={{ color: "#DCE9F1" }}>login</span>
                      <span style={{ color: "#9AA1AB" }}>(req: Request) {"{"}</span>
                    </div>
                    <div style={{ color: "#5B6470" }}>
                      2&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#C8A2E8" }}>const</span>{" "}
                      <span style={{ color: "#9AA1AB" }}>{"{ email, password } = await req.json();"}</span>
                    </div>
                    <div style={{ color: "#5B6470" }}>
                      3&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#C8A2E8" }}>const</span>{" "}
                      <span style={{ color: "#9AA1AB" }}>user = await db.users.</span>
                      <span style={{ color: "#DCE9F1" }}>findByEmail</span>
                      <span style={{ color: "#9AA1AB" }}>(email);</span>
                    </div>
                    <div className="rounded-md px-1.5" style={{ background: "rgba(46,92,82,0.28)", color: "#5B6470" }}>
                      4&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#7EB8A4" }}>+ const ok = await verifyPassword(</span>
                      <span style={{ color: "#9AA1AB" }}>password, user</span>
                      <span style={{ color: "#7EB8A4" }}>);</span>
                    </div>
                    <div style={{ color: "#5B6470" }}>
                      5&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#C8A2E8" }}>if</span>{" "}
                      <span style={{ color: "#9AA1AB" }}>(!ok) </span>
                      <span style={{ color: "#C8A2E8" }}>throw new</span>{" "}
                      <span style={{ color: "#E8C07A" }}>AuthError</span>
                      <span style={{ color: "#9AA1AB" }}>(“invalid_credentials”);</span>
                    </div>
                    <div style={{ color: "#5B6470" }}>
                      6&nbsp;&nbsp;<span style={{ color: "#9AA1AB" }}>{"}"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Card 2 — Vitarka AI */}
          <Reveal delay={140}>
            <div
              className="flex h-full flex-col rounded-[24px] p-9"
              style={{ background: SURFACE, boxShadow: LIFT_SHADOW }}
            >
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: PURPLE_TINT }}
              >
                <MessagesSquare size={22} strokeWidth={1.8} style={{ color: "#6A5FA8" }} />
              </div>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: BODY }}>
                Immediately after the task, Vitarka reviews the candidate's own solution and asks
                them to account for it — the decisions made, the tradeoffs considered, how they
                arrived at the approach they took. Every follow-up question is generated from the
                code they actually wrote, so an answer can't be rehearsed.
              </p>

              {/* chat mockup */}
              <div
                className="mt-8 space-y-3 rounded-2xl p-5"
                style={{ background: "#F4F4EF", boxShadow: "inset 0 0 0 1px rgba(22,26,31,0.05)" }}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px] font-semibold text-white"
                    style={{ background: TEAL }}
                  >
                    V
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-md px-4 py-3 text-[12.5px] leading-relaxed"
                    style={{ background: TEAL_TINT, color: INK }}
                  >
                    You replaced <code className="font-mono text-[11.5px]">compare</code> with{" "}
                    <code className="font-mono text-[11.5px]">verifyPassword</code> on line 4. What
                    changed in how timing attacks are handled?
                  </div>
                </div>
                <div className="flex items-start justify-end gap-2.5">
                  <div
                    className="rounded-2xl rounded-tr-md px-4 py-3 text-[12.5px] leading-relaxed"
                    style={{ background: "#FFFFFF", color: BODY, boxShadow: "0 2px 8px -3px rgba(22,26,31,0.08)" }}
                  >
                    <code className="font-mono text-[11.5px]">compare</code> short-circuited on the
                    first byte mismatch —{" "}
                    <code className="font-mono text-[11.5px]">verifyPassword</code> is
                    constant-time, so the response no longer leaks where the hash diverges.
                  </div>
                </div>
                <div className="flex justify-start pt-1">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                    style={{ background: GOLD_TINT, color: GOLD }}
                  >
                    <ShieldCheck size={12} />
                    Reasoning verified · tied to the candidate's diff
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 4 — WHAT YOU RECEIVE (sample report)
   ============================================================ */
const REPORT_ROWS = [
  {
    text: "Diagnosed the session-expiry bug in 14 minutes, starting from the failing test rather than the stack trace.",
    source: "Engineering Labs",
    tint: TEAL_TINT,
    color: TEAL,
  },
  {
    text: "Explained the constant-time comparison tradeoff unprompted, and connected it to a real incident.",
    source: "Vitarka AI",
    tint: PURPLE_TINT,
    color: "#6A5FA8",
  },
  {
    text: "Flagged the missing rate-limiting on the login endpoint before it was asked about.",
    source: "Engineering Labs",
    tint: TEAL_TINT,
    color: TEAL,
  },
  {
    text: "Could not justify the schema change under follow-up — reversed the decision when challenged.",
    source: "Vitarka AI",
    tint: CORAL_TINT,
    color: "#A85B3C",
  },
];

function ReportSection() {
  return (
    <section id="sample-report" className="mx-auto max-w-6xl scroll-mt-10 px-6 py-28 lg:py-32">
      <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <h2 className="mt-5 text-[32px] font-bold leading-[1.15] tracking-[-0.015em] sm:text-[40px]" style={{ color: INK }}>
            One report. Every claim traceable to something the candidate actually did.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed" style={{ color: BODY }}>
            No percentile scores without context, no black-box ratings. Each observation in a Yuvro
            report links back to the code, the diff, or the interview answer it came from — so your
            hiring discussion starts from shared evidence.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { value: "20–30", unit: "min", label: "Live working time" },
              { value: "2", unit: "signals", label: "Evaluated together" },
              { value: "100", unit: "%", label: "Claims evidence-linked" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[30px] font-bold tracking-tight" style={{ color: GOLD }}>
                  {s.value}
                  <span className="ml-1 text-[15px] font-semibold">{s.unit}</span>
                </p>
                <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="rounded-[24px] p-8" style={{ background: SURFACE, boxShadow: LIFT_SHADOW }}>
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold" style={{ color: INK }}>
                Candidate report — excerpt
              </p>
              <span
                className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ background: GOLD_TINT, color: GOLD }}
              >
                Sample
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {REPORT_ROWS.map((row) => (
                <div
                  key={row.text}
                  className="rounded-2xl p-5"
                  style={{ background: "#F4F4EF" }}
                >
                  <p className="text-[13.5px] leading-relaxed" style={{ color: BODY }}>
                    {row.text}
                  </p>
                  <span
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
                    style={{ background: row.tint, color: row.color }}
                  >
                    {row.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 5 — CTA
   ============================================================ */
function CtaSection() {
  return (
    <section className="px-6 pb-24">
      <Reveal>
        <div
          className="mx-auto max-w-6xl rounded-[28px] px-8 py-20 text-center sm:px-16"
          style={{ background: INK, boxShadow: LIFT_SHADOW }}
        >
          <h2 className="mx-auto mt-5 max-w-2xl text-[30px] font-bold leading-[1.15] tracking-[-0.015em] text-white sm:text-[40px]">
            Hire the engineer you interviewed — not the one who prepped for the test.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed" style={{ color: "#B9BFC7" }}>
            Send your first evaluation today and see a candidate's real working style, verified in
            their own words.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auth"
              search={{ tab: "signup" }}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold transition-transform hover:-translate-y-0.5"
              style={{ background: "#FFFFFF", color: INK }}
            >
              Start free trial
              <ArrowRight size={16} />
            </Link>
            <a
              href="mailto:hello@yuvrolabs.com"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold text-white transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.28)" }}
            >
              Talk to us
            </a>
          </div>
        </div>
      </Reveal>

      <p className="mt-14 text-center font-mono text-[10.5px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
        © 2026 Yuvro Labs · Evaluate → Verify → Understand → Follow up → Hire
      </p>
    </section>
  );
}
