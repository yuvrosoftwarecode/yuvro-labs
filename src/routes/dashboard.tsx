import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { ProgressRing } from "@/components/ProgressRing";
import { DiffBadge } from "@/components/Badges";
import { labs, me, type Lab } from "@/lib/dummy";
import { getEnrolled, enroll, unenroll } from "@/lib/enrollment";
import { ArrowRight, Sparkles, Flame, Zap, Trophy, Rocket, Check, Plus, Star, Search } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Hub });

// Curated set of labs to feature.
const FEATURED_SLUGS = ["javaspring", "systemdesign", "cybersecurity"];

function Hub() {
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => { setEnrolled(getEnrolled()); }, []);

  const enrolledLabs = useMemo(() => labs.filter(l => enrolled.includes(l.slug)), [enrolled]);
  const featuredLabs = useMemo(() => FEATURED_SLUGS.map(s => labs.find(l => l.slug === s)).filter(Boolean) as Lab[], []);
  const filteredAll = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return labs;
    return labs.filter(l => l.name.toLowerCase().includes(s) || l.description.toLowerCase().includes(s));
  }, [q]);

  const toggle = (slug: string) => {
    if (enrolled.includes(slug)) { unenroll(slug); setEnrolled(prev => prev.filter(s => s !== slug)); }
    else { enroll(slug); setEnrolled(prev => [...prev, slug]); }
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1400px] px-4 py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-accent/40 via-card to-background p-8 md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-ui/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Welcome back, {me.name.split(" ")[0]}
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">
              Your <span className="text-primary">Individual Hub</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Continue enrolled labs, explore featured tracks and dive into any lab in the catalog.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/lab/$slug" params={{ slug: "java" }} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                Continue Java Lab <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/hackathons" className="inline-flex items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-4 py-2 text-sm font-medium text-warning hover:bg-warning/15">
                <Rocket className="h-4 w-4" /> Explore Hackathons
              </Link>
            </div>
          </div>
        </section>

        {/* Two-column layout: labs on the left, stats on the right */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-10">
            {/* Featured labs */}
            <section>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-warning" /> Featured labs</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Handpicked tracks trending this month.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {featuredLabs.map(lab => (
                  <FeaturedCard key={lab.slug} lab={lab} isEnrolled={enrolled.includes(lab.slug)} onToggle={() => toggle(lab.slug)} />
                ))}
              </div>
            </section>

            {/* Enrolled labs */}
            <section>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-semibold">My enrolled labs</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{enrolledLabs.length} enrolled · {enrolledLabs.reduce((a, l) => a + l.completed, 0)} tickets solved</p>
                </div>
              </div>
              {enrolledLabs.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center">
                  <p className="text-sm text-muted-foreground">You haven't enrolled in any lab yet. Pick one from the catalog below to get started.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {enrolledLabs.map(lab => (
                    <EnrolledCard key={lab.slug} lab={lab} onUnenroll={() => toggle(lab.slug)} />
                  ))}
                </div>
              )}
            </section>

            {/* All labs catalog */}
            <section>
              <div className="mb-4 flex items-end justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-xl font-semibold">All labs</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{filteredAll.length} of {labs.length} labs</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search labs…"
                    className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-border bg-transparent w-56 outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredAll.map(lab => (
                  <CatalogCard key={lab.slug} lab={lab} isEnrolled={enrolled.includes(lab.slug)} onToggle={() => toggle(lab.slug)} />
                ))}
              </div>
            </section>
          </div>

          {/* Right rail — stats */}
          <aside className="space-y-4 lg:sticky lg:top-20 self-start">
            <StatCard icon={<Flame className="h-4 w-4 text-warning" />} label="Day streak" value={`${me.streak} days`} hint="Keep it alive — solve 1 ticket today" accent="warning" />
            <StatCard icon={<Zap className="h-4 w-4 text-primary" />} label="XP this week" value="+450" hint={`${me.nextLevelXp - me.xp} XP to Level ${me.level + 1}`} accent="primary" />
            <StatCard icon={<Trophy className="h-4 w-4 text-info" />} label="Global rank" value={`#${me.rank}`} hint="Top 2% of active learners" accent="info" />

            <div className="rounded-xl border bg-card p-4">
              <div className="text-xs font-semibold mb-3">This week</div>
              <div className="space-y-2 text-xs">
                <Row label="Tickets solved" value="7" />
                <Row label="Hours logged" value="4h 20m" />
                <Row label="Badges earned" value="2" />
              </div>
              <Link to="/analytics" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                View analytics <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function FeaturedCard({ lab, isEnrolled, onToggle }: { lab: Lab; isEnrolled: boolean; onToggle: () => void }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card via-card to-accent/20 p-5 hover:border-primary/50 transition">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-30" style={{ background: `var(--${lab.color})` }} />
      <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
        <Star className="h-3 w-3" /> Featured
      </span>
      <div className="mt-3 flex items-start gap-3">
        <div className="text-3xl">{lab.icon}</div>
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{lab.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{lab.description}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <DiffBadge value={lab.difficulty} />
        <span className="text-muted-foreground">{lab.total} tickets</span>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to="/lab/$slug" params={{ slug: lab.slug }} className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
          View
        </Link>
        <button onClick={onToggle}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${isEnrolled ? "border border-success/40 bg-success/10 text-success" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
          {isEnrolled ? (<><Check className="h-3.5 w-3.5" /> Enrolled</>) : (<><Plus className="h-3.5 w-3.5" /> Enroll</>)}
        </button>
      </div>
    </div>
  );
}

function EnrolledCard({ lab, onUnenroll }: { lab: Lab; onUnenroll: () => void }) {
  const pct = Math.round((lab.completed / lab.total) * 100);
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-5 hover:border-primary/50 hover:ring-glow transition">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `var(--${lab.color})` }} />
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-2xl">{lab.icon}</div>
          <h3 className="mt-2 font-semibold truncate">{lab.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{lab.description}</p>
        </div>
        <ProgressRing value={pct} color={`var(--${lab.color})`} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <DiffBadge value={lab.difficulty} />
        <span className="text-muted-foreground">{lab.completed}/{lab.total} · {lab.hoursLeft}h left</span>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to="/lab/$slug" params={{ slug: lab.slug }}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
          {lab.completed > 0 ? "Continue" : "Start"} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button onClick={onUnenroll} title="Unenroll"
          className="inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
          Leave
        </button>
      </div>
    </div>
  );
}

function CatalogCard({ lab, isEnrolled, onToggle }: { lab: Lab; isEnrolled: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl border bg-card p-4 hover:border-primary/40 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="text-xl">{lab.icon}</div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{lab.name}</div>
            <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{lab.description}</div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <DiffBadge value={lab.difficulty} />
          <span className="text-muted-foreground">{lab.total} tickets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Link to="/lab/$slug" params={{ slug: lab.slug }} className="rounded-md border border-border px-2 py-1 hover:bg-accent">View</Link>
          <button onClick={onToggle}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium transition ${isEnrolled ? "border border-success/40 bg-success/10 text-success" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
            {isEnrolled ? (<><Check className="h-3 w-3" /> Enrolled</>) : (<><Plus className="h-3 w-3" /> Enroll</>)}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, hint, accent }: { icon: React.ReactNode; label: string; value: string; hint: string; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-4">
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full blur-2xl opacity-30" style={{ background: `var(--${accent})` }} />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-1.5 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
