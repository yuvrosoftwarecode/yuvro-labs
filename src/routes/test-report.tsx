import InterviewReport, { SAMPLE as SAMPLE_REPORT } from "@/components/InterviewReport";

export default function TestReport() {
  const score = Number(new URLSearchParams(window.location.search).get("score") ?? "85");
  return <InterviewReport report={{ ...SAMPLE_REPORT, score }} onBack={() => history.back()} onTryAgain={() => {}} />;
}
