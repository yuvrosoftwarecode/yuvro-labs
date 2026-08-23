import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ProductMegaMenu, ProductMobileNav } from "@/components/site/ProductMegaMenu";

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="grid h-8 w-8 place-items-center rounded-lg text-white font-mono text-sm" style={{ background: "#0A0A0A" }}>Y</div>
          <span className="text-base">Yuvro Labs</span>
        </Link>
        <nav className="ml-10 hidden md:flex items-center gap-7 text-sm text-[#6B6B6B]">
          <ProductMegaMenu />
          <Link to="/solutions" className="hover:text-[#0A0A0A] transition">Solutions</Link>
          <Link to="/pricing" className="hover:text-[#0A0A0A] transition">Pricing</Link>
          <Link to="/recruiter-login" className="hover:text-[#0A0A0A] transition">Recruiter Login</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/auth" search={{ tab: "signin" }} className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A] transition">Sign In</Link>
          <Link to="/auth" search={{ tab: "signup" }} className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-white transition hover:brightness-95" style={{ background: "#F5A623" }}>
            Get Started
            <svg width="13" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5h9M6.6 1.4 10.2 5l-3.6 3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden grid h-9 w-9 place-items-center rounded-md border border-[#E8E6E1] text-[#0A0A0A]"
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d={mobileOpen ? "M2 2l12 8M14 2 2 10" : "M1 1.5h14M1 6h14M1 10.5h14"} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-[#E8E6E1] bg-white px-5 pb-8 pt-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A867E]">Platform</p>
          <ProductMobileNav onNavigate={() => setMobileOpen(false)} />
          <div className="mt-5 flex flex-col gap-3 text-[15px]">
            <Link to="/solutions" onClick={() => setMobileOpen(false)} className="text-[#2A2A28]">Solutions</Link>
            <Link to="/pricing" onClick={() => setMobileOpen(false)} className="text-[#2A2A28]">Pricing</Link>
            <Link to="/recruiter-login" onClick={() => setMobileOpen(false)} className="text-[#2A2A28]">Recruiter Login</Link>
          </div>
        </div>
      )}
    </header>
  );
}
