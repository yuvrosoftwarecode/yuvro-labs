// Recruiter plan + usage (demo data, localStorage persisted).

export type PlanId = "startup" | "growth" | "scale";

export interface PlanLimits {
  id: PlanId;
  name: string;
  price: number; // per month
  attempts: number;
  simulations: number;
  aiMinutes: number;
  seats: number;
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  startup: { id: "startup", name: "Startup", price: 49, attempts: 50, simulations: 10, aiMinutes: 150, seats: 2 },
  growth: { id: "growth", name: "Growth", price: 149, attempts: 150, simulations: 40, aiMinutes: 600, seats: 5 },
  scale: { id: "scale", name: "Scale", price: 399, attempts: 500, simulations: 100, aiMinutes: 1500, seats: 10 },
};

export interface UsageState {
  planId: PlanId;
  used: { attempts: number; simulations: number; aiMinutes: number; seats: number };
  toppedUp: { aiMinutes: number; simulations: number };
}

const KEY = "yuvro-recruiter-plan-usage-v1";

const DEFAULT_STATE: UsageState = {
  planId: "growth",
  used: { attempts: 87, simulations: 28, aiMinutes: 342, seats: 3 },
  toppedUp: { aiMinutes: 0, simulations: 0 },
};

export function loadUsage(): UsageState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as UsageState;
    return { ...DEFAULT_STATE, ...parsed, used: { ...DEFAULT_STATE.used, ...parsed.used }, toppedUp: { ...DEFAULT_STATE.toppedUp, ...parsed.toppedUp } };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveUsage(s: UsageState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export interface TopUpOption { label: string; amount: number; price: string }

export const TOP_UPS: { key: "aiMinutes" | "simulations"; title: string; unit: string; note: string; options: TopUpOption[] }[] = [
  {
    key: "aiMinutes",
    title: "AI Interview Minutes",
    unit: "minutes",
    note: "Added on top of your monthly included minutes.",
    options: [
      { label: "100 minutes", amount: 100, price: "$20" },
      { label: "500 minutes", amount: 500, price: "$79" },
      { label: "1,500 minutes", amount: 1500, price: "$199" },
    ],
  },
  {
    key: "simulations",
    title: "Engineering Simulation Runs",
    unit: "runs",
    note: "Added on top of your monthly included runs.",
    options: [
      { label: "10 runs", amount: 10, price: "$25" },
      { label: "50 runs", amount: 50, price: "$99" },
      { label: "200 runs", amount: 200, price: "$299" },
    ],
  },
];
