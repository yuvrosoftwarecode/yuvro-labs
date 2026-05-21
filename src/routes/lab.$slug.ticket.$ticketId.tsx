import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { DiffBadge, StatusBadge } from "@/components/Badges";
import { tickets, labs } from "@/lib/dummy";
import {
  Play, Save, Send, Lightbulb, AlertTriangle, ChevronRight, ChevronDown,
  FileCode2, Folder, FolderOpen, Search, GitBranch, Bug, Package, Settings,
  CircleDot, Terminal as TerminalIcon, CheckCircle2, XCircle, Clock, Zap,
  MessageSquare, Lock, Unlock, RotateCcw, Copy, Share2, Flag, HelpCircle,
  Sparkles, Gauge, Wand2, Globe,
} from "lucide-react";

export const Route = createFileRoute("/lab/$slug/ticket/$ticketId")({ component: TicketEditor });

const STARTER = `public class Main {
    public static void main(String[] args) {
        // TODO: declare primitive types and print them
        int integerValue = 42;
        double pi = 3.14;
        boolean isJavaFun = true;
        String greeting = "Hello Java";

        System.out.println("Integer: " + integerValue);
        System.out.println("Double: " + pi);
        System.out.println("Boolean: " + isJavaFun);
        System.out.println("String: " + greeting);

        // TODO: type casting
        double castedDouble = integerValue; // implicit
        int castedInt = (int) pi;           // explicit

        // TODO: string ops
        System.out.println("Length: " + greeting.length());
        System.out.println("Char[0]: " + greeting.charAt(0));
    }
}`;

const TESTS = [
  { name: "Test 1 · Variables Declaration", pass: true, time: "12ms" },
  { name: "Test 2 · Type Casting (implicit)", pass: true, time: "8ms" },
  { name: "Test 3 · Type Casting (explicit)", pass: true, time: "9ms" },
  { name: "Test 4 · String Operations", pass: true, time: "7ms" },
  { name: "Test 5 · Output Format", pass: false, time: "11ms", expected: '"Result: 42"', got: '"Result42"' },
];

type BottomTab = "output" | "errors" | "tests" | "quality" | "preview" | "terminal";

