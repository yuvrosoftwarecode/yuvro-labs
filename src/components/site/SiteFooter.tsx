import { Link } from "@tanstack/react-router";

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
    href: "https://www.linkedin.com/",
    path: "M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.24 8.02h4.49V24H.24V8.02Zm7.85 0h4.3v2.18h.06c.6-1.14 2.06-2.34 4.24-2.34 4.54 0 5.38 2.99 5.38 6.88V24h-4.49v-7.36c0-1.76-.03-4.03-2.45-4.03-2.46 0-2.83 1.92-2.83 3.9V24H8.09V8.02Z",
  },
  {
    label: "X",
    href: "https://x.com/",
    path: "M18.24 2H21l-6.55 7.49L22.5 22h-6.09l-4.77-6.24L6.17 22H3.4l7.02-8.02L1.8 2h6.24l4.31 5.7L18.24 2Zm-1.07 18.3h1.53L7.1 3.6H5.46l11.71 16.7Z",
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    path: "M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.1.79-.25.79-.56v-2c-3.22.7-3.9-1.55-3.9-1.55-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.73-1.56-2.57-.29-5.28-1.29-5.28-5.72 0-1.27.45-2.3 1.2-3.11-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.2 1.19a11 11 0 0 1 5.82 0c2.22-1.5 3.19-1.19 3.19-1.19.63 1.59.23 2.77.12 3.06.75.81 1.19 1.84 1.19 3.11 0 4.44-2.71 5.42-5.3 5.71.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.55A11.5 11.5 0 0 0 12 .5Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/",
    path: "M23.5 6.9a3 3 0 0 0-2.11-2.13C19.5 4.25 12 4.25 12 4.25s-7.5 0-9.39.52A3 3 0 0 0 .5 6.9C0 8.8 0 12 0 12s0 3.2.5 5.1a3 3 0 0 0 2.11 2.13c1.89.52 9.39.52 9.39.52s7.5 0 9.39-.52a3 3 0 0 0 2.11-.52 2.11 2.11 0 0 0 0-.01C24 15.2 24 12 24 12s0-3.2-.5-5.1ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z",
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
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white font-mono text-sm text-[#0A0A0A]">
                Y
              </span>
              <span className="text-base">Yuvro Labs</span>
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
                <Link to="/demo" className="text-white/65 transition hover:text-white">
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
              to="/demo"
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
