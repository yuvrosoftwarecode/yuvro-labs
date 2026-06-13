// Per-lab sprints & tasks store (localStorage).
export type EditorKind = "code" | "sql" | "none";
export const EDITORS: { value: EditorKind; label: string }[] = [
  { value: "code", label: "Code Editor" },
  { value: "sql", label: "SQL Editor" },
  { value: "none", label: "No Editor (theory / quiz)" },
];

export const LANGUAGES = [
  "python", "javascript", "typescript", "java", "c", "cpp", "csharp",
  "go", "rust", "ruby", "php", "kotlin", "swift", "scala", "html", "css", "sql", "bash",
] as const;
export type Language = (typeof LANGUAGES)[number];

export interface LabTask {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xp: number;
  estMin: number;
  editor: EditorKind;
  language: Language;
  starterCode: string;
}

export interface LabSprint {
  id: string;
  name: string;
  description: string;
  tasks: LabTask[];
}

const KEY = "yuvro-admin-lab-sprints";

type Store = Record<string, LabSprint[]>;

function readAll(): Store {
  if (typeof window === "undefined") return {};
  try { const raw = localStorage.getItem(KEY); return raw ? (JSON.parse(raw) as Store) : {}; } catch { return {}; }
}
function writeAll(store: Store) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {}
}

export function loadSprints(labId: string): LabSprint[] {
  return readAll()[labId] ?? [];
}

export function saveSprints(labId: string, sprints: LabSprint[]) {
  const store = readAll();
  store[labId] = sprints;
  writeAll(store);
}

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function newSprint(): LabSprint {
  return { id: newId("sp"), name: "New Sprint", description: "", tasks: [] };
}

export function newTask(): LabTask {
  return {
    id: newId("tk"),
    title: "New Task",
    description: "",
    difficulty: "Beginner",
    xp: 100,
    estMin: 30,
    editor: "code",
    language: "python",
    starterCode: "# Write your solution here\n",
  };
}
