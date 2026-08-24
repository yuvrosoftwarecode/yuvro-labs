import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Sparkles, Code2, MessageSquare, Coins } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yuvro Labs — Verify Engineering Capability Before You Hire" },
      { name: "description", content: "Yuvro Labs is an Engineering Capability Verification Platform. Evaluate real engineering ability through Engineering Simulation Labs, Knowledge Assessments and Vitarka AI Interviews." },
      { property: "og:title", content: "Yuvro Labs — Verify Engineering Capability Before You Hire" },
      { property: "og:description", content: "Stop hiring developers. Start verifying engineers. Evidence-based hiring for modern engineering teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen text-[#1E2228] antialiased selection:bg-[#2E9E7A] selection:text-white" style={{ background: "#FAFAF8" }}>
      <LandingStyles />
      <SiteNav />
      <Hero />
      <MeshSections />
    </div>
  );
}

/* ---------- Page-scoped styles ---------- */
function LandingStyles() {
  return (
    <style>{`
      @keyframes yvr-reveal { from { opacity:0; transform: translateY(16px) } to { opacity:1; transform: translateY(0) } }
      .yvr-reveal { opacity: 0; }
      .yvr-reveal.is-in { animation: yvr-reveal 650ms cubic-bezier(0.16,1,0.3,1) forwards; }

      @keyframes yvr-drift-a { 0%,100% { transform: translate3d(0,0,0) scale(1) } 33% { transform: translate3d(6%,-4%,0) scale(1.12) } 66% { transform: translate3d(-5%,5%,0) scale(0.95) } }
      @keyframes yvr-drift-b { 0%,100% { transform: translate3d(0,0,0) scale(1.05) } 40% { transform: translate3d(-7%,6%,0) scale(0.92) } 75% { transform: translate3d(5%,-6%,0) scale(1.1) } }
      @keyframes yvr-drift-c { 0%,100% { transform: translate3d(0,0,0) scale(0.98) } 50% { transform: translate3d(4%,7%,0) scale(1.15) } }
      .yvr-blob { position: absolute; border-radius: 9999px; filter: blur(90px); will-change: transform; }
      .yvr-blob-a { animation: yvr-drift-a 26s ease-in-out infinite; }
      .yvr-blob-b { animation: yvr-drift-b 30s ease-in-out infinite; }
      .yvr-blob-c { animation: yvr-drift-c 24s ease-in-out infinite; }

      @keyframes yvr-halo { 0% { transform: scale(1); opacity:.55 } 70% { transform: scale(1.6); opacity:0 } 100% { transform: scale(1.6); opacity:0 } }
      .yvr-halo { animation: yvr-halo 2.6s cubic-bezier(0.16,1,0.3,1) infinite; }

      .yvr-card { background: rgba(255,255,255,0.88); backdrop-filter: blur(18px); border: 1px solid rgba(255,255,255,0.7); box-shadow: 0 18px 50px -28px rgba(30,34,40,0.28); transition: transform 220ms cubic-bezier(0.16,1,0.3,1), box-shadow 220ms cubic-bezier(0.16,1,0.3,1); }
      .yvr-card:hover { transform: translateY(-4px); box-shadow: 0 28px 70px -30px rgba(30,34,40,0.30); }

      .yvr-pill { transition: transform 200ms ease-out, box-shadow 200ms ease-out, background 200ms ease-out; }
      .yvr-pill:hover { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(46,158,122,0.12), 0 14px 34px -16px rgba(46,158,122,0.6); }

      @media (prefers-reduced-motion: reduce) {
        .yvr-reveal { opacity: 1 !important; }
        .yvr-reveal.is-in { animation: none !important; }
        .yvr-blob-a, .yvr-blob-b, .yvr-blob-c, .yvr-halo { animation: none !important; }
        .yvr-card:hover, .yvr-pill:hover { transform: none; }
      }
    `}</style>
  );
}

