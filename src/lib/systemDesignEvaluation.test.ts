import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateSystemDesign, type EvaluationDesign } from "./systemDesignEvaluation";
import { getSystemDesignCriteria } from "./systemDesign";
import { pendingEvaluation, type EvaluationContext } from "./evaluation";
const empty: EvaluationDesign = { nodes: [], edges: [], seq: "", schema: "", apis: [], notes: {} };
const context = (id: string): EvaluationContext => ({ project: "System Design", labType: "system-design", ticketId: id, title: id, description: id, evaluationCriteria: getSystemDesignCriteria(id, id, id) });
test("CAP task and URL shortener have genuinely different relevant criteria", () => {
  const cap = evaluateSystemDesign(context("SD-101"), empty);
  const url = evaluateSystemDesign(context("SD-115"), empty);
  assert.equal(cap.checks.length, 3);
  assert.equal(url.checks.length, 5);
  assert.ok(cap.checks.every(c => c.tabs.length === 1 && c.tabs[0] === "notes"));
  assert.ok(url.checks.some(c => c.title.includes("short-code")));
  assert.ok(cap.checks.every(c => !c.title.includes("Redis")));
});
test("unvalidated reasoning remains pending without fabricated scores", () => {
  const result = evaluateSystemDesign(context("SD-101"), { ...empty, notes: { hld: "CAP explanation" } });
  assert.equal(result.score, null);
  assert.equal(result.pending, 3);
  assert.ok(result.checks.every(c => c.marks === null));
});
test("API methods and paths are validated only for the API task", () => {
  assert.equal(evaluateSystemDesign(context("SD-103"), empty).failed, 1);
  const result = evaluateSystemDesign(context("SD-103"), { ...empty, apis: [{ method: "POST", path: "/v1/bookings" }] });
  assert.equal(result.passed, 1);
  assert.equal(result.score, null);
  assert.equal(evaluateSystemDesign(context("SD-103"), { ...empty, apis: [{ method: "BOGUS", path: "bad path" }] }).passed, 0);
});
test("code criteria follow actual ticket requirements instead of Java checks", () => {
  const a = pendingEvaluation({ ...context("SQL-105"), evaluationCriteria: undefined, description: "Join orders to users. Group sales by category." });
  const b = pendingEvaluation({ ...context("DJ-107"), evaluationCriteria: undefined, description: "Optimize N+1 queries with select_related()." });
  assert.equal(a.checks.length, 2);
  assert.equal(b.checks.length, 1);
  assert.equal(b.score, null);
  assert.ok(b.checks[0].title.includes("select_related"));
  assert.ok(a.checks.every(c => !c.title.includes("Variables")));
});