import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SquareTerminal, ListChecks, Bot, Send, ArrowRight } from "lucide-react";
import ctaArt from "@/assets/mega-cta.jpg";

type PlatformItem = {
  slug: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const platformItems: PlatformItem[] = [
  {
    slug: "engineering-simulations",
    title: "Engineering Simulations",
    description: "Evaluate real engineering work — debugging, optimization and code review.",
    icon: SquareTerminal,
  },
  {
    slug: "knowledge-assessments",
    title: "Assessments",
    description: "Measure technical knowledge across languages, frameworks and fundamentals.",
    icon: ListChecks,
  },
  {
    slug: "vitarka-ai",
    title: "Vitarka AI Interviews",
    description: "AI technical interviews that read the evidence and go deeper.",
    icon: Bot,
  },
  {
    slug: "automated-follow-ups",
    title: "Automated Follow-ups",
    description: "Reminders and AI calls that bring candidates back before deadlines.",
    icon: Send,
  },
];

/* Desktop trigger + dropdown panel. Hover or click opens; Esc / outside click closes. */
export function ProductMegaMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [open]);

  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 160); };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 py-2 text-sm transition-colors ${open ? "text-[#0A0A0A]" : "text-[#6B6B6B] hover:text-[#0A0A0A]"}`}
      >
        Platform
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M1 1.2 4.5 4.6 8 1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          {/* dimmed page backdrop, like the reference */}
          <div
            className="fixed inset-0 top-16 z-40 bg-[#0A0A0A]/15 backdrop-blur-[2px]"
            style={{ animation: "yvr-fade 200ms ease both" }}
            onMouseEnter={scheduleClose}
          />
          <div
            className="fixed left-0 right-0 top-16 z-50 px-6 pt-4"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div
              className="mx-auto grid max-w-[860px] grid-cols-1 gap-5 rounded-2xl border border-[#E8E6E1] bg-white p-5 shadow-[0_24px_60px_-20px_rgba(10,10,10,0.25)] md:grid-cols-[1fr_330px]"
              style={{ animation: "yvr-mega 220ms cubic-bezier(0.16,1,0.3,1) both" }}
            >
              {/* Left: platform items */}
              <div className="flex flex-col">
                <ul>
                  {platformItems.map((it) => {
                    const Icon = it.icon;
                    return (
                      <li key={it.slug}>
                        <Link
                          to="/product/$slug"
                          params={{ slug: it.slug }}
                          onClick={() => setOpen(false)}
                          className="group flex items-start gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-[#F5F3EE]"
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#E8E6E1] bg-white text-[#0A0A0A] transition-colors group-hover:border-[#D8D5CE]">
                            <Icon className="h-[18px] w-[18px]" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[15px] font-semibold leading-tight text-[#0A0A0A]">{it.title}</span>
                            <span className="mt-1 block text-[13px] leading-snug text-[#6B6B6B]">{it.description}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  to="/product"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 px-3 pt-3 text-[13.5px] font-medium text-[#0A0A0A] transition-opacity hover:opacity-60"
                >
                  Explore the full platform
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Right: CTA card */}
              <Link
                to="/auth"
                search={{ tab: "signup" }}
                onClick={() => setOpen(false)}
                className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-xl bg-[#0A0A0A] p-6"
              >
                <h3
                  className="relative z-10 text-[22px] leading-snug text-white"
                  style={{ fontFamily: '"Fraunces", "Instrument Serif", ui-serif, Georgia, serif' }}
                >
                  Talk to an evaluation architect
                </h3>
                <span className="relative z-10 mt-3 inline-flex items-center gap-2 text-[14px] font-medium transition-transform duration-200 group-hover:translate-x-1" style={{ color: "#F5A623" }}>
                  Book a demo
                  <ArrowRight className="h-4 w-4" />
                </span>
                <img
                  src={ctaArt}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[70%] w-full object-cover object-top opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </Link>
            </div>
          </div>
        </>
      )}
      <style>{`@keyframes yvr-mega { from { opacity:0; transform: translateY(-8px) scale(0.99) } to { opacity:1; transform:none } } @keyframes yvr-fade { from { opacity:0 } to { opacity:1 } }`}</style>
    </div>
  );
}

/* Mobile: simple stacked list of platform items. */
export function ProductMobileNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="divide-y divide-[#E8E6E1] border-y border-[#E8E6E1]">
      {platformItems.map((it) => {
        const Icon = it.icon;
        return (
          <li key={it.slug}>
            <Link
              to="/product/$slug"
              params={{ slug: it.slug }}
              onClick={onNavigate}
              className="flex items-start gap-3 px-1 py-3"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#E8E6E1] bg-white text-[#0A0A0A]">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[14.5px] font-medium text-[#0A0A0A]">{it.title}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-[#6B6B6B]">{it.description}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
