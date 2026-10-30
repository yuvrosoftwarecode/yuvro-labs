import { buildEvaluationReport, requirementCriteria, type EvaluationContext, type EvaluationCheck } from "./evaluation";
export type EvaluationDesign = {
  nodes: { id: string; kind: string; label: string }[];
  edges: { from: string; to: string; label?: string }[];
  seq: string; schema: string;
  apis: { method: string; path: string }[];
  notes: Partial<Record<string, string>>;
};

export function evaluateSystemDesign(context: EvaluationContext, design: EvaluationDesign) {
  const checks = requirementCriteria(context).map((c): EvaluationCheck => {
    if (c.rule === "api-contract") {
      const valid = design.apis.length > 0 && design.apis.every(a => ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"].includes(a.method.toUpperCase()) && /^\/\S*$/.test(a.path));
      return { ...c, status: valid ? "passed" : "failed", marks: valid ? c.maxMarks : 0, feedback: valid ? `${design.apis.length} endpoints have valid HTTP methods and absolute paths. Contract semantics require separate review.` : "Define at least one endpoint; each needs a supported HTTP method and an absolute path without whitespace.", missing: valid ? [] : ["Valid endpoint methods and paths"] };
    }
    const available = c.tabs.filter(t => t === "hld" ? design.nodes.length : t === "sequence" ? design.seq.trim() : t === "schema" ? design.schema.trim() : t === "api" ? design.apis.length : Object.values(design.notes).some(n => n?.trim()));
    return { ...c, status: "pending", marks: null, feedback: available.length ? "Relevant draft material is present. Correctness and requirement fulfillment await a configured validator or reviewer; no marks have been awarded." : "No relevant draft material is present yet. This requirement awaits review; no marks have been awarded.", missing: available.length ? [] : [c.title] };
  });
  return buildEvaluationReport(context, checks);
}
export type DesignEvaluation = ReturnType<typeof evaluateSystemDesign>;