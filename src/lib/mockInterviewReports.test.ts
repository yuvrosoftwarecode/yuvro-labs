import { test, expect } from "bun:test";
import { INTERVIEWS } from "./mockInterviews";

test("default interview cards offer one completed interview and one startable interview", () => {
  expect(INTERVIEWS.find(i => i.slug === "java-backend")?.completed).toBe(1);
  expect(INVIEWS_STARTABLE()).toBe(0);
});

function INVIEWS_STARTABLE() { return INTERVIEWS.find(i => i.slug === "react-frontend")?.completed; }