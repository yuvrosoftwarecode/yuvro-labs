import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/careers")({
  component: CareersLayout,
});

function CareersLayout() {
  return (
    <div className="min-h-screen flex flex-col text-[#0A0A0A] antialiased selection:bg-[#0A0A0A] selection:text-white bg-[#FAFAF8]">
      <SiteNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
