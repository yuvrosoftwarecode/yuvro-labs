import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Users, FlaskConical, Ticket, Network, BarChart3, Briefcase, Settings,
  TrendingUp, Activity, AlertCircle, CheckCircle2, LogOut, Bell, Search, Bot
} from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminDashboard });

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin", label: "Users", icon: Users },
  { to: "/admin", label: "Labs", icon: FlaskConical },
  { to: "/admin", label: "Tickets", icon: Ticket },
  { to: "/admin", label: "Collaboration Hub", icon: Network },
  { to: "/admin", label: "Reports", icon: BarChart3 },
  { to: "/admin", label: "Recruiters", icon: Briefcase },
  { to: "/admin", label: "Settings", icon: Settings },
];

function AdminDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (user && user.role !== "admin") nav({ to: "/dashboard" });
  }, [user, nav]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-card/30 backdrop-blur">
        <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-ui text-primary-foreground font-mono text-xs">Y</div>
          <div>
            <div className="text-sm font-semibold leading-tight">Yuvro Labs</div>
            <div className="text-[10px] text-muted-foreground">Admin Console</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 text-sm">
          {navItems.map((n, i) => (
            <button key={i} className={`w-full flex items-center gap-2.5 rounded-md px-3 py-2 transition ${i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
              <n.icon className="h-4 w-4" /> {n.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={() => { logout(); nav({ to: "/" }); }} className="w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-background/60 backdrop-blur sticky top-0 z-30 flex items-center gap-4 px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span><span>/</span><span className="text-foreground font-medium">Dashboard</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-1.5 text-xs text-muted-foreground w-72">
              <Search className="h-3.5 w-3.5" /> Search users, labs, tickets…
            </div>
            <button className="relative grid h-8 w-8 place-items-center rounded-md border hover:bg-accent text-muted-foreground"><Bell className="h-4 w-4" /><span className="absolute -top-1 -right-1 h-4 w-4 grid place-items-center rounded-full bg-destructive text-[9px] text-destructive-foreground font-bold">3</span></button>
            <div className="flex items-center gap-2 text-sm">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-ui text-primary-foreground text-xs font-semibold">{user?.name?.[0] ?? "A"}</div>
              <div className="hidden sm:block">
                <div className="text-xs font-medium leading-tight">{user?.name ?? "Admin"}</div>
                <div className="text-[10px] text-muted-foreground">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Platform overview</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back. Here's what's happening across Yuvro Labs today.</p>
            </div>
            <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground">→ Switch to engineer view</Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: "Active Users", v: "14,892", d: "+12.4%", c: "primary", i: Users },
              { l: "Tickets Solved (24h)", v: "1,284", d: "+8.1%", c: "success", i: CheckCircle2 },
              { l: "Open Incidents", v: "3", d: "-2", c: "warning", i: AlertCircle },
              { l: "AI Reviews (24h)", v: "5,612", d: "+18.7%", c: "ui", i: Bot },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border/60 bg-card/40 backdrop-blur p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.l}</span>
                  <s.i className="h-4 w-4" style={{ color: `var(--${s.c})` }} />
                </div>
                <div className="mt-2 text-2xl font-semibold">{s.v}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-xs" style={{ color: `var(--${s.c})` }}><TrendingUp className="h-3 w-3" />{s.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl border border-border/60 bg-card/40 backdrop-blur p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Platform activity</h3>
                <select className="text-xs bg-transparent border border-border rounded-md px-2 py-1"><option>Last 7 days</option><option>Last 30 days</option></select>
              </div>
              <div className="h-56 flex items-end gap-1.5">
                {[40, 65, 50, 80, 60, 95, 72, 88, 70, 92, 78, 100, 85, 96].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary/60 to-ui/60 hover:from-primary hover:to-ui transition" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur p-5">
              <h3 className="font-semibold mb-4">Top labs</h3>
              <div className="space-y-3">
                {[
                  { l: "Java Backend", v: 4280, c: "primary" },
                  { l: "Frontend", v: 3920, c: "ui" },
                  { l: "SQL", v: 3110, c: "warning" },
                  { l: "DevOps", v: 2540, c: "success" },
                  { l: "Security", v: 1880, c: "destructive" },
                ].map((x) => (
                  <div key={x.l}>
                    <div className="flex items-center justify-between text-xs mb-1"><span>{x.l}</span><span className="text-muted-foreground">{x.v}</span></div>
                    <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(x.v / 4280) * 100}%`, background: `var(--${x.c})` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur p-5">
              <h3 className="font-semibold mb-4">Recent users</h3>
              <div className="space-y-2.5">
                {[
                  { n: "Priya Sharma", r: "Student", a: "2m ago" },
                  { n: "Marcus Kim", r: "Job Seeker", a: "8m ago" },
                  { n: "Sana Ahmed", r: "Developer", a: "21m ago" },
                  { n: "Lina Park", r: "Recruiter", a: "1h ago" },
                ].map((u, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/20 text-primary text-xs font-semibold">{u.n[0]}</div>
                    <div className="flex-1 min-w-0"><div className="truncate">{u.n}</div><div className="text-[10px] text-muted-foreground">{u.r}</div></div>
                    <span className="text-xs text-muted-foreground">{u.a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur p-5">
              <h3 className="font-semibold mb-4">System status</h3>
              <div className="space-y-2.5 text-sm">
                {[
                  { l: "API gateway", s: "operational", c: "success" },
                  { l: "Code execution sandbox", s: "operational", c: "success" },
                  { l: "AI Mentor service", s: "operational", c: "success" },
                  { l: "Realtime collaboration", s: "degraded", c: "warning" },
                ].map((x) => (
                  <div key={x.l} className="flex items-center justify-between">
                    <span>{x.l}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: `var(--${x.c})` }}><Activity className="h-3 w-3" />{x.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
