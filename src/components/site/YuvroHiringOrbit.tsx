import { useEffect, useMemo, useRef, useState } from "react";
import { Terminal, MessageSquare, Handshake, BellRing, ShieldCheck } from "lucide-react";

const SAFFRON = "#F5A623";
const TEAL = "#2E5C52";

type Feature = {
  key: string;
  name: string;
  icon: typeof Terminal;
  angle: number; // degrees, 0 = top, clockwise
  accent: string;
};

/** Order is fixed: Labs -> Vitarka -> Pay for Hire -> Followups -> Proctoring */
const FEATURES: Feature[] = [
  { key: "labs", name: "Engineering Labs", icon: Terminal, angle: 0, accent: TEAL },
  { key: "vitarka", name: "Vitarka AI", icon: MessageSquare, angle: 72, accent: SAFFRON },
  { key: "pay", name: "Pay for Hire", icon: Handshake, angle: 144, accent: TEAL },
  { key: "followups", name: "Automated Followups", icon: BellRing, angle: 216, accent: SAFFRON },
  { key: "proctoring", name: "Proctoring", icon: ShieldCheck, angle: 288, accent: TEAL },
];

const HOLD_MS = 2800;

function prefersReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function polar(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

/* ---------------- Preview cards (miniature product UI) ---------------- */

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-[240px] overflow-hidden rounded-xl border border-[#E6E4DE] bg-white shadow-[0_24px_60px_-30px_rgba(27,31,35,0.38)]">
      <div className="flex items-center gap-1.5 border-b border-[#EFEDE7] px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#E4E2DC]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#E4E2DC]" />
        <span className="ml-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#8A867E]">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}


function Bar({ w, tone = "#E9E7E1" }: { w: string; tone?: string }) {
  return <span className="block h-1.5 rounded-full" style={{ width: w, background: tone }} />;
}

function LabsPreview() {
  return (
    <Shell title="engineering labs">
      <div className="rounded-md bg-[#14181B] px-2.5 py-2 font-mono text-[9px] leading-[1.7] text-[#C9D1D9]">
        <div><span className="text-[#7EE3C0]">async</span> getInvoice(id) {"{"}</div>
        <div className="pl-2 text-[#8A867E]">const row = await db.find(id);</div>
        <div className="pl-2" style={{ color: SAFFRON }}>if (!row) throw new NotFound(id);</div>
        <div>{"}"}</div>
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-md border border-[#EFEDE7] px-2.5 py-1.5">
        <span className="text-[10px] text-[#6B6B6B]">Tests 12/12 passing</span>
        <span className="font-mono text-[10px] font-semibold" style={{ color: TEAL }}>Score 86</span>
      </div>
      <div className="mt-2 space-y-1.5">
        <Bar w="80%" />
        <Bar w="55%" />
      </div>
    </Shell>
  );
}

function VitarkaPreview() {
  return (
    <Shell title="vitarka ai">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-white" style={{ background: TEAL }}>AK</span>
        <div className="space-y-1">
          <span className="block text-[11px] font-medium text-[#1B1F23]">Ananya K.</span>
          <Bar w="54px" />
        </div>
      </div>
      <div className="mt-2.5 rounded-md border border-[#EFEDE7] bg-[#FBFAF7] px-2.5 py-2 text-[10px] leading-relaxed text-[#4A4F58]">
        “You added a null guard before serialize() — what breaks without it?”
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[9.5px] uppercase tracking-[0.12em] text-[#8A867E]">Reasoning</span>
        <span className="text-[10px] font-semibold" style={{ color: SAFFRON }}>High confidence</span>
      </div>
      <div className="mt-1.5"><Bar w="72%" tone={SAFFRON} /></div>
    </Shell>
  );
}

function PayPreview() {
  return (
    <Shell title="pay for hire">
      <div className="flex items-center justify-between rounded-md border border-[#EFEDE7] px-2.5 py-2">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#F1EFE9] text-[9px] font-semibold text-[#4A4F58]">RS</span>
          <span className="text-[11px] font-medium text-[#1B1F23]">Rahul S.</span>
        </div>
        <span className="rounded-full px-2 py-0.5 text-[9px] font-medium text-white" style={{ background: TEAL }}>Hired</span>
      </div>
      <div className="mt-2 space-y-1.5 text-[10px] text-[#6B6B6B]">
        <div className="flex justify-between"><span>Senior Backend</span><span className="text-[#1B1F23]">Offer signed</span></div>
        <div className="flex justify-between"><span>Time to hire</span><span className="text-[#1B1F23]">20 days</span></div>
        <div className="flex justify-between"><span>Fee</span><span className="font-semibold" style={{ color: SAFFRON }}>On start only</span></div>
      </div>
    </Shell>
  );
}

function FollowupsPreview() {
  return (
    <Shell title="automated followups">
      <div className="space-y-2">
        {[
          ["Reminder sent", "Today"],
          ["AI call completed", "Yesterday"],
          ["Interview scheduled", "Mon"],
        ].map(([a, b], i) => (
          <div key={a} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? SAFFRON : "#DEDBD4" }} />
            <span className="flex-1 text-[10px] text-[#4A4F58]">{a}</span>
            <span className="text-[9.5px] text-[#8A867E]">{b}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 rounded-md border border-[#EFEDE7] bg-[#FBFAF7] px-2.5 py-1.5 text-[10px] text-[#4A4F58]">
        4 candidates in pipeline · 0 dropped
      </div>
    </Shell>
  );
}

function ProctoringPreview() {
  return (
    <Shell title="proctoring">
      <div className="flex gap-2">
        <div className="grid h-[52px] w-[64px] place-items-center rounded-md bg-[#14181B] text-[9px] text-[#8A867E]">live</div>
        <div className="flex-1 space-y-1.5">
          {["Camera verified", "Screen shared", "Tab focus clean"].map((t) => (
            <div key={t} className="flex items-center gap-1.5 text-[10px] text-[#4A4F58]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: TEAL }} />{t}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-md border border-[#EFEDE7] px-2.5 py-1.5">
        <span className="text-[10px] text-[#6B6B6B]">Integrity</span>
        <span className="text-[10px] font-semibold" style={{ color: TEAL }}>No flags</span>
      </div>
    </Shell>
  );
}

const PREVIEWS = [LabsPreview, VitarkaPreview, PayPreview, FollowupsPreview, ProctoringPreview];

/* ---------------- Orbit ---------------- */

export function YuvroHiringOrbit() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [automaticIndex, setAutomaticIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const reduced = useMemo(() => prefersReduced(), []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Automatic controller — paused (not reset) while hovering.
  useEffect(() => {
    if (!inView || reduced || hoveredIndex !== null) return;
    const id = window.setInterval(() => {
      setAutomaticIndex((i) => (i + 1) % FEATURES.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [inView, reduced, hoveredIndex]);

  const active = hoveredIndex ?? automaticIndex;

  const R = 168; // orbit radius in px at base scale

  return (
    <div ref={wrapRef} className="relative mx-auto flex w-full max-w-[620px] items-center justify-center select-none">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${SAFFRON}12 0%, ${TEAL}0A 45%, transparent 70%)` }}
      />

      <div className="relative mx-auto h-[440px] w-[440px] max-w-full scale-[0.58] sm:scale-[0.78] lg:scale-[0.92] xl:scale-100 origin-center">
        {/* orbit rings */}
        <div className="absolute left-1/2 top-1/2 h-[336px] w-[336px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9D6CE]" />
        <div className="absolute left-1/2 top-1/2 h-[232px] w-[232px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#DFDCD4]" />

        {/* connection lines */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 440 440" aria-hidden>
          {FEATURES.map((f, i) => {
            const p = polar(f.angle, R);
            const on = i === active;
            return (
              <line
                key={f.key}
                x1={220} y1={220} x2={220 + p.x} y2={220 + p.y}
                stroke={on ? f.accent : "#D6D3CB"}
                strokeWidth={on ? 1.5 : 1}
                strokeOpacity={on ? 0.9 : 0.6}
                style={{ transition: "stroke 900ms cubic-bezier(0.22,1,0.36,1), stroke-opacity 900ms cubic-bezier(0.22,1,0.36,1), stroke-width 900ms cubic-bezier(0.22,1,0.36,1)" }}
              />
            );
          })}
        </svg>

        {/* central hub */}
        <div
          className="absolute left-1/2 top-1/2 grid h-[104px] w-[104px] place-items-center rounded-full border border-[#E0DDD5] bg-white"
          style={{
            boxShadow: `0 24px 56px -30px rgba(27,31,35,0.4), 0 0 0 10px ${FEATURES[active].accent}0D`,
            transform: "translate(-50%, -50%)",
            transition: "box-shadow 900ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="text-center leading-none">
            <span className="block text-[17px] font-bold tracking-[-0.02em] text-[#0A0A0A]">Yuvro</span>
            <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.2em] text-[#8A867E]">labs</span>
          </div>
        </div>

        {/* feature nodes + their anchored previews */}
        {FEATURES.map((f, i) => {
          const p = polar(f.angle, R);
          const on = i === active;
          const Icon = f.icon;
          const P = PREVIEWS[i];
          // anchor the preview outward from the node
          const tx = p.x > 30 ? "0%" : p.x < -30 ? "-100%" : "-50%";
          const ty = p.y > 30 ? "0%" : p.y < -30 ? "-100%" : "-50%";
          const ox = p.x > 30 ? 14 : p.x < -30 ? -14 : 0;
          const oy = p.y > 30 ? 14 : p.y < -30 ? -14 : 0;
          return (
            <div key={f.key}>
              <button
                type="button"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(i)}
                onBlur={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(i)}
                onTouchEnd={() => setHoveredIndex(null)}
                className="absolute left-1/2 top-1/2 z-10 inline-flex items-center gap-2 whitespace-nowrap rounded-full border bg-white px-3.5 py-2 text-[12px] font-medium outline-none"
                style={{
                  transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px)) scale(${on ? 1.05 : 1})`,
                  borderColor: on ? f.accent : "#E0DDD5",
                  color: on ? "#0A0A0A" : "#6B6B6B",
                  boxShadow: on
                    ? `0 16px 36px -22px rgba(27,31,35,0.42), 0 0 0 6px ${f.accent}14`
                    : "0 8px 24px -20px rgba(27,31,35,0.3)",
                  transition:
                    "transform 900ms cubic-bezier(0.22,1,0.36,1), box-shadow 900ms cubic-bezier(0.22,1,0.36,1), border-color 900ms cubic-bezier(0.22,1,0.36,1), color 900ms cubic-bezier(0.22,1,0.36,1)",
                  willChange: "transform",
                }}
              >
                <Icon
                  className="h-3.5 w-3.5"
                  strokeWidth={1.6}
                  style={{ color: on ? f.accent : "#A8A49C", transition: "color 900ms cubic-bezier(0.22,1,0.36,1)" }}
                />
                {f.name}
              </button>

              <div
                aria-hidden={!on}
                className="pointer-events-none absolute left-1/2 top-1/2 z-20"
                style={{
                  transform: `translate(calc(${tx} + ${p.x + ox}px), calc(${ty} + ${p.y + oy}px)) scale(${on ? 1 : 0.96})`,
                  opacity: on ? 1 : 0,
                  visibility: on ? "visible" : "hidden",
                  transition:
                    "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1), visibility 0ms linear " + (on ? "0ms" : "700ms"),
                  willChange: "transform, opacity",
                }}
              >
                <P />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

