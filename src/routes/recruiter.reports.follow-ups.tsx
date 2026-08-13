import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { listEvaluations } from "@/lib/recruiter";
import { getCandidates } from "@/lib/recruiterCandidates";
import { PageHead, Panel, Table, Pill, StatTile } from "@/components/recruiter/reportsUi";

export const Route = createFileRoute("/recruiter/reports/follow-ups")({
  head: () => ({ meta: [{ title: "Follow-up Reports — Yuvro Recruiter" }, { name: "robots", content: "noindex" }] }),
  component: FollowUpReports,
});

const CHANNELS = ["Email", "Email", "WhatsApp", "SMS"] as const;
const STATES = ["Delivered", "Opened", "Responded", "Bounced"] as const;

function FollowUpReports() {
  const evals = useMemo(() => listEvaluations(), []);
  const rows = useMemo(() => {
    const out: { name: string; evalTitle: string; channel: string; state: string; sent: string; type: string }[] = [];
    evals.forEach((e, ei) => {
      getCandidates(e.id, 40).slice(0, 12).forEach((c, i) => {
        out.push({
          name: c.name,
          evalTitle: e.title,
          channel: CHANNELS[(i + ei) % CHANNELS.length],
          state: STATES[(i * 3 + ei) % STATES.length],
          type: i % 3 === 0 ? "Invitation reminder" : i % 3 === 1 ? "Incomplete nudge" : "Result follow-up",
          sent: `${(i % 9) + 1}d ago`,
        });
      });
    });
    return out.slice(0, 40);
  }, [evals]);

  const count = (s: string) => rows.filter(r => r.state === s).length;
  const tone = (s: string) => (s === "Responded" ? "green" : s === "Bounced" ? "red" : s === "Opened" ? "amber" : "neutral");

  return (
    <div className="space-y-6">
      <PageHead title="Follow-ups" desc="Delivery and response performance for candidate communications." />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatTile label="Messages sent" value={rows.length} />
        <StatTile label="Opened" value={count("Opened")} />
        <StatTile label="Responded" value={count("Responded")} />
        <StatTile label="Bounced" value={count("Bounced")} />
      </div>

      <Panel title="Communication log" desc="Most recent follow-ups across evaluations.">
        <Table
          head={["Candidate", "Evaluation", "Type", "Channel", "Status", "Sent"]}
          rows={rows.map(r => [
            <span className="font-medium">{r.name}</span>,
            r.evalTitle,
            r.type,
            r.channel,
            <Pill tone={tone(r.state)}>{r.state}</Pill>,
            r.sent,
          ])}
        />
      </Panel>
    </div>
  );
}
