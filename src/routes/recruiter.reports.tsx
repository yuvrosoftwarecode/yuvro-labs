import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/recruiter/reports")({
  head: () => ({ meta: [{ title: "Reports — Yuvro Recruiter" }, { name: "robots", content: "noindex" }] }),
  component: ReportsLayout,
});

const NAV = [
  { to: "/recruiter/reports", label: "Overview", exact: true },
  { to: "/recruiter/reports/evaluations", label: "Evaluations" },
  { to: "/recruiter/reports/candidates", label: "Candidates" },
  { to: "/recruiter/reports/performance", label: "Performance" },
  { to: "/recruiter/reports/follow-ups", label: "Follow-ups" },
  { to: "/recruiter/reports/saved", label: "Saved Reports" },
  { to: "/recruiter/reports/exports", label: "Export History" },
] as const;

function ReportsLayout() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to || pathname === `${to}/` : pathname.startsWith(to));

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 border-b border-black/5 bg-white/90 px-10 pt-8 backdrop-blur">
        <div className="text-[11px] uppercase tracking-widest text-neutral-500">Reports</div>
        <div className="mt-3 flex flex-wrap items-center gap-1 pb-3">
          {NAV.map(n => {
            const active = isActive(n.to, (n as { exact?: boolean }).exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-full px-3 py-1.5 text-[12px] transition ${active ? "bg-neutral-900 text-white" : "border border-black/10 text-neutral-600 hover:border-black/20 hover:text-neutral-900"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="p-10">
        <Outlet />
      </div>
    </div>
  );
}
