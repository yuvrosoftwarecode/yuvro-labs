import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PLAN_LIMITS, TOP_UPS, loadUsage, saveUsage, type UsageState } from "@/lib/planUsage";

export default function PlanUsage() {
  const [state, setState] = useState<UsageState | null>(null);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [purchased, setPurchased] = useState<string | null>(null);

  useEffect(() => { setState(loadUsage()); }, []);
  if (!state) return null;

  const plan = PLAN_LIMITS[state.planId];

  const update = (next: UsageState) => { setState(next); saveUsage(next); };

  const buy = (key: "aiMinutes" | "simulations", amount: number, label: string) => {
    update({ ...state, toppedUp: { ...state.toppedUp, [key]: state.toppedUp[key] + amount } });
    setPurchased(`${label} added to your balance.`);
    setTimeout(() => setPurchased(null), 3000);
  };

  const rows = [
    { label: "Candidate Attempts", used: state.used.attempts, limit: plan.attempts, noun: "candidate attempts", extra: 0 },
    { label: "Simulation Runs", used: state.used.simulations, limit: plan.simulations, noun: "simulation runs", extra: state.toppedUp.simulations },
    { label: "AI Interview Minutes", used: state.used.aiMinutes, limit: plan.aiMinutes, noun: "AI interview minutes", extra: state.toppedUp.aiMinutes },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
        <div>
          <div className="text-[13px] font-medium text-neutral-900">Plan &amp; Usage</div>
          <div className="text-[11px] text-neutral-500">Resets at the start of your next billing cycle.</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-[12px] text-neutral-600">{plan.name} · ${plan.price}/mo</div>
          <button
            onClick={() => setTopUpOpen(true)}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-[12px] font-medium text-neutral-900 transition hover:bg-neutral-50"
          >
            Top Up
          </button>
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {rows.map(r => (
          <UsageRow key={r.label} {...r} onTopUp={() => setTopUpOpen(true)} />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-3">
        <div className="text-[12px] text-neutral-500">
          Recruiter Seats <span className="ml-2 text-neutral-700">{state.used.seats} / {plan.seats} used</span>
        </div>
        <button className="text-[12px] text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline">Manage</button>
      </div>

      {purchased && (
        <div className="border-t border-emerald-200 bg-emerald-50 px-5 py-2 text-[12px] text-emerald-700">{purchased}</div>
      )}

      {topUpOpen && (
        <TopUpModal
          onClose={() => setTopUpOpen(false)}
          onBuy={buy}
          balance={state.toppedUp}
        />
      )}
    </div>
  );
}

function UsageRow({ label, used, limit, noun, extra, onTopUp }: {
  label: string; used: number; limit: number; noun: string; extra: number; onTopUp: () => void;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const remaining = Math.max(0, limit - used);
  const exhausted = remaining === 0;
  const approaching = !exhausted && remaining <= Math.max(5, Math.round(limit * 0.15));
  const bar = exhausted ? "bg-red-400" : approaching ? "bg-amber-400" : "bg-neutral-900";

  return (
    <div className="px-5 py-3.5">
      <div className="flex items-baseline justify-between">
        <div className="text-[13px] text-neutral-800">{label}</div>
        <div className="text-[12px] tabular-nums text-neutral-600">{used.toLocaleString()} / {limit.toLocaleString()}</div>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-100">
        <div className={`h-full rounded-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <div className="text-[11px] text-neutral-500">
          {exhausted
            ? `Monthly ${noun} used.`
            : approaching
              ? `${remaining.toLocaleString()} ${noun} remaining`
              : extra > 0
                ? `+${extra.toLocaleString()} purchased available`
                : ""}
        </div>
        {exhausted && (
          <button onClick={onTopUp} className="rounded-md border border-neutral-300 px-2 py-0.5 text-[11px] text-neutral-800 hover:bg-neutral-50">Top Up</button>
        )}
      </div>
      {!exhausted && extra > 0 && approaching && (
        <div className="mt-1 text-[11px] text-neutral-500">+{extra.toLocaleString()} purchased available</div>
      )}
    </div>
  );
}

function TopUpModal({ onClose, onBuy, balance }: {
  onClose: () => void;
  onBuy: (key: "aiMinutes" | "simulations", amount: number, label: string) => void;
  balance: { aiMinutes: number; simulations: number };
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/30 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <div className="text-[14px] font-medium text-neutral-900">Top Up</div>
            <div className="mt-0.5 text-[11px] text-neutral-500">Purchased top-ups remain available beyond your monthly billing cycle.</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"><X className="h-4 w-4" /></button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {TOP_UPS.map(group => (
            <div key={group.key} className="mb-5 last:mb-0">
              <div className="flex items-baseline justify-between">
                <div className="text-[13px] font-medium text-neutral-900">{group.title}</div>
                <div className="text-[11px] text-neutral-500">Balance: {balance[group.key].toLocaleString()} {group.unit}</div>
              </div>
              <div className="mt-2 divide-y divide-neutral-100 rounded-xl border border-neutral-200">
                {group.options.map(o => (
                  <div key={o.label} className="flex items-center justify-between px-4 py-2.5">
                    <div className="text-[13px] text-neutral-800">{o.label}</div>
                    <div className="flex items-center gap-3">
                      <div className="text-[12px] tabular-nums text-neutral-600">{o.price}</div>
                      <button
                        onClick={() => onBuy(group.key, o.amount, o.label)}
                        className="rounded-md bg-neutral-900 px-3 py-1 text-[12px] font-medium text-white hover:bg-neutral-800"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-1.5 text-[11px] text-neutral-500">{group.note}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 px-5 py-3 text-[11px] text-neutral-500">
          Monthly included usage resets at the next billing cycle. Purchased top-ups are tracked separately and do not expire.
        </div>
      </div>
    </div>
  );
}
