import { getSystemDesignChecks, getSystemDesignLab } from "./systemDesign";

export type EvaluationDesign = {
  nodes: { id: string; kind: string; label: string }[];
  edges: { from: string; to: string; label?: string }[];
  seq: string;
  schema: string;
  apis: { method: string; path: string }[];
  notes: Partial<Record<string, string>>;
};

export function evaluateSystemDesign(slug: string, design: EvaluationDesign) {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const service = getSystemDesignLab(slug)?.service ?? "URL Service";
  const groups = [
    { name: "Web Client", aliases: ["webclient", "webapp", "browser", "frontend"] },
    { name: "Load Balancer", aliases: ["loadbalancer", "alb", "elb", "nginx"] },
    { name: service, aliases: [normalize(service)] },
    { name: "PostgreSQL", aliases: ["postgresql", "postgres"] },
    { name: "Redis", aliases: ["redis", "redis cache"] },
  ].map(g => ({ ...g, nodes: design.nodes.filter(n => g.aliases.map(normalize).some(a => normalize(n.label) === a || normalize(n.kind) === a)) }));
  const ids = new Set(design.nodes.map(n => n.id));
  const edges = design.edges.filter(e => ids.has(e.from) && ids.has(e.to) && e.from !== e.to);
  const linked = (a: typeof groups[number], b: typeof groups[number]) => edges.some(e => a.nodes.some(n => n.id === e.from) && b.nodes.some(n => n.id === e.to));
  const missing = groups.slice(0, 4).filter(g => !g.nodes.length).map(g => g.name);
  const gaps = groups.slice(0, 3).flatMap((g, i) => linked(g, groups[i + 1]) ? [] : [`${g.name} → ${groups[i + 1].name}`]);
  const cache = groups[4].nodes.length > 0 && (linked(groups[2], groups[4]) || linked(groups[4], groups[2]));
  const read = edges.some(e => /\bread\b/i.test(e.label ?? ""));
  const write = edges.some(e => /\bwrite\b/i.test(e.label ?? ""));
  const passed = [missing.length === 0, gaps.length === 0, cache, read && write];
  const feedback = [
    missing.length ? `Missing components: ${missing.join(", ")}. Add them to the canvas or rename the matching components.` : "All four required architecture components are present.",
    gaps.length ? `Missing directed connections: ${gaps.join("; ")}. Connect the component handles in the request direction.` : "The client-to-database request path is connected in the correct direction.",
    cache ? "Redis is present and connected to the service." : groups[4].nodes.length ? `Connect Redis to ${service}; an isolated cache does not participate in the flow.` : "Add Redis and connect it to the service to represent the caching layer.",
    read && write ? "Both read and write connection labels are present." : `Add ${[!read && "read", !write && "write"].filter(Boolean).join(" and ")} labels to the appropriate connections.`,
  ];
  const checks = getSystemDesignChecks(slug).map((c, i) => ({ ...c, passed: passed[i], earned: passed[i] ? c.points : 0, feedback: feedback[i] }));
  const score = checks.reduce((sum, c) => sum + c.earned, 0);
  const started = design.nodes.length > 0 || design.seq.trim() || design.schema.trim() || design.apis.length > 0 || Object.values(design.notes).some(v => v?.trim());
  return {
    score, checks, passed: checks.filter(c => c.passed).length,
    title: !started ? "Design Not Started" : score === 100 ? "Structural Checks Passed" : "Design In Progress",
    artifacts: { nodes: design.nodes.length, edges: design.edges.length, sequence: Boolean(design.seq.trim()), schema: Boolean(design.schema.trim()), apis: design.apis.length, notes: Object.values(design.notes).filter(v => v?.trim()).length },
  };
}

export type DesignEvaluation = ReturnType<typeof evaluateSystemDesign>;