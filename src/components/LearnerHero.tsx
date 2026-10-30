import { useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,500&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@500&display=swap');
.lh{--page:#f8f9fb;--card:#ffffff;--ink:#14192b;--muted:#666e84;--line:#e4e8f0;--brand:#4a7bdc;--sun:#ffd54a;--mug:#4a7bdc;--mugdark:#3a63b8;--steam:#aab4cc;--tag:#fff6c9;--tagink:#4a3c00}
@media (prefers-color-scheme:dark){.lh{--page:#0d1120;--card:#151b30;--ink:#f1f4fc;--muted:#a1abc4;--line:#252d48;--steam:#6c7898;--tag:#3b3410;--tagink:#ffe9a0;--mug:#5c8ae6;--mugdark:#4572cf}}
.dark .lh{--page:#0d1120;--card:#151b30;--ink:#f1f4fc;--muted:#a1abc4;--line:#252d48;--steam:#6c7898;--tag:#3b3410;--tagink:#ffe9a0;--mug:#5c8ae6;--mugdark:#4572cf}
.lh,.lh *{box-sizing:border-box}
.lh-hero{max-width:1100px;margin:0 auto;background:var(--card);color:var(--ink);font-family:"DM Sans",system-ui,sans-serif;border:1px solid var(--line);border-radius:24px;display:grid;grid-template-columns:1.2fr .8fr;align-items:center;gap:20px;padding:54px 56px;overflow:hidden}
@media(max-width:820px){.lh-hero{grid-template-columns:1fr;padding:34px 22px}.lh-tag{right:2%!important}}
.lh-hi{font-size:17px;font-weight:500;color:var(--muted);margin:0 0 14px;display:flex;align-items:center;gap:8px}
.lh-hi b{color:var(--brand);font-weight:700}
.lh h1{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:clamp(38px,5.6vw,64px);line-height:1.04;letter-spacing:-.025em;margin:0 0 30px;color:var(--ink)}
.lh h1 i{font-weight:500;position:relative;white-space:nowrap}
.lh h1 svg{position:absolute;left:-2%;bottom:-.18em;width:104%;height:.3em;overflow:visible}
.lh h1 path{fill:none;stroke:var(--brand);stroke-width:5;stroke-linecap:round;stroke-dasharray:300;stroke-dashoffset:300;animation:lh-draw 1.2s .5s ease-out forwards}
@keyframes lh-draw{to{stroke-dashoffset:0}}
.lh-say{display:flex;gap:16px;align-items:flex-start;margin-bottom:30px;max-width:540px}
.lh-face{flex:none;width:46px;height:46px}
.lh-face .eye,.lh .blink{transform-box:fill-box;transform-origin:center;animation:lh-blink 4s infinite}
@keyframes lh-blink{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}
.lh-face.hop{animation:lh-hop .55s}
@keyframes lh-hop{30%{transform:translateY(-8px) rotate(-8deg)}60%{transform:translateY(0) rotate(6deg)}}
.lh-win{height:112px;overflow:hidden;flex:1}
.lh-q{font-family:"Fraunces",Georgia,serif;font-style:italic;font-weight:500;font-size:clamp(19px,2.2vw,24px);line-height:1.3;margin:0;color:var(--ink)}
.lh-q.in{animation:lh-up .5s cubic-bezier(.2,.8,.2,1)}
.lh-q.out{animation:lh-away .3s ease-in forwards}
@keyframes lh-up{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
@keyframes lh-away{to{transform:translateY(-60%);opacity:0}}
.lh mark{color:inherit;padding:0 3px;background:linear-gradient(transparent 52%,rgba(255,213,74,.75) 52%) no-repeat;background-size:0 100%;animation:lh-hl .8s .45s ease-out forwards}
@media (prefers-color-scheme:dark){.lh mark{background-image:linear-gradient(transparent 52%,rgba(255,213,74,.4) 52%)}}
.dark .lh mark{background-image:linear-gradient(transparent 52%,rgba(255,213,74,.4) 52%)}
@keyframes lh-hl{to{background-size:100% 100%}}
.lh-cta{display:inline-flex;align-items:center;gap:10px;font:inherit;font-weight:700;font-size:16px;background:#4a7bdc;color:#fff;border:0;border-radius:12px;padding:15px 26px;cursor:pointer;transition:transform .15s,box-shadow .15s}
.lh-cta:hover{transform:translateY(-2px);box-shadow:0 8px 0 -2px rgba(74,123,220,.28)}
.lh-cta:active{transform:translateY(0)}
.lh-cta svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transition:transform .15s}
.lh-cta:hover svg{transform:translateX(4px)}
.lh-cta:focus-visible{outline:3px solid #4a7bdc;outline-offset:3px}
.lh-scene{position:relative;max-width:340px;width:100%;justify-self:center}
.lh-scene>svg{display:block;width:100%;height:auto}
.lh-steam path{fill:none;stroke:var(--steam);stroke-width:5;stroke-linecap:round;stroke-dasharray:36 140;animation:lh-steam 3.2s ease-in-out infinite;opacity:.8}
.lh-steam path:nth-child(2){animation-delay:-1.1s}.lh-steam path:nth-child(3){animation-delay:-2.1s}
@keyframes lh-steam{0%{stroke-dashoffset:60;opacity:0}30%{opacity:.85}100%{stroke-dashoffset:-120;opacity:0}}
.lh-mug{animation:lh-bob 4s ease-in-out infinite;transform-origin:50% 90%}
@keyframes lh-bob{50%{transform:translateY(-4px) rotate(-.8deg)}}
.lh-tag{position:absolute;right:-6px;top:8%;background:var(--tag);color:var(--tagink);font-family:"JetBrains Mono",monospace;font-size:12px;font-weight:500;padding:9px 12px;border-radius:6px;box-shadow:2px 3px 0 rgba(0,0,0,.12);transform:rotate(4deg);animation:lh-wob 5s ease-in-out infinite}
@keyframes lh-wob{50%{transform:rotate(-2deg) translateY(-4px)}}
@media(prefers-reduced-motion:reduce){.lh *{animation:none!important}.lh h1 path{stroke-dashoffset:0}.lh mark{background-size:100% 100%}}
`;

type Expr = "grin" | "wink" | "calm" | "cool" | "wow";

const QUOTES: [string, Expr][] = [
  ["Tutorials show you the happy path. <mark>Tickets show you the actual job.</mark>", "cool"],
  ["Debug it. Optimise it. Ship it. <mark>That’s one sprint closer to hired.</mark>", "grin"],
  ["Solve it here, commit it, and <mark>let your GitHub do the talking.</mark>", "wink"],
  ["Every commit is a receipt. <mark>Recruiters love receipts they can click.</mark>", "grin"],
  ["Fail the mock interview here, <mark>so the real one feels like a rerun.</mark>", "calm"],
  ["The AI interviewer asks the follow-ups tomorrow’s interviewer will. <mark>Hear them today.</mark>", "wow"],
  ["Anyone can call an AI API. <mark>The AI era needs people who can design the system behind it.</mark>", "cool"],
  ["Scale, latency, failure: <mark>system design is where juniors turn into seniors.</mark>", "wink"],
];

const E: Record<Expr, [string, string]> = {
  grin: ['<ellipse class="eye" cx="17" cy="21" rx="3" ry="4" fill="#4a3c00"/><ellipse class="eye" cx="33" cy="21" rx="3" ry="4" fill="#4a3c00"/>', "M15 30 q10 11 20 0"],
  wink: ['<ellipse class="eye" cx="17" cy="21" rx="3" ry="4" fill="#4a3c00"/><path d="M29 21 q4 -4 8 0" fill="none" stroke="#4a3c00" stroke-width="2.6" stroke-linecap="round"/>', "M16 31 q9 8 18 -1"],
  calm: ['<path d="M13 22 q4 -4 8 0M29 22 q4 -4 8 0" fill="none" stroke="#4a3c00" stroke-width="2.6" stroke-linecap="round"/>', "M17 32 q8 5 16 0"],
  cool: ['<rect x="10" y="17" width="13" height="8" rx="3" fill="#14192b"/><rect x="27" y="17" width="13" height="8" rx="3" fill="#14192b"/><path d="M23 20 h4" stroke="#14192b" stroke-width="2"/>', "M16 31 q9 8 18 0"],
  wow: ['<ellipse class="eye" cx="17" cy="21" rx="3.4" ry="4.6" fill="#4a3c00"/><ellipse class="eye" cx="33" cy="21" rx="3.4" ry="4.6" fill="#4a3c00"/>', "M21 33 q4 -6 8 0 q-4 4 -8 0"],
};

export default function LearnerHero({ userName = "Alex", onContinue }: { userName?: string; onContinue?: () => void }) {
  const q = useRef<HTMLParagraphElement>(null);
  const face = useRef<SVGSVGElement>(null);
  const eyes = useRef<SVGGElement>(null);
  const mouth = useRef<SVGPathElement>(null);

  const h = new Date().getHours();
  const [greet, emoji] =
    h < 12 ? ["Good morning", "☀️"] : h < 17 ? ["Good afternoon", "🌤️"] : h < 21 ? ["Good evening", "🌇"] : ["Burning the midnight oil", "🌙"];

  useEffect(() => {
    let i = 0;
    const timeouts: number[] = [];
    const show = (n: number, first = false) => {
      i = n;
      const [t, e] = QUOTES[n];
      if (!q.current || !face.current || !eyes.current || !mouth.current) return;
      q.current.className = "lh-q out";
      timeouts.push(window.setTimeout(() => {
        if (!q.current || !face.current || !eyes.current || !mouth.current) return;
        q.current.innerHTML = t;
        q.current.className = "lh-q in";
        eyes.current.innerHTML = E[e][0];
        mouth.current.setAttribute("d", E[e][1]);
        face.current.classList.remove("hop");
        void face.current.getBoundingClientRect();
        face.current.classList.add("hop");
      }, first ? 0 : 280));
    };
    show(0, true);
    const iv = window.setInterval(() => show((i + 1) % QUOTES.length), 5200);
    return () => { clearInterval(iv); timeouts.forEach(clearTimeout); };
  }, []);

  return (
    <div className="lh">
      <style>{CSS}</style>
      <section className="lh-hero">
        <div>
          <p className="lh-hi"><span>{greet}</span>, <b>{userName}</b> <span aria-hidden="true">{emoji}</span></p>
          <h1>Let’s write some <i>code<svg viewBox="0 0 100 12" preserveAspectRatio="none"><path d="M2 8 C 15 2, 25 12, 40 6 S 65 2, 80 7 S 95 5, 98 6" /></svg></i> today.</h1>

          <div className="lh-say">
            <svg ref={face} className="lh-face" viewBox="0 0 50 50" aria-hidden="true">
              <circle cx="25" cy="25" r="23" fill="#ffd54a" />
              <g ref={eyes} />
              <path ref={mouth} fill="none" stroke="#4a3c00" strokeWidth="2.6" strokeLinecap="round" />
              <circle cx="11" cy="30" r="3.2" fill="#ff9a8a" opacity=".6" />
              <circle cx="39" cy="30" r="3.2" fill="#ff9a8a" opacity=".6" />
            </svg>
            <div className="lh-win" aria-live="polite"><p ref={q} className="lh-q" /></div>
          </div>

          <button className="lh-cta" onClick={onContinue}>
            Continue Java Lab
            <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>

        <div className="lh-scene" aria-hidden="true">
          <svg viewBox="0 0 320 300">
            <g className="lh-steam">
              <path d="M120 120 C 105 95, 140 80, 125 50" />
              <path d="M165 125 C 150 95, 185 75, 168 40" />
              <path d="M210 120 C 196 98, 228 84, 214 56" />
            </g>
            <ellipse cx="165" cy="270" rx="125" ry="20" fill="var(--line)" />
            <g className="lh-mug">
              <path d="M244 160 h22 a30 30 0 0 1 0 62 h-30" fill="none" stroke="var(--mugdark)" strokeWidth="16" strokeLinecap="round" />
              <path d="M80 138 h170 v70 a58 58 0 0 1 -58 58 h-54 a58 58 0 0 1 -58 -58z" fill="var(--mug)" />
              <path d="M80 138 h170 v22 h-170z" fill="var(--mugdark)" opacity=".35" />
              <ellipse cx="165" cy="138" rx="85" ry="13" fill="var(--mugdark)" />
              <ellipse cx="165" cy="139" rx="73" ry="8" fill="#5a3a2a" />
              <ellipse className="blink" cx="135" cy="195" rx="9" ry="11" fill="#fff" />
              <ellipse className="blink" cx="195" cy="195" rx="9" ry="11" fill="#fff" />
              <circle cx="137" cy="197" r="4.5" fill="#14192b" />
              <circle cx="197" cy="197" r="4.5" fill="#14192b" />
              <path d="M143 224 q22 22 44 0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
              <circle cx="115" cy="218" r="8" fill="#ff9a8a" opacity=".55" />
              <circle cx="215" cy="218" r="8" fill="#ff9a8a" opacity=".55" />
            </g>
          </svg>
          <div className="lh-tag">{'println("you’ve got this");'}</div>
        </div>
      </section>
    </div>
  );
}