import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { DiffBadge, StatusBadge } from "@/components/Badges";
import { tickets, labs } from "@/lib/dummy";
import {
  Play, Save, Send, Lightbulb, AlertTriangle, ChevronRight, ChevronDown,
  FileCode2, Folder, FolderOpen, Search, GitBranch, Bug, Package, Settings,
  CircleDot, Terminal as TerminalIcon, CheckCircle2, XCircle, Clock, Zap, MessageSquare, Lock, Unlock,
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
  { name: "prints integer", pass: true, time: "12ms" },
  { name: "prints double", pass: true, time: "8ms" },
  { name: "prints boolean", pass: true, time: "9ms" },
  { name: "string length correct", pass: true, time: "7ms" },
  { name: "explicit cast value", pass: false, time: "11ms", msg: "Expected 3, got 4" },
];

function TicketEditor() {
  const { slug, ticketId } = useParams({ from: "/lab/$slug/ticket/$ticketId" });
  const lab = labs.find((l) => l.slug === slug) ?? labs[0];
  const ticket = tickets.find((t) => t.id === ticketId) ?? tickets[0];
  const [tab, setTab] = useState<"problem" | "hints" | "discuss">("problem");
  const [activeFile, setActiveFile] = useState("Main.java");
  const [bottomTab, setBottomTab] = useState<"output" | "tests" | "terminal" | "problems">("tests");
  const [hintLevel, setHintLevel] = useState(1);
  const [elapsed] = useState("18:42");

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopNav />

      {/* Sub top bar */}
      <div className="flex flex-wrap items-center gap-3 border-b bg-card/60 px-4 py-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Labs</Link><ChevronRight className="h-3 w-3" />
          <Link to="/lab/$slug" params={{ slug }} className="hover:text-foreground">{lab.name}</Link><ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-mono">{ticket.id}</span>
        </div>
        <StatusBadge value={ticket.status} />
        <DiffBadge value={ticket.difficulty} />
        <span className="text-muted-foreground inline-flex items-center gap-1"><Zap className="h-3 w-3 text-primary" />+{ticket.xp} XP</span>
        <span className="text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />Est. {ticket.estMin}m · Elapsed {elapsed}</span>
        <div className="ml-auto flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 hover:bg-accent"><MessageSquare className="h-3 w-3" />Feedback</button>
          <button className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 hover:bg-accent"><Save className="h-3 w-3" />Save</button>
          <button className="inline-flex items-center gap-1 rounded-md bg-success/20 text-success border border-success/40 px-2.5 py-1 hover:bg-success/30">
            <Play className="h-3 w-3" />Run
          </button>
          <Link to="/lab/$slug/ticket/$ticketId/review" params={{ slug, ticketId }}
            className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-2.5 py-1 hover:opacity-90">
            <Send className="h-3 w-3" />Submit
          </Link>
        </div>
      </div>

      {/* MAIN IDE LAYOUT */}
      <div className="flex flex-1 min-h-0">
        {/* Activity bar */}
        <div className="flex w-11 flex-col items-center gap-1 border-r bg-editor-panel py-2 text-muted-foreground">
          {[FileCode2, Search, GitBranch, Bug, Package].map((I, i) => (
            <button key={i} className={`grid h-9 w-9 place-items-center rounded ${i === 0 ? "text-foreground bg-accent" : "hover:text-foreground"}`}><I className="h-4 w-4" /></button>
          ))}
          <Settings className="mt-auto h-4 w-4" />
        </div>

        {/* Left: Problem panel */}
        <aside className="hidden md:flex w-[28%] min-w-[300px] flex-col border-r bg-editor-panel">
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
          <div className="flex-1 overflow-auto scrollbar-thin p-4 text-sm space-y-4">
            {tab === "problem" && <ProblemPanel ticket={ticket} />}
            {tab === "hints" && <HintsPanel level={hintLevel} setLevel={setHintLevel} />}
            {tab === "discuss" && <DiscussPanel />}
          </div>
        </aside>

        {/* Center: file tree + editor */}
        <section className="flex flex-1 min-w-0 flex-col">
          <div className="flex flex-1 min-h-0">
            {/* File tree */}
            <div className="hidden lg:flex w-56 flex-col border-r bg-editor-panel text-xs">
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

            {/* Editor area */}
            <div className="flex flex-1 min-w-0 flex-col">
              {/* Editor tabs */}
              <div className="flex items-center border-b bg-editor-panel text-xs">
                {["Main.java", "MainTest.java", "README.md"].map((f) => (
                  <button key={f} onClick={() => setActiveFile(f)}
                    className={`flex items-center gap-2 border-r px-3 py-2 ${activeFile === f ? "bg-editor-bg text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <FileCode2 className="h-3 w-3" />{f}
                    {f === "Main.java" && <CircleDot className="h-2.5 w-2.5 text-warning" />}
                  </button>
                ))}
              </div>

              {/* Code surface */}
              <div className="flex-1 min-h-0 overflow-auto bg-editor-bg font-mono text-[13px] leading-6 scrollbar-thin">
                <CodeView code={STARTER} />
              </div>

              {/* Bottom panel */}
              <div className="border-t bg-editor-panel">
                <div className="flex items-center border-b text-xs">
                  {[
                    { k: "tests", label: "Tests", icon: CheckCircle2 },
                    { k: "output", label: "Output", icon: TerminalIcon },
                    { k: "terminal", label: "Terminal", icon: TerminalIcon },
                    { k: "problems", label: "Problems", icon: AlertTriangle },
                  ].map((t) => (
                    <button key={t.k} onClick={() => setBottomTab(t.k as typeof bottomTab)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 uppercase tracking-wide ${bottomTab === t.k ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
                      <t.icon className="h-3 w-3" />{t.label}
                    </button>
                  ))}
                  <div className="ml-auto px-3 text-[11px] text-muted-foreground">5 tests · 4 passed · 1 failed</div>
                </div>
                <div className="h-44 overflow-auto scrollbar-thin p-3 text-xs">
                  {bottomTab === "tests" && (
                    <ul className="space-y-1.5 font-mono">
                      {TESTS.map((t) => (
                        <li key={t.name} className="flex items-center gap-2">
                          {t.pass ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
                          <span className={t.pass ? "" : "text-destructive"}>{t.name}</span>
                          <span className="ml-auto text-muted-foreground">{t.time}</span>
                          {t.msg && <span className="basis-full pl-5 text-destructive/80">→ {t.msg}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                  {bottomTab === "output" && (
                    <pre className="font-mono text-muted-foreground">{`Integer: 42
Double: 3.14
Boolean: true
String: Hello Java
Length: 10
Char[0]: H`}</pre>
                  )}
                  {bottomTab === "terminal" && (
                    <div className="font-mono text-muted-foreground">
                      <div><span className="text-success">alex@labs</span>:<span className="text-info">~/java-101</span>$ javac Main.java</div>
                      <div><span className="text-success">alex@labs</span>:<span className="text-info">~/java-101</span>$ java Main</div>
                      <div className="text-foreground">{"> Build successful in 1.2s"}</div>
                      <div className="mt-1"><span className="text-success">alex@labs</span>:<span className="text-info">~/java-101</span>$ <span className="animate-pulse">▌</span></div>
                    </div>
                  )}
                  {bottomTab === "problems" && (
                    <div className="space-y-1 font-mono">
                      <div className="flex items-center gap-2 text-warning"><AlertTriangle className="h-3 w-3" />Main.java:18 — unused variable 'castedDouble'</div>
                      <div className="flex items-center gap-2 text-destructive"><XCircle className="h-3 w-3" />Main.java:19 — explicit cast loses precision</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 border-t bg-primary/90 px-3 py-1 text-[11px] text-primary-foreground">
        <span className="inline-flex items-center gap-1"><GitBranch className="h-3 w-3" /> main</span>
        <span>Java 17</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span className="ml-auto">Ln 24, Col 8 · Spaces: 4 · {ticket.id}</span>
      </div>
    </div>
  );
}

/* --- Subcomponents --- */

function ProblemPanel({ ticket }: { ticket: typeof tickets[number] }) {
  return (
    <>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{ticket.id}</div>
        <h2 className="text-lg font-semibold mt-0.5">{ticket.title}</h2>
        <p className="mt-2 text-muted-foreground">{ticket.description}</p>
      </div>
      <Section title="📋 Learning objectives">
        <ul className="space-y-1 text-muted-foreground">
          <li>✓ Understand primitive data types</li>
          <li>✓ Declare and initialize variables</li>
          <li>✓ Perform type casting</li>
          <li>✓ Work with String operations</li>
        </ul>
      </Section>
      <Section title="✅ Tasks">
        <ol className="space-y-2 text-muted-foreground list-decimal pl-4">
          <li>Create variables for all primitive types (int, double, boolean, char, long, float, byte, short) and print them.</li>
          <li>Perform implicit (int → double) and explicit (double → int) casts. Print before/after.</li>
          <li>Use String methods: <code className="text-syntax-fn">length()</code>, <code className="text-syntax-fn">charAt()</code>, <code className="text-syntax-fn">substring()</code>.</li>
        </ol>
      </Section>
      <Section title="📥 Expected output">
        <pre className="rounded-md bg-editor-bg border p-2 text-[12px] font-mono text-muted-foreground">{`Integer: 42
Double: 3.14
Boolean: true
String: Hello Java
Length: 10
Char at 0: H`}</pre>
      </Section>
      <Section title="⚠️ Common mistakes">
        <ul className="space-y-1 text-muted-foreground">
          <li>• Forgetting <code>(int)</code> when narrowing</li>
          <li>• Using <code>=</code> instead of <code>==</code> in comparisons</li>
          <li>• <code>charAt</code> out-of-bounds on empty strings</li>
        </ul>
      </Section>
    </>
  );
}

function HintsPanel({ level, setLevel }: { level: number; setLevel: (n: number) => void }) {
  const hints = [
    { n: 1, cost: "Free", title: "Think about it", body: "What data type best represents each value? Start by listing the 8 Java primitives in your head.", locked: false },
    { n: 2, cost: "Free in 5m", title: "Structure", body: "Declare one variable per type, print each with System.out.println, then attempt one cast in each direction.", locked: false },
    { n: 3, cost: "10 XP", title: "Code template", body: "int a = 42;\ndouble b = a;        // implicit\nint c = (int) 3.99;  // explicit", locked: level < 3 },
    { n: 4, cost: "20 XP", title: "Partial solution", body: "Use greeting.length() + greeting.charAt(0). Replace TODOs with actual implementations and verify against expected output.", locked: level < 4 },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-warning/40 bg-warning/10 p-2 text-xs text-warning">
        <Lightbulb className="inline h-3 w-3 mr-1" /> Progressive hints minimize your reward only if used.
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
            <button onClick={() => setLevel(h.n)} className="mt-2 w-full rounded border border-dashed py-1.5 text-xs text-muted-foreground hover:bg-accent">Unlock for {h.cost}</button>
          )}
        </div>
      ))}
      <div className="rounded-md border bg-editor-bg p-3 text-xs">
        <div className="font-medium">Full solution review</div>
        <div className="mt-1 text-muted-foreground">Available after you submit. Includes alt approaches & best practices.</div>
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
  // comments
  h = h.replace(/(\/\/.*$)/g, '<span style="color:var(--syntax-comment)">$1</span>');
  // strings
  h = h.replace(/(&quot;.*?&quot;|".*?")/g, '<span style="color:var(--syntax-string)">$1</span>');
  // keywords
  h = h.replace(/\b(public|class|static|void|int|double|boolean|String|char|long|float|byte|short|return|if|else|for|while|new|true|false|null)\b/g,
    '<span style="color:var(--syntax-keyword)">$1</span>');
  // numbers
  h = h.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:var(--syntax-number)">$1</span>');
  // function calls
  h = h.replace(/\b([a-zA-Z_][\w]*)(?=\()/g, '<span style="color:var(--syntax-fn)">$1</span>');
  return h;
}
