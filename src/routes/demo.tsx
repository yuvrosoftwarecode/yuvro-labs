import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Video,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Book a Demo — Yuvro Labs" },
      {
        name: "description",
        content:
          "Schedule a personalized demo of Yuvro Labs. See Engineering Labs, Vitarka AI interviews, and evidence-based hiring reports in action.",
      },
      { property: "og:title", content: "Book a Demo — Yuvro Labs" },
      {
        property: "og:description",
        content:
          "Schedule a personalized demo of Yuvro Labs. See Engineering Labs, Vitarka AI interviews, and evidence-based hiring reports in action.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DemoPage,
});

const BG = "#FAFAF8";
const INK = "#0A0A0A";
const BORDER = "#E8E6E1";
const MUTED = "#6B6B6B";
const FAINT = "#8A867E";
const AMBER = "#F5A623";

const INTERESTS = [
  { id: "pay-for-hire", label: "Pay for Hire", desc: "Fully managed hiring — you pay only when you hire." },
  { id: "engineering-labs", label: "Engineering Labs", desc: "Real engineering simulations in live environments." },
  { id: "vitarka-ai", label: "Vitarka AI", desc: "AI-led technical interviews that probe reasoning." },
  { id: "assessments", label: "Assessments", desc: "Role-calibrated screening assessments at scale." },
  { id: "follow-ups", label: "Automated Follow-ups", desc: "Structured candidate follow-ups, handled for you." },
];

const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const SLOT_MINUTES = [9 * 60 + 30, 10 * 60, 10 * 60 + 30, 11 * 60, 11 * 60 + 30, 12 * 60, 13 * 60, 13 * 60 + 30, 14 * 60, 14 * 60 + 30, 15 * 60, 15 * 60 + 30, 16 * 60, 16 * 60 + 30, 17 * 60, 17 * 60 + 30];

