import { useMemo, useRef, useState } from "react";
import {
  Plus, X, Check, Upload, FileText, Trash2, Copy, ArrowUp, ArrowDown, Eye, Rocket,
  Search, Pencil, MessageSquare,
} from "lucide-react";
import {
  newUid, SKILL_LIBRARY, INTERVIEW_FOCUS_OPTIONS,
  type DiscussionSection, type Evaluation, type Section, type VitarkaQuestion,
  type VitarkaDifficulty, type VitarkaSource, type VitarkaMode,
} from "@/lib/recruiter";

/* ---------------- small primitives ---------------- */

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-neutral-500">{children}</div>
      {hint && <div className="mt-1 text-[12px] text-neutral-400">{hint}</div>}
    </div>
  );
}

function Pill({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1 text-[12px] transition ${
        active ? "border-amber-400/50 bg-amber-400/10 text-amber-300" : "border-white/10 text-neutral-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function StepCard({ step, title, hint, children }: { step: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/10 font-mono text-[10px] text-neutral-400">{step}</span>
        <div className="min-w-0 flex-1">
          <Label hint={hint}>{title}</Label>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- skill picker ---------------- */

function SkillPicker({ value, onChange, addLabel, suggested }: {
  value: string[]; onChange: (v: string[]) => void; addLabel: string; suggested?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const results = useMemo(
    () => SKILL_LIBRARY.filter(s => s.toLowerCase().includes(q.trim().toLowerCase()) && !value.includes(s)).slice(0, 8),
    [q, value],
  );
  const add = (s: string) => { if (s && !value.includes(s)) onChange([...value, s]); setQ(""); setOpen(false); };
  const pendingSuggestions = (suggested ?? []).filter(s => !value.includes(s));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {value.map(s => (
          <span key={s} className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[12px] text-neutral-200">
            {s}
            <button onClick={() => onChange(value.filter(x => x !== s))} className="text-neutral-500 hover:text-white"><X className="h-3 w-3" /></button>
          </span>
        ))}
        <button onClick={() => setOpen(o => !o)} className="inline-flex items-center gap-1 rounded-md border border-dashed border-white/15 px-2 py-1 text-[12px] text-neutral-400 hover:text-white">
          <Plus className="h-3 w-3" /> {addLabel}
        </button>
      </div>

      {open && (
        <div className="mt-2 rounded-lg border border-white/10 bg-black/40 p-2">
          <div className="flex items-center gap-2 rounded-md border border-white/10 px-2 py-1.5">
            <Search className="h-3.5 w-3.5 text-neutral-500" />
            <input
              autoFocus value={q} onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") add(q.trim()); }}
              placeholder="Search skills…"
              className="flex-1 bg-transparent text-[12px] outline-none"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {results.map(s => (
              <button key={s} onClick={() => add(s)} className="rounded-md border border-white/10 px-2 py-1 text-[12px] text-neutral-300 hover:border-amber-400/40 hover:text-white">{s}</button>
            ))}
            {results.length === 0 && q.trim() && (
              <button onClick={() => add(q.trim())} className="rounded-md border border-white/10 px-2 py-1 text-[12px] text-neutral-300 hover:text-white">Add “{q.trim()}”</button>
            )}
            {results.length === 0 && !q.trim() && <span className="text-[12px] text-neutral-500">All library skills added.</span>}
          </div>
        </div>
      )}

      {pendingSuggestions.length > 0 && (
        <div className="mt-2 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500">Suggested from JD</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {pendingSuggestions.map(s => (
              <button key={s} onClick={() => add(s)} className="inline-flex items-center gap-1 rounded-md border border-amber-400/30 bg-amber-400/5 px-2 py-1 text-[12px] text-amber-300">
                <Plus className="h-3 w-3" /> {s}
              </button>
            ))}
            <button onClick={() => onChange([...value, ...pendingSuggestions])} className="rounded-md px-2 py-1 text-[12px] text-neutral-400 hover:text-white">Accept all</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- JD block ---------------- */

const JD_SUGGESTED_SKILLS = ["Java", "Spring Boot", "REST APIs"];

function JdBlock({ jd, onChange, optional }: {
  jd: DiscussionSection["jd"]; onChange: (jd: DiscussionSection["jd"]) => void; optional?: boolean;
}) {
  const [pasting, setPasting] = useState(false);
  const [draft, setDraft] = useState("");
  const [viewing, setViewing] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (jd) {
    return (
      <div>
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <FileText className="h-4 w-4 text-neutral-400" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] text-white">{jd.kind === "file" ? jd.name : "Pasted job description"}</div>
            <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400"><Check className="h-3 w-3" /> JD added</div>
          </div>
          <button onClick={() => setViewing(v => !v)} className="rounded-md border border-white/10 px-2.5 py-1 text-[12px] text-neutral-300 hover:bg-white/5">{viewing ? "Hide" : "View"}</button>
          <button onClick={() => { onChange(null); setDraft(""); }} className="rounded-md border border-white/10 px-2.5 py-1 text-[12px] text-neutral-300 hover:bg-white/5">Replace</button>
        </div>
        {viewing && (
          <textarea
            value={jd.text ?? ""} rows={7}
            onChange={e => onChange({ ...jd, text: e.target.value })}
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-[12px] leading-relaxed outline-none"
          />
        )}
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-white/5 bg-black/20 p-3 text-[12px] sm:grid-cols-4">
          <div><div className="text-[10px] uppercase tracking-widest text-neutral-500">Role</div><div className="text-neutral-200">Senior Backend Engineer</div></div>
          <div><div className="text-[10px] uppercase tracking-widest text-neutral-500">Experience</div><div className="text-neutral-200">5–8 years</div></div>
          <div><div className="text-[10px] uppercase tracking-widest text-neutral-500">Responsibilities</div><div className="text-neutral-200">Service design · On-call</div></div>
          <div><div className="text-[10px] uppercase tracking-widest text-neutral-500">Requirements</div><div className="text-neutral-200">Java · Spring Boot · REST</div></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) onChange({ kind: "file", name: f.name, text: `Role: Senior Backend Engineer\nExperience: 5–8 years\n\nResponsibilities:\n• Design and operate high-volume payment services\n• Own service reliability and on-call\n\nRequirements:\n• Java, Spring Boot, REST APIs\n• SQL, Docker, AWS exposure` });
            e.target.value = "";
          }}
        />
        <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/5"><Upload className="h-3.5 w-3.5" /> Upload JD</button>
        <button onClick={() => setPasting(p => !p)} className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/5"><Pencil className="h-3.5 w-3.5" /> Paste JD</button>
        {optional && <span className="text-[11px] text-neutral-500">Optional</span>}
      </div>
      {pasting && (
        <div className="mt-2">
          <textarea
            autoFocus rows={7} value={draft} onChange={e => setDraft(e.target.value)}
            placeholder="Paste the job description here…"
            className="w-full rounded-lg border border-white/10 bg-black/30 p-3 text-[12px] leading-relaxed outline-none"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => { if (draft.trim()) { onChange({ kind: "text", text: draft.trim() }); setPasting(false); } }}
              className="rounded-md bg-white/10 px-3 py-1.5 text-[12px] text-white hover:bg-white/15"
            >Save JD</button>
            <button onClick={() => { setPasting(false); setDraft(""); }} className="rounded-md px-3 py-1.5 text-[12px] text-neutral-400 hover:text-white">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- question generation (dummy) ---------------- */

const INDEPENDENT_TEMPLATES: { text: (s: string) => string; focus: string; minutes: number }[] = [
  { text: s => `How would you design a REST API for a high-volume payment system using ${s}?`, focus: "System Design", minutes: 4 },
  { text: s => `How would you diagnose a slow ${s} service in production?`, focus: "Debugging", minutes: 3 },
  { text: s => `How would you handle transaction consistency in a payment workflow with ${s}?`, focus: "Problem Solving", minutes: 4 },
  { text: s => `Walk me through a trade-off you have made while working with ${s}.`, focus: "Practical Engineering", minutes: 3 },
  { text: s => `What are the failure modes you watch for when running ${s} at scale?`, focus: "Technical Knowledge", minutes: 3 },
];

function generateIndependent(sec: DiscussionSection): VitarkaQuestion[] {
  const skills = [...(sec.primarySkills ?? []), ...(sec.secondarySkills ?? [])];
  const pool = skills.length ? skills : ["Backend Engineering"];
  const count = Math.max(3, Math.min(8, Math.round((sec.duration || 15) / 3)));
  const out: VitarkaQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const skill = pool[i % pool.length];
    const t = INDEPENDENT_TEMPLATES[i % INDEPENDENT_TEMPLATES.length];
    out.push({
      id: newUid(),
      text: t.text(skill),
      skill,
      focus: (sec.focus && sec.focus.length ? sec.focus[i % sec.focus.length] : t.focus),
      minutes: t.minutes,
      source: sec.jd ? "Job Description" : "Skill",
    });
  }
  if (sec.mode !== "Automatic") {
    (sec.questions ?? []).forEach(q =>
      out.unshift({ id: newUid(), text: q, skill: "Recruiter question", focus: "Recruiter defined", minutes: 3, source: "Recruiter" }));
  }
  return out;
}

function generateCombined(sec: DiscussionSection, evidence: { labs: boolean; assessment: boolean; coding: boolean }): VitarkaQuestion[] {
  const out: VitarkaQuestion[] = [];
  if (evidence.labs) {
    out.push({ id: newUid(), text: "You changed the authentication logic during the lab. Walk me through what issue you identified and why you chose that approach.", skill: "API Authentication", focus: "Debugging", minutes: 4, source: "Engineering Lab" });
    out.push({ id: newUid(), text: "Your SQL fix reduced query time but changed the execution plan. How would you validate this change before production?", skill: "SQL Optimization", focus: "Practical Engineering", minutes: 4, source: "Engineering Lab" });
  }
  if (evidence.assessment) {
    out.push({ id: newUid(), text: "You selected the correct indexing concept but your answer suggested a different optimization strategy. How would you investigate this in a production system?", skill: "Database", focus: "Problem Solving", minutes: 4, source: "Assessment" });
  }
  if (evidence.coding) {
    out.push({ id: newUid(), text: "Your solution works, but the complexity can be improved. Walk me through how you would optimize it.", skill: "Data Structures", focus: "Problem Solving", minutes: 4, source: "Coding" });
  }
  out.push({ id: newUid(), text: "During the evaluation you chose a retry-based approach over idempotency keys. What trade-offs did you consider?", skill: "Backend Design", focus: "Architecture", minutes: 4, source: "Candidate Decision" });
  if (sec.jd) {
    out.push({ id: newUid(), text: "The role owns high-volume payment services. How does your evaluation approach translate to that scale?", skill: "System Design", focus: "System Design", minutes: 4, source: "Job Description" });
  }
  if (sec.mode !== "Automatic") {
    (sec.questions ?? []).forEach(q =>
      out.unshift({ id: newUid(), text: q, skill: "Recruiter question", focus: "Recruiter defined", minutes: 3, source: "Recruiter" }));
  }
  return out;
}

/* ---------------- review list ---------------- */

function ReviewQuestions({ list, onChange }: { list: VitarkaQuestion[]; onChange: (l: VitarkaQuestion[]) => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const [newQ, setNewQ] = useState("");

  const move = (i: number, dir: -1 | 1) => {
    const to = i + dir; if (to < 0 || to >= list.length) return;
    const c = [...list]; const [it] = c.splice(i, 1); c.splice(to, 0, it); onChange(c);
  };

  return (
    <div className="space-y-2">
      {list.map((q, i) => (
        <div key={q.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 font-mono text-[11px] text-neutral-500">{i + 1}</span>
            <div className="min-w-0 flex-1">
              {editing === q.id ? (
                <div>
                  <textarea autoFocus rows={3} value={draft} onChange={e => setDraft(e.target.value)} className="w-full rounded-md border border-white/10 bg-black/30 p-2 text-[13px] outline-none" />
                  <div className="mt-1.5 flex items-center gap-2">
                    <button onClick={() => { onChange(list.map(x => x.id === q.id ? { ...x, text: draft } : x)); setEditing(null); }} className="rounded-md bg-white/10 px-2.5 py-1 text-[12px] text-white hover:bg-white/15">Save</button>
                    <button onClick={() => setEditing(null)} className="px-2 text-[12px] text-neutral-400 hover:text-white">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="text-[13px] leading-relaxed text-white">{q.text}</div>
              )}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
                <span className="rounded border border-white/10 px-1.5 py-0.5">{q.source}</span>
                <span className="rounded border border-white/10 px-1.5 py-0.5">{q.skill}</span>
                <span className="rounded border border-white/10 px-1.5 py-0.5">{q.focus}</span>
                <span>~{q.minutes} min</span>
              </div>
            </div>
            <div className="flex items-center">
              <IconBtn title="Edit" onClick={() => { setEditing(q.id); setDraft(q.text); }}><Pencil className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn title="Duplicate" onClick={() => { const c = [...list]; c.splice(i + 1, 0, { ...q, id: newUid() }); onChange(c); }}><Copy className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn title="Move up" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn title="Move down" onClick={() => move(i, 1)} disabled={i === list.length - 1}><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn title="Delete" onClick={() => onChange(list.filter(x => x.id !== q.id))}><Trash2 className="h-3.5 w-3.5" /></IconBtn>
            </div>
          </div>
        </div>
      ))}

      {adding ? (
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <textarea autoFocus rows={3} value={newQ} onChange={e => setNewQ(e.target.value)} placeholder="Write your question…" className="w-full rounded-md border border-white/10 bg-black/30 p-2 text-[13px] outline-none" />
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => { if (newQ.trim()) { onChange([...list, { id: newUid(), text: newQ.trim(), skill: "Recruiter question", focus: "Recruiter defined", minutes: 3, source: "Recruiter" as VitarkaSource }]); setNewQ(""); setAdding(false); } }}
              className="rounded-md bg-white/10 px-3 py-1.5 text-[12px] text-white hover:bg-white/15"
            >Add question</button>
            <button onClick={() => { setAdding(false); setNewQ(""); }} className="px-2 text-[12px] text-neutral-400 hover:text-white">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-white/15 px-3 py-1.5 text-[12px] text-neutral-400 hover:text-white"><Plus className="h-3.5 w-3.5" /> Add Question</button>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, title, disabled }: { children: React.ReactNode; onClick: () => void; title?: string; disabled?: boolean }) {
  return <button onClick={onClick} title={title} disabled={disabled} className="rounded-md p-1.5 text-neutral-500 transition hover:bg-white/5 hover:text-white disabled:opacity-30">{children}</button>;
}

/* ---------------- preview modal ---------------- */

function PreviewInterview({ sec, onClose }: { sec: DiscussionSection; onClose: () => void }) {
  const list = sec.generated ?? [];
  const [i, setI] = useState(0);
  const q = list[i];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6 backdrop-blur" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-[620px] max-w-full rounded-2xl border border-white/10 bg-neutral-950 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500">Preview interview</div>
            <div className="mt-1 text-[18px] font-semibold text-white">{sec.title}</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-neutral-500 hover:bg-white/5 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-5">
          {q ? (
            <>
              <div className="text-[11px] uppercase tracking-widest text-neutral-500">Question {i + 1} of {list.length}</div>
              <div className="mt-2 text-[15px] leading-relaxed text-white">{q.text}</div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-neutral-500">
                <span className="rounded border border-white/10 px-1.5 py-0.5">{q.source}</span>
                <span className="rounded border border-white/10 px-1.5 py-0.5">{q.skill}</span>
                <span>~{q.minutes} min</span>
              </div>
              {sec.followUps !== false && (
                <div className="mt-4 border-t border-white/5 pt-3 text-[12px] text-neutral-400">
                  Vitarka will ask contextual follow-ups based on the candidate's answer.
                </div>
              )}
            </>
          ) : <div className="text-[13px] text-neutral-400">No questions generated yet.</div>}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => setI(v => Math.max(0, v - 1))} disabled={i === 0} className="rounded-md border border-white/10 px-3 py-1.5 text-[12px] text-neutral-300 disabled:opacity-30">Previous</button>
          <span className="text-[11px] text-neutral-500">{sec.duration} min interview</span>
          <button onClick={() => setI(v => Math.min(list.length - 1, v + 1))} disabled={i >= list.length - 1} className="rounded-md border border-white/10 px-3 py-1.5 text-[12px] text-neutral-300 disabled:opacity-30">Next</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- main ---------------- */

export function VitarkaSection({ section, evaluation, onChange, onPublish }: {
  section: DiscussionSection;
  evaluation: Evaluation;
  onChange: (s: Section) => void;
  onPublish: () => void;
}) {
  const [preview, setPreview] = useState(false);
  const [custom, setCustom] = useState("");

  const set = (patch: Partial<DiscussionSection>) => onChange({ ...section, ...patch } as Section);

  const mode = section.interviewMode ?? null;
  const primary = section.primarySkills ?? [];
  const secondary = section.secondarySkills ?? [];
  const focus = section.focus ?? [];
  const difficulty: VitarkaDifficulty = section.difficulty ?? "Adaptive";
  const generated = section.generated ?? [];

  const labsSection = evaluation.sections.find(s => s.kind === "labs" && s.labs.length > 0);
  const assessSection = evaluation.sections.find(s => s.kind === "assessment" && s.subsections.length > 0);
  const evidence = { labs: !!labsSection, assessment: !!assessSection, coding: false };
  const hasEvidence = evidence.labs || evidence.assessment || evidence.coding;

  const chooseMode = (m: VitarkaMode) => set({ interviewMode: m, generated: [], published: false, followUps: section.followUps ?? true });

  /* ---- mode chooser ---- */
  const ModeChooser = (
    <div>
      <Label hint="Choose how Vitarka should conduct the interview.">Interview mode</Label>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {([
          { k: "independent", t: "Independent Interview", d: "Vitarka interviews on its own using a JD and skills. No labs or assessment required." },
          { k: "combined", t: "Combined with Evaluation", d: "Vitarka reads the candidate's evaluation evidence and interviews on their actual work." },
        ] as const).map(o => (
          <button
            key={o.k} onClick={() => chooseMode(o.k)}
            className={`rounded-xl border p-4 text-left transition ${mode === o.k ? "border-amber-400/50 bg-amber-400/[0.06]" : "border-white/10 hover:bg-white/[0.03]"}`}
          >
            <div className="flex items-center gap-2 text-[13px] font-medium text-white">
              {mode === o.k && <Check className="h-3.5 w-3.5 text-amber-400" />} {o.t}
            </div>
            <div className="mt-1 text-[12px] leading-relaxed text-neutral-500">{o.d}</div>
          </button>
        ))}
      </div>
      {mode === "combined" && !hasEvidence && (
        <div className="mt-2 rounded-lg border border-amber-400/25 bg-amber-400/5 p-3 text-[12px] text-amber-300">
          This evaluation has no labs, assessment or coding yet. Add one, or switch to an Independent Interview.
        </div>
      )}
    </div>
  );

  const QuestionModeBlock = (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {(["Automatic", "Hybrid", "Custom"] as const).map(m => (
          <Pill key={m} active={section.mode === m} onClick={() => set({ mode: m })}>{m}</Pill>
        ))}
      </div>
      <div className="mt-2 text-[12px] text-neutral-500">
        {section.mode === "Automatic" && "Vitarka generates every question from the configured context."}
        {section.mode === "Hybrid" && "Add your own questions — Vitarka generates the rest."}
        {section.mode === "Custom" && "You write the questions. Vitarka still asks contextual follow-ups during the interview."}
      </div>
      {(section.mode === "Hybrid" || section.mode === "Custom") && (
        <div className="mt-3 rounded-lg border border-white/5 bg-black/20 p-3">
          <div className="text-[11px] uppercase tracking-widest text-neutral-500">Recruiter questions</div>
          <ul className="mt-2 space-y-1">
            {section.questions.map((q, i) => (
              <li key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2 py-1.5 text-[12px] text-neutral-300">
                <span className="text-[10px] text-neutral-500">Q{i + 1}</span>
                <span className="flex-1">{q}</span>
                <IconBtn title="Remove" onClick={() => set({ questions: section.questions.filter((_, j) => j !== i) })}><X className="h-3 w-3" /></IconBtn>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center gap-2">
            <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="How would you improve scalability?" className="flex-1 rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-[12px] outline-none" />
            <button onClick={() => { if (custom.trim()) { set({ questions: [...section.questions, custom.trim()] }); setCustom(""); } }} className="rounded-md bg-white/10 px-3 py-1.5 text-[12px] text-white hover:bg-white/15">Add</button>
          </div>
        </div>
      )}
    </div>
  );

  const DurationBlock = (
    <div className="flex flex-wrap items-center gap-2">
      {[10, 15, 20, 30, 45, 60].map(d => <Pill key={d} active={section.duration === d} onClick={() => set({ duration: d })}>{d} min</Pill>)}
    </div>
  );

  const canGenerate = mode === "independent"
    ? (primary.length > 0 || !!section.jd || section.questions.length > 0)
    : hasEvidence;

  const GenerateBlock = (
    <div className="rounded-xl border border-white/5 bg-black/20 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => set({ generated: mode === "independent" ? generateIndependent(section) : generateCombined(section, evidence), published: false })}
          disabled={!canGenerate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-2 text-[12px] font-medium text-white disabled:opacity-40"
        >
          <MessageSquare className="h-3.5 w-3.5" /> {generated.length ? "Regenerate Questions" : "Generate Questions"}
        </button>
        {!canGenerate && (
          <span className="text-[12px] text-neutral-500">
            {mode === "independent" ? "Add a JD or at least one primary skill first." : "Add labs, assessment or coding to this evaluation first."}
          </span>
        )}
        {generated.length > 0 && <span className="text-[12px] text-neutral-500">{generated.length} questions · ~{generated.reduce((a, q) => a + q.minutes, 0)} min</span>}
      </div>
    </div>
  );

  const ReviewBlock = generated.length > 0 && (
    <div className="rounded-xl border border-white/5 bg-black/20 p-4">
      <Label>Review questions</Label>
      <div className="mt-3"><ReviewQuestions list={generated} onChange={l => set({ generated: l, published: false })} /></div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
        <div>
          <div className="text-[12px] text-white">Dynamic Follow-ups</div>
          <div className="text-[11px] text-neutral-500">
            {mode === "combined"
              ? "Follow-ups use labs, assessment, coding, candidate decisions and live responses."
              : "Follow-ups use the JD, skills, interview focus and live responses."}
          </div>
        </div>
        <button
          onClick={() => set({ followUps: section.followUps === false })}
          className={`rounded-md border px-2.5 py-1 text-[12px] ${section.followUps === false ? "border-white/10 text-neutral-400" : "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"}`}
        >{section.followUps === false ? "Disabled" : "Enabled"}</button>
      </div>

      <VitarkaSummary section={section} mode={mode!} evidence={evidence} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setPreview(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[12px] text-neutral-300 hover:bg-white/5"><Eye className="h-3.5 w-3.5" /> Preview Interview</button>
        <button onClick={() => { set({ published: true }); onPublish(); }} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-2 text-[12px] font-medium text-white"><Rocket className="h-3.5 w-3.5" /> Publish</button>
        {section.published && <span className="inline-flex items-center gap-1 text-[12px] text-emerald-400"><Check className="h-3.5 w-3.5" /> Vitarka section ready</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {ModeChooser}

      {mode === "independent" && (
        <>
          <StepCard step={1} title="Job description" hint="Give Vitarka the role context it needs to conduct the interview.">
            <JdBlock jd={section.jd ?? null} onChange={jd => set({ jd })} />
          </StepCard>
          <StepCard step={2} title="Primary skills" hint="Skills Vitarka should prioritize during the interview.">
            <SkillPicker value={primary} onChange={v => set({ primarySkills: v })} addLabel="Add Primary Skill" suggested={section.jd ? JD_SUGGESTED_SKILLS : []} />
          </StepCard>
          <StepCard step={3} title="Secondary skills" hint="Supporting skills Vitarka can explore when relevant.">
            <SkillPicker value={secondary} onChange={v => set({ secondarySkills: v })} addLabel="Add Secondary Skill" />
          </StepCard>
          <StepCard step={4} title="Interview focus" hint="What Vitarka should evaluate. Select as many as you need.">
            <div className="flex flex-wrap gap-1.5">
              {INTERVIEW_FOCUS_OPTIONS.map(f => (
                <Pill key={f} active={focus.includes(f)} onClick={() => set({ focus: focus.includes(f) ? focus.filter(x => x !== f) : [...focus, f] })}>{f}</Pill>
              ))}
            </div>
          </StepCard>
          <StepCard step={5} title="Difficulty" hint="Vitarka adjusts question depth based on the candidate's responses.">
            <div className="flex flex-wrap gap-2">
              {(["Easy", "Medium", "Hard", "Adaptive"] as VitarkaDifficulty[]).map(d => (
                <Pill key={d} active={difficulty === d} onClick={() => set({ difficulty: d })}>{d}</Pill>
              ))}
            </div>
          </StepCard>
          <StepCard step={6} title="Duration">{DurationBlock}</StepCard>
          <StepCard step={7} title="Question mode">{QuestionModeBlock}</StepCard>
          {GenerateBlock}
          {ReviewBlock}
        </>
      )}

      {mode === "combined" && (
        <>
          <div className="rounded-xl border border-white/5 bg-black/20 p-4">
            <Label hint="Vitarka reads this evaluation automatically. Nothing here needs to be configured again.">Evaluation evidence</Label>
            <div className="mt-3 space-y-2">
              <EvidenceRow
                title="Engineering Labs" included={evidence.labs}
                desc="Vitarka can use the candidate's engineering work and decisions to create relevant interview questions."
                items={evidence.labs ? (labsSection as any).labs.map((l: any) => l.title) : []}
              />
              <EvidenceRow
                title="Assessment" included={evidence.assessment}
                desc="Vitarka can use assessment answers and knowledge gaps when creating interview questions."
                items={evidence.assessment ? (assessSection as any).subsections.map((s: any) => s.name) : []}
              />
              <EvidenceRow
                title="Coding" included={evidence.coding}
                desc="Vitarka can use coding performance and problem-solving approach when creating interview questions."
                items={[]}
              />
              <EvidenceRow
                title="Candidate Decisions" included
                desc="Vitarka can use important decisions and approaches taken by candidates during the evaluation."
                items={["Approach selected", "Implementation decisions", "Debugging decisions", "Optimization choices", "Trade-offs"]}
              />
            </div>
          </div>

          <StepCard step={1} title="Job description — optional" hint="Add a JD if you want Vitarka to align the interview more closely with the hiring role.">
            <JdBlock jd={section.jd ?? null} onChange={jd => set({ jd })} optional />
          </StepCard>
          <StepCard step={2} title="Duration">{DurationBlock}</StepCard>
          <StepCard step={3} title="Question mode">{QuestionModeBlock}</StepCard>
          {GenerateBlock}
          {ReviewBlock}
        </>
      )}

      {preview && <PreviewInterview sec={section} onClose={() => setPreview(false)} />}
    </div>
  );
}

function EvidenceRow({ title, included, desc, items }: { title: string; included: boolean; desc: string; items: string[] }) {
  return (
    <div className={`rounded-lg border p-3 ${included ? "border-white/10 bg-white/[0.02]" : "border-white/5 opacity-50"}`}>
      <div className="flex items-center gap-2">
        <span className="text-[12px] uppercase tracking-widest text-neutral-500">{title}</span>
        <span className={`inline-flex items-center gap-1 text-[11px] ${included ? "text-emerald-400" : "text-neutral-500"}`}>
          {included ? <><Check className="h-3 w-3" /> Included</> : "Not in this evaluation"}
        </span>
      </div>
      <div className="mt-1 text-[12px] text-neutral-400">{desc}</div>
      {included && items.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {items.map(i => <span key={i} className="rounded border border-white/10 px-1.5 py-0.5 text-[11px] text-neutral-400">{i}</span>)}
        </div>
      )}
    </div>
  );
}

function VitarkaSummary({ section, mode, evidence }: { section: DiscussionSection; mode: VitarkaMode; evidence: { labs: boolean; assessment: boolean; coding: boolean } }) {
  const rows: [string, string][] = mode === "independent"
    ? [
      ["Mode", "Independent Interview"],
      ["JD", section.jd ? (section.jd.kind === "file" ? section.jd.name ?? "Uploaded" : "Pasted") : "Not added"],
      ["Primary Skills", (section.primarySkills ?? []).join(" · ") || "—"],
      ["Secondary Skills", (section.secondarySkills ?? []).join(" · ") || "—"],
      ["Focus", (section.focus ?? []).join(" · ") || "—"],
      ["Difficulty", section.difficulty ?? "Adaptive"],
      ["Duration", `${section.duration} min`],
      ["Question Mode", section.mode],
      ["Questions", String((section.generated ?? []).length)],
      ["Dynamic Follow-ups", section.followUps === false ? "Disabled" : "Enabled"],
    ]
    : [
      ["Mode", "Combined with Evaluation"],
      ["Evaluation Evidence", [
        evidence.labs ? "Engineering Labs ✓" : null,
        evidence.assessment ? "Assessment ✓" : null,
        evidence.coding ? "Coding ✓" : null,
        "Candidate Decisions ✓",
      ].filter(Boolean).join(" · ")],
      ["JD", section.jd ? "Added" : "Optional / not added"],
      ["Duration", `${section.duration} min`],
      ["Question Mode", section.mode],
      ["Questions", String((section.generated ?? []).length)],
      ["Dynamic Follow-ups", section.followUps === false ? "Disabled" : "Enabled"],
    ];

  return (
    <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-widest text-neutral-500">Vitarka AI — summary</div>
      <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 text-[12px]">
            <span className="text-neutral-500">{k}</span>
            <span className="text-right text-neutral-200">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
