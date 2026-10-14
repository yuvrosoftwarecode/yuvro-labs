import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow, ReactFlowProvider, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState,
  useReactFlow, Handle, Position, MarkerType, type Connection, type Edge, type Node, type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowLeft, Boxes, GitBranch, Database, FileText, Trash2, Download, Maximize2, Minimize2 } from "lucide-react";

export const Route = createFileRoute("/system-design-studio")({
  head: () => ({ meta: [{ title: "System Design Studio · Yuvro Labs" }] }),
  component: Studio,
});

type Tab = "hld" | "sequence" | "schema" | "lld";
const LS = "yuvro-sds-v1";

const PALETTE: { group: string; items: { kind: string; label: string; icon: string }[] }[] = [
  { group: "Clients", items: [
    { kind: "client", label: "Web Client", icon: "🖥️" }, { kind: "mobile", label: "Mobile App", icon: "📱" } ] },
  { group: "Edge", items: [
    { kind: "dns", label: "DNS", icon: "🌐" }, { kind: "cdn", label: "CDN", icon: "🛰️" },
    { kind: "lb", label: "Load Balancer", icon: "⚖️" }, { kind: "gateway", label: "API Gateway", icon: "🚪" } ] },
  { group: "Compute", items: [
    { kind: "service", label: "Service", icon: "⚙️" }, { kind: "worker", label: "Worker", icon: "🛠️" },
    { kind: "lambda", label: "Serverless Fn", icon: "λ" }, { kind: "auth", label: "Auth Service", icon: "🔐" } ] },
  { group: "Data", items: [
    { kind: "sql", label: "SQL DB", icon: "🗄️" }, { kind: "nosql", label: "NoSQL DB", icon: "🍃" },
    { kind: "cache", label: "Cache (Redis)", icon: "⚡" }, { kind: "blob", label: "Object Storage", icon: "🪣" },
    { kind: "search", label: "Search Index", icon: "🔎" } ] },
  { group: "Messaging", items: [
    { kind: "queue", label: "Message Queue", icon: "📬" }, { kind: "stream", label: "Event Stream", icon: "🌊" },
    { kind: "pubsub", label: "Pub/Sub", icon: "📣" } ] },
  { group: "Ops", items: [
    { kind: "monitor", label: "Monitoring", icon: "📈" }, { kind: "logs", label: "Logging", icon: "🧾" } ] },
];

const DEFAULT_NODES: Node[] = [
  { id: "n1", type: "comp", position: { x: 40, y: 160 }, data: { label: "Web Client", icon: "🖥️" } },
  { id: "n2", type: "comp", position: { x: 260, y: 160 }, data: { label: "Load Balancer", icon: "⚖️" } },
  { id: "n3", type: "comp", position: { x: 480, y: 80 }, data: { label: "URL Service", icon: "⚙️" } },
  { id: "n4", type: "comp", position: { x: 480, y: 240 }, data: { label: "URL Service", icon: "⚙️" } },
  { id: "n5", type: "comp", position: { x: 720, y: 60 }, data: { label: "Cache (Redis)", icon: "⚡" } },
  { id: "n6", type: "comp", position: { x: 720, y: 240 }, data: { label: "SQL DB", icon: "🗄️" } },
];
const edgeDefaults = { type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, animated: true };
const DEFAULT_EDGES: Edge[] = [
  { id: "e1", source: "n1", target: "n2", ...edgeDefaults },
  { id: "e2", source: "n2", target: "n3", ...edgeDefaults },
  { id: "e3", source: "n2", target: "n4", ...edgeDefaults },
  { id: "e4", source: "n3", target: "n5", ...edgeDefaults },
  { id: "e5", source: "n4", target: "n6", ...edgeDefaults, label: "write" },
];

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

const DEFAULT_LLD = `classDiagram
  class UrlController {
    +shorten(req) Response
    +redirect(code) Response
  }
  class UrlService {
    -CodeGenerator gen
    -UrlRepository repo
    -Cache cache
    +create(longUrl, userId) Url
    +resolve(code) String
  }
  class CodeGenerator {
    +next() String
  }
  class UrlRepository {
    +save(Url)
    +findByCode(code) Url
  }
  UrlController --> UrlService
  UrlService --> CodeGenerator
  UrlService --> UrlRepository`;

function loadState() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(LS) || "null"); } catch { return null; }
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

