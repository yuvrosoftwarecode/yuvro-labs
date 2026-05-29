import { createFileRoute, Link } from "@tanstack/react-router";
import { findSquad, findEngineer, engineers } from "@/lib/collab";
import { ThumbsUp, ThumbsDown, Lightbulb, Star, MessageSquare } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/collaboration/retro/$id")({ component: Retro });

function Retro() {
  const { id } = Route.useParams();
  const squad = findSquad(id) ?? { id, name: "Sprint", members: ["e1", "e2", "e4"], objective: "" } as any;
  const team = (squad.members ?? []).map(findEngineer).filter(Boolean) as ReturnType<typeof findEngineer>[];

  const [tab, setTab] = useState<"board" | "peer" | "summary">("board");

  return (
    <div className="px-6 py-6 max-w-[1300px]">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="text-xs text-muted-foreground">Sprint Retrospective</div>
          <h1 className="text-2xl font-semibold">{squad.name} — Retro</h1>
          <p className="text-sm text-muted-foreground mt-1">Reflect on the sprint, give peer feedback, and lock in learnings.</p>
        </div>
        <Link to="/collaboration/squad/$id" params={{ id }} className="text-xs rounded-md border px-3 py-1.5 hover:bg-accent">Back to squad</Link>
      </div>

      <div className="flex gap-1 border-b mb-5">
        {(["board", "peer", "summary"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm border-b-2 capitalize ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>
            {t === "board" ? "Retro Board" : t === "peer" ? "Peer Feedback" : "AI Sprint Summary"}
          </button>
        ))}
      </div>

      {tab === "board" && (
        <div className="grid md:grid-cols-3 gap-3">
          <RetroCol icon={ThumbsUp} title="What went well" tone="text-success" items={["Reviews under 2h on average", "Clean deploy with zero rollbacks", "Strong daily standups"]} />
          <RetroCol icon={ThumbsDown} title="What didn't" tone="text-destructive" items={["Webhook spec discovered late", "Flaky E2E suite delayed QA", "Unclear ownership on retry queue"]} />
          <RetroCol icon={Lightbulb} title="Action items" tone="text-warning" items={["Add contract test for Stripe webhook", "Quarantine flaky tests in CI", "Assign DRI per epic"]} />
        </div>
      )}

      {tab === "peer" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Rate each teammate on collaboration, reliability and support. Feedback is anonymous in aggregate.</p>
          {team.map(e => e && <PeerCard key={e.id} engineer={e} />)}
        </div>
      )}

      {tab === "summary" && (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold">AI Sprint Summary</h3>
          <p className="text-sm text-muted-foreground">Generated from commits, PRs, chat, incidents and standups.</p>
          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <Stat v="34" l="Story points shipped" />
            <Stat v="12" l="PRs merged" />
            <Stat v="2.1h" l="Avg review time" />
            <Stat v="0" l="Production incidents" />
            <Stat v="92%" l="Test coverage" />
            <Stat v="A" l="Team grade" />
          </div>
          <div className="rounded-lg border bg-background/40 p-4 text-sm space-y-2">
            <p><b>Highlights:</b> Team Velocity shipped checkout v2 on time with zero rollbacks. Backend ownership was strong; QA caught a race condition before production.</p>
            <p><b>Risks:</b> Webhook contract was discovered late, and the E2E suite has 4 flaky tests blocking CI.</p>
            <p><b>Recommended next sprint:</b> Stabilize CI, contract-test third-party integrations, and rotate the on-call to spread incident exposure.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function RetroCol({ icon: Icon, title, items, tone }: any) {
  const [draft, setDraft] = useState("");
  return (
    <div className="rounded-xl border bg-card">
      <div className="p-3 border-b flex items-center gap-2 font-medium text-sm"><Icon className={`h-4 w-4 ${tone}`} /> {title}</div>
      <div className="p-3 space-y-2">
        {items.map((i: string, idx: number) => <div key={idx} className="rounded-md border bg-background/40 p-2 text-sm">{i}</div>)}
        <div className="flex gap-1">
          <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add note…" className="flex-1 rounded-md border bg-background px-2 py-1.5 text-xs" />
          <button onClick={() => setDraft("")} className="text-xs rounded-md bg-primary px-2 text-primary-foreground">Add</button>
        </div>
      </div>
    </div>
  );
}

function PeerCard({ engineer }: { engineer: NonNullable<ReturnType<typeof engineers.find>> }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-xs font-semibold">{engineer.avatar}</div>
        <div className="flex-1">
          <p className="font-medium text-sm">{engineer.name}</p>
          <p className="text-xs text-muted-foreground">{engineer.role}</p>
        </div>
        <button className="text-xs rounded-md border px-2 py-1 hover:bg-accent inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Note</button>
      </div>
      <div className="mt-3 grid sm:grid-cols-3 gap-3">
        {["Collaboration", "Reliability", "Support"].map(d => (
          <div key={d}>
            <div className="text-[11px] text-muted-foreground mb-1">{d}</div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(n => <Star key={n} className="h-4 w-4 text-warning" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-lg border bg-background/40 p-3">
      <div className="text-2xl font-semibold">{v}</div>
      <div className="text-[11px] text-muted-foreground">{l}</div>
    </div>
  );
}
