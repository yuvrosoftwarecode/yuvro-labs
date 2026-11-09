import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { Paper } from "@/data/papers";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const formatAuthors = (authors: string[]) =>
  authors.length <= 3
    ? authors.join(", ")
    : `${authors.slice(0, 3).join(", ")} and ${authors.length - 3} others`;

interface Props {
  paper: Paper;
  followed: boolean;
  onToggleFollow: (topic: Paper["topic"]) => void;
}

export default function PaperCard({ paper, followed, onToggleFollow }: Props) {
  const meta = "text-[13px] text-muted-foreground";
  const link = "h-auto rounded-none p-0 font-normal text-muted-foreground hover:text-foreground hover:underline underline-offset-4";

  return (
    <article className="border-b border-border px-6 py-6 last:border-b-0 sm:px-8">
      <div className={meta}>
        {paper.topic} · {paper.source} · {formatDate(paper.date)}
      </div>
      <h2 className="mt-1.5 text-lg font-medium leading-snug text-foreground">{paper.title}</h2>
      <div className="mt-1 text-sm text-muted-foreground">{formatAuthors(paper.authors)}</div>
      <p className="mt-2.5 text-[15px] leading-relaxed text-foreground/80">{paper.description}</p>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
        <Link to="/research/$paperId" params={{ paperId: paper.id }}
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Summarise with AI
        </Link>
        <a href={paper.url} target="_blank" rel="noopener noreferrer" className={link}>
          Read Original Paper
        </a>
        <Button variant="link" onClick={() => onToggleFollow(paper.topic)} className={link}>
          {followed ? `Following ${paper.topic}` : `Follow ${paper.topic}`}
        </Button>
      </div>
    </article>
  );
}
