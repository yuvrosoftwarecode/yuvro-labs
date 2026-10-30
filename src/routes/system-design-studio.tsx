import { getSystemDesignLab, getSystemDesignCriteria, SYSTEM_DESIGN_SPRINTS } from "@/lib/systemDesign";
import { evaluateSystemDesign, type DesignEvaluation } from "@/lib/systemDesignEvaluation";
import { EvaluationResults } from "@/components/sysdesign/EvaluationResults";
import { labs, tickets } from "@/lib/dummy";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Boxes, GitBranch, Database, FileText, Download, Maximize2, Minimize2, Sparkles, X, Users, Play } from "lucide-react";
import { ApiDesigner, ApiDocs, type ApiEndpoint } from "@/components/sysdesign/ApiDesigner";
import { ErdBoard } from "@/components/sysdesign/ErdBoard";
import { NotesPanel, MarkdownPreview } from "@/components/sysdesign/MarkdownNotes";
import { DiagramBoard, HldEditor, type SDNode, type SDEdge } from "@/components/sysdesign/DesignCanvas";

export const Route = createFileRoute("/system-design-studio")({
  head: () => ({ meta: [{ title: "System Design Studio · Yuvro Labs" }] }),
  component: Studio,
});

type Tab = "hld" | "sequence" | "schema" | "api";
type Notes = Partial<Record<Tab, string>>;
const LS = "yuvro-sds-v2";

type Design = { nodes: SDNode[]; edges: SDEdge[]; seq: string; schema: string; apis: ApiEndpoint[]; notes: Notes };
const EMPTY: Design = { nodes: [], edges: [], seq: "", schema: "", apis: [], notes: {} };
const api = (id: string, method: string, path: string, summary: string, request: unknown, status: string, response: unknown): ApiEndpoint =>
  ({ id, method, path, summary, request: request == null ? "" : JSON.stringify(request, null, 2), status, response: response == null ? "" : JSON.stringify(response, null, 2) });

const n = (id: string, label: string, icon: string, x: number, y: number, tag?: string): SDNode => ({ id, kind: label.toLowerCase(), label, icon, x, y, tag });
const e = (from: string, to: string, label?: string): SDEdge => ({ id: `${from}-${to}`, from, to, label });

const DEFAULT_SEQ = `sequenceDiagram
  autonumber
  actor U as User
  participant LB as Load Balancer
  participant S as URL Service
  participant C as Redis
  participant D as Postgres
  U->>LB: GET /abc123
  LB->>S: forward
  S->>C: GET abc123
  alt cache hit
    C-->>S: long_url
  else cache miss
    S->>D: SELECT long_url
    D-->>S: long_url
    S->>C: SET abc123
  end
  S-->>U: 301 Redirect`;

const DEFAULT_SCHEMA = `// dbdiagram-style (DBML)
Table users {
  id bigint [pk]
  email varchar [unique]
  created_at timestamp
}

Table urls {
  id bigint [pk]
  short_code varchar [unique]
  long_url text
  user_id bigint [ref: > users.id]
  expires_at timestamp
}

Table clicks {
  id bigint [pk]
  url_id bigint [ref: > urls.id]
  country varchar
  clicked_at timestamp
}`;

function loadState(key: string) {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
}

// ---------- DBML -> mermaid erDiagram ----------
function dbmlToMermaid(src: string): { code: string; error?: string } {
  const tables: { name: string; cols: { name: string; type: string; key: string }[] }[] = [];
  const rels: string[] = [];
  const re = /Table\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const name = m[1];
    const cols: { name: string; type: string; key: string }[] = [];
    for (const raw of m[2].split("\n")) {
      const line = raw.replace(/\/\/.*$/, "").trim();
      if (!line) continue;
      const cm = line.match(/^(\w+)\s+([\w()]+)\s*(\[(.*)\])?/);
      if (!cm) continue;
      const attrs = cm[4] ?? "";
      let key = attrs.includes("pk") ? "PK" : attrs.includes("unique") ? "UK" : "";
      const ref = attrs.match(/ref:\s*([<>-])\s*(\w+)\.(\w+)/);
      if (ref) {
        key = "FK";
        const card = ref[1] === ">" ? "}o--||" : ref[1] === "<" ? "||--o{" : "||--||";
        rels.push(`  ${name} ${card} ${ref[2]} : "${cm[1]}"`);
      }
      cols.push({ name: cm[1], type: cm[2].replace(/[()]/g, "_"), key });
    }
    tables.push({ name, cols });
  }
  if (!tables.length) return { code: "", error: "No tables found. Use: Table name { col type [pk] }" };
  const body = tables.map(t => `  ${t.name} {\n${t.cols.map(c => `    ${c.type} ${c.name}${c.key ? " " + c.key : ""}`).join("\n")}\n  }`).join("\n");
  return { code: `erDiagram\n${body}\n${rels.join("\n")}` };
}

