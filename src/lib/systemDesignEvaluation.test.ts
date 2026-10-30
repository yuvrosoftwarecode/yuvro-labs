import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateSystemDesign, type EvaluationDesign } from "./systemDesignEvaluation";

const empty: EvaluationDesign = { nodes: [], edges: [], seq: "", schema: "", apis: [], notes: {} };
const nodes = ["Web Client", "Load Balancer", "URL Service", "PostgreSQL", "Redis"].map((label, i) => ({ id: String(i), label, kind: label }));
const evaluate = (d: EvaluationDesign) => evaluateSystemDesign("systemdesign-url-shortener", d);
test("an empty design earns 0 of 100 points", () => {
  assert.equal(evaluate(empty).score, 0);
  assert.equal(evaluate(empty).title, "Design Not Started");
});
test("required four components earn 25 points; an unrelated service cannot pass", () => {
  assert.equal(evaluate({ ...empty, nodes }).checks[0].earned, 25);
  assert.equal(evaluate({ ...empty, nodes: nodes.filter(n => n.label !== "URL Service") }).checks[0].earned, 0);
});
test("request flow earns 25 points only with all directed links", () => {
  const edges = [{ from: "0", to: "1" }, { from: "1", to: "2" }, { from: "2", to: "3" }];
  assert.equal(evaluate({ ...empty, nodes, edges }).checks[1].earned, 25);
  assert.equal(evaluate({ ...empty, nodes, edges: [...edges.slice(0, 2), { from: "3", to: "2" }] }).checks[1].earned, 0);
});
test("Redis earns 25 points only when connected to the service", () => {
  assert.equal(evaluate({ ...empty, nodes }).checks[2].earned, 0);
  assert.equal(evaluate({ ...empty, nodes, edges: [{ from: "2", to: "4" }] }).checks[2].earned, 25);
});
test("both read and write labels earn 25 points; dangling edges do not count", () => {
  const edges = [{ from: "2", to: "4", label: "read" }, { from: "2", to: "3", label: "write" }];
  assert.equal(evaluate({ ...empty, nodes, edges }).checks[3].earned, 25);
  assert.equal(evaluate({ ...empty, nodes, edges: edges.slice(0, 1) }).checks[3].earned, 0);
  assert.equal(evaluate({ ...empty, nodes, edges: [edges[0], { from: "missing", to: "3", label: "write" }] }).checks[3].earned, 0);
});