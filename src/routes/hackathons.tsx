import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { listHackathons, type Hackathon, availableLabs } from "@/lib/hackathons";
import { Trophy, Calendar, Target, ArrowRight, Sparkles, Clock } from "lucide-react";

export const Route = createFileRoute("/hackathons")({
  head: () => ({
    meta: [
      { title: "Hackathons — Yuvro Labs" },
      { name: "description", content: "Join timed hackathons spanning SQL, Java, UI, Linux and more." },
    ],
  }),
  component: HackathonsPage,
});

function fmt(iso?: string) {
  if (!iso) return "TBD";
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" }); } catch { return "TBD"; }
}

function status(h: Hackathon): { label: string; tone: string } {
  const now = Date.now();
  const s = h.startsAt ? new Date(h.startsAt).getTime() : 0;
  const e = h.endsAt ? new Date(h.endsAt).getTime() : 0;
  if (e && now > e) return { label: "Ended", tone: "bg-muted/40 text-muted-foreground" };
  if (s && now < s) return { label: "Upcoming", tone: "bg-info/15 text-info" };
  return { label: "Live", tone: "bg-success/15 text-success" };
}

function HackathonsPage() {
  const [items, setItems] = useState<Hackathon[]>([]);
  useEffect(() => { setItems(listHackathons()); }, []);
  const labs = availableLabs();
  const labMap = new Map(labs.map(l => [l.slug, l]));

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1400px] px-4 py-10">
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-warning/10 via-card to-background p-8 md:p-10 mb-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-warning/20 blur-3xl" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
            <Sparkles className="h-3 w-3" /> Cross-stack challenges
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">Hackathons</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Timed, multi-lab challenges. Ship goals across SQL, Linux, UI, Java and more to earn XP, badges and recruiter attention.</p>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.length === 0 && (
            <div className="col-span-full rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">No hackathons yet. Check back soon!</div>
          )}
          {items.map(h => {
            const st = status(h);
            return (
              <Link key={h.id} to="/hackathons/$id" params={{ id: h.id }}
                className="group relative overflow-hidden rounded-xl border bg-card p-5 hover:border-primary/50 hover:ring-glow transition">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-warning via-primary to-ui" />
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-warning" />
                      <h3 className="font-semibold truncate">{h.title}</h3>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{h.description}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${st.tone}`}>{st.label}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {[...new Set(h.goals.map(g => g.labSlug))].slice(0, 6).map(slug => {
                    const l = labMap.get(slug);
                    return <span key={slug} className="text-[11px] px-2 py-0.5 rounded-full border border-border/60 bg-muted/20 inline-flex items-center gap-1">
                      <span>{l?.icon ?? "•"}</span>{l?.name.replace(" Lab","") ?? slug}
                    </span>;
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Target className="h-3.5 w-3.5" />{h.goals.length} goals</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{fmt(h.startsAt)} → {fmt(h.endsAt)}</span>
                </div>
                {h.prize && <div className="mt-3 text-xs text-warning inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Prize: {h.prize}</div>}
                <div className="mt-4 flex justify-end text-sm text-primary opacity-0 group-hover:opacity-100 transition">
                  View details <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
