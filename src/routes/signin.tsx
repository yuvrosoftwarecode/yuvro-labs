import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/signin")({ component: SignIn });

function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const r = signIn(email, password);
    if (!r.ok) return setErr(r.error);
    navigate({ to: "/hub" });
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to continue your engineering journey.">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
      {err && <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{err}</p>}
      <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
        Sign In <ArrowRight className="h-4 w-4" />
      </button>
    </form>
    <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-3 text-xs text-white/50">
      <strong className="text-white/70">Demo credentials:</strong> alex@example.com / password
    </div>
    <p className="mt-4 text-center text-sm text-white/60">
      New here? <Link to="/signup" className="text-emerald-400 hover:underline">Create an account</Link>
    </p>
    <p className="mt-2 text-center text-xs text-white/40">
      <Link to="/admin/login" className="hover:text-white/70">Admin login →</Link>
    </p>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#5B21B6] opacity-60" />
      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-emerald-500 to-violet-600 font-mono text-sm">Y</div>
            <span>Yuvro Labs</span>
          </Link>
          <div className="rounded-2xl border border-white/10 bg-[#0B1020]/80 p-8 shadow-2xl backdrop-blur">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-white/60">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm text-white/70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-400/50 focus:bg-white/10"
        required
      />
    </label>
  );
}
