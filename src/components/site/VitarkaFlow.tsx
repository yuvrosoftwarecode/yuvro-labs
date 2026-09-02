import { useEffect, useRef, useState } from "react";
import { AudioLines, Check, FileText, User } from "lucide-react";

const TEAL = "#2E5C52";
const SAGE = "#8FAF9C";
const SAND = "#C89A4B";

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

/* ---------------- Timeline ----------------
   0  idle
   1  job description in
   2  candidate profile in
   3  context flows -> core wakes
   4  Q1
   5  A1
   6  thinking (adapts)
   7  Q2  (derived from A1)
   8  A2
   9  thinking
   10 Q3
   11 evaluation rows
   12 decision
   13 hold, then loop
------------------------------------------- */
const STEP_MS = [600, 900, 900, 1100, 1200, 1400, 900, 1300, 1400, 900, 1300, 1300, 1200, 2600];
const LAST = STEP_MS.length - 1;

function useSequence(active: boolean) {
  const [step, setStep] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!active) return;
    if (reduced) { setStep(LAST); return; }
    let t: number;
    const tick = (s: number) => {
      t = window.setTimeout(() => {
        const next = s >= LAST ? 0 : s + 1;
        setStep(next);
        tick(next);
      }, STEP_MS[s]);
    };
    tick(step);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduced]);

  return step;
}

