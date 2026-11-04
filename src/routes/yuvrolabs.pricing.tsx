import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import YuvroLogo from "@/assets/YuvroLogo.png";

export const Route = createFileRoute("/yuvrolabs/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Yuvro" },
      {
        name: "description",
        content:
          "Simple pricing for Yuvro, the developer-hiring platform. Coding assessments, simulation labs and AI mock interviews with a shared submission pool. Start free for 14 days.",
      },
      { property: "og:title", content: "Pricing — Yuvro" },
      {
        property: "og:description",
        content:
          "Startup, Growth and Enterprise plans. Shared submission pool, repository setups and the Work Trail add-on. Start free for 14 days.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: YuvrolabsPricing,
});

/* ============================================================
   Pricing constants — edit here to change prices or copy.
   ============================================================ */

const BRAND = "#F7931E";

const TRIAL = {
  days: 14,
  submissions: 10,
  repos: 1,
};

const STARTUP = {
  name: "Startup",
  monthly: 99,
  yearlyTotal: 990,
  monthlyEquiv: 83,
  submissionsMonthly: 20,
  submissionsYearly: 240,
  features: [
    "20 submissions per month",
    "2 codebase repository setups",
    "1 recruiter login",
    "Candidate reports",
    "AI follow-up questions",
  ],
};

const GROWTH = {
  name: "Growth",
  monthly: 449,
  yearlyTotal: 4490,
  monthlyEquiv: 374,
  submissionsMonthly: 100,
  submissionsYearly: 1200,
  features: [
    "100 submissions per month",
    "5 codebase repository setups",
    "3 recruiter logins",
    "Advanced candidate reports",
    "Custom assessments",
    "Priority support",
  ],
};

const ENTERPRISE = {
  name: "Enterprise",
  features: [
    "Everything in Growth",
    "Custom submission volumes",
    "Custom repository setups and recruiter access",
    "API, MCP and ATS integrations",
    "2,500+ library questions",
    "Dedicated account manager and support",
  ],
};

const WORK_TRAIL = {
  pricePerAssignment: 30,
  min: 1,
  max: 100,
  quickPicks: [1, 5, 10, 25],
  priceList: [
    { qty: 1, total: 30 },
    { qty: 5, total: 150 },
    { qty: 10, total: 300 },
    { qty: 25, total: 750 },
  ],
  description:
    "Work Trail assignments are real, mentored work tasks candidates complete on your behalf. Add them to either plan and pay per assignment.",
};

const EXTRA_SUBMISSION_PRICE = 5;

const FAQS = [
  {
    q: "What counts as a submission?",
    a: "Every completed candidate attempt is a submission — a coding assessment, a simulation lab task, or an AI mock interview. One candidate finishing one evaluation is one submission, no matter how long it takes them.",
  },
  {
    q: "What is a repository setup?",
    a: "A repository setup connects one of your codebases to Yuvro so candidates can be evaluated against your real code. It is configured once and can be reused across assessments. Repository setups never use submissions.",
  },
  {
    q: "When do submissions reset?",
    a: "Your submission pool resets at the start of every billing month — including on yearly plans, where you still get your monthly allotment each month rather than all at once.",
  },
  {
    q: "What if I need more submissions?",
    a: `Extra submissions are ${EXTRA_SUBMISSION_PRICE === 5 ? "$5" : `$${EXTRA_SUBMISSION_PRICE}`} each, added as you need them. Or contact us and we will size a plan for your hiring volume.`,
  },
  {
    q: "How do yearly plans save money?",
    a: "Yearly billing gives you two months free — you pay for ten months and get twelve. Startup is $990 per year and Growth is $4,490 per year.",
  },
  {
    q: "Is Work Trail included in my plan?",
    a: "Work Trail is an optional add-on on Startup and Growth plans. It is billed per assignment at $30 each, and you choose how many assignments you add. Enterprise plans can include custom Work Trail volumes.",
  },
];

/* ============================================================ */

export function YuvrolabsPricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className="ylp min-h-screen bg-background font-sans text-foreground antialiased">
      <style>{YLP_CSS}</style>
      <div className="mx-auto w-full max-w-6xl px-6">
        <SiteHeader />
        <Hero billing={billing} setBilling={setBilling} />
        <TrialStrip />
        <Plans billing={billing} />
        <WorkTrail />
        <HowSubmissionsWork />
        <Faq />
        <ClosingBanner />
        <Footer />
      </div>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="flex h-16 items-center justify-between">
      <Link to="/yuvrolabs" className="flex items-center gap-2" aria-label="Yuvro home">
        <img src={YuvroLogo} alt="Yuvro" className="h-7 w-auto" />
      </Link>
      <nav className="flex items-center gap-6 text-sm text-muted-foreground">
        <Link to="/yuvrolabs" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <Link to="/book-demo" className="transition-colors hover:text-foreground">
          Book a demo
        </Link>
        <Link
          to="/auth"
          search={{ tab: "signin" }}
          className="transition-colors hover:text-foreground"
        >
          Sign in
        </Link>
      </nav>
    </header>
  );
}

