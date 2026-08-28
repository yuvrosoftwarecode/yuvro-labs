import { useEffect, useState } from "react";

const PHRASES = ["HUMAN + AI", "MODERN", "REAL-WORLD", "AI-FIRST", "THE NEXT ERA"];

const CODE_STREAM = [
  "async function evaluate(candidate) {",
  "  const run = await lab.start(candidate.id);",
  "  return report(run.diff, run.trace);",
  "}",
  "GET /api/v1/simulations/48211 → 200 OK",
  "diff --git a/invoices/service.ts",
  "+  if (!row) throw new NotFound(id);",
  "-  return serialize(row)",
  "test: invoice.serialize › guards null  ✓",
  "SELECT id, score FROM attempts WHERE state='done';",
  "vitarka.ask('why the guard clause?')",
  "commit 9f2ac1d  refactor: narrow query scope",
  "npm run test -- --watch=false",
  "trace: 412ms  db.invoice.find  cache:miss",
  "PATCH /tickets/SQL-105 { status: 'review' }",
];

export function HumanAiStatement() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % PHRASES.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#0B0D0C] px-6 py-32 lg:py-44">
      <style>{`
        @keyframes yvr-drift-x { from { transform: translate3d(0,0,0) } to { transform: translate3d(-50%,0,0) } }
        @keyframes yvr-drift-diag { from { transform: translate3d(0,0,0) } to { transform: translate3d(-50%,-6%,0) } }
        @keyframes yvr-phrase-in { from { opacity:0; transform: translateY(0.85em) } to { opacity:1; transform: translateY(0) } }
        .yvr-lane { will-change: transform; }
        .yvr-lane-a { animation: yvr-drift-x 90s linear infinite; }
        .yvr-lane-b { animation: yvr-drift-diag 140s linear infinite; }
        .yvr-lane-c { animation: yvr-drift-x 200s linear infinite; }
        .yvr-phrase { animation: yvr-phrase-in 620ms cubic-bezier(0.16,1,0.3,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .yvr-lane-a, .yvr-lane-b, .yvr-lane-c, .yvr-phrase { animation: none !important; }
        }
      `}</style>

      {/* moving layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* grid */}
        <div
          className="yvr-lane yvr-lane-c absolute -inset-y-24 left-0 w-[200%] opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* code lane 1 */}
        <div className="yvr-lane yvr-lane-a absolute top-[8%] flex w-[200%] gap-16 whitespace-nowrap font-mono text-[15px] text-[#7FB3A0]/45">
          {[...CODE_STREAM, ...CODE_STREAM].map((l, n) => (
            <span key={`a${n}`}>{l}</span>
          ))}
        </div>
        {/* code lane 2 (diagonal, slower, dimmer) */}
        <div className="yvr-lane yvr-lane-b absolute top-[46%] hidden w-[200%] gap-24 whitespace-nowrap font-mono text-[13px] text-white/25 md:flex">
          {[...CODE_STREAM.slice().reverse(), ...CODE_STREAM].map((l, n) => (
            <span key={`b${n}`}>{l}</span>
          ))}
        </div>
        {/* code lane 3 */}
        <div className="yvr-lane yvr-lane-c absolute bottom-[10%] hidden w-[200%] gap-20 whitespace-nowrap font-mono text-[17px] text-[#F5A623]/20 lg:flex">
          {[...CODE_STREAM, ...CODE_STREAM].map((l, n) => (
            <span key={`c${n}`}>{l}</span>
          ))}
        </div>
        {/* soft accents */}
        <div className="absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-[#2E5C52] opacity-25 blur-[140px]" />
        <div className="absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[#F5A623] opacity-[0.10] blur-[150px]" />
        {/* dark mask */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,13,12,0.86)_0%,rgba(11,13,12,0.95)_55%,#0B0D0C_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0B0D0C] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0D0C] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-[#F5F4EF] sm:text-[48px] lg:text-[76px]">
          <span className="block">Built for</span>
          <span className="block overflow-hidden py-[0.06em]" style={{ height: "1.14em" }}>
            <span key={i} className="yvr-phrase block text-[#E8C48A]">
              {PHRASES[i]}
            </span>
          </span>
          <span className="block">DEVELOPMENT.</span>
        </h2>

        <div className="mx-auto mt-10 max-w-xl space-y-4 text-[15.5px] leading-[1.75] text-white/60">
          <p>AI is now part of how developers write, review, debug, and solve problems.</p>
          <p>
            The role of developers is shifting, and companies are shaping how they build, evaluate, and hire
            engineering talent.
          </p>
          <p>We're evolving with you, building products for the new era of software engineering.</p>
        </div>
      </div>
    </section>
  );
}