/* ---------- helpers ---------- */
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function fmtTime(mins: number) {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${pad(m)} ${ampm}`;
}
function fmtDateLong(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function tzAbbr(tz: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
  } catch {
    return tz;
  }
}
function zonedToUtc(date: string, mins: number, tz: string): Date {
  const guess = new Date(`${date}T${pad(Math.floor(mins / 60))}:${pad(mins % 60)}:00Z`);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(guess);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second"));
  return new Date(guess.getTime() - (asUtc - guess.getTime()));
}

type Booking = {
  email: string;
  interests: string[];
  date: Date | null;
  slot: number | null;
  timezone: string;
  fullName: string;
  company: string;
  jobTitle: string;
  message: string;
};

type Step = "email" | "interest" | "schedule" | "details" | "confirmed";

/* ================================================================ */

function DemoPage() {
  const [step, setStep] = useState<Step>("email");
  const [booking, setBooking] = useState<Booking>({
    email: "",
    interests: [],
    date: null,
    slot: null,
    timezone: "Asia/Kolkata",
    fullName: "",
    company: "",
    jobTitle: "",
    message: "",
  });

  const patch = (p: Partial<Booking>) => setBooking((b) => ({ ...b, ...p }));

  return (
    <div className="min-h-screen" style={{ background: BG, color: INK }}>
      <SiteNav />
      {step === "email" && <EmailStep booking={booking} onNext={() => setStep("interest")} patch={patch} />}
      {step === "interest" && <InterestStep booking={booking} onBack={() => setStep("email")} onNext={() => setStep("schedule")} patch={patch} />}
      {step === "schedule" && <ScheduleStep booking={booking} onBack={() => setStep("interest")} onNext={() => setStep("details")} patch={patch} />}
      {step === "details" && <DetailsStep booking={booking} onBack={() => setStep("schedule")} onNext={() => setStep("confirmed")} patch={patch} />}
      {step === "confirmed" && <Confirmation booking={booking} />}
    </div>
  );
}

/* ---------- shared bits ---------- */
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className="grid h-9 w-9 place-items-center rounded-full border transition hover:bg-[#F4F3EF]"
      style={{ borderColor: BORDER, color: MUTED }}
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-[14px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      style={{ background: INK }}
    >
      {children}
    </button>
  );
}

function StepShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:py-20">{children}</div>;
}

const inputCls =
  "w-full rounded-md border bg-white px-4 py-3 text-[14px] outline-none transition placeholder:text-[#9B978C] focus:border-[#0A0A0A]";
const inputStyle = { borderColor: BORDER };

/* ================================================================
   STEP 1 — Work email
   ================================================================ */
function EmailStep({
  booking,
  patch,
  onNext,
}: {
  booking: Booking;
  patch: (p: Partial<Booking>) => void;
  onNext: () => void;
}) {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email.trim());
  return (
    <StepShell>
      <div className="mx-auto max-w-xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: FAINT }}>
          Book a demo
        </p>
        <h1 className="mt-3 text-[36px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[44px]">
          See what evidence-based hiring looks like.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: MUTED }}>
          A 30-minute walkthrough of Yuvro tailored to your hiring process — Engineering Labs, Vitarka AI interviews, and
          the reports your team actually uses.
        </p>

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) onNext();
          }}
        >
          <label className="block font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
            Work email *
          </label>
          <input
            type="email"
            autoFocus
            value={booking.email}
            onChange={(e) => patch({ email: e.target.value })}
            placeholder="you@company.com"
            className={`mt-2 ${inputCls}`}
            style={inputStyle}
          />
          <PrimaryButton disabled={!valid} onClick={onNext} className="mt-5 w-full sm:w-auto">
            Continue <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </form>

        <div className="mt-10 flex items-center gap-6 border-t pt-6 font-mono text-[11px]" style={{ borderColor: BORDER, color: FAINT }}>
          <span className="inline-flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" /> 30 minutes
          </span>
          <span className="inline-flex items-center gap-2">
            <Video className="h-3.5 w-3.5" /> Live video call
          </span>
          <span className="inline-flex items-center gap-2">
            <Check className="h-3.5 w-3.5" /> No commitment
          </span>
        </div>
      </div>
    </StepShell>
  );
}

/* ================================================================
   STEP 2 — Interests
   ================================================================ */
function InterestStep({
  booking,
  patch,
  onBack,
  onNext,
}: {
  booking: Booking;
  patch: (p: Partial<Booking>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const toggle = (id: string) =>
    patch({
      interests: booking.interests.includes(id)
        ? booking.interests.filter((i) => i !== id)
        : [...booking.interests, id],
    });

  return (
    <StepShell>
      <div className="mx-auto max-w-2xl">
        <BackButton onClick={onBack} />
        <h1 className="mt-6 text-[32px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[40px]">
          What would you like to see?
        </h1>
        <p className="mt-3 text-[15px]" style={{ color: MUTED }}>
          Select one or more — we'll tailor the demo around them.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {INTERESTS.map((opt) => {
            const active = booking.interests.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggle(opt.id)}
                className="flex items-start gap-3 rounded-lg border bg-white p-4 text-left transition hover:border-[#0A0A0A]"
                style={{ borderColor: active ? INK : BORDER, boxShadow: active ? "0 0 0 1px #0A0A0A" : undefined }}
              >
                <span
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition"
                  style={{
                    borderColor: active ? INK : BORDER,
                    background: active ? INK : "transparent",
                    color: active ? "#fff" : "transparent",
                  }}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold">{opt.label}</span>
                  <span className="mt-1 block text-[12.5px] leading-snug" style={{ color: MUTED }}>
                    {opt.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <PrimaryButton disabled={booking.interests.length === 0} onClick={onNext}>
            Continue <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </div>
      </div>
    </StepShell>
  );
}

/* ================================================================
   STEP 3 — Date, time & timezone (Calendly-style)
   ================================================================ */
function ScheduleStep({
  booking,
  patch,
  onBack,
  onNext,
}: {
  booking: Booking;
  patch: (p: Partial<Booking>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const maxView = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 3, 1), [today]);
  const viewDate = new Date(viewYear, viewMonth, 1);
  const canPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());
  const canNext = viewDate < maxView;

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startOffset = first.getDay(); // 0 = Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(viewYear, viewMonth, d));
    return out;
  }, [viewYear, viewMonth]);

  const isAvailable = (d: Date) => {
    const day = d.getDay();
    return day !== 0 && day !== 6 && d.getTime() > today.getTime();
  };

  const selectedKey = booking.date ? dateKey(booking.date) : null;

  return (
    <StepShell>
      <div className="mx-auto max-w-5xl">
        <BackButton onClick={onBack} />
        <div className="mt-6 overflow-hidden rounded-xl border bg-white" style={{ borderColor: BORDER }}>
          <div className="grid lg:grid-cols-[280px_1fr]">
            {/* left rail — meeting info */}
            <div className="border-b p-6 lg:border-b-0 lg:border-r" style={{ borderColor: BORDER }}>
              <p className="text-[13px] font-medium" style={{ color: MUTED }}>
                Yuvro Labs
              </p>
              <h1 className="mt-2 text-[24px] font-bold tracking-[-0.01em]">Product Demo</h1>
              <div className="mt-4 space-y-2.5 text-[13px]" style={{ color: MUTED }}>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> 30 min
                </p>
                <p className="flex items-center gap-2">
                  <Video className="h-4 w-4" /> Video call — link shared after booking
                </p>
                {booking.date && booking.slot !== null && (
                  <p className="flex items-center gap-2" style={{ color: INK }}>
                    <CalendarDays className="h-4 w-4" />
                    <span className="font-medium">
                      {fmtTime(booking.slot)}, {fmtDateLong(booking.date)}
                    </span>
                  </p>
                )}
              </div>
              <p className="mt-5 text-[12.5px] leading-relaxed" style={{ color: FAINT }}>
                A walkthrough of the Yuvro platform tailored to your team's hiring process.
              </p>
            </div>

            {/* calendar + slots */}
            <div className="grid md:grid-cols-[1fr_220px]">
              <div className="p-6">
                <h2 className="text-[16px] font-semibold">Select a date &amp; time</h2>

                {/* month header */}
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-[14px] font-semibold">
                    {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Previous month"
                      disabled={!canPrev}
                      onClick={() => {
                        const d = new Date(viewYear, viewMonth - 1, 1);
                        setViewYear(d.getFullYear());
                        setViewMonth(d.getMonth());
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full border transition disabled:opacity-30 hover:bg-[#F4F3EF]"
                      style={{ borderColor: BORDER }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next month"
                      disabled={!canNext}
                      onClick={() => {
                        const d = new Date(viewYear, viewMonth + 1, 1);
                        setViewYear(d.getFullYear());
                        setViewMonth(d.getMonth());
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full border transition disabled:opacity-30 hover:bg-[#F4F3EF]"
                      style={{ borderColor: BORDER }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* weekday labels */}
                <div className="mt-4 grid grid-cols-7 text-center font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: FAINT }}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* day grid */}
                <div className="grid grid-cols-7 gap-y-1">
                  {cells.map((d, i) => {
                    if (!d) return <div key={`e${i}`} />;
                    const available = isAvailable(d);
                    const selected = selectedKey === dateKey(d);
                    return (
                      <div key={dateKey(d)} className="grid place-items-center py-0.5">
                        <button
                          type="button"
                          disabled={!available}
                          onClick={() => patch({ date: d, slot: null })}
                          className="grid h-10 w-10 place-items-center rounded-full text-[13.5px] transition"
                          style={{
                            background: selected ? INK : "transparent",
                            color: selected ? "#fff" : available ? INK : "#C9C6BC",
                            fontWeight: available ? 600 : 400,
                            cursor: available ? "pointer" : "default",
                          }}
                          onMouseEnter={(e) => {
                            if (available && !selected) e.currentTarget.style.background = "#EFEDE7";
                          }}
                          onMouseLeave={(e) => {
                            if (available && !selected) e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {d.getDate()}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* timezone */}
                <div className="mt-6 border-t pt-4" style={{ borderColor: BORDER }}>
                  <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: FAINT }}>
                    <Globe className="h-3.5 w-3.5" /> Time zone
                  </label>
                  <select
                    value={booking.timezone}
                    onChange={(e) => patch({ timezone: e.target.value })}
                    className={`mt-2 ${inputCls}`}
                    style={{ ...inputStyle, paddingTop: 10, paddingBottom: 10 }}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tzAbbr(tz)} — {tz.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* time slots */}
              {booking.date && (
                <div className="border-t p-5 md:border-l md:border-t-0" style={{ borderColor: BORDER }}>
                  <p className="text-[13px] font-semibold">
                    {booking.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                  <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto pr-1">
                    {SLOT_MINUTES.map((mins) => {
                      const selected = booking.slot === mins;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => patch({ slot: mins })}
                          className="w-full rounded-md border py-2.5 text-[13px] font-semibold transition"
                          style={{
                            borderColor: selected ? INK : BORDER,
                            background: selected ? INK : "#fff",
                            color: selected ? "#fff" : INK,
                          }}
                        >
                          {fmtTime(mins)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-[12.5px]" style={{ color: FAINT }}>
            Weekdays, 9:30 AM – 6:00 PM ({tzAbbr(booking.timezone)})
          </p>
          <PrimaryButton disabled={!booking.date || booking.slot === null} onClick={onNext}>
            Continue <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </div>
      </div>
    </StepShell>
  );
}

/* ================================================================
   STEP 4 — Complete your details
   ================================================================ */
function DetailsStep({
  booking,
  patch,
  onBack,
  onNext,
}: {
  booking: Booking;
  patch: (p: Partial<Booking>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const valid =
    booking.fullName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email.trim()) &&
    booking.company.trim().length > 1;

  const selectedInterests = INTERESTS.filter((i) => booking.interests.includes(i.id));

  return (
    <StepShell>
      <div className="mx-auto max-w-5xl">
        <BackButton onClick={onBack} />
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* LEFT — form */}
          <div>
            <h1 className="text-[30px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[36px]">
              Complete Your Details
            </h1>
            <p className="mt-3 text-[15px]" style={{ color: MUTED }}>
              Tell us a little about yourself so we can prepare for the demo.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (valid) onNext();
              }}
            >
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  Full name *
                </label>
                <input
                  autoFocus
                  value={booking.fullName}
                  onChange={(e) => patch({ fullName: e.target.value })}
                  placeholder="Ananya Sharma"
                  className={`mt-2 ${inputCls}`}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  Work email *
                </label>
                <input
                  type="email"
                  value={booking.email}
                  onChange={(e) => patch({ email: e.target.value })}
                  placeholder="you@company.com"
                  className={`mt-2 ${inputCls}`}
                  style={inputStyle}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                    Company *
                  </label>
                  <input
                    value={booking.company}
                    onChange={(e) => patch({ company: e.target.value })}
                    placeholder="Acme Inc."
                    className={`mt-2 ${inputCls}`}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                    Job title
                  </label>
                  <input
                    value={booking.jobTitle}
                    onChange={(e) => patch({ jobTitle: e.target.value })}
                    placeholder="Head of Talent"
                    className={`mt-2 ${inputCls}`}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  Anything we should know?
                </label>
                <textarea
                  value={booking.message}
                  onChange={(e) => patch({ message: e.target.value })}
                  rows={3}
                  placeholder="Tell us about your hiring needs, current assessment process, or what you'd like to see in the demo."
                  className={`mt-2 resize-none ${inputCls}`}
                  style={inputStyle}
                />
              </div>

              <div className="pt-2">
                <PrimaryButton disabled={!valid} onClick={onNext} className="w-full sm:w-auto">
                  Schedule Demo <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
                <p className="mt-4 text-[11.5px]" style={{ color: FAINT }}>
                  By scheduling, you agree to Yuvro's{" "}
                  <a href="#" className="underline underline-offset-2 hover:text-[#0A0A0A]">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline underline-offset-2 hover:text-[#0A0A0A]">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT — demo summary */}
          <aside className="h-fit rounded-xl border bg-white p-6 lg:sticky lg:top-24" style={{ borderColor: BORDER }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: FAINT }}>
              Demo summary
            </p>

            {selectedInterests.length > 0 && (
              <div className="mt-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: MUTED }}>
                  Demo interest
                </p>
                <ul className="mt-2 space-y-1.5">
                  {selectedInterests.map((i) => (
                    <li key={i.id} className="flex items-center gap-2 text-[13.5px] font-medium">
                      <Check className="h-3.5 w-3.5" style={{ color: AMBER }} strokeWidth={3} />
                      {i.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 border-t pt-5" style={{ borderColor: BORDER }}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: MUTED }}>
                Demo
              </p>
              <div className="mt-2 space-y-1 text-[13.5px] font-medium">
                {booking.date && <p>{fmtDateLong(booking.date)}</p>}
                {booking.slot !== null && (
                  <p>
                    {fmtTime(booking.slot)} – {fmtTime(booking.slot + 30)}
                  </p>
                )}
                <p style={{ color: MUTED }}>
                  {booking.timezone === "Asia/Kolkata" ? "India Standard Time (IST)" : tzAbbr(booking.timezone)}
                </p>
                <p className="font-mono text-[12px]" style={{ color: FAINT }}>
                  {booking.timezone}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="mt-6 text-[12.5px] font-medium underline underline-offset-2"
              style={{ color: MUTED }}
            >
              Change date or time
            </button>
          </aside>
        </div>
      </div>
    </StepShell>
  );
}

/* ================================================================
   STEP 5 — Confirmation
   ================================================================ */
function Confirmation({ booking }: { booking: Booking }) {
  const selectedInterests = INTERESTS.filter((i) => booking.interests.includes(i.id));

  const calendarUrl = useMemo(() => {
    if (!booking.date || booking.slot === null) return "#";
    const start = zonedToUtc(dateKey(booking.date), booking.slot, booking.timezone);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const fmt = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Yuvro Labs — Product Demo",
      dates: `${fmt(start)}/${fmt(end)}`,
      details: "30-minute product demo with the Yuvro Labs team. A video call link will be shared in the calendar invite.",
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [booking]);

  const rows: [string, string][] = [
    ...(booking.date ? [["Date", fmtDateLong(booking.date)] as [string, string]] : []),
    ...(booking.slot !== null
      ? [["Time", `${fmtTime(booking.slot)} – ${fmtTime(booking.slot + 30)}`] as [string, string]]
      : []),
    ["Timezone", `${tzAbbr(booking.timezone)} (${booking.timezone})`],
    ...(selectedInterests.length
      ? [["Demo interests", selectedInterests.map((i) => i.label).join(", ")] as [string, string]]
      : []),
    ...(booking.company ? [["Company", booking.company] as [string, string]] : []),
  ];

  return (
    <StepShell>
      <div className="mx-auto max-w-xl text-center">
        <div
          className="mx-auto grid h-14 w-14 place-items-center rounded-full border"
          style={{ borderColor: BORDER, background: "#fff", color: INK }}
        >
          <Check className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <h1 className="mt-6 text-[32px] font-bold tracking-[-0.02em] sm:text-[38px]">Demo Scheduled</h1>
        <p className="mt-3 text-[15px]" style={{ color: MUTED }}>
          You're all set. We look forward to showing you Yuvro.
        </p>

        <div className="mt-8 rounded-xl border bg-white p-6 text-left" style={{ borderColor: BORDER }}>
          <dl className="divide-y" style={{ borderColor: BORDER }}>
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0" style={{ borderColor: BORDER }}>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: MUTED }}>
                  {k}
                </dt>
                <dd className="text-right text-[13.5px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-5 text-[13px]" style={{ color: MUTED }}>
          A confirmation email has been sent to{" "}
          <span className="font-semibold" style={{ color: INK }}>
            {booking.email}
          </span>
          .
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-[14px] font-semibold text-white transition hover:brightness-110"
            style={{ background: INK }}
          >
            Back to Yuvro
          </Link>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border bg-white px-6 py-3 text-[14px] font-semibold transition hover:bg-[#F4F3EF]"
            style={{ borderColor: BORDER, color: INK }}
          >
            <CalendarDays className="h-4 w-4" /> Add to Calendar
          </a>
        </div>
      </div>
    </StepShell>
  );
}
