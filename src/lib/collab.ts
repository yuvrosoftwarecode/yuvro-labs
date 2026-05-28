export type SquadRole = "Frontend" | "Backend" | "QA" | "DevOps" | "Security";

export interface Engineer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: SquadRole;
  stack: string[];
  collab: number;
  reliability: number;
  support: number;
  leadership: number;
  sprintsCompleted: number;
  availability: "Online" | "Busy" | "Idle" | "Offline";
  open: boolean;
  badges: string[];
}

export interface Squad {
  id: string;
  name: string;
  objective: string;
  type: "Startup Sprint" | "Production Bug" | "Security Incident" | "Full Stack" | "Enterprise";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  stack: string[];
  filled: SquadRole[];
  missing: SquadRole[];
  members: string[];
  velocity: number;
  reputation: number;
  progress: number;
  visibility: "Public" | "Invite Only" | "College Only";
}

export interface Ticket {
  id: string;
  title: string;
  column: "Todo" | "In Progress" | "Review" | "QA" | "Deployment" | "Done" | "Blocked";
  assignee: string;
  reviewer?: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  points: number;
  pr?: string;
  build?: "passing" | "failing" | "pending";
}

export interface Incident {
  id: string;
  title: string;
  severity: "SEV1" | "SEV2" | "SEV3";
  service: string;
  startedAt: string;
  status: "Active" | "Mitigating" | "Resolved";
  responders: string[];
}

export const engineers: Engineer[] = [
  { id: "e1", name: "Anjali R.", handle: "@anjali", avatar: "AR", role: "Backend", stack: ["Node", "Postgres", "Redis"], collab: 92, reliability: 95, support: 88, leadership: 78, sprintsCompleted: 24, availability: "Online", open: true, badges: ["Reliable Engineer", "Strong Reviewer"] },
  { id: "e2", name: "Rohith K.", handle: "@rohith", avatar: "RK", role: "Frontend", stack: ["React", "TS", "Tailwind"], collab: 88, reliability: 90, support: 72, leadership: 65, sprintsCompleted: 19, availability: "Online", open: true, badges: ["Sprint Leader"] },
  { id: "e3", name: "Meera S.", handle: "@meera", avatar: "MS", role: "QA", stack: ["Cypress", "Playwright"], collab: 84, reliability: 93, support: 91, leadership: 70, sprintsCompleted: 31, availability: "Busy", open: false, badges: ["Incident Hero"] },
  { id: "e4", name: "Dev P.", handle: "@dev", avatar: "DP", role: "DevOps", stack: ["AWS", "K8s", "Terraform"], collab: 80, reliability: 89, support: 82, leadership: 86, sprintsCompleted: 27, availability: "Online", open: true, badges: ["Team Mentor"] },
  { id: "e5", name: "Priya M.", handle: "@priya", avatar: "PM", role: "Security", stack: ["Burp", "OWASP", "Vault"], collab: 75, reliability: 88, support: 79, leadership: 72, sprintsCompleted: 15, availability: "Idle", open: true, badges: ["Reliable Engineer"] },
  { id: "e6", name: "Liam K.", handle: "@liam", avatar: "LK", role: "Backend", stack: ["Java", "Spring", "Kafka"], collab: 90, reliability: 92, support: 85, leadership: 80, sprintsCompleted: 22, availability: "Online", open: true, badges: ["Strong Reviewer", "Team Mentor"] },
];

export const squads: Squad[] = [
  { id: "s1", name: "Team Velocity", objective: "Ship checkout v2 with Stripe + retries", type: "Startup Sprint", difficulty: "Intermediate", duration: "5 days", stack: ["React", "Node", "Postgres"], filled: ["Frontend", "Backend"], missing: ["QA", "DevOps"], members: ["e1", "e2"], velocity: 34, reputation: 88, progress: 42, visibility: "Public" },
  { id: "s2", name: "Payments Strike", objective: "Investigate intermittent 502s on payments-api", type: "Production Bug", difficulty: "Advanced", duration: "3 days", stack: ["Java", "K8s", "Datadog"], filled: ["Backend", "DevOps"], missing: ["QA"], members: ["e4", "e6"], velocity: 21, reputation: 91, progress: 60, visibility: "Public" },
  { id: "s3", name: "Zero Trust Cell", objective: "Patch IDOR and refresh-token rotation", type: "Security Incident", difficulty: "Advanced", duration: "2 days", stack: ["Node", "Vault"], filled: ["Security", "Backend"], missing: ["QA", "Frontend"], members: ["e5", "e1"], velocity: 18, reputation: 94, progress: 25, visibility: "Invite Only" },
  { id: "s4", name: "Onboarding Squad", objective: "Rebuild new-user onboarding funnel", type: "Full Stack", difficulty: "Beginner", duration: "7 days", stack: ["React", "Node"], filled: ["Frontend"], missing: ["Backend", "QA", "DevOps"], members: ["e2"], velocity: 12, reputation: 76, progress: 10, visibility: "Public" },
];

