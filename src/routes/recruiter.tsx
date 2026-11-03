import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/recruiter")({
  head: () => ({ meta: [{ title: "Recruiter — Yuvro Labs" }, { name: "robots", content: "noindex" }] }),
  component: RecruiterLayout,
});

function RecruiterLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const items = [
    { to: "/recruiter/dashboard", label: "Dashboard", exact: true },
    { to: "/recruiter/evaluations", label: "Evaluations" },
    { to: "/recruiter/questions", label: "Question bank" },
    { to: "/recruiter/reports", label: "Reports" },
    { to: "/recruiter/github", label: "GitHub and repositories" },
    { to: "/recruiter/settings", label: "Settings" },
  ];
  const isActive = (to: string, exact?: boolean) => exact ? pathname === to : pathname.startsWith(to);

  return (
    <div className="recruiter-theme min-h-screen">
      <div className="flex min-h-screen">
        <aside className="rec-border fixed inset-y-0 left-0 z-20 flex w-[240px] flex-col border-r bg-white">
          <Link to="/recruiter" className="rec-fg px-6 py-6 text-[16px] font-semibold">Yuvro Recruiter</Link>
          <nav className="flex-1 space-y-1 px-3">
            {items.map(it => (
              <Link key={it.to} to={it.to} className={`rec-nav ${isActive(it.to, it.exact) ? "rec-nav-active" : ""}`}>{it.label}</Link>
            ))}
          </nav>
          <div className="rec-border border-t px-6 py-5">
            <div className="rec-accent truncate text-[15px] font-semibold">{user?.name ?? "Recruiter"}</div>
            <div className="rec-muted truncate text-[14px]">{user?.email ?? "recruiter@yuvrolabs.com"}</div>
            <button onClick={() => { logout(); nav({ to: "/auth", search: { tab: "signin" } }); }} className="rec-logout mt-3">Log out</button>
          </div>
        </aside>
        <main className="ml-[240px] flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
