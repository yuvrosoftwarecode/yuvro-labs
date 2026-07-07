import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { listHackathons, type Hackathon, availableLabs, getJoinedHackathons, joinHackathon, leaveHackathon } from "@/lib/hackathons";
import { me } from "@/lib/dummy";
import { Trophy, Calendar, Target, ArrowRight, Sparkles, Clock, Flame, Zap, Star, Check, Plus, Search } from "lucide-react";

export const Route = createFileRoute("/hackathons")({
  head: () => ({
    meta: [
      { title: "Hackathons — Yuvro Labs" },
      { name: "description", content: "Join timed hackathons spanning SQL, Java, UI, Linux and more." },
    ],
  }),
  component: HackathonsPage,
});

type Category = "Backend" | "Frontend" | "Database" | "DevOps" | "QA" | "Security" | "Design";
const CATEGORIES: Category[] = ["Backend", "Frontend", "Database", "DevOps", "QA", "Security", "Design"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
const STATUSES = ["Live", "Upcoming", "Ended"] as const;

const LAB_CATEGORY: Record<string, Category> = {
  java: "Backend", javaspring: "Backend", python: "Backend", pydjango: "Backend", pyflask: "Backend",
  programming: "Backend", datastructures: "Backend", systemdesign: "Backend",
  ui: "Frontend",
  sql: "Database", postgres: "Database", mongo: "Database",
  git: "DevOps", linux: "DevOps",
  qa: "QA",
  cybersecurity: "Security",
};

const FEATURED_IDS = ["hk-seed-fintech", "hk-seed-devops"];

function fmt(iso?: string) {
  if (!iso) return "TBD";
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" }); } catch { return "TBD"; }
}
function statusOf(h: Hackathon): typeof STATUSES[number] {
  const now = Date.now();
  const s = h.startsAt ? new Date(h.startsAt).getTime() : 0;
  const e = h.endsAt ? new Date(h.endsAt).getTime() : 0;
  if (e && now > e) return "Ended";
  if (s && now < s) return "Upcoming";
  return "Live";
}
function statusTone(s: typeof STATUSES[number]) {
  return s === "Ended" ? "bg-muted/40 text-muted-foreground"
    : s === "Upcoming" ? "bg-info/15 text-info"
    : "bg-success/15 text-success";
}
function hackCategories(h: Hackathon): Category[] {
  return Array.from(new Set(h.goals.map(g => LAB_CATEGORY[g.labSlug]).filter(Boolean) as Category[]));
}
function hackDifficulties(h: Hackathon): Array<typeof DIFFICULTIES[number]> {
  return Array.from(new Set(h.goals.map(g => g.difficulty)));
}

function HackathonsPage() {
  const [items, setItems] = useState<Hackathon[]>([]);
  const [joined, setJoined] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [diffs, setDiffs] = useState<Array<typeof DIFFICULTIES[number]>>([]);
  const [statuses, setStatuses] = useState<Array<typeof STATUSES[number]>>([]);

  useEffect(() => {
    setItems(listHackathons());
    setJoined(getJoinedHackathons());
  }, []);

  const labs = availableLabs();
  const labMap = useMemo(() => new Map(labs.map(l => [l.slug, l])), [labs]);

  const joinedItems = useMemo(() => items.filter(h => joined.includes(h.id)), [items, joined]);
  const featured = useMemo(() => {
    const preferred = FEATURED_IDS.map(id => items.find(h => h.id === id)).filter(Boolean) as Hackathon[];
    const extras = items.filter(h => !FEATURED_IDS.includes(h.id)).slice(0, 4);
    return [...preferred, ...extras];
  }, [items]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter(h => {
      if (s && !h.title.toLowerCase().includes(s) && !h.description.toLowerCase().includes(s)) return false;
      if (cats.length && !hackCategories(h).some(c => cats.includes(c))) return false;
      if (diffs.length && !hackDifficulties(h).some(d => diffs.includes(d))) return false;
      if (statuses.length && !statuses.includes(statusOf(h))) return false;
      return true;
    });
  }, [items, q, cats, diffs, statuses]);

  const toggleJoin = (id: string) => {
    if (joined.includes(id)) { leaveHackathon(id); setJoined(p => p.filter(x => x !== id)); }
    else { joinHackathon(id); setJoined(p => [...p, id]); }
  };
  const toggleIn = <T,>(arr: T[], v: T) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  const clearFilters = () => { setCats([]); setDiffs([]); setStatuses([]); setQ(""); };
  const hasFilters = !!(cats.length || diffs.length || statuses.length || q);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        {/* Hero row: title left, quick stats right */}
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-warning/10 via-card to-background p-5 md:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-warning/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:gap-6">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                <Sparkles className="h-3 w-3" /> Cross-stack challenges
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight truncate">
                <span className="text-warning">Hackathons</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl hidden sm:block">
                Timed, multi-lab challenges. Ship goals across SQL, Linux, UI, Java and more to earn XP, badges and recruiter attention.
              </p>
            </div>
            <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:min-w-[380px] md:min-w-[420px]">
              <MiniStat icon={<Flame className="h-3.5 w-3.5 text-warning" />} label="Day streak" value={`${me.streak}d`} accent="warning" />
              <MiniStat icon={<Zap className="h-3.5 w-3.5 text-primary" />} label="YP" value="+450" accent="primary" />
              <MiniStat icon={<Trophy className="h-3.5 w-3.5 text-info" />} label="Rank" value={`#${me.rank}`} accent="info" />
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-10">
          {/* My hackathons */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">My hackathons</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{joinedItems.length} joined · {joinedItems.reduce((a, h) => a + h.goals.length, 0)} goals</p>
            </div>
            {joinedItems.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
                You haven't joined any hackathon yet. Pick one below to get started.
              </div>
            ) : (
              <HScroll>
                {joinedItems.map(h => (
                  <div key={h.id} className="w-[320px] shrink-0">
                    <JoinedCard h={h} labMap={labMap} />
                  </div>
                ))}
              </HScroll>
            )}
          </section>

          {/* Featured hackathons */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-warning" /> Featured hackathons</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Highlighted sprints trending now.</p>
            </div>
            {featured.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">No hackathons yet.</div>
            ) : (
              <HScroll>
                {featured.map(h => (
                  <div key={h.id} className="w-[340px] shrink-0">
                    <FeaturedCard h={h} labMap={labMap} isJoined={joined.includes(h.id)} onToggle={() => toggleJoin(h.id)} />
                  </div>
                ))}
              </HScroll>
            )}
          </section>

          {/* All hackathons with sidebar filters */}
          <section>
            <div className="mb-4 flex items-end justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold">All hackathons</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {items.length} hackathons</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search hackathons…"
                  className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-border bg-transparent w-56 outline-none focus:border-primary" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="rounded-xl border bg-card/40 p-4 md:sticky md:top-20 self-start space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Filters</span>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-[10px] text-muted-foreground hover:text-foreground underline">Clear</button>
                  )}
                </div>
                <FilterGroup label="Status">
                  {STATUSES.map(s => (
                    <CheckRow key={s} checked={statuses.includes(s)} onChange={() => setStatuses(prev => toggleIn(prev, s))} label={s} />
                  ))}
                </FilterGroup>
                <FilterGroup label="Category">
                  {CATEGORIES.map(c => (
                    <CheckRow key={c} checked={cats.includes(c)} onChange={() => setCats(prev => toggleIn(prev, c))} label={c} />
                  ))}
                </FilterGroup>
                <FilterGroup label="Difficulty">
                  {DIFFICULTIES.map(d => (
                    <CheckRow key={d} checked={diffs.includes(d)} onChange={() => setDiffs(prev => toggleIn(prev, d))} label={d} />
                  ))}
                </FilterGroup>
              </aside>

              <div className="min-w-0">
                {filtered.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
                    No hackathons match these filters.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filtered.map(h => (
                      <CatalogCard key={h.id} h={h} labMap={labMap} isJoined={joined.includes(h.id)} onToggle={() => toggleJoin(h.id)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function HScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-4 px-4 overflow-x-auto scrollbar-thin">
      <div className="flex gap-4 pb-2">{children}</div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-xs cursor-pointer hover:text-foreground text-muted-foreground select-none">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-3.5 w-3.5 accent-primary rounded border-border" />
      <span className={checked ? "text-foreground" : ""}>{label}</span>
    </label>
  );
}

type LabMap = Map<string, { slug: string; name: string; icon: string; color: string }>;

function LabChips({ h, labMap, max = 6 }: { h: Hackathon; labMap: LabMap; max?: number }) {
  const slugs = [...new Set(h.goals.map(g => g.labSlug))].slice(0, max);
  return (
    <div className="flex flex-wrap gap-1.5">
      {slugs.map(slug => {
        const l = labMap.get(slug);
        return (
          <span key={slug} className="text-[11px] px-2 py-0.5 rounded-full border border-border/60 bg-muted/20 inline-flex items-center gap-1">
            <span>{l?.icon ?? "•"}</span>{l?.name.replace(" Lab", "") ?? slug}
          </span>
        );
      })}
    </div>
  );
}

function JoinedCard({ h, labMap }: { h: Hackathon; labMap: LabMap }) {
  const st = statusOf(h);
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-5 hover:border-primary/50 hover:ring-glow transition h-full">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-warning via-primary to-ui" />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-warning" />
            <h3 className="font-semibold truncate">{h.title}</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{h.description}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusTone(st)}`}>{st}</span>
      </div>
      <div className="mt-3"><LabChips h={h} labMap={labMap} max={5} /></div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Target className="h-3.5 w-3.5" />{h.goals.length} goals</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{fmt(h.endsAt)}</span>
      </div>
      <div className="mt-4">
        <Link to="/hackathons/$id" params={{ id: h.id }}
          className="w-full inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
          Continue <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function FeaturedCard({ h, labMap, isJoined, onToggle }: { h: Hackathon; labMap: LabMap; isJoined: boolean; onToggle: () => void }) {
  const st = statusOf(h);
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card via-card to-warning/10 p-5 hover:border-primary/50 transition h-full">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-warning/30 blur-2xl opacity-40" />
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
          <Star className="h-3 w-3" /> Featured
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusTone(st)}`}>{st}</span>
      </div>
      <div className="mt-3">
        <h3 className="font-semibold">{h.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{h.description}</p>
      </div>
      <div className="mt-3"><LabChips h={h} labMap={labMap} max={5} /></div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Target className="h-3.5 w-3.5" />{h.goals.length} goals</span>
        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{fmt(h.startsAt)} → {fmt(h.endsAt)}</span>
      </div>
      {h.prize && <div className="mt-2 text-xs text-warning inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Prize: {h.prize}</div>}
      <div className="mt-4 flex gap-2">
        <Link to="/hackathons/$id" params={{ id: h.id }}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
          View
        </Link>
        <button onClick={onToggle}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${isJoined ? "border border-success/40 bg-success/10 text-success" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
          {isJoined ? (<><Check className="h-3.5 w-3.5" /> Joined</>) : (<><Plus className="h-3.5 w-3.5" /> Join</>)}
        </button>
      </div>
    </div>
  );
}

function CatalogCard({ h, labMap, isJoined, onToggle }: { h: Hackathon; labMap: LabMap; isJoined: boolean; onToggle: () => void }) {
  const st = statusOf(h);
  return (
    <div className="rounded-xl border bg-card p-4 hover:border-primary/40 transition">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-warning" />
            <div className="font-medium text-sm truncate">{h.title}</div>
          </div>
          <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{h.description}</div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusTone(st)}`}>{st}</span>
      </div>
      <div className="mt-2"><LabChips h={h} labMap={labMap} max={4} /></div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Target className="h-3 w-3" />{h.goals.length}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{fmt(h.endsAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Link to="/hackathons/$id" params={{ id: h.id }} className="rounded-md border border-border px-2 py-1 hover:bg-accent">View</Link>
          <button onClick={onToggle}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium transition ${isJoined ? "border border-success/40 bg-success/10 text-success" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
            {isJoined ? (<><Check className="h-3 w-3" /> Joined</>) : (<><Plus className="h-3 w-3" /> Join</>)}
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card/70 backdrop-blur px-3 py-2.5">
      <div className="absolute -right-4 -top-4 h-10 w-10 rounded-full blur-2xl opacity-30" style={{ background: `var(--${accent})` }} />
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">{icon}{label}</div>
      <div className="mt-0.5 text-lg font-semibold leading-tight">{value}</div>
    </div>
  );
}
