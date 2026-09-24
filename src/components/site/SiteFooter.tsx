import { Link } from "@tanstack/react-router";
import YuvroLogo from "@/assets/YuvroLogo.png";

function Social({ label, href, path }: { label: string; href: string; path: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-md border border-white/15 bg-white/5 text-white/60 transition hover:-translate-y-0.5 hover:border-white/40 hover:text-white"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/yuvro/",
    path: "M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.24 8.02h4.49V24H.24V8.02Zm7.85 0h4.3v2.18h.06c.6-1.14 2.06-2.34 4.24-2.34 4.54 0 5.38 2.99 5.38 6.88V24h-4.49v-7.36c0-1.76-.03-4.03-2.45-4.03-2.46 0-2.83 1.92-2.83 3.9V24H8.09V8.02Z",
  },
];

const PLATFORM = [
  { slug: "engineering-simulations", title: "Engineering Simulations" },
  { slug: "vitarka-ai", title: "Vitarka AI Interviews" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* brand */}
          <div className="md:col-span-5">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold tracking-tight text-white"
            >
              <img src={YuvroLogo} alt="Yuvro" className="h-8 w-auto" />
              <span className="text-base">Yuvro</span>
            </Link>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/55">
              Evaluate engineers through real work — simulations, assessments and interviews that
              adapt, with evidence behind every hiring decision.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <Social key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* link columns */}
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
              Platform
            </p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              {PLATFORM.map((i) => (
                <li key={i.slug}>
                  <Link
                    to={`/product/${i.slug}` as any}
                    className="text-white/65 transition hover:text-white"
                  >
                    {i.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
              Company
            </p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li>
                <Link to="/solutions" className="text-white/65 transition hover:text-white">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-white/65 transition hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/yuvrolabs" className="text-white/65 transition hover:text-white">
                  Yuvro Labs
                </Link>
              </li>
              <li>
                <Link to="/book-demo" className="text-white/65 transition hover:text-white">
                  Book a demo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/12 bg-white/[0.04] px-6 py-5">
          <p className="text-[14.5px] text-white">
            Ready to see what a candidate can actually build?
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/book-demo"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#0A0A0A] transition hover:opacity-90"
            >
              Book Demo
            </Link>
            <Link to="/pricing" className="text-sm text-white/60 transition hover:text-white">
              See pricing
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[11.5px] text-white/45">
          <span>© {new Date().getFullYear()} Yuvro Labs · Hire with proof</span>
          <div className="flex flex-wrap items-center gap-6">
            <a href="mailto:hello@yuvrolabs.com" className="hover:text-white">
              Contact
            </a>
            <span className="hover:text-white">Privacy</span>
            <span className="hover:text-white">Terms</span>
            <span className="hover:text-white">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
