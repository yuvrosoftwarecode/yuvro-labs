import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Check } from "lucide-react";

export const Route = createFileRoute("/book-demo")({
  head: () => ({
    meta: [{ title: "Book a Demo — Yuvro Labs" }],
  }),
  component: BookDemoPage,
});

function BookDemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Check if script is already loaded
    if (document.getElementById("zoho-bookings-script")) {
      // If the script is already loaded but we navigated back, we might need to re-render
      // But Zoho usually clears and injects on call, so just calling it again works.
      if ((window as any).Bookings) {
        // Clear previous content if any
        if (containerRef.current.innerHTML) {
          containerRef.current.innerHTML = "";
        }
        (window as any).Bookings.inlineEmbed({
          url: "https://yuvro.zohobookings.in/portal-embed#/democall",
          parent: "#inline-container",
          height: "700px",
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "zoho-bookings-script";
    script.src = "https://bookings.nimbuspop.com/assets/embed.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).Bookings) {
        (window as any).Bookings.inlineEmbed({
          url: "https://yuvro.zohobookings.in/portal-embed#/democall",
          parent: "#inline-container",
          height: "700px",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8]">
      <SiteNav />

      <main className="flex-1 px-6 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#0A0A0A] sm:text-5xl">
              Book a Yuvro Demo
            </h1>
            <p className="mx-auto mb-4 max-w-2xl text-xl text-[#6B6B6B]">
              See how Yuvro helps companies evaluate engineering ability, conduct AI interviews, and
              hire better.
            </p>
            <p className="mb-8 text-lg font-medium text-[#0A0A0A]">
              30-minute product demonstration
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8 text-[15px] font-medium text-[#0A0A0A]">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#0A0A0A]" strokeWidth={3} /> Live Product Demo
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#0A0A0A]" strokeWidth={3} /> See Yuvro & AI
                Interview
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#0A0A0A]" strokeWidth={3} /> Discuss Your Hiring
                Requirements
              </div>
            </div>
          </div>

          <div className="w-full">
            <div id="inline-container" ref={containerRef} className="w-full h-full min-h-[700px]"></div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
