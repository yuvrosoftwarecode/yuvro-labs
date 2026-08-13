import type { ReactNode } from "react";

export function PageHead({ title, desc, action }: { title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-[13px] text-neutral-500">{desc}</p>
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, desc, right, children }: { title?: string; desc?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--rec-border,rgba(0,0,0,0.08))] bg-white">
      {(title || right) && (
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <div>
            {title && <div className="text-[13px] font-medium">{title}</div>}
            {desc && <div className="text-[11px] text-neutral-500">{desc}</div>}
          </div>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function StatTile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="text-[11px] uppercase tracking-widest text-neutral-500">{label}</div>
      <div className="mt-1 text-[28px] font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-[11px] text-neutral-500">{hint}</div>}
    </div>
  );
}

export function Bar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-neutral-700">{label}</span>
        <span className="text-neutral-500">{value.toLocaleString()}{suffix ?? ""}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
        <div className="h-full rounded-full bg-neutral-900" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[12px]">
        <thead>
          <tr className="bg-neutral-900 text-white">
            {head.map(h => (
              <th key={h} className="whitespace-nowrap px-3 py-2 font-medium first:rounded-l-lg last:rounded-r-lg">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-neutral-800">
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-black/5 last:border-b-0">
              {r.map((c, j) => <td key={j} className="whitespace-nowrap px-3 py-2.5">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <div className="py-10 text-center text-[12px] text-neutral-500">No records yet.</div>}
    </div>
  );
}

export function Pill({ tone = "neutral", children }: { tone?: "green" | "amber" | "red" | "neutral"; children: ReactNode }) {
  const map = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    neutral: "border-black/10 bg-black/[0.03] text-neutral-700",
  } as const;
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${map[tone]}`}>{children}</span>;
}
