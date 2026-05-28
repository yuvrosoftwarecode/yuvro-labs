import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { CollabSidebar } from "@/components/CollabSidebar";

export const Route = createFileRoute("/collaboration")({ component: CollaborationLayout });

function CollaborationLayout() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="flex">
        <CollabSidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
