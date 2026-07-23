import { useEffect, useMemo, useState } from "react";
import {
  Save, Users, User, ListChecks, Upload, ClipboardPaste, Mail, Phone,
  Check, MoreHorizontal, PhoneCall, Send, Pencil, Trash2, Eye, PowerOff,
} from "lucide-react";
import type { Evaluation } from "@/lib/recruiter";

const KEY = (id: string) => `yuvro-followups-${id}`;

type Lang = "English" | "Hindi" | "Spanish" | "French" | "German";
type Voice = "Aria (Female)" | "Ryan (Male)" | "Nova (Female)" | "Atlas (Male)";

interface BulkSetup {
  candidatesRaw: string;
  startDate: string;
  deadline: string;
  timezone: string;
  smart: boolean;
  reminder1: string;
  reminder2: string;
  aiCall: boolean;
  aiTiming: string;
  language: Lang;
  voice: Voice;
}

interface IndividualSetup {
  name: string;
  email: string;
  phone: string;
  startDate: string;
  deadline: string;
  reminder1: string;
  reminder2: string;
  aiCall: boolean;
  aiTiming: string;
}

interface Persisted {
  bulk: BulkSetup;
  individual: IndividualSetup;
}

const BULK_DEFAULT: BulkSetup = {
  candidatesRaw: "",
  startDate: "",
  deadline: "",
  timezone: "Asia/Kolkata",
  smart: true,
  reminder1: "1 Day Before Deadline",
  reminder2: "6 Hours Before Deadline",
  aiCall: false,
  aiTiming: "4 Hours Before Deadline",
  language: "English",
  voice: "Aria (Female)",
};

const IND_DEFAULT: IndividualSetup = {
  name: "",
  email: "",
  phone: "",
  startDate: "",
  deadline: "",
  reminder1: "1 Day Before Deadline",
  reminder2: "6 Hours Before Deadline",
  aiCall: false,
  aiTiming: "4 Hours Before Deadline",
};

const DEFAULTS: Persisted = { bulk: BULK_DEFAULT, individual: IND_DEFAULT };

type RecordRow = {
  id: string;
  name: string;
  email: string;
  deadline: string;
  followups: boolean;
  aiCall: boolean;
  emailsSent: number;
  submitted: boolean;
  status: "Completed" | "Pending" | "Overdue";
};

const SEED_RECORDS: RecordRow[] = [
  { id: "r1", name: "John", email: "john@email.com", deadline: "30 Jul", followups: true, aiCall: true, emailsSent: 2, submitted: true, status: "Completed" },
  { id: "r2", name: "Mary", email: "mary@email.com", deadline: "30 Jul", followups: true, aiCall: true, emailsSent: 1, submitted: false, status: "Pending" },
  { id: "r3", name: "David", email: "david@email.com", deadline: "28 Jul", followups: true, aiCall: false, emailsSent: 2, submitted: false, status: "Overdue" },
];

