import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { EvalShell, EvalStepHeader, PrimaryButton } from "@/components/evaluation/EvalShell";

export const Route = createFileRoute("/evaluation/otp")({
  head: () => ({ meta: [{ title: "Verify — Yuvro Labs" }, { name: "robots", content: "noindex" }] }),
  component: OtpPage,
});

function OtpPage() {
  const nav = useNavigate();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [err, setErr] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const email = (() => { try { return JSON.parse(localStorage.getItem("yuvro-eval-candidate") ?? "{}").email; } catch { return ""; } })();

  useEffect(() => {
    refs.current[0]?.focus();
    const t = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const setAt = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(0, 1);
    const next = [...digits]; next[i] = clean; setDigits(next);
    if (clean && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = [...digits];
    for (let i = 0; i < 6; i++) next[i] = text[i] ?? "";
    setDigits(next);
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) { setErr("Enter the 6-digit code."); return; }
    // Any 6-digit code works in demo; the shown code is 424242.
    if (code !== "424242") { setErr("That code doesn't match. The demo code is 424242."); return; }
    nav({ to: "/evaluation/system-check" });
  };

  return (
    <EvalShell step={2} totalSteps={5} stepLabel="Verification">
      <div className="mx-auto max-w-lg">
        <EvalStepHeader
          eyebrow="Step 02"
          title={<>Verify it's you.</>}
          body={`We sent a six-digit code to ${email || "your email"}. Enter it below to continue.`}
        />
        <form onSubmit={submit} className="mt-12">
          <div onPaste={onPaste} className="flex items-center justify-between gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                inputMode="numeric"
                autoComplete="one-time-code"
                value={d}
                onChange={(e) => setAt(i, e.target.value)}
                onKeyDown={(e) => onKey(i, e)}
                className="h-14 w-12 rounded-lg border border-neutral-300 bg-white text-center font-serif text-[24px] text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[12px] text-neutral-500">
            <span>Demo code: <span className="font-mono text-neutral-900">424242</span></span>
            <button type="button" disabled={cooldown > 0} onClick={() => setCooldown(30)} className="text-neutral-500 disabled:text-neutral-300 enabled:hover:text-neutral-900">
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </div>
          {err && <div className="mt-6 border-l-2 border-neutral-900 pl-3 text-[12px] text-neutral-700">{err}</div>}
          <PrimaryButton className="mt-10">Verify and continue</PrimaryButton>
        </form>
      </div>
    </EvalShell>
  );
}