// ---------- Mermaid renderer ----------
let mermaidReady: Promise<typeof import("mermaid").default> | null = null;
function getMermaid() {
  if (!mermaidReady) mermaidReady = import("mermaid").then(m => {
    const dark = document.documentElement.classList.contains("dark");
    m.default.initialize({ startOnLoad: false, theme: dark ? "dark" : "default", securityLevel: "strict" });
    return m.default;
  });
  return mermaidReady;
}
let rid = 0;
function MermaidView({ code }: { code: string }) {
  const [svg, setSvg] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      try {
        const mm = await getMermaid();
        await mm.parse(code);
        const { svg } = await mm.render(`mmd-${++rid}`, code);
        if (alive) { setSvg(svg); setErr(""); }
      } catch (e) { if (alive) setErr(e instanceof Error ? e.message.split("\n").slice(0, 3).join("\n") : String(e)); }
    }, 350);
    return () => { alive = false; clearTimeout(t); };
  }, [code]);
  return (
    <div className="relative h-full overflow-auto p-6">
      {err && <pre className="mb-3 whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-2 text-[11px] text-destructive">{err}</pre>}
      <div className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}

function SplitEditor({ value, onChange, preview, hint }: { value: string; onChange: (v: string) => void; preview: React.ReactNode; hint: string }) {
  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-[minmax(320px,40%)_1fr]">
      <div className="flex min-h-0 flex-col border-r">
        <div className="border-b px-3 py-1.5 text-[11px] text-muted-foreground">{hint}</div>
        <textarea value={value} onChange={e => onChange(e.target.value)} spellCheck={false}
          className="min-h-[300px] flex-1 resize-none bg-[#1E1E1E] p-3 font-mono text-[12.5px] leading-relaxed text-[#D4D4D4] outline-none" />
      </div>
      <div className="min-h-0 bg-card">{preview}</div>
    </div>
  );
}

