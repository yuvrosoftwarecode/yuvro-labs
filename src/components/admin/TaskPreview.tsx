import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { html as cmHtml } from "@codemirror/lang-html";
import { css as cmCss } from "@codemirror/lang-css";
import { sql as cmSql } from "@codemirror/lang-sql";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import {
  Play, Save, Send, FileCode2, Database, BookOpen, X,
  Folder, FolderOpen, ChevronRight, ChevronDown, GitBranch,
  Lightbulb, CheckCircle, Files,
  Settings, Terminal as TerminalIcon, CheckCircle2,
} from "lucide-react";
import type { LabTask, Language } from "@/lib/labSprints";

function extFor(lang: Language) {
  switch (lang) {
    case "python": return [python()];
    case "java": return [java()];
    case "javascript":
    case "typescript": return [javascript({ typescript: lang === "typescript" })];
    case "html": return [cmHtml()];
    case "css": return [cmCss()];
    case "sql": return [cmSql()];
    case "c":
    case "cpp": return [cpp()];
    default: return [];
  }
}

function extLabel(l: Language): string {
  const map: Partial<Record<Language, string>> = {
    python: "py", javascript: "js", typescript: "ts", java: "java",
    c: "c", cpp: "cpp", csharp: "cs", go: "go", rust: "rs",
    ruby: "rb", php: "php", kotlin: "kt", swift: "swift", scala: "scala",
    html: "html", css: "css", sql: "sql", bash: "sh",
  };
  return map[l] ?? "txt";
}

function mainFileFor(lang: Language, starter: string) {
  const ext = extLabel(lang);
  const name =
    lang === "java" ? "Main.java" :
    lang === "python" ? "main.py" :
    `main.${ext}`;
  return { name, content: starter || "" };
}

function defaultFiles(task: LabTask, lang: Language): { name: string; content: string }[] {
  if (task.editor === "sql") {
    return [
      { name: "query.sql", content: task.starterCode || "-- Write your query here\n" },
      { name: "schema.sql", content: "-- Schema preview\n" },
      { name: "seed.sql", content: "-- Seed data\n" },
      { name: "README.md", content: `# ${task.title}\n\n${task.description}` },
    ];
  }
  return [
    mainFileFor(lang, task.starterCode),
    { name: "README.md", content: `# ${task.title}\n\n${task.description}` },
  ];
}

type SideTab = "explorer" | "problem" | "hints" | "solution";

const SIDE_TABS: { id: SideTab; label: string; Icon: typeof Files }[] = [
  { id: "explorer", label: "Explorer", Icon: Files },
  { id: "problem", label: "Problem", Icon: BookOpen },
  { id: "hints", label: "Hints", Icon: Lightbulb },
  { id: "solution", label: "Solution", Icon: CheckCircle },
];