type Billing = "monthly" | "yearly";

function Hero() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section className="pt-16 pb-12 text-center sm:pt-20">
      <h1 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Simple pricing. Built for startups and growing teams.
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-[15px] text-muted-foreground">
        Choose a plan that fits your hiring needs.
      </p>
      <BillingToggle billing={billing} setBilling={setBilling} />
    </section>
  );
}

function BillingToggle({
  billing,
  setBilling,
}: {
  billing: Billing;
  setBilling: (b: Billing) => void;
}) {
  return (
    <div className="mt-8 flex justify-center">
      <div className="inline-flex items-center rounded-full border border-border bg-muted p-1">
        <ToggleOption
          active={billing === "monthly"}
          onClick={() => setBilling("monthly")}
          label="Monthly"
        />
        <ToggleOption
          active={billing === "yearly"}
          onClick={() => setBilling("yearly")}
          label="Yearly"
          hint="Save 2 months"
        />
      </div>
    </div>
  );
}

function ToggleOption({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors ${
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {hint ? (
        <span
          className="rounded-full px-2 py-0.5 text-[11px] leading-none font-medium"
          style={{ color: BRAND, backgroundColor: "rgba(247, 147, 30, 0.10)" }}
        >
          {hint}
        </span>
      ) : null}
    </button>
  );
}

function StartFreeButton({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/auth"
      search={{ tab: "signup" }}
      className={`ylp-btn-primary inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 ${className}`}
    >
      Start free
    </Link>
  );
}

function TrialStrip() {
  return (
    <section
      className="mb-14 flex flex-col items-center justify-between gap-4 rounded-2xl border px-6 py-5 sm:flex-row"
      style={{
        borderColor: "rgba(247, 147, 30, 0.35)",
        backgroundColor: "rgba(247, 147, 30, 0.07)",
      }}
    >
      <div className="text-center sm:text-left">
        <p className="text-[15px] font-medium">Start free. No credit card needed.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {TRIAL.days} days, {TRIAL.submissions} submissions to use anywhere, and {TRIAL.repos}{" "}
          codebase repository setup.
        </p>
      </div>
      <StartFreeButton className="shrink-0" />
    </section>
  );
}

function Plans() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [workTrailQty, setWorkTrailQty] = useState(0); // 0 = not added

  const workTrailTotal =
    workTrailQty > 0 ? workTrailQty * WORK_TRAIL.pricePerAssignment : 0;

  const setWorkTrail = (qty: number) =>
    setWorkTrailQty(Math.min(WORK_TRAIL.max, Math.max(0, qty)));

  const workTrailLine =
    workTrailQty > 0
      ? `+ Work Trail: ${workTrailQty} assignment${workTrailQty === 1 ? "" : "s"} · $${workTrailTotal.toLocaleString("en-US")}`
      : null;

  return (
    <section id="plans">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PlanCard
          order="order-2 lg:order-1"
          plan={STARTUP}
          billing={billing}
          workTrailLine={workTrailLine}
        />
        <PlanCard
          order="order-1 lg:order-2"
          plan={GROWTH}
          featured
          billing={billing}
          workTrailLine={workTrailLine}
        />
        <PlanCard order="order-3 lg:order-3" plan={ENTERPRISE} billing={billing} />
      </div>
      <WorkTrailControls
        billing={billing}
        setBilling={setBilling}
        qty={workTrailQty}
        setQty={setWorkTrail}
        total={workTrailTotal}
      />
    </section>
  );
}

