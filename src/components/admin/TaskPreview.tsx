import { useEffect, useMemo, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import type { LabTask } from "@/lib/labSprints";
import { labs as dummyLabs } from "@/lib/dummy";

const PREVIEW_KEY = "__adminPreviewTicket";

function deriveSlug(labName: string): string {
  const lower = labName.toLowerCase();
  // exact name match against dummy labs
  const byName = dummyLabs.find(l => l.name.toLowerCase() === lower);
  if (byName) return byName.slug;
  // partial match
  const partial = dummyLabs.find(l => lower.includes(l.slug) || l.name.toLowerCase().includes(lower.replace(/\s*lab\s*$/, "").trim()));
  if (partial) return partial.slug;
  // fallback: strip " lab" and kebab
  return lower.replace(/\s*lab\s*$/, "").trim().replace(/[^a-z0-9]+/g, "-") || "java";
}

export function TaskPreview({
  task, sprintName, labName, labSlug, onClose,
}: {
  task: LabTask;
  sprintName: string;
  labName: string;
  labSlug?: string;
  onClose?: () => void;
}) {
  const slug = labSlug || deriveSlug(labName);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Persist the current admin ticket so the student route can pick it up as a preview override.
  const payload = useMemo(() => ({
    id: task.id,
    title: task.title,
    description: task.description,
    difficulty: task.difficulty,
    xp: task.xp,
    estMin: task.estMin,
    tag: sprintName,
    starterCode: task.starterCode,
    hints: task.hints ?? "",
    solution: task.solution ?? "",
    editor: task.editor,
    language: task.language,
  }), [task, sprintName]);

  useEffect(() => {
    try { sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(payload)); } catch {}
    // Reload the iframe so it picks up the new payload.
    const el = iframeRef.current;
    if (el) el.src = el.src;
    return () => { try { sessionStorage.removeItem(PREVIEW_KEY); } catch {} };
  }, [payload]);

  // Use the admin task id in the URL; the student route falls back to tickets[0] if unknown.
  const src = `/lab/${slug}/ticket/${encodeURIComponent(task.id)}?preview=1`;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/60">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-primary font-semibold">Admin preview</span>
          <span className="text-muted-foreground">/</span>
          <span>{labName}</span>
          <span className="text-muted-foreground">/</span>
          <span>{sprintName}</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{task.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] px-2 py-1 rounded border border-border hover:bg-accent inline-flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" /> Open in new tab
          </a>
          <button onClick={onClose} className="text-[11px] px-2 py-1 rounded border border-border hover:bg-accent inline-flex items-center gap-1">
            <X className="h-3 w-3" /> Close preview
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-background">
        <iframe
          ref={iframeRef}
          title="Student view preview"
          src={src}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
