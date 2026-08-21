import type { GlyphKey } from "@/lib/productMenu";

/* Restrained 16px line glyphs drawn on a shared 16-grid.
   No sparkles, robots, brains or wands — navigation aids only. */
export function ProductGlyph({ name, className = "" }: { name: GlyphKey; className?: string }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} aria-hidden="true">
      {name === "simulation" && (
        <>
          <path {...p} d="M5.5 5 2.5 8l3 3M10.5 5l3 3-3 3" />
          <path {...p} d="M9 3.5 7 12.5" />
        </>
      )}
      {name === "assessment" && (
        <>
          <rect {...p} x="3" y="2.5" width="10" height="11" rx="1.2" />
          <path {...p} d="M5.5 6h5M5.5 8.5h5M5.5 11h3" />
        </>
      )}
      {name === "interview" && (
        <>
          <path {...p} d="M2.5 4.2A1.2 1.2 0 0 1 3.7 3h8.6A1.2 1.2 0 0 1 13.5 4.2v5.1a1.2 1.2 0 0 1-1.2 1.2H6.4L3.6 13V10.5h-.9a.2.2 0 0 1-.2-.2Z" />
          <path {...p} d="M6.2 6.1h3.6M6.2 8.2h2.2" />
        </>
      )}
      {name === "builder" && (
        <>
          <rect {...p} x="2.5" y="2.5" width="4.6" height="4.6" rx="0.8" />
          <rect {...p} x="8.9" y="2.5" width="4.6" height="4.6" rx="0.8" />
          <rect {...p} x="2.5" y="8.9" width="4.6" height="4.6" rx="0.8" />
          <path {...p} d="M11.2 9.4v4.2M9.1 11.5h4.2" />
        </>
      )}
      {name === "skill" && (
        <>
          <path {...p} d="M2.5 13.5V9M6.2 13.5V6.2M9.8 13.5V7.8M13.5 13.5V3.5" />
        </>
      )}
      {name === "intelligence" && (
        <>
          <path {...p} d="M8 2.5v11M2.5 8h11" />
          <circle {...p} cx="8" cy="8" r="5.5" />
        </>
      )}
      {name === "insight" && (
        <>
          <circle {...p} cx="7" cy="7" r="4.2" />
          <path {...p} d="m10.2 10.2 3.3 3.3M7 5v4M5 7h4" />
        </>
      )}
      {name === "compare" && (
        <>
          <rect {...p} x="2.5" y="3" width="4.6" height="10" rx="0.8" />
          <rect {...p} x="8.9" y="3" width="4.6" height="10" rx="0.8" />
          <path {...p} d="M4.8 10.5V6.5M11.2 10.5V8.2" />
        </>
      )}
      {name === "invite" && (
        <>
          <rect {...p} x="2.5" y="3.8" width="11" height="8.4" rx="1.1" />
          <path {...p} d="m2.9 4.6 5.1 4 5.1-4" />
        </>
      )}
      {name === "followup" && (
        <>
          <circle {...p} cx="8" cy="8" r="5.5" />
          <path {...p} d="M8 4.8V8l2.3 1.6" />
        </>
      )}
      {name === "records" && (
        <>
          <path {...p} d="M3 4.2c0-.9 2.2-1.7 5-1.7s5 .8 5 1.7-2.2 1.7-5 1.7-5-.8-5-1.7Z" />
          <path {...p} d="M3 4.2v7.6c0 .9 2.2 1.7 5 1.7s5-.8 5-1.7V4.2M3 8c0 .9 2.2 1.7 5 1.7s5-.8 5-1.7" />
        </>
      )}
      {name === "reports" && (
        <>
          <path {...p} d="M3.5 2.5h6l3 3v8a.5.5 0 0 1-.5.5h-8.5a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5Z" />
          <path {...p} d="M9.3 2.6v3.1h3.1M5.8 11.6V9.2M8 11.6V7.6M10.2 11.6v-1.4" />
        </>
      )}
      {name === "proctor" && (
        <>
          <path {...p} d="M8 2.4 3.3 4v4c0 3 2 4.7 4.7 5.6C10.7 12.7 12.7 11 12.7 8V4Z" />
          <path {...p} d="M6.2 8.1 7.5 9.4l2.6-2.7" />
        </>
      )}
      {name === "evidence" && (
        <>
          <path {...p} d="M2.5 3.6h4.2c.7 0 1.3.6 1.3 1.3v8.1a1 1 0 0 0-1-1H2.5Z" />
          <path {...p} d="M13.5 3.6H9.3c-.7 0-1.3.6-1.3 1.3v8.1a1 1 0 0 1 1-1h4.5Z" />
        </>
      )}
      {name === "analytics" && (
        <>
          <path {...p} d="M2.5 12.6h11" />
          <path {...p} d="m3.4 10 3-3.4 2.5 2.2 3.7-4.5" />
          <path {...p} d="M12.6 4.3h-2.2M12.6 4.3v2.2" />
        </>
      )}
      {name === "review" && (
        <>
          <path {...p} d="M2.6 8.2 5 10.6l3.4-3.9" />
          <path {...p} d="M8.6 4.4h4.8M8.6 11.6h4.8" />
        </>
      )}
    </svg>
  );
}
