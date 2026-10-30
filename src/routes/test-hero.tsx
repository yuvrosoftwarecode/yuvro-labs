import { createFileRoute } from "@tanstack/react-router";
import LearnerHero from "@/components/LearnerHero";

export const Route = createFileRoute("/test-hero")({
  component: () => (
    <div className="min-h-screen p-8">
      <LearnerHero userName="Alex" onContinue={() => {}} previewAs={(new URLSearchParams(window.location.search).get("t") as any) ?? undefined} />
    </div>
  ),
});