// ---------- Examples ----------
function scenarioExample(slug: string): Design {
  const design = getSystemDesignLab(slug);
  const service = design?.service ?? "URL Service";
  const subject = design?.subject ?? "URL Shortener";
  const isUrl = slug === "systemdesign-url-shortener";
  const nodes = [
    n("n1", "Web Client", "🖥️", 0, 160), n("n2", "Load Balancer", "⚖️", 220, 160),
    n("n3", service, "⚙️", 440, 70), n("n4", service, "⚙️", 440, 250),
    n("n5", "Redis", "⚡", 680, 70), n("n6", "PostgreSQL", "🐘", 680, 250),
  ];
  const edges = [e("n1", "n2", "HTTPS"), e("n2", "n3"), e("n2", "n4"), e("n3", "n5", "read"), e("n4", "n6", "write")];
  const seq = isUrl ? DEFAULT_SEQ : `sequenceDiagram
  autonumber
  actor U as User
  participant A as API Gateway
  participant S as ${service}
  participant D as Database
  participant Q as Event Queue
  U->>A: ${design?.action ?? "Create request"}
  A->>S: Validate request
  S->>D: Check availability and create record
  D-->>S: Confirm transaction
  S->>Q: Publish confirmation event
  S-->>U: Return confirmation`;
  const schema = isUrl ? DEFAULT_SCHEMA : slug === "systemdesign" ? `Table users {
  id bigint [pk]
  email varchar [unique]
}
Table products {
  id bigint [pk]
  name varchar
  stock int
  price decimal
}
Table orders {
  id bigint [pk]
  user_id bigint [ref: > users.id]
  status varchar
}
Table order_items {
  id bigint [pk]
  order_id bigint [ref: > orders.id]
  product_id bigint [ref: > products.id]
  quantity int
}` : `Table users {
  id bigint [pk]
  email varchar [unique]
}
Table events {
  id bigint [pk]
  name varchar
  starts_at timestamp
}
Table seats {
  id bigint [pk]
  event_id bigint [ref: > events.id]
  seat_number varchar
}
Table bookings {
  id bigint [pk]
  user_id bigint [ref: > users.id]
  seat_id bigint [ref: > seats.id]
  status varchar
  expires_at timestamp
}`;
  const ent = design?.entity ?? "urls";
  const apis = isUrl ? [
    api("a1", "POST", "/api/v1/urls", "Create a short URL", { long_url: "https://example.com/very/long", custom_alias: null, expires_at: null }, "201 Created", { short_code: "abc123", short_url: "https://yu.vr/abc123" }),
    api("a2", "GET", "/{short_code}", "Redirect to the long URL", null, "301 Moved Permanently", { Location: "https://example.com/very/long" }),
    api("a3", "GET", "/api/v1/urls/{short_code}/stats", "Click analytics", null, "200 OK", { clicks: 1520, top_countries: ["IN", "US"] }),
    api("a4", "DELETE", "/api/v1/urls/{short_code}", "Delete a short URL", null, "204 No Content", null),
  ] : [
    api("a1", "GET", slug === "systemdesign" ? "/api/v1/products?page=1" : "/api/v1/events/{id}/seats", slug === "systemdesign" ? "List catalog" : "Seat availability", null, "200 OK", slug === "systemdesign" ? { items: [{ id: 7, name: "Headphones", price: 59.0, stock: 12 }], next_page: 2 } : { seats: [{ id: 101, number: "A1", status: "available" }] }),
    api("a2", "POST", `/api/v1/${ent}`, design?.action ?? "Create", slug === "systemdesign" ? { items: [{ product_id: 7, quantity: 1 }], idempotency_key: "c0ffee-42" } : { seat_ids: [101, 102], idempotency_key: "c0ffee-42" }, "201 Created", { id: 9001, status: slug === "systemdesign" ? "PENDING_PAYMENT" : "HELD", expires_at: "2026-10-14T16:10:00Z" }),
    api("a3", "GET", `/api/v1/${ent}/{id}`, "Fetch status", null, "200 OK", { id: 9001, status: "CONFIRMED" }),
    api("a4", "PATCH", `/api/v1/${ent}/{id}`, "Cancel", { status: "CANCELLED" }, "200 OK", { id: 9001, status: "CANCELLED" }),
  ];
  const notes: Notes = {
    hld: isUrl ? "## Requirements\n- Shorten URLs, redirect < 50ms p99\n- 100M URLs/month, read:write 100:1\n\n## Estimates\n- ~40 writes/s, ~4k reads/s\n\n## Trade-offs\n- **Cache-aside Redis** in front of Postgres: fast reads, risk of stale entries on delete\n" : `## ${subject} requirements\n- ${slug === "systemdesign" ? "Prevent overselling and duplicate payments" : "Prevent double booking and expire unpaid seat holds"}\n- Define availability, latency and capacity targets\n\n## Trade-offs\n- Stateless services behind a load balancer scale horizontally\n`,
    sequence: "## Flow notes\n- Cache miss path adds one DB round-trip\n- Use **idempotency keys** on writes so retries are safe\n",
    schema: "## Schema decisions\n- Unique index on the natural key\n- Shard by `id` hash once a single node is not enough\n",
    api: "## API decisions\n- Version in the path (`/api/v1`)\n- `POST` returns **201** with the created resource\n- Cursor pagination for list endpoints\n",
  };
  return { nodes, edges, seq, schema, apis, notes };
}

