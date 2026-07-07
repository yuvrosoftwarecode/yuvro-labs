import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { ProgressRing } from "@/components/ProgressRing";
import { DiffBadge } from "@/components/Badges";
import { labs, me, type Lab } from "@/lib/dummy";
import { getEnrolled, enroll, unenroll } from "@/lib/enrollment";
import { ArrowRight, Sparkles, Flame, Zap, Trophy, Check, Plus, Star, Search } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Hub });

// Curated set of labs to feature.
const FEATURED_SLUGS = ["javaspring", "systemdesign", "cybersecurity"];

type Category = "Backend" | "Frontend" | "Database" | "DevOps" | "QA" | "AI" | "Security" | "Design";
const CATEGORIES: Category[] = ["Backend", "Frontend", "Database", "DevOps", "QA", "Security", "Design"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

const LAB_CATEGORY: Record<string, Category> = {
  java: "Backend", javaspring: "Backend", python: "Backend", pydjango: "Backend", pyflask: "Backend",
  programming: "Backend", datastructures: "Backend", systemdesign: "Backend",
  ui: "Frontend",
  sql: "Database", postgres: "Database", mongo: "Database",
  git: "DevOps", linux: "DevOps",
  qa: "QA",
  cybersecurity: "Security",
};

const LAB_LANGUAGES: Record<string, string[]> = {
  java: ["Java"], javaspring: ["Java"],
  python: ["Python"], pydjango: ["Python"], pyflask: ["Python"],
  programming: ["Python", "JavaScript"], datastructures: ["Python", "Java", "C++"],
  systemdesign: [],
  ui: ["HTML", "CSS", "JavaScript"],
  sql: ["SQL"], postgres: ["SQL"], mongo: ["JavaScript"],
  git: ["Bash"], linux: ["Bash"],
  qa: ["JavaScript"],
  cybersecurity: ["Python", "Bash"],
};

const ALL_LANGUAGES = Array.from(new Set(Object.values(LAB_LANGUAGES).flat())).sort();

function Hub() {
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | null>(null);
  const [diff, setDiff] = useState<typeof DIFFICULTIES[number] | null>(null);
  const [lang, setLang] = useState<string | null>(null);

  useEffect(() => { setEnrolled(getEnrolled()); }, []);

  const enrolledLabs = useMemo(() => labs.filter(l => enrolled.includes(l.slug)), [enrolled]);
  const featuredLabs = useMemo(() => FEATURED_SLUGS.map(s => labs.find(l => l.slug === s)).filter(Boolean) as Lab[], []);
  const filteredAll = useMemo(() => {
    const s = q.trim().toLowerCase();
    return labs.filter(l => {
      if (s && !l.name.toLowerCase().includes(s) && !l.description.toLowerCase().includes(s)) return false;
      if (cat && LAB_CATEGORY[l.slug] !== cat) return false;
      if (diff && l.difficulty !== diff) return false;
      if (lang && !(LAB_LANGUAGES[l.slug] ?? []).includes(lang)) return false;
      return true;
    });
  }, [q, cat, diff, lang]);

  const toggle = (slug: string) => {
    if (enrolled.includes(slug)) { unenroll(slug); setEnrolled(prev => prev.filter(s => s !== slug)); }
    else { enroll(slug); setEnrolled(prev => [...prev, slug]); }
  };
  const clearFilters = () => { setCat(null); setDiff(null); setLang(null); setQ(""); };
  const hasFilters = !!(cat || diff || lang || q);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        {/* Header row: title left, quick stats right — right-aligned from sm+ */}
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-accent/40 via-card to-background p-5 md:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-ui/20 blur-3xl" />
          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:gap-6">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" /> Welcome back, {me.name.split(" ")[0]}
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight truncate">
                Your <span className="text-primary">Individual Hub</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl hidden sm:block">
                Continue enrolled labs, explore featured tracks and dive into any lab in the catalog.
              </p>
              <div className="mt-5">
                <Link to="/lab/$slug" params={{ slug: "java" }} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs sm:text-sm font-medium text-primary-foreground hover:opacity-90">
                  Continue Java Lab <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:min-w-[380px] md:min-w-[420px]">
              <MiniStat icon={<Flame className="h-3.5 w-3.5 text-warning" />} label="Day streak" value={`${me.streak}d`} accent="warning" />
              <MiniStat icon={<Zap className="h-3.5 w-3.5 text-primary" />} label="YP" value="+450" accent="primary" />
              <MiniStat icon={<Trophy className="h-3.5 w-3.5 text-info" />} label="Rank" value={`#${me.rank}`} accent="info" />
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-10">
          {/* My labs — horizontal scroll */}
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold">My labs</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{enrolledLabs.length} enrolled · {enrolledLabs.reduce((a, l) => a + l.completed, 0)} tickets solved</p>
              </div>
            </div>
            {enrolledLabs.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center">
                <p className="text-sm text-muted-foreground">You haven't enrolled in any lab yet. Pick one from the catalog below to get started.</p>
              </div>
            ) : (
              <HScroll>
                {enrolledLabs.map(lab => (
                  <div key={lab.slug} className="w-[300px] shrink-0">
                    <EnrolledCard lab={lab} onUnenroll={() => toggle(lab.slug)} />
                  </div>
                ))}
              </HScroll>
            )}
          </section>

          {/* Featured labs — horizontal scroll */}
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-warning" /> Featured labs</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Handpicked tracks trending this month.</p>
              </div>
            </div>
            <HScroll>
              {featuredLabs.map(lab => (
                <div key={lab.slug} className="w-[320px] shrink-0">
                  <FeaturedCard lab={lab} isEnrolled={enrolled.includes(lab.slug)} onToggle={() => toggle(lab.slug)} />
                </div>
              ))}
            </HScroll>
          </section>

          {/* All labs catalog with filters */}
          <section>
            <div className="mb-4 flex items-end justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold">All labs</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{filteredAll.length} of {labs.length} labs</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search labs…"
                  className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-border bg-transparent w-56 outline-none focus:border-primary" />
              </div>
            </div>

            {/* Filter chips */}
            <div className="mb-4 space-y-2">
              <FilterRow label="Category">
                <Chip active={!cat} onClick={() => setCat(null)}>All</Chip>
                {CATEGORIES.map(c => <Chip key={c} active={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</Chip>)}
              </FilterRow>
              <FilterRow label="Difficulty">
                <Chip active={!diff} onClick={() => setDiff(null)}>All</Chip>
                {DIFFICULTIES.map(d => <Chip key={d} active={diff === d} onClick={() => setDiff(diff === d ? null : d)}>{d}</Chip>)}
              </FilterRow>
              <FilterRow label="Language">
                <Chip active={!lang} onClick={() => setLang(null)}>All</Chip>
                {ALL_LANGUAGES.map(l => <Chip key={l} active={lang === l} onClick={() => setLang(lang === l ? null : l)}>{l}</Chip>)}
              </FilterRow>
              {hasFilters && (
                <button onClick={clearFilters} className="text-[11px] text-muted-foreground hover:text-foreground underline">Clear filters</button>
              )}
            </div>

            {filteredAll.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
                No labs match these filters.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAll.map(lab => (
                  <CatalogCard key={lab.slug} lab={lab} isEnrolled={enrolled.includes(lab.slug)} onToggle={() => toggle(lab.slug)} />
                ))}
              </div>
            )}
          </section>
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

function MiniStat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card/70 backdrop-blur px-3 py-2.5">
      <div className="absolute -right-4 -top-4 h-10 w-10 rounded-full blur-2xl opacity-30" style={{ background: `var(--${accent})` }} />
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">{icon}{label}</div>
      <div className="mt-0.5 text-lg font-semibold leading-tight">{value}</div>
    </div>
  );
}

