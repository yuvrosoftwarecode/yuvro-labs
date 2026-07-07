import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { getHackathon, availableLabs, type HackathonGoal } from "@/lib/hackathons";
import { Trophy, Calendar, Target, ArrowLeft, Zap, Clock } from "lucide-react";

export const Route = createFileRoute("/hackathons/$id")({
  component: HackathonDetail,
  loader: ({ params }) => {
    const h = getHackathon(params.id);
    if (!h) throw notFound();
    return { hackathon: h };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.hackathon.title ?? "Hackathon"} — Yuvro Labs` },
      { name: "description", content: loaderData?.hackathon.description ?? "Hackathon" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen"><TopNav />
      <main className="mx-auto max-w-[900px] px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Hackathon not found</h1>
        <Link to="/hackathons" className="mt-4 inline-block text-primary hover:underline">Back to hackathons</Link>
      </main>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen"><TopNav />
      <main className="mx-auto max-w-[900px] px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Couldn't load this hackathon.</h1>
        <button onClick={reset} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button>
      </main>
    </div>
  ),
});

function fmt(iso?: string) {
  if (!iso) return "TBD";
  try { return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); } catch { return "TBD"; }
}

function HackathonDetail() {
  const { hackathon } = Route.useLoaderData();
  const labs = availableLabs();
  const labMap = new Map(labs.map(l => [l.slug, l]));

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <Link to="/hackathons" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> All hackathons
        </Link>

        <section className="mt-4 rounded-2xl border bg-gradient-to-br from-warning/10 via-card to-background p-6 md:p-8">
          <div className="flex items-center gap-2 text-warning"><Trophy className="h-5 w-5" /><span className="text-xs uppercase tracking-wider font-medium">{hackathon.theme ?? "Hackathon"}</span></div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{hackathon.title}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{hackathon.description}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {fmt(hackathon.startsAt)} → {fmt(hackathon.endsAt)}</span>
            <span className="inline-flex items-center gap-1"><Target className="h-3.5 w-3.5" /> {hackathon.goals.length} goals</span>
            {hackathon.prize && <span className="inline-flex items-center gap-1 text-warning"><Trophy className="h-3.5 w-3.5" /> {hackathon.prize}</span>}
          </div>
          <button className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Join hackathon
          </button>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Goals</h2>
          <div className="grid gap-3">
            {hackathon.goals.length === 0 && (
              <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">No goals defined yet.</div>
            )}
            {hackathon.goals.map((g: HackathonGoal, i: number) => {
              const lab = labMap.get(g.labSlug);
              const tone = g.difficulty === "Advanced" ? "bg-destructive/15 text-destructive" : g.difficulty === "Intermediate" ? "bg-warning/15 text-warning" : "bg-success/15 text-success";
              return (
                <div key={g.id} className="rounded-xl border bg-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">#{String(i + 1).padStart(2, "0")}</span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/20 px-2 py-0.5">
                          <span>{lab?.icon ?? "•"}</span>{lab?.name ?? g.labSlug}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tone}`}>{g.difficulty}</span>
                      </div>
                      <h3 className="mt-2 font-semibold">{g.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground space-y-1">
                      <div className="inline-flex items-center gap-1 text-primary"><Zap className="h-3.5 w-3.5" />{g.xp} XP</div>
                      <div className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{g.estMin} min</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
