import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import YuvroLogo from "@/assets/YuvroLogo.png";

export const Route = createFileRoute("/yuvrolabs")({
  head: () => ({
    meta: [
      { title: "Yuvro — Built for the next era of development" },
      {
        name: "description",
        content:
          "Yuvro is an AI-powered employability verification and software engineering education platform. Run real simulations, coding assessments and AI interviews.",
      },
      { property: "og:title", content: "Yuvro — Built for the next era of development" },
      {
        property: "og:description",
        content:
          "Choose your side: hire people who can actually do the job, or practise like it's the real thing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const WORDS = ["THE NEXT ERA", "HUMAN + AI", "MODERN", "REAL-WORLD", "AI-FIRST"];

const COMPANY_ROWS = [
  { id: "simulation-labs", t: "Simulation Labs", d: "Test how candidates solve real-world technical problems, with AI follow-up questions to understand their approach." },
  { id: "coding-assessments", t: "Coding Assessments", d: "Evaluate coding skills through structured programming challenges." },
  { id: "ai-mock-interviews", t: "Vitarka AI Interviews", d: "Conduct realistic AI voice interviews with follow-up questions and detailed feedback." },
  { id: "feature-development", t: "Company Feature Development", d: "Let candidates build company-specific features in secure environments." },
  { id: "work-trial", t: "Work Trial", d: "Give candidates a real on-the-job experience through 24–48-hour assignments using your actual codebase, without affecting production systems." },
];

const DEV_ROWS = [
  { id: "practice-simulations", t: "Practice simulations", s: "Fix real tickets, sprint by sprint.", m: "term" as const },
  { id: "mock-interviews", t: "Mock interviews", s: "Talk to an AI interviewer, get a report.", m: "wave" as const },
  { id: "ai-research-papers", t: "AI research papers", s: "See what’s new in AI, explained simply.", m: "doc" as const },
];

const TRIAL_TILES = [
  { b: "Simulation Labs", s: "Watch candidates solve real technical problems" },
  { b: "Coding Assessments", s: "Structured programming challenges" },
  { b: "Vitarka AI Interviews", s: "Voice interviews with smart follow-ups" },
  { b: "Work Trial", s: "Real assignments in a secure environment" },
];

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion:reduce)").matches;

function TermGlyph() {
  return (
    <div className="m term" aria-hidden="true">
      <span className="t1">$ npm test</span>
      <span className="t2">✓ 3 passed</span>
    </div>
  );
}

function WaveGlyph() {
  return (
    <div className="m wave" aria-hidden="true">
      {Array.from({ length: 12 }, (_, k) => (
        <i key={k} style={{ ["--d" as string]: k, ["--h" as string]: `${8 + Math.round(Math.abs(Math.sin(k * 1.1)) * 28)}px` }} />
      ))}
    </div>
  );
}

function DocGlyph() {
  return (
    <div className="m doc" aria-hidden="true">
      <span className="pg" />
      <span className="pf"><i className="t" /><i /><i /><i /><i /></span>
      <b className="sp" />
    </div>
  );
}

const GLYPHS = { term: TermGlyph, wave: WaveGlyph, doc: DocGlyph };

function Landing() {
  const nav = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  /* Real login routes */
  const goCompany = () => nav({ to: "/recruiter-login" });
  const goDeveloper = () => nav({ to: "/auth", search: { tab: "signin" } });

  /* Rotating headline word */
  const [wordIdx, setWordIdx] = useState(0);
  const [wordOut, setWordOut] = useState(false);
  const [wordPre, setWordPre] = useState(false);
  useEffect(() => {
    if (reducedMotion()) return;
    const iv = setInterval(() => {
      setWordOut(true);
      setTimeout(() => {
        setWordIdx((k) => (k + 1) % WORDS.length);
        setWordOut(false);
        setWordPre(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setWordPre(false)));
      }, 300);
    }, 2400);
    return () => clearInterval(iv);
  }, []);

  /* Company rows auto-cycle */
  const [openRow, setOpenRow] = useState(0);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const paused = useRef(false);
  const cycleIdx = useRef(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const iv = setInterval(() => {
      if (paused.current) return;
      cycleIdx.current = (cycleIdx.current + 1) % COMPANY_ROWS.length;
      setOpenRow(cycleIdx.current);
    }, 3200);
    return () => clearInterval(iv);
  }, []);

  const companyCardMouseEnter = () => { paused.current = true; setHoverRow(null); };
  const companyCardMouseLeave = () => { paused.current = false; setHoverRow(null); setOpenRow(cycleIdx.current); };
  const companyCardTouch = () => { paused.current = true; };

  const companyRowClick = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isTouch = window.matchMedia("(hover:none)").matches;
    if (isTouch && openRow !== i) {
      paused.current = true;
      setOpenRow(i);
      return;
    }
    goCompany();
  };

  const shownRow = hoverRow ?? openRow;

  return (
    <div className="yl">
      <style>{CSS}</style>
      <div className="wrap">
        <header className="nav">
          <a className="logo" href="/yuvrolabs" aria-label="Yuvro home" onClick={(e) => { e.preventDefault(); nav({ to: "/yuvrolabs" }); }}>
            <span><img src={YuvroLogo} alt="Yuvro" style={{ height: 30, width: "auto", display: "block" }} /></span>
          </a>
          <nav className="links" aria-label="Main">
            <a href="/lab/systemdesign" onClick={(e) => { e.preventDefault(); nav({ to: "/lab/$slug", params: { slug: "systemdesign" } }); }}>System Design Studio</a>
            <a href="/pricing" onClick={(e) => { e.preventDefault(); nav({ to: "/pricing" }); }}>Pricing</a>
          </nav>
          <button className="demo" onClick={() => nav({ to: "/book-demo" })}>Book a demo</button>
        </header>

        <div className="head">
          <h1 className="hero">
            <span className="l1">Built for</span>
            <span className="w"><span className={`gold${wordOut ? " out" : ""}${wordPre ? " pre" : ""}`}>{WORDS[wordIdx]}</span></span>
            <span className="l3">DEVELOPMENT.</span>
          </h1>
          <p className="sub">Choose your side and log in.</p>
        </div>

        <div className="cards">
          <div className="col">
            <span className="eye">FOR COMPANIES</span>
            <section
              className="big"
              style={{ ["--c" as string]: "#d9480f" }}
              aria-label="For companies"
              onClick={goCompany}
              onMouseEnter={companyCardMouseEnter}
              onMouseLeave={companyCardMouseLeave}
              onTouchStart={companyCardTouch}
            >
              <h2>Hire people who can actually do the job.</h2>
              <ul className="list">
                {COMPANY_ROWS.map((x, i) => (
                  <li
                    key={x.id}
                    className={`row${shownRow === i ? " open" : ""}`}
                    tabIndex={0}
                    style={{ ["--i" as string]: i }}
                    onClick={(e) => companyRowClick(i, e)}
                    onMouseEnter={() => { if (paused.current) setHoverRow(i); }}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); goCompany(); } }}
                  >
                    <div className="rh"><span className="rt"><b>{x.t}</b></span></div>
                    <div className="rd"><div><p>{x.d}</p></div></div>
                  </li>
                ))}
              </ul>
              <button className="go" onClick={(e) => { e.stopPropagation(); goCompany(); }}>Log in as a company</button>
            </section>
          </div>

          <div className="col">
            <span className="eye">FOR DEVELOPERS</span>
            <section className="big" style={{ ["--c" as string]: "#3b6fd4" }} aria-label="For developers" onClick={goDeveloper}>
              <h2>Practise like it’s the real thing.</h2>
              <ul className="list">
                {DEV_ROWS.map((x, i) => {
                  const Glyph = GLYPHS[x.m];
                  return (
                    <li
                      key={x.id}
                      className="row"
                      tabIndex={0}
                      style={{ ["--i" as string]: i }}
                      onClick={(e) => { e.stopPropagation(); goDeveloper(); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); goDeveloper(); } }}
                    >
                      <div className="rh">
                        <span className="rt"><b>{x.t}</b><small>{x.s}</small></span>
                        <Glyph />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <button className="go" onClick={(e) => { e.stopPropagation(); goDeveloper(); }}>Log in as a developer</button>
            </section>
          </div>
        </div>

        <section className="trial" aria-label="Free trial">
          <div className="tl">
            <h3>Don’t take our word for it. <em>See it work.</em></h3>
            <p>Skip the long product tour. Run real simulations, coding assessments and AI interviews with your own hiring team for 14 days, and see how candidates actually perform.</p>
            <button className="tbtn" onClick={() => showToast("Opening the free trial sign-up…")}>Start your free 14-day trial</button>
          </div>
          <ul className="tr">
            {TRIAL_TILES.map((t) => (
              <li key={t.b}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" /><path d="M7 12.5l3.2 3.2L17 9" /></svg>
                <div><b>{t.b}</b><span>{t.s}</span></div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className={`toast${toast ? " show" : ""}`} role="status">{toast}</div>
    </div>
  );
}

/* Ported 1:1 from the reference design; only the font families were swapped to the
   app's own fonts (Inter for body/hero, Fraunces for display headings). */
const CSS = `
.yl{--page:#f8f9fb;--ink:#14192b;--muted:#646d84;--brand:#4a7bdc;
  box-sizing:border-box;min-height:100vh;display:flex;flex-direction:column;
  background:var(--page);color:var(--ink);
  font-family:"Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  line-height:1.5;padding:22px 20px 34px;
  padding-top:calc(22px + env(safe-area-inset-top,0px));padding-bottom:calc(34px + env(safe-area-inset-bottom,0px))}
.dark .yl{--page:#0d1120;--ink:#f1f4fc;--muted:#a1abc4}
.yl *,.yl *::before,.yl *::after{box-sizing:border-box}
.yl button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:inherit}
.yl :focus-visible{outline:3px solid #fff;outline-offset:2px;border-radius:14px}
.yl .wrap{width:100%;max-width:1120px;margin:0 auto;flex:1;display:flex;flex-direction:column}
.yl .nav{display:flex;align-items:center;gap:30px}
.yl .logo{display:flex;text-decoration:none}
.yl .links{display:flex;gap:4px;margin-right:auto}
.yl .links a{position:relative;padding:9px 14px;border-radius:10px;font-weight:600;font-size:15.5px;color:var(--muted);text-decoration:none;transition:color .15s}
.yl .links a::after{content:"";position:absolute;left:14px;right:14px;bottom:0;height:3px;border-radius:3px;background:#f7931e;transform:scaleX(0);transform-origin:left;transition:transform .25s ease}
.yl .links a:hover,.yl .links a:focus-visible{color:var(--ink)}
.yl .links a:hover::after,.yl .links a:focus-visible::after{transform:scaleX(1)}
.yl .demo{background:#f7931e;color:#fff;font-weight:700;font-size:15px;padding:12px 22px;border-radius:12px;transition:transform .15s,box-shadow .15s}
.yl .demo:hover{transform:translateY(-2px);box-shadow:0 8px 0 -3px rgba(247,147,30,.3)}
@media(max-width:700px){.yl .links{display:none}.yl .nav{justify-content:space-between}}
.yl .logo span{display:flex;background:#fff;border-radius:9px;padding:4px 10px;box-shadow:0 1px 0 rgba(0,0,0,.06)}
.yl .head{text-align:center;margin:clamp(56px,9vw,104px) 0 clamp(52px,7vw,84px);animation:yl-fade .6s ease}
@keyframes yl-fade{from{opacity:0;transform:translateY(10px)}}
.yl .sub{margin:0;color:var(--muted);font-size:clamp(17px,1.7vw,20px)}
.yl h1.hero{font-family:"Inter",ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:clamp(40px,6.2vw,76px);line-height:1.06;letter-spacing:-.015em;margin:0 0 22px}
.yl h1.hero>span{display:block}
.yl h1.hero .w{height:1.12em;overflow:hidden}
.yl .gold{display:inline-block;color:#a8782a;transition:opacity .3s ease,transform .3s ease}
.yl .gold.out{opacity:0;transform:translateY(-35%)}
.yl .gold.pre{opacity:0;transform:translateY(35%);transition:none}
.dark .yl .gold{color:#dcc48e}
.yl .cards{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:stretch}
@media(max-width:900px){.yl .cards{grid-template-columns:1fr}}
.yl .big{position:relative;overflow:hidden;border-radius:34px;background:var(--c);color:#fff;padding:34px 30px 30px;min-height:640px;display:flex;flex-direction:column;cursor:pointer;box-shadow:0 14px 28px -18px rgba(0,0,0,.5);transition:transform .45s cubic-bezier(.3,.9,.3,1),box-shadow .45s;animation:yl-rise .75s cubic-bezier(.2,.8,.2,1) backwards}
.yl .col:nth-child(2) .big{animation-delay:.12s}
@keyframes yl-rise{from{opacity:0;transform:translateY(30px) scale(.97)}}
.yl .big:hover{transform:translateY(-6px);box-shadow:0 34px 50px -24px color-mix(in srgb,var(--c) 75%,#000)}
.yl .big>*{position:relative;z-index:1}
.yl .col{display:flex;flex-direction:column;gap:16px}
.yl .col>.big{flex:1}
.yl .eye{font-size:16px;font-weight:700;letter-spacing:.16em;color:var(--muted);padding-left:10px}
.yl .big h2{font-family:"Fraunces","Instrument Serif",Georgia,serif;font-weight:600;font-size:clamp(32px,3.5vw,44px);line-height:1.04;letter-spacing:-.025em;margin:0;max-width:15ch}
.yl .list{list-style:none;margin:20px 0 auto;padding:0;display:grid;gap:4px}
.yl .row{border-radius:18px;padding:13px 16px;cursor:pointer;transition:background .25s;animation:yl-rise .6s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:calc(var(--i) * 80ms + .3s)}
.yl .row:hover,.yl .row.open,.yl .row:focus-visible{background:rgba(255,255,255,.17)}
.yl .rh{display:flex;align-items:center;gap:14px}
.yl .rt{flex:1;min-width:0}
.yl .rt b{display:block;font-family:"Fraunces","Instrument Serif",Georgia,serif;font-weight:600;font-size:clamp(21px,2.1vw,25px);line-height:1.15}
.yl .rt small{display:block;font-size:16px;opacity:.9;margin-top:3px}
.yl .rd{display:grid;grid-template-rows:0fr;transition:grid-template-rows .42s cubic-bezier(.3,.9,.3,1)}
.yl .rd>div{overflow:hidden}
.yl .rd p{margin:8px 0 4px 0;font-size:16.5px;line-height:1.5;opacity:0;transform:translateY(8px);transition:opacity .3s,transform .4s}
.yl .row:hover .rd,.yl .row.open .rd,.yl .row:focus-visible .rd{grid-template-rows:1fr}
.yl .row:hover .rd p,.yl .row.open .rd p,.yl .row:focus-visible .rd p{opacity:.96;transform:none;transition-delay:.12s}
.yl .go{margin-top:24px;align-self:flex-start;display:inline-flex;gap:10px;align-items:center;background:#fff;color:var(--c);font-weight:700;font-size:17.5px;padding:16px 30px;border-radius:14px;box-shadow:0 6px 0 rgba(10,20,60,.28);transition:transform .15s,box-shadow .15s}
.yl .go:hover{transform:translateY(2px);box-shadow:0 4px 0 rgba(10,20,60,.28)}
.yl .go:active{transform:translateY(6px);box-shadow:none}
.yl .m{width:74px;height:40px;display:flex;flex-direction:column;gap:7px;justify-content:center;flex:none}
.yl .m.term{width:86px;height:52px;padding:7px 9px;gap:4px;justify-content:center;background:rgba(10,20,60,.38);border-radius:9px;font:700 10px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#fff}
.yl .term .t1{display:block;white-space:nowrap;overflow:hidden;width:0;border-right:2px solid #fff;animation:yl-ty 4.5s steps(10,end) infinite,yl-bc .8s steps(1) infinite}
.yl .term .t2{display:block;white-space:nowrap;color:#7cf29a;opacity:0;animation:yl-ok 4.5s ease infinite}
@keyframes yl-ty{0%{width:0}26%,92%{width:calc(10ch + 2px)}100%{width:0}}
@keyframes yl-bc{50%{border-right-color:transparent}}
@keyframes yl-ok{0%,32%{opacity:0;transform:translateY(3px)}40%,90%{opacity:1;transform:none}100%{opacity:0}}
.yl .m.wave{flex-direction:row;align-items:center;gap:3px}
.yl .wave i{width:4px;height:6px;border-radius:2px;background:#fff;animation:yl-wv .9s ease-in-out infinite alternate;animation-delay:calc(var(--d) * -.11s)}
@keyframes yl-wv{to{height:var(--h)}}
.yl .m.doc{position:relative;width:78px;height:52px;flex-direction:row;align-items:center;justify-content:center;gap:0}
.yl .doc .pg{position:absolute;width:34px;height:44px;border-radius:5px;background:rgba(255,255,255,.3);transform:translateX(-10px) rotate(-9deg)}
.yl .doc .pf{position:relative;width:36px;height:46px;border-radius:5px;background:#fff;padding:8px 6px;display:flex;flex-direction:column;gap:5px;box-shadow:0 3px 0 rgba(10,20,60,.22);transform:translateX(4px)}
.yl .doc .pf i{display:block;height:3px;border-radius:2px;background:#c9d6f5;position:relative;overflow:hidden}
.yl .doc .pf i.t{height:4px;width:58%;background:#3b6fd4}
.yl .doc .pf i:nth-child(3){width:86%}.yl .doc .pf i:nth-child(4){width:70%}.yl .doc .pf i:nth-child(5){width:80%}
.yl .doc .pf i:not(.t)::after{content:"";position:absolute;inset:0;background:#ffd54a;transform-origin:left;transform:scaleX(0);animation:yl-hlp 5s ease-in-out infinite}
.yl .doc .pf i:nth-child(3)::after{animation-delay:.7s}.yl .doc .pf i:nth-child(4)::after{animation-delay:1.5s}.yl .doc .pf i:nth-child(5)::after{animation-delay:2.3s}
.yl .doc .sp{position:absolute;right:6px;top:0;width:12px;height:12px;background:#ffd54a;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);animation:yl-spk 2.4s ease-in-out infinite}
@keyframes yl-spk{50%{transform:scale(1.35) rotate(20deg);opacity:.7}}
.yl .trial{margin-top:48px;border-radius:34px;background:#14192b;color:#fff;padding:44px 40px;display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center;position:relative;overflow:hidden;animation:yl-rise .75s .3s cubic-bezier(.2,.8,.2,1) backwards}
.yl .trial::before{content:"";position:absolute;right:-120px;top:-140px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(247,147,30,.28),transparent 68%);pointer-events:none}
.yl .trial>*{position:relative}
.dark .yl .trial{background:#171d38;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.yl .trial h3{font-family:"Fraunces","Instrument Serif",Georgia,serif;font-weight:600;font-size:clamp(28px,3.4vw,42px);line-height:1.08;letter-spacing:-.025em;margin:0 0 12px}
.yl .trial h3 em{display:block;font-style:italic;font-weight:500;color:#f7931e}
.yl .trial p{margin:0 0 26px;font-size:17px;color:rgba(255,255,255,.78);max-width:46ch}
.yl .tbtn{background:#f7931e;color:#14192b;font-weight:700;font-size:16.5px;padding:16px 30px;border-radius:14px;box-shadow:0 6px 0 rgba(0,0,0,.35);transition:transform .15s,box-shadow .15s}
.yl .tbtn:hover{transform:translateY(2px);box-shadow:0 4px 0 rgba(0,0,0,.35)}
.yl .tbtn:active{transform:translateY(6px);box-shadow:none}
.yl .tr{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.yl .tr li{display:flex;gap:14px;align-items:flex-start;background:rgba(255,255,255,.07);border-radius:18px;padding:16px 18px}
.yl .tr svg{width:26px;height:26px;flex:none;margin-top:1px;fill:rgba(247,147,30,.18);stroke:#f7931e;stroke-width:1.6}
.yl .tr svg path{fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.yl .tr b{display:block;font-size:16.5px}
.yl .tr span{display:block;font-size:14.5px;color:rgba(255,255,255,.7)}
@media(max-width:900px){.yl .trial{grid-template-columns:1fr;padding:34px 24px;gap:28px}}
.yl .toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translate(-50%,16px);background:var(--ink);color:var(--page);padding:12px 20px;border-radius:14px;font-weight:600;font-size:14.5px;opacity:0;pointer-events:none;transition:.3s;z-index:30}
.yl .toast.show{opacity:1;transform:translate(-50%,0)}
@media(prefers-reduced-motion:reduce){.yl *{animation:none!important;transition:none!important}}
`;