const USERS_TASKS_SAMPLE: Design = {
  nodes: [
    n("u1", "Web Client", "🖥️", 0, 60), n("u2", "Mobile App", "📱", 0, 220),
    n("u3", "CloudFront", "🛰️", 210, 60, "AWS"), n("u4", "API Gateway", "🚪", 210, 220, "AWS"),
    n("u5", "Auth Service", "🔐", 430, 60), n("u6", "Task Service", "⚙️", 430, 220),
    n("u7", "Redis", "⚡", 650, 140), n("u8", "PostgreSQL", "🐘", 650, 300),
    n("u9", "SQS", "📬", 430, 380, "AWS"), n("u10", "Notification Service", "🔔", 650, 440),
  ],
  edges: [
    e("u1", "u3", "HTTPS"), e("u3", "u4"), e("u2", "u4", "HTTPS"), e("u4", "u5", "JWT"), e("u4", "u6", "REST"),
    e("u6", "u7", "cache"), e("u6", "u8", "SQL"), e("u5", "u8"), e("u6", "u9", "task.assigned"), e("u9", "u10", "consume"),
  ],
  seq: `sequenceDiagram
  autonumber
  actor U as User
  participant G as API Gateway
  participant A as Auth Service
  participant T as Task Service
  participant DB as PostgreSQL
  participant Q as SQS
  U->>G: POST /users/42/tasks
  G->>A: Verify JWT
  A-->>G: user_id = 42
  G->>T: createTask(user_id, title, due_at)
  T->>DB: INSERT INTO user_tasks
  DB-->>T: task_id = 1001
  T->>Q: publish task.assigned
  T-->>U: 201 Created { id: 1001 }`,
  schema: `// users & user_tasks — dbdiagram-style
Table users {
  id bigint [pk]
  email varchar [unique]
  name varchar
  created_at timestamp
}

Table user_tasks {
  id bigint [pk]
  user_id bigint [ref: > users.id]
  title varchar
  status varchar // todo | in_progress | done
  priority int
  due_at timestamp
  created_at timestamp
}`,
  apis: [
    api("s1", "POST", "/api/v1/users", "Sign up", { email: "asha@example.com", name: "Asha" }, "201 Created", { id: 42, email: "asha@example.com" }),
    api("s2", "POST", "/api/v1/users/{id}/tasks", "Create a task", { title: "Write HLD", priority: 2, due_at: "2026-10-20T10:00:00Z" }, "201 Created", { id: 1001, status: "todo" }),
    api("s3", "GET", "/api/v1/users/{id}/tasks?status=todo&cursor=", "List tasks", null, "200 OK", { items: [{ id: 1001, title: "Write HLD", status: "todo" }], next_cursor: null }),
    api("s4", "PATCH", "/api/v1/tasks/{task_id}", "Update status", { status: "done" }, "200 OK", { id: 1001, status: "done" }),
    api("s5", "DELETE", "/api/v1/tasks/{task_id}", "Delete a task", null, "204 No Content", null),
  ],
  notes: {
    hld: `## users & user_tasks — requirements
- Users sign up, create tasks, filter by status, get reminders before due_at
- 1M users, ~20 tasks/user, read:write 10:1

## Trade-offs
- Cache task lists per user in Redis, invalidate on write
- SQS decouples notifications from the write path
`,
    sequence: "## Notes\n- JWT verified at the gateway, services trust `user_id`\n- Event published **after** commit (outbox pattern)\n",
    schema: "## Indexes\n- `(user_id, status)` on user_tasks\n- `email` unique on users\n",
    api: "## Notes\n- Tasks nested under users for creation and listing\n- Cursor pagination on list\n",
  },
};

