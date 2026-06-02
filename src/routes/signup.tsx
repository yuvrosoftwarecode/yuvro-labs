import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { AuthShell, Field } from "./signin";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/signup")({ component: SignUp });

function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const r = signUp(name, email, password);
    if (!r.ok) return setErr(r.error);
    navigate({ to: "/hub" });
  };

  return (
    <AuthShell title="Create your account" subtitle="Start shipping real engineering work in minutes.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name" type="text" value={name} onChange={setName} placeholder="Alex Chen" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
        {err && <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{err}</p>}
        <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
          Create account <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/60">
        Already have an account? <Link to="/signin" className="text-emerald-400 hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
