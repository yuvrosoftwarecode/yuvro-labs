import { useEffect, useRef, useState } from "react";
import { AudioLines, Check, FileText, User, FileBadge } from "lucide-react";

const TEAL = "#2E5C52";
const SAND = "#C89A4B";

function useInView<T extends Element>(threshold = 0.25) {
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

const EXCHANGE: { q: string; a: string }[] = [
  { q: "Why did you choose this approach?", a: "I wanted to reduce latency and avoid heavy joins." },
  { q: "What trade-offs did you consider?", a: "I considered consistency and aggregation cost." },
  { q: "How would you handle a spike in writes?", a: "…" },
];

/* ---------- Column heads ---------- */
function ColHead({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#8A867E]">{eyebrow}</p>
      <p className="mt-1.5 text-[11px] leading-[1.45] text-[#1B1F23]">{children}</p>
    </div>
  );
}

function SkeletonLines({ widths }: { widths: string[] }) {
  return (
    <div className="mt-2 space-y-1">
      {widths.map((w, i) => (
        <span key={i} className="block h-[4px] rounded-full bg-[#EDEBE5]" style={{ width: w }} />
      ))}
    </div>
  );
}

function InputCard({
  icon: Icon, title, items, active, delay,
}: { icon: typeof FileText; title: string; items: string[]; active: boolean; delay: number }) {
  return (
    <div
      className="rounded-lg border bg-white/70 p-2.5 transition-all duration-700"
      style={{
        borderColor: active ? `${TEAL}33` : "#E6E4DE",
        boxShadow: active ? `0 8px 22px -18px ${TEAL}` : "none",
        opacity: active ? 1 : 0.35,
        transform: active ? "translateY(0)" : "translateY(6px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#F1F4F0]" style={{ color: TEAL }}>
          <Icon className="h-2.5 w-2.5" strokeWidth={1.6} />
        </span>
        <h3 className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#1B1F23]">{title}</h3>
      </div>
      <SkeletonLines widths={["88%", "96%", "70%"]} />
      <ul className="mt-2 space-y-[3px] text-[9.5px] text-[#4A4F58]">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-1.5">
            <span className="h-[2px] w-[2px] rounded-full bg-[#9A968E]" />{it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Center core ---------- */
function Waves({ active }: { active: boolean }) {
  const lines = Array.from({ length: 7 });
  return (
    <svg className="pointer-events-none absolute left-1/2 top-1/2 h-[78px] w-[270px] -translate-x-1/2 -translate-y-1/2" viewBox="0 0 800 150" fill="none" aria-hidden>
      {lines.map((_, i) => {
        const amp = 10 + i * 4;
        const d = `M0 75 C 120 ${75 - amp}, 240 ${75 + amp}, 400 75 S 680 ${75 - amp}, 800 75`;
        return (
          <path
            key={i}
            d={d}
            stroke={i % 2 === 0 ? TEAL : SAND}
            strokeWidth="0.7"
            opacity={active ? 0.32 - i * 0.025 : 0}
            style={{
              transition: "opacity 900ms ease",
              transformOrigin: "center",
              animation: active ? `vitarka-wave ${5 + i * 0.6}s ease-in-out ${i * 0.15}s infinite` : undefined,
            }}
          />
        );
      })}
    </svg>
  );
}

function Core({ active }: { active: boolean }) {
  return (
    <div className="relative flex min-h-[250px] flex-col items-center justify-center">
      {/* orbit rings */}
      {[178, 228, 278].map((s, i) => (
        <span
          key={s}
          aria-hidden
          className="absolute rounded-full border"
          style={{
            width: s, height: s,
            borderColor: i === 0 ? `${TEAL}26` : "#E6E4DE",
            borderStyle: i === 2 ? "dashed" : "solid",
            opacity: active ? 1 : 0,
            transition: `opacity 900ms ease ${i * 120}ms`,
          }}
        />
      ))}
      <span
        aria-hidden
        className="absolute h-[178px] w-[178px] rounded-full"
        style={{ background: `radial-gradient(circle, ${TEAL}12 0%, transparent 68%)`, opacity: active ? 1 : 0, transition: "opacity 1s ease" }}
      />
      <Waves active={active} />

      <div
        className="relative grid h-[58px] w-[58px] place-items-center rounded-full"
        style={{
          background: "#243029",
          boxShadow: active ? `0 10px 28px -14px ${TEAL}` : "none",
          transform: active ? "scale(1)" : "scale(0.9)",
          transition: "transform 700ms cubic-bezier(0.16,1,0.3,1), box-shadow 700ms ease",
          animation: active ? "vitarka-breathe 4s ease-in-out infinite" : undefined,
        }}
      >
        <AudioLines className="h-5 w-5 text-[#8FBFA6]" strokeWidth={1.6} />
      </div>

      <div className="relative mt-3 text-center">
        <p className="yvr-serif text-[15px] tracking-[0.06em] text-[#0A0A0A]">VITARKA AI</p>
        <p className="mt-1 text-[7.5px] font-medium uppercase leading-[1.7] tracking-[0.15em] text-[#8A867E]">
          Understands. Questions.<br />Evaluates. Decides.
        </p>
      </div>

      <div
        className="relative mt-4 w-full max-w-[180px] rounded-lg border border-[#E6E4DE] bg-white/80 p-2.5 transition-all duration-700"
        style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(8px)", transitionDelay: "600ms" }}
      >
        <div className="flex gap-2">
          <span className="mt-[2px] grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{ background: "#243029" }}>
            <Check className="h-2 w-2 text-[#8FBFA6]" strokeWidth={2.5} />
          </span>
          <p className="text-[9px] leading-[1.65] text-[#4A4F58]">
            Makes decisions.<br />Scores reasoning.<br />Highlights strengths and gaps.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Right: conversation ---------- */
function Bubble({ text, side, shown }: { text: string; side: "ai" | "candidate"; shown: boolean }) {
  const isAi = side === "ai";
  return (
    <div
      className={`flex items-start gap-1.5 transition-all duration-500 ${isAi ? "pr-6" : "flex-row-reverse pl-6"}`}
      style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(6px)" }}
    >
      <span
        className="mt-[2px] grid h-5 w-5 shrink-0 place-items-center rounded-full"
        style={{ background: isAi ? "#243029" : "#EFEDE7" }}
      >
        {isAi ? <AudioLines className="h-2 w-2 text-[#8FBFA6]" strokeWidth={1.8} /> : <User className="h-2 w-2 text-[#6B6B6B]" strokeWidth={1.8} />}
      </span>
      <p
        className="rounded-md px-2.5 py-1.5 text-[9px] leading-[1.55] text-[#1B1F23]"
        style={{ background: isAi ? "#EEF3EF" : "#FFFFFF", border: isAi ? "none" : "1px solid #E6E4DE" }}
      >
        {text}
      </p>
    </div>
  );
}

function Conversation({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setStep(99); return; }
    const id = window.setInterval(() => setStep((s) => (s >= 7 ? s : s + 1)), 750);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="flex min-h-[250px] flex-col justify-center gap-2">
      {EXCHANGE.map((e, i) => (
        <div key={e.q} className="space-y-1.5">
          <Bubble text={e.q} side="ai" shown={step > i * 2} />
          <Bubble text={e.a} side="candidate" shown={step > i * 2 + 1} />
        </div>
      ))}
      <div
        className="mt-1.5 flex items-start gap-2 rounded-lg border border-[#E6E4DE] bg-white/80 p-2.5 transition-all duration-700"
        style={{ opacity: step > 6 ? 1 : 0, transform: step > 6 ? "translateY(0)" : "translateY(8px)" }}
      >
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md" style={{ background: "#FBF3E4", color: SAND }}>
          <FileBadge className="h-2.5 w-2.5" strokeWidth={1.6} />
        </span>
        <p className="text-[9px] leading-[1.7] text-[#4A4F58]">
          Structured feedback.<br />Reasoning score.<br />
          <span className="text-[#1B1F23]">Decision: </span>
          <span style={{ color: TEAL }}>Proceed</span> / <span style={{ color: SAND }}>Hold</span> / <span style={{ color: "#B4472F" }}>Strong Hire</span>
        </p>
      </div>
    </div>
  );
}

export function VitarkaFlow() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <div ref={ref} className="relative">
      <style>{`
        @keyframes vitarka-wave { 0%,100% { transform: scaleY(1) } 50% { transform: scaleY(1.55) } }
        @keyframes vitarka-breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.05) } }
        @media (prefers-reduced-motion: reduce) {
          [style*="vitarka-wave"], [style*="vitarka-breathe"] { animation: none !important; }
        }
      `}</style>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-5">
        <div>
          <ColHead eyebrow="Understands before it asks">
            Reads the <span style={{ color: TEAL }}>job</span>, the role and the <span style={{ color: TEAL }}>candidate</span>.
          </ColHead>
          <div className="mt-5 space-y-2.5">
            <InputCard icon={FileText} title="Job Description" items={["Role", "Responsibilities", "Required Skills", "Nice to Have"]} active={inView} delay={0} />
            <InputCard icon={User} title="Candidate Resume" items={["Experience", "Skills", "Achievements", "Background"]} active={inView} delay={180} />
          </div>
        </div>

        <div>
          <ColHead eyebrow="Thinks. Adapts. Decides.">
            Not a script.<br />An <span style={{ color: TEAL }}>intelligent</span> interviewer.
          </ColHead>
          <Core active={inView} />
        </div>

        <div>
          <ColHead eyebrow="A conversation that adapts">
            Listens, probes and goes <span style={{ color: TEAL }}>deeper</span>.
          </ColHead>
          <Conversation active={inView} />
        </div>
      </div>
    </div>
  );
}
