import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { tickets, labs } from "@/lib/dummy";
import { CheckCircle2, XCircle, Zap, Award, Clock, TrendingUp, Sparkles, ArrowRight, Code2 } from "lucide-react";

export const Route = createFileRoute("/lab/$slug/ticket/$ticketId/review")({ component: Review });

function Review() {
  const { slug, ticketId } = useParams({ from: "/lab/$slug/ticket/$ticketId/review" });
  const lab = labs.find((l) => l.slug === slug) ?? labs[0];
  const ticket = tickets.find((t) => t.id === ticketId) ?? tickets[0];
  const score = 87;
  const next = tickets.find((t) => t.status === "Not Started");

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="rounded-2xl border bg-gradient-to-br from-success/10 via-card to-background p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-success/20 blur-3xl" />
          <div className="flex flex-wrap items-center gap-6">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-success/20 border border-success/40">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Submission accepted · {ticket.id}</div>
              <h1 className="text-2xl font-semibold mt-1">{ticket.title}</h1>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Zap className="h-4 w-4 text-primary" />+{ticket.xp} XP earned</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />Solved in 18m</span>
                <span className="inline-flex items-center gap-1"><Award className="h-4 w-4 text-warning" />Bronze badge unlocked</span>
              </div>
            </div>
            <div className="ml-auto text-center">
              <div className="text-5xl font-semibold text-success">{score}</div>
              <div className="text-xs text-muted-foreground">/ 100 score</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Metric title="Tests" value="4/5" sub="One edge case missed" tone="warning" />
          <Metric title="Code quality" value="A−" sub="No critical smells" tone="success" />
          <Metric title="Performance" value="Top 22%" sub="Faster than 78% of solvers" tone="info" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium"><Code2 className="h-4 w-4" />Your solution</div>
            <pre className="rounded-md bg-editor-bg border p-3 text-xs font-mono overflow-auto max-h-72 scrollbar-thin text-muted-foreground"><code>{`public class Main {
  public static void main(String[] args) {
    int integerValue = 42;
    double pi = 3.14;
    String greeting = "Hello Java";
    System.out.println("Integer: " + integerValue);
    System.out.println("Double: " + pi);
    System.out.println("String: " + greeting);
    System.out.println("Length: " + greeting.length());
  }
}`}</code></pre>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium"><Sparkles className="h-4 w-4 text-primary" />Reference solution</div>
            <pre className="rounded-md bg-editor-bg border p-3 text-xs font-mono overflow-auto max-h-72 scrollbar-thin text-muted-foreground"><code>{`public class Main {
  public static void main(String[] args) {
    int a = 42; double b = 3.14; boolean c = true;
    String s = "Hello Java";
    System.out.printf("Integer: %d%nDouble: %.2f%n", a, b);
    System.out.println("Boolean: " + c);
    System.out.println("String: " + s);
    System.out.printf("Length: %d%nChar[0]: %s%n",
      s.length(), s.charAt(0));
    int narrowed = (int) b;
    double widened = a;
    System.out.println(narrowed + " " + widened);
  }
}`}</code></pre>
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium"><TrendingUp className="h-4 w-4 text-success" />Feedback</div>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5" />Clean variable naming.</li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5" />Correct use of <code>charAt</code>.</li>
            <li className="flex gap-2"><XCircle className="h-4 w-4 text-destructive mt-0.5" />Missing explicit cast demonstration → cost 1 test.</li>
            <li className="flex gap-2"><Sparkles className="h-4 w-4 text-primary mt-0.5" />Consider <code>printf</code> for formatted output.</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-5">
          <div>
            <div className="text-sm text-muted-foreground">Recommended next</div>
            <div className="text-lg font-semibold">{next?.id} · {next?.title}</div>
          </div>
          <div className="flex gap-2">
            <Link to="/lab/$slug" params={{ slug: lab.slug }} className="rounded-md border px-4 py-2 text-sm hover:bg-accent">Back to lab</Link>
            {next && (
              <Link to="/lab/$slug/ticket/$ticketId" params={{ slug: lab.slug, ticketId: next.id }}
                className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
                Start next <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Metric({ title, value, sub, tone }: { title: string; value: string; sub: string; tone: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="mt-1 text-2xl font-semibold" style={{ color: `var(--${tone})` }}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
