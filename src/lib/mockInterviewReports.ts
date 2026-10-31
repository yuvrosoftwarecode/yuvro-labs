import type { Report } from "@/components/InterviewReport";

const key = (slug: string) => `yuvro-mock-interview-report:${slug}`;

// Temporary session snapshots, not persisted grading reports.
export function readInterviewReport(slug: string): Report | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(key(slug)) || "null");
    return value && typeof value.role === "string" && typeof value.score === "number"
      && Array.isArray(value.questions) && Array.isArray(value.transcript) ? value : null;
  } catch { return null; }
}

export function captureInterviewReport(slug: string, report: Report) {
  try { sessionStorage.setItem(key(slug), JSON.stringify(report)); } catch { /* Session storage may be unavailable. */ }
}

export function hasCompletedInterview(slug: string, completed: number) {
  return completed > 0 || readInterviewReport(slug) !== null;
}