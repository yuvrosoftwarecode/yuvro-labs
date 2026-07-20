import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, X, Play, GitBranch, GitPullRequest, GitCommit, Bug, Database, Cpu, Server, Terminal, FileCode2, Download, ChevronRight, Circle } from "lucide-react";

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
    <div className="min-h-screen bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      <LandingNav />
      <Hero />
      <VersusSection />
      <ReportSplit />
      <EvaluationFlow />
      <SimulationLabs />
      <CapabilityMetrics />
      <ReportPreview />
      <ProcessStrip />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ================================================================
   HEADER — LOCKED. Do not modify.
   ================================================================ */
function LandingNav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 text-white font-mono text-sm shadow-lg shadow-blue-500/30">Y</div>
          <span className="text-base">Yuvro Labs</span>
        </Link>
        <nav className="ml-10 hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#labs" className="hover:text-foreground transition">Labs</a>
          <a href="#process" className="hover:text-foreground transition">How it works</a>
          <a href="#report" className="hover:text-foreground transition">Report</a>
          <Link to="/recruiter" className="hover:text-foreground transition">Recruiter Login</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/auth" search={{ tab: "signin" }} className="text-sm text-muted-foreground hover:text-foreground transition">Sign In</Link>
          <Link to="/auth" search={{ tab: "signup" }} className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 transition">
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ================================================================
   SECTION 1 — HERO
   ================================================================ */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-neutral-500">
            <span className="h-px w-8 bg-neutral-300" />
            Engineering Capability Verification
          </div>
          <h1 className="mt-6 text-[52px] lg:text-[68px] leading-[0.98] tracking-[-0.03em] font-semibold">
            Stop Hiring<br />
            <span className="text-neutral-400">Developers.</span><br />
            Start Verifying<br />
            <span className="relative inline-block">
              Engineers.
              <span className="absolute -bottom-1 left-0 right-0 h-[6px] bg-blue-600/90" />
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-neutral-600">
            Yuvro Labs evaluates real engineering capability using Engineering Simulation Labs, Knowledge Assessments and Vitarka AI Interviews. Know how candidates think, debug, collaborate and solve production problems — before making hiring decisions.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/auth" search={{ tab: "signup" }} className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-5 py-3 text-[14px] font-medium text-white hover:bg-neutral-800 transition">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#process" className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-5 py-3 text-[14px] font-medium text-neutral-900 hover:border-neutral-900 transition">
              <Play className="h-3.5 w-3.5" /> Book Demo
            </a>
          </div>
          <div className="mt-12 flex items-center gap-8 text-[11px] uppercase tracking-[0.18em] text-neutral-400">
            <span>Engineering Labs</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>Knowledge Assessment</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>Vitarka AI</span>
          </div>
        </div>

        <HeroWorkspace />
      </div>
    </section>
  );
}

