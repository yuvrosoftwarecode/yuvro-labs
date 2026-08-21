import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { productGroups } from "@/lib/productMenu";
import { ProductGlyph } from "@/components/site/ProductGlyph";

/* Desktop trigger + panel. Hover or click opens; Esc / outside click closes. */
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
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 140); };

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
        className={`inline-flex items-center gap-1.5 py-2 transition-colors ${open ? "text-[#0A0A0A]" : "text-[#6B6B6B] hover:text-[#0A0A0A]"}`}
      >
        Product
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M1 1.2 4.5 4.6 8 1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed left-0 right-0 top-16 z-50 px-6"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div
            className="mx-auto max-w-[1120px] border border-[#E8E6E1] bg-white"
            style={{ animation: "yvr-mega 180ms cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <div className="flex items-baseline justify-between border-b border-[#E8E6E1] px-8 py-4">
              <p className="text-[13px] text-[#6B6B6B]">
                One system to <span className="text-[#0A0A0A]">evaluate</span>, verify, understand, follow up and hire engineers.
              </p>
              <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9A9A94]">
                {["Evaluate", "Verify", "Understand", "Follow up", "Hire"].map((s, i) => (
                  <span key={s} className="flex items-center gap-2">
                    {i > 0 && <span className="text-[#D8D5CE]">/</span>}
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-[#E8E6E1] lg:grid-cols-4">
              {productGroups.map((g) => (
                <div key={g.id} className="px-7 py-6 [&:nth-child(-n+2)]:border-b [&:nth-child(-n+2)]:border-[#E8E6E1] lg:[&:nth-child(-n+2)]:border-b-0">
                  <div className="mb-4 flex items-baseline gap-2">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0A0A0A]">{g.heading}</h3>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#B4B0A8]">{g.caption}</span>
                  </div>
                  <ul className="space-y-0.5">
                    {g.items.map((it) => (
                      <li key={it.slug}>
                        <Link
                          to="/product/$slug"
                          params={{ slug: it.slug }}
                          onClick={() => setOpen(false)}
                          className="group -mx-2 flex gap-2.5 rounded-[3px] px-2 py-2 transition-colors hover:bg-[#F5F3EE]"
                        >
                          <ProductGlyph name={it.glyph} className="mt-[3px] shrink-0 text-[#8A867E] transition-colors group-hover:text-[#0A0A0A]" />
                          <span className="min-w-0">
                            <span className={`block text-[13.5px] leading-tight ${it.emphasis ? "font-medium text-[#0A0A0A]" : "text-[#2A2A28]"}`}>
                              {it.title}
                              {it.emphasis && <span className="ml-1.5 inline-block h-1 w-1 translate-y-[-2px] rounded-full" style={{ background: "#F5A623" }} />}
                            </span>
                            <span className="mt-0.5 block text-[11.5px] leading-snug text-[#8A867E]">{it.short}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-[#E8E6E1] px-8 py-3">
              <span className="text-[11.5px] text-[#8A867E]">Engineering Simulations · Vitarka AI · Evaluation Builder</span>
              <Link to="/product" onClick={() => setOpen(false)} className="inline-flex items-center gap-1.5 text-[12.5px] text-[#0A0A0A] hover:opacity-70">
                Explore Yuvro Labs
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5h9M6.6 1.4 10.2 5l-3.6 3.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes yvr-mega { from { opacity:0; transform: translateY(-6px) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
}

/* Mobile: stacked accordion, not a shrunken mega-menu. */
export function ProductMobileNav({ onNavigate }: { onNavigate?: () => void }) {
  const [openGroup, setOpenGroup] = useState<string | null>("platform");
  return (
    <div className="divide-y divide-[#E8E6E1] border-y border-[#E8E6E1]">
      {productGroups.map((g) => {
        const open = openGroup === g.id;
        return (
          <div key={g.id}>
            <button
              type="button"
              onClick={() => setOpenGroup(open ? null : g.id)}
              className="flex w-full items-center justify-between px-1 py-3.5 text-left"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0A0A0A]">{g.heading}</span>
              <svg width="10" height="7" viewBox="0 0 9 6" fill="none" className={`text-[#8A867E] transition-transform ${open ? "rotate-180" : ""}`}>
                <path d="M1 1.2 4.5 4.6 8 1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && (
              <ul className="pb-3">
                {g.items.map((it) => (
                  <li key={it.slug}>
                    <Link
                      to="/product/$slug"
                      params={{ slug: it.slug }}
                      onClick={onNavigate}
                      className="flex gap-2.5 px-1 py-2.5"
                    >
                      <ProductGlyph name={it.glyph} className="mt-[3px] shrink-0 text-[#8A867E]" />
                      <span>
                        <span className="block text-[14px] text-[#0A0A0A]">{it.title}</span>
                        <span className="block text-[12px] text-[#8A867E]">{it.short}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