export function TaskPreview({
  task, sprintName, labName, onClose,
}: {
  task: LabTask;
  sprintName: string;
  labName: string;
  onClose?: () => void;
}) {
  const allowed = task.allowedLanguages && task.allowedLanguages.length > 1
    ? task.allowedLanguages
    : null;
  const [lang, setLang] = useState<Language>(task.language);

  useEffect(() => { setLang(task.language); }, [task.id, task.language]);

  const files = useMemo(() => defaultFiles(task, lang), [task, lang]);
  const [activeFile, setActiveFile] = useState(files[0]?.name);
  const [contents, setContents] = useState<Record<string, string>>(
    () => Object.fromEntries(files.map(f => [f.name, f.content]))
  );

  // Reset editor contents when the language or ticket changes.
  useEffect(() => {
    setContents(Object.fromEntries(files.map(f => [f.name, f.content])));
    setActiveFile(files[0]?.name);
  }, [task.id, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const [folderOpen, setFolderOpen] = useState(true);
  const [sideTab, setSideTab] = useState<SideTab>("explorer");

  const exts = useMemo(() => {
    if (activeFile?.endsWith(".md")) return [];
    if (activeFile?.endsWith(".sql")) return [cmSql()];
    if (activeFile?.endsWith(".html")) return [cmHtml()];
    if (activeFile?.endsWith(".css")) return [cmCss()];
    return extFor(lang);
  }, [activeFile, lang]);

  const isNone = task.editor === "none";
  const rootLabel = `${labName.toLowerCase().replace(/\s+/g, "-")}-lab`;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/60">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-primary font-semibold">{labName}</span>
            <span className="text-muted-foreground">/</span>
            <span>{sprintName}</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{task.title}</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-border">{task.difficulty}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-border">{task.xp} XP</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-border">{task.estMin}m</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClose} className="text-[11px] px-2 py-1 rounded border border-border hover:bg-accent inline-flex items-center gap-1">
            <X className="h-3 w-3" /> Close preview
          </button>
        </div>
      </div>

      {/* IDE layout */}
      <div className="flex-1 grid grid-cols-[56px_280px_1fr] min-h-0">
        {/* Activity bar — tabs */}
        <div className="border-r border-border bg-card/40 flex flex-col items-center py-2 gap-1 text-muted-foreground">
          {SIDE_TABS.map(({ id, label, Icon }) => {
            const active = sideTab === id;
            return (
              <button
                key={id}
                onClick={() => setSideTab(id)}
                title={label}
                className={`w-full flex flex-col items-center gap-0.5 py-2 border-l-2 ${active ? "border-primary text-primary bg-primary/5" : "border-transparent hover:text-foreground hover:bg-accent/40"}`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[9px] font-medium">{label}</span>
              </button>
            );
          })}
          <div className="flex-1" />
          <Settings className="h-4 w-4 mb-2" />
        </div>

        {/* Side panel — content depends on active tab */}
        <div className="border-r border-border bg-card/30 overflow-auto">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
            {SIDE_TABS.find(t => t.id === sideTab)?.label}
          </div>

          {sideTab === "explorer" && (
            <div className="p-2 text-xs">
              <button onClick={() => setFolderOpen(o => !o)} className="flex items-center gap-1 w-full text-left hover:bg-accent rounded px-1 py-0.5">
                {folderOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {folderOpen ? <FolderOpen className="h-3 w-3 text-primary" /> : <Folder className="h-3 w-3 text-primary" />}
                <span className="font-mono text-[11px] truncate">{rootLabel}</span>
              </button>
              {folderOpen && (
                <ul className="ml-4 mt-1 space-y-0.5 border-l border-border/60 pl-2">
                  {files.map(f => {
                    const active = activeFile === f.name;
                    return (
                      <li key={f.name}>
                        <button
                          onClick={() => setActiveFile(f.name)}
                          className={`w-full flex items-center gap-1 px-1.5 py-1 rounded text-[11px] font-mono ${active ? "bg-primary/15 text-primary" : "hover:bg-accent"}`}
                        >
                          {f.name.endsWith(".sql") ? <Database className="h-3 w-3" /> : <FileCode2 className="h-3 w-3" />}
                          <span className="truncate">{f.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {sideTab === "problem" && (
            <div className="p-4">
              <h3 className="text-base font-semibold mb-2">{task.title}</h3>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {task.description || "No description yet. Add one in the ticket config to see it here."}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="rounded border border-border p-2"><div className="font-mono text-sm">{task.estMin}m</div><div className="text-muted-foreground">est.</div></div>
                <div className="rounded border border-border p-2"><div className="font-mono text-sm">{task.xp}</div><div className="text-muted-foreground">XP</div></div>
                <div className="rounded border border-border p-2"><div className="font-mono text-sm capitalize">{task.editor}</div><div className="text-muted-foreground">{isNone ? "—" : lang}</div></div>
              </div>
              {task.starterPath && (
                <div className="mt-4 text-[10px] text-muted-foreground">
                  <div className="uppercase tracking-wider mb-1">Starter path</div>
                  <code className="font-mono text-[11px] bg-background px-2 py-1 rounded border border-border block break-all">{task.starterPath}</code>
                </div>
              )}
            </div>
          )}

          {sideTab === "hints" && (
            <div className="p-4 text-xs whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {task.hints?.trim()
                ? task.hints
                : "No hints yet. Add hints in the ticket config to guide learners without spoilers."}
            </div>
          )}

          {sideTab === "solution" && (
            <div className="p-3">
              {task.solution?.trim() ? (
                <pre className="font-mono text-[11px] bg-background border border-border rounded p-3 overflow-auto whitespace-pre-wrap leading-5">
{task.solution}
                </pre>
              ) : (
                <div className="text-xs text-muted-foreground p-2">
                  No reference solution yet. Add one in the ticket config.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Editor column */}
        <div className="flex min-h-0">
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs / toolbar */}
            <div className="flex items-center justify-between border-b border-border bg-background/40 px-2">
              <div className="flex">
                {activeFile && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono border-r border-border bg-card/60">
                    {activeFile.endsWith(".sql") ? <Database className="h-3 w-3 text-primary" /> : <FileCode2 className="h-3 w-3 text-primary" />}
                    {activeFile}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 py-1">
                {allowed && !isNone && (
                  <label className="text-[10px] inline-flex items-center gap-1 mr-1 text-muted-foreground">
                    Language
                    <select
                      value={lang}
                      onChange={e => setLang(e.target.value as Language)}
                      className="text-[10px] bg-background border border-border rounded px-1.5 py-0.5"
                    >
                      {allowed.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </label>
                )}
                <button className="text-[10px] px-2 py-1 rounded border border-border inline-flex items-center gap-1"><Save className="h-3 w-3" /> Save</button>
                <button className="text-[10px] px-2 py-1 rounded bg-primary text-primary-foreground inline-flex items-center gap-1"><Play className="h-3 w-3" /> Run</button>
                <button className="text-[10px] px-2 py-1 rounded border border-border inline-flex items-center gap-1"><Send className="h-3 w-3" /> Submit</button>
              </div>
            </div>

            {/* Editor body */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {isNone ? (
                <div className="h-full grid place-items-center p-8 text-xs text-muted-foreground text-center">
                  Theory / quiz ticket — no editor will be shown to the student.
                </div>
              ) : activeFile ? (
                <CodeMirror
                  value={contents[activeFile] ?? ""}
                  onChange={v => setContents(c => ({ ...c, [activeFile]: v }))}
                  extensions={exts}
                  theme={vscodeDark}
                  height="100%"
                  style={{ height: "100%" }}
                  basicSetup={{ lineNumbers: true, foldGutter: true }}
                />
              ) : null}
            </div>

            {/* Status bar */}
            <div className="border-t border-border bg-card/60 px-3 py-1 flex items-center justify-between text-[10px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1"><GitBranch className="h-3 w-3" /> main</span>
                <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> 0 problems</span>
                <span className="inline-flex items-center gap-1"><TerminalIcon className="h-3 w-3" /> ready</span>
              </div>
              <div className="flex items-center gap-3">
                <span>{task.editor === "sql" ? "PostgreSQL 16" : `${lang}`}</span>
                <span>UTF-8</span>
                <span>Ln 1, Col 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
