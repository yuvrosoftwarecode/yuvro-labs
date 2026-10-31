import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/TopNav";
import LearnerHero from "@/components/LearnerHero";
import UpcomingLabsCarousel from "@/components/UpcomingLabsCarousel";
import { useAuth } from "@/lib/auth";
import { ProgressRing } from "@/components/ProgressRing";
import { labs, type Lab } from "@/lib/dummy";
import { getEnrolled, enroll, unenroll } from "@/lib/enrollment";
import { ArrowRight, Check, Plus, Lock } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Hub });

// Curated set of labs to feature.
const FEATURED_SLUGS = ["javaspring", "systemdesign", "systemdesign-url-shortener", "systemdesign-bookmysystem", "cybersecurity", "pydjango", "postgres", "datastructures", "qa"];

function Hub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState<string[]>([]);

  useEffect(() => { setEnrolled(getEnrolled()); }, []);

  const enrolledLabs = useMemo(() => labs.filter(l => enrolled.includes(l.slug)), [enrolled]);
  const featuredLabs = useMemo(() => FEATURED_SLUGS.map(s => labs.find(l => l.slug === s)).filter(Boolean) as Lab[], []);

  const toggle = (slug: string) => {
    if (enrolled.includes(slug)) { unenroll(slug); setEnrolled(prev => prev.filter(s => s !== slug)); }
    else { enroll(slug); setEnrolled(prev => [...prev, slug]); }
  };


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

          {/* Upcoming labs carousel */}
          <section>
            <UpcomingLabsCarousel onNotify={() => { /* save the user's interest in this lab */ }} />
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
        <Link to="/lab/$slug" params={{ slug: lab.slug }}
          className="inline-flex items-center justify-center rounded-md border px-4 py-1.5 text-xs font-medium hover:bg-accent/50 transition">
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
        <ProgressRing value={pct} color="#f7931e" />
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


