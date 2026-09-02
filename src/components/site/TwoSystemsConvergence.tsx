import { useEffect, useRef, useState } from "react";
import { Code2, Bug, FlaskConical, Gauge } from "lucide-react";

const TEAL = "#2E5C52";
const AMBER = "#C8862B";

const ACTIONS = [
  { icon: Code2, label: "code" },
  { icon: Bug, label: "debug" },
  { icon: FlaskConical, label: "test" },
  { icon: Gauge, label: "optimize" },
];

const QUESTIONS = [
  "why this approach?",
  "what were you optimizing for?",
  "what would you do differently?",
  "how would you improve this?",
];

/* geometry (viewBox 1000 x 440) */
const ROWS = [58, 165, 272, 379];
const LEFT_EDGE = 300;
const RIGHT_EDGE = 700;
const LJ = { x: 420, y: 220 };
const RJ = { x: 580, y: 220 };

const leftPath = (y: number) =>
  `M ${LEFT_EDGE} ${y} C ${LEFT_EDGE + 70} ${y}, ${LJ.x - 70} ${LJ.y}, ${LJ.x} ${LJ.y}`;
const rightPath = (y: number) =>
  `M ${RIGHT_EDGE} ${y} C ${RIGHT_EDGE - 70} ${y}, ${RJ.x + 70} ${RJ.y}, ${RJ.x} ${RJ.y}`;

export function TwoSystemsConvergence() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % 4), 1900);
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <div ref={hostRef} className="relative overflow-hidden rounded-2xl border border-[#E6E4DE] bg-white">
      {/* faint field wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 90% at 50% 50%, rgba(46,92,82,0.055) 0%, rgba(46,92,82,0) 62%), radial-gradient(38% 60% at 8% 20%, rgba(200,134,43,0.06) 0%, rgba(200,134,43,0) 70%)",
        }}
      />

      {/* labels */}
      <div className="relative flex items-center justify-between px-6 pt-6 sm:px-9">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em]" style={{ color: AMBER }}>
          Engineering Simulation · what they do
        </span>
        <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.2em] sm:block" style={{ color: TEAL }}>
          Vitarka AI · why they do it
        </span>
      </div>

      {/* desktop composition */}
      <div className="relative mx-auto hidden h-[440px] w-full max-w-[1000px] md:block">
        <svg viewBox="0 0 1000 440" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="yv-l" x1="0" x2="1">
              <stop offset="0%" stopColor={AMBER} stopOpacity="0.15" />
              <stop offset="100%" stopColor={AMBER} stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="yv-r" x1="1" x2="0">
              <stop offset="0%" stopColor={TEAL} stopOpacity="0.15" />
              <stop offset="100%" stopColor={TEAL} stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {ROWS.map((y, i) => (
            <g key={`l${y}`}>
              <path id={`yv-lp-${i}`} d={leftPath(y)} fill="none" stroke="url(#yv-l)" strokeWidth={step === i ? 1.6 : 1} opacity={step === i ? 1 : 0.5} style={{ transition: "opacity 500ms, stroke-width 500ms" }} />
              {inView && (
                <circle r="3" fill={AMBER}>
                  <animateMotion dur="2.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={leftPath(y)} />
                  <animate attributeName="opacity" values="0;1;1;0" dur="2.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}

          {ROWS.map((y, i) => (
            <g key={`r${y}`}>
              <path d={rightPath(y)} fill="none" stroke="url(#yv-r)" strokeWidth={step === i ? 1.6 : 1} opacity={step === i ? 1 : 0.5} style={{ transition: "opacity 500ms, stroke-width 500ms" }} />
              {inView && (
                <circle r="3" fill={TEAL}>
                  <animateMotion dur="2.6s" begin={`${i * 0.45 + 0.6}s`} repeatCount="indefinite" path={rightPath(y)} />
                  <animate attributeName="opacity" values="0;1;1;0" dur="2.6s" begin={`${i * 0.45 + 0.6}s`} repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}

          {/* junction to center */}
          <path d={`M ${LJ.x} ${LJ.y} H ${RJ.x}`} stroke="#CFCBC2" strokeWidth="1" fill="none" />
          <circle cx={LJ.x} cy={LJ.y} r="4" fill={AMBER} opacity="0.85" />
          <circle cx={RJ.x} cy={RJ.y} r="4" fill={TEAL} opacity="0.85" />
        </svg>

        {/* left pills */}
        {ACTIONS.map((a, i) => {
          const Icon = a.icon;
          const active = step === i;
          return (
            <div
              key={a.label}
              className="absolute left-[3%] flex w-[26%] -translate-y-1/2 items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition-all duration-500"
              style={{
                top: `${(ROWS[i] / 440) * 100}%`,
                borderColor: active ? `${AMBER}66` : "#E6E4DE",
                boxShadow: active ? `0 6px 22px -14px ${AMBER}` : "none",
                transform: `translateY(-50%) translateX(${active ? 4 : 0}px)`,
              }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.6} style={{ color: active ? AMBER : "#A8A49C" }} />
              <span className="font-mono text-[13px] text-[#1B1F23]">{a.label}</span>
            </div>
          );
        })}

        {/* right pills */}
        {QUESTIONS.map((q, i) => {
          const active = step === i;
          return (
            <div
              key={q}
              className="absolute right-[3%] flex w-[26%] -translate-y-1/2 items-center rounded-xl border bg-white px-4 py-3.5 transition-all duration-500"
              style={{
                top: `${(ROWS[i] / 440) * 100}%`,
                borderColor: active ? `${TEAL}55` : "#E6E4DE",
                boxShadow: active ? `0 6px 22px -14px ${TEAL}` : "none",
                transform: `translateY(-50%) translateX(${active ? -4 : 0}px)`,
              }}
            >
              <span className="text-[13.5px] leading-snug text-[#1B1F23]">{q}</span>
            </div>
          );
        })}

        {/* center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="relative grid place-items-center">
            <span className="absolute h-32 w-32 rounded-full" style={{ background: `radial-gradient(circle, ${TEAL}14 0%, transparent 70%)` }} />
            <span className="relative rounded-full border bg-white px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ borderColor: `${TEAL}44`, color: TEAL }}>
              How they engineer
            </span>
          </div>
          <p className="mt-3 font-mono text-[10.5px] tracking-[0.14em] text-[#8A867E]">actions + reasoning</p>
        </div>
      </div>

      {/* mobile composition */}
      <div className="relative grid gap-3 px-6 py-8 md:hidden">
        {ACTIONS.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={a.label} className="flex items-center gap-3 rounded-xl border border-[#E6E4DE] bg-white px-4 py-3">
              <Icon className="h-4 w-4" strokeWidth={1.6} style={{ color: step === i ? AMBER : "#A8A49C" }} />
              <span className="font-mono text-[13px]">{a.label}</span>
            </div>
          );
        })}
        <div className="my-2 text-center">
          <span className="rounded-full border bg-white px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.18em]" style={{ borderColor: `${TEAL}44`, color: TEAL }}>
            How they engineer
          </span>
        </div>
        {QUESTIONS.map((q) => (
          <div key={q} className="rounded-xl border border-[#E6E4DE] bg-white px-4 py-3 text-[13.5px] text-[#1B1F23]">{q}</div>
        ))}
      </div>
    </div>
  );
}
