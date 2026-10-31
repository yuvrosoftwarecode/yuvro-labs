import { createFileRoute } from "@tanstack/react-router";
import InterviewReport, { SAMPLE } from "@/components/InterviewReport";

function TestReport() {
  const score = Number(new URLSearchParams(window.location.search).get("score") ?? "85");
  return <InterviewReport report={{ ...SAMPLE, score }} onBack={() => history.back()} onTryAgain={() => {}} />;
}

export const Route = createFileRoute("/test-report")({
  component: TestReport,
});