function PlanCard({
  plan,
  featured = false,
  billing,
  workTrailLine,
  order,
}: {
  plan: typeof STARTUP | typeof GROWTH | typeof ENTERPRISE;
  featured?: boolean;
  billing: Billing;
  workTrailLine: string | null;
  order: string;
}) {
  const isEnterprise = !("monthly" in plan);
  const yearly = billing === "yearly";
  const planAny = plan as typeof STARTUP;

  return (
    <div
      className={`${order} flex flex-col rounded-2xl border bg-card p-7 ${
        featured ? "border-2" : ""
      }`}
      style={featured ? { borderColor: BRAND } : undefined}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">{plan.name}</h2>
        {featured ? (
          <span
            className="text-xs font-medium"
            style={{ color: BRAND }}
          >
            Most popular
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        {isEnterprise ? (
          <>
            <div className="text-3xl font-semibold tracking-tight">Custom</div>
            <p className="mt-1 text-sm text-muted-foreground">Tailored to your hiring volume</p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tracking-tight">
                ${yearly ? planAny.monthlyEquiv.toLocaleString("en-US") : planAny.monthly.toLocaleString("en-US")}
              </span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {yearly
                ? `$${planAny.yearlyTotal.toLocaleString("en-US")} billed annually`
                : "Billed monthly"}
            </p>
          </>
        )}
        {workTrailLine ? (
          <p className="mt-2 text-[13px]" style={{ color: BRAND }}>
            {workTrailLine}
          </p>
        ) : null}
      </div>

      <ul className="mt-6 flex flex-col gap-3 border-t border-border pt-6 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="leading-snug">
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex-1" />
      {isEnterprise ? (
        <Link
          to="/book-demo"
          className="ylp-btn-outline inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Contact us
        </Link>
      ) : (
        <StartFreeButton />
      )}
    </div>
  );
}

function WorkTrailControls({
  billing,
  setBilling,
  qty,
  setQty,
  total,
}: {
  billing: Billing;
  setBilling: (b: Billing) => void;
  qty: number;
  setQty: (n: number) => void;
  total: number;
}) {
  const added = qty > 0;
  const grandTotal = total;

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-7 lg:grid-cols-[1fr_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold">Work Trail</h2>
          <span
            className="text-xs font-medium"
            style={{ color: BRAND }}
          >
            Optional add-on · ${WORK_TRAIL.pricePerAssignment} per assignment
          </span>
        </div>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {WORK_TRAIL.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={added}
              onChange={(e) => setQty(e.target.checked ? 1 : 0)}
              className="ylp-checkbox h-4 w-4 rounded border-border"
            />
            Add Work Trail to my plan
          </label>

          {added ? (
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border">
                <button
                  type="button"
                  aria-label="Fewer assignments"
                  onClick={() => setQty(qty - 1)}
                  disabled={qty <= WORK_TRAIL.min}
                  className="ylp-stepper rounded-l-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>
                <span className="min-w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  type="button"
                  aria-label="More assignments"
                  onClick={() => setQty(qty + 1)}
                  disabled={qty >= WORK_TRAIL.max}
                  className="ylp-stepper rounded-r-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {WORK_TRAIL.quickPicks.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQty(n)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      qty === n
                        ? "border-transparent text-white"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    style={qty === n ? { backgroundColor: BRAND } : undefined}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {added ? (
          <p className="mt-4 text-sm">
            Live total:{" "}
            <span className="font-medium">
              {qty} assignment{qty === 1 ? "" : "s"} · ${grandTotal.toLocaleString("en-US")}
            </span>
          </p>
        ) : null}

        <p className="mt-4 text-sm text-muted-foreground">
          Need more than {WORK_TRAIL.max}?{" "}
          <Link to="/book-demo" className="underline underline-offset-2 hover:text-foreground">
            Contact us
          </Link>
          .
        </p>
      </div>

      <div className="border-t border-border pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Price list
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {WORK_TRAIL.priceList.map((row) => (
            <li key={row.qty} className="flex items-center justify-between gap-8">
              <span className="text-muted-foreground">{row.qty} assignment{row.qty === 1 ? "" : "s"}</span>
              <span className="font-medium">${row.total.toLocaleString("en-US")}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HowSubmissionsWork() {
  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold tracking-tight">How submissions work</h2>
      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-7">
          <h3 className="text-[15px] font-medium">One shared pool</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Coding assessments, simulation labs and AI mock interviews all draw from the same
            submission pool. Use them in any mix that suits your hiring round — the pool resets
            every billing month, including on yearly plans.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-7">
          <h3 className="text-[15px] font-medium">Repository setups are separate</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Connecting a codebase for evaluation never uses a submission. Repository setups are
            configured once per codebase and stay available for reuse across assessments.
          </p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold tracking-tight">Frequently asked questions</h2>
      <div className="mt-5 flex flex-col">
        {FAQS.map((item, i) => (
          <details
            key={item.q}
            className="group border-b border-border py-4 last:border-b-0"
            open={i === 0}
          >
            <summary className="cursor-pointer list-none text-[15px] font-medium marker:hidden">
              {item.q}
            </summary>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function ClosingBanner() {
  return (
    <section
      className="mt-16 flex flex-col items-center justify-between gap-4 rounded-2xl border px-6 py-5 sm:flex-row"
      style={{
        borderColor: "rgba(247, 147, 30, 0.35)",
        backgroundColor: "rgba(247, 147, 30, 0.07)",
      }}
    >
      <p className="text-[15px] font-medium">Try Yuvro free for {TRIAL.days} days</p>
      <StartFreeButton className="shrink-0" />
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-8">
      <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} Yuvro Labs. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <Link to="/yuvrolabs" className="hover:text-foreground">
            Home
          </Link>
          <Link to="/book-demo" className="hover:text-foreground">
            Book a demo
          </Link>
          <a href="mailto:contact@yuvrolabs.com" className="hover:text-foreground">
            contact@yuvrolabs.com
          </a>
        </div>
      </div>
    </footer>
  );
}

const YLP_CSS = `
.ylp { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
.ylp-btn-primary { background-color: ${BRAND}; }
.ylp-btn-outline:hover { background-color: hsl(var(--muted)); }
.ylp details summary::-webkit-details-marker { display: none; }
.ylp-checkbox { accent-color: ${BRAND}; }
`;

export default YuvrolabsPricing;
