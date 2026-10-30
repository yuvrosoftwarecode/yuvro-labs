import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { ProgressRing } from "@/components/ProgressRing";
import { DiffBadge } from "@/components/Badges";
import { me } from "@/lib/dummy";
import { ArrowRight, Sparkles, Flame, Mic, Trophy, Check, Plus, Star, Search, Clock } from "lucide-react";

export const Route = createFileRoute("/mock-interviews")({
  head: () => ({ meta: [{ title: "Vitarka Mock Interviews | Yuvro" }, { name: "description", content: "Practice AI-led tech mock interviews with Vitarka." }] }),
  component: MockHub,
});

import { INTERVIEWS, CATEGORIES, DIFFICULTIES, ROLES, type Category, type Diff, type Interview } from "@/lib/mockInterviews";

const KEY = "yuvro-mock-interviews-enrolled";
const load = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) || '["java-backend","react-frontend"]'); } catch { return []; } };

function MockHub() {
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [diffs, setDiffs] = useState<Diff[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => { setEnrolled(load()); }, []);

  const save = (v: string[]) => { setEnrolled(v); try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };
  const toggle = (s: string) => save(enrolled.includes(s) ? enrolled.filter(x => x !== s) : [...enrolled, s]);
  const toggleIn = <T,>(arr: T[], v: T) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const mine = INTERVIEWS.filter(i => enrolled.includes(i.slug));
  const featured = INTERVIEWS.filter(i => i.featured);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return INTERVIEWS.filter(i =>
      (!s || i.name.toLowerCase().includes(s) || i.description.toLowerCase().includes(s)) &&
      (!cats.length || cats.includes(i.category)) &&
      (!diffs.length || diffs.includes(i.difficulty)) &&
      (!roles.length || roles.includes(i.role)));
  }, [q, cats, diffs, roles]);
  const hasFilters = !!(q || cats.length || diffs.length || roles.length);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-accent/40 via-card to-background p-5 md:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-ui/20 blur-3xl" />
          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:gap-6">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" /> Welcome back, {me.name.split(" ")[0]}
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight truncate">
                Vitarka <span className="text-primary">Mock Interviews</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl hidden sm:block">
                Practice AI-led interviews for real tech roles, with adaptive follow-up questions and instant feedback.
              </p>
            </div>
            <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:min-w-[380px] md:min-w-[420px]">
              <MiniStat icon={<Mic className="h-3.5 w-3.5 text-primary" />} label="Interviews" value="3" accent="primary" />
              <MiniStat icon={<Trophy className="h-3.5 w-3.5 text-info" />} label="Avg score" value="78%" accent="info" />
              <MiniStat icon={<Flame className="h-3.5 w-3.5 text-warning" />} label="Day streak" value={`${me.streak}d`} accent="warning" />
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-10">
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">My interviews</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{mine.length} added · {mine.reduce((a, i) => a + i.completed, 0)} attempts completed</p>
            </div>
            {mine.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
                You haven't added any mock interview yet. Pick one from the catalog below.
              </div>
            ) : (
              <HScroll>{mine.map(i => <div key={i.slug} className="w-[300px] shrink-0"><MineCard i={i} /></div>)}</HScroll>
            )}
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-warning" /> Featured interviews</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Most practised roles this month.</p>
            </div>
            <HScroll>{featured.map(i => (
              <div key={i.slug} className="w-[320px] shrink-0">
                <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card via-card to-accent/20 p-5 hover:border-primary/50 transition">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-30" style={{ background: `var(--${i.color})` }} />
                  <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning"><Star className="h-3 w-3" /> Featured</span>
                  <Link to="/mock-interview/$slug" params={{ slug: i.slug }} className="mt-3 flex items-start gap-3">
                    <div className="text-3xl">{i.icon}</div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{i.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{i.description}</p>
                    </div>
                  </Link>
                  <Meta i={i} />
                  <div className="mt-4"><AddBtn on={enrolled.includes(i.slug)} onClick={() => toggle(i.slug)} full /></div>
                </div>
              </div>
            ))}</HScroll>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-semibold">All mock interviews</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {INTERVIEWS.length} interviews</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search interviews…"
                  className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-border bg-transparent w-56 outline-none focus:border-primary" />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="rounded-xl border bg-card/40 p-4 md:sticky md:top-20 self-start space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Filters</span>
                  {hasFilters && <button onClick={() => { setQ(""); setCats([]); setDiffs([]); setRoles([]); }} className="text-[10px] text-muted-foreground hover:text-foreground underline">Clear</button>}
                </div>
                <Group label="Category">{CATEGORIES.map(c => <CheckRow key={c} label={c} checked={cats.includes(c)} onChange={() => setCats(p => toggleIn(p, c))} />)}</Group>
                <Group label="Difficulty">{DIFFICULTIES.map(d => <CheckRow key={d} label={d} checked={diffs.includes(d)} onChange={() => setDiffs(p => toggleIn(p, d))} />)}</Group>
                <Group label="Experience">{ROLES.map(r => <CheckRow key={r} label={r} checked={roles.includes(r)} onChange={() => setRoles(p => toggleIn(p, r))} />)}</Group>
              </aside>
              <div className="min-w-0">
                {filtered.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">No interviews match these filters.</div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filtered.map(i => (
                      <div key={i.slug} className="rounded-xl border bg-card p-4 hover:border-primary/40 transition">
                        <Link to="/mock-interview/$slug" params={{ slug: i.slug }} className="flex items-start gap-2.5 min-w-0">
                          <div className="text-xl">{i.icon}</div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{i.name}</div>
                            <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{i.description}</div>
                          </div>
                        </Link>
                        <div className="mt-3 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2"><DiffBadge value={i.difficulty} /><span className="text-muted-foreground">{i.role} · {i.minutes}m</span></div>
                          <AddBtn on={enrolled.includes(i.slug)} onClick={() => toggle(i.slug)} />
                        </div>
                      </div>
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

function Meta({ i }: { i: Interview }) {
  return (
    <div className="mt-4 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5"><DiffBadge value={i.difficulty} /><span className="rounded-md border px-1.5 py-0.5 text-[10px]">{i.role}</span></div>
      <span className="text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />{i.minutes}m · {i.questions} Qs</span>
    </div>
  );
}

function MineCard({ i }: { i: Interview }) {
  const pct = Math.min(100, i.completed * 34);
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-5 hover:border-primary/50 transition">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `var(--${i.color})` }} />
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-2xl">{i.icon}</div>
          <h3 className="mt-2 font-semibold truncate">{i.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{i.description}</p>
        </div>
        <ProgressRing value={pct} color="#f7931e" />
      </div>
      <Meta i={i} />
      <Link to="/mock-interview/$slug" params={{ slug: i.slug }} className="mt-4 w-full inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
        {i.completed > 0 ? "Retake interview" : "Start interview"} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function AddBtn({ on, onClick, full }: { on: boolean; onClick: () => void; full?: boolean }) {
  return (
    <button onClick={onClick}
      className={`${full ? "w-full py-1.5 text-xs" : "px-2 py-1"} inline-flex items-center justify-center gap-1 rounded-md font-medium transition ${on ? "border border-success/40 bg-success/10 text-success" : "bg-primary text-primary-foreground hover:opacity-90"} ${full ? "" : "px-2"}`}>
      {on ? <><Check className="h-3 w-3" /> Added</> : <><Plus className="h-3 w-3" /> Add</>}
    </button>
  );
}

function HScroll({ children }: { children: React.ReactNode }) {
  return <div className="-mx-4 px-4 overflow-x-auto scrollbar-thin"><div className="flex gap-4 pb-2">{children}</div></div>;
}
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{label}</div><div className="space-y-1.5">{children}</div></div>;
}
function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-xs cursor-pointer hover:text-foreground text-muted-foreground select-none">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-3.5 w-3.5 accent-primary rounded border-border" />
      <span className={checked ? "text-foreground" : ""}>{label}</span>
    </label>
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