function ExamplesDialog({ tab, scenario, subject, onClose, onUseTab, onLoadAll }: {
  tab: Tab; scenario: Design; subject: string; onClose: () => void;
  onUseTab: (d: Design) => void; onLoadAll: (d: Design) => void;
}) {
  const [src, setSrc] = useState<"scenario" | "users">("scenario");
  const d = src === "scenario" ? scenario : USERS_TASKS_SAMPLE;
  const code = tab === "sequence" ? d.seq : tab === "schema" ? d.schema : tab === "api" ? d.apis.map(a => `${a.method} ${a.path}${a.summary ? `  # ${a.summary}` : ""}${a.request ? `\nRequest:\n${a.request}` : ""}${a.response ? `\nResponse ${a.status ?? ""}:\n${a.response}` : ""}`).join("\n\n") : JSON.stringify({ components: d.nodes.map(x => x.label), connections: d.edges.map(x => `${d.nodes.find(y => y.id === x.from)?.label} → ${d.nodes.find(y => y.id === x.to)?.label}${x.label ? ` (${x.label})` : ""}`) }, null, 2);
  const label = { hld: "HLD · Architecture", sequence: "Sequence diagram", schema: "DB schema", api: "REST API" }[tab];
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-background/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border bg-card shadow-2xl" onClick={ev => ev.stopPropagation()}>
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <div className="text-sm font-semibold">Example · {label}</div>
          <div className="ml-2 inline-flex rounded-md border p-0.5 text-xs">
            <button onClick={() => setSrc("scenario")} className={`rounded px-2 py-1 ${src === "scenario" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{subject}</button>
            <button onClick={() => setSrc("users")} className={`rounded px-2 py-1 ${src === "users" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>users & user_tasks</button>
          </div>
          <button onClick={onClose} className="ml-auto rounded p-1 hover:bg-accent" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(300px,38%)_1fr]">
          <div className="flex min-h-0 flex-col border-r">
            <div className="border-b px-3 py-1.5 text-[11px] text-muted-foreground">{tab === "hld" ? "Components & connections" : "Code"}</div>
            <pre className="min-h-0 flex-1 overflow-auto bg-[#1E1E1E] p-3 font-mono text-[12px] leading-relaxed text-[#D4D4D4]">{code}</pre>
          </div>
          <div className="min-h-0 bg-background">
            {tab === "hld" ? <DiagramBoard key={src} nodes={d.nodes} edges={d.edges} readOnly />
              : tab === "schema" ? <ErdBoard key={src} src={d.schema} />
              : tab === "api" ? <ApiDocs apis={d.apis} />
              : <MermaidView code={d.seq} />}
          </div>
          {d.notes[tab] && <div className="max-h-40 overflow-auto border-t bg-card p-3 md:col-span-2"><div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Solution notes</div><MarkdownPreview src={d.notes[tab]!} /></div>}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t px-4 py-3">
          <Button variant="outline" size="sm" onClick={() => onUseTab(d)}>Use for this tab only</Button>
          <Button size="sm" onClick={() => onLoadAll(d)}>{src === "users" ? <Users className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}Load full sample (all tabs)</Button>
        </div>
      </div>
    </div>
  );
}

function Studio() {
  return <SystemDesignStudio slug="systemdesign-url-shortener" />;
}

export function SystemDesignStudio({ slug, ticketId, taskOverride }: {
  slug: string;
  ticketId?: string;
  taskOverride?: { title?: string; description?: string };
}) {
  const design = getSystemDesignLab(slug) ?? getSystemDesignLab("systemdesign-url-shortener");
  const lab = labs.find(l => l.slug === slug);
  const task = tickets.find(t => t.id === ticketId);
  const storageKey = `${LS}:${slug}:${ticketId ?? "sandbox"}`;
  const [saved] = useState<Partial<Design> | null>(() => loadState(storageKey));
  const subject = design?.subject ?? "URL Shortener";
  const taskTitle = taskOverride?.title ?? task?.title ?? `Design ${subject}`;
  const taskDescription = taskOverride?.description ?? task?.description;
  const [tab, setTab] = useState<Tab>("hld");
  const [nodes, setNodes] = useState<SDNode[]>(saved?.nodes ?? EMPTY.nodes);
  const [edges, setEdges] = useState<SDEdge[]>(saved?.edges ?? EMPTY.edges);
  const [seq, setSeq] = useState<string>(saved?.seq ?? "");
  const [schema, setSchema] = useState<string>(saved?.schema ?? "");
  const [apis, setApis] = useState<ApiEndpoint[]>(Array.isArray(saved?.apis) ? saved.apis : []);
  const [notes, setNotes] = useState<Notes>(() => { const n = saved?.notes as unknown; return typeof n === "string" ? { hld: n } : (n as Notes) ?? {}; });
  const setNote = (v: string) => setNotes(ns => ({ ...ns, [tab]: v }));
  const [full, setFull] = useState(false);
  const [showEx, setShowEx] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [evaluation, setEvaluation] = useState<DesignEvaluation | null>(null);
  const evaluationContext = {
    project: lab?.name ?? subject, projectDescription: lab?.description, labType: "system-design",
    sprint: SYSTEM_DESIGN_SPRINTS.find(s => s.tags.some(tag => tag === task?.tag))?.name,
    ticketId: ticketId ?? "sandbox", title: taskTitle, description: taskDescription ?? design?.description ?? taskTitle,
    evaluationCriteria: taskOverride ? undefined : getSystemDesignCriteria(ticketId ?? "sandbox", taskTitle, taskDescription ?? design?.description ?? taskTitle),
  };

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify({ nodes, edges, seq, schema, apis, notes }));
      setSavedAt(new Date().toLocaleTimeString());
    }, 500);
    return () => clearTimeout(t);
  }, [nodes, edges, seq, schema, apis, notes, storageKey]);

  const apply = (d: Design) => { setNodes(d.nodes); setEdges(d.edges); setSeq(d.seq); setSchema(d.schema); setApis(d.apis); setNotes(d.notes); };
  const useTab = (d: Design) => {
    if (tab === "hld") { setNodes(d.nodes); setEdges(d.edges); }
    if (tab === "sequence") setSeq(d.seq);
    if (tab === "schema") setSchema(d.schema);
    if (tab === "api") setApis(d.apis);
    setNotes(ns => ({ ...ns, [tab]: d.notes[tab] ?? "" }));
    setShowEx(false);
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges, seq, schema, apis, notes }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${slug}-${ticketId ?? "design"}.json`; a.click();
  };
  const reset = () => { if (confirm("Clear everything and start from an empty workspace?")) apply(EMPTY); };
  const empty = (what: string) => <div className="grid h-full place-items-center p-6 text-center text-sm text-muted-foreground"><div>Nothing to preview yet.<br />Write {what} on the left, or click <b>Examples</b>.</div></div>;

  const TABS: { id: Tab; label: string; icon: React.ReactNode; sub: string }[] = [
    { id: "hld", label: "HLD · Architecture", icon: <Boxes className="h-3.5 w-3.5" />, sub: "Drag & drop" },
    { id: "sequence", label: "Sequence", icon: <GitBranch className="h-3.5 w-3.5" />, sub: "Mermaid" },
    { id: "schema", label: "DB Schema", icon: <Database className="h-3.5 w-3.5" />, sub: "DBML" },
    { id: "api", label: "REST API", icon: <FileText className="h-3.5 w-3.5" />, sub: "Endpoints" },
  ];

  return (
    <div className={`flex h-screen flex-col bg-background ${full ? "fixed inset-0 z-50" : ""}`}>
      <header className="flex flex-wrap items-center gap-3 border-b px-4 py-2">
        <Link to="/lab/$slug" params={{ slug }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" />{lab?.name ?? "System Design Lab"}</Link>
        <div className="h-4 w-px bg-border" />
        <div className="text-sm font-semibold">🏛️ System Design Studio <span className="ml-2 text-xs font-normal text-muted-foreground">{taskTitle}</span></div>
        <div className="ml-auto flex items-center gap-2 text-xs">
          {savedAt && <span className="text-muted-foreground">Saved {savedAt}</span>}
          <Button size="sm" onClick={() => setEvaluation(evaluateSystemDesign(evaluationContext, { nodes, edges, seq, schema, apis, notes }))}><Play className="h-3.5 w-3.5" />Run</Button>
          <Button size="sm" onClick={() => setShowEx(true)}><Sparkles className="h-3.5 w-3.5" />Examples</Button>
          <Button variant="outline" size="sm" onClick={() => apply(USERS_TASKS_SAMPLE)} title="Load users & user_tasks into every tab"><Users className="h-3.5 w-3.5" />Load sample</Button>
          <Button variant="ghost" size="sm" onClick={reset} className="border">Clear</Button>
          <Button variant="ghost" size="sm" onClick={exportJson} className="border"><Download className="h-3.5 w-3.5" />Export</Button>
          <Button variant="ghost" size="sm" onClick={() => setFull(f => !f)} className="border px-2" aria-label="Toggle fullscreen">{full ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}</Button>
        </div>
      </header>
      {taskDescription && <div className="border-b bg-card px-4 py-2 text-xs text-muted-foreground"><span className="mr-2 font-medium text-foreground">{ticketId}</span>{taskDescription}</div>}
      <nav className="flex flex-wrap gap-1 border-b px-3">
        {TABS.map(t => (
          <Button variant="ghost" size="sm" key={t.id} onClick={() => setTab(t.id)}
            className={`-mb-px inline-flex items-center gap-1.5 rounded-none border-b-2 px-3 py-2 text-xs ${tab === t.id ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.icon}{t.label}<span className="text-[10px] text-muted-foreground">· {t.sub}</span>
          </Button>
        ))}
      </nav>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1">
          {tab === "hld" && <HldEditor nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />}
          {tab === "sequence" && <SplitEditor value={seq} onChange={setSeq} hint="Mermaid sequenceDiagram — live preview" preview={seq.trim() ? <MermaidView code={seq} /> : empty("a sequenceDiagram")} />}
          {tab === "schema" && <SplitEditor value={schema} onChange={setSchema} hint="dbdiagram.io-style DBML: Table name { col type [pk, unique, ref: > other.id] }" preview={schema.trim() ? <ErdBoard src={schema} /> : empty("tables in DBML")} />}
          {tab === "api" && <ApiDesigner key={apis.map(a => a.id).join() ? "has" : "none"} apis={apis} setApis={setApis} />}
        </div>
        <NotesPanel key={tab} value={notes[tab] ?? ""} onChange={setNote} title={TABS.find(t => t.id === tab)!.label} />
      </div>
      {showEx && <ExamplesDialog tab={tab} scenario={scenarioExample(slug)} subject={subject} onClose={() => setShowEx(false)}
        onUseTab={useTab} onLoadAll={d => { apply(d); setShowEx(false); }} />}
      {evaluation && <EvaluationResults report={evaluation} open onClose={() => setEvaluation(null)} />}
    </div>
  );
}
