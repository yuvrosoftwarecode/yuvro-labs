import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { EDITORS, LANGUAGES, newSprint, newTask, type EditorKind, type LabSprint, type LabTask, type Language } from "@/lib/labSprints";

export function SprintBuilder({ sprints, setSprints }: { sprints: LabSprint[]; setSprints: (s: LabSprint[]) => void }) {
  const [activeSprint, setActiveSprint] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  const updateSprint = (id: string, patch: Partial<LabSprint>) =>
    setSprints(sprints.map(sp => sp.id === id ? { ...sp, ...patch } : sp));
  const updateTask = (sid: string, tid: string, patch: Partial<LabTask>) =>
    setSprints(sprints.map(sp => sp.id === sid ? { ...sp, tasks: sp.tasks.map(t => t.id === tid ? { ...t, ...patch } : t) } : sp));
  const removeSprint = (id: string) => setSprints(sprints.filter(sp => sp.id !== id));
  const removeTask = (sid: string, tid: string) =>
    setSprints(sprints.map(sp => sp.id === sid ? { ...sp, tasks: sp.tasks.filter(t => t.id !== tid) } : sp));

  const editingSprint = sprints.find(s => s.id === activeSprint) ?? null;
  const editingTask = editingSprint?.tasks.find(t => t.id === activeTask) ?? null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">{sprints.length} sprint{sprints.length === 1 ? "" : "s"} · {sprints.reduce((a, s) => a + s.tasks.length, 0)} tasks</div>
        <button onClick={() => setSprints([...sprints, newSprint()])} className="text-xs px-2 py-1 rounded-md border border-border hover:bg-accent inline-flex items-center gap-1"><Plus className="h-3 w-3" /> Add sprint</button>
      </div>

      {sprints.length === 0 ? (
        <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-md">
          No sprints yet. Add sprints and configure tasks (editor, language, starter code).
        </div>
      ) : (
        <div className="space-y-4">
          {sprints.map((sp, i) => (
            <div key={sp.id} className="rounded-md border border-border">
              <div className="flex items-center gap-2 p-3 border-b border-border">
                <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                <input value={sp.name} onChange={e => updateSprint(sp.id, { name: e.target.value })} className="flex-1 bg-transparent border border-border rounded-md px-2 py-1 text-sm" />
                <button onClick={() => removeSprint(sp.id)} className="text-xs p-1 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-3 w-3" /></button>
              </div>
              <div className="p-3 space-y-2">
                <textarea rows={2} value={sp.description} onChange={e => updateSprint(sp.id, { description: e.target.value })} placeholder="Sprint goal / description…" className="w-full bg-transparent border border-border rounded-md px-2 py-1 text-xs" />
                <div className="space-y-1">
                  {sp.tasks.map(t => {
                    const isActive = activeSprint === sp.id && activeTask === t.id;
                    return (
                      <div key={t.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-md border ${isActive ? "border-primary bg-primary/5" : "border-border"}`}>
                        <button onClick={() => { setActiveSprint(sp.id); setActiveTask(t.id); }} className="flex-1 text-left text-xs">
                          <span className="font-medium">{t.title}</span>
                          <span className="text-muted-foreground"> · {t.editor === "none" ? "no editor" : `${t.editor}/${t.language}`} · {t.xp} XP</span>
                        </button>
                        <button onClick={() => removeTask(sp.id, t.id)} className="text-xs p-1 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    );
                  })}
                  <button onClick={() => { const t = newTask(); updateSprint(sp.id, { tasks: [...sp.tasks, t] }); setActiveSprint(sp.id); setActiveTask(t.id); }} className="text-xs px-2 py-1 rounded-md border border-dashed border-border hover:bg-accent inline-flex items-center gap-1"><Plus className="h-3 w-3" /> Add task</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTask && editingSprint && (
        <div className="mt-4 rounded-md border border-primary/40 bg-primary/5 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium">Editing task — <span className="text-muted-foreground">{editingSprint.name}</span></div>
            <button onClick={() => { setActiveSprint(null); setActiveTask(null); }} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <Field label="Title"><input value={editingTask.title} onChange={e => updateTask(editingSprint.id, editingTask.id, { title: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-2 py-1.5" /></Field>
            <Field label="Difficulty">
              <select value={editingTask.difficulty} onChange={e => updateTask(editingSprint.id, editingTask.id, { difficulty: e.target.value as LabTask["difficulty"] })} className="w-full bg-transparent border border-border rounded-md px-2 py-1.5">
                {["Beginner", "Intermediate", "Advanced"].map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Editor">
              <select value={editingTask.editor} onChange={e => updateTask(editingSprint.id, editingTask.id, { editor: e.target.value as EditorKind })} className="w-full bg-transparent border border-border rounded-md px-2 py-1.5">
                {EDITORS.map(ed => <option key={ed.value} value={ed.value}>{ed.label}</option>)}
              </select>
            </Field>
            <Field label="Language">
              <select value={editingTask.language} onChange={e => updateTask(editingSprint.id, editingTask.id, { language: e.target.value as Language })} className="w-full bg-transparent border border-border rounded-md px-2 py-1.5">
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="XP"><input type="number" value={editingTask.xp} onChange={e => updateTask(editingSprint.id, editingTask.id, { xp: Number(e.target.value) })} className="w-full bg-transparent border border-border rounded-md px-2 py-1.5" /></Field>
            <Field label="Est. minutes"><input type="number" value={editingTask.estMin} onChange={e => updateTask(editingSprint.id, editingTask.id, { estMin: Number(e.target.value) })} className="w-full bg-transparent border border-border rounded-md px-2 py-1.5" /></Field>
            <Field label="Description" full><textarea rows={2} value={editingTask.description} onChange={e => updateTask(editingSprint.id, editingTask.id, { description: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-2 py-1.5 text-xs" /></Field>
            {editingTask.editor !== "none" && (
              <Field label="Starter code" full><textarea rows={6} value={editingTask.starterCode} onChange={e => updateTask(editingSprint.id, editingTask.id, { starterCode: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-2 py-1.5 font-mono text-xs" /></Field>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="block text-xs text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}
