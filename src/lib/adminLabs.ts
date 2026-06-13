// Lightweight localStorage-backed store for admin-created labs.
export interface AdminLab {
  id: string;
  name: string;
  cat: string;
  diff: "Easy" | "Medium" | "Hard";
  users: number;
  tickets: number;
  sprints: number;
  comp: number;
  rating: number;
  description?: string;
  duration?: number;
  skills?: string;
  tags?: string;
  createdAt: number;
}

const KEY = "yuvro-admin-labs";

export function loadAdminLabs(): AdminLab[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AdminLab[]) : [];
  } catch {
    return [];
  }
}

export function saveAdminLab(lab: Omit<AdminLab, "id" | "createdAt"> & Partial<Pick<AdminLab, "id" | "createdAt">>): AdminLab {
  const list = loadAdminLabs();
  const entry: AdminLab = {
    id: lab.id ?? `custom-${Date.now().toString(36)}`,
    createdAt: lab.createdAt ?? Date.now(),
    ...lab,
  } as AdminLab;
  list.unshift(entry);
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  return entry;
}

export function deleteAdminLab(id: string) {
  const list = loadAdminLabs().filter(l => l.id !== id);
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}
