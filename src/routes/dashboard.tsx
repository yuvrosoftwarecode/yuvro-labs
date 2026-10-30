import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/TopNav";
import LearnerHero from "@/components/LearnerHero";
import { useAuth } from "@/lib/auth";
import { ProgressRing } from "@/components/ProgressRing";
import { labs, type Lab } from "@/lib/dummy";
import { getEnrolled, enroll, unenroll } from "@/lib/enrollment";
import { ArrowRight, Check, Plus, Lock, Search } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Hub });

// Curated set of labs to feature.
const FEATURED_SLUGS = ["javaspring", "systemdesign", "systemdesign-url-shortener", "systemdesign-bookmysystem", "cybersecurity", "pydjango", "postgres", "datastructures", "qa"];

type Category = "Backend" | "Frontend" | "Database" | "DevOps" | "QA" | "AI" | "Security" | "Design";
const CATEGORIES: Category[] = ["Backend", "Frontend", "Database", "DevOps", "QA", "Security", "Design"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

const LAB_CATEGORY: Record<string, Category> = {
  java: "Backend", javaspring: "Backend", python: "Backend", pydjango: "Backend", pyflask: "Backend",
  programming: "Backend", datastructures: "Backend", systemdesign: "Design",
  "systemdesign-url-shortener": "Design", "systemdesign-bookmysystem": "Design",
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [diffs, setDiffs] = useState<Array<typeof DIFFICULTIES[number]>>([]);
  const [langs, setLangs] = useState<string[]>([]);

  useEffect(() => { setEnrolled(getEnrolled()); }, []);

  const enrolledLabs = useMemo(() => labs.filter(l => enrolled.includes(l.slug)), [enrolled]);
  const featuredLabs = useMemo(() => FEATURED_SLUGS.map(s => labs.find(l => l.slug === s)).filter(Boolean) as Lab[], []);
  const filteredAll = useMemo(() => {
    const s = q.trim().toLowerCase();
    return labs.filter(l => {
      if (s && !l.name.toLowerCase().includes(s) && !l.description.toLowerCase().includes(s)) return false;
      if (cats.length && !cats.includes(LAB_CATEGORY[l.slug])) return false;
      if (diffs.length && !diffs.includes(l.difficulty)) return false;
      if (langs.length && !(LAB_LANGUAGES[l.slug] ?? []).some(x => langs.includes(x))) return false;
      return true;
    });
  }, [q, cats, diffs, langs]);

  const toggle = (slug: string) => {
    if (enrolled.includes(slug)) { unenroll(slug); setEnrolled(prev => prev.filter(s => s !== slug)); }
    else { enroll(slug); setEnrolled(prev => [...prev, slug]); }
  };
  const clearFilters = () => { setCats([]); setDiffs([]); setLangs([]); setQ(""); };
  const hasFilters = !!(cats.length || diffs.length || langs.length || q);
  const toggleIn = <T,>(arr: T[], v: T) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];


  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <LearnerHero
          userName={user?.name.trim().split(/\s+/)[0]}
          onContinue={() => navigate({ href: "/java-lab" })}
        />

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
                    <EnrolledCard lab={lab} />
                  </div>
                ))}
              </HScroll>
            )}
          </section>


          {/* Featured labs — horizontal scroll */}
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div className="min-w-0">
<h2 className="text-xl font-semibold flex items-center gap-2"><Lock className="h-4 w-4 text-muted-foreground" /> Premium labs</h2>
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

          {/* All labs catalog with sidebar filters */}
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

            <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="rounded-xl border bg-card/40 p-4 md:sticky md:top-20 self-start space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Filters</span>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-[10px] text-muted-foreground hover:text-foreground underline">Clear</button>
                  )}
                </div>
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
                <FilterGroup label="Language">
                  {ALL_LANGUAGES.map(l => (
                    <CheckRow key={l} checked={langs.includes(l)} onChange={() => setLangs(prev => toggleIn(prev, l))} label={l} />
                  ))}
                </FilterGroup>
              </aside>

              <div className="min-w-0">
                {filteredAll.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
                    No labs match these filters.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filteredAll.map(lab => (
                      <CatalogCard key={lab.slug} lab={lab} isEnrolled={enrolled.includes(lab.slug)} onToggle={() => toggle(lab.slug)} />
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
      <input type="checkbox" checked={checked} onChange={onChange}
        className="h-3.5 w-3.5 accent-primary rounded border-border" />
      <span className={checked ? "text-foreground" : ""}>{label}</span>
    </label>
  );
}

function FeaturedCard({ lab, isEnrolled, onToggle }: { lab: Lab; isEnrolled: boolean; onToggle: () => void }) {

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-5 hover:border-primary/50 transition">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1">
        <Lock className="h-3 w-3" /> Premium
      </span>
      <div className="mt-3 min-w-0">
        <h3 className="font-semibold truncate">{lab.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{lab.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-end text-xs">
        <span className="text-muted-foreground">{lab.total} tickets</span>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={onToggle}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${isEnrolled ? "border border-success/40 bg-success/10 text-success" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
          {isEnrolled ? (<><Check className="h-3.5 w-3.5" /> Enrolled</>) : (<><Plus className="h-3.5 w-3.5" /> Enroll</>)}
        </button>
      </div>
    </div>
  );
}

function EnrolledCard({ lab }: { lab: Lab }) {
  const pct = Math.round((lab.completed / lab.total) * 100);
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-5 hover:border-primary/50 hover:ring-glow transition">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Free</span>
          <h3 className="mt-1 font-semibold truncate">{lab.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{lab.description}</p>
        </div>
        <ProgressRing value={pct} color={`var(--${lab.color})`} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">10 sprints · 100 tickets</span>
        <span className="text-muted-foreground">{lab.completed}/{lab.total}</span>
      </div>
      <div className="mt-4">
        <Link to="/lab/$slug" params={{ slug: lab.slug }}
          className="w-full inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
          {lab.completed > 0 ? "Continue" : "Start"} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );

}

function CatalogCard({ lab, isEnrolled, onToggle }: { lab: Lab; isEnrolled: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl border bg-card p-4 hover:border-primary/40 transition">
      <div className="min-w-0">
        <div className="font-medium text-sm truncate">{lab.name}</div>
        <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{lab.description}</div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">{lab.total} tickets</span>
        <button onClick={onToggle}
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium transition ${isEnrolled ? "border border-success/40 bg-success/10 text-success" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
          {isEnrolled ? (<><Check className="h-3 w-3" /> Enrolled</>) : (<><Plus className="h-3 w-3" /> Enroll</>)}
        </button>
      </div>
    </div>
  );
}


