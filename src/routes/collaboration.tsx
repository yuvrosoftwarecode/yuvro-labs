import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/collaboration")({ component: CollaborationHub });

function CollaborationHub() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="px-6 py-16 max-w-3xl mx-auto text-center">
        <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary mb-4">
          <Sparkles className="h-5 w-5" />
        </div>
        <h1 className="text-3xl font-semibold">Collaboration Hub</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Clean slate. Tell me what you want this to be and I'll build it from scratch.
        </p>
      </main>
    </div>
  );
}
