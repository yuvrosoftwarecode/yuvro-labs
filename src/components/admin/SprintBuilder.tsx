import { Plus, Trash2, ArrowRight } from "lucide-react";
import { newSprint, type LabSprint } from "@/lib/labSprints";

export function SprintBuilder({ sprints, setSprints, onConfigureTasks }: {
  sprints: LabSprint[];
  setSprints: (s: LabSprint[]) => void;
  onConfigureTasks?: (sprintId: string) => void;
}) {
  const updateSprint = (id: string, patch: Partial<LabSprint>) =>
    setSprints(sprints.map(sp => sp.id === id ? { ...sp, ...patch } : sp));
  const removeSprint = (id: string) => setSprints(sprints.filter(sp => sp.id !== id));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">{sprints.length} sprint{sprints.length === 1 ? "" : "s"} · {sprints.reduce((a, s) => a + s.tasks.length, 0)} tasks</div>
        <button onClick={() => setSprints([...sprints, newSprint()])} className="text-xs px-2 py-1 rounded-md border border-border hover:bg-accent inline-flex items-center gap-1"><Plus className="h-3 w-3" /> Add sprint</button>
      </div>

      {sprints.length === 0 ? (
        <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-md">
          No sprints yet. Add a sprint with a title and description, then configure its tasks.
        </div>
      ) : (
        <div className="space-y-3">
          {sprints.map((sp, i) => (
            <div key={sp.id} className="rounded-md border border-border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                <input
                  value={sp.name}
                  onChange={e => updateSprint(sp.id, { name: e.target.value })}
                  placeholder="Sprint title"
                  className="flex-1 bg-transparent border border-border rounded-md px-2 py-1 text-sm"
                />
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{sp.tasks.length} task{sp.tasks.length === 1 ? "" : "s"}</span>
                <button onClick={() => removeSprint(sp.id)} className="text-xs p-1 text-destructive hover:bg-destructive/10 rounded" title="Delete sprint"><Trash2 className="h-3 w-3" /></button>
              </div>
              <textarea
                rows={2}
                value={sp.description}
                onChange={e => updateSprint(sp.id, { description: e.target.value })}
                placeholder="Short description / goal of this sprint…"
                className="w-full bg-transparent border border-border rounded-md px-2 py-1 text-xs"
              />
              {onConfigureTasks ? (
                <div className="flex justify-end">
                  <button
                    onClick={() => onConfigureTasks(sp.id)}
                    className="text-xs px-2 py-1 rounded-md border border-border hover:bg-accent inline-flex items-center gap-1"
                  >
                    Configure tasks <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="text-[10px] text-muted-foreground italic">Save the lab first to configure tasks for this sprint.</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
