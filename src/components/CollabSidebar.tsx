import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users2, Compass, Inbox, UserPlus, GitMerge,
  AlertOctagon, Mail, Trophy, Shield, Plus, Search, Radio,
  Bell, BarChart3, Briefcase, BookOpen, GraduationCap
} from "lucide-react";

const groups = [
  {
    label: "Workspace",
    items: [
      { to: "/collaboration", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/collaboration/squads", label: "My Squads", icon: Users2 },
      { to: "/collaboration/discover", label: "Discover Squads", icon: Compass },
      { to: "/collaboration/requests", label: "Open Requests", icon: Inbox },
      { to: "/collaboration/analytics", label: "Squad Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "People",
    items: [
      { to: "/collaboration/marketplace", label: "Available Engineers", icon: UserPlus },
      { to: "/collaboration/pair", label: "Pair Programming", icon: GitMerge },
      { to: "/collaboration/invitations", label: "Invitations", icon: Mail },
      { to: "/collaboration/mentorship", label: "Mentorship", icon: GraduationCap },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/collaboration/incidents", label: "Incident Rooms", icon: AlertOctagon },
      { to: "/collaboration/live", label: "Live Presence", icon: Radio },
      { to: "/collaboration/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Reputation",
    items: [
      { to: "/collaboration/rankings", label: "Team Rankings", icon: Trophy },
      { to: "/collaboration/reputation", label: "My Reputation", icon: Shield },
      { to: "/collaboration/recruiter", label: "Recruiter Portal", icon: Briefcase },
    ],
  },
  {
    label: "Resources",
    items: [
      { to: "/collaboration/handbook", label: "Handbook", icon: BookOpen },
    ],
  },
];

export function CollabSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="w-60 shrink-0 border-r bg-card/40 min-h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="p-3 border-b space-y-2">
        <Link to="/collaboration/create" className="flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> Create Squad
        </Link>
        <Link to="/collaboration/marketplace" className="flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm hover:bg-accent">
          <Search className="h-3.5 w-3.5" /> Find Teammates
        </Link>
      </div>
      <nav className="p-2 space-y-4">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="px-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{g.label}</div>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = it.exact ? path === it.to : path.startsWith(it.to);
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <Link to={it.to}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${active ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"}`}>
                      <Icon className="h-3.5 w-3.5" /> {it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