export function FollowUpsTab({ ev, notify }: { ev: Evaluation; notify: (m: string) => void }) {
  const [data, setData] = useState<Persisted>(DEFAULTS);
  const [dirty, setDirty] = useState(false);
  const [records, setRecords] = useState<RecordRow[]>(SEED_RECORDS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY(ev.id));
      if (raw) setData({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setDirty(false);
  }, [ev.id]);

  const updateBulk = <K extends keyof BulkSetup>(k: K, v: BulkSetup[K]) => {
    setData((p) => ({ ...p, bulk: { ...p.bulk, [k]: v } }));
    setDirty(true);
  };
  const updateInd = <K extends keyof IndividualSetup>(k: K, v: IndividualSetup[K]) => {
    setData((p) => ({ ...p, individual: { ...p.individual, [k]: v } }));
    setDirty(true);
  };

  const save = () => {
    try { localStorage.setItem(KEY(ev.id), JSON.stringify(data)); } catch {}
    setDirty(false);
    notify("Follow-up settings saved");
  };
  const reset = () => { setData(DEFAULTS); setDirty(true); notify("Reset to defaults"); };

  const summary = useMemo(() => {
    const total = records.length;
    const submitted = records.filter((r) => r.submitted).length;
    const pending = total - submitted;
    const emails = records.reduce((n, r) => n + r.emailsSent, 0);
    const aiCalls = records.filter((r) => r.aiCall).length;
    return { total, emails, submitted, pending, aiCalls };
  }, [records]);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="text-[11px] uppercase tracking-widest text-neutral-500">Follow-ups</div>
        <nav className="mt-3 flex flex-col gap-0.5 text-[12px]">
          {[
            ["bulk", "Bulk Follow-up Setup"],
            ["individual", "Individual Follow-up Setup"],
            ["records", "Follow-up Records"],
          ].map(([id, label]) => (
            <a key={id} href={`#f-${id}`} className="rounded-md px-2 py-1.5 text-neutral-400 hover:bg-white/5 hover:text-white">{label}</a>
          ))}
        </nav>
      </aside>

      <div className="space-y-8">
        <Group id="bulk" title="Bulk Follow-up Setup" icon={<Users className="h-3.5 w-3.5" />}
          desc="Upload candidate details, configure reminder schedules and automatically send follow-up emails and optional AI phone calls.">
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-widest text-neutral-500">Candidate list</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => notify("Upload CSV opened")} className={btnGhost}><Upload className="h-3.5 w-3.5" /> Upload CSV</button>
              <button onClick={() => notify("Paste dialog opened")} className={btnGhost}><ClipboardPaste className="h-3.5 w-3.5" /> Paste from Excel</button>
              <button onClick={() => notify("Manual entry")} className={btnGhost}><Mail className="h-3.5 w-3.5" /> Add Emails Manually</button>
            </div>
            <Field label="Candidates (Name, Email, Phone — one per line)">
              <textarea rows={4} value={data.bulk.candidatesRaw} onChange={(e) => updateBulk("candidatesRaw", e.target.value)}
                placeholder="Jane Doe, jane@company.com, +91 90000 00000" className={`${inp} font-mono text-[12px]`} />
            </Field>
            <div className="text-[11px] text-neutral-500">Phone numbers are required only for AI phone calls.</div>
          </div>

          <Divider label="Assessment schedule" />
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Start date"><input type="datetime-local" value={data.bulk.startDate} onChange={(e) => updateBulk("startDate", e.target.value)} className={inp} /></Field>
            <Field label="Deadline"><input type="datetime-local" value={data.bulk.deadline} onChange={(e) => updateBulk("deadline", e.target.value)} className={inp} /></Field>
            <Field label="Timezone">
              <select value={data.bulk.timezone} onChange={(e) => updateBulk("timezone", e.target.value)} className={inp}>
                {["Asia/Kolkata", "America/Los_Angeles", "America/New_York", "Europe/London", "Asia/Singapore", "UTC"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <Divider label="Reminder settings" />
          <Toggle label="Enable smart follow-ups" desc="Automatically send reminders based on candidate activity." value={data.bulk.smart} onChange={(v) => updateBulk("smart", v)} />
          <Field label="Reminder email 1">
            <input value={data.bulk.reminder1} onChange={(e) => updateBulk("reminder1", e.target.value)} className={inp} />
          </Field>
          <Field label="Reminder email 2">
            <input value={data.bulk.reminder2} onChange={(e) => updateBulk("reminder2", e.target.value)} className={inp} />
          </Field>

          <Divider label="Final reminder" />
          <label className="flex items-start gap-2 text-[13px] text-white">
            <input type="checkbox" checked={data.bulk.aiCall} onChange={(e) => updateBulk("aiCall", e.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-emerald-400" />
            <span>
              Enable AI phone call
              <span className="mt-0.5 block text-[11px] text-neutral-500">Automatically call candidates who haven't submitted before deadline.</span>
            </span>
          </label>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Default timing"><input value={data.bulk.aiTiming} onChange={(e) => updateBulk("aiTiming", e.target.value)} className={inp} disabled={!data.bulk.aiCall} /></Field>
            <Field label="Language">
              <select value={data.bulk.language} onChange={(e) => updateBulk("language", e.target.value as Lang)} className={inp} disabled={!data.bulk.aiCall}>
                {(["English", "Hindi", "Spanish", "French", "German"] as Lang[]).map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Voice">
              <select value={data.bulk.voice} onChange={(e) => updateBulk("voice", e.target.value as Voice)} className={inp} disabled={!data.bulk.aiCall}>
                {(["Aria (Female)", "Ryan (Male)", "Nova (Female)", "Atlas (Male)"] as Voice[]).map((v) => <option key={v}>{v}</option>)}
              </select>
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button onClick={save} className={btnGhost}><Save className="h-3.5 w-3.5" /> Save setup</button>
            <button onClick={() => notify("Follow-ups started for bulk candidates")} className={btnPrimary}><Send className="h-3.5 w-3.5" /> Start follow-ups</button>
          </div>
        </Group>

        <Group id="individual" title="Individual Follow-up Setup" icon={<User className="h-3.5 w-3.5" />}
          desc="Configure reminders for a single candidate.">
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Candidate name"><input value={data.individual.name} onChange={(e) => updateInd("name", e.target.value)} className={inp} /></Field>
            <Field label="Email address"><input value={data.individual.email} onChange={(e) => updateInd("email", e.target.value)} className={inp} /></Field>
            <Field label="Phone number"><input value={data.individual.phone} onChange={(e) => updateInd("phone", e.target.value)} className={inp} /></Field>
            <Field label="Start date"><input type="datetime-local" value={data.individual.startDate} onChange={(e) => updateInd("startDate", e.target.value)} className={inp} /></Field>
            <Field label="Deadline"><input type="datetime-local" value={data.individual.deadline} onChange={(e) => updateInd("deadline", e.target.value)} className={inp} /></Field>
            <div />
            <Field label="Reminder email 1"><input value={data.individual.reminder1} onChange={(e) => updateInd("reminder1", e.target.value)} className={inp} /></Field>
            <Field label="Reminder email 2"><input value={data.individual.reminder2} onChange={(e) => updateInd("reminder2", e.target.value)} className={inp} /></Field>
          </div>

          <label className="flex items-start gap-2 text-[13px] text-white">
            <input type="checkbox" checked={data.individual.aiCall} onChange={(e) => updateInd("aiCall", e.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-emerald-400" />
            <span>Enable AI phone call</span>
          </label>
          <Field label="Timing"><input value={data.individual.aiTiming} onChange={(e) => updateInd("aiTiming", e.target.value)} className={`${inp} md:max-w-xs`} disabled={!data.individual.aiCall} /></Field>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button onClick={() => { notify("Candidate added"); setDirty(true); }} className={btnGhost}><User className="h-3.5 w-3.5" /> Add candidate</button>
            <button onClick={() => notify("Follow-up started")} className={btnPrimary}><Send className="h-3.5 w-3.5" /> Start follow-up</button>
          </div>
        </Group>

        <Group id="records" title="Follow-up Records" icon={<ListChecks className="h-3.5 w-3.5" />}
          desc="Monitor reminder activity and assessment completion.">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Stat label="Total candidates" value={summary.total} />
            <Stat label="Follow-up emails sent" value={summary.emails} />
            <Stat label="Submitted" value={summary.submitted} />
            <Stat label="Pending submission" value={summary.pending} />
            <Stat label="AI calls completed" value={summary.aiCalls} />
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-white/[0.03] text-left text-[11px] uppercase tracking-widest text-neutral-500">
                  <Th>Candidate</Th><Th>Email</Th><Th>Deadline</Th><Th>Follow-ups</Th>
                  <Th>AI Call</Th><Th>Emails</Th><Th>Submitted</Th><Th>Status</Th><Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <RecordRowView key={r.id} row={r} notify={notify}
                    onRemove={() => setRecords((rs) => rs.filter((x) => x.id !== r.id))}
                    onToggleFollowups={() => setRecords((rs) => rs.map((x) => x.id === r.id ? { ...x, followups: !x.followups } : x))}
                  />
                ))}
                {records.length === 0 && (
                  <tr><td colSpan={9} className="px-3 py-8 text-center text-[12px] text-neutral-500">No candidates yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Group>

        {/* Sticky save bar */}
        <div className={`sticky bottom-4 z-30 flex items-center justify-between rounded-xl border border-white/10 bg-neutral-950/95 px-4 py-3 backdrop-blur transition ${dirty ? "opacity-100" : "opacity-60"}`}>
          <div className="text-[12px] text-neutral-400">
            {dirty ? <span className="text-amber-300">You have unsaved changes</span> : <span className="inline-flex items-center gap-1.5 text-emerald-300"><Check className="h-3.5 w-3.5" /> All changes saved</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="rounded-md border border-white/10 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/5">Reset to defaults</button>
            <button onClick={save} disabled={!dirty} className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[12px] font-medium text-black transition hover:bg-white/90 disabled:opacity-40">
              <Save className="h-3.5 w-3.5" /> Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-white outline-none focus:border-white/25 disabled:opacity-50";
const btnGhost = "inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[12px] text-neutral-200 hover:bg-white/5";
const btnPrimary = "inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[12px] font-medium text-black hover:bg-white/90";

function Group({ id, title, icon, desc, children }: { id: string; title: string; icon?: React.ReactNode; desc?: string; children: React.ReactNode }) {
  return (
    <section id={`f-${id}`} className="scroll-mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 text-[13px] font-medium text-white">{icon}{title}</div>
      {desc && <div className="mt-1 text-[11px] text-neutral-500">{desc}</div>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[11px] uppercase tracking-widest text-neutral-500">{label}</div>
      {children}
    </label>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-[13px] text-white">{label}</div>
        {desc && <div className="text-[11px] text-neutral-500">{desc}</div>}
      </div>
      <button onClick={() => onChange(!value)} className={`relative h-5 w-9 shrink-0 rounded-full transition ${value ? "bg-emerald-400" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${value ? "left-4" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="text-[11px] uppercase tracking-widest text-neutral-500">{label}</div>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="text-[11px] uppercase tracking-widest text-neutral-500">{label}</div>
      <div className="mt-1 text-[20px] font-medium text-white">{value}</div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 font-normal ${className}`}>{children}</th>;
}

function RecordRowView({ row, notify, onRemove, onToggleFollowups }: {
  row: RecordRow; notify: (m: string) => void; onRemove: () => void; onToggleFollowups: () => void;
}) {
  const [open, setOpen] = useState(false);
  const statusTone =
    row.status === "Completed" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
    : row.status === "Overdue" ? "border-red-400/30 bg-red-400/10 text-red-300"
    : "border-amber-400/30 bg-amber-400/10 text-amber-300";
  return (
    <tr className="border-t border-white/5 text-neutral-200">
      <td className="px-3 py-2.5 text-white">{row.name}</td>
      <td className="px-3 py-2.5 text-neutral-400">{row.email}</td>
      <td className="px-3 py-2.5">{row.deadline}</td>
      <td className="px-3 py-2.5">{row.followups ? "Enabled" : "Disabled"}</td>
      <td className="px-3 py-2.5">{row.aiCall ? "Yes" : "No"}</td>
      <td className="px-3 py-2.5">{row.emailsSent}</td>
      <td className="px-3 py-2.5">{row.submitted ? "Yes" : "No"}</td>
      <td className="px-3 py-2.5"><span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusTone}`}>{row.status}</span></td>
      <td className="px-3 py-2.5 text-right">
        <div className="relative inline-block">
          <button onClick={() => setOpen((v) => !v)} className="rounded-md border border-white/10 p-1.5 text-neutral-300 hover:bg-white/5"><MoreHorizontal className="h-3.5 w-3.5" /></button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-lg border border-white/10 bg-neutral-950 text-left shadow-2xl">
                <Item icon={<Eye className="h-3.5 w-3.5" />} onClick={() => { notify("Opening candidate"); setOpen(false); }}>View candidate</Item>
                <Item icon={<Send className="h-3.5 w-3.5" />} onClick={() => { notify("Reminder sent"); setOpen(false); }}>Send reminder now</Item>
                <Item icon={<PhoneCall className="h-3.5 w-3.5" />} onClick={() => { notify("AI call triggered"); setOpen(false); }}>Trigger AI call</Item>
                <Item icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => { notify("Edit deadline"); setOpen(false); }}>Edit deadline</Item>
                <Item icon={<PowerOff className="h-3.5 w-3.5" />} onClick={() => { onToggleFollowups(); setOpen(false); }}>{row.followups ? "Disable" : "Enable"} follow-ups</Item>
                <div className="h-px bg-white/5" />
                <Item icon={<Trash2 className="h-3.5 w-3.5" />} danger onClick={() => { onRemove(); setOpen(false); notify("Candidate removed"); }}>Remove candidate</Item>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function Item({ icon, children, onClick, danger }: { icon: React.ReactNode; children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2 px-3 py-2 text-[12px] hover:bg-white/5 ${danger ? "text-red-300" : "text-neutral-200"}`}>
      {icon}{children}
    </button>
  );
}
