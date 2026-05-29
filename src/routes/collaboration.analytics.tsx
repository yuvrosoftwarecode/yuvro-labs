import { createFileRoute } from "@tanstack/react-router";
import { squads, engineers } from "@/lib/collab";
import { BarChart3, GitMerge, Clock, TrendingUp, AlertOctagon } from "lucide-react";

export const Route = createFileRoute("/collaboration/analytics")({ component: Analytics });

function Analytics() {
  return (
    <div className="px-6 py-6 max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Squad Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Live performance across every active sprint you're part of.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <Kpi icon={TrendingUp} label="Avg Velocity" v="27 pts" delta="+12%" />
        <Kpi icon={GitMerge} label="PR Throughput" v="38 / wk" delta="+8%" />
        <Kpi icon={Clock} label="Avg Review Time" v="2.4h" delta="-15%" tone="text-success" />
        <Kpi icon={AlertOctagon} label="Open Incidents" v="2" delta="" tone="text-warning" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Sprint Velocity by Squad">
          <div className="space-y-2.5">
            {squads.map(s => (
              <div key={s.id}>
                <div className="flex justify-between text-xs mb-1"><span>{s.name}</span><span className="text-muted-foreground">{s.velocity} pts</span></div>
                <div className="h-2 bg-accent rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${(s.velocity / 40) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Sprint Progress">
          <div className="space-y-2.5">
            {squads.map(s => (
              <div key={s.id}>
                <div className="flex justify-between text-xs mb-1"><span>{s.name}</span><span className="text-muted-foreground">{s.progress}%</span></div>
                <div className="h-2 bg-accent rounded-full overflow-hidden"><div className="h-full bg-success" style={{ width: `${s.progress}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Contributors (this week)">
          <div className="divide-y">
            {engineers.slice(0, 5).map((e, i) => (
              <div key={e.id} className="flex items-center gap-3 py-2.5">
                <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-[10px] font-semibold">{e.avatar}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.name}</p>
                  <p className="text-[11px] text-muted-foreground">{e.role} · {e.sprintsCompleted} sprints</p>
                </div>
                <span className="text-xs font-medium">{e.collab}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Collaboration Heatmap (last 7 days)">
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 49 }).map((_, i) => {
              const intensity = Math.floor(Math.random() * 5);
              const opacity = [0.1, 0.25, 0.45, 0.7, 1][intensity];
              return <div key={i} className="aspect-square rounded-sm bg-primary" style={{ opacity }} />;
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
            <span>Low</span><span>High</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ icon: I, label, v, delta, tone }: any) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><I className="h-3.5 w-3.5" /> {label}</div>
      <div className="mt-1.5 flex items-end justify-between">
        <span className={`text-2xl font-semibold ${tone ?? ""}`}>{v}</span>
        {delta && <span className="text-[11px] text-success">{delta}</span>}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="p-4 border-b font-semibold text-sm">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  );
}
