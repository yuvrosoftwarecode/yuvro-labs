import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { User, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { me } from "@/lib/dummy";
import { useAuth } from "@/lib/auth";
import { useEffect, useRef, useState } from "react";

import YuvroLogo from "@/assets/YuvroLogo.png";

const headerStats = [
  { label: "Streak", value: "1" },
  { label: "Points", value: "1000 XP" },
  { label: "AI Credits", value: "35,371" },
];


const primaryLinks = [
  { to: "/dashboard", label: "Simulation Labs" },
  { to: "/mock-interviews", label: "Mock Interviews" },
];

export function TopNav({ rightSlot, activeOverride }: { rightSlot?: React.ReactNode; activeOverride?: string } = {}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const activePath = activeOverride ?? path;
  const isActive = (to: string) => to === "/dashboard" ? activePath === "/dashboard" : activePath.startsWith(to);
  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-6 px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
          <img src={YuvroLogo} alt="Yuvro" className="h-7 w-auto" />
          <span>Yuvro</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {primaryLinks.map((l) => {
            const active = isActive(l.to);
            return (
              <Link key={l.to} to={l.to}
                className={`relative py-1.5 transition-colors after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:transition-opacity ${active ? "text-foreground font-medium after:bg-[#f7931e] after:opacity-100" : "text-muted-foreground hover:text-foreground after:bg-[#f7931e] after:opacity-0"}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          {rightSlot}
          <button onClick={toggle} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="grid h-8 w-8 place-items-center rounded-md border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="hidden md:flex items-center gap-5 text-xs" role="group" aria-label="Your stats">
            {headerStats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-semibold text-foreground tabular-nums">{s.value}</span>
              </div>
            ))}
            <AiCreditsPopover />
          </div>
          <ProfileMenu onLogout={() => { logout(); nav({ to: "/" }); }} userName={user?.name ?? me.name} userEmail={user?.email} />
        </div>
      </div>
    </header>
  );
}

function ProfileMenu({ onLogout, userName, userEmail }: { onLogout: () => void; userName: string; userEmail?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  const initial = (userName || "?").trim().charAt(0).toUpperCase();
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90">
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-md border border-border bg-popover shadow-lg p-1 z-50">
          <div className="px-2.5 py-2 border-b border-border/60">
            <div className="text-sm font-medium truncate">{userName}</div>
            {userEmail && <div className="text-[11px] text-muted-foreground truncate">{userEmail}</div>}
          </div>
          <Link to="/profile" onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60">
            <User className="h-3.5 w-3.5" /> Profile
          </Link>
          <button onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
