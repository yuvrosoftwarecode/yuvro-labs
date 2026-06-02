import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Code2, Users, Trophy, Briefcase, Rocket, Sparkles, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yuvro Labs — Master Engineering Through Real Collaboration" },
      { name: "description", content: "Solve real coding challenges. Collaborate with peers. Build engineering reputation. Get hired." },
      { property: "og:title", content: "Yuvro Labs" },
      { property: "og:description", content: "Practical engineering learning platform with team sprints and recruiter-visible credentials." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <LandingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}

function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-emerald-500 to-violet-600 font-mono text-sm">Y</div>
          <span className="text-lg tracking-tight">Yuvro Labs</span>
        </Link>
        <nav className="ml-10 hidden items-center gap-7 text-sm text-white/70 md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how" className="hover:text-white">How It Works</a>
          <a href="#cta" className="hover:text-white">Get Started</a>
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <Link to="/signin" className="rounded-md px-3 py-1.5 text-white/80 hover:text-white">Sign In</Link>
          <Link to="/signup" className="rounded-md bg-emerald-500 px-4 py-1.5 font-medium text-white hover:bg-emerald-600">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#5B21B6]" />
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-5 md:py-32">
        <div className="md:col-span-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <Sparkles className="h-3 w-3" /> 2026 cohort is live
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Master Engineering Through{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
              Real Collaboration
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/70">
            Solve real coding challenges. Collaborate with peers. Build your engineering reputation. Get hired.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/signin" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10">
              Sign In
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/50">Trusted by 10,000+ engineers</p>
        </div>

        <div className="md:col-span-2">
          <div className="relative rounded-2xl border border-white/10 bg-[#0B1020]/80 p-1 shadow-2xl shadow-violet-900/40 backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              <span className="ml-3 font-mono text-xs text-white/40">sprint-42 / ticket-7.ts</span>
            </div>
            <pre className="overflow-hidden p-5 font-mono text-[12px] leading-relaxed text-white/80">
{`// Pair sprint · live
function rankCandidates(team) {
  return team
    .filter(m => m.skills.includes("react"))
    .sort((a,b) => b.xp - a.xp)
    .slice(0, 5);
}

// ✓ tests passing  · merged by @priya
// + 250 XP earned`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: Code2, title: "Real Coding Challenges", desc: "Jira-style tickets pulled from actual production scenarios — not toy LeetCode puzzles." },
  { icon: Users, title: "Team Sprints", desc: "Pair up across roles (SQL, backend, frontend) and ship features as a real team." },
  { icon: Trophy, title: "Engineering Reputation", desc: "Earn XP, badges, and rankings backed by reviewed code — not just self-reported skills." },
  { icon: Briefcase, title: "Recruiter-Visible", desc: "Your portfolio of merged PRs and shipped sprints is shareable with hiring managers." },
  { icon: Rocket, title: "Career Ready", desc: "Mock standups, code reviews, and retros mirror the muscles you'll use day-one on the job." },
  { icon: Shield, title: "Mentor Support", desc: "Senior engineers review your PRs and unblock you when you're stuck." },
];

function Features() {
  return (
    <section id="features" className="relative bg-[#0B1020] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything you need to ship like a real engineer</h2>
          <p className="mt-4 text-white/60">Solo labs build fundamentals. Collaboration Hub builds the team skills companies actually pay for.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/40 hover:bg-white/[0.06]">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-violet-500/20 text-emerald-300">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { n: "01", title: "Pick a Lab or Sprint", desc: "Choose a solo lab (Java, Python, SQL, UI) or join a multi-role sprint." },
  { n: "02", title: "Solve & Collaborate", desc: "Use the in-browser IDE, pair-program, request reviews, and merge PRs." },
  { n: "03", title: "Build Reputation", desc: "Earn XP, complete sprints, climb the leaderboard, and unlock certificates recruiters trust." },
];

function HowItWorks() {
  return (
    <section id="how" className="relative bg-gradient-to-b from-[#0B1020] to-[#0F172A] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
          <p className="mt-4 text-white/60">Three steps from sign-up to your first merged PR.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <span className="font-mono text-5xl font-bold text-transparent bg-gradient-to-br from-emerald-400/30 to-violet-400/30 bg-clip-text">{s.n}</span>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="cta" className="relative overflow-hidden bg-[#0F172A] py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Start building your engineering reputation today.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">Join thousands of engineers leveling up through real, reviewed, collaborative work.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/signup" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/signin" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3 text-base font-semibold text-white hover:bg-white/10">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B1020] py-10 text-sm text-white/50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded bg-gradient-to-br from-emerald-500 to-violet-600 font-mono text-xs text-white">Y</div>
          <span>© {new Date().getFullYear()} Yuvro Labs</span>
        </div>
        <div className="flex gap-6">
          <Link to="/signin" className="hover:text-white">Sign In</Link>
          <Link to="/signup" className="hover:text-white">Sign Up</Link>
          <Link to="/admin/login" className="hover:text-white">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
