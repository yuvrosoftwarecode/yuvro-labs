import { createFileRoute } from "@tanstack/react-router";
import { notifications } from "@/lib/collab";
import { Bell, GitPullRequest, AlertOctagon, Award, Eye, Mail, Hammer, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/collaboration/notifications")({ component: NotificationsHub });

const TYPE_META: Record<string, { icon: any; tone: string; label: string }> = {
  invite: { icon: Mail, tone: "text-primary", label: "Invitations" },
  pr: { icon: GitPullRequest, tone: "text-info", label: "Pull Requests" },
  build: { icon: Hammer, tone: "text-warning", label: "Builds" },
  incident: { icon: AlertOctagon, tone: "text-destructive", label: "Incidents" },
  badge: { icon: Award, tone: "text-success", label: "Achievements" },
  recruiter: { icon: Eye, tone: "text-primary", label: "Recruiter Activity" },
};

function NotificationsHub() {
  const [filter, setFilter] = useState<string | null>(null);
  const list = notifications.filter(n => !filter || n.type === filter);
  const counts = notifications.reduce<Record<string, number>>((a, n) => { a[n.type] = (a[n.type] ?? 0) + 1; return a; }, {});

  return (
    <div className="px-6 py-6 max-w-[1200px]">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notifications Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Every collaboration event in one place — invites, reviews, incidents, recruiter visits.</p>
        </div>
        <button className="text-xs rounded-md border px-3 py-1.5 hover:bg-accent">Mark all read</button>
      </div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <button onClick={() => setFilter(null)} className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${!filter ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>All · {notifications.length}</button>
        {Object.entries(TYPE_META).map(([key, m]) => (
          <button key={key} onClick={() => setFilter(key)} className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${filter === key ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>
            {m.label} · {counts[key] ?? 0}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-card divide-y">
        {list.map(n => {
          const m = TYPE_META[n.type] ?? TYPE_META.invite;
          const Icon = m.icon;
          return (
            <div key={n.id} className="flex items-start gap-3 p-4 hover:bg-accent/30">
              <div className={`grid h-9 w-9 place-items-center rounded-md bg-accent ${m.tone}`}><Icon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{n.text}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{m.label} · {n.time} ago</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:opacity-90">Open</button>
                <button className="text-xs rounded-md border px-3 py-1.5 hover:bg-accent">Dismiss</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
