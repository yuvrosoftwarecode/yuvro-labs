import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { html as cmHtml } from "@codemirror/lang-html";
import { css as cmCss } from "@codemirror/lang-css";
import { sql as cmSql } from "@codemirror/lang-sql";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Play, Save, Send, FileCode2, Database, BookOpen } from "lucide-react";
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

export function TaskPreview({ task, sprintName, labName }: { task: LabTask; sprintName: string; labName: string }) {
  const [code, setCode] = useState(task.starterCode);
  const [tab, setTab] = useState<"brief" | "editor">("brief");
  const exts = useMemo(() => extFor(task.language), [task.language]);

  const isSql = task.editor === "sql";
  const isNone = task.editor === "none";

  return (
    <div className="rounded-lg border border-border bg-card/40 overflow-hidden">
      {/* Mock student header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background/40">
        <div className="text-[11px] text-muted-foreground">
          <span className="text-primary">{labName}</span> · {sprintName} · <span className="text-foreground">{task.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-border">{task.difficulty}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-border">{task.xp} XP</span>
        </div>
      </div>

      {/* Two-pane: brief + editor */}
      <div className="grid md:grid-cols-2 min-h-[420px]">
        {/* Brief */}
        <div className="border-r border-border p-4 overflow-auto max-h-[520px]">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
            <BookOpen className="h-3 w-3" /> Problem description
          </div>
          <h3 className="text-base font-semibold mb-2">{task.title}</h3>
          <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {task.description || "No description yet. Add a description in the Task config to see it here."}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="rounded border border-border p-2"><div className="font-mono text-sm">{task.estMin}m</div><div className="text-muted-foreground">est.</div></div>
            <div className="rounded border border-border p-2"><div className="font-mono text-sm">{task.xp}</div><div className="text-muted-foreground">XP</div></div>
            <div className="rounded border border-border p-2"><div className="font-mono text-sm capitalize">{task.editor}</div><div className="text-muted-foreground">{isNone ? "—" : task.language}</div></div>
          </div>
        </div>

        {/* Editor / SQL / None */}
        <div className="flex flex-col">
          {isNone ? (
            <div className="flex-1 grid place-items-center p-8 text-xs text-muted-foreground text-center">
              Theory / quiz task — no editor will be shown to the student.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-background/40">
                <div className="flex items-center gap-1.5 text-[11px]">
                  {isSql ? <Database className="h-3 w-3 text-primary" /> : <FileCode2 className="h-3 w-3 text-primary" />}
                  <span className="font-mono">{isSql ? "query.sql" : `main.${extLabel(task.language)}`}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="text-[10px] px-2 py-1 rounded border border-border inline-flex items-center gap-1"><Save className="h-3 w-3" /> Save</button>
                  <button className="text-[10px] px-2 py-1 rounded bg-primary text-primary-foreground inline-flex items-center gap-1"><Play className="h-3 w-3" /> Run</button>
                  <button className="text-[10px] px-2 py-1 rounded border border-border inline-flex items-center gap-1"><Send className="h-3 w-3" /> Submit</button>
                </div>
              </div>
              <div className="flex-1 min-h-[280px]">
                <CodeMirror
                  value={code}
                  onChange={setCode}
                  extensions={exts}
                  theme={vscodeDark}
                  height="320px"
                  basicSetup={{ lineNumbers: true, foldGutter: true }}
                />
              </div>
              {isSql && (
                <div className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground bg-background/40">
                  Results panel (mock) — student will see query output here.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
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
