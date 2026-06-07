import { createFileRoute, Link, Outlet, useMatch, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { DiffBadge, StatusBadge } from "@/components/Badges";
import { tickets, labs } from "@/lib/dummy";
import {
  Play, Save, Send, Lightbulb, AlertTriangle, ChevronRight, ChevronDown, ChevronLeft,
  FileCode2, Folder, FolderOpen, Search, GitBranch, Bug, Package, Settings,
  CircleDot, Terminal as TerminalIcon, CheckCircle2, XCircle, Clock, Zap,
  MessageSquare, Lock, Unlock, RotateCcw, Copy, Share2, Flag, HelpCircle,
  Sparkles, Gauge, Wand2, Globe, Check, ArrowLeft, PanelLeftClose, PanelLeftOpen, BookOpen,
  FilePlus, FolderPlus, Pencil, Trash2,
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { html as cmHtml } from "@codemirror/lang-html";
import { markdown as cmMarkdown } from "@codemirror/lang-markdown";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export const Route = createFileRoute("/lab/$slug/ticket/$ticketId")({ component: TicketEditor });

const STARTER_MAIN = `public class Main {
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

const STARTER_TEST = `import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MainTest {
    @Test void variablesDeclared() { assertTrue(true); }
    @Test void implicitCast()      { assertEquals(42.0, (double) 42); }
    @Test void explicitCast()      { assertEquals(3, (int) 3.99); }
    @Test void stringLength()      { assertEquals(10, "Hello Java".length()); }
    @Test void outputFormat()      { assertEquals("Result: 42", "Result: " + 42); }
}`;

const STARTER_README = `# JAVA-101 · Variables & Types

Demonstrate the 8 Java primitive types, perform implicit and explicit
casts, and use String methods (length, charAt, substring).

Run with: \`javac Main.java && java Main\``;

const FILE_LIST = ["Main.java", "MainTest.java", "README.md"] as const;
type FileName = string;

/* ---------- Django Todo App (Python) starters ---------- */
const DJANGO_FILES = [
  "todoproject/settings.py",
  "todoproject/urls.py",
  "todos/models.py",
  "todos/views.py",
  "todos/urls.py",
  "todos/forms.py",
  "todos/admin.py",
  "todos/templates/todos/base.html",
  "todos/templates/todos/todo_list.html",
  "manage.py",
  "requirements.txt",
  "README.md",
] as const;

const DJANGO_STARTERS: Record<string, string> = {
  "manage.py": `#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "todoproject.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
`,
  "requirements.txt": `Django>=5.0,<6.0
`,
  "todoproject/settings.py": `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "dev-secret-change-me"
DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "todos",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "todoproject.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
`,
  "todoproject/urls.py": `from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("todos.urls")),
]
`,
  "todos/models.py": `from django.db import models


class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["completed", "-created_at"]

    def __str__(self) -> str:
        return self.title
`,
  "todos/views.py": `from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from .forms import TodoForm
from .models import Todo


def todo_list(request):
    if request.method == "POST":
        form = TodoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("todo_list")
    else:
        form = TodoForm()

    todos = Todo.objects.all()
    return render(
        request,
        "todos/todo_list.html",
        {"todos": todos, "form": form},
    )


@require_POST
def toggle_todo(request, pk: int):
    todo = get_object_or_404(Todo, pk=pk)
    todo.completed = not todo.completed
    todo.save(update_fields=["completed"])
    return redirect("todo_list")


@require_POST
def delete_todo(request, pk: int):
    todo = get_object_or_404(Todo, pk=pk)
    todo.delete()
    return redirect("todo_list")
`,
  "todos/urls.py": `from django.urls import path

from . import views

urlpatterns = [
    path("", views.todo_list, name="todo_list"),
    path("<int:pk>/toggle/", views.toggle_todo, name="toggle_todo"),
    path("<int:pk>/delete/", views.delete_todo, name="delete_todo"),
]
`,
  "todos/forms.py": `from django import forms

from .models import Todo


class TodoForm(forms.ModelForm):
    class Meta:
        model = Todo
        fields = ["title", "description"]
        widgets = {
            "title": forms.TextInput(attrs={"placeholder": "What needs doing?"}),
            "description": forms.Textarea(attrs={"rows": 2}),
        }
`,
  "todos/admin.py": `from django.contrib import admin

from .models import Todo


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ("title", "completed", "created_at")
    list_filter = ("completed",)
    search_fields = ("title", "description")
`,
  "todos/templates/todos/base.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>{% block title %}Todos{% endblock %}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
    h1 { margin-bottom: .25rem; }
    ul { list-style: none; padding: 0; }
    li { display: flex; gap: .5rem; align-items: center; padding: .5rem 0; border-bottom: 1px solid #eee; }
    .done { text-decoration: line-through; color: #888; }
    form.inline { display: inline; }
    input[type=text], textarea { width: 100%; padding: .5rem; }
    button { cursor: pointer; }
  </style>
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>
`,
  "todos/templates/todos/todo_list.html": `{% extends "todos/base.html" %}

{% block title %}My Todos{% endblock %}

{% block content %}
  <h1>Todos</h1>
  <p>{{ todos|length }} item{{ todos|length|pluralize }}</p>

  <form method="post">
    {% csrf_token %}
    {{ form.title }}
    {{ form.description }}
    <button type="submit">Add</button>
  </form>

  <ul>
    {% for todo in todos %}
      <li>
        <form class="inline" method="post" action="{% url 'toggle_todo' todo.pk %}">
          {% csrf_token %}
          <button type="submit">{% if todo.completed %}↩{% else %}✓{% endif %}</button>
        </form>
        <span class="{% if todo.completed %}done{% endif %}">{{ todo.title }}</span>
        <form class="inline" method="post" action="{% url 'delete_todo' todo.pk %}" style="margin-left:auto">
          {% csrf_token %}
          <button type="submit">🗑</button>
        </form>
      </li>
    {% empty %}
      <li>No todos yet — add one above.</li>
    {% endfor %}
  </ul>
{% endblock %}
`,
  "README.md": `# Django Todo App

A small Django project that stores todos in SQLite and renders them with HTML templates.

## Run

\`\`\`bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
\`\`\`

Open http://127.0.0.1:8000/ to use the app.
`,
};

type TestResult = { name: string; pass: boolean; time: string; expected?: string; got?: string };
type BottomTab = "output" | "errors" | "tests" | "quality" | "preview" | "terminal";

function TicketEditor() {
  const { slug, ticketId } = useParams({ from: "/lab/$slug/ticket/$ticketId" });
  const navigate = useNavigate({ from: "/lab/$slug/ticket/$ticketId" });
  const reviewMatch = useMatch({ from: "/lab/$slug/ticket/$ticketId/review", shouldThrow: false });
  const lab = labs.find((l) => l.slug === slug) ?? labs[0];
  const ticket = tickets.find((t) => t.id === ticketId) ?? tickets[0];
  const isDjango = ticket.tag === "Django Todo";
  const initialFileList: readonly string[] = isDjango ? DJANGO_FILES : FILE_LIST;
  const starters: Record<string, string> = isDjango
    ? DJANGO_STARTERS
    : { "Main.java": STARTER_MAIN, "MainTest.java": STARTER_TEST, "README.md": STARTER_README };
  const primaryFile = isDjango ? "todos/views.py" : "Main.java";

  const [tab, setTab] = useState<"problem" | "hints" | "discuss">("problem");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [activeFile, setActiveFile] = useState<FileName>(initialFileList[0]);
  const [bottomTab, setBottomTab] = useState<BottomTab>("tests");
  const [hintLevel, setHintLevel] = useState(2);
  const [elapsed, setElapsed] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showProgress, setShowProgress] = useState(true);
  const [fileTreeOpen, setFileTreeOpen] = useState(true);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const toggleFolder = (k: string) => setOpenFolders((o) => ({ ...o, [k]: !(o[k] ?? true) }));
  const isFolderOpen = (k: string) => openFolders[k] ?? true;
  const [sidePanel, setSidePanel] = useState<null | "preview" | "mentor">(null);
  const [previewDevice, setPreviewDevice] = useState<"Mobile" | "Tablet" | "Desktop">("Desktop");
  const [sideWidth, setSideWidth] = useState<number | null>(null);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    const container = splitContainerRef.current;
    if (!container) return;
    const onMove = (ev: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const next = rect.right - ev.clientX;
      const min = 260;
      const max = Math.max(min + 100, rect.width - 320);
      setSideWidth(Math.min(max, Math.max(min, next)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  useEffect(() => { setSideWidth(null); }, [sidePanel]);
  const [files, setFiles] = useState<Record<string, string>>(starters);
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const fileList = useMemo(() => Object.keys(files), [files]);

  // Reset file state when switching tickets (esp. between Java and Django sets)
  useEffect(() => {
    setFiles(starters);
    setDirty({});
    setActiveFile(initialFileList[0]);
    setTestsRan(false);
    setOutput("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket.id]);

  // ---- File ops (VS Code-like): create / rename / delete ----
  function createFile(path: string, contents = "") {
    const trimmed = path.trim().replace(/^\/+/, "");
    if (!trimmed) return;
    if (files[trimmed] !== undefined) { showToast("File already exists"); return; }
    setFiles((f) => ({ ...f, [trimmed]: contents }));
    setDirty((d) => ({ ...d, [trimmed]: true }));
    setActiveFile(trimmed);
  }
  function renameFile(oldPath: string, newPath: string) {
    const trimmed = newPath.trim().replace(/^\/+/, "");
    if (!trimmed || trimmed === oldPath) return;
    if (files[trimmed] !== undefined) { showToast("Target path already exists"); return; }
    setFiles((f) => {
      const { [oldPath]: content, ...rest } = f;
      return { ...rest, [trimmed]: content ?? "" };
    });
    setDirty((d) => {
      const { [oldPath]: was, ...rest } = d;
      return { ...rest, [trimmed]: true };
    });
    if (activeFile === oldPath) setActiveFile(trimmed);
  }
  function deleteFile(path: string) {
    if (!confirm(`Delete ${path}?`)) return;
    setFiles((f) => {
      const { [path]: _drop, ...rest } = f;
      return rest;
    });
    setDirty((d) => {
      const { [path]: _drop, ...rest } = d;
      return rest;
    });
    if (activeFile === path) {
      const next = Object.keys(files).filter((p) => p !== path)[0];
      if (next) setActiveFile(next);
    }
  }
  function deleteFolder(prefix: string) {
    const targets = Object.keys(files).filter((p) => p === prefix || p.startsWith(prefix + "/"));
    if (targets.length === 0) return;
    if (!confirm(`Delete folder ${prefix}/ and ${targets.length} file(s)?`)) return;
    setFiles((f) => {
      const next = { ...f };
      targets.forEach((p) => { delete next[p]; });
      return next;
    });
    setDirty((d) => {
      const next = { ...d };
      targets.forEach((p) => { delete next[p]; });
      return next;
    });
    if (targets.includes(activeFile)) {
      const remaining = Object.keys(files).filter((p) => !targets.includes(p));
      if (remaining[0]) setActiveFile(remaining[0]);
    }
  }
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Test 1 · Variables Declaration", pass: false, time: "—" },
    { name: "Test 2 · Type Casting (implicit)", pass: false, time: "—" },
    { name: "Test 3 · Type Casting (explicit)", pass: false, time: "—" },
    { name: "Test 4 · String Operations", pass: false, time: "—" },
    { name: "Test 5 · Output Format", pass: false, time: "—" },
  ]);
  const [testsRan, setTestsRan] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Keyboard: Ctrl/Cmd+Enter to run
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); handleRun(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); handleSave(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  });

  const passed = tests.filter((t) => t.pass).length;
  const allPass = testsRan && passed === tests.length;
  const timeStr = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  const code = files[activeFile];

  // Simple compile-state heuristic based on Main.java code
  const compileState: "ok" | "warn" | "err" = useMemo(() => {
    const m = files["Main.java"];
    if (!/class\s+\w+/.test(m) || !/public\s+static\s+void\s+main/.test(m)) return "err";
    if (/\bcastedDouble\b/.test(m) && !/println.*castedDouble|System\.out.*castedDouble/.test(m)) return "warn";
    return "ok";
  }, [files]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function handleRun() {
    setRunning(true);
    setBottomTab("output");
    setOutput("$ javac Main.java\n$ java Main\n…running…\n");
    setTimeout(() => {
      const m = files["Main.java"];
      if (compileState === "err") {
        setOutput("$ javac Main.java\n❌ Main.java:1: error: class or main method missing\n1 error");
        setBottomTab("errors");
      } else {
        // crude simulation of expected printlns
        const out: string[] = [];
        const re = /System\.out\.println\("([^"]*)"\s*\+\s*([^)]+)\)/g;
        let match;
        const ctx: Record<string, string> = {
          integerValue: "42", pi: "3.14", isJavaFun: "true", greeting: "Hello Java",
        };
        while ((match = re.exec(m))) {
          const label = match[1];
          let val = match[2].trim();
          if (val.endsWith(".length()")) val = String(("Hello Java").length);
          else if (val.endsWith(".charAt(0)")) val = "H";
          else val = ctx[val] ?? val;
          out.push(label + val);
        }
        setOutput("$ javac Main.java\n$ java Main\n" + out.join("\n") + "\n\n✓ Program ran successfully (1.2s)");
      }
      setRunning(false);
    }, 700);
  }

  function handleRunTests() {
    setBottomTab("tests");
    setTests((ts) => ts.map((t) => ({ ...t, time: "…", pass: false })));
    setTimeout(() => {
      const m = files["Main.java"];
      const next: TestResult[] = [
        { name: "Test 1 · Variables Declaration", pass: /int\s+\w+\s*=/.test(m) && /double\s+\w+\s*=/.test(m), time: "12ms" },
        { name: "Test 2 · Type Casting (implicit)", pass: /double\s+\w+\s*=\s*\w+\s*;/.test(m), time: "8ms" },
        { name: "Test 3 · Type Casting (explicit)", pass: /\(int\)\s*\w/.test(m), time: "9ms" },
        { name: "Test 4 · String Operations", pass: /\.length\(\)/.test(m) && /\.charAt\(/.test(m), time: "7ms" },
        { name: "Test 5 · Output Format", pass: /printf\(/.test(m), time: "11ms", expected: '"Result: 42"', got: '"Result42"' },
      ];
      setTests(next);
      setTestsRan(true);
    }, 600);
  }

  function handleSubmit() {
    setBottomTab("tests");
    setTests((ts) => ts.map((t) => ({ ...t, time: "…", pass: false })));
    setTimeout(() => {
      const m = files["Main.java"];
      const next: TestResult[] = [
        { name: "Test 1 · Variables Declaration", pass: /int\s+\w+\s*=/.test(m) && /double\s+\w+\s*=/.test(m), time: "12ms" },
        { name: "Test 2 · Type Casting (implicit)", pass: /double\s+\w+\s*=\s*\w+\s*;/.test(m), time: "8ms" },
        { name: "Test 3 · Type Casting (explicit)", pass: /\(int\)\s*\w/.test(m), time: "9ms" },
        { name: "Test 4 · String Operations", pass: /\.length\(\)/.test(m) && /\.charAt\(/.test(m), time: "7ms" },
        { name: "Test 5 · Output Format", pass: /System\.out\.println/.test(m) || /printf\(/.test(m), time: "11ms" },
      ];
      setTests(next);
      setTestsRan(true);
      if (next.every((t) => t.pass)) {
        navigate({ to: "/lab/$slug/ticket/$ticketId/review", params: { slug, ticketId } });
      } else {
        showToast("Fix failing tests before submitting");
      }
    }, 600);
  }

  function handleSave() {
    setDirty({ "Main.java": false, "MainTest.java": false, "README.md": false });
    const now = new Date();
    setSavedAt(`${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`);
    showToast("Saved");
  }

  function handleReset() {
    if (!confirm("Reset code to starter template?")) return;
    setFiles({ "Main.java": STARTER_MAIN, "MainTest.java": STARTER_TEST, "README.md": STARTER_README });
    setDirty({ "Main.java": false, "MainTest.java": false, "README.md": false });
    setTestsRan(false);
    setOutput("");
    showToast("Code reset");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(files["Main.java"]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      showToast("Template copied");
    } catch {
      showToast("Copy failed");
    }
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(`${ticket.id} solution by @alex\n\n\`\`\`java\n${files["Main.java"]}\n\`\`\``);
      showToast("Share link copied");
    } catch { showToast("Copy failed"); }
  }

  function updateCode(v: string) {
    setFiles((f) => ({ ...f, [activeFile]: v }));
    setDirty((d) => ({ ...d, [activeFile]: true }));
  }

  function toggleTheme() {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }

  if (reviewMatch) return <Outlet />;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top sub-bar (no global nav — full-page editor) */}
      <div className="flex flex-wrap items-center gap-3 border-b bg-card/60 px-3 py-2 text-xs">
        <Link to="/lab/$slug" params={{ slug }} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-accent">
          <ArrowLeft className="h-3 w-3" />Exit
        </Link>
        <button onClick={() => setLeftCollapsed((v) => !v)} title="Toggle panel"
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-accent">
          {leftCollapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
          <span className="hidden md:inline">{leftCollapsed ? "Show" : "Hide"} panel</span>
        </button>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="text-foreground font-mono">{ticket.id}</span>
        </div>
        <StatusBadge value={ticket.status} />
        <DiffBadge value={ticket.difficulty} />
        <span className="text-muted-foreground inline-flex items-center gap-1"><Zap className="h-3 w-3 text-primary" />+{ticket.xp} XP</span>
        <span className="text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />Est. {ticket.estMin}m · Elapsed <span className="font-mono text-foreground">{timeStr}</span></span>
        {savedAt && <span className="text-success inline-flex items-center gap-1"><Check className="h-3 w-3" />Saved {savedAt}</span>}

        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setSidePanel((p) => p === "preview" ? null : "preview")}
            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 hover:bg-accent ${sidePanel === "preview" ? "bg-accent text-foreground border-primary/40" : ""}`}>
            <Globe className="h-3 w-3" />Preview
          </button>
          <button onClick={() => setSidePanel((p) => p === "mentor" ? null : "mentor")}
            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 hover:bg-accent ${sidePanel === "mentor" ? "bg-accent text-foreground border-primary/40" : ""}`}>
            <Sparkles className="h-3 w-3" />AI Mentor
          </button>
          <button onClick={handleRun} disabled={running} className="inline-flex items-center gap-1 rounded-md bg-success/20 text-success border border-success/40 px-3 py-1 hover:bg-success/30 font-medium disabled:opacity-60">
            <Play className="h-3 w-3" />{running ? "Running…" : "Run"} <kbd className="hidden md:inline rounded bg-success/20 px-1 text-[10px]">⌘↵</kbd>
          </button>
          <button onClick={handleSubmit}
            className="inline-flex items-center gap-1 rounded-md px-3 py-1 font-medium bg-primary text-primary-foreground hover:opacity-90">
            <Send className="h-3 w-3" />Submit
          </button>
        </div>
      </div>

      {/* MAIN IDE */}
      <div className="flex flex-1 min-h-0">
        {/* Activity bar */}
        <div className="flex w-11 flex-col items-center gap-1 border-r bg-editor-panel py-2 text-muted-foreground">
          <button
            onClick={() => setFileTreeOpen((v) => !v)}
            title={fileTreeOpen ? "Hide Explorer" : "Show Explorer"}
            className={`grid h-9 w-9 place-items-center rounded ${fileTreeOpen ? "text-foreground bg-accent" : "hover:text-foreground"}`}
          ><FileCode2 className="h-4 w-4" /></button>
          {[Search, GitBranch, Bug, Package].map((I, i) => (
            <button key={i} className="grid h-9 w-9 place-items-center rounded hover:text-foreground"><I className="h-4 w-4" /></button>
          ))}
          <Settings className="mt-auto h-4 w-4" />
        </div>

        {/* Left panel (collapsible) */}
        {leftCollapsed ? (
          <aside className="hidden md:flex w-10 flex-col items-center gap-1 border-r bg-editor-panel py-2 text-muted-foreground">
            {[
              { k: "problem", I: BookOpen, label: "Problem" },
              { k: "hints", I: Lightbulb, label: "Hints" },
              { k: "discuss", I: MessageSquare, label: "Discuss" },
            ].map(({ k, I, label }) => (
              <button key={k} title={label} onClick={() => { setLeftCollapsed(false); setTab(k as typeof tab); }}
                className="grid h-9 w-9 place-items-center rounded hover:text-foreground hover:bg-accent">
                <I className="h-4 w-4" />
              </button>
            ))}
            <button onClick={() => setLeftCollapsed(false)} title="Expand panel"
              className="mt-auto grid h-9 w-9 place-items-center rounded hover:text-foreground hover:bg-accent">
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </aside>
        ) : (
          <aside className="hidden md:flex w-[30%] min-w-[300px] max-w-[460px] flex-col border-r bg-editor-panel">
            <div className="flex items-center border-b text-xs">
              {[
                { k: "problem", label: "Problem" },
                { k: "hints", label: "Hints" },
                { k: "discuss", label: "Discuss" },
              ].map((t) => (
                <button key={t.k} onClick={() => setTab(t.k as typeof tab)}
                  className={`px-3 py-2 ${tab === t.k ? "bg-editor-bg text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>{t.label}</button>
              ))}
              <button onClick={() => setLeftCollapsed(true)} title="Collapse panel"
                className="ml-auto mr-2 grid h-7 w-7 place-items-center rounded hover:bg-accent text-muted-foreground hover:text-foreground">
                <PanelLeftClose className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto scrollbar-thin p-4 text-sm space-y-3">
              {tab === "problem" && <ProblemPanel ticket={ticket} />}
              {tab === "hints" && <HintsPanel level={hintLevel} setLevel={setHintLevel} elapsed={elapsed} onUnlock={(n, c) => showToast(`Hint ${n} unlocked${c ? ` (${c})` : ""}`)} />}
              {tab === "discuss" && <DiscussPanel />}
            </div>
          </aside>
        )}

        {/* Center editor */}
        <section className="flex flex-1 min-w-0 flex-col relative">
          <div ref={splitContainerRef} className="flex flex-1 min-h-0">
            {/* File tree */}
            {fileTreeOpen && (
              <div className="flex w-60 shrink-0 flex-col border-r bg-editor-panel text-xs">
                <div className="flex items-center justify-between px-3 py-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <span>Explorer</span>
                  <div className="flex items-center gap-1 normal-case">
                    <button
                      title="New File"
                      onClick={() => {
                        const name = prompt("New file path (e.g. todos/utils.py)");
                        if (name) createFile(name);
                      }}
                      className="grid h-5 w-5 place-items-center rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                    ><FilePlus className="h-3.5 w-3.5" /></button>
                    <button
                      title="New Folder"
                      onClick={() => {
                        const name = prompt("New folder path (e.g. todos/api)");
                        if (name) {
                          const folder = name.replace(/\/+$/, "");
                          createFile(`${folder}/.gitkeep`, "");
                        }
                      }}
                      className="grid h-5 w-5 place-items-center rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                    ><FolderPlus className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto px-1 pb-2">
                  <FileTree
                    rootLabel={isDjango ? "todo-app" : ticket.id.toLowerCase()}
                    paths={fileList}
                    activeFile={activeFile}
                    dirty={dirty}
                    onOpenFile={setActiveFile}
                    onCreateFile={createFile}
                    onRenameFile={renameFile}
                    onDeleteFile={deleteFile}
                    onDeleteFolder={deleteFolder}
                    isFolderOpen={isFolderOpen}
                    toggleFolder={toggleFolder}
                  />
                </div>
                <div className="mt-auto border-t px-3 py-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1"><GitBranch className="h-3 w-3" /> main</div>
                </div>
              </div>
            )}


            <div className="flex flex-1 min-w-0 flex-col">

              {/* Tabs row */}
              <div className="flex items-center border-b bg-editor-panel text-xs overflow-x-auto">
                {fileList.map((f) => (
                  <button key={f} onClick={() => setActiveFile(f)}
                    className={`flex items-center gap-2 border-r px-3 py-2 whitespace-nowrap ${activeFile === f ? "bg-editor-bg text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <FileCode2 className="h-3 w-3" />{f.split("/").pop()}
                    {dirty[f] && <CircleDot className="h-2.5 w-2.5 text-warning" />}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2 pr-3 text-[11px] text-muted-foreground whitespace-nowrap">
                  {!isDjango && <CompileBadge state={compileState} />}
                  <button onClick={toggleTheme} className="rounded border px-2 py-0.5 hover:bg-accent">
                    {theme === "dark" ? "☀ Light" : "🌙 Dark"}
                  </button>
                  <button title="Format" onClick={() => showToast("Code formatted")} className="rounded border px-2 py-0.5 hover:bg-accent"><Wand2 className="h-3 w-3" /></button>
                </div>
              </div>

              {/* Breadcrumb path (VS Code style) */}
              <div className="flex items-center gap-1 border-b bg-editor-bg/60 px-3 py-1 text-[11px] text-muted-foreground overflow-x-auto whitespace-nowrap">
                <Folder className="h-3 w-3 text-info shrink-0" />
                {activeFile.split("/").map((seg, i, arr) => {
                  const isLast = i === arr.length - 1;
                  return (
                    <span key={i} className="inline-flex items-center gap-1">
                      {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
                      <span className={isLast ? "text-foreground" : ""}>
                        {isLast ? <FileCode2 className="inline h-3 w-3 mr-1 text-info" /> : null}
                        {seg}
                      </span>
                    </span>
                  );
                })}
                <span className="ml-auto pl-3 text-[10px] uppercase tracking-wider">
                  {editorLanguage(activeFile)}
                </span>
              </div>

              {/* Editor */}
              <div className="flex flex-1 min-h-0">
                <CodeEditor code={code} onChange={updateCode} language={editorLanguage(activeFile)} />
              </div>


              {/* Bottom panel */}
              <div className="border-t bg-editor-panel">
                <div className="flex items-center border-b text-xs overflow-x-auto">
                  {[
                    { k: "output", label: "Console", icon: TerminalIcon },
                    { k: "errors", label: "Errors", icon: AlertTriangle },
                    { k: "preview", label: "Preview", icon: Globe },
                    { k: "terminal", label: "Terminal", icon: TerminalIcon },
                  ].map((t) => (
                    <button key={t.k} onClick={() => setBottomTab(t.k as BottomTab)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 uppercase tracking-wide ${bottomTab === t.k ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
                      <t.icon className="h-3 w-3" />{t.label}
                    </button>
                  ))}
                </div>
                <div className="h-52 overflow-auto scrollbar-thin p-3 text-xs">
                  {bottomTab === "output" && <OutputView output={output} />}
                  {bottomTab === "errors" && <ErrorsView state={compileState} />}
                  {bottomTab === "preview" && (isDjango ? <DjangoTodoPreview /> : <PreviewView />)}
                  {bottomTab === "terminal" && <TerminalView />}
                </div>
              </div>
            </div>

            {sidePanel && (
              <div
                role="separator"
                onMouseDown={startResize}
                className="w-1 cursor-col-resize bg-border hover:bg-primary/50 transition-colors"
                title="Drag to resize"
              />
            )}
            {sidePanel && (
              <aside
                className="flex flex-col bg-editor-panel min-w-0"
                style={{ flex: sideWidth != null
                  ? `0 0 ${sideWidth}px`
                  : `0 0 ${sidePanel === "preview" ? "clamp(360px, 44%, 680px)" : "clamp(320px, 36%, 540px)"}` }}
              >
                <div className="flex items-center gap-2 border-b px-3 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                    {sidePanel === "preview" ? <><Globe className="h-3 w-3" />Live Preview</> : <><Sparkles className="h-3 w-3 text-primary" />AI Mentor</>}
                  </span>
                  {sidePanel === "preview" && (
                    <div className="flex items-center gap-1">
                      {(["Mobile", "Tablet", "Desktop"] as const).map((d) => (
                        <button key={d} onClick={() => setPreviewDevice(d)}
                          className={`rounded border px-2 py-0.5 text-[10px] ${previewDevice === d ? "bg-accent text-foreground border-primary/40" : "text-muted-foreground hover:bg-accent"}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setSidePanel(null)} className="ml-auto text-muted-foreground hover:text-foreground">✕</button>
                </div>
                <div className="flex-1 overflow-auto scrollbar-thin p-3 text-xs min-w-0">
                  {sidePanel === "preview"
                    ? <SidePreview device={previewDevice} isDjango={isDjango} />
                    : <SideMentor onAsk={(q) => showToast(`Mentor: ${q}`)} />}
                </div>
              </aside>
            )}

          </div>

        </section>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 border-t bg-primary/90 px-3 py-1 text-[11px] text-primary-foreground">
        <span className="inline-flex items-center gap-1"><GitBranch className="h-3 w-3" /> main</span>
        <span>{isDjango ? "Python 3.12 · Django 5" : "Java 17"}</span>
        <span>UTF-8</span>
        <span>LF</span>
        {!isDjango && (
          <span className="inline-flex items-center gap-1">
            {compileState === "ok" && <><CheckCircle2 className="h-3 w-3" />Compiled</>}
            {compileState === "warn" && <><AlertTriangle className="h-3 w-3" />1 warning</>}
            {compileState === "err" && <><XCircle className="h-3 w-3" />Compile error</>}
          </span>
        )}
        <span className="ml-auto">{activeFile} · {code.split("\n").length} lines</span>
      </div>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md border bg-card px-4 py-2 text-sm shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ---------- Editor ---------- */

type EditorLang = "java" | "py" | "html" | "md" | "txt";
function editorLanguage(file: string): EditorLang {
  if (file.endsWith(".py")) return "py";
  if (file.endsWith(".html")) return "html";
  if (file.endsWith(".md")) return "md";
  if (file.endsWith(".java")) return "java";
  return "txt";
}

function CodeEditor({ code, onChange, language }: { code: string; onChange: (v: string) => void; language: EditorLang }) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lines = code.split("\n");

  const syncScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  // Tab indent
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart, en = ta.selectionEnd;
      const v = ta.value;
      const next = v.slice(0, s) + "    " + v.slice(en);
      onChange(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 4; });
    }
  };

  return (
    <div className="relative flex flex-1 min-w-0 overflow-hidden bg-editor-bg font-mono text-[13px] leading-6">
      <div aria-hidden className="select-none px-3 py-3 text-right text-editor-gutter border-r border-editor-line/40 bg-editor-panel/40">
        {lines.map((_, i) => <div key={i} className="h-6">{i + 1}</div>)}
      </div>
      <div className="relative flex-1 min-w-0">
        <pre ref={preRef} aria-hidden
          className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre py-3 px-3 scrollbar-thin">
          {lines.map((l, i) => (
            <div key={i} className="h-6" dangerouslySetInnerHTML={{ __html: language === "java" ? (highlight(l) || "&nbsp;") : escapeHtml(l) || "&nbsp;" }} />
          ))}
        </pre>
        <textarea
          ref={taRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyDown={onKey}
          spellCheck={false}
          className="absolute inset-0 w-full h-full resize-none overflow-auto whitespace-pre py-3 px-3 bg-transparent text-transparent caret-foreground outline-none scrollbar-thin selection:bg-primary/30"
          style={{ caretColor: "var(--foreground)" }}
        />
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

function TestsView({ tests, ran, onRun }: { tests: TestResult[]; ran: boolean; onRun: () => void }) {
  const passed = tests.filter((t) => t.pass).length;
  if (!ran) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <CheckCircle2 className="h-6 w-6" />
        <div>No test results yet</div>
        <button onClick={onRun} className="rounded border bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90">Run tests</button>
      </div>
    );
  }
  return (
    <div className="font-mono space-y-1.5">
      <div className="text-muted-foreground">Running tests… completed in 0.12s</div>
      <div className="border-b border-dashed my-1" />
      {tests.map((t) => (
        <div key={t.name}>
          <div className="flex items-center gap-2">
            {t.pass ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
            <span className={t.pass ? "" : "text-destructive"}>{t.name}</span>
            <span className="ml-auto text-muted-foreground">{t.time}</span>
          </div>
          {!t.pass && t.expected && (
            <div className="ml-5 mt-1 rounded border border-destructive/30 bg-destructive/5 p-1.5 text-[11px] text-destructive/90">
              <div>Expected: <span className="text-success">{t.expected}</span></div>
              <div>Got:      <span className="text-destructive">{t.got}</span></div>
            </div>
          )}
        </div>
      ))}
      <div className="mt-2 border-t pt-2">
        Score: <span className="text-foreground font-semibold">{passed}/{tests.length}</span> ({Math.round((passed / tests.length) * 100)}%)
        {passed < tests.length && <span className="ml-2 text-destructive">Submit when all tests pass.</span>}
      </div>
    </div>
  );
}

function OutputView({ output }: { output: string }) {
  if (!output) return <div className="text-muted-foreground">Click <span className="text-foreground font-medium">Run</span> to execute your code.</div>;
  return <pre className="font-mono text-muted-foreground whitespace-pre-wrap">{output}</pre>;
}

function ErrorsView({ state }: { state: "ok" | "warn" | "err" }) {
  const items = state === "err" ? [
    { sev: "err" as const, line: 1, msg: "Missing class or main method", fix: "Ensure 'public class Main { public static void main(String[] args) {} }'" },
  ] : state === "warn" ? [
    { sev: "warn" as const, line: 18, msg: "Unused variable 'castedDouble'", fix: "Remove the declaration or print it" },
  ] : [];
  if (!items.length) return <div className="text-muted-foreground inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" />No errors or warnings.</div>;
  return (
    <div className="space-y-1.5 font-mono">
      {items.map((e, i) => (
        <div key={i} className={`rounded border p-2 ${e.sev === "err" ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5"}`}>
          <div className="flex items-center gap-2">
            {e.sev === "err" ? <XCircle className="h-3 w-3 text-destructive" /> : <AlertTriangle className="h-3 w-3 text-warning" />}
            <span className="underline-offset-2">Main.java:{e.line}</span>
            <span className={e.sev === "err" ? "text-destructive" : "text-warning"}>{e.msg}</span>
          </div>
          <div className="mt-1 ml-5 text-[11px] text-muted-foreground">💡 {e.fix}</div>
        </div>
      ))}
    </div>
  );
}

function QualityView({ code }: { code: string }) {
  const todos = (code.match(/TODO/g) ?? []).length;
  const score = Math.max(4, 10 - todos);
  const items = [
    { ok: true, t: "Naming conventions followed" },
    { ok: true, t: "No unused imports" },
    { ok: todos === 0, sev: "warn" as const, t: `Resolve ${todos} TODO comment${todos === 1 ? "" : "s"}` },
    { ok: code.includes("/**") || code.includes("//"), sev: "warn" as const, t: "Add comments to explain logic" },
    { ok: code.split("\n").length < 40, sev: "err" as const, t: "Method too long — consider refactoring" },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold">{score}<span className="text-muted-foreground text-sm">/10</span></div>
        <div className="flex-1 h-2 rounded-full bg-accent overflow-hidden">
          <div className="h-full bg-success transition-all" style={{ width: `${score * 10}%` }} />
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

function SidePreview({ device, isDjango }: { device: "Mobile" | "Tablet" | "Desktop"; isDjango?: boolean }) {
  const w = device === "Mobile" ? 375 : device === "Tablet" ? 768 : "100%";
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex-1 grid place-items-center overflow-auto rounded border bg-accent/30 p-2">
        <div className="mx-auto h-full overflow-auto rounded bg-white text-black shadow" style={{ width: w, maxWidth: "100%" }}>
          {isDjango ? (
            <DjangoTodoApp />
          ) : (
            <div className="p-4 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Live preview</div>
              <h2 className="text-xl font-semibold">Hello Java</h2>
              <p className="text-sm text-gray-600">Integer: 42 · Double: 3.14</p>
              <p className="text-sm text-gray-600">Length: 10 · Char[0]: H</p>
              <button className="rounded bg-blue-600 px-3 py-1 text-xs text-white">Run sample</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DjangoTodoPreview() {
  return (
    <div className="h-full overflow-auto rounded border bg-white text-black">
      <DjangoTodoApp />
    </div>
  );
}

type TodoItem = { id: number; title: string; completed: boolean };

function DjangoTodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, title: "Ship Django todo MVP", completed: false },
    { id: 2, title: "Write models.py", completed: true },
    { id: 3, title: "Render templates with template inheritance", completed: false },
  ]);
  const [title, setTitle] = useState("");
  const nextId = useRef(4);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setTodos((ts) => [{ id: nextId.current++, title: t, completed: false }, ...ts]);
    setTitle("");
  };
  const toggle = (id: number) =>
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const remove = (id: number) => setTodos((ts) => ts.filter((t) => t.id !== id));

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="mx-auto max-w-[560px] p-5 font-sans">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Todos</h1>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">{remaining} left</span>
      </div>
      <p className="mb-4 text-xs text-gray-500">Django 5 · SQLite · {todos.length} item{todos.length === 1 ? "" : "s"}</p>

      <form onSubmit={add} className="mb-4 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button type="submit" className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Add
        </button>
      </form>

      <ul className="divide-y divide-gray-200 rounded border border-gray-200">
        {todos.length === 0 && <li className="p-4 text-center text-sm text-gray-500">No todos yet — add one above.</li>}
        {todos.map((t) => (
          <li key={t.id} className="flex items-center gap-3 px-3 py-2">
            <button
              onClick={() => toggle(t.id)}
              aria-label="toggle"
              className={`grid h-5 w-5 place-items-center rounded border ${t.completed ? "border-green-600 bg-green-600 text-white" : "border-gray-400 bg-white text-transparent"}`}
            >
              ✓
            </button>
            <span className={`flex-1 text-sm ${t.completed ? "text-gray-400 line-through" : "text-gray-900"}`}>{t.title}</span>
            <button onClick={() => remove(t.id)} className="text-xs text-gray-400 hover:text-red-600" aria-label="delete">
              🗑
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[10px] uppercase tracking-wider text-gray-400">POST /todos/ · CSRF protected</p>
    </div>
  );
}

function SideMentor({ onAsk }: { onAsk: (q: string) => void }) {
  const [msgs, setMsgs] = useState<{ role: "ai" | "me"; text: string }[]>([
    { role: "ai", text: "Hi! I'm your AI mentor. I can give Socratic hints — what are you stuck on?" },
  ]);
  const [input, setInput] = useState("");
  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMsgs((m) => [...m, { role: "me", text: q }, { role: "ai", text: `Think about what type each value should be. Try declaring an \`int\` and a \`double\`, then cast between them. What happens when you narrow \`3.99\` to \`int\`?` }]);
    onAsk(q);
    setInput("");
  };
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex-1 space-y-2 overflow-auto pr-1">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "me" ? "justify-end" : ""}`}>
            <div className={`max-w-[85%] rounded-md px-2.5 py-1.5 text-[12px] ${m.role === "me" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {["Explain this error", "Give a hint", "Review my code", "Why is my test failing?"].map((s) => (
          <button key={s} onClick={() => { setInput(s); }} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-accent">{s}</button>
        ))}
      </div>
      <div className="flex gap-1">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask AI mentor…" className="flex-1 rounded border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary" />
        <button onClick={send} className="rounded bg-primary px-3 text-xs text-primary-foreground">Ask</button>
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
        <div className={`h-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
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

function HintsPanel({ level, setLevel, elapsed, onUnlock }: { level: number; setLevel: (n: number) => void; elapsed: number; onUnlock: (n: number, cost: string) => void }) {
  const mins = elapsed / 60;
  const hints = [
    { n: 1, cost: "Free", title: "Think about it", body: "Think about what data type each variable needs. List the 8 Java primitives.", unlockMin: 0 },
    { n: 2, cost: mins >= 5 ? "Free" : `Free in ${Math.ceil(5 - mins)}m`, title: "Approach", body: "First declare all 8 primitive types with sensible defaults. Then print each, then attempt one cast in each direction.", unlockMin: 5 },
    { n: 3, cost: mins >= 15 ? "Free" : "10 XP", title: "Code template", body: "int a = 42;\ndouble b = a;        // implicit\nint c = (int) 3.99;  // explicit", unlockMin: 15 },
    { n: 4, cost: mins >= 25 ? "Free" : "20 XP", title: "Partial solution (50%)", body: "Use greeting.length() + greeting.charAt(0). Now complete the casting part…", unlockMin: 25 },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-warning/40 bg-warning/10 p-2 text-xs text-warning">
        <Lightbulb className="inline h-3 w-3 mr-1" /> Progressive hints — unlocking deeper hints costs XP unless you wait.
      </div>
      {hints.map((h) => {
        const unlocked = level >= h.n || mins >= h.unlockMin;
        return (
          <div key={h.n} className="rounded-md border bg-editor-bg p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Level {h.n} · {h.title}</div>
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                {unlocked ? <Unlock className="h-3 w-3 text-success" /> : <Lock className="h-3 w-3" />}{h.cost}
              </span>
            </div>
            {unlocked ? (
              <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground font-mono">{h.body}</pre>
            ) : (
              <div className="mt-2 space-y-1">
                <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />Auto-unlocks at {h.unlockMin}m elapsed</div>
                <button onClick={() => { setLevel(h.n); onUnlock(h.n, h.cost); }} className="w-full rounded border border-dashed py-1.5 text-xs hover:bg-accent">Unlock now for {h.cost}</button>
              </div>
            )}
          </div>
        );
      })}
      <div className="rounded-md border bg-editor-bg p-3 text-xs">
        <div className="font-medium inline-flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary" /> Full solution review</div>
        <div className="mt-1 text-muted-foreground">Unlocked after submission — includes annotated solution, alternatives, and best practices.</div>
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

function TreeFolder({ label, open: openProp, onToggle, children }: { label: string; open?: boolean; onToggle?: () => void; children: React.ReactNode }) {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);
  const isControlled = onToggle !== undefined;
  const open = isControlled ? (openProp ?? false) : internalOpen;
  const handleClick = () => (isControlled ? onToggle!() : setInternalOpen((o) => !o));
  return (
    <div>
      <button onClick={handleClick} className="flex w-full items-center gap-1 rounded px-1.5 py-0.5 hover:bg-accent/60">
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

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
}

function highlight(line: string): string {
  let h = escapeHtml(line);
  h = h.replace(/(\/\/.*$)/g, '<span style="color:var(--syntax-comment)">$1</span>');
  h = h.replace(/(&quot;.*?&quot;|".*?")/g, '<span style="color:var(--syntax-string)">$1</span>');
  h = h.replace(/\b(public|class|static|void|int|double|boolean|String|char|long|float|byte|short|return|if|else|for|while|new|true|false|null|import)\b/g,
    '<span style="color:var(--syntax-keyword)">$1</span>');
  h = h.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:var(--syntax-number)">$1</span>');
  h = h.replace(/\b([a-zA-Z_][\w]*)(?=\()/g, '<span style="color:var(--syntax-fn)">$1</span>');
  return h;
}
