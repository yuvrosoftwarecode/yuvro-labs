import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { me } from "@/lib/dummy";
import { useAuth } from "@/lib/auth";
import { Github, Save, KeyRound, Check, Link as LinkIcon, Unlink } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

const PROFILE_KEY = "yuvro-profile-overrides";
const GITHUB_KEY = "yuvro-github-connected";

type Overrides = { name?: string; handle?: string; email?: string };
function readOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); } catch { return {}; }
}
function writeOverrides(o: Overrides) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(o)); } catch {}
}

function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [githubConnected, setGithubConnected] = useState(false);
  const [githubHandle, setGithubHandle] = useState("");

  useEffect(() => {
    const o = readOverrides();
    setName(o.name ?? user?.name ?? me.name);
    setHandle(o.handle ?? me.handle);
    setEmail(o.email ?? user?.email ?? "");
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(GITHUB_KEY);
      if (raw) {
        try {
          const g = JSON.parse(raw);
          setGithubConnected(!!g.connected);
          setGithubHandle(g.handle ?? "");
        } catch {}
      }
    }
  }, [user]);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    writeOverrides({ name, handle, email });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (newPwd.length < 8) { setPwdMsg({ ok: false, text: "New password must be at least 8 characters." }); return; }
    if (newPwd !== confirmPwd) { setPwdMsg({ ok: false, text: "New passwords don't match." }); return; }
    if (!currentPwd) { setPwdMsg({ ok: false, text: "Enter your current password." }); return; }
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    setPwdMsg({ ok: true, text: "Password updated." });
    setTimeout(() => setPwdMsg(null), 2200);
  };

  const connectGithub = () => {
    const h = window.prompt("Enter your GitHub username to connect", githubHandle || "");
    if (!h) return;
    setGithubConnected(true);
    setGithubHandle(h);
    try { localStorage.setItem(GITHUB_KEY, JSON.stringify({ connected: true, handle: h })); } catch {}
  };
  const disconnectGithub = () => {
    if (!confirm("Disconnect your GitHub account?")) return;
    setGithubConnected(false);
    setGithubHandle("");
    try { localStorage.removeItem(GITHUB_KEY); } catch {}
  };

  const initial = (name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[900px] px-4 py-8 space-y-6">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/15 via-card to-background p-6 flex items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground text-2xl font-semibold">{initial}</div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold truncate">{name}</h1>
            <div className="text-sm text-muted-foreground truncate">{email || handle} · Level {me.level}</div>
          </div>
        </div>

        {/* Account details */}
        <section className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Account details</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Update your public profile information.</p>
            </div>
            {savedFlash && (
              <span className="inline-flex items-center gap-1 text-xs text-success"><Check className="h-3.5 w-3.5" /> Saved</span>
            )}
          </div>
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input value={name} onChange={e => setName(e.target.value)} className="input" />
            </Field>
            <Field label="Handle">
              <input value={handle} onChange={e => setHandle(e.target.value)} className="input" />
            </Field>
            <Field label="Email" className="sm:col-span-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" />
            </Field>
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
                <Save className="h-3.5 w-3.5" /> Save changes
              </button>
            </div>
          </form>
        </section>

        {/* Password */}
        <section className="rounded-xl border bg-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Update password</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Use a strong password you don't reuse elsewhere.</p>
          </div>
          <form onSubmit={updatePassword} className="grid gap-4 sm:grid-cols-2">
            <Field label="Current password" className="sm:col-span-2">
              <input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} className="input" autoComplete="current-password" />
            </Field>
            <Field label="New password">
              <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="input" autoComplete="new-password" />
            </Field>
            <Field label="Confirm new password">
              <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} className="input" autoComplete="new-password" />
            </Field>
            <div className="sm:col-span-2 flex items-center justify-between gap-3">
              {pwdMsg ? (
                <span className={`text-xs ${pwdMsg.ok ? "text-success" : "text-destructive"}`}>{pwdMsg.text}</span>
              ) : <span />}
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
                <KeyRound className="h-3.5 w-3.5" /> Update password
              </button>
            </div>
          </form>
        </section>

        {/* Connected accounts */}
        <section className="rounded-xl border bg-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Connected accounts</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Link external services to power lab integrations.</p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 p-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-accent">
                <Github className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium">GitHub</div>
                <div className="text-xs text-muted-foreground truncate">
                  {githubConnected ? `Connected as @${githubHandle}` : "Not connected"}
                </div>
              </div>
            </div>
            {githubConnected ? (
              <button onClick={disconnectGithub}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
                <Unlink className="h-3.5 w-3.5" /> Disconnect
              </button>
            ) : (
              <button onClick={connectGithub}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
                <LinkIcon className="h-3.5 w-3.5" /> Connect
              </button>
            )}
          </div>
        </section>
      </main>

      <style>{`.input{width:100%;background:transparent;border:1px solid hsl(var(--border));border-radius:.5rem;padding:.5rem .625rem;font-size:.8125rem;outline:none}.input:focus{border-color:hsl(var(--primary))}`}</style>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}
