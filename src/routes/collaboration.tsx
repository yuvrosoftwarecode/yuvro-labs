import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { me } from "@/lib/dummy";
import { Users, ArrowRight, GitPullRequest, MessageCircle, Share2, Star } from "lucide-react";

export const Route = createFileRoute("/collaboration")({ component: CollaborationHub });

function CollaborationHub() {
  const rooms = [
    { id: 1, title: "Java Pair Programming", topic: "OOP Design Patterns", members: 4, active: true },
    { id: 2, title: "React Code Review", topic: "Custom Hooks", members: 3, active: true },
    { id: 3, title: "SQL Sprint Challenge", topic: "Window Functions", members: 6, active: false },
    { id: 4, title: "System Design Whiteboard", topic: "Load Balancing", members: 2, active: true },
  ];

  const friends = [
    { name: "Alex", avatar: "AL", status: "coding", ticket: "JAVA-102" },
    { name: "Sam", avatar: "SM", status: "reviewing", ticket: "REACT-045" },
    { name: "Jordan", avatar: "JO", status: "idle", ticket: null },
  ];

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1400px] px-4 py-10">
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-accent/40 via-card to-background p-8 md:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Users className="h-3 w-3" /> Real-time collaboration
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
              Collaboration <span className="text-primary">Hub</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Pair program, review code, and solve tickets together. Join live rooms or invite teammates to your session.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                <Share2 className="h-4 w-4" /> Start a room
              </button>
              <button className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent">
                <GitPullRequest className="h-4 w-4" /> Join random
              </button>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-xl font-semibold">Live Rooms</h2>
              <span className="text-sm text-muted-foreground">{rooms.filter(r => r.active).length} active now</span>
            </div>
            <div className="grid gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="rounded-xl border bg-card p-5 hover:border-primary/40 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{room.title}</h3>
                        {room.active && <span className="h-2 w-2 rounded-full bg-green-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{room.topic}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {room.members}
                      </span>
                      <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Friend Activity</h2>
            <div className="rounded-xl border bg-card p-5 space-y-4">
              {friends.map((f) => (
                <div key={f.name} className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-semibold">{f.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{f.name}</span>
                      <span className={`h-2 w-2 rounded-full ${f.status === "coding" ? "bg-green-500" : f.status === "reviewing" ? "bg-primary" : "bg-muted-foreground"}`} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {f.status === "coding" && f.ticket ? `Solving ${f.ticket}` : f.status === "reviewing" ? `Reviewing ${f.ticket}` : "Idle"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-3">Team Challenges</h3>
              <div className="space-y-3">
                {[
                  { title: "48h Build-a-thon", entries: 12, ends: "2d" },
                  { title: "Bug Bash Friday", entries: 8, ends: "5d" },
                ].map((c) => (
                  <div key={c.title} className="flex items-center justify-between text-sm">
                    <span>{c.title}</span>
                    <span className="text-xs text-muted-foreground">{c.entries} teams · {c.ends} left</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-primary inline-flex items-center gap-1">
                Browse all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
