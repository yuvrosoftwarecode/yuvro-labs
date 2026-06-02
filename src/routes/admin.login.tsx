import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { AuthShell, Field } from "./signin";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/admin/login")({ component: AdminLogin });

function AdminLogin() {
  const { adminSignIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const r = adminSignIn(email, password);
    if (!r.ok) return setErr(r.error);
    navigate({ to: "/admin" });
  };

  return (
    <AuthShell title="Admin sign in" subtitle="Restricted area — administrators only.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Admin email" type="email" value={email} onChange={setEmail} placeholder="admin@yuvro.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {err && <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{err}</p>}
        <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
          <Shield className="h-4 w-4" /> Sign in as admin
        </button>
      </form>
      <div className="mt-5 rounded-md border border-white/10 bg-white/5 p-3 text-xs text-white/50">
        <strong className="text-white/70">Demo credentials:</strong> admin@yuvro.com / admin123
      </div>
      <p className="mt-6 text-center text-sm text-white/60">
        Not an admin? <Link to="/signin" className="text-emerald-400 hover:underline">User sign in</Link>
      </p>
    </AuthShell>
  );
}