/* ---------------- Inputs ---------------- */
function SkeletonLines({ widths, on }: { widths: string[]; on: boolean }) {
  return (
    <div className="mt-2 space-y-[5px]">
      {widths.map((w, i) => (
        <span
          key={i}
          className="block h-[3px] rounded-full bg-[#E9E6DF] transition-all duration-700"
          style={{ width: on ? w : "0%", transitionDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

function InputCard({
  icon: Icon, title, items, on,
}: { icon: typeof FileText; title: string; items: string[]; on: boolean }) {
  return (
    <div
      className="rounded-md border bg-white/80 p-3 transition-all duration-[900ms] ease-out"
      style={{
        borderColor: on ? `${TEAL}2E` : "#E6E4DE",
        opacity: on ? 1 : 0.25,
        transform: on ? "translateY(0)" : "translateY(10px)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#F1F4F0]" style={{ color: TEAL }}>
          <Icon className="h-[11px] w-[11px]" strokeWidth={1.5} />
        </span>
        <h3 className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#1B1F23]">{title}</h3>
      </div>
      <SkeletonLines widths={["86%", "94%", "62%"]} on={on} />
      <ul className="mt-2.5 space-y-[4px] text-[9.5px] leading-[1.5] text-[#5A5F66]">
        {items.map((it, i) => (
          <li
            key={it}
            className="flex items-center gap-1.5 transition-all duration-700"
            style={{ opacity: on ? 1 : 0, transform: on ? "translateX(0)" : "translateX(-4px)", transitionDelay: `${200 + i * 90}ms` }}
          >
            <span className="h-[2px] w-[2px] rounded-full" style={{ background: SAGE }} />{it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Flow lines ---------------- */
function FlowLine({ on, dir }: { on: boolean; dir: "in" | "out" }) {
  return (
    <svg className="hidden h-[2px] w-full lg:block" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden>
      <line x1="0" y1="1" x2="100" y2="1" stroke="#E6E4DE" strokeWidth="0.5" />
      <line
        x1="0" y1="1" x2="100" y2="1"
        stroke={dir === "in" ? TEAL : SAND}
        strokeWidth="0.8"
        strokeDasharray="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: "stroke-dashoffset 1100ms cubic-bezier(0.22,1,0.36,1)" }}
      />
    </svg>
  );
}

/* ---------------- Core ---------------- */
function Waves({ level }: { level: number }) {
  const lines = Array.from({ length: 6 });
  return (
    <svg className="pointer-events-none absolute left-1/2 top-1/2 h-[70px] w-[240px] -translate-x-1/2 -translate-y-1/2" viewBox="0 0 800 150" fill="none" aria-hidden>
      {lines.map((_, i) => {
        const amp = 10 + i * 5;
        const d = `M0 75 C 120 ${75 - amp}, 240 ${75 + amp}, 400 75 S 680 ${75 - amp}, 800 75`;
        return (
          <path
            key={i}
            d={d}
            stroke={i % 2 === 0 ? TEAL : SAGE}
            strokeWidth="0.6"
            opacity={(0.3 - i * 0.03) * level}
            style={{
              transition: "opacity 900ms ease",
              transformOrigin: "center",
              animation: level > 0 ? `vitarka-wave ${5 + i * 0.7}s ease-in-out ${i * 0.18}s infinite` : undefined,
            }}
          />
        );
      })}
    </svg>
  );
}

function Core({ step }: { step: number }) {
  const awake = step >= 3;
  const thinking = step === 6 || step === 9;
  const speaking = step === 4 || step === 7 || step === 10;
  const level = !awake ? 0 : speaking ? 1 : thinking ? 0.6 : 0.35;

  return (
    <div className="relative flex min-h-[240px] flex-col items-center justify-center">
      {[168, 216, 268].map((s, i) => (
        <span
          key={s}
          aria-hidden
          className="absolute rounded-full border"
          style={{
            width: s, height: s,
            borderColor: i === 0 ? `${TEAL}2E` : "#E6E4DE",
            borderStyle: i === 2 ? "dashed" : "solid",
            opacity: awake ? 1 : 0,
            transform: awake ? "scale(1)" : "scale(0.94)",
            transition: `opacity 1000ms ease ${i * 130}ms, transform 1000ms cubic-bezier(0.22,1,0.36,1) ${i * 130}ms`,
            animation: awake && i === 2 ? "vitarka-spin 46s linear infinite" : undefined,
          }}
        />
      ))}
      <span
        aria-hidden
        className="absolute h-[168px] w-[168px] rounded-full"
        style={{ background: `radial-gradient(circle, ${TEAL}10 0%, transparent 68%)`, opacity: awake ? 1 : 0, transition: "opacity 1s ease" }}
      />
      <Waves level={level} />

      <div
        className="relative grid h-[54px] w-[54px] place-items-center rounded-full"
        style={{
          background: "#243029",
          boxShadow: awake ? `0 12px 30px -16px ${TEAL}` : "none",
          transform: awake ? "scale(1)" : "scale(0.88)",
          transition: "transform 800ms cubic-bezier(0.16,1,0.3,1), box-shadow 800ms ease",
          animation: awake ? `vitarka-breathe ${thinking ? "2.2s" : "4.4s"} ease-in-out infinite` : undefined,
        }}
      >
        <AudioLines className="h-[18px] w-[18px]" style={{ color: SAGE }} strokeWidth={1.6} />
      </div>

      <div className="relative mt-3.5 text-center">
        <p className="yvr-serif text-[15px] tracking-[0.08em] text-[#0A0A0A]">VITARKA AI</p>
        <div className="mt-1.5 flex flex-wrap justify-center gap-x-2 gap-y-[2px]">
          {["Understands.", "Questions.", "Evaluates.", "Decides."].map((w, i) => (
            <span
              key={w}
              className="text-[7.5px] font-medium uppercase tracking-[0.16em] transition-all duration-700"
              style={{
                color: awake ? "#7C7970" : "#BFBBB3",
                opacity: awake ? 1 : 0,
                transitionDelay: `${300 + i * 160}ms`,
              }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* processing indicator */}
      <div
        className="relative mt-4 flex h-4 items-center gap-1.5 transition-opacity duration-500"
        style={{ opacity: thinking ? 1 : 0 }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[4px] w-[4px] rounded-full"
            style={{ background: SAGE, animation: "vitarka-dot 1.2s ease-in-out infinite", animationDelay: `${i * 0.18}s` }}
          />
        ))}
        <span className="ml-1 text-[7.5px] uppercase tracking-[0.18em] text-[#8A867E]">Adapting</span>
      </div>
    </div>
  );
}

/* ---------------- Conversation ---------------- */
function Bubble({ text, side, shown, derived }: { text: string; side: "ai" | "candidate"; shown: boolean; derived?: boolean }) {
  const isAi = side === "ai";
  return (
    <div
      className={`flex items-start gap-1.5 transition-all duration-[700ms] ease-out ${isAi ? "pr-5" : "flex-row-reverse pl-5"}`}
      style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(8px)" }}
    >
      <span
        className="mt-[2px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full"
        style={{ background: isAi ? "#243029" : "#EFEDE7" }}
      >
        {isAi
          ? <AudioLines className="h-[8px] w-[8px]" style={{ color: SAGE }} strokeWidth={1.8} />
          : <User className="h-[8px] w-[8px] text-[#6B6B6B]" strokeWidth={1.8} />}
      </span>
      <p
        className="rounded-[5px] px-2.5 py-1.5 text-[9px] leading-[1.6] text-[#1B1F23] transition-all duration-500"
        style={{
          background: isAi ? "#EFF3F0" : "#FFFFFF",
          border: isAi ? "none" : "1px solid #E6E4DE",
          boxShadow: derived ? `inset 2px 0 0 0 ${SAND}` : "none",
        }}
      >
        {text}
      </p>
    </div>
  );
}

const SCORES = [
  ["Technical Depth", "Strong"],
  ["Reasoning", "Strong"],
  ["Communication", "Strong"],
];

function Conversation({ step }: { step: number }) {
  const show = (n: number) => step >= n;
  return (
    <div className="flex min-h-[240px] flex-col justify-center gap-2">
      <Bubble text="Why did you choose this approach?" side="ai" shown={show(4)} />
      <Bubble text="I wanted to reduce latency and avoid heavy joins." side="candidate" shown={show(5)} />
      <Bubble text="What trade-offs did you consider?" side="ai" shown={show(7)} derived />
      <Bubble text="I considered consistency and aggregation cost." side="candidate" shown={show(8)} />
      <Bubble text="How would you handle a spike in writes?" side="ai" shown={show(10)} derived />

      <div
        className="mt-2 rounded-md border border-[#E6E4DE] bg-white/85 p-2.5 transition-all duration-[900ms] ease-out"
        style={{ opacity: show(11) ? 1 : 0, transform: show(11) ? "translateY(0)" : "translateY(10px)" }}
      >
        {SCORES.map(([label, value], i) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-[#EFEDE7] py-[5px] text-[9px] last:border-0 transition-all duration-700"
            style={{ opacity: show(11) ? 1 : 0, transitionDelay: `${i * 180}ms` }}
          >
            <span className="text-[#6B6B6B]">{label}</span>
            <span style={{ color: TEAL }}>{value}</span>
          </div>
        ))}
        <div
          className="mt-2 flex items-center justify-between rounded-[4px] px-2 py-1.5 transition-all duration-700"
          style={{ background: "#F1F4F0", opacity: show(12) ? 1 : 0, transform: show(12) ? "scale(1)" : "scale(0.98)" }}
        >
          <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#6B6B6B]">Decision</span>
          <span className="flex items-center gap-1 text-[9.5px] font-medium" style={{ color: TEAL }}>
            <Check className="h-[10px] w-[10px]" strokeWidth={2.4} /> Proceed
          </span>
        </div>
      </div>
    </div>
  );
}

export function VitarkaFlow() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const step = useSequence(inView);

  return (
    <div ref={ref} className="relative">
      <style>{`
        @keyframes vitarka-wave { 0%,100% { transform: scaleY(1) } 50% { transform: scaleY(1.5) } }
        @keyframes vitarka-breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.045) } }
        @keyframes vitarka-spin { to { transform: rotate(360deg) } }
        @keyframes vitarka-dot { 0%,100% { opacity: .25; transform: translateY(0) } 50% { opacity: 1; transform: translateY(-2px) } }
        @media (prefers-reduced-motion: reduce) {
          [style*="vitarka-"] { animation: none !important; }
        }
      `}</style>

      <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4">
        <div className="space-y-2.5">
          <InputCard icon={FileText} title="Job Description" items={["Role", "Responsibilities", "Required Skills"]} on={step >= 1} />
          <InputCard icon={User} title="Candidate Profile" items={["Experience", "Skills", "Background"]} on={step >= 2} />
          <div className="pt-1"><FlowLine on={step >= 3} dir="in" /></div>
        </div>

        <div className="lg:w-[300px]">
          <Core step={step} />
        </div>

        <div>
          <div className="hidden pb-3 lg:block"><FlowLine on={step >= 4} dir="out" /></div>
          <Conversation step={step} />
        </div>
      </div>
    </div>
  );
}
