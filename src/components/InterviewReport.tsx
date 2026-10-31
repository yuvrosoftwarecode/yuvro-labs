import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=DM+Sans:wght@400;500;700&display=swap');
.ir{--page:#f3f5fa;--card:#ffffff;--ink:#14192b;--body:#3f475c;--muted:#6f7890;--soft:#eef2fb;--brand:#4a7bdc;--bar:#e6eaf4;--bad:#c9372c;--bad-bg:#fdeae7;--warn:#9a5b00;--warn-bg:#fdf1d6;--good:#17744d;--good-bg:#e1f4ea;background:var(--page);color:var(--ink);font-family:"DM Sans",system-ui,sans-serif;line-height:1.5;padding:32px 20px 60px}
@media (prefers-color-scheme:dark){.ir{--page:#0b1020;--card:#141b33;--ink:#f1f4fc;--body:#c3cbe0;--muted:#97a2bf;--soft:#1b2546;--bar:#232d4f;--bad:#ff8a7e;--bad-bg:#3a1f26;--warn:#f5c26b;--warn-bg:#3a3017;--good:#6fd9a4;--good-bg:#173528}}
.dark .ir{--page:#0b1020;--card:#141b33;--ink:#f1f4fc;--body:#c3cbe0;--muted:#97a2bf;--soft:#1b2546;--bar:#232d4f;--bad:#ff8a7e;--bad-bg:#3a1f26;--warn:#f5c26b;--warn-bg:#3a3017;--good:#6fd9a4;--good-bg:#173528}
.ir,.ir *{box-sizing:border-box}
:where(.ir) button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:inherit}
.ir :focus-visible{outline:3px solid var(--brand);outline-offset:3px;border-radius:8px}
.ir-wrap{max-width:1080px;margin:0 auto}
.ir-top{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:28px}
.ir-back{font-size:14px;font-weight:600;color:var(--muted);display:inline-block;margin-bottom:10px}
.ir-back:hover{color:var(--ink)}
.ir-h1{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:clamp(28px,4vw,40px);letter-spacing:-.025em;line-height:1.05;margin:0 0 6px;color:var(--ink)}
.ir-meta{margin:0;color:var(--muted);font-size:14.5px}
.ir-acts{display:flex;align-items:center;gap:22px}
.ir-link{font-size:14.5px;font-weight:600;color:var(--muted)}
.ir-link:hover{color:var(--ink)}
.ir-dl{background:var(--brand);color:#fff;font-weight:700;font-size:14.5px;padding:12px 22px;border-radius:12px;transition:transform .15s}
.ir-dl:hover{transform:translateY(-2px)}
.ir-hero{display:grid;grid-template-columns:340px 1fr;gap:20px;margin-bottom:34px}
@media(max-width:860px){.ir-hero{grid-template-columns:1fr}}
.ir-score{border-radius:24px;padding:28px 30px;background:var(--b-bg);color:var(--b-fg);display:flex;flex-direction:column}
.ir-lab{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin:0 0 12px;color:var(--muted)}
.ir-score .ir-lab{color:inherit;margin:0}
.ir-band{font-size:15px;font-weight:700;margin-top:4px}
.ir-big{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:132px;line-height:1;letter-spacing:-.05em;margin:22px 0 4px;display:flex;align-items:baseline;gap:8px}
.ir-big span{font-family:"DM Sans",sans-serif;font-size:20px;font-weight:500;letter-spacing:0;opacity:.7}
.ir-meter{height:8px;border-radius:4px;background:color-mix(in srgb,var(--b-fg) 18%,transparent);overflow:hidden;margin:14px 0}
.ir-meter i{display:block;height:100%;background:var(--b-fg);border-radius:4px;transition:width .8s cubic-bezier(.3,.9,.3,1)}
.ir-score p.ir-pct{margin:0;font-size:15px}
.ir-sum{background:var(--card);border-radius:24px;padding:28px 32px}
.ir-sum>p.ir-text{margin:0 0 22px;color:var(--body);font-size:16px;line-height:1.7}
.ir-two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:620px){.ir-two{grid-template-columns:1fr}}
.ir-two div{border-radius:16px;padding:16px 18px}
.ir-s{background:var(--good-bg);color:var(--good)}
.ir-f{background:var(--warn-bg);color:var(--warn)}
.ir-two b{display:block;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}
.ir-two p{margin:0;font-size:16px;font-weight:500;color:var(--ink);line-height:1.45}
.ir-tabs{display:flex;gap:30px;margin-bottom:22px;flex-wrap:wrap}
.ir-tabs button{font-size:16px;font-weight:600;color:var(--muted);padding:6px 0 10px;position:relative}
.ir-tabs button.on{color:var(--ink)}
.ir-tabs button.on::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:3px;background:var(--brand)}
.ir-tabs button:not(.on):hover{color:var(--ink)}
.ir-sg{display:grid;grid-template-columns:380px 1fr;gap:16px;align-items:start}
.ir-sk{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ir-map{background:var(--card);border-radius:20px;padding:22px 20px 20px}
.ir-map .ir-lab{margin:0 0 6px 4px}
.ir-map svg{display:block;width:100%;height:auto}
.ir-map text{font-family:"DM Sans",system-ui,sans-serif}
.ir-poly{transform-origin:190px 158px;animation:ir-grow .9s cubic-bezier(.3,.9,.3,1)}
@keyframes ir-grow{from{transform:scale(0);opacity:0}}
.ir-mapnote{margin:4px 0 0;font-size:13px;color:var(--muted);text-align:center}
@media(max-width:980px){.ir-sg{grid-template-columns:1fr}.ir-map{max-width:460px}}
@media(max-width:620px){.ir-sk{grid-template-columns:1fr}.ir-map{max-width:none}}
.ir-skill{background:var(--card);border-radius:20px;padding:22px 24px}
.ir-skill .r{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}
.ir-skill h3{margin:0;font-size:17px;font-weight:700;color:var(--ink)}
.ir-skill .n{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:22px}
.ir-skill .n small{font-family:"DM Sans";font-size:13px;color:var(--muted);font-weight:500}
.ir-track{height:6px;border-radius:3px;background:var(--bar);margin-bottom:14px;overflow:hidden}
.ir-track i{display:block;height:100%;border-radius:3px}
.ir-skill p{margin:0 0 12px;font-size:14.5px;color:var(--body);line-height:1.55}
.ir-learn{font-size:14.5px;font-weight:700;color:var(--brand)}
.ir-learn:hover{text-decoration:underline;text-underline-offset:4px}
.ir-qa{background:var(--card);border-radius:20px;margin-bottom:12px;overflow:hidden}
.ir-qh{display:flex;align-items:center;gap:18px;width:100%;padding:20px 24px}
.ir-qh .no{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:22px;color:var(--muted);width:26px}
.ir-qh .t{flex:1}
.ir-qh .t b{display:block;font-size:17px;font-weight:600;color:var(--ink)}
.ir-qh .t span{font-size:13px;color:var(--muted)}
.ir-qh .sc{font-weight:700;font-size:14px;padding:4px 12px;border-radius:999px}
.ir-qh .tg{font-size:13.5px;font-weight:700;color:var(--brand);min-width:90px;text-align:right}
.ir-qb{padding:0 24px 24px 68px}
.ir-qb .ir-lab{margin:18px 0 6px}
.ir-qb p{margin:0;color:var(--body);font-size:15.5px;line-height:1.65}
.ir-qb p.you{background:var(--soft);border-radius:14px;padding:14px 16px}
@media(max-width:620px){.ir-qb{padding-left:24px}.ir-qh .tg{display:none}}
.ir-tr{max-width:740px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
.ir-m{max-width:82%}
.ir-m.me{align-self:flex-end;text-align:right}
.ir-m .w{font-size:12.5px;color:var(--muted);margin-bottom:4px}
.ir-m .b{display:inline-block;text-align:left;padding:14px 18px;border-radius:20px 20px 20px 6px;background:var(--card);color:var(--ink);font-size:16px;line-height:1.55}
.ir-m.me .b{background:var(--brand);color:#fff;border-radius:20px 20px 6px 20px}
.ir-toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,0);background:var(--ink);color:var(--page);padding:11px 18px;border-radius:12px;font-weight:600;font-size:14px;z-index:50}
@media(prefers-reduced-motion:reduce){.ir *{transition:none!important;animation:none!important}}
`;

/* ---------- data shape: map your API response to this ---------- */
export type Report = {
  role: string;            // "Machine Learning Engineer"
  duration: string;        // "0m 11s"
  date: string;            // "30 Oct 2026"
  score: number;           // 0 to 100
  percentile: number;      // "Better than X% of candidates"
  summary: string;
  strength: string;
  focus: string;
  competencies: { name: string; value: number }[]; // value 0 to 10, 3 or more items
  skills: { name: string; score: number; description: string }[]; // score 0 to 10
  questions: { question: string; category: string; score: number; answer: string; missing: string; tip: string }[]; // score 0 to 100
  transcript: { from: "ai" | "me"; text: string; time: string }[];
};

const SAMPLE: Report = {
  role: "Machine Learning Engineer",
  duration: "0m 11s",
  date: "30 Oct 2026",
  score: 5,
  percentile: 72,
  summary:
    "The candidate did not answer the opening question. Instead of giving a professional introduction, they repeated the interviewer’s question back word for word. That points to a gap in interview preparation and communication, and the response gave no information about background, experience or fit for the Machine Learning Engineer role. The candidate would benefit from practising the basics of an interview before taking another one.",
  strength: "Communicated technical concepts clearly.",
  focus: "Practise basic interview answers, starting with a professional self-introduction.",
  competencies: [
    { name: "Technical Proficiency", value: 3 },
    { name: "Communication", value: 2 },
    { name: "Problem Solving", value: 1 },
    { name: "Adaptability", value: 2 },
  ],
  skills: [
    { name: "Active Listening", score: 1, description: "The candidate repeated the interviewer’s words instead of answering the question that was asked." },
    { name: "Self-Presentation", score: 0, description: "No self-introduction was given. A short introduction is the foundation of every interview." },
    { name: "Interview Preparedness", score: 0, description: "The response suggests no preparation. A short, rehearsed introduction would have helped." },
    { name: "Professional Communication", score: 0, description: "No professional communication was shown. The answer did not include background, skills or goals." },
  ],
  questions: [
    {
      question: "Could you please introduce yourself?",
      category: "Behavioral",
      score: 5,
      answer: "Because see I will find your AI interviewer today we’ll be discussing the machine learning engineer role to start could you please introduce yourself",
      missing: "The answer repeated the question. It had no name, background, experience or reason for applying.",
      tip: "Use three short parts: who you are, what you have built, and what you want next. For example: your name, one project you are proud of, and why this role.",
    },
  ],
  transcript: [
    { from: "ai", text: "Hello! I’m your AI interviewer today. We’ll be discussing the Machine Learning Engineer role. To start, could you please introduce yourself?", time: "16:12" },
    { from: "me", text: "Because see I will find your AI interviewer today we’ll be discussing the machine learning engineer role to start could you please introduce yourself", time: "16:12" },
    { from: "ai", text: "May I know who I’m speaking with?", time: "16:12" },
    { from: "me", text: "So that’s for the reference report right I was just trying", time: "16:12" },
    { from: "ai", text: "Sorry, I missed your name. What should I call you?", time: "16:12" },
  ],
};

const band = (s: number) =>
  s < 40
    ? { label: "Needs work", bg: "var(--bad-bg)", fg: "var(--bad)" }
    : s < 70
    ? { label: "Getting there", bg: "var(--warn-bg)", fg: "var(--warn)" }
    : { label: "Strong", bg: "var(--good-bg)", fg: "var(--good)" };

const tone = (n: number) => (n < 4 ? "bad" : n < 7 ? "warn" : "good");

/* ---------- competency map (radar) ---------- */
function Radar({ items }: { items: { name: string; value: number }[] }) {
  const n = items.length, cx = 190, cy = 158, R = 92, st = (2 * Math.PI) / n;
  const ang = (i: number) => -Math.PI / 2 + (i + 0.5) * st;
  const pt = (i: number, f: number) => [cx + Math.cos(ang(i)) * R * f, cy + Math.sin(ang(i)) * R * f];
  const ring = (f: number) => items.map((_, i) => pt(i, f).map((v) => v.toFixed(1)).join(",")).join(" ");
  const data = items.map((c, i) => pt(i, Math.max(c.value, 0.3) / 10));
  return (
    <svg viewBox="0 0 380 300" role="img" aria-label="Competency map">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={ring(f)} fill="none" stroke="var(--bar)" strokeWidth={1.5} />
      ))}
      {items.map((_, i) => {
        const p = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="var(--bar)" strokeWidth={1.5} />;
      })}
      <g className="ir-poly">
        <polygon
          points={data.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}
          fill="var(--brand)" fillOpacity={0.2} stroke="var(--brand)" strokeWidth={2.5} strokeLinejoin="round"
        />
        {data.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={4.5} fill="var(--brand)" />)}
      </g>
      {items.map((c, i) => {
        const p = pt(i, 1.14);
        const up = Math.sin(ang(i)) < 0;
        const y = up ? p[1] - 20 : p[1] + 15;
        return (
          <g key={c.name}>
            <text x={p[0]} y={y} textAnchor="middle" fontSize={13} fill="var(--muted)">{c.name}</text>
            <text x={p[0]} y={y + 17} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--ink)">{c.value} / 10</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- component ---------- */
export default function InterviewReport({
  report = SAMPLE,
  onBack,
  onTryAgain,
  onCopyLink,
  onDownload,
  onLearn,
}: {
  report?: Report;
  onBack?: () => void;
  onTryAgain?: () => void;
  onCopyLink?: () => void;
  onDownload?: () => void;
  onLearn?: (skillName: string) => void;
}) {
  const r = report;
  const b = band(r.score);
  const [tab, setTab] = useState<"skills" | "qs" | "tr">("skills");
  const [open, setOpen] = useState<number | null>(null);
  const [meter, setMeter] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMeter(Math.max(r.score, 2)), 80);
    return () => clearTimeout(t);
  }, [r.score]);

  const say = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1800);
  };
  const copy = () => {
    if (onCopyLink) return onCopyLink();
    navigator.clipboard?.writeText(window.location.href).then(() => say("Link copied"), () => say("Copy not allowed here"));
  };

  const tabs: [typeof tab, string][] = [["skills", "Skills & growth"], ["qs", "Question analysis"], ["tr", "Transcript"]];

  return (
    <div className="ir">
      <style>{CSS}</style>
      <div className="ir-wrap">
        <header className="ir-top">
          <div>
            <button className="ir-back" onClick={onBack}>← Back to interviews</button>
            <h1 className="ir-h1">{r.role}</h1>
            <p className="ir-meta">Interview report · {r.duration} · {r.date}</p>
          </div>
          <div className="ir-acts">
            <button className="ir-link" onClick={onTryAgain}>Try again</button>
            <button className="ir-link" onClick={copy}>Copy link</button>
            <button className="ir-dl" onClick={() => (onDownload ? onDownload() : window.print())}>Download PDF</button>
          </div>
        </header>

        <section className="ir-hero">
          <div className="ir-score" style={{ ["--b-bg" as string]: b.bg, ["--b-fg" as string]: b.fg } as CSSProperties}>
            <p className="ir-lab">Overall score</p>
            <div className="ir-band">{b.label}</div>
            <div className="ir-big">{r.score}<span>/ 100</span></div>
            <div className="ir-meter"><i style={{ width: meter + "%" }} /></div>
            <p className="ir-pct">Better than <b>{r.percentile}%</b> of candidates</p>
          </div>
          <div className="ir-sum">
            <p className="ir-lab">AI summary</p>
            <p className="ir-text">{r.summary}</p>
            <div className="ir-two">
              <div className="ir-s"><b>Top strength</b><p>{r.strength}</p></div>
              <div className="ir-f"><b>Focus next</b><p>{r.focus}</p></div>
            </div>
          </div>
        </section>

        <div className="ir-tabs" role="tablist">
          {tabs.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>
              {label}
            </button>
          ))}
        </div>

        {tab === "skills" && (
          <div className="ir-sg">
            <div className="ir-map">
              <p className="ir-lab">Competency map</p>
              <Radar items={r.competencies} />
              <p className="ir-mapnote">Scored out of 10 for each core area of this role.</p>
            </div>
            <div className="ir-sk">
              {r.skills.map((k) => {
                const t = tone(k.score);
                return (
                  <div className="ir-skill" key={k.name}>
                    <div className="r">
                      <h3>{k.name}</h3>
                      <span className="n" style={{ color: `var(--${t})` }}>{k.score}<small> / 10</small></span>
                    </div>
                    <div className="ir-track"><i style={{ width: Math.max(k.score * 10, 2) + "%", background: `var(--${t})` }} /></div>
                    <p>{k.description}</p>
                    <button className="ir-learn" onClick={() => onLearn?.(k.name)}>Learn {k.name.toLowerCase()} →</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "qs" &&
          r.questions.map((q, i) => {
            const t = band(q.score);
            const isOpen = open === i;
            return (
              <div className="ir-qa" key={i}>
                <button className="ir-qh" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="no">{i + 1}</span>
                  <span className="t"><b>{q.question}</b><span>{q.category}</span></span>
                  <span className="sc" style={{ background: t.bg, color: t.fg }}>{q.score}%</span>
                  <span className="tg">{isOpen ? "Hide" : "Show details"}</span>
                </button>
                {isOpen && (
                  <div className="ir-qb">
                    <p className="ir-lab">Your answer</p>
                    <p className="you">{q.answer}</p>
                    <p className="ir-lab">What was missing</p>
                    <p>{q.missing}</p>
                    <p className="ir-lab">Try this next time</p>
                    <p>{q.tip}</p>
                  </div>
                )}
              </div>
            );
          })}

        {tab === "tr" && (
          <div className="ir-tr">
            {r.transcript.map((m, i) => (
              <div className={"ir-m " + m.from} key={i}>
                <div className="w">{m.from === "ai" ? "Interviewer" : "You"} · {m.time}</div>
                <div className="b">{m.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && <div className="ir-toast" role="status">{toast}</div>}
    </div>
  );
}