// ---------- HLD canvas ----------
function CompNode({ data, selected }: NodeProps) {
  const d = data as { label: string; icon: string };
  return (
    <div className={`rounded-lg border bg-card px-3 py-2 text-xs shadow-sm min-w-[120px] ${selected ? "border-primary ring-2 ring-primary/30" : ""}`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Top} id="t" />
      <div className="flex items-center gap-2"><span className="text-lg">{d.icon}</span><span className="font-medium">{d.label}</span></div>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}
const nodeTypes = { comp: CompNode };

function HldCanvas({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }: any) {
  const wrap = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const onConnect = useCallback((c: Connection) => setEdges((es: Edge[]) => addEdge({ ...c, ...edgeDefaults }, es)), [setEdges]);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/sds");
    if (!raw) return;
    const item = JSON.parse(raw);
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setNodes((ns: Node[]) => [...ns, { id: `n${Date.now()}`, type: "comp", position, data: { label: item.label, icon: item.icon } }]);
  };
  const selected = nodes.find((n: Node) => n.selected);
  const selEdge = edges.find((e: Edge) => e.selected);

  return (
    <div className="grid h-full grid-cols-[200px_1fr_220px]">
      <aside className="overflow-y-auto border-r p-3">
        <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Components — drag onto canvas</div>
        {PALETTE.map(g => (
          <div key={g.group} className="mb-3">
            <div className="mb-1 text-[11px] font-semibold">{g.group}</div>
            <div className="space-y-1">
              {g.items.map(it => (
                <div key={it.kind} draggable onDragStart={e => { e.dataTransfer.setData("application/sds", JSON.stringify(it)); e.dataTransfer.effectAllowed = "move"; }}
                  className="flex cursor-grab items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-xs hover:border-primary active:cursor-grabbing">
                  <span>{it.icon}</span>{it.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </aside>
      <div ref={wrap} className="min-h-0" onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={onDrop}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
          nodeTypes={nodeTypes} fitView deleteKeyCode={["Backspace", "Delete"]}>
          <Background gap={16} />
          <Controls />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </div>
      <aside className="overflow-y-auto border-l p-3 text-xs">
        <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Inspector</div>
        {selected ? (
          <div className="space-y-2">
            <label className="block text-muted-foreground">Label</label>
            <input value={(selected.data as any).label} onChange={e => setNodes((ns: Node[]) => ns.map(n => n.id === selected.id ? { ...n, data: { ...n.data, label: e.target.value } } : n))}
              className="w-full rounded-md border bg-transparent px-2 py-1.5 outline-none focus:border-primary" />
            <button onClick={() => setNodes((ns: Node[]) => ns.filter(n => n.id !== selected.id))}
              className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-destructive"><Trash2 className="h-3 w-3" />Delete node</button>
          </div>
        ) : selEdge ? (
          <div className="space-y-2">
            <label className="block text-muted-foreground">Connection label</label>
            <input value={(selEdge.label as string) ?? ""} placeholder="e.g. HTTPS, async"
              onChange={e => setEdges((es: Edge[]) => es.map(x => x.id === selEdge.id ? { ...x, label: e.target.value } : x))}
              className="w-full rounded-md border bg-transparent px-2 py-1.5 outline-none focus:border-primary" />
            <button onClick={() => setEdges((es: Edge[]) => es.filter(x => x.id !== selEdge.id))}
              className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-destructive"><Trash2 className="h-3 w-3" />Delete connection</button>
          </div>
        ) : (
          <p className="text-muted-foreground leading-relaxed">Select a component or connection to edit it. Drag from a node's right/bottom dot to another node to connect. Press Delete to remove.</p>
        )}
        <div className="mt-6 border-t pt-3 text-muted-foreground">{nodes.length} components · {edges.length} connections</div>
      </aside>
    </div>
  );
}

function Studio() {
  const saved = loadState();
  const [tab, setTab] = useState<Tab>("hld");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(saved?.nodes ?? DEFAULT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(saved?.edges ?? DEFAULT_EDGES);
  const [seq, setSeq] = useState<string>(saved?.seq ?? DEFAULT_SEQ);
  const [schema, setSchema] = useState<string>(saved?.schema ?? DEFAULT_SCHEMA);
  const [lld, setLld] = useState<string>(saved?.lld ?? DEFAULT_LLD);
  const [notes, setNotes] = useState<string>(saved?.notes ?? "## Requirements\n- Shorten URLs, redirect < 50ms p99\n- 100M URLs/month, read:write 100:1\n\n## Estimates\n- ~40 writes/s, ~4k reads/s\n");
  const [full, setFull] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => {
      const clean = (ns: Node[]) => ns.map(({ id, type, position, data }) => ({ id, type, position, data }));
      localStorage.setItem(LS, JSON.stringify({ nodes: clean(nodes), edges, seq, schema, lld, notes }));
      setSavedAt(new Date().toLocaleTimeString());
    }, 500);
    return () => clearTimeout(t);
  }, [nodes, edges, seq, schema, lld, notes]);

  const er = dbmlToMermaid(schema);
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges, seq, schema, lld, notes }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "system-design.json"; a.click();
  };
  const reset = () => { if (!confirm("Reset everything to the example design?")) return;
    setNodes(DEFAULT_NODES); setEdges(DEFAULT_EDGES); setSeq(DEFAULT_SEQ); setSchema(DEFAULT_SCHEMA); setLld(DEFAULT_LLD); };

  const TABS: { id: Tab; label: string; icon: React.ReactNode; sub: string }[] = [
    { id: "hld", label: "HLD · Architecture", icon: <Boxes className="h-3.5 w-3.5" />, sub: "Drag & drop" },
    { id: "sequence", label: "Sequence", icon: <GitBranch className="h-3.5 w-3.5" />, sub: "Mermaid" },
    { id: "schema", label: "DB Schema", icon: <Database className="h-3.5 w-3.5" />, sub: "DBML" },
    { id: "lld", label: "LLD · Classes", icon: <FileText className="h-3.5 w-3.5" />, sub: "Mermaid + notes" },
  ];

  return (
    <div className={`flex h-screen flex-col bg-background ${full ? "fixed inset-0 z-50" : ""}`}>
      <header className="flex items-center gap-3 border-b px-4 py-2">
        <Link to="/lab/$slug" params={{ slug: "systemdesign" }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" />System Design Lab</Link>
        <div className="h-4 w-px bg-border" />
        <div className="text-sm font-semibold">🏛️ System Design Studio <span className="ml-2 text-xs font-normal text-muted-foreground">Design a URL Shortener</span></div>
        <div className="ml-auto flex items-center gap-2 text-xs">
          {savedAt && <span className="text-muted-foreground">Saved {savedAt}</span>}
          <button onClick={reset} className="rounded-md border px-2 py-1 hover:bg-accent">Reset</button>
          <button onClick={exportJson} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-accent"><Download className="h-3.5 w-3.5" />Export</button>
          <button onClick={() => setFull(f => !f)} className="rounded-md border p-1 hover:bg-accent" aria-label="Toggle fullscreen">{full ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}</button>
          <button className="rounded-md bg-primary px-3 py-1 font-medium text-primary-foreground hover:opacity-90">Submit design</button>
        </div>
      </header>
      <nav className="flex gap-1 border-b px-3">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs ${tab === t.id ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.icon}{t.label}<span className="text-[10px] text-muted-foreground">· {t.sub}</span>
          </button>
        ))}
      </nav>
      <div className="min-h-0 flex-1">
        {tab === "hld" && (
          <ReactFlowProvider>
            <HldCanvas nodes={nodes} setNodes={setNodes} onNodesChange={onNodesChange} edges={edges} setEdges={setEdges} onEdgesChange={onEdgesChange} />
          </ReactFlowProvider>
        )}
        {tab === "sequence" && <SplitEditor value={seq} onChange={setSeq} hint="Mermaid sequenceDiagram — live preview" preview={<MermaidView code={seq} />} />}
        {tab === "schema" && (
          <SplitEditor value={schema} onChange={setSchema} hint="dbdiagram.io-style DBML: Table name { col type [pk, unique, ref: > other.id] }"
            preview={er.error ? <div className="p-6 text-xs text-muted-foreground">{er.error}</div> : <MermaidView code={er.code} />} />
        )}
        {tab === "lld" && (
          <div className="grid h-full grid-rows-[1fr_180px]">
            <SplitEditor value={lld} onChange={setLld} hint="Mermaid classDiagram — classes, methods, relationships" preview={<MermaidView code={lld} />} />
            <div className="flex flex-col border-t">
              <div className="border-b px-3 py-1.5 text-[11px] text-muted-foreground">Design notes — requirements, estimates, APIs, trade-offs</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className="flex-1 resize-none bg-transparent p-3 font-mono text-xs outline-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
