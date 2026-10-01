import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useAuth, DEMO_ACCOUNTS, Role } from "@/lib/auth";
import { ArrowRight, Github, Eye, EyeOff } from "lucide-react";
import YuvroLogo from "@/assets/YuvroLogo.png";

const searchSchema = z.object({ tab: z.enum(["signin", "signup"]).default("signin").catch("signin") });

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  component: AuthPage,
});

function AuthPage() {
  const { tab } = Route.useSearch();
  const nav = useNavigate();
  const setTab = (t: "signin" | "signup") => nav({ to: "/auth", search: { tab: t } });
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        background:
          "radial-gradient(900px 480px at 15% -10%, rgba(43,92,230,0.16), transparent 60%), radial-gradient(700px 420px at 90% 110%, rgba(43,92,230,0.10), transparent 60%), #0B0B0D",
        color: "#EDEDF0",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo + wordmark */}
        <div className="flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={YuvroLogo} alt="Yuvro" className="h-10 w-auto" />
            <span className="text-[22px] font-semibold tracking-tight text-white">Yuvro</span>
          </Link>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-2xl border p-7" style={{ background: "#141416", borderColor: "rgba(255,255,255,0.08)" }}>
          <h2 className="text-[20px] font-semibold tracking-tight text-white">
            {tab === "signin" ? "Sign in to Yuvro" : "Create your account"}
          </h2>
          {tab === "signin" ? <SignInForm /> : <SignUpForm />}

          {/* Divider + social */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[11px]" style={{ background: "#141416", color: "#71717A" }}>
                or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.14)" }}
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.14)" }}
            >
              <Github className="h-4 w-4" /> GitHub
            </button>
          </div>
        </div>

        {/* Below the card */}
        {tab === "signin" ? (
          <p className="mt-6 text-center text-sm" style={{ color: "#A1A1AA" }}>
            Don't have an account?{" "}
            <button onClick={() => setTab("signup")} className="font-medium text-white hover:underline">
              Create an account
            </button>
          </p>
        ) : (
          <p className="mt-6 text-center text-sm" style={{ color: "#A1A1AA" }}>
            Already have an account?{" "}
            <button onClick={() => setTab("signin")} className="font-medium text-white hover:underline">
              Sign in
            </button>
          </p>
        )}
        <p className="mt-4 text-center text-xs">
          <Link to="/" className="hover:underline" style={{ color: "#71717A" }}>
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

function SignInForm() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const acc = DEMO_ACCOUNTS[email.toLowerCase().trim()];
    if (!acc || acc.password !== password) {
      setErr("Invalid email or password.");
      return;
    }
    login(acc.user);
    nav({ to: acc.user.role === "admin" ? "/admin" : acc.user.role === "recruiter" ? "/recruiter" : "/dashboard" });
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <Field label="Email Address">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yuvrolabs.com"
          className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition"
          style={{ background: "#1A1A1E", borderColor: "rgba(255,255,255,0.10)", color: "#EDEDF0" }}
        />
      </Field>
      <Field label="Password">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm outline-none transition"
            style={{ background: "#1A1A1E", borderColor: "rgba(255,255,255,0.10)", color: "#EDEDF0" }}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label="Toggle password visibility"
            className="absolute right-2.5 top-1/2 -translate-y-1/2"
            style={{ color: "#71717A" }}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>
      <div className="flex items-center justify-between text-xs">
        <label className="flex cursor-pointer items-center gap-2" style={{ color: "#A1A1AA" }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-3.5 w-3.5 rounded"
          />{" "}
          Remember me
        </label>
        <a href="#" className="font-medium hover:underline" style={{ color: "#7CA2FF" }}>
          Forgot password?
        </a>
      </div>
      {err && (
        <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(239,68,68,0.12)", color: "#F87171" }}>
          {err}
        </div>
      )}
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
        style={{ background: "#2B5CE6", boxShadow: "0 10px 30px -12px rgba(43,92,230,0.6)" }}
      >
        Sign In <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function SignUpForm() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (pwd.length < 6) return setErr("Password must be at least 6 characters.");
    if (pwd !== confirm) return setErr("Passwords do not match.");
    if (!agree) return setErr("Please accept the terms and privacy policy.");
    login({ email: email.trim(), name: name.trim(), role });
    nav({ to: role === "admin" ? "/admin" : "/dashboard" });
  };

  const chip = (active: boolean) => ({
    background: active ? "rgba(43,92,230,0.18)" : "#1A1A1E",
    borderColor: active ? "rgba(43,92,230,0.6)" : "rgba(255,255,255,0.10)",
    color: active ? "#8FAFFF" : "#A1A1AA",
  });

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <Field label="Full Name">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition"
          style={{ background: "#1A1A1E", borderColor: "rgba(255,255,255,0.10)", color: "#EDEDF0" }}
          placeholder="Ada Lovelace"
        />
      </Field>
      <Field label="Email Address">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition"
          style={{ background: "#1A1A1E", borderColor: "rgba(255,255,255,0.10)", color: "#EDEDF0" }}
          placeholder="you@example.com"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Password">
          <input
            type="password"
            required
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition"
            style={{ background: "#1A1A1E", borderColor: "rgba(255,255,255,0.10)", color: "#EDEDF0" }}
            placeholder="••••••••"
          />
        </Field>
        <Field label="Confirm Password">
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition"
            style={{ background: "#1A1A1E", borderColor: "rgba(255,255,255,0.10)", color: "#EDEDF0" }}
            placeholder="••••••••"
          />
        </Field>
      </div>
      <Field label="Role">
        <div className="grid grid-cols-2 gap-2">
          {(["student", "job_seeker", "recruiter"] as Role[]).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              style={chip(role === r)}
              className="rounded-lg border px-3 py-2 text-xs capitalize transition"
            >
              {r.replace("_", " ")}
            </button>
          ))}
        </div>
      </Field>
      <label className="flex cursor-pointer items-start gap-2 text-xs" style={{ color: "#A1A1AA" }}>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 rounded" />
        <span>
          I agree to the{" "}
          <a href="#" className="hover:underline" style={{ color: "#7CA2FF" }}>
            terms
          </a>{" "}
          and{" "}
          <a href="#" className="hover:underline" style={{ color: "#7CA2FF" }}>
            privacy policy
          </a>
          .
        </span>
      </label>
      {err && (
        <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(239,68,68,0.12)", color: "#F87171" }}>
          {err}
        </div>
      )}
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
        style={{ background: "#2B5CE6", boxShadow: "0 10px 30px -12px rgba(43,92,230,0.6)" }}
      >
        Create Account <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium" style={{ color: "#A1A1AA" }}>
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.83z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