function TicketEditor() {
  const { slug, ticketId } = useParams({ from: "/lab/$slug/ticket/$ticketId" });
  const lab = labs.find((l) => l.slug === slug) ?? labs[0];
  const ticket = tickets.find((t) => t.id === ticketId) ?? tickets[0];
  const [tab, setTab] = useState<"problem" | "hints" | "discuss">("problem");
  const [activeFile, setActiveFile] = useState("Main.java");
  const [bottomTab, setBottomTab] = useState<BottomTab>("tests");
  const [hintLevel, setHintLevel] = useState(2);
  const [elapsed, setElapsed] = useState(754); // seconds
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showProgress, setShowProgress] = useState(true);
  const [compileState] = useState<"ok" | "warn" | "err">("warn");

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const passed = TESTS.filter((t) => t.pass).length;
  const allPass = passed === TESTS.length;
  const timeStr = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopNav />

      {/* Top sub-bar */}
      <div className="flex flex-wrap items-center gap-3 border-b bg-card/60 px-4 py-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Practical Labs</Link><ChevronRight className="h-3 w-3" />
          <Link to="/lab/$slug" params={{ slug }} className="hover:text-foreground">{lab.name}</Link><ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-mono">{ticket.id}</span>
        </div>
        <StatusBadge value={ticket.status} />
        <DiffBadge value={ticket.difficulty} />
        <span className="text-muted-foreground inline-flex items-center gap-1"><Zap className="h-3 w-3 text-primary" />+{ticket.xp} XP</span>
        <span className="text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />Est. {ticket.estMin}m · Elapsed <span className="font-mono text-foreground">{timeStr}</span></span>

        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setTab("hints")} className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 hover:bg-accent"><HelpCircle className="h-3 w-3" />Hints</button>
          <button className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 hover:bg-accent"><Flag className="h-3 w-3" />Report</button>
          <button className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 hover:bg-accent"><MessageSquare className="h-3 w-3" />Feedback</button>
          <button className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 hover:bg-accent"><Save className="h-3 w-3" />Save</button>
          <button className="inline-flex items-center gap-1 rounded-md bg-success/20 text-success border border-success/40 px-3 py-1 hover:bg-success/30 font-medium">
            <Play className="h-3 w-3" />Run <kbd className="hidden md:inline rounded bg-success/20 px-1 text-[10px]">⌘↵</kbd>
          </button>
          <Link to="/lab/$slug/ticket/$ticketId/review" params={{ slug, ticketId }}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1 font-medium ${allPass ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-primary/40 text-primary-foreground/70 cursor-not-allowed"}`}>
            <Send className="h-3 w-3" />Submit
          </Link>
        </div>
      </div>

      {/* MAIN IDE */}
      <div className="flex flex-1 min-h-0">
        {/* Activity bar */}
        <div className="flex w-11 flex-col items-center gap-1 border-r bg-editor-panel py-2 text-muted-foreground">
          {[FileCode2, Search, GitBranch, Bug, Package].map((I, i) => (
            <button key={i} className={`grid h-9 w-9 place-items-center rounded ${i === 0 ? "text-foreground bg-accent" : "hover:text-foreground"}`}><I className="h-4 w-4" /></button>
          ))}
          <Settings className="mt-auto h-4 w-4" />
        </div>

        {/* Left: Problem / Hints / Discuss (30%) */}
        <aside className="hidden md:flex w-[30%] min-w-[320px] max-w-[480px] flex-col border-r bg-editor-panel">
          <div className="flex border-b text-xs">
            {[
              { k: "problem", label: "Problem" },
              { k: "hints", label: "Hints" },
              { k: "discuss", label: "Discuss" },
            ].map((t) => (
              <button key={t.k} onClick={() => setTab(t.k as typeof tab)}
                className={`px-3 py-2 ${tab === t.k ? "bg-editor-bg text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>{t.label}</button>
            ))}
          </div>
          <div className="flex-1 overflow-auto scrollbar-thin p-4 text-sm space-y-3">
            {tab === "problem" && <ProblemPanel ticket={ticket} />}
            {tab === "hints" && <HintsPanel level={hintLevel} setLevel={setHintLevel} elapsed={elapsed} />}
            {tab === "discuss" && <DiscussPanel />}
          </div>
        </aside>

        {/* Center editor (~70%) */}
        <section className="flex flex-1 min-w-0 flex-col relative">
          <div className="flex flex-1 min-h-0">
            {/* File tree */}
            <div className="hidden lg:flex w-52 flex-col border-r bg-editor-panel text-xs">
              <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-muted-foreground">Explorer</div>
              <div className="px-2 space-y-0.5">
                <TreeFolder label={ticket.id.toLowerCase()} open>
                  <TreeFolder label="src" open>
                    <TreeFile name="Main.java" active={activeFile === "Main.java"} onClick={() => setActiveFile("Main.java")} modified />
                    <TreeFile name="Utils.java" active={activeFile === "Utils.java"} onClick={() => setActiveFile("Utils.java")} />
                  </TreeFolder>
                  <TreeFolder label="tests">
                    <TreeFile name="MainTest.java" onClick={() => setActiveFile("MainTest.java")} active={activeFile === "MainTest.java"} />
                  </TreeFolder>
                  <TreeFile name="README.md" onClick={() => setActiveFile("README.md")} active={activeFile === "README.md"} />
                  <TreeFile name="pom.xml" onClick={() => setActiveFile("pom.xml")} active={activeFile === "pom.xml"} />
                </TreeFolder>
              </div>
              <div className="mt-auto border-t px-3 py-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1"><GitBranch className="h-3 w-3" /> main</div>
              </div>
            </div>

            {/* Editor + bottom panel */}
            <div className="flex flex-1 min-w-0 flex-col">
              {/* Tabs row */}
              <div className="flex items-center border-b bg-editor-panel text-xs">
                {["Main.java", "MainTest.java", "README.md"].map((f) => (
                  <button key={f} onClick={() => setActiveFile(f)}
                    className={`flex items-center gap-2 border-r px-3 py-2 ${activeFile === f ? "bg-editor-bg text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <FileCode2 className="h-3 w-3" />{f}
                    {f === "Main.java" && <CircleDot className="h-2.5 w-2.5 text-warning" />}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2 pr-3 text-[11px] text-muted-foreground">
                  <CompileBadge state={compileState} />
                  <span className="hidden md:inline">Quality <span className="text-foreground">8/10</span></span>
                  <button onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} className="rounded border px-2 py-0.5 hover:bg-accent">
                    {theme === "dark" ? "☀ Light" : "🌙 Dark"}
                  </button>
                  <button title="Format (Ctrl+Shift+F)" className="rounded border px-2 py-0.5 hover:bg-accent"><Wand2 className="h-3 w-3" /></button>
                </div>
              </div>

              {/* Code surface + minimap */}
              <div className="flex flex-1 min-h-0">
                <div className="flex-1 overflow-auto bg-editor-bg font-mono text-[13px] leading-6 scrollbar-thin">
                  <CodeView code={STARTER} />
                </div>
                <Minimap code={STARTER} />
              </div>

              {/* Bottom panel */}
              <div className="border-t bg-editor-panel">
                <div className="flex items-center border-b text-xs overflow-x-auto">
                  {[
                    { k: "output", label: "Console", icon: TerminalIcon },
                    { k: "errors", label: "Errors", icon: AlertTriangle },
                    { k: "tests", label: `Tests (${passed}/${TESTS.length})`, icon: CheckCircle2 },
                    { k: "quality", label: "Quality", icon: Gauge },
                    { k: "preview", label: "Preview", icon: Globe },
                    { k: "terminal", label: "Terminal", icon: TerminalIcon },
                  ].map((t) => (
                    <button key={t.k} onClick={() => setBottomTab(t.k as BottomTab)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 uppercase tracking-wide ${bottomTab === t.k ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
                      <t.icon className="h-3 w-3" />{t.label}
                    </button>
                  ))}
                  <div className="ml-auto px-3 text-[11px] text-muted-foreground whitespace-nowrap">
                    {passed}/{TESTS.length} passed · {allPass ? "ready to submit" : "fix failing tests"}
                  </div>
                </div>
                <div className="h-52 overflow-auto scrollbar-thin p-3 text-xs">
                  {bottomTab === "tests" && <TestsView />}
                  {bottomTab === "output" && <OutputView />}
                  {bottomTab === "errors" && <ErrorsView />}
                  {bottomTab === "quality" && <QualityView />}
                  {bottomTab === "preview" && <PreviewView />}
                  {bottomTab === "terminal" && <TerminalView />}
                </div>
              </div>
            </div>

            {/* Right floating live progress */}
            {showProgress && (
              <div className="hidden xl:flex w-60 flex-col gap-2 border-l bg-editor-panel/80 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">Live Progress</div>
                  <button onClick={() => setShowProgress(false)} className="text-muted-foreground hover:text-foreground">×</button>
                </div>
                <ProgressTile icon={CheckCircle2} label="Tests passed" value={`${passed}/${TESTS.length}`} tone={allPass ? "success" : "warning"} pct={(passed / TESTS.length) * 100} />
                <ProgressTile icon={Gauge} label="Code quality" value="8/10" tone="info" pct={80} />
                <ProgressTile icon={Clock} label="Time spent" value={timeStr} tone="muted" pct={Math.min(100, (elapsed / (ticket.estMin * 60)) * 100)} />
                <ProgressTile icon={Zap} label="XP on submit" value={`+${ticket.xp}`} tone="primary" pct={100} />

                <div className="mt-2 rounded-md border bg-editor-bg p-2">
                  <div className="flex items-center gap-1 text-[11px] font-semibold"><Lightbulb className="h-3 w-3 text-warning" />Active hints</div>
                  <div className="mt-1 text-muted-foreground">Level {hintLevel} unlocked</div>
                  <button onClick={() => setTab("hints")} className="mt-1.5 w-full rounded border border-dashed py-1 text-[11px] hover:bg-accent">Open hints panel</button>
                </div>

                <div className="mt-auto space-y-1.5">
                  <button className="w-full inline-flex items-center justify-center gap-1 rounded-md border px-2 py-1.5 hover:bg-accent"><RotateCcw className="h-3 w-3" />Reset code</button>
                  <button className="w-full inline-flex items-center justify-center gap-1 rounded-md border px-2 py-1.5 hover:bg-accent"><Copy className="h-3 w-3" />Copy template</button>
                  <button className="w-full inline-flex items-center justify-center gap-1 rounded-md border px-2 py-1.5 hover:bg-accent"><Share2 className="h-3 w-3" />Share code</button>
                </div>
              </div>
            )}
          </div>

          {/* Floating run button (when no sidebar) */}
          {!showProgress && (
            <button onClick={() => setShowProgress(true)} className="absolute right-3 top-12 rounded-full border bg-card p-2 shadow-lg hover:bg-accent" title="Show progress">
              <Sparkles className="h-4 w-4 text-primary" />
            </button>
          )}
        </section>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 border-t bg-primary/90 px-3 py-1 text-[11px] text-primary-foreground">
        <span className="inline-flex items-center gap-1"><GitBranch className="h-3 w-3" /> main</span>
        <span>Java 17</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span className="inline-flex items-center gap-1">
          {compileState === "ok" && <><CheckCircle2 className="h-3 w-3" />Compiled</>}
          {compileState === "warn" && <><AlertTriangle className="h-3 w-3" />1 warning</>}
          {compileState === "err" && <><XCircle className="h-3 w-3" />Compile error</>}
        </span>
        <span className="ml-auto">Ln 24, Col 8 · Spaces: 4 · {ticket.id}</span>
      </div>
    </div>
  );
}

/* ---------- Subviews ---------- */

function CompileBadge({ state }: { state: "ok" | "warn" | "err" }) {
  const map = {
    ok: { txt: "Compiled", cls: "text-success border-success/40 bg-success/10", I: CheckCircle2 },
    warn: { txt: "Warnings", cls: "text-warning border-warning/40 bg-warning/10", I: AlertTriangle },
    err: { txt: "Errors", cls: "text-destructive border-destructive/40 bg-destructive/10", I: XCircle },
  } as const;
  const { txt, cls, I } = map[state];
  return <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 ${cls}`}><I className="h-3 w-3" />{txt}</span>;
}

function TestsView() {
  const passed = TESTS.filter((t) => t.pass).length;
  return (
    <div className="font-mono space-y-1.5">
      <div className="text-muted-foreground">Running tests… completed in 0.12s</div>
      <div className="border-b border-dashed my-1" />
      {TESTS.map((t) => (
        <div key={t.name}>
          <div className="flex items-center gap-2">
            {t.pass ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
            <span className={t.pass ? "" : "text-destructive"}>{t.name}</span>
            <span className="ml-auto text-muted-foreground">{t.time}</span>
          </div>
          {!t.pass && (
            <div className="ml-5 mt-1 rounded border border-destructive/30 bg-destructive/5 p-1.5 text-[11px] text-destructive/90">
              <div>Expected: <span className="text-success">{t.expected}</span></div>
              <div>Got:      <span className="text-destructive">{t.got}</span></div>
            </div>
          )}
        </div>
      ))}
      <div className="mt-2 border-t pt-2">
        Score: <span className="text-foreground font-semibold">{passed}/{TESTS.length}</span> tests passed ({Math.round((passed / TESTS.length) * 100)}%)
        {passed < TESTS.length && <span className="ml-2 text-destructive">Submit when all tests pass.</span>}
      </div>
    </div>
  );
}

function OutputView() {
  return (
    <pre className="font-mono text-muted-foreground">{`═══════════════════════════════════════
Console Output
═══════════════════════════════════════
Integer: 42
Double: 3.14
Boolean: true
Character: A
String: Hello World
Length: 11
Substring: Hello

═══════════════════════════════════════
✓ Program ran successfully (1.2s)`}</pre>
  );
}

function ErrorsView() {
  const items = [
    { sev: "err", line: 5, msg: "Type mismatch: cannot convert from int to String", fix: "Use Integer.toString() or String.valueOf()" },
    { sev: "warn", line: 18, msg: "Unused variable 'castedDouble'", fix: "Remove the declaration or use it" },
    { sev: "warn", line: 19, msg: "Explicit cast may lose precision", fix: "Document with a comment" },
  ] as const;
  return (
    <div className="space-y-1.5 font-mono">
      {items.map((e, i) => (
        <div key={i} className={`rounded border p-2 ${e.sev === "err" ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5"}`}>
          <div className="flex items-center gap-2">
            {e.sev === "err" ? <XCircle className="h-3 w-3 text-destructive" /> : <AlertTriangle className="h-3 w-3 text-warning" />}
            <button className="underline-offset-2 hover:underline">Main.java:{e.line}</button>
            <span className={e.sev === "err" ? "text-destructive" : "text-warning"}>{e.msg}</span>
          </div>
          <div className="mt-1 ml-5 text-[11px] text-muted-foreground">💡 Suggestion: {e.fix}</div>
        </div>
      ))}
    </div>
  );
}

function QualityView() {
  const items = [
    { ok: true, t: "Naming conventions followed" },
    { ok: true, t: "No unused imports" },
    { ok: false, sev: "warn" as const, t: "Add comments to explain logic" },
    { ok: false, sev: "warn" as const, t: "Consider extracting a helper method" },
    { ok: false, sev: "err" as const, t: "Method too long — consider refactoring" },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold">8<span className="text-muted-foreground text-sm">/10</span></div>
        <div className="flex-1 h-2 rounded-full bg-accent overflow-hidden">
          <div className="h-full bg-success" style={{ width: "80%" }} />
        </div>
      </div>
      <ul className="space-y-1 font-mono">
        {items.map((i, k) => (
          <li key={k} className="flex items-center gap-2">
            {i.ok
              ? <CheckCircle2 className="h-3 w-3 text-success" />
              : i.sev === "warn" ? <AlertTriangle className="h-3 w-3 text-warning" /> : <XCircle className="h-3 w-3 text-destructive" />}
            <span className={i.ok ? "" : i.sev === "warn" ? "text-warning" : "text-destructive"}>{i.t}</span>
          </li>
        ))}
      </ul>
      <div className="rounded border bg-editor-bg p-2 text-[11px] text-muted-foreground">
        <div className="font-semibold text-foreground mb-1">Suggestions</div>
        • Add meaningful JavaDoc comments<br />• Extract printing logic to a separate method<br />• Use printf for formatted output
      </div>
    </div>
  );
}

function PreviewView() {
  return (
    <div className="flex h-full gap-2">
      <div className="flex-1 rounded border bg-white text-black p-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-500">Live preview</div>
        <h2 className="mt-1 text-lg font-semibold">Hello Java</h2>
        <p className="text-sm text-gray-600">Length: 10 · Char[0]: H</p>
        <button className="mt-2 rounded bg-blue-600 px-3 py-1 text-xs text-white">Run sample</button>
      </div>
      <div className="w-40 space-y-1 text-[11px] text-muted-foreground">
        <div className="font-semibold text-foreground">Responsive</div>
        {["Mobile 375", "Tablet 768", "Desktop 1280"].map((d) => (
          <button key={d} className="block w-full rounded border px-2 py-1 text-left hover:bg-accent">{d}</button>
        ))}
      </div>
    </div>
  );
}

function TerminalView() {
  return (
    <div className="font-mono text-muted-foreground space-y-0.5">
      <div><span className="text-success">alex@labs</span>:<span className="text-info">~/java-101</span>$ javac Main.java</div>
      <div><span className="text-success">alex@labs</span>:<span className="text-info">~/java-101</span>$ java Main</div>
      <div className="text-foreground">{"> Build successful in 1.2s"}</div>
      <div><span className="text-success">alex@labs</span>:<span className="text-info">~/java-101</span>$ <span className="animate-pulse">▌</span></div>
    </div>
  );
}

function ProgressTile({ icon: Icon, label, value, tone, pct }: { icon: typeof Zap; label: string; value: string; tone: "success" | "warning" | "info" | "primary" | "muted"; pct: number }) {
  const color = { success: "text-success", warning: "text-warning", info: "text-info", primary: "text-primary", muted: "text-muted-foreground" }[tone];
  const bar = { success: "bg-success", warning: "bg-warning", info: "bg-info", primary: "bg-primary", muted: "bg-muted-foreground" }[tone];
  return (
    <div className="rounded-md border bg-editor-bg p-2">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-muted-foreground"><Icon className={`h-3 w-3 ${color}`} />{label}</span>
        <span className={`font-semibold ${color}`}>{value}</span>
      </div>
      <div className="mt-1.5 h-1 rounded-full bg-accent overflow-hidden">
        <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Minimap({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <div className="hidden xl:block w-16 border-l bg-editor-bg/60 p-1 overflow-hidden">
      {lines.map((l, i) => (
        <div key={i} className="h-[3px] mb-[1px] rounded-sm" style={{ width: `${Math.min(100, l.trim().length * 2.2)}%`, background: "color-mix(in oklab, var(--muted-foreground) 35%, transparent)" }} />
      ))}
    </div>
  );
}

function ProblemPanel({ ticket }: { ticket: typeof tickets[number] }) {
  return (
    <>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{ticket.id} · {ticket.tag}</div>
        <h2 className="text-lg font-semibold mt-0.5">{ticket.title}</h2>
        <p className="mt-2 text-muted-foreground">📋 Create a program demonstrating Java variables and data types.</p>
      </div>

      <Section title="🎯 Learning objectives">
        <ul className="space-y-1 text-muted-foreground">
          <li>✓ Understand primitive data types</li>
          <li>✓ Declare and initialize variables</li>
          <li>✓ Perform type casting</li>
          <li>✓ Work with String operations</li>
        </ul>
      </Section>

      <Section title="✅ Tasks">
        <div className="space-y-2 text-muted-foreground">
          <div>
            <div className="text-foreground">Task 1 · Create variables for all primitive types</div>
            <ul className="ml-3 mt-0.5 list-['└─_'] text-[12px]">
              <li>int, double, boolean, char, long, float, byte, short</li>
              <li>Initialize with appropriate values</li>
              <li>Print them to console</li>
            </ul>
          </div>
          <div>
            <div className="text-foreground">Task 2 · Perform type casting</div>
            <ul className="ml-3 mt-0.5 list-['└─_'] text-[12px]">
              <li>Implicit: int → double</li>
              <li>Explicit: double → int</li>
              <li>Show before and after values</li>
            </ul>
          </div>
          <div>
            <div className="text-foreground">Task 3 · Work with Strings</div>
            <ul className="ml-3 mt-0.5 list-['└─_'] text-[12px]">
              <li>Create a String variable</li>
              <li>Use length(), charAt(), substring()</li>
              <li>Print the results</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="📥 Expected output">
        <pre className="rounded-md bg-editor-bg border p-2 text-[12px] font-mono text-muted-foreground">{`Integer: 42
Double: 3.14
Boolean: true
String: Hello Java
Length: 10
Character at index 0: H`}</pre>
      </Section>

      <Section title="🔗 Related concepts">
        <ul className="space-y-1 text-info">
          <li>→ JAVA-102 · Control Flow & Loops</li>
          <li>→ JAVA-105 · Strings Deep Dive</li>
          <li>→ Docs: Primitive vs reference types</li>
        </ul>
      </Section>

      <Section title="⚠️ Common mistakes">
        <ul className="space-y-1 text-muted-foreground">
          <li>• Type mismatch: <code>double → int</code> requires explicit cast</li>
          <li>• Forgetting <code>(int)</code> when narrowing</li>
          <li>• <code>charAt</code> out-of-bounds on empty strings</li>
        </ul>
      </Section>
    </>
  );
}

function HintsPanel({ level, setLevel, elapsed }: { level: number; setLevel: (n: number) => void; elapsed: number }) {
  const mins = elapsed / 60;
  const hints = [
    { n: 1, cost: "Free", title: "Think about it", body: "Think about what data type each variable needs. List the 8 Java primitives.", locked: false, unlockMin: 0 },
    { n: 2, cost: mins >= 5 ? "Free" : `Free in ${Math.ceil(5 - mins)}m`, title: "Approach", body: "First, declare all 8 primitive types with sensible defaults. Then print each, then attempt one cast in each direction.", locked: mins < 5 && level < 2, unlockMin: 5 },
    { n: 3, cost: mins >= 15 ? "Free" : "10 XP", title: "Code template", body: "int a = 42;\ndouble b = a;        // implicit\nint c = (int) 3.99;  // explicit", locked: level < 3 && mins < 15, unlockMin: 15 },
    { n: 4, cost: mins >= 25 ? "Free" : "20 XP", title: "Partial solution (50%)", body: "Use greeting.length() + greeting.charAt(0). Now complete the casting part…", locked: level < 4 && mins < 25, unlockMin: 25 },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-warning/40 bg-warning/10 p-2 text-xs text-warning">
        <Lightbulb className="inline h-3 w-3 mr-1" /> Progressive hints — unlocking deeper hints costs XP unless you wait.
      </div>
      {hints.map((h) => (
        <div key={h.n} className="rounded-md border bg-editor-bg p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Level {h.n} · {h.title}</div>
            <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
              {h.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3 text-success" />}{h.cost}
            </span>
          </div>
          {!h.locked ? (
            <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground font-mono">{h.body}</pre>
          ) : (
            <div className="mt-2 space-y-1">
              <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />Auto-unlocks at {h.unlockMin}m elapsed</div>
              <button onClick={() => setLevel(h.n)} className="w-full rounded border border-dashed py-1.5 text-xs hover:bg-accent">Unlock now for {h.cost}</button>
            </div>
          )}
        </div>
      ))}
      <div className="rounded-md border bg-editor-bg p-3 text-xs">
        <div className="font-medium inline-flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary" /> Full solution review</div>
        <div className="mt-1 text-muted-foreground">Unlocked after submission — includes annotated solution, alternatives, and best practices.</div>
      </div>
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs">
        <div className="font-medium text-destructive">Common mistake detected in your code</div>
        <div className="mt-1 text-muted-foreground">Type mismatch: <code>double → int</code> requires explicit cast. Try <code>(int) pi</code>.</div>
      </div>
    </div>
  );
}

function DiscussPanel() {
  return (
    <div className="space-y-3 text-xs">
      {[
        { u: "Priya M.", t: "Why does (int)3.99 give 3 and not 4?", r: 12 },
        { u: "Liam K.", t: "Tip: use Integer.MIN_VALUE for edge testing.", r: 4 },
        { u: "Sofia R.", t: "Got 100% — used String.format for clean output.", r: 7 },
      ].map((d, i) => (
        <div key={i} className="rounded-md border p-2 bg-editor-bg">
          <div className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px]">{d.u[0]}</span><span className="font-medium">{d.u}</span></div>
          <div className="mt-1 text-muted-foreground">{d.t}</div>
          <div className="mt-1 text-[10px] text-muted-foreground">{d.r} replies</div>
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-md border bg-editor-bg/60">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium">
        <span>{title}</span>{open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
      {open && <div className="px-3 pb-3 text-xs">{children}</div>}
    </div>
  );
}

function TreeFolder({ label, open: defaultOpen = false, children }: { label: string; open?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-1 rounded px-1.5 py-0.5 hover:bg-accent/60">
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {open ? <FolderOpen className="h-3 w-3 text-info" /> : <Folder className="h-3 w-3 text-info" />}
        <span>{label}</span>
      </button>
      {open && <div className="pl-4">{children}</div>}
    </div>
  );
}
function TreeFile({ name, active, modified, onClick }: { name: string; active?: boolean; modified?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-1.5 rounded px-1.5 py-0.5 text-left ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60"}`}>
      <FileCode2 className="h-3 w-3" /><span className="flex-1 truncate">{name}</span>
      {modified && <span className="h-1.5 w-1.5 rounded-full bg-warning" />}
    </button>
  );
}

function CodeView({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <div className="flex">
      <div className="select-none px-3 py-3 text-right text-editor-gutter">
        {lines.map((_, i) => <div key={i} className="h-6">{i + 1}</div>)}
      </div>
      <pre className="flex-1 py-3 pr-6">
        {lines.map((l, i) => <div key={i} className="h-6 px-2 hover:bg-editor-line/40" dangerouslySetInnerHTML={{ __html: highlight(l) || "&nbsp;" }} />)}
      </pre>
    </div>
  );
}

function highlight(line: string): string {
  const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
  let h = esc(line);
  h = h.replace(/(\/\/.*$)/g, '<span style="color:var(--syntax-comment)">$1</span>');
  h = h.replace(/(&quot;.*?&quot;|".*?")/g, '<span style="color:var(--syntax-string)">$1</span>');
  h = h.replace(/\b(public|class|static|void|int|double|boolean|String|char|long|float|byte|short|return|if|else|for|while|new|true|false|null)\b/g,
    '<span style="color:var(--syntax-keyword)">$1</span>');
  h = h.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:var(--syntax-number)">$1</span>');
  h = h.replace(/\b([a-zA-Z_][\w]*)(?=\()/g, '<span style="color:var(--syntax-fn)">$1</span>');
  return h;
}