function HeroWorkspace() {
  return (
    <div className="relative">
      {/* Ambient grid backdrop */}
      <div className="absolute -inset-8 -z-10 opacity-[0.4] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgb(0_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Main evaluation card */}
      <div className="relative rounded-xl border border-neutral-200 bg-white shadow-[0_1px_0_rgba(0,0,0,0.03),0_20px_60px_-20px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-neutral-300" />
              <div className="h-2 w-2 rounded-full bg-neutral-300" />
              <div className="h-2 w-2 rounded-full bg-neutral-300" />
            </div>
            <span className="ml-2">evaluation / EVAL-2847</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">Live</span>
        </div>

        <div className="grid grid-cols-[1fr_1.4fr]">
          {/* Left rail: evaluation stages */}
          <div className="border-r border-neutral-200 p-4 space-y-3 bg-neutral-50/40">
            <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Stages</div>
            {[
              { t: "Engineering Labs", s: "Passed", v: 92, d: true },
              { t: "Knowledge Assessment", s: "Passed", v: 84, d: true },
              { t: "Vitarka AI Interview", s: "In Review", v: 76, d: false },
              { t: "Recruiter Evaluation", s: "Pending", v: 0, d: false },
            ].map((r, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-neutral-900">
                    <span className={`grid h-4 w-4 place-items-center rounded-full border ${r.d ? "border-neutral-900 bg-neutral-900" : "border-neutral-300 bg-white"}`}>
                      {r.d ? <Check className="h-2.5 w-2.5 text-white" /> : <Circle className="h-1.5 w-1.5 fill-neutral-300 text-neutral-300" />}
                    </span>
                    {r.t}
                  </div>
                  <span className="text-[10px] text-neutral-500">{r.s}</span>
                </div>
                <div className="mt-2 ml-6 h-1 rounded-full bg-neutral-200 overflow-hidden">
                  <div className="h-full bg-neutral-900" style={{ width: `${r.v}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Right: ECI + activity */}
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-400">Engineering Capability Index</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[52px] leading-none font-semibold tracking-tight">84</span>
                  <span className="text-[13px] text-neutral-500">/ 100</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Strong Fit
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[92, 84, 76, 88, 71, 90].map((v, i) => (
                  <div key={i} className="h-8 w-8 rounded-md border border-neutral-200 grid place-items-center text-[10px] font-mono text-neutral-700">
                    {v}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-neutral-100 pt-4">
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Recent Signals</div>
              <div className="space-y-2.5 text-[12px]">
                <Signal icon={<GitPullRequest className="h-3 w-3" />} label="Fixed payment webhook race condition" meta="Lab · Debugging" />
                <Signal icon={<Terminal className="h-3 w-3" />} label="Explained JWT rotation trade-offs" meta="Vitarka · 4m clip" />
                <Signal icon={<Database className="h-3 w-3" />} label="Optimized N+1 query (−340ms)" meta="Lab · Performance" />
                <Signal icon={<Bug className="h-3 w-3" />} label="Identified missing idempotency key" meta="Lab · Production Incident" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-5 -left-5 rotate-[-2deg] rounded-md border border-neutral-200 bg-white px-3 py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]">
        <div className="text-[9px] uppercase tracking-widest text-neutral-400">Recommendation</div>
        <div className="text-[13px] font-semibold">Shortlist for onsite</div>
      </div>
    </div>
  );
}

function Signal({ icon, label, meta }: { icon: React.ReactNode; label: string; meta: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 grid h-5 w-5 place-items-center rounded border border-neutral-200 bg-white text-neutral-500">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-neutral-900 truncate">{label}</div>
        <div className="text-[10px] text-neutral-400 font-mono">{meta}</div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION 2 — Traditional Hiring vs Yuvro Labs
   ================================================================ */
function VersusSection() {
  const traditional = ["Resume", "MCQ", "Interview", "Guesswork", "Hire"];
  const yuvro = ["Engineering Labs", "Knowledge Assessment", "Vitarka AI", "Engineering Capability Index", "Evidence Based Hiring"];
  return (
    <section className="border-t border-neutral-200 bg-neutral-50/60">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">The Shift</div>
          <h2 className="mt-3 text-[40px] leading-[1.05] tracking-[-0.02em] font-semibold">
            Recruiters don't hire resumes.<br />
            <span className="text-neutral-400">They hire engineering capability.</span>
          </h2>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-10 lg:gap-16">
          <FlowColumn
            eyebrow="Traditional Hiring"
            tone="muted"
            steps={traditional}
            trailingIcon={<X className="h-3.5 w-3.5" />}
            trailingLabel="Guesswork based"
          />
          <FlowColumn
            eyebrow="Yuvro Labs"
            tone="brand"
            steps={yuvro}
            trailingIcon={<Check className="h-3.5 w-3.5" />}
            trailingLabel="Evidence based"
          />
        </div>
      </div>
    </section>
  );
}

function FlowColumn({ eyebrow, tone, steps, trailingIcon, trailingLabel }: { eyebrow: string; tone: "muted" | "brand"; steps: string[]; trailingIcon: React.ReactNode; trailingLabel: string }) {
  const brand = tone === "brand";
  return (
    <div className={`relative rounded-lg p-8 ${brand ? "bg-white border border-neutral-900" : "bg-white/60 border border-dashed border-neutral-300"}`}>
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</div>
        <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] ${brand ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500"}`}>
          {trailingIcon}
          {trailingLabel}
        </div>
      </div>
      <div className="mt-6 space-y-0">
        {steps.map((s, i) => (
          <div key={s} className="group">
            <div className="flex items-center gap-4 py-3">
              <span className={`grid h-8 w-8 place-items-center rounded-full border font-mono text-[11px] ${brand ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white text-neutral-500"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-[16px] tracking-tight ${brand ? "text-neutral-900 font-medium" : "text-neutral-500 line-through decoration-neutral-300"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="ml-4 h-4 border-l border-dashed border-neutral-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION 3 — Report split (left preview, right explanations)
   ================================================================ */
function ReportSplit() {
  const items = [
    { t: "Engineering Labs", d: "Evaluate practical engineering capability through debugging, feature development, optimization and production-style tasks." },
    { t: "Knowledge Assessment", d: "Measure conceptual understanding across programming languages, databases, frameworks and engineering fundamentals." },
    { t: "Vitarka AI Interview", d: "Understand communication, reasoning, architecture decisions and technical depth through adaptive AI conversations." },
    { t: "Engineering Capability Index", d: "One unified engineering score backed by practical evidence." },
    { t: "Recruiter Report", d: "Everything available in one downloadable, shareable report." },
  ];
  return (
    <section id="report" className="border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 py-28 grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-16">
        <MiniReportPreview />
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">The Recruiter Report</div>
          <h2 className="mt-3 text-[40px] leading-[1.05] tracking-[-0.02em] font-semibold">
            Everything recruiters<br />actually need.
          </h2>
          <p className="mt-5 text-[15px] text-neutral-600 max-w-lg">
            One report. Four layers of evidence. Zero guesswork. Every claim traceable back to a real engineering artifact.
          </p>
          <div className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
            {items.map((it, i) => (
              <div key={it.t} className="grid grid-cols-[auto_1fr] gap-6 py-6">
                <div className="text-[11px] font-mono text-neutral-400 pt-1">0{i + 1}</div>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight">{it.t}</h3>
                  <p className="mt-1.5 text-[14px] text-neutral-600 leading-relaxed">{it.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniReportPreview() {
  return (
    <div className="relative">
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
        <div className="border-b border-neutral-200 px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-400">Candidate Report · CR-2847</div>
            <div className="mt-1 text-[18px] font-semibold tracking-tight">Priya Nair — Senior Backend Engineer</div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2 py-1 text-[11px] text-neutral-600">
            <Download className="h-3 w-3" /> PDF
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-neutral-200 border-b border-neutral-200">
          {[
            { k: "Labs", v: "92" },
            { k: "Assessment", v: "84" },
            { k: "Vitarka", v: "76" },
          ].map(x => (
            <div key={x.k} className="px-6 py-5">
              <div className="text-[10px] uppercase tracking-widest text-neutral-400">{x.k}</div>
              <div className="mt-1 text-[28px] font-semibold tracking-tight">{x.v}</div>
              <div className="mt-2 h-1 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-neutral-900" style={{ width: `${x.v}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-widest text-neutral-400">Engineering Capability Index</div>
            <div className="text-[11px] text-neutral-500 font-mono">weighted composite</div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[56px] leading-none font-semibold tracking-tight">84</span>
            <span className="text-[13px] text-neutral-500">/ 100 · Strong Fit</span>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-1 h-2">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className={`h-full rounded-sm ${i < 50 ? "bg-neutral-900" : "bg-neutral-200"}`} />
            ))}
          </div>
        </div>
        <div className="border-t border-neutral-200 px-6 py-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-400">Strengths</div>
            <ul className="mt-2 space-y-1 text-[12px] text-neutral-700">
              <li>· Systems debugging under time pressure</li>
              <li>· API design & idempotency reasoning</li>
              <li>· Clear technical communication</li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-400">Gaps</div>
            <ul className="mt-2 space-y-1 text-[12px] text-neutral-700">
              <li>· Distributed cache invalidation depth</li>
              <li>· Cost/perf trade-off articulation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION 4 — Inside Every Evaluation (flow)
   ================================================================ */
function EvaluationFlow() {
  const nodes = [
    "Invite Candidate", "Engineering Labs", "Knowledge Assessment", "Vitarka AI Interview", "AI Evaluation", "Engineering Capability Report", "Recruiter Decision"
  ];
  return (
    <section className="border-t border-neutral-200 bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Inside Every Evaluation</div>
          <h2 className="mt-3 text-[40px] leading-[1.05] tracking-[-0.02em] font-semibold text-white">
            A single connected flow.<br />
            <span className="text-neutral-500">Every step produces evidence.</span>
          </h2>
        </div>

        <div className="mt-16 relative">
          <div className="absolute left-0 right-0 top-6 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent hidden md:block" />
          <div className="grid md:grid-cols-7 gap-6 md:gap-0">
            {nodes.map((n, i) => (
              <div key={n} className="relative flex md:flex-col items-center md:items-start gap-4 md:gap-3">
                <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-neutral-700 bg-neutral-900">
                  <span className="font-mono text-[11px] text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <div className="text-[13px] font-medium tracking-tight text-white leading-tight max-w-[120px]">{n}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-neutral-500">stage</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 5 — Engineering Simulation Labs (repo-style)
   ================================================================ */
function SimulationLabs() {
  const tasks = [
    { id: "PAY-142", t: "Broken Payment API", diff: "Hard", time: "45m", domain: "FinTech", skills: ["Debugging", "Idempotency", "Webhooks"] },
    { id: "API-089", t: "REST API Development", diff: "Mid", time: "60m", domain: "SaaS", skills: ["Design", "REST", "Validation"] },
    { id: "SQL-217", t: "SQL Query Optimization", diff: "Mid", time: "30m", domain: "Data", skills: ["Indexing", "Query plans"] },
    { id: "BOOT-058", t: "Spring Boot Debugging", diff: "Hard", time: "50m", domain: "Enterprise", skills: ["JVM", "Spring", "Traces"] },
    { id: "RCT-311", t: "React Performance Issue", diff: "Mid", time: "40m", domain: "Consumer", skills: ["Rendering", "Memoization"] },
    { id: "MS-402", t: "Microservice Failure", diff: "Hard", time: "55m", domain: "Platform", skills: ["Retries", "Circuit breakers"] },
    { id: "AUTH-076", t: "Authentication Flow", diff: "Mid", time: "35m", domain: "Security", skills: ["JWT", "OAuth", "Sessions"] },
    { id: "CACHE-129", t: "Redis Cache Issue", diff: "Mid", time: "30m", domain: "Backend", skills: ["Caching", "TTL"] },
    { id: "MQ-215", t: "Message Queue Processing", diff: "Hard", time: "50m", domain: "Distributed", skills: ["Kafka", "Ordering", "DLQ"] },
  ];
  return (
    <section id="labs" className="border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="flex items-end justify-between gap-8 flex-wrap">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Engineering Simulation Labs</div>
            <h2 className="mt-3 text-[40px] leading-[1.05] tracking-[-0.02em] font-semibold">
              Real engineering tickets.<br />
              <span className="text-neutral-400">Not toy problems.</span>
            </h2>
          </div>
          <div className="text-[12px] font-mono text-neutral-500 flex items-center gap-2">
            <GitBranch className="h-3.5 w-3.5" /> yuvro-labs/simulation-catalog · main
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-neutral-200 overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-6 border-b border-neutral-200 bg-neutral-50 px-5 py-2.5 text-[10px] uppercase tracking-widest text-neutral-500">
            <div>ID</div>
            <div>Task</div>
            <div>Domain</div>
            <div>Difficulty</div>
            <div>Est. Time</div>
          </div>
          {tasks.map((task, i) => (
            <div key={task.id} className={`group grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-6 px-5 py-4 transition hover:bg-neutral-50 ${i < tasks.length - 1 ? "border-b border-neutral-100" : ""}`}>
              <div className="font-mono text-[11px] text-neutral-400 w-20">{task.id}</div>
              <div>
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="text-[15px] font-medium tracking-tight">{task.t}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {task.skills.map(s => (
                    <span key={s} className="rounded-sm bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-600">{s}</span>
                  ))}
                </div>
              </div>
              <div className="text-[12px] text-neutral-500">{task.domain}</div>
              <div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${task.diff === "Hard" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700"}`}>{task.diff}</span>
              </div>
              <div className="font-mono text-[11px] text-neutral-500 w-12 text-right">{task.time}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 6 — Capability metrics (measurement bars)
   ================================================================ */
function CapabilityMetrics() {
  const metrics = [
    { t: "Debugging", v: 92 },
    { t: "Problem Solving", v: 88 },
    { t: "Architecture", v: 74 },
    { t: "API Development", v: 90 },
    { t: "Database Design", v: 71 },
    { t: "Performance Optimization", v: 82 },
    { t: "System Thinking", v: 78 },
    { t: "Communication", v: 85 },
    { t: "Collaboration", v: 80 },
    { t: "Code Quality", v: 87 },
    { t: "Learning Ability", v: 76 },
    { t: "Engineering Ownership", v: 89 },
  ];
  return (
    <section className="border-t border-neutral-200 bg-neutral-50/60">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">What we measure</div>
          <h2 className="mt-3 text-[40px] leading-[1.05] tracking-[-0.02em] font-semibold">
            Twelve engineering dimensions.<br />
            <span className="text-neutral-400">Measured as evidence, not opinion.</span>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-x-16 gap-y-3">
          {metrics.map((m, i) => (
            <div key={m.t} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 py-3 border-b border-neutral-200">
              <div className="font-mono text-[11px] text-neutral-400 w-6">{String(i + 1).padStart(2, "0")}</div>
              <div className="text-[14px] tracking-tight font-medium">{m.t}</div>
              <div className="w-40 h-[3px] rounded-full bg-neutral-200 overflow-hidden">
                <div className="h-full bg-neutral-900" style={{ width: `${m.v}%` }} />
              </div>
              <div className="w-8 text-right font-mono text-[11px] text-neutral-700">{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 7 — Candidate Evaluation Report (full)
   ================================================================ */
function ReportPreview() {
  return (
    <section className="border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="max-w-2xl mb-14">
          <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Candidate Evaluation Report</div>
          <h2 className="mt-3 text-[40px] leading-[1.05] tracking-[-0.02em] font-semibold">
            One report.<br />
            <span className="text-neutral-400">Every piece of evidence.</span>
          </h2>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)]">
          {/* Report header */}
          <div className="border-b border-neutral-200 px-8 py-6 flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-400">Report · CR-2847 · Confidential</div>
              <div className="mt-2 text-[22px] font-semibold tracking-tight">Priya Nair</div>
              <div className="text-[13px] text-neutral-500">Senior Backend Engineer · Evaluated for FinTech Platform Team</div>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 text-white px-3 py-1.5 text-[12px] hover:bg-neutral-800 transition">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
          </div>

          {/* Scores grid */}
          <div className="grid md:grid-cols-4 divide-x divide-neutral-200 border-b border-neutral-200">
            {[
              { k: "Engineering Labs", v: 92, sub: "8 of 9 tasks" },
              { k: "Assessment", v: 84, sub: "42 of 50" },
              { k: "Vitarka AI", v: 76, sub: "4 dimensions" },
              { k: "ECI", v: 84, sub: "Strong Fit" },
            ].map(x => (
              <div key={x.k} className="p-6">
                <div className="text-[10px] uppercase tracking-widest text-neutral-400">{x.k}</div>
                <div className="mt-2 text-[36px] font-semibold tracking-tight">{x.v}</div>
                <div className="text-[11px] text-neutral-500">{x.sub}</div>
              </div>
            ))}
          </div>

          {/* AI Recommendation */}
          <div className="border-b border-neutral-200 px-8 py-6 flex items-center justify-between gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-400">AI Recommendation</div>
              <div className="mt-1 text-[17px] font-medium tracking-tight">Shortlist for onsite. Strong debugging, thoughtful trade-offs, clean communication.</div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white px-3 py-1 text-[11px] font-medium">Strong Fit · 84 ECI</span>
          </div>

          {/* Sections */}
          <div className="grid md:grid-cols-3 divide-x divide-neutral-200">
            <div className="p-8">
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Strengths</div>
              <ul className="space-y-3 text-[13px]">
                {[
                  "Debugged race condition in under 12 minutes",
                  "Correctly identified missing idempotency key",
                  "Explained JWT rotation trade-offs clearly",
                  "Optimized N+1 query, cut latency by 340ms",
                ].map(s => (
                  <li key={s} className="flex gap-2 items-start"><Check className="h-3.5 w-3.5 mt-0.5 text-neutral-900" /><span className="text-neutral-700">{s}</span></li>
                ))}
              </ul>
            </div>
            <div className="p-8">
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Weaknesses</div>
              <ul className="space-y-3 text-[13px]">
                {[
                  "Distributed cache invalidation depth",
                  "Cost/performance trade-off articulation",
                  "Limited exposure to event sourcing",
                ].map(s => (
                  <li key={s} className="flex gap-2 items-start"><X className="h-3.5 w-3.5 mt-0.5 text-neutral-400" /><span className="text-neutral-700">{s}</span></li>
                ))}
              </ul>
            </div>
            <div className="p-8 bg-neutral-50/60">
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Recruiter Notes</div>
              <div className="rounded-md border border-neutral-200 bg-white p-3 text-[12px] text-neutral-700 leading-relaxed">
                Rare candidate — actually reasons about failure modes. Recommend routing to platform team round with distributed systems focus. Pair with senior on cache design in first sprint.
              </div>
              <div className="mt-3 text-[10px] font-mono text-neutral-400">— M. Rao · Head of Engineering</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 8 — Process strip
   ================================================================ */
function ProcessStrip() {
  const steps = ["Invite", "Evaluate", "Review", "Hire"];
  return (
    <section id="process" className="border-t border-neutral-200">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center max-w-xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Evaluation Process</div>
          <h2 className="mt-3 text-[36px] leading-[1.05] tracking-[-0.02em] font-semibold">
            Four steps. Zero guesswork.
          </h2>
        </div>
        <div className="mt-14 flex items-center justify-between gap-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-6 flex-1">
              <div className="flex-1 text-center">
                <div className="text-[11px] font-mono text-neutral-400">0{i + 1}</div>
                <div className="mt-2 text-[20px] tracking-tight font-medium">{s}</div>
              </div>
              {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-neutral-300 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 9 — Final CTA
   ================================================================ */
function FinalCTA() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-28 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-end">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">The bottom line</div>
          <h2 className="mt-4 text-[56px] lg:text-[72px] leading-[0.98] tracking-[-0.03em] font-semibold">
            Hire Engineers.<br />
            <span className="text-neutral-500">Not Interview Performers.</span>
          </h2>
        </div>
        <div>
          <p className="text-[16px] text-neutral-300 leading-relaxed max-w-md">
            Verify engineering capability before making hiring decisions. Bring evidence into every hiring conversation.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#" className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-[14px] font-medium text-neutral-900 hover:bg-neutral-100 transition">
              Book Demo <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link to="/auth" search={{ tab: "signup" }} className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-5 py-3 text-[14px] font-medium text-white hover:border-white transition">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Footer
   ================================================================ */
function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-[12px] text-neutral-500">
        <div className="flex items-center gap-2">
          <GitCommit className="h-3.5 w-3.5" />
          <span className="font-mono">© {new Date().getFullYear()} Yuvro Labs · Engineering Capability Verification</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-neutral-900">Privacy</a>
          <a href="#" className="hover:text-neutral-900">Terms</a>
          <a href="#" className="hover:text-neutral-900">Security</a>
          <a href="#" className="hover:text-neutral-900">Contact</a>
        </div>
      </div>
    </footer>
  );
}