/* ---------- Reveal helpers ---------- */
function useInView<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`yvr-reveal ${inView ? "is-in" : ""} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ================================================================
   HERO — unchanged apart from removed eyebrow
   ================================================================ */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#E8E6E1]">
      <div className="mx-auto max-w-5xl px-6 pt-12 pb-20 lg:pt-16 lg:pb-24 text-center">
        <Reveal>
          <h1 className="text-[52px] lg:text-[76px] leading-[1.02] tracking-[-0.025em] font-bold text-[#0A0A0A]">
            Hire engineers with<br />
            <span className="inline-block">verified capability.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-[#6B6B6B]">
            Yuvro Labs replaces resumes and guesswork with evidence. Evaluate how candidates think, debug, collaborate and execute through Engineering Simulation Labs, Knowledge Assessments and Vitarka AI Interviews.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth" search={{ tab: "signup" }} className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-[14px] font-medium text-white transition hover:brightness-95" style={{ background: "#F5A623" }}>
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/demo" className="inline-flex items-center gap-2 rounded-md border border-[#E8E6E1] bg-white px-5 py-3 text-[14px] font-medium text-[#0A0A0A] hover:border-[#0A0A0A] transition">
              <Play className="h-3.5 w-3.5" /> Book a Demo
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   BELOW HERO — animated pastel mesh with four short sections
   ================================================================ */
function MeshSections() {
  return (
    <div className="relative overflow-hidden">
      <MeshBackground />
      <div className="relative">
        <Section
          icon={<Sparkles className="h-5 w-5" />}
          badgeBg="#EAF4EC"
          badgeInk="#2E9E7A"
          headline="Hiring, backed by evidence."
          body="We help companies evaluate software engineers through real engineering work, an AI interview that asks candidates to explain their decisions, and a hiring model where you only pay when you actually hire. No coding puzzles. No guesswork."
          cta={
            <Link to="/demo" className="yvr-pill inline-flex items-center gap-2 rounded-full border border-[#2E9E7A] px-6 py-3 text-[14px] font-medium text-[#2E9E7A]">
              Talk to us <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <Section
          icon={<Code2 className="h-5 w-5" />}
          badgeBg="#ECF6FB"
          badgeInk="#2B7FA8"
          headline="Real tasks, not puzzles."
          body="Candidates work inside a live environment on a real engineering task — fixing a bug, shipping a feature — scoped to the role, in about 20-30 minutes. No trivia, no algorithm quizzes."
        />
        <Section
          icon={<MessageSquare className="h-5 w-5" />}
          badgeBg="#F2EEFA"
          badgeInk="#6B5BC0"
          headline="Then they explain it."
          body="Right after the task, our AI interviewer asks candidates to walk through the decisions they just made — grounded in the work they actually did, not a rehearsed answer. It's the part a coding test can't do."
        />
        <Section
          icon={<Coins className="h-5 w-5" />}
          badgeBg="#EAF4EC"
          badgeInk="#2E9E7A"
          headline="You only pay when you hire."
          body="No retainers, no upfront cost. Sourcing, evaluation, and interviews are on us — you pay only when a candidate we send actually starts."
          cta={
            <Link to="/demo" className="yvr-pill inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-white" style={{ background: "#2E9E7A" }}>
              Book a call <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <footer className="px-6 pb-14 pt-6 text-center text-[13px] text-[#7A7F86]">© 2026 Yuvro Labs</footer>
      </div>
    </div>
  );
}

function MeshBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,#FAFAF8 0%,#EAF4EC 22%,#ECF6FB 55%,#F2EEFA 82%,#EAF4EC 100%)" }}>
      <div className="yvr-blob yvr-blob-a" style={{ background: "#BFE3CD", opacity: 0.55, width: "46vw", height: "46vw", top: "2%", left: "-8%" }} />
      <div className="yvr-blob yvr-blob-b" style={{ background: "#BBDCF0", opacity: 0.5, width: "52vw", height: "52vw", top: "28%", right: "-12%" }} />
      <div className="yvr-blob yvr-blob-c" style={{ background: "#D5C9F2", opacity: 0.5, width: "48vw", height: "48vw", top: "58%", left: "-6%" }} />
      <div className="yvr-blob yvr-blob-a" style={{ background: "#C6E8DA", opacity: 0.45, width: "40vw", height: "40vw", bottom: "-6%", right: "-6%", animationDelay: "-8s" }} />
    </div>
  );
}

function Section({
  icon, badgeBg, badgeInk, headline, body, cta,
}: {
  icon: React.ReactNode; badgeBg: string; badgeInk: string; headline: string; body: string; cta?: React.ReactNode;
}) {
  return (
    <section className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="yvr-card rounded-[24px] p-8 lg:p-12">
            <div className="relative inline-grid h-14 w-14 place-items-center rounded-full" style={{ background: badgeBg, color: badgeInk }}>
              <span className="yvr-halo absolute inset-0 rounded-full" style={{ boxShadow: `0 0 0 2px ${badgeInk}` }} />
              {icon}
            </div>
            <h2 className="mt-6 text-[32px] lg:text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1E2228]">{headline}</h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#4A4F58]">{body}</p>
            {cta ? <div className="mt-8">{cta}</div> : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