export const tickets: Ticket[] = [
  { id: "ENG-101", title: "Stripe webhook handler", column: "In Progress", assignee: "e1", reviewer: "e6", priority: "High", points: 5, pr: "#28", build: "pending" },
  { id: "ENG-102", title: "Checkout summary UI", column: "Review", assignee: "e2", reviewer: "e1", priority: "Medium", points: 3, pr: "#29", build: "passing" },
  { id: "ENG-103", title: "Retry queue (BullMQ)", column: "Todo", assignee: "e6", priority: "High", points: 8 },
  { id: "ENG-104", title: "E2E checkout flow", column: "QA", assignee: "e3", priority: "Medium", points: 5, build: "failing" },
  { id: "ENG-105", title: "Canary deploy to staging", column: "Deployment", assignee: "e4", priority: "High", points: 2, build: "passing" },
  { id: "ENG-106", title: "Address form validation", column: "Done", assignee: "e2", reviewer: "e1", priority: "Low", points: 2, build: "passing" },
  { id: "ENG-107", title: "Inventory race condition", column: "Blocked", assignee: "e1", priority: "Critical", points: 8 },
];

export const incidents: Incident[] = [
  { id: "INC-2041", title: "payments-api 5xx spike", severity: "SEV1", service: "payments-api", startedAt: "12m ago", status: "Mitigating", responders: ["e4", "e6", "e3"] },
  { id: "INC-2040", title: "auth latency p99 > 2s", severity: "SEV2", service: "auth-svc", startedAt: "1h ago", status: "Active", responders: ["e1", "e5"] },
  { id: "INC-2039", title: "CDN cache miss surge", severity: "SEV3", service: "edge-cdn", startedAt: "3h ago", status: "Resolved", responders: ["e4"] },
];

export const invitations = [
  { id: "i1", from: "e1", squad: "s1", role: "Backend Engineer" as const, message: "We need a backend dev for checkout retries.", time: "5m" },
  { id: "i2", from: "e4", squad: "s2", role: "QA Engineer" as const, message: "Help us validate the payments fix before deploy.", time: "1h" },
];

export const joinRequests = [
  { id: "r1", from: "e6", squad: "s1", role: "Backend", time: "10m", note: "Strong Spring Boot + Node background." },
  { id: "r2", from: "e3", squad: "s4", role: "QA", time: "30m", note: "Can own E2E + regression suite." },
];

export const notifications = [
  { id: "n1", type: "invite", text: "Anjali invited you to Team Velocity", time: "5m" },
  { id: "n2", type: "pr", text: "PR #28 awaiting your review", time: "12m" },
  { id: "n3", type: "build", text: "Deployment to staging failed", time: "20m" },
  { id: "n4", type: "incident", text: "SEV1: payments-api 5xx spike", time: "12m" },
  { id: "n5", type: "badge", text: "You earned: Strong Reviewer", time: "1h" },
  { id: "n6", type: "recruiter", text: "A recruiter viewed your engineering profile", time: "3h" },
];

export const myReputation = {
  collab: 86,
  reliability: 91,
  support: 78,
  leadership: 74,
  sprintCompletion: 92,
  availability: "Open to collaborate" as const,
  badges: ["Reliable Engineer", "Strong Reviewer", "Sprint Leader"],
};

export const findEngineer = (id: string) => engineers.find((e) => e.id === id);
export const findSquad = (id: string) => squads.find((s) => s.id === id);
