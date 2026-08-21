/* Product mega-menu information architecture (marketing site). */

export type ProductItem = {
  slug: string;
  title: string;
  short: string;
  description: string;
  glyph: GlyphKey;
  emphasis?: boolean;
  bullets?: string[];
  claim?: string;
};

export type GlyphKey =
  | "simulation"
  | "assessment"
  | "interview"
  | "builder"
  | "skill"
  | "intelligence"
  | "insight"
  | "compare"
  | "invite"
  | "followup"
  | "records"
  | "reports"
  | "proctor"
  | "evidence"
  | "analytics"
  | "review";

export type ProductGroup = {
  id: string;
  heading: string;
  caption: string;
  items: ProductItem[];
};

export const productGroups: ProductGroup[] = [
  {
    id: "platform",
    heading: "Platform",
    caption: "Evaluate",
    items: [
      {
        slug: "engineering-simulations",
        title: "Engineering Simulations",
        short: "Evaluate real engineering work",
        description:
          "Evaluate how engineers actually work — debugging, optimization, code review and real engineering tasks.",
        glyph: "simulation",
        emphasis: true,
        claim: "Not just coding.",
        bullets: ["Debugging", "Optimization", "Code review", "Real engineering tasks", "Practical decision making"],
      },
      {
        slug: "knowledge-assessments",
        title: "Knowledge Assessments",
        short: "Measure technical knowledge",
        description:
          "Measure technical knowledge across languages, frameworks, databases and engineering fundamentals.",
        glyph: "assessment",
      },
      {
        slug: "vitarka-ai",
        title: "Vitarka AI",
        short: "Technical interviews that go deeper",
        description:
          "AI-powered technical interviews that ask questions based on candidate skills, work and evaluation performance.",
        glyph: "interview",
        emphasis: true,
        claim: "Not a scripted interview.",
        bullets: [
          "Reads the evaluation context",
          "Understands candidate work",
          "Asks follow-up questions",
          "Challenges candidate decisions",
          "Evaluates technical explanations",
        ],
      },
      {
        slug: "evaluation-builder",
        title: "Evaluation Builder",
        short: "Build complete evaluations",
        description:
          "Build one evaluation using Engineering Labs, Assessments, Coding and Vitarka AI — independently or together.",
        glyph: "builder",
        emphasis: true,
        claim: "Build the evaluation your way.",
        bullets: ["Engineering Labs", "Knowledge Assessment", "Coding", "Vitarka AI"],
      },
    ],
  },
  {
    id: "intelligence",
    heading: "Intelligence",
    caption: "Understand",
    items: [
      {
        slug: "engineering-skill-intelligence",
        title: "Engineering Skill Intelligence",
        short: "Understand practical ability",
        description: "Understand what candidates can actually build, debug, explain and solve.",
        glyph: "skill",
      },
      {
        slug: "hiring-intelligence",
        title: "Hiring Intelligence",
        short: "Evaluation evidence in one view",
        description:
          "Bring evaluation evidence, scores and candidate performance together to help recruiters make better decisions.",
        glyph: "intelligence",
      },
      {
        slug: "candidate-insights",
        title: "AI Candidate Insights",
        short: "Surface strengths & weaknesses",
        description:
          "Surface strengths, weaknesses and important signals from Labs, Assessments and Vitarka AI.",
        glyph: "insight",
      },
      {
        slug: "candidate-comparison",
        title: "Candidate Comparison",
        short: "Compare candidates side by side",
        description:
          "Compare candidates across engineering performance, knowledge and technical interviews.",
        glyph: "compare",
      },
    ],
  },
  {
    id: "workflow",
    heading: "Workflow",
    caption: "Follow up",
    items: [
      {
        slug: "candidate-invitations",
        title: "Candidate Invitations",
        short: "Send assessments",
        description: "Send evaluations directly from Yuvro or share an evaluation link with candidates.",
        glyph: "invite",
      },
      {
        slug: "automated-follow-ups",
        title: "Automated Follow-ups",
        short: "Bring candidates back",
        description:
          "Automatically send two reminder emails and optionally use an AI phone call before the assessment deadline.",
        glyph: "followup",
      },
      {
        slug: "candidate-records",
        title: "Candidate Records",
        short: "One candidate history",
        description:
          "Track candidates, submissions, scores, review decisions and evaluation history in one place.",
        glyph: "records",
      },
      {
        slug: "reports",
        title: "Reports",
        short: "Export hiring results",
        description:
          "Build custom reports, filter evaluation data and export complete hiring results to Excel.",
        glyph: "reports",
      },
    ],
  },
  {
    id: "trust",
    heading: "Trust",
    caption: "Verify",
    items: [
      {
        slug: "proctoring",
        title: "Proctoring",
        short: "Assessment integrity",
        description: "Help maintain assessment integrity with controlled testing and candidate monitoring.",
        glyph: "proctor",
      },
      {
        slug: "evaluation-evidence",
        title: "Evaluation Evidence",
        short: "See the work behind the score",
        description: "Review the actual work, answers and interview responses behind every candidate score.",
        glyph: "evidence",
      },
      {
        slug: "performance-analytics",
        title: "Performance Analytics",
        short: "Understand performance",
        description:
          "Understand candidate performance across Engineering Labs, Assessments and Vitarka AI.",
        glyph: "analytics",
      },
      {
        slug: "recruiter-review",
        title: "Recruiter Review",
        short: "Recruiter decision stays in control",
        description:
          "Keep AI recommendations separate from recruiter decisions such as Shortlisted, Hold or Rejected.",
        glyph: "review",
      },
    ],
  },
];

export const productItems: ProductItem[] = productGroups.flatMap((g) => g.items);

export function findProductItem(slug: string) {
  for (const g of productGroups) {
    const item = g.items.find((i) => i.slug === slug);
    if (item) return { group: g, item };
  }
  return null;
}
