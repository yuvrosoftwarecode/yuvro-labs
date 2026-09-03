import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowDown,
  AudioLines,
  Check,
  Database,
  FileText,
  Gauge,
  ListChecks,
  Pencil,
  RefreshCw,
  ShieldCheck,
  SquareTerminal,
  Trash2,
  User,
  Sparkles,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";

/* ============================================================
   Vitarka AI — dedicated product page
   Visual language mirrors /product/engineering-simulations
   ============================================================ */

const BG = "#F1F1EC";
const SURFACE = "#FAFAF7";
const TEAL = "#2E5C52";
const TEAL_TINT = "#DCEDE7";
const GOLD = "#B4872E";
const GOLD_TINT = "#FAEEDA";
const INK = "#161A1F";
const BODY = "#3A4048";
const MUTED = "#6B6F68";
const LINE = "#E3E2DA";

const SOFT_SHADOW =
  "0 24px 60px -28px rgba(22,26,31,0.16), 0 2px 10px -4px rgba(22,26,31,0.05)";
const LIFT_SHADOW =
  "0 40px 90px -32px rgba(22,26,31,0.22), 0 4px 16px -6px rgba(22,26,31,0.06)";

export const Route = createFileRoute("/product/vitarka-ai")({
  head: () => ({
    meta: [
      { title: "Vitarka AI — An AI interviewer that thinks before it asks | Yuvro Labs" },
      {
        name: "description",
        content:
          "Vitarka understands the role, the skills that matter and the candidate before the conversation begins — then adapts every question based on what it hears.",
      },
      { property: "og:title", content: "Vitarka AI — An AI interviewer that thinks before it asks" },
      {
        property: "og:description",
        content:
          "Adaptive AI interviews for any role. Powerful on its own, sharper with Engineering Labs and Assessments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VitarkaPage,
});

/* ---------- helpers ---------- */

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
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
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
      className={`vk-reveal ${visible ? "vk-visible" : ""} ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** Loops a step counter 0..max while active. */
function useLoop(active: boolean, max: number, ms = 1600) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (prefersReduced()) {
      setStep(max);
      return;
    }
    const id = window.setInterval(() => setStep((s) => (s >= max ? 0 : s + 1)), ms);
    return () => window.clearInterval(id);
  }, [active, max, ms]);
  return step;
}

function SectionHead({
  title,
  copy,
  center,
}: {
  title: string;
  copy?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2
        className="text-[28px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[38px]"
        style={{ color: INK }}
      >
        {title}
      </h2>
      {copy && (
        <p className="mt-5 text-[16px] leading-relaxed" style={{ color: BODY }}>
          {copy}
        </p>
      )}
    </div>
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
    <Link to={to ?? "/demo"} className={cls} style={style}>
      {children}
    </Link>
  );
}

function PillGhost({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold transition-transform hover:-translate-y-0.5"
      style={{ border: `1px solid ${LINE}`, background: "#FFFFFF", color: INK }}
    >
      {children}
    </a>
  );
}

function Card({
  children,
  className,
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "surface";
}) {
  return (
    <div
      className={`rounded-[20px] ${className ?? ""}`}
      style={{
        background: tone === "white" ? "#FFFFFF" : SURFACE,
        border: `1px solid ${LINE}`,
        boxShadow: SOFT_SHADOW,
      }}
    >
      {children}
    </div>
  );
}

function VitarkaMark({ size = 40 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full"
      style={{ width: size, height: size, background: "#243029" }}
    >
      <AudioLines size={size * 0.42} className="text-[#8FBFA6]" strokeWidth={1.7} />
    </span>
  );
}

function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "teal" | "gold" }) {
  const map = {
    neutral: { background: "#F3F3EE", color: MUTED, border: LINE },
    teal: { background: TEAL_TINT, color: TEAL, border: "transparent" },
    gold: { background: GOLD_TINT, color: GOLD, border: "transparent" },
  }[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
      style={{ background: map.background, color: map.color, border: `1px solid ${map.border}` }}
    >
      {children}
    </span>
  );
}

function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <span className="h-6 w-px" style={{ background: LINE }} />
      {label && (
        <span className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
          {label}
        </span>
      )}
      <ArrowDown size={14} style={{ color: MUTED }} />
    </div>
  );
}

/* ============================================================ */

function VitarkaPage() {
  return (
    <div
      className="min-h-screen antialiased"
      style={{ background: BG, color: INK, fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' }}
    >
      <style>{`
        .vk-reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
        .vk-visible { opacity: 1; transform: none; }
        @keyframes vk-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .vk-marquee { animation: vk-marquee 26s linear infinite; }
        @keyframes vk-pulse { 0%,100% { transform: scale(1); opacity:.9 } 50% { transform: scale(1.05); opacity:1 } }
        .vk-pulse { animation: vk-pulse 4s ease-in-out infinite; }
        @keyframes vk-dash { to { stroke-dashoffset: -24; } }
        .vk-dash { stroke-dasharray: 4 6; animation: vk-dash 1.6s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .vk-reveal { opacity:1; transform:none; transition:none }
          .vk-marquee, .vk-pulse, .vk-dash { animation: none }
        }
      `}</style>

      <SiteNav />

      <Hero />
      <Positioning />
      <Prepares />
      <Standalone />
      <AnyRole />
      <ThreeWays />
      <AdaptiveBranching />
      <RecruiterControl />
      <FinalReport />
      <FinalCta />
    </div>
  );
}

/* ============================================================
   1 — HERO
   ============================================================ */

const HERO_TURNS = [
  {
    q: "Tell me about the API you built to handle high-volume requests.",
    a: "We used Python and FastAPI with async handlers, and moved the heavy aggregation into a background worker.",
    signal: "Implementation detail confirmed",
  },
  {
    q: "Why did you choose FastAPI over Django for this service?",
    a: "We needed async I/O and a light footprint. Django's ORM would have added overhead we didn't need here.",
    signal: "Reasoning is specific, not rehearsed",
  },
  {
    q: "How did you validate that decision in production?",
    a: "We load-tested at 3× peak and tracked p95 latency for two weeks after rollout.",
    signal: "Evidence of production ownership",
  },
];

function HeroInterview() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const step = useLoop(inView, HERO_TURNS.length * 3 - 1, 1500);
  const turn = Math.min(Math.floor(step / 3), HERO_TURNS.length - 1);
  const phase = step % 3; // 0 question, 1 answer, 2 evaluating

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      {/* Left — context */}
      <Card className="p-5">
        <Chip tone="neutral">Interview context</Chip>
        <div className="mt-5 space-y-4">
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
              Role
            </p>
            <p className="mt-1 text-[15px] font-semibold" style={{ color: INK }}>
              Backend Engineer
            </p>
          </div>
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
              Primary skills
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Python", "FastAPI", "PostgreSQL"].map((s) => (
                <span
                  key={s}
                  className="rounded-md px-2 py-1 text-[11.5px]"
                  style={{ background: "#F3F3EE", color: BODY, border: `1px solid ${LINE}` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
            <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: "#EFEDE7" }}>
              <User size={14} style={{ color: MUTED }} />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: INK }}>
                Krishna
              </p>
              <p className="text-[11.5px]" style={{ color: MUTED }}>
                4 yrs · Backend
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="h-1.5 w-1.5 rounded-full vk-pulse" style={{ background: TEAL }} />
            <p className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: TEAL }}>
              Interview live
            </p>
          </div>
        </div>
      </Card>

      {/* Right — conversation */}
      <Card className="p-5" tone="surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <VitarkaMark size={30} />
            <p className="text-[13.5px] font-semibold" style={{ color: INK }}>
              Vitarka AI
            </p>
          </div>
          <Chip tone="teal">Question {String(turn + 1).padStart(2, "0")} / 03</Chip>
        </div>

        <div className="mt-5 space-y-3">
          {HERO_TURNS.slice(0, turn + 1).map((t, i) => {
            const isCurrent = i === turn;
            const showA = !isCurrent || phase >= 1;
            const showEval = !isCurrent || phase >= 2;
            return (
              <div key={t.q} className="space-y-2" style={{ opacity: isCurrent ? 1 : 0.5, transition: "opacity .6s ease" }}>
                <Bubble side="ai" text={t.q} shown />
                <Bubble side="candidate" text={t.a} shown={showA} />
                <div
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all duration-500"
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${LINE}`,
                    opacity: showEval ? 1 : 0,
                    transform: showEval ? "none" : "translateY(4px)",
                  }}
                >
                  <Sparkles size={12} style={{ color: GOLD }} />
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                    {isCurrent && phase === 2 ? "Evaluating · selecting next question" : t.signal}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Bubble({ side, text, shown }: { side: "ai" | "candidate"; text: string; shown: boolean }) {
  const isAi = side === "ai";
  return (
    <div
      className={`flex items-start gap-2 transition-all duration-500 ${isAi ? "pr-6" : "flex-row-reverse pl-6"}`}
      style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(6px)" }}
    >
      <span
        className="mt-[2px] grid h-6 w-6 shrink-0 place-items-center rounded-full"
        style={{ background: isAi ? "#243029" : "#EFEDE7" }}
      >
        {isAi ? (
          <AudioLines size={11} className="text-[#8FBFA6]" strokeWidth={1.8} />
        ) : (
          <User size={11} style={{ color: MUTED }} />
        )}
      </span>
      <p
        className="rounded-xl px-3 py-2 text-[12.5px] leading-[1.6]"
        style={{
          background: isAi ? TEAL_TINT : "#FFFFFF",
          color: INK,
          border: isAi ? "none" : `1px solid ${LINE}`,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <h1
              className="mt-5 text-[36px] font-bold leading-[1.06] tracking-[-0.025em] sm:text-[50px] lg:text-[58px]"
              style={{ color: INK }}
            >
              An AI interviewer that thinks before it asks.
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed" style={{ color: BODY }}>
              Vitarka understands the role, the skills that matter, and the candidate before the
              conversation begins — then adapts every question based on what it hears.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <PillPrimary to="/demo">
                Book a Demo
                <ArrowRight size={16} />
              </PillPrimary>
              <PillGhost href="#how-it-works">See How It Works</PillGhost>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <HeroInterview />
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   2 — POSITIONING
   ============================================================ */

const POS_STEPS = [
  { n: "01", q: "Tell me about a backend system you built.", a: "A payments ledger service handling ~2M events a day." },
  { n: "02", q: "Why did you choose that architecture?", a: "Append-only writes made reconciliation and auditing simple." },
  { n: "03", q: "What would you change if traffic increased 10×?", a: "Partition by account and move reconciliation off the write path." },
];

function Positioning() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const step = useLoop(inView, POS_STEPS.length * 2 - 1, 1400);

  return (
    <section className="px-6 py-20" id="how-it-works">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHead
            title="Not a question bank. A thinking interviewer."
            copy="Vitarka listens to the answer, evaluates it, and decides where the conversation should go next."
          />
        </Reveal>

        <div ref={ref} className="mt-12 grid gap-4 md:grid-cols-3">
          {POS_STEPS.map((s, i) => {
            const revealed = step >= i * 2;
            const answered = step >= i * 2 + 1;
            return (
              <Card
                key={s.n}
                className="p-5 transition-all duration-700"
                tone={revealed ? "white" : "surface"}
              >
                <div
                  style={{
                    opacity: revealed ? 1 : 0.35,
                    transform: revealed ? "none" : "translateY(8px)",
                    transition: "opacity .6s ease, transform .6s ease",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                      Question {s.n}
                    </span>
                    {answered && <Chip tone="teal">Evaluated</Chip>}
                  </div>
                  <p className="mt-4 text-[15px] font-semibold leading-snug" style={{ color: INK }}>
                    {s.q}
                  </p>
                  <div
                    className="mt-4 rounded-xl p-3 transition-all duration-500"
                    style={{
                      background: SURFACE,
                      border: `1px solid ${LINE}`,
                      opacity: answered ? 1 : 0,
                      transform: answered ? "none" : "translateY(6px)",
                    }}
                  >
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                      Candidate response
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: BODY }}>
                      {s.a}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   3 — HOW VITARKA PREPARES
   ============================================================ */

const PREP_INPUTS = [
  { key: "JOB", label: "Understands the role", icon: FileText },
  { key: "SKILLS", label: "Knows what matters", icon: ListChecks },
  { key: "CANDIDATE", label: "Understands the background", icon: User },
];

function Prepares() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const step = useLoop(inView, 4, 1100);

  return (
    <section className="px-6 py-20" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHead
            center
            title="It starts before the first question."
            copy="Vitarka builds an interview strategy from the role, the skills that matter and the candidate's background."
          />
        </Reveal>

        <div ref={ref} className="mt-14 flex flex-col items-center">
          <div className="grid w-full gap-3 sm:grid-cols-3">
            {PREP_INPUTS.map((it, i) => {
              const on = step >= i + 1;
              return (
                <Card
                  key={it.key}
                  className="p-4 text-center transition-all duration-700"
                  tone="surface"
                >
                  <div
                    style={{
                      opacity: on ? 1 : 0.35,
                      transform: on ? "none" : "translateY(8px)",
                      transition: "all .6s ease",
                    }}
                  >
                    <span
                      className="mx-auto grid h-9 w-9 place-items-center rounded-full"
                      style={{ background: on ? TEAL_TINT : "#F1F1EC", color: TEAL }}
                    >
                      <it.icon size={15} />
                    </span>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: INK }}>
                      {it.key}
                    </p>
                    <p className="mt-1.5 text-[12.5px]" style={{ color: MUTED }}>
                      {it.label}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          <svg width="240" height="56" viewBox="0 0 240 56" fill="none" className="my-2">
            {[30, 120, 210].map((x) => (
              <path
                key={x}
                d={`M${x} 2 C ${x} 30, 120 26, 120 54`}
                stroke={step >= 4 ? TEAL : LINE}
                strokeWidth="1.2"
                className={step >= 4 ? "vk-dash" : undefined}
                fill="none"
              />
            ))}
          </svg>

          <div
            className="flex items-center gap-3 rounded-full px-6 py-3 transition-all duration-700"
            style={{
              background: "#243029",
              boxShadow: LIFT_SHADOW,
              opacity: step >= 4 ? 1 : 0.4,
              transform: step >= 4 ? "scale(1)" : "scale(0.96)",
            }}
          >
            <VitarkaMark size={28} />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">Vitarka AI</span>
          </div>

          <FlowArrow />

          <div
            className="rounded-2xl px-6 py-4 text-center transition-all duration-700"
            style={{
              background: GOLD_TINT,
              opacity: step >= 4 ? 1 : 0,
              transform: step >= 4 ? "none" : "translateY(8px)",
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: GOLD }}>
              Interview strategy
            </p>
            <p className="mt-1.5 text-[13px]" style={{ color: BODY }}>
              Focus areas, difficulty and question depth — set before the call begins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   4 — STANDALONE
   ============================================================ */

const CAPABILITIES = [
  { title: "Role-aware", copy: "Questions follow the job." },
  { title: "Adaptive", copy: "Every answer can change what's asked next." },
  { title: "Multi-role", copy: "Engineering, sales, marketing, finance and more." },
  { title: "Consistent", copy: "Every candidate gets a structured evaluation." },
];

function Standalone() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const step = useLoop(inView, 3, 1900);
  const started = step >= 2;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHead
            title="Run the first interview."
            copy="Give Vitarka the role and candidate profile. It handles the first conversation from start to finish."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl p-4"
                style={{ background: "#FFFFFF", border: `1px solid ${LINE}` }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: TEAL }}>
                  {c.title}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: BODY }}>
                  {c.copy}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div ref={ref}>
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: LINE }}>
                <p className="text-[13px] font-semibold" style={{ color: INK }}>
                  {started ? "Live interview" : "New Vitarka interview"}
                </p>
                <Chip tone={started ? "teal" : "neutral"}>{started ? "In progress" : "Configuration"}</Chip>
              </div>

              <div className="relative min-h-[290px] p-5">
                {/* config */}
                <div
                  className="space-y-4 transition-all duration-700"
                  style={{
                    opacity: started ? 0 : 1,
                    transform: started ? "translateY(-10px)" : "none",
                    pointerEvents: started ? "none" : "auto",
                  }}
                >
                  <Field label="Role" value="Backend Engineer" />
                  <div>
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                      Primary skills
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["Python", "FastAPI", "PostgreSQL"].map((s, i) => (
                        <span
                          key={s}
                          className="rounded-md px-2 py-1 text-[11.5px] transition-all duration-500"
                          style={{
                            background: step >= 1 || i === 0 ? TEAL_TINT : "#F3F3EE",
                            color: step >= 1 || i === 0 ? TEAL : MUTED,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Field label="Candidate" value="Krishna" />
                  <div
                    className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-transform"
                    style={{ background: TEAL, transform: step >= 1 ? "scale(1.02)" : "scale(1)" }}
                  >
                    Start Interview
                    <ArrowRight size={14} />
                  </div>
                </div>

                {/* live */}
                <div
                  className="absolute inset-0 space-y-3 p-5 transition-all duration-700"
                  style={{
                    opacity: started ? 1 : 0,
                    transform: started ? "none" : "translateY(10px)",
                    pointerEvents: started ? "auto" : "none",
                  }}
                >
                  <Bubble side="ai" text="Let's start with the service you own today. What does it do?" shown />
                  <Bubble side="candidate" text="It's an order intake API built on FastAPI." shown />
                  <Bubble side="ai" text="How does it behave when Postgres is slow to respond?" shown />
                </div>
              </div>
            </Card>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
        {label}
      </p>
      <div
        className="mt-1.5 rounded-lg px-3 py-2 text-[13.5px]"
        style={{ background: SURFACE, border: `1px solid ${LINE}`, color: INK }}
      >
        {value}
      </div>
    </div>
  );
}

/* ============================================================
   5 — ONE INTERVIEWER. ANY ROLE.
   ============================================================ */

const ROLES = [
  "Backend Engineer",
  "AI/ML Engineer",
  "Frontend Engineer",
  "Founding Engineer",
  "Account Manager",
  "GTM",
  "Marketing",
  "Finance",
];

function AnyRole() {
  const row = [...ROLES, ...ROLES];
  return (
    <section className="overflow-hidden py-20" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHead
            center
            title="One interviewer. Any role."
            copy="The conversation adapts to the role — not the other way around."
          />
        </Reveal>
      </div>

      <Reveal delay={100}>
        <div className="relative mt-12">
          <div className="flex w-max vk-marquee gap-3">
            {row.map((r, i) => (
              <span
                key={`${r}-${i}`}
                className="whitespace-nowrap rounded-full px-5 py-2.5 text-[13.5px]"
                style={{
                  background: i % 3 === 0 ? TEAL_TINT : SURFACE,
                  color: i % 3 === 0 ? TEAL : BODY,
                  border: `1px solid ${i % 3 === 0 ? "transparent" : LINE}`,
                }}
              >
                {r}
              </span>
            ))}
          </div>
          <div className="mt-3 flex w-max vk-marquee gap-3" style={{ animationDirection: "reverse", animationDuration: "34s" }}>
            {row.map((r, i) => (
              <span
                key={`b-${r}-${i}`}
                className="whitespace-nowrap rounded-full px-5 py-2.5 text-[13.5px]"
                style={{
                  background: i % 4 === 1 ? GOLD_TINT : SURFACE,
                  color: i % 4 === 1 ? GOLD : BODY,
                  border: `1px solid ${i % 4 === 1 ? "transparent" : LINE}`,
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}




/* ============================================================
   6 — THREE WAYS
   ============================================================ */

const WAYS = [
  {
    title: "Vitarka only",
    copy: "Interview independently.",
    flow: ["Role + Skills + Candidate", "Adaptive Interview"],
    icon: AudioLines,
  },
  {
    title: "Assessment + Vitarka",
    copy: "Test knowledge. Explore reasoning.",
    flow: ["Assessment", "Vitarka"],
    icon: ListChecks,
  },
  {
    title: "Simulation + Vitarka",
    copy: "Observe execution. Understand decisions.",
    flow: ["Simulation", "Vitarka"],
    icon: SquareTerminal,
  },
];

function ThreeWays() {
  return (
    <section className="px-6 py-20" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHead center title="Use it your way." />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {WAYS.map((w, i) => (
            <Reveal key={w.title} delay={i * 90}>
              <div
                className="group h-full rounded-[20px] p-5 transition-all duration-500 hover:-translate-y-1"
                style={{ background: SURFACE, border: `1px solid ${LINE}`, boxShadow: SOFT_SHADOW }}
              >
                <span
                  className="grid h-9 w-9 place-items-center rounded-full transition-colors"
                  style={{ background: TEAL_TINT, color: TEAL }}
                >
                  <w.icon size={15} />
                </span>
                <p className="mt-4 text-[16px] font-semibold" style={{ color: INK }}>
                  {w.title}
                </p>
                <p className="mt-1.5 text-[13px]" style={{ color: MUTED }}>
                  {w.copy}
                </p>
                <div className="mt-5 space-y-1.5">
                  {w.flow.map((f, idx) => (
                    <div key={f}>
                      <div
                        className="rounded-lg px-3 py-2 text-[12.5px] transition-colors"
                        style={{ background: "#FFFFFF", border: `1px solid ${LINE}`, color: BODY }}
                      >
                        {f}
                      </div>
                      {idx < w.flow.length - 1 && (
                        <div className="flex justify-center py-1 transition-transform duration-500 group-hover:translate-y-0.5">
                          <ArrowDown size={13} style={{ color: MUTED }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div
            className="mt-4 rounded-[20px] p-6 transition-transform duration-500 hover:-translate-y-1"
            style={{ background: "#243029", boxShadow: LIFT_SHADOW }}
          >
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-[20px] font-semibold text-white">See the complete picture.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {["Simulation", "Assessment", "Vitarka"].map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-4 py-2 text-[12.5px]"
                    style={{ background: "rgba(255,255,255,0.08)", color: "#E4E8E5" }}
                  >
                    {s}
                  </span>
                ))}
                <ArrowRight size={16} style={{ color: "#C8A45E" }} />
                <span className="rounded-full px-4 py-2 text-[12.5px] font-semibold" style={{ background: GOLD_TINT, color: GOLD }}>
                  Complete Candidate Evaluation
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   7 — ADAPTIVE BRANCHING
   ============================================================ */

const BRANCHES = [
  { key: "Strong", next: "Deeper Question", color: TEAL, tint: TEAL_TINT },
  { key: "Unclear", next: "Clarification", color: GOLD, tint: GOLD_TINT },
  { key: "Weak", next: "Fundamentals", color: "#B4472F", tint: "#F6E3DD" },
];

function AdaptiveBranching() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const step = useLoop(inView, BRANCHES.length * 2 - 1, 1500);
  const active = Math.floor(step / 2) % BRANCHES.length;
  const selected = step % 2 === 1;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHead
            center
            title="Every answer can change the next question."
            copy="No fixed script. No predetermined sequence. The conversation follows the candidate."
          />
        </Reveal>

        <Reveal delay={100}>
          <div ref={ref} className="mt-12">
            <Card className="p-6" tone="surface">
              <div className="mx-auto max-w-md rounded-xl px-4 py-3 text-center" style={{ background: "#FFFFFF", border: `1px solid ${LINE}` }}>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                  Candidate answer
                </p>
                <p className="mt-1.5 text-[13px]" style={{ color: BODY }}>
                  "We sharded by tenant once writes got heavy."
                </p>
              </div>

              <svg viewBox="0 0 600 60" className="mt-2 h-14 w-full" fill="none" preserveAspectRatio="none">
                {[100, 300, 500].map((x, i) => (
                  <path
                    key={x}
                    d={`M300 0 C 300 30, ${x} 26, ${x} 58`}
                    stroke={i === active ? BRANCHES[i].color : LINE}
                    strokeWidth={i === active ? 1.6 : 1}
                    className={i === active ? "vk-dash" : undefined}
                  />
                ))}
              </svg>

              <div className="grid gap-3 sm:grid-cols-3">
                {BRANCHES.map((b, i) => {
                  const on = i === active;
                  return (
                    <div
                      key={b.key}
                      className="rounded-2xl p-4 transition-all duration-500"
                      style={{
                        background: on ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                        border: `1px solid ${on ? b.color : LINE}`,
                        transform: on ? "translateY(-2px)" : "none",
                        opacity: on ? 1 : 0.55,
                      }}
                    >
                      <span
                        className="inline-flex rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em]"
                        style={{ background: b.tint, color: b.color }}
                      >
                        {b.key}
                      </span>
                      <p className="mt-3 text-[13.5px] font-semibold" style={{ color: INK }}>
                        {b.next}
                      </p>
                      <div
                        className="mt-3 flex items-center gap-1.5 transition-opacity duration-500"
                        style={{ opacity: on && selected ? 1 : 0 }}
                      >
                        <Check size={12} style={{ color: b.color }} />
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: b.color }}>
                          Next question selected
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   8 — RECRUITER CONTROL
   ============================================================ */

const EDITOR_QUESTIONS = [
  { q: "Walk me through the trickiest production incident you owned.", tag: "Problem solving" },
  { q: "Why did you choose FastAPI over Django for this service?", tag: "Architecture" },
  { q: "How do you keep migrations safe on a hot table?", tag: "Databases" },
];

const CONTROL_FLOW = ["Vitarka generates", "Questions", "Recruiter review", "Edit / Approve", "Publish"];

function RecruiterControl() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const step = useLoop(inView, CONTROL_FLOW.length - 1, 1300);

  return (
    <section className="px-6 py-20" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHead
            title="AI-led. Recruiter-controlled."
            copy="Vitarka generates the interview. Recruiters can review, edit, and publish the questions before the interview begins."
          />
        </Reveal>

        <div ref={ref} className="mt-12 grid gap-5 lg:grid-cols-[0.65fr_1.35fr]">
          <Card className="p-5" tone="surface">
            <div className="flex flex-col">
              {CONTROL_FLOW.map((f, i) => (
                <div key={f}>
                  <div
                    className="rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-500"
                    style={{
                      background: step >= i ? "#FFFFFF" : "transparent",
                      border: `1px solid ${step >= i ? TEAL_TINT : LINE}`,
                      color: step >= i ? INK : MUTED,
                      opacity: step >= i ? 1 : 0.55,
                    }}
                  >
                    {f}
                  </div>
                  {i < CONTROL_FLOW.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown size={13} style={{ color: step > i ? TEAL : LINE }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: LINE }}>
              <p className="text-[13px] font-semibold" style={{ color: INK }}>
                Interview questions — Backend Engineer
              </p>
              <Chip tone={step >= 4 ? "teal" : "gold"}>{step >= 4 ? "Published" : "Draft"}</Chip>
            </div>
            <div className="divide-y" style={{ borderColor: LINE }}>
              {EDITOR_QUESTIONS.map((item, i) => (
                <div key={item.q} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <span className="font-mono text-[10px] tracking-[0.14em]" style={{ color: MUTED }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-[200px] flex-1">
                    <p className="text-[13.5px]" style={{ color: INK }}>
                      {item.q}
                    </p>
                    <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                      {item.tag}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <EditorBtn icon={Pencil} label="Edit" />
                    <EditorBtn icon={RefreshCw} label="Regenerate" active={step === 3 && i === 1} />
                    <EditorBtn icon={Trash2} label="Delete" />
                    <EditorBtn icon={Check} label="Approve" primary active={step >= 3} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-5 py-4" style={{ background: SURFACE }}>
              <p className="text-[12px]" style={{ color: MUTED }}>
                Recruiters keep the final say on every question.
              </p>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white transition-colors"
                style={{ background: step >= 4 ? TEAL : "#9AA29B" }}
              >
                <ShieldCheck size={13} />
                Publish interview
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function EditorBtn({
  icon: Icon,
  label,
  primary,
  active,
}: {
  icon: typeof Pencil;
  label: string;
  primary?: boolean;
  active?: boolean;
}) {
  return (
    <span
      title={label}
      className="grid h-7 w-7 place-items-center rounded-md transition-all"
      style={{
        background: primary && active ? TEAL_TINT : active ? GOLD_TINT : "#F3F3EE",
        color: primary && active ? TEAL : active ? GOLD : MUTED,
        border: `1px solid ${LINE}`,
      }}
    >
      <Icon size={12} />
    </span>
  );
}

/* ============================================================
   9 — FINAL REPORT
   ============================================================ */

const REPORT_ROWS = [
  { label: "Technical Depth", value: "Strong" },
  { label: "Problem Solving", value: "Strong" },
  { label: "Communication", value: "Good" },
  { label: "Python", value: "Strong" },
  { label: "SQL", value: "Strong" },
];

function FinalReport() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHead
            title="From conversation to hiring signal."
            copy="Turn an interview into a clear signal recruiters can act on."
          />
          <div className="mt-8 space-y-3">
            {[
              "Every rating traced back to something the candidate said.",
              "Readable by recruiters — no score decoding required.",
              "Shareable with the hiring manager in one click.",
            ].map((t) => (
              <div key={t} className="flex items-start gap-2.5">
                <Check size={15} style={{ color: TEAL }} className="mt-0.5 shrink-0" />
                <p className="text-[14px] leading-relaxed" style={{ color: BODY }}>
                  {t}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div ref={ref}>
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5" style={{ background: SURFACE }}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full" style={{ background: "#EFEDE7" }}>
                    <User size={16} style={{ color: MUTED }} />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold" style={{ color: INK }}>
                      Krishna
                    </p>
                    <p className="text-[12.5px]" style={{ color: MUTED }}>
                      Backend Engineer
                    </p>
                  </div>
                </div>
                <Chip tone="gold">Vitarka report</Chip>
              </div>

              <div className="divide-y px-6" style={{ borderColor: LINE }}>
                {REPORT_ROWS.map((r, i) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between py-3 transition-all duration-700"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "none" : "translateY(6px)",
                      transitionDelay: `${i * 90}ms`,
                    }}
                  >
                    <span className="text-[13.5px]" style={{ color: BODY }}>
                      {r.label}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
                      style={{
                        background: r.value === "Strong" ? TEAL_TINT : GOLD_TINT,
                        color: r.value === "Strong" ? TEAL : GOLD,
                      }}
                    >
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-6 py-5">
                <p className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                  Vitarka summary
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: BODY }}>
                  Strong understanding of backend systems. Explained technical trade-offs clearly and
                  reasoned well through production scenarios.
                </p>
              </div>

              <div className="flex items-center gap-3 px-6 py-5" style={{ background: TEAL_TINT }}>
                <Database size={15} style={{ color: TEAL }} />
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: TEAL }}>
                    Recommendation
                  </p>
                  <p className="mt-1 text-[14px] font-semibold" style={{ color: INK }}>
                    Advance to next round
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   10 — FINAL CTA
   ============================================================ */

function FinalCta() {
  return (
    <section className="px-6 pb-24">
      <Reveal>
        <div
          className="mx-auto max-w-6xl rounded-[28px] px-8 py-20 text-center sm:px-16"
          style={{ background: INK, boxShadow: LIFT_SHADOW }}
        >
          <h2 className="mx-auto max-w-2xl text-[30px] font-bold leading-[1.15] tracking-[-0.015em] text-white sm:text-[40px]">
            Give every candidate a conversation that adapts.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed" style={{ color: "#B9BFC7" }}>
            Start with Vitarka alone. Combine it with your evaluation when you need deeper signal.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold transition-transform hover:-translate-y-0.5"
              style={{ background: "#FFFFFF", color: INK }}
            >
              Book a Demo
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold text-white"
              style={{ border: "1px solid rgba(255,255,255,0.28)" }}
            >
              Explore Yuvro
            </Link>
          </div>
        </div>
      </Reveal>

      <p className="mt-14 text-center font-mono text-[10.5px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
        © 2026 Yuvro Labs · Understand → Ask → Listen → Adapt → Evaluate → Recommend
      </p>
    </section>
  );
}
