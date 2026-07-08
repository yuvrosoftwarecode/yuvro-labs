import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Engineering Evaluation — Yuvro Labs" },
      { name: "description", content: "Begin your Yuvro Labs engineering evaluation. A calm, focused workspace built for software engineers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EvaluationInvite,
});

function EvaluationInvite() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && phone.replace(/\D/g, "").length >= 7 && !!file;

  const onFiles = (list: FileList | null) => {
    const f = list?.[0];
    if (!f) return;
    const ok = /\.(pdf|docx?|rtf)$/i.test(f.name);
    if (!ok) { setErr("Resume must be a PDF, DOC, DOCX or RTF file."); return; }
    if (f.size > 8 * 1024 * 1024) { setErr("Resume must be under 8 MB."); return; }
    setErr(null);
    setFile(f);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) { setErr("Please complete every field to continue."); return; }
    // Placeholder — next step is OTP verification.
    nav({ to: "/auth", search: { tab: "signin" } });
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      {/* Top rule */}
      <header className="border-b border-neutral-200/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <YMark />
            <span className="text-[13px] font-medium tracking-tight">Yuvro Labs</span>
          </Link>
          <div className="flex items-center gap-6 text-[12px] text-neutral-500">
            <span className="hidden sm:inline">Engineering Evaluation</span>
            <span className="hidden sm:inline text-neutral-300">·</span>
            <a href="mailto:support@yuvrolabs.com" className="hover:text-neutral-900 transition">Need help?</a>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        {/* Left — narrative */}
        <section className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium tracking-wide text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Invitation verified
          </div>

          <h1 className="mt-8 font-serif text-[44px] leading-[1.05] tracking-tight text-neutral-900 sm:text-[52px]">
            A quieter place<br />to be evaluated<br />
            <span className="text-neutral-400">as an engineer.</span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-neutral-600">
            Yuvro Labs is not an assessment portal. It is a workspace — labs, a terminal,
            a database, and a short engineering discussion. Bring the way you actually work.
          </p>

          <ol className="mt-12 space-y-5 text-[13px] text-neutral-600">
            {[
              ["01", "Verification", "Confirm your email with a one-time code."],
              ["02", "System check", "We quietly test your connection, camera and microphone."],
              ["03", "Evaluation", "Engineering labs, knowledge, an optional challenge."],
              ["04", "Engineering discussion", "A short conversation about the work you just did."],
            ].map(([n, t, d]) => (
              <li key={n} className="grid grid-cols-[44px_1fr] items-baseline gap-4 border-t border-neutral-200 pt-5 first:border-t-0 first:pt-0">
                <span className="font-mono text-[11px] tracking-widest text-neutral-400">{n}</span>
                <span>
                  <span className="text-neutral-900">{t}.</span>{" "}
                  <span className="text-neutral-500">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Right — form card */}
        <section className="lg:pl-6">
          <form
            onSubmit={submit}
            className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_1px_0_rgba(0,0,0,0.02),0_20px_60px_-30px_rgba(0,0,0,0.15)] sm:p-10"
          >
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">Begin evaluation</div>
              <h2 className="mt-2 font-serif text-[26px] leading-tight tracking-tight text-neutral-900">Tell us who's evaluating.</h2>
            </div>

            <div className="mt-8 space-y-6">
              <Field label="Email address" hint="We'll send a one-time verification code.">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-0 transition-colors"
                />
              </Field>

              <Field label="Phone number" hint="For account recovery only.">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-0 transition-colors"
                />
              </Field>

              <Field label="Resume" hint="PDF, DOC, DOCX or RTF · up to 8 MB · required">
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files); }}
                  className={`mt-1 flex cursor-pointer items-center justify-between rounded-lg border border-dashed px-4 py-4 text-[13px] transition ${
                    dragOver
                      ? "border-neutral-900 bg-neutral-50"
                      : file
                        ? "border-neutral-300 bg-neutral-50/60"
                        : "border-neutral-300 hover:border-neutral-500 hover:bg-neutral-50/60"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <DocIcon />
                    <span className="min-w-0">
                      {file ? (
                        <>
                          <span className="block truncate text-neutral-900">{file.name}</span>
                          <span className="mt-0.5 block text-[11px] text-neutral-500">{(file.size / 1024).toFixed(0)} KB · click to replace</span>
                        </>
                      ) : (
                        <>
                          <span className="block text-neutral-900">Drop your resume or <span className="underline underline-offset-4 decoration-neutral-300">browse</span></span>
                          <span className="mt-0.5 block text-[11px] text-neutral-500">A short technical résumé works best.</span>
                        </>
                      )}
                    </span>
                  </span>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.rtf"
                    className="sr-only"
                    onChange={(e) => onFiles(e.target.files)}
                  />
                </label>
              </Field>
            </div>

            {err && (
              <div className="mt-6 border-l-2 border-neutral-900 pl-3 text-[12px] text-neutral-700">{err}</div>
            )}

            <button
              type="submit"
              disabled={!valid}
              className="mt-10 group inline-flex w-full items-center justify-between rounded-lg bg-neutral-900 px-5 py-3.5 text-[14px] font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
            >
              <span>Take engineering evaluation</span>
              <ArrowRight />
            </button>

            <p className="mt-6 text-[11px] leading-relaxed text-neutral-500">
              By continuing, you agree to a brief system and proctoring check. We only collect
              what's needed to conduct the evaluation. Nothing more.
            </p>
          </form>

          <div className="mt-6 flex items-center justify-between px-1 text-[11px] text-neutral-500">
            <span>Est. 60 minutes · works best on Chrome, Safari or Edge</span>
            <Link to="/auth" search={{ tab: "signin" }} className="hover:text-neutral-900 transition">Recruiter sign in →</Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 text-[11px] text-neutral-500">
          <span>© 2026 Yuvro Labs</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-900 transition">Privacy</a>
            <a href="#" className="hover:text-neutral-900 transition">Terms</a>
            <a href="#" className="hover:text-neutral-900 transition">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[12px] font-medium text-neutral-900">{label}</label>
        {hint && <span className="text-[11px] text-neutral-400">{hint}</span>}
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function YMark() {
  return (
    <div className="grid h-7 w-7 place-items-center rounded-md bg-neutral-900 text-[11px] font-mono text-white">Y</div>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-neutral-500">
      <path d="M5 2.5h6l4 4V16a1.5 1.5 0 0 1-1.5 1.5h-8.5A1.5 1.5 0 0 1 3.5 16V4A1.5 1.5 0 0 1 5 2.5Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M11 2.5V6a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
