// @ts-nocheck
// Recruiter data + backend API
import restApiAuthUtil, { ycodeApiAuthUtil, yhubApiAuthUtil } from "../utils/RestApiAuthUtil";
import { questionBankService } from "../services/questionBankService";

export const TIMEZONES = [
  { value: "Asia/Kolkata", label: "Asia / Kolkata (IST +5:30)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time +0:00)" },
  { value: "America/New_York", label: "America / New_York (EST -5:00)" },
  { value: "America/Chicago", label: "America / Chicago (CST -6:00)" },
  { value: "America/Denver", label: "America / Denver (MST -7:00)" },
  { value: "America/Los_Angeles", label: "America / Los_Angeles (PST -8:00)" },
  { value: "Europe/London", label: "Europe / London (GMT +0:00)" },
  { value: "Europe/Paris", label: "Europe / Paris (CET +1:00)" },
  { value: "Europe/Berlin", label: "Europe / Berlin (CET +1:00)" },
  { value: "Asia/Dubai", label: "Asia / Dubai (GST +4:00)" },
  { value: "Asia/Singapore", label: "Asia / Singapore (SGT +8:00)" },
  { value: "Asia/Tokyo", label: "Asia / Tokyo (JST +9:00)" },
  { value: "Australia/Sydney", label: "Australia / Sydney (AEST +10:00)" },
  { value: "Pacific/Auckland", label: "Pacific / Auckland (NZST +12:00)" },
] as const;

export const EXPIRY_OPTIONS = [
  { value: "1", label: "1 day" },
  { value: "3", label: "3 days" },
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
  { value: "custom", label: "Custom" },
] as const;

export const DURATION_OPTIONS = [
  { value: "30 min", label: "30 min" },
  { value: "45 min", label: "45 min" },
  { value: "60 min", label: "60 min" },
  { value: "90 min", label: "90 min" },
  { value: "120 min", label: "120 min" },
  { value: "180 min", label: "180 min" },
  { value: "240 min", label: "240 min" },
  { value: "unlimited", label: "Unlimited" },
] as const;

export const DOMAINS = [
  "Finance",
  "Insurance",
  "EdTech",
  "Supply Chain",
  "Healthcare",
  "Retail",
  "Payment",
  "Other",
] as const;
export type Domain = (typeof DOMAINS)[number];

export const PROGRAMMING_LANGUAGES = [
  "C",
  "C++",
  "Python",
  "Java",
  "SQL",
  "Bash",
  "JavaScript",
  "TypeScript",
] as const;
export type ProgrammingLanguage = (typeof PROGRAMMING_LANGUAGES)[number];

export const DATABASES = [
  "SQLite",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",
] as const;
export type Database = (typeof DATABASES)[number];

export const SCENARIOS = [
  "Debugging",
  "Bug Fixing",
  "Feature Development",
  "API Optimization",
  "Performance Optimization",
  "Security",
  "Architecture",
  "Performance",
  "Testing",
  "Production Incident",
] as const;
export type Scenario = (typeof SCENARIOS)[number];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const EXPERIENCE_LEVELS = [
  "Intern",
  "Fresher",
  "Junior Developer",
  "Mid-Level Developer",
  "Senior Developer",
  "Lead Developer",
  "Staff Engineer",
  "Principal Engineer",
  "Software Architect",
  "Engineering Manager",
  "Director of Engineering",
  "VP of Engineering",
  "Chief Technology Officer",
] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const FORMATS = ["MCQ", "Multiple Select", "Description", "Coding"] as const;
export type Format = (typeof FORMATS)[number];

export interface LabItem {
  id: string;
  title: string;
  domain: Domain;
  programming_languages: ProgrammingLanguage[];
  databases: Database[];
  scenario: Scenario;
  difficulty: Difficulty;
  marks: number;
  duration_minutes: number;
  tasks?: any[]; // legacy optional for frontend UI compat, now using array from backend
  allow_task_selection?: boolean;
  selected_task_ids?: string[];
  selected_task_id?: string;
  selected_task?: any;
  solution?: any;
  solution_files?: any[];
  solutions?: any[];
}

export function countDistinctSelectedTasks(selectedTaskIds: any[]): number {
  if (!Array.isArray(selectedTaskIds) || selectedTaskIds.length === 0) return 0;
  
  // 1. Check for index-based IDs (task-0, task-1, etc.)
  const indexMatches = new Set<string>();
  selectedTaskIds.forEach((id) => {
    const m = String(id).match(/^task-(\d+)$/);
    if (m) indexMatches.add(m[1]);
  });
  if (indexMatches.size > 0) {
    return indexMatches.size;
  }

  // 2. Check for UUIDs
  const uuidMatches = new Set<string>();
  selectedTaskIds.forEach((id) => {
    const str = String(id);
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)) {
      uuidMatches.add(str.toLowerCase());
    }
  });
  if (uuidMatches.size > 0) {
    return uuidMatches.size;
  }

  // 3. Fallback: unique non-empty string count
  return new Set(selectedTaskIds.map(String).filter(Boolean)).size;
}

export function getLabCalculatedStats(l: LabItem): { minutes: number; marks: number; selectedTasks: any[] } {
  const allTasks = Array.isArray(l.tasks) ? l.tasks : [];
  if (allTasks.length === 0) {
    const rawIds = l.selected_task_ids && Array.isArray(l.selected_task_ids) ? l.selected_task_ids : [];
    const count = countDistinctSelectedTasks(rawIds) || (l.selected_task_id ? 1 : 0);
    const marks = Number(l.marks) || (count > 0 ? count * 2 : 10);
    const minutes = Number(l.duration_minutes) || (count > 0 ? count * 10 : 30);
    return {
      minutes,
      marks,
      selectedTasks: [],
    };
  }

  // If specific task IDs are selected
  if (l.selected_task_ids && Array.isArray(l.selected_task_ids) && l.selected_task_ids.length > 0) {
    const selectedSet = new Set(l.selected_task_ids.map(String));
    const selected = allTasks.filter((t: any, idx: number) => {
      const isMatch = (
        (t.id != null && selectedSet.has(String(t.id))) ||
        (t.task_slug != null && selectedSet.has(String(t.task_slug))) ||
        selectedSet.has(`task-${idx}`) ||
        selectedSet.has(`task-${t.order_index ?? idx}`) ||
        selectedSet.has(String(idx)) ||
        (t.title != null && selectedSet.has(String(t.title)))
      );
      return isMatch;
    });
    const tasksToSum = selected.length > 0 ? selected : allTasks;
    const calcMinutes = tasksToSum.reduce((sum: number, t: any) => sum + (Number(t.duration_minutes ?? t.duration) || 0), 0);
    const minutes = calcMinutes > 0 ? calcMinutes : (Number(l.duration_minutes) || 0);
    const calcMarks = tasksToSum.reduce((sum: number, t: any) => sum + (Number(t.marks ?? t.score) || 0), 0);
    const marks = (calcMarks > 0 || tasksToSum.length === 0) ? calcMarks : (Number(l.marks) || 0);
    return { minutes, marks, selectedTasks: tasksToSum };
  }

  // Legacy fallback: single selected_task_id or selected_task
  if (l.selected_task_id || l.selected_task) {
    const matching = l.selected_task || allTasks.find((t: any, idx: number) => {
      return (
        String(t.id) === String(l.selected_task_id) ||
        String(t.task_slug) === String(l.selected_task_id) ||
        `task-${idx}` === String(l.selected_task_id) ||
        String(t.title) === String(l.selected_task_id)
      );
    });
    if (matching) {
      const minutes = Number(matching.duration_minutes ?? matching.duration) || Number(l.duration_minutes) || 0;
      const marks = Number(matching.marks ?? matching.score) || Number(l.marks) || 0;
      return {
        minutes,
        marks,
        selectedTasks: [matching],
      };
    }
  }

  // All tasks selected
  const calcMinutes = allTasks.reduce((sum: number, t: any) => sum + (Number(t.duration_minutes ?? t.duration) || 0), 0);
  const minutes = calcMinutes > 0 ? calcMinutes : (Number(l.duration_minutes) || 0);
  const calcMarks = allTasks.reduce((sum: number, t: any) => sum + (Number(t.marks ?? t.score) || 0), 0);
  const marks = (calcMarks > 0 || allTasks.length === 0) ? calcMarks : (Number(l.marks) || 0);
  return { minutes, marks, selectedTasks: allTasks };
}

export interface QuestionItem {
  id: string;
  text: string; // Wait, frontend uses text instead of title maybe? Or text was in the mock. Let's use text for compat
  title?: string;
  programming_languages: ProgrammingLanguage[];
  databases: Database[];
  difficulty: Difficulty;
  experience: ExperienceLevel;
  format: Format;
  marks: number;
  duration_minutes: number;
  seconds?: number; // legacy
  course?: string;
  topic?: string;
}

export interface CourseItem {
  id: string;
  name: string;
}

export interface TopicItem {
  id: string;
  name: string;
  course: string;
}

export interface ProctoringConfig {
  enableProctoring?: boolean;
  webcamRequired?: boolean;
  screenShareRequired?: boolean;
  tabSwitchLimit?: number;
  disableCopyPaste?: boolean;
  enableCopyPaste?: boolean;
  tabSwitchAllowed?: boolean;
}

export type SectionType = "labs" | "assessment" | "discussion" | "system_design";

export interface LabsSection {
  id: string;
  kind: "labs";
  title: string;
  labs: LabItem[];
  proctoring?: ProctoringConfig;
}
export interface AssessmentSection {
  id: string;
  kind: "assessment";
  title: string;
  questions: QuestionItem[];
  randomize?: boolean;
  shuffle?: boolean;
  proctoring?: ProctoringConfig;
}
export interface PredefinedQuestion {
  id?: string;
  text: string;
  follow_ups: PredefinedQuestion[];
}

export interface DiscussionSection {
  id: string;
  kind: "discussion";
  title: string;
  duration: number;
  mode: "Custom" | "Automatic" | "Hybrid";
  questions: PredefinedQuestion[];
  mockInterviewId?: string;
  proctoring?: ProctoringConfig;
  marks?: number;
  max_score?: number;
}

export interface SystemDesignChallengeItem {
  id: string;
  title: string;
  description?: string;
  system_slug?: string;
  scenario_type?: string;
  company?: string;
  difficulty?: Difficulty;
  domain?: Domain;
  duration_minutes?: number;
  marks?: number;
  tasks?: any[];
  constraints?: string[];
  starter_design?: any;
  solution_design?: any;
}

export interface SystemDesignSection {
  id: string;
  kind: "system_design";
  title: string;
  duration: number;
  marks: number;
  challenges?: SystemDesignChallengeItem[];
  questions?: SystemDesignChallengeItem[];
  proctoring?: ProctoringConfig;
}

export type Section = LabsSection | AssessmentSection | DiscussionSection | SystemDesignSection;

export function mapDomainToBackend(domain?: string): string {
  if (!domain) return "OTHER";
  const normalized = domain.trim().toUpperCase().replace(/\s+/g, "_");
  const validMap: Record<string, string> = {
    FINANCE: "FINANCE",
    INSURANCE: "INSURANCE",
    EDTECH: "EDTECH",
    SUPPLY_CHAIN: "SUPPLY_CHAIN",
    HEALTHCARE: "HEALTHCARE",
    RETAIL: "RETAIL",
    PAYMENT: "PAYMENT",
    OTHER: "OTHER",
  };
  return validMap[normalized] || "OTHER";
}

export function mapDomainToFrontend(domain?: string): Domain {
  if (!domain) return "Other";
  const normalized = domain.trim().toUpperCase().replace(/\s+/g, "_");
  const reverseMap: Record<string, Domain> = {
    FINANCE: "Finance",
    INSURANCE: "Insurance",
    EDTECH: "EdTech",
    SUPPLY_CHAIN: "Supply Chain",
    HEALTHCARE: "Healthcare",
    RETAIL: "Retail",
    PAYMENT: "Payment",
    OTHER: "Other",
  };
  return reverseMap[normalized] || "Other";
}

export interface Evaluation {
  id: string;
  title: string;
  domain: Domain | "";
  status: "draft" | "published";
  createdAt: number;
  publishedAt?: number;
  candidatesInvited: number;
  candidatesTotal: number;
  candidatesCompleted: number;
  sections: Section[];
  invite?: {
    type: "email" | "link" | "csv";
    emails: Array<{name: string; email: string}> | string[];
    expiry: "7" | "14" | "30" | "custom";
    attempts: "1" | "2" | "unlimited";
    link?: string;
    subject?: string;
    body?: string;
  };
  settings?: Record<string, any>;
  createdBy?: string;
  start_datetime?: string | null;
  expiry_datetime?: string | null;
}

// Ensure unique ID generation
export function newUid() {
  return Math.random().toString(36).slice(2, 10);
}

const API_BASE = (
  import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:8002/api"
).replace(/\/$/, "") + "/skill_evaluation";

function mapBackendToFrontend(be: any): Evaluation {
  const settings = be.settings || {};

  let parsedEmails: Array<{name: string, email: string}> = [];
    if (Array.isArray(be.candidate_invited_emails)) {
      parsedEmails = be.candidate_invited_emails.map((e: any) => typeof e === 'string' ? {name: '', email: e} : {name: e.name || '', email: e.email});
    } else if (be.candidate_invited_emails && typeof be.candidate_invited_emails === 'object') {
      parsedEmails = Object.entries(be.candidate_invited_emails).map(([email, data]: [string, any]) => {
        if (typeof data === 'object' && data !== null) {
          return { email, name: data.name || '' };
        }
        return { email, name: '' };
      });
    }

  return {
    id: be.id,
    title: be.title || "Untitled Evaluation",
    domain: mapDomainToFrontend(be.domain),
    status: be.is_published ? "published" : "draft",
    createdAt: be.created_at ? new Date(be.created_at).getTime() : Date.now(),
    candidatesInvited: be.candidates_invited_count || be.candidate_invited_emails?.length || 0,
    candidatesTotal: be.total_candidates_count || be.candidates_invited_count || 0,
    candidatesCompleted: be.completed_candidates_count || 0,
    createdBy: be.created_by || "",
    settings: settings,
    start_datetime: be.start_datetime || null,
    expiry_datetime: be.expiry_datetime || null,
    invite: be.candidate_invited_emails && Object.keys(be.candidate_invited_emails).length > 0 || be.expiry_datetime
      ? {
          type: "email",
          emails: parsedEmails,
          expiry: "14",
          attempts: settings.attempts || "1",
        }
      : undefined,
    sections: (be.sections || []).map((s: any) => {
      let proctoring = {};
      try { proctoring = typeof s.proctoring_config === 'string' ? JSON.parse(s.proctoring_config) : (s.proctoring_config || {}); } catch {}
      if (s.type === "LAB") {
        return { id: s.id || newUid(), kind: "labs", title: s.title, labs: s.questions || [], proctoring };
      } else if (s.type === "VITARKA_AI_INTERVIEW") {
        let meta: any = { duration: 15, mode: "Automatic" };
        try {
          meta = JSON.parse(s.description || "{}");
        } catch {}
        const marks = meta.marks ?? meta.max_score ?? 25;
        return {
          id: s.id || newUid(),
          kind: "discussion",
          title: s.title,
          duration: meta.duration || 15,
          mode: meta.mode || "Automatic",
          questions: s.questions || [],
          mockInterviewId: meta.mockInterviewId,
          marks,
          max_score: marks,
          proctoring
        };
      } else if (s.type === "SYSTEM_DESIGN") {
        let meta: any = {};
        try {
          meta = typeof s.description === "string" ? JSON.parse(s.description || "{}") : (s.description || {});
        } catch {}
        const firstQ = (s.questions && s.questions[0]) || {};
        const duration = Number(meta.duration || firstQ.duration_minutes || s.duration_minutes || 45);
        const marks = Number(meta.marks || firstQ.marks || s.marks || 30);
        return {
          id: s.id || newUid(),
          kind: "system_design",
          title: s.title || "System Design",
          duration,
          marks,
          challenges: s.questions || [],
          questions: s.questions || [],
          proctoring
        };
      } else {
        return {
          id: s.id || newUid(),
          kind: "assessment",
          title: s.title,
          questions: s.questions || [],
          proctoring
        };
      }
    }),
  };
}

export function getVitarkaDiscussionConfig(sections: Section[] = []): {
  marks: number;
  duration: number;
  labsCount: number;
  hasAssessment: boolean;
} {
  const labSections = sections.filter((s: any) => s.kind === "labs" || s.type === "LAB");
  const labsCount = labSections.reduce(
    (sum: number, s: any) => sum + (s.labs?.length || s.questions?.length || 0),
    0
  );
  const hasAssessment = sections.some(
    (s: any) => s.kind === "assessment" || s.type === "KNOWLEDGE_ASSESSMENT"
  );

  const marks = labsCount * 10 + (hasAssessment ? 10 : 0);
  const duration = labsCount * 10 + (hasAssessment ? 5 : 0);

  return { marks, duration, labsCount, hasAssessment };
}

export function syncDiscussionConfig(e: Evaluation): Evaluation {
  const { marks, duration } = getVitarkaDiscussionConfig(e.sections);
  for (const s of e.sections) {
    if (s.kind === "discussion") {
      s.marks = marks;
      s.max_score = marks;
      s.duration = duration;
    }
  }
  return e;
}

function mapFrontendToBackend(fe: Evaluation): any {
  const settings = { ...(fe.settings || {}) };

  const payload: any = {
    title: fe.title,
    domain: mapDomainToBackend(fe.domain),
    is_published: fe.status === "published",
    status: fe.status || "draft",
    start_datetime: fe.start_datetime || null,
    expiry_datetime: fe.expiry_datetime || null,
    settings: settings,
    candidate_invited_emails: (fe.invite?.type === "email" || fe.invite?.type === "csv") && fe.invite?.emails ? fe.invite.emails.reduce((acc: any, curr: any) => {
      if (typeof curr === 'string') {
        acc[curr] = { invited_at: Date.now(), name: "" };
      } else {
        acc[curr.email] = { invited_at: Date.now(), name: curr.name || "" };
      }
      return acc;
    }, {}) : {},
    subject: fe.invite?.subject || undefined,
    body: fe.invite?.body || undefined,
    sections: fe.sections.map((s: any, idx: number) => {

      let type = "KNOWLEDGE_ASSESSMENT";
      let qs = [];
      let desc = "";
      if (s.kind === "labs") {
        type = "LAB";
        qs = (s.labs || []).map((l: any) => {
          const stats = getLabCalculatedStats(l);
          return {
            ...l,
            duration_minutes: stats.minutes,
            marks: stats.marks,
          };
        });
      } else if (s.kind === "assessment") {
        type = "KNOWLEDGE_ASSESSMENT";
        qs = s.questions || [];
      } else if (s.kind === "discussion") {
        type = "VITARKA_AI_INTERVIEW";
        qs = s.questions || [];
        const { marks: calcMarks, duration: calcDur } = getVitarkaDiscussionConfig(fe.sections);
        const marks = s.marks != null ? s.marks : (s.max_score != null ? s.max_score : calcMarks);
        const duration = s.duration != null ? s.duration : calcDur;
        desc = JSON.stringify({
          duration,
          mode: s.mode || "Automatic",
          mockInterviewId: s.mockInterviewId,
          marks,
          max_score: marks,
          discussionMaxScore: marks,
        });
      } else if (s.kind === "system_design") {
        type = "SYSTEM_DESIGN";
        qs = s.challenges || s.questions || [];
        const firstQ = qs[0] || {};
        const duration = s.duration != null ? s.duration : (firstQ.duration_minutes || 45);
        const marks = s.marks != null ? s.marks : (firstQ.marks || 30);
        desc = JSON.stringify({
          duration,
          marks,
          system_slug: firstQ.system_slug || "systemdesign-url-shortener",
        });
      }

      return {
        title: s.title,
        description: desc,
        type: type,
        order_index: idx,
        questions: qs,
        proctoring_config: s.proctoring || {},
      };
    }),
  };

  return payload;
}

export const SEED_EVALUATIONS: Evaluation[] = [
  {
    id: "eval-senior-architect",
    title: "Senior Full-Stack & System Architect",
    domain: "Finance",
    status: "published",
    createdAt: Date.now() - 7 * 86400000,
    publishedAt: Date.now() - 7 * 86400000,
    candidatesInvited: 54,
    candidatesTotal: 54,
    candidatesCompleted: 42,
    invite: {
      type: "link",
      emails: [],
      expiry: "14",
      attempts: "1",
      link: "/evaluation?e=eval-senior-architect",
      subject: "Invitation: Senior Full-Stack & System Architect Evaluation",
      body: "You have been invited to complete a realistic engineering evaluation."
    },
    sections: [
      {
        id: "sec-labs-1",
        kind: "labs",
        title: "Engineering Labs",
        labs: [
          {
            id: "lab-payment-webhook",
            title: "Payment Webhook Idempotency & Retry Worker",
            description: "Fix race conditions in webhook processing and implement idempotent transactions with Redis distributed locks and jittered retry backoff.",
            programming_languages: ["TypeScript", "JavaScript"],
            databases: ["Redis", "PostgreSQL"],
            scenario: "Debugging",
            difficulty: "Medium",
            marks: 40,
            duration_minutes: 45,
            tasks: [
              {
                id: "task-1",
                title: "Enforce Idempotency Key Caching",
                description: "Validate X-Idempotency-Key header against Redis before initiating transaction.",
                marks: 15,
                duration_minutes: 15
              },
              {
                id: "task-2",
                title: "Exponential Backoff & Jitter",
                description: "Implement capped exponential backoff with full jitter for transient 5xx HTTP responses.",
                marks: 15,
                duration_minutes: 15
              },
              {
                id: "task-3",
                title: "Dead-Letter Queue (DLQ) Notification",
                description: "Route persistently failing payloads to the dead_letter_webhooks queue with error context.",
                marks: 10,
                duration_minutes: 15
              }
            ],
            selected_task_ids: ["task-1", "task-2", "task-3"],
            allow_task_selection: true
          },
          {
            id: "lab-ledger-rollup",
            title: "Financial Ledger Double-Entry Rollup",
            description: "Optimize high-frequency ledger balance calculations using PostgreSQL window functions and optimistic concurrency control.",
            programming_languages: ["SQL", "Python"],
            databases: ["PostgreSQL"],
            scenario: "Performance Optimization",
            difficulty: "Medium",
            marks: 30,
            duration_minutes: 30,
            tasks: [
              {
                id: "task-1",
                title: "Optimistic Version Locking",
                description: "Ensure account balance reconciliation uses version check to prevent double spending.",
                marks: 15,
                duration_minutes: 15
              },
              {
                id: "task-2",
                title: "Covering Index on Ledger Entries",
                description: "Create compound index on (account_id, posting_date DESC) INCLUDE (amount, status).",
                marks: 15,
                duration_minutes: 15
              }
            ],
            selected_task_ids: ["task-1", "task-2"],
            allow_task_selection: true
          }
        ],
        proctoring: { enableProctoring: true, webcamRequired: true, screenShareRequired: false, tabSwitchLimit: 3 }
      },
      {
        id: "sec-assessment-1",
        kind: "assessment",
        title: "Knowledge Assessment",
        questions: [
          {
            id: "q-1",
            text: "When implementing the Saga pattern for distributed transactions, which mechanism guarantees eventual consistency in the presence of orchestrator node crashes?",
            title: "Saga Pattern Eventual Consistency",
            programming_languages: ["Java", "Python"],
            databases: ["PostgreSQL"],
            difficulty: "Hard",
            experience: "Senior Developer",
            format: "MCQ",
            marks: 5,
            duration_minutes: 3,
            course: "System Architecture"
          },
          {
            id: "q-2",
            text: "Which PostgreSQL transaction isolation level prevents Write Skew anomalies without requiring explicit SELECT FOR UPDATE table locks?",
            title: "PostgreSQL Isolation Levels & Anomalies",
            programming_languages: ["SQL"],
            databases: ["PostgreSQL"],
            difficulty: "Medium",
            experience: "Mid-Level Developer",
            format: "MCQ",
            marks: 5,
            duration_minutes: 2,
            course: "Database Systems"
          },
          {
            id: "q-3",
            text: "Which of the following caching strategies best mitigates cache stampede (thundering herd) during high-throughput flash sale events? (Select all that apply)",
            title: "Cache Stampede Mitigation Strategies",
            programming_languages: ["TypeScript", "Python"],
            databases: ["Redis"],
            difficulty: "Medium",
            experience: "Senior Developer",
            format: "Multiple Select",
            marks: 5,
            duration_minutes: 3,
            course: "Distributed Caching"
          },
          {
            id: "q-4",
            text: "How does React 18 Concurrent Mode Fiber reconciler handle high-priority user input events during an ongoing heavy background transition render?",
            title: "React Fiber Concurrency & Transitions",
            programming_languages: ["TypeScript", "JavaScript"],
            databases: [],
            difficulty: "Medium",
            experience: "Senior Developer",
            format: "MCQ",
            marks: 5,
            duration_minutes: 3,
            course: "Frontend Architecture"
          },
          {
            id: "q-5",
            text: "In Kafka consumer groups, what triggers a partition rebalance, and how does the cooperative sticky assignor minimize consumer downtime during rebalances?",
            title: "Kafka Consumer Rebalancing & Sticky Assignors",
            programming_languages: ["Java", "Python"],
            databases: [],
            difficulty: "Hard",
            experience: "Senior Developer",
            format: "MCQ",
            marks: 5,
            duration_minutes: 4,
            course: "Distributed Streaming"
          },
          {
            id: "q-6",
            text: "Explain the tradeoff between Read-Heavy LSM trees (RocksDB) vs Write-Balanced B+ Trees (InnoDB) regarding write amplification and compaction overhead.",
            title: "LSM Trees vs B+ Trees Tradeoffs",
            programming_languages: ["C++", "Java"],
            databases: ["PostgreSQL", "MySQL"],
            difficulty: "Hard",
            experience: "Lead Architect",
            format: "Description",
            marks: 5,
            duration_minutes: 5,
            course: "Storage Engines"
          }
        ],
        proctoring: { enableProctoring: true, disableCopyPaste: true }
      },
      {
        id: "sec-system-design-1",
        kind: "system_design",
        title: "System Design Challenge",
        duration: 45,
        marks: 30,
        challenges: [
          {
            id: "sd-url-shortener",
            title: "Design a High-Throughput URL Shortener (TinyURL)",
            description: "Architect a resilient, distributed URL shortening service capable of creating billions of aliases and serving high-frequency redirects with sub-millisecond response times, low latency CDN caching, and custom analytics tracking.",
            system_slug: "systemdesign-url-shortener",
            scenario_type: "Distributed Storage & Routing",
            company: "Uber",
            difficulty: "Medium",
            domain: "Finance",
            duration_minutes: 45,
            marks: 30,
            constraints: [
              "100M new URLs shortened per month (10:1 read-to-write ratio)",
              "URL redirects must respond in < 15ms at p99",
              "99.999% availability for resolution endpoints",
              "Shortened keys must be 7-8 base62 alphanumeric characters",
              "Protect against malicious redirects and rate-limit abusive IP ranges"
            ],
            tasks: [
              { id: "t1", title: "HLD Architecture Canvas", description: "Design client DNS, API Gateway, Key Generation Service (KGS), cache layer, and database cluster with replication.", marks: 10 },
              { id: "t2", title: "Database Schema (DBML)", description: "Define relational or NoSQL schema for URLs, users, expiration timestamps, and analytics telemetry.", marks: 10 },
              { id: "t3", title: "REST API Contracts", description: "Specify endpoints for POST /api/v1/shorten, GET /{shortCode}, and GET /api/v1/analytics.", marks: 5 },
              { id: "t4", title: "Sequence Diagrams", description: "Model the end-to-end request lifecycle for URL creation and cached redirection lookup.", marks: 5 }
            ]
          }
        ],
        proctoring: { enableProctoring: true }
      },
      {
        id: "sec-discussion-1",
        kind: "discussion",
        title: "Vitarka AI Technical Interview",
        duration: 20,
        marks: 25,
        max_score: 25,
        mode: "Automatic",
        mockInterviewId: "mock-eval-1",
        questions: [
          {
            id: "dq-1",
            text: "Walk me through how your payment webhook retry worker handles Redis cluster failover when locks expire prematurely.",
            follow_ups: [
              { id: "dq-1-1", text: "How would you prevent duplicate writes if the worker loses network connectivity right before acknowledging?", follow_ups: [] }
            ]
          },
          {
            id: "dq-2",
            text: "In your system design for the URL shortener, what considerations led you to choose between Cassandra vs PostgreSQL with horizontal sharding?",
            follow_ups: [
              { id: "dq-2-1", text: "How would you handle sudden celebrity hot keys where one shortened link receives 500,000 queries per second?", follow_ups: [] }
            ]
          },
          {
            id: "dq-3",
            text: "If you had an extra 30 minutes on this evaluation, what is the single biggest architectural improvement or test coverage you would add?",
            follow_ups: []
          }
        ],
        proctoring: { enableProctoring: true }
      }
    ]
  },
  {
    id: "eval-backend-distributed",
    title: "Lead Backend Engineer (Distributed Systems)",
    domain: "Supply Chain",
    status: "published",
    createdAt: Date.now() - 14 * 86400000,
    publishedAt: Date.now() - 14 * 86400000,
    candidatesInvited: 68,
    candidatesTotal: 68,
    candidatesCompleted: 47,
    invite: {
      type: "link",
      emails: [],
      expiry: "30",
      attempts: "1",
      link: "/evaluation?e=eval-backend-distributed"
    },
    sections: [
      {
        id: "sec-labs-2",
        kind: "labs",
        title: "Engineering Labs",
        labs: [
          {
            id: "lab-kafka-stream",
            title: "Kafka Event Stream Deduplication & Lock Manager",
            description: "Handle out-of-order logistics fleet telemetry and build a sliding window deduplicator with exactly-once processing guarantees.",
            programming_languages: ["Java", "Python"],
            databases: ["Redis", "PostgreSQL"],
            scenario: "Architecture",
            difficulty: "Hard",
            marks: 50,
            duration_minutes: 50,
            tasks: [
              { id: "t1", title: "Sliding Window Deduplication", description: "Use RocksDB state stores to filter duplicate vehicle GPS pings within a 15-minute tumbling window.", marks: 25, duration_minutes: 25 },
              { id: "t2", title: "Distributed Lease Renewal", description: "Implement heartbeat lease renewals to prevent split-brain partition leaders.", marks: 25, duration_minutes: 25 }
            ],
            selected_task_ids: ["t1", "t2"],
            allow_task_selection: true
          }
        ]
      },
      {
        id: "sec-sd-2",
        kind: "system_design",
        title: "System Design Challenge",
        duration: 45,
        marks: 30,
        challenges: [
          {
            id: "sd-fleet-tracking",
            title: "Design a Real-Time Logistics Fleet Telemetry Platform",
            description: "Ingest and process 500k vehicle GPS updates per second, compute estimated delivery arrival times with geospatial indexing, and trigger geofence breach alerts.",
            company: "Delhivery",
            difficulty: "Hard",
            domain: "Supply Chain",
            duration_minutes: 45,
            marks: 30
          }
        ]
      },
      {
        id: "sec-disc-2",
        kind: "discussion",
        title: "Vitarka AI Technical Interview",
        duration: 20,
        marks: 25,
        mode: "Automatic",
        questions: [
          { id: "dq-1", text: "How do you handle partition rebalancing without pausing live real-time fleet GPS event processing?", follow_ups: [] }
        ]
      }
    ]
  },
  {
    id: "eval-frontend-lead",
    title: "Staff Frontend Architect (React & Performance)",
    domain: "Retail",
    status: "published",
    createdAt: Date.now() - 21 * 86400000,
    publishedAt: Date.now() - 21 * 86400000,
    candidatesInvited: 36,
    candidatesTotal: 36,
    candidatesCompleted: 29,
    sections: [
      {
        id: "sec-labs-3",
        kind: "labs",
        title: "Engineering Labs",
        labs: [
          {
            id: "lab-react-grid",
            title: "React Virtualized 100k-Row Data Grid",
            description: "Implement a windowed data table with dynamic row heights, column resizing, keyboard accessibility, and AbortController request canceling.",
            programming_languages: ["TypeScript", "JavaScript"],
            databases: [],
            scenario: "Performance Optimization",
            difficulty: "Medium",
            marks: 50,
            duration_minutes: 40,
            tasks: [
              { id: "t1", title: "Windowed Virtualization", description: "Render only visible row slices into the DOM buffer with transform translateY.", marks: 25, duration_minutes: 20 },
              { id: "t2", title: "AbortController Search Debounce", description: "Cancel inflight fetch queries when the user rapidly types in the filter input.", marks: 25, duration_minutes: 20 }
            ],
            selected_task_ids: ["t1", "t2"],
            allow_task_selection: true
          }
        ]
      },
      {
        id: "sec-assessment-3",
        kind: "assessment",
        title: "Knowledge Assessment",
        questions: [
          { id: "q-1", text: "Explain the difference between Interaction to Next Paint (INP) and First Input Delay (FID) Core Web Vitals.", title: "Core Web Vitals INP vs FID", programming_languages: ["JavaScript"], databases: [], difficulty: "Medium", experience: "Senior Developer", format: "MCQ", marks: 10, duration_minutes: 5, course: "Web Performance" }
        ]
      },
      {
        id: "sec-disc-3",
        kind: "discussion",
        title: "Vitarka AI Technical Interview",
        duration: 15,
        marks: 20,
        mode: "Automatic",
        questions: [
          { id: "dq-1", text: "Walk me through how you identify and fix long JavaScript main thread tasks causing INP degradation.", follow_ups: [] }
        ]
      }
    ]
  },
  {
    id: "eval-data-engineer",
    title: "Senior Data & Analytics Platform Engineer",
    domain: "Healthcare",
    status: "draft",
    createdAt: Date.now() - 2 * 86400000,
    candidatesInvited: 0,
    candidatesTotal: 0,
    candidatesCompleted: 0,
    sections: [
      {
        id: "sec-labs-4",
        kind: "labs",
        title: "Engineering Labs",
        labs: [
          {
            id: "lab-sql-analytics",
            title: "Healthcare Patient Cohort Retention & HIPAA Masking",
            description: "Write automated ETL pipelines for anonymizing PHI data and computing 30-day readmission metrics.",
            programming_languages: ["SQL", "Python"],
            databases: ["PostgreSQL", "Snowflake"],
            scenario: "Feature Development",
            difficulty: "Medium",
            marks: 40,
            duration_minutes: 35,
            tasks: [
              { id: "t1", title: "Deterministic Hash Masking", description: "Mask Patient SSN and Name using SHA-256 HMAC salt.", marks: 20, duration_minutes: 15 },
              { id: "t2", title: "Cohort 30-Day Readmission SQL", description: "Compute rolling 30-day readmission rate with partition by patient_id.", marks: 20, duration_minutes: 20 }
            ],
            selected_task_ids: ["t1", "t2"],
            allow_task_selection: true
          }
        ]
      }
    ]
  }
];

export async function listEvaluations(): Promise<Evaluation[]> {
  try {
    const data = await restApiAuthUtil.get<any[]>("/skill_evaluation/evaluations/");
    if (Array.isArray(data) && data.length > 0) {
      let allLabs: any[] = [];
      try {
        allLabs = await restApiAuthUtil.get<any[]>("/skill_evaluation/lab-questions/");
      } catch {}

      return data.map((item) => {
        const fe = mapBackendToFrontend(item);
        for (const section of fe.sections) {
          if (section.kind === "labs" && section.labs) {
            section.labs = section.labs.map((l: any) => {
              const labId = String(l.id || l.lab_id || "");
              const fullLab = (allLabs as any[]).find((f: any) => String(f.id) === labId);
              const base = fullLab ? { ...fullLab, ...l, tasks: fullLab.tasks || l.tasks } : { ...l };
              if (!base.solution && fullLab?.solution) base.solution = fullLab.solution;
              if (!base.solution_files && fullLab?.solution_files) base.solution_files = fullLab.solution_files;
              const stats = getLabCalculatedStats(base);
              if (stats.selectedTasks.length > 0 && stats.selectedTasks.length < (fullLab?.tasks?.length || 5)) {
                base.selected_task_ids = stats.selectedTasks.map((t: any, idx: number) => String(t.id ?? t.task_slug ?? `task-${idx}`));
              }
              return {
                ...base,
                duration_minutes: stats.minutes,
                marks: stats.marks,
              };
            });
          }
        }
        return fe;
      });
    }
  } catch {}

  // Fallback to locally saved evaluations or seed evaluations
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("yuvro_local_evaluations");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem("yuvro_local_evaluations", JSON.stringify(SEED_EVALUATIONS));
    } catch {}
  }
  return SEED_EVALUATIONS;
}

export async function hydrateDiscussionQuestions(ev: Evaluation): Promise<Evaluation> {
  for (const section of ev.sections) {
    if (section.kind === "discussion" && section.mockInterviewId) {
      try {
        const res = await yhubApiAuthUtil.get<any>(`/mock-interviews/${section.mockInterviewId}/`);
        if (res.predefined_tree) {
          section.questions = res.predefined_tree;
        }
      } catch (err) {
        console.error("Failed to fetch mock interview tree", err);
      }
    }
  }
  return ev;
}

export async function syncMockInterviews(e: Evaluation): Promise<Evaluation> {
  let discussionCounter = 1;
  const { marks: calcMarks, duration: calcDur } = getVitarkaDiscussionConfig(e.sections);
  for (const section of e.sections) {
    if (section.kind === "discussion") {
      const duration = section.duration != null ? section.duration : calcDur;
      const marks = section.marks != null ? section.marks : (section.max_score != null ? section.max_score : calcMarks);
      section.duration = duration;
      section.marks = marks;
      section.max_score = marks;
      const payload = {
        title: `${e.title} - ${discussionCounter}`,
        description: "Vitarka AI Interview created from ylabs-web",
        publish_status: "active",
        max_duration: duration,
        max_score: marks,
        predefined_tree: section.questions,
        interview_mode: section.mode ? section.mode.toLowerCase() : "automatic",
      };
      try {
        if (section.mockInterviewId) {
          await yhubApiAuthUtil.put(`/mock-interviews/${section.mockInterviewId}/`, payload);
        } else {
          const res = await yhubApiAuthUtil.post<any>(`/mock-interviews/`, payload);
          section.mockInterviewId = res.id;
        }
      } catch (err) {
        console.error("Failed to sync mock interview", err);
      }
      discussionCounter++;
    }
  }
  return e;
}

export async function hydrateLabQuestions(ev: Evaluation): Promise<Evaluation> {
  try {
    const allLabs = await restApiAuthUtil.get<any[]>("/skill_evaluation/lab-questions/");
    for (const section of ev.sections) {
      if (section.kind === "labs" && section.labs) {
        const deduplicatedLabs: any[] = [];
        const seenLabIds = new Map<string, any>();

        section.labs.forEach((l: any) => {
          const labId = String(typeof l === "object" ? (l.id || l.lab_id || l.question_id || "") : (l || ""));
          if (!labId) return;
          const fullLab = (allLabs as any[]).find((item: any) =>
            String(item.id) === labId ||
            (item.title && typeof l === "object" && l.title && String(item.title).toLowerCase() === String(l.title).toLowerCase())
          );
          const lObj = typeof l === "object" ? l : { id: labId };
          const base = fullLab ? { ...fullLab, ...lObj, tasks: (fullLab.tasks && fullLab.tasks.length > 0 ? fullLab.tasks : lObj.tasks) } : { ...lObj };
          if (!base.solution && fullLab?.solution) base.solution = fullLab.solution;
          if (!base.solution_files && fullLab?.solution_files) base.solution_files = fullLab.solution_files;

          if (base.selected_task_id && (!base.selected_task_ids || base.selected_task_ids.length === 0)) {
            base.selected_task_ids = [String(base.selected_task_id)];
          }

          const stats = getLabCalculatedStats(base);
          base.duration_minutes = stats.minutes;
          base.marks = stats.marks;
          if (stats.selectedTasks.length > 0 && stats.selectedTasks.length < (fullLab?.tasks?.length || 5)) {
            base.selected_task_ids = stats.selectedTasks.map((t: any, idx: number) => String(t.id ?? t.task_slug ?? `task-${idx}`));
          }

          if (!seenLabIds.has(labId)) {
            seenLabIds.set(labId, base);
            deduplicatedLabs.push(base);
          } else {
            // Already present: merge selected tasks into the single lab
            const existing = seenLabIds.get(labId);
            const currentSelected = new Set((existing.selected_task_ids || []).map(String));
            if (base.selected_task_ids) {
              base.selected_task_ids.forEach((id: string) => currentSelected.add(String(id)));
            }
            if (base.selected_task_id) {
              currentSelected.add(String(base.selected_task_id));
            }
            existing.selected_task_ids = Array.from(currentSelected);
            const mergedStats = getLabCalculatedStats(existing);
            existing.duration_minutes = mergedStats.minutes;
            existing.marks = mergedStats.marks;
            if (mergedStats.selectedTasks.length > 0 && mergedStats.selectedTasks.length < (fullLab?.tasks?.length || 5)) {
              existing.selected_task_ids = mergedStats.selectedTasks.map((t: any, idx: number) => String(t.id ?? t.task_slug ?? `task-${idx}`));
            }
          }
        });
        section.labs = deduplicatedLabs;
      }
    }
  } catch (err) {
    console.error("Failed to hydrate lab questions", err);
  }
  return ev;
}

export function generateMockSubmissions(evaluationId: string): any[] {
  const names = [
    "Kadali Harshavardhan", "Medishetty Manikanta Gandhi", "Mrinal Guptha", "Mucharla Sreelekha",
    "Rohith Godugu", "Devendra Dora", "Shilpa Dora", "Priya Sharma", "Aditya Nair", "Ananya Sen",
    "Rahul Verma", "Sneha Patel", "Vikram Malhotra", "Kavya Reddy", "Arjun Mehta", "Meera Iyer",
    "Nikhil Joshi", "Divya Krishnan", "Siddharth Rao", "Aishwarya Roy", "Gaurav Agarwal",
    "Tanvi Deshmukh", "Rohan Kulkarni", "Pooja Hegde", "Karan Bhatia", "Isha Chawla", "Aman Singhania", "Rhea Kapoor"
  ];
  const colleges = ["IIT Bombay", "BITS Pilani", "NIT Trichy", "IIIT Hyderabad", "IIT Delhi", "IIT Madras", "VIT Vellore", "DTU Delhi"];
  const companies = ["Razorpay", "Swiggy", "Flipkart", "CRED", "Zomato", "Amazon", "Infosys", "PhonePe", "Microsoft"];

  return names.map((name, i) => {
    const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, ".")}${100 + i}@gmail.com`;
    const college = colleges[i % colleges.length];
    const company = companies[i % companies.length];
    const phone = `+91 98450 ${10000 + i * 111}`;
    const score = 70 + (i * 7) % 28;
    return {
      id: `sub-${evaluationId}-${i + 1}`,
      full_name: name,
      name,
      email,
      phone,
      college,
      company,
      experience: (i % 7) + 1,
      score,
      percentage: Math.min(100, Math.round(score * 1.05)),
      submitted_at: Date.now() - (i + 1) * 3600000 * 8,
      created_at: new Date(Date.now() - (i + 1) * 3600000 * 8).toISOString(),
      user: {
        id: `usr-${i + 1}`,
        full_name: name,
        email,
        phone,
        college,
        company,
        experience: (i % 7) + 1,
      },
      lab_submissions: [
        {
          lab_question: {
            id: "lab-payment-webhook",
            title: "Payment Webhook Idempotency & Retry Worker"
          },
          score: Math.round(score * 0.4),
          solution: `// Idempotent webhook processor implementation\nexport class WebhookDispatcher {\n  async processWebhook(payload: any) {\n    // Acquired distributed lock & checked Redis idempotency\n    return { status: 200, duplicate: false };\n  }\n}`,
          solution_output: JSON.stringify({
            tasks: [
              { id: "task-1", title: "Enforce Idempotency Key Caching", passed: true, score: 15 },
              { id: "task-2", title: "Exponential Backoff & Jitter", passed: true, score: 15 },
              { id: "task-3", title: "Dead-Letter Queue (DLQ) Notification", passed: i % 4 !== 0, score: i % 4 !== 0 ? 10 : 0 }
            ],
            percentage: Math.min(100, score),
            total_score: Math.round(score * 0.4)
          })
        }
      ],
      knowledge_submissions: [
        { question_id: "q-1", selected_option: 0, is_correct: true, marks: 5 },
        { question_id: "q-2", selected_option: 1, is_correct: true, marks: 5 },
        { question_id: "q-3", selected_option: 0, is_correct: i % 3 !== 0, marks: i % 3 !== 0 ? 5 : 0 }
      ],
      system_design_submission: {
        status: "submitted",
        score: Math.round(score * 0.3),
        design: {
          nodes: [
            { id: "1", type: "custom", data: { label: "Client DNS / Cloudflare CDN", icon: "Globe" }, position: { x: 100, y: 150 } },
            { id: "2", type: "custom", data: { label: "API Gateway (Kong / Envoy)", icon: "Shield" }, position: { x: 300, y: 150 } },
            { id: "3", type: "custom", data: { label: "URL Shortener Service (Go)", icon: "Cpu" }, position: { x: 500, y: 150 } },
            { id: "4", type: "custom", data: { label: "Redis Cluster (L1 Cache)", icon: "Zap" }, position: { x: 500, y: 300 } },
            { id: "5", type: "custom", data: { label: "PostgreSQL Master-Replica", icon: "Database" }, position: { x: 750, y: 150 } }
          ],
          edges: [
            { id: "e1-2", source: "1", target: "2", animated: true },
            { id: "e2-3", source: "2", target: "3", animated: true },
            { id: "e3-4", source: "3", target: "4" },
            { id: "e3-5", source: "3", target: "5" }
          ]
        }
      }
    };
  });
}

export async function getEvaluation(id: string): Promise<Evaluation | undefined> {
  const localDraft = getDraftLocally(id);
  if (localDraft) return localDraft;

  try {
    const data = await restApiAuthUtil.get<any>(`/skill_evaluation/evaluations/${id}/`);
    if (data && (data.id || data.title)) {
      const fe = mapBackendToFrontend(data);
      await hydrateDiscussionQuestions(fe);
      await hydrateLabQuestions(fe);
      return fe;
    }
  } catch {}

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("yuvro_local_evaluations");
      if (stored) {
        const list: Evaluation[] = JSON.parse(stored);
        const match = list.find((e) => e.id === id);
        if (match) return match;
      }
    } catch {}
  }

  const seedMatch = SEED_EVALUATIONS.find((e) => e.id === id);
  if (seedMatch) return seedMatch;

  // Fallback to primary seed evaluation with requested ID so routes never 404
  return { ...SEED_EVALUATIONS[0], id };
}

export async function getEvaluationSubmissions(id: string): Promise<any[]> {
  try {
    const data = await restApiAuthUtil.get<any[]>(`/skill_evaluation/evaluations/${id}/submissions/`);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {}
  return generateMockSubmissions(id);
}

export async function saveEvaluation(e: Evaluation): Promise<Evaluation | undefined> {
  let savedFe: Evaluation = e;
  if (e.id === "draft") {
    savedFe = { ...e, id: `eval-${Date.now().toString(36)}` };
  }
  try {
    const payload = mapFrontendToBackend(e);
    let data;
    if (e.id === "draft") {
      data = await restApiAuthUtil.post<any>("/skill_evaluation/evaluations/", payload);
    } else {
      data = await restApiAuthUtil.put<any>(`/skill_evaluation/evaluations/${e.id}/`, payload);
    }
    if (data && data.id) {
      savedFe = mapBackendToFrontend(data);
    }
  } catch (err: any) {
    console.warn("Backend save failed, saved locally instead:", err);
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("yuvro_local_evaluations");
      let list: Evaluation[] = stored ? JSON.parse(stored) : [...SEED_EVALUATIONS];
      const idx = list.findIndex((item) => item.id === savedFe.id || item.id === e.id);
      if (idx >= 0) {
        list[idx] = savedFe;
      } else {
        list.unshift(savedFe);
      }
      localStorage.setItem("yuvro_local_evaluations", JSON.stringify(list));
    } catch {}
  }
  return savedFe;
}

export async function createEvaluation(): Promise<Evaluation> {
  return {
    id: "draft",
    title: "Untitled Evaluation",
    domain: "",
    status: "draft",
    createdAt: Date.now(),
    candidatesInvited: 0,
    candidatesTotal: 0,
    candidatesCompleted: 0,
    sections: [],
  };
}

export function saveDraftLocally(e: Evaluation) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`draft_eval_${e.id}`, JSON.stringify(e));
  } catch (err) {
    console.error("Failed to save draft locally", err);
  }
}

export function getDraftLocally(id: string): Evaluation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`draft_eval_${id}`);
    if (raw) return JSON.parse(raw) as Evaluation;
  } catch {}
  return null;
}

export function clearDraftLocally(id: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`draft_eval_${id}`);
  } catch {}
}

export async function deleteEvaluation(id: string) {
  try {
    await restApiAuthUtil.delete(`/skill_evaluation/evaluations/${id}/`);
  } catch {}
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("yuvro_local_evaluations");
      if (stored) {
        let list: Evaluation[] = JSON.parse(stored);
        list = list.filter((e) => e.id !== id);
        localStorage.setItem("yuvro_local_evaluations", JSON.stringify(list));
      }
    } catch {}
  }
}

export async function duplicateEvaluation(id: string): Promise<Evaluation | undefined> {
  const src = await getEvaluation(id);
  if (!src) return;
  const newEval: Evaluation = {
    ...JSON.parse(JSON.stringify(src)),
    id: `eval-${Date.now().toString(36)}`,
    title: `${src.title} (Copy)`,
    createdAt: Date.now(),
    candidatesInvited: 0,
    candidatesTotal: 0,
    candidatesCompleted: 0,
    status: "draft",
  };
  try {
    const payload = mapFrontendToBackend(newEval);
    const data = await restApiAuthUtil.post<any>("/skill_evaluation/evaluations/", payload);
    if (data && data.id) return mapBackendToFrontend(data);
  } catch {}

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("yuvro_local_evaluations");
      let list: Evaluation[] = stored ? JSON.parse(stored) : [...SEED_EVALUATIONS];
      list.unshift(newEval);
      localStorage.setItem("yuvro_local_evaluations", JSON.stringify(list));
    } catch {}
  }
  return newEval;
}

export async function fetchLabs(): Promise<LabItem[]> {
  try {
    const list = await restApiAuthUtil.get<LabItem[]>("/skill_evaluation/lab-questions/");
    if (Array.isArray(list) && list.length > 0) return list;
  } catch {}
  return (SEED_EVALUATIONS[0].sections[0] as LabsSection).labs;
}

export async function fetchCourses(): Promise<CourseItem[]> {
  try {
    const data = await ycodeApiAuthUtil.get<any>("/course/courses/?basic=true");
    const list = Array.isArray(data) ? data : data.results || [];
    if (list.length > 0) return list;
  } catch {}
  return [
    { id: "backend", name: "Backend Engineering & Systems" },
    { id: "sysdesign", name: "System Design & Distributed Architecture" },
    { id: "frontend", name: "Frontend Architecture & Web Performance" },
    { id: "database", name: "Database Internals & Storage Engines" },
    { id: "devops", name: "Cloud Infrastructure & SRE" }
  ];
}

export async function fetchTopics(courseId?: string): Promise<TopicItem[]> {
  try {
    const url = courseId ? `/course/topics/?course=${courseId}&basic=true` : `/course/topics/?basic=true`;
    const data = await ycodeApiAuthUtil.get<any>(url);
    const list = Array.isArray(data) ? data : data.results || [];
    if (list.length > 0) return list;
  } catch {}
  return [
    { id: "distributed-caching", name: "Distributed Caching (Redis/Memcached)", course: courseId || "backend" },
    { id: "acid-transactions", name: "ACID & Distributed Transactions", course: courseId || "backend" },
    { id: "query-optimization", name: "Query Optimization & Indexing", course: courseId || "database" },
    { id: "react-concurrency", name: "React 18 Concurrency & Hydration", course: courseId || "frontend" },
    { id: "kafka-streaming", name: "Kafka Event Streaming & Partitioning", course: courseId || "sysdesign" },
    { id: "docker-k8s", name: "Container Orchestration & Kubernetes", course: courseId || "devops" }
  ];
}

export interface FetchQuestionsResult {
  results: QuestionItem[];
  count: number;
}

export async function fetchQuestions(
  courseId?: string,
  topicId?: string,
  search?: string,
  difficulty?: string,
  format?: string,
  page: number = 1,
  pageSize: number = 50
): Promise<FetchQuestionsResult> {
  try {
    const params = new URLSearchParams();
    params.set("page_size", "100");
    if (page) params.set("page", String(page));
    if (courseId && courseId !== "All") params.set("course", courseId);
    if (topicId && topicId !== "All") params.set("topic", topicId);
    if (search) params.set("search", search);
    if (difficulty && difficulty !== "All") params.set("difficulty", difficulty.toLowerCase());
    
    if (format && format !== "All") {
      const typeMap: Record<string, string> = {
        "MCQ": "mcq_single",
        "Multiple Select": "mcq_multiple",
        "Coding": "coding",
        "Description": "descriptive",
      };
      if (typeMap[format]) {
        params.set("type", typeMap[format]);
      }
    }

    const [knowledgeRes, courseRes] = await Promise.all([
      questionBankService.getKnowledgeQuestions().catch(() => []),
      ycodeApiAuthUtil.get<any>(`/course/questions/?${params.toString()}`).catch(() => null)
    ]);

    const knowledgeList = Array.isArray(knowledgeRes) ? knowledgeRes : ((knowledgeRes as any)?.results || []);
    const courseList = Array.isArray(courseRes) ? courseRes : ((courseRes as any)?.results || []);

    const rawCombined = [...knowledgeList, ...courseList];
    const seenIds = new Set();
    const uniqueRaw: any[] = [];
    for (const q of rawCombined) {
      if (!q || !q.id || seenIds.has(q.id)) continue;
      seenIds.add(q.id);
      uniqueRaw.push(q);
    }

    let results: QuestionItem[] = uniqueRaw.map((q: any) => ({
      ...q,
      id: q.id,
      title: q.title || q.name || q.content || "",
      content: q.content || q.description || (q.text !== q.title ? q.text : "") || "",
      text: q.title || q.content || "",
      programming_languages: q.programming_languages || [],
      databases: q.databases || [],
      difficulty: (q.difficulty === "medium" || q.difficulty === "MEDIUM" || q.difficulty === "Medium"
        ? "Medium"
        : q.difficulty === "hard" || q.difficulty === "HARD" || q.difficulty === "Hard"
          ? "Hard"
          : "Easy") as Difficulty,
      experience: (q.experience || "Fresher") as ExperienceLevel,
      format: (q.format === "MCQ" || q.type === "mcq_single" || q.type === "MCQ"
        ? "MCQ"
        : q.format === "MULTIPLE SELECT" || q.format === "Multiple Select" || q.type === "mcq_multiple" || q.type === "MULTIPLE SELECT"
          ? "Multiple Select"
          : q.format === "CODING" || q.format === "Coding" || q.type === "coding" || q.type === "CODING"
            ? "Coding"
            : "Description") as Format,
      marks: q.marks || 1,
      duration_minutes: q.duration || q.duration_minutes || 1,
      course: q.course || q.course_id || "GENERAL",
      topic: q.topic || q.topic_id || "",
    }));

    if (courseId && courseId !== "All") {
      results = results.filter(q => q.course === courseId || q.course_name === courseId);
    }
    if (topicId && topicId !== "All") {
      results = results.filter(q => q.topic === topicId || q.topic_name === topicId);
    }
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(q => q.title.toLowerCase().includes(s) || q.text.toLowerCase().includes(s));
    }
    if (difficulty && difficulty !== "All") {
      results = results.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (format && format !== "All") {
      results = results.filter(q => q.format.toLowerCase() === format.toLowerCase());
    }

    return { results, count: results.length };
  } catch (err) {
    console.error("fetchQuestions error", err);
    return { results: [], count: 0 };
  }
}

export async function checkDuplicateQuestion(content: string, courseId: string) {
  try {
    const res = await ycodeApiAuthUtil.post<any>("/course/questions/check_duplicate/", {
      content,
      course: courseId,
    });
    return res;
  } catch (err) {
    console.error("Duplicate check error:", err);
    return { is_duplicate: false };
  }
}

export async function fetchQuestionDetails(id: string): Promise<QuestionItem | null> {
  try {
    let q1: any = null;
    let q2: any = null;

    try {
      q1 = await questionBankService.getKnowledgeQuestion(id);
    } catch {}

    try {
      q2 = await ycodeApiAuthUtil.get<any>(`/course/questions/${id}/`);
    } catch {}

    const q: any = { ...q1, ...q2 };
    if (!q || (!q.content && !q.title && !q.text)) return null;

    const testCases = (Array.isArray(q.test_cases_basic) && q.test_cases_basic.length > 0)
      ? q.test_cases_basic
      : (Array.isArray(q.test_cases) && q.test_cases.length > 0)
      ? q.test_cases
      : (Array.isArray(q1?.test_cases) && q1.test_cases.length > 0)
      ? q1.test_cases
      : (Array.isArray(q2?.test_cases_basic) && q2.test_cases_basic.length > 0)
      ? q2.test_cases_basic
      : [];

    const hints = (Array.isArray(q.hints) && q.hints.length > 0)
      ? q.hints
      : (Array.isArray(q1?.hints) && q1.hints.length > 0)
      ? q1.hints
      : (Array.isArray(q2?.hints) && q2.hints.length > 0)
      ? q2.hints
      : [];

    const solutions = (Array.isArray(q.solutions) && q.solutions.length > 0)
      ? q.solutions
      : (Array.isArray(q1?.solutions) && q1.solutions.length > 0)
      ? q1.solutions
      : (Array.isArray(q2?.solutions) && q2.solutions.length > 0)
      ? q2.solutions
      : [];

    return {
      ...q,
      id: q.id || id,
      title: q.title || q.name || q.content || "",
      content: q.content || q.description || (q.text !== q.title ? q.text : "") || "",
      text: q.title || q.content || "",
      test_cases: testCases,
      test_cases_basic: testCases,
      hints: hints,
      solutions: solutions,
      solution_explanation: q.solution_explanation || q1?.solution_explanation || q2?.solution_explanation || "",
      programming_languages: q.programming_languages || [],
      databases: q.databases || [],
      difficulty: (q.difficulty === "medium" || q.difficulty === "MEDIUM" || q.difficulty === "Medium"
        ? "Medium"
        : q.difficulty === "hard" || q.difficulty === "HARD" || q.difficulty === "Hard"
          ? "Hard"
          : "Easy") as Difficulty,
      experience: (q.experience || "Fresher") as ExperienceLevel,
      format: (q.format === "MCQ" || q.type === "mcq_single" || q.type === "MCQ"
        ? "MCQ"
        : q.format === "MULTIPLE SELECT" || q.format === "Multiple Select" || q.type === "mcq_multiple" || q.type === "MULTIPLE SELECT"
          ? "Multiple Select"
          : q.format === "CODING" || q.format === "Coding" || q.type === "coding" || q.type === "CODING"
            ? "Coding"
            : "Description") as Format,
      marks: q.marks || 1,
      duration_minutes: q.duration || q.duration_minutes || 1,
      course: q.course || q.course_id || "GENERAL",
      topic: q.topic || q.topic_id || "",
    };
  } catch (err) {
    console.error("Error fetching question details", err);
    return null;
  }
}

export function evaluationTotals(e: Evaluation) {
  let minutes = 0,
    marks = 0,
    labs = 0,
    questions = 0,
    discussion = 0;
  for (const s of e.sections) {
    if (s.kind === "labs") {
      labs += s.labs.length;
      minutes += s.labs.reduce((a, l) => a + getLabCalculatedStats(l).minutes, 0);
      marks += s.labs.reduce((a, l) => a + getLabCalculatedStats(l).marks, 0);
    } else if (s.kind === "assessment") {
      questions += s.questions.length;
      marks += s.questions.reduce((a, q) => a + (q.marks || 0), 0);
      minutes += s.questions.reduce(
        (a, q) => a + (q.duration_minutes || (q.seconds ? Math.ceil(q.seconds / 60) : 0) || 0),
        0,
      );
    } else if (s.kind === "discussion") {
      const { marks: calcMarks, duration: calcDur } = getVitarkaDiscussionConfig(e.sections);
      const dur = s.duration != null ? s.duration : calcDur;
      const m = s.marks != null ? s.marks : (s.max_score != null ? s.max_score : calcMarks);
      discussion += dur;
      minutes += dur;
      marks += m;
    } else if (s.kind === "system_design") {
      const dur = s.duration != null ? s.duration : 45;
      const m = s.marks != null ? s.marks : 30;
      minutes += dur;
      marks += m;
    }
  }
  return { minutes, marks, labs, questions, discussion, sections: e.sections.length };
}

export async function fetchFollowUps(evaluationId: string): Promise<any> {
  try {
    const res = await restApiAuthUtil.get(`/skill_evaluation/evaluations/${evaluationId}/follow_ups/`);
    if (res) return res;
  } catch (err) {
    console.warn("fetchFollowUps offline, using mock follow-up records:", err);
  }

  return {
    bulk: {
      candidates: [],
      startDate: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      timezone: "Asia/Kolkata",
      smart: true,
      reminder1: "1 Day Before Deadline",
      reminder2: "6 Hours Before Deadline",
      aiCall: true,
      aiTiming: "4 Hours Before Deadline",
      language: "English",
      voice: "Aria (Female)",
      emailTemplate: "Hi {{name}},\n\nJust a quick reminder that you have been invited to complete the {{evaluation}} evaluation for Yuvro Talent Co.\n\nPlease complete it as soon as possible so we can move forward with your application.\n\nStart here: {{link}}\n\nGood luck,\nThe hiring team",
    },
    individual: {
      name: "",
      email: "",
      phone: "",
      startDate: "",
      deadline: "",
      reminder1: "1 Day Before Deadline",
      reminder2: "6 Hours Before Deadline",
      aiCall: false,
      aiTiming: "4 Hours Before Deadline",
      language: "English",
      voice: "Aria (Female)",
      emailTemplate: "",
    },
    records: [
      { id: "rec-1", name: "Priya Sharma", email: "priya.sharma@gmail.com", phone: "+91 98450 11223", deadline: "3 days left", followups: true, aiCall: true, emailsSent: 2, aiCalls: 1, lastActivity: "Opened Link", lastActivityTime: "2 hours ago" },
      { id: "rec-2", name: "Aditya Nair", email: "aditya.nair@swiggy.in", phone: "+91 97412 33445", deadline: "5 days left", followups: true, aiCall: false, emailsSent: 1, aiCalls: 0, lastActivity: "Reminder Sent", lastActivityTime: "Yesterday" },
      { id: "rec-3", name: "Rahul Verma", email: "rahul.verma@cred.club", phone: "+91 98860 55667", deadline: "1 day left", followups: true, aiCall: true, emailsSent: 3, aiCalls: 1, lastActivity: "AI Call Answered", lastActivityTime: "4 hours ago" },
      { id: "rec-4", name: "Sneha Patel", email: "sneha.patel@zomato.com", phone: "+91 99001 77889", deadline: "4 days left", followups: true, aiCall: false, emailsSent: 1, aiCalls: 0, lastActivity: "Email Opened", lastActivityTime: "3 hours ago" },
      { id: "rec-5", name: "Vikram Malhotra", email: "vikram.m@razorpay.com", phone: "+91 98112 99001", deadline: "Expired", followups: false, aiCall: false, emailsSent: 2, aiCalls: 0, lastActivity: "No Action", lastActivityTime: "3 days ago" },
      { id: "rec-6", name: "Ananya Sen", email: "ananya.sen@swiggy.in", phone: "+91 98765 43210", deadline: "Completed", followups: false, aiCall: false, emailsSent: 1, aiCalls: 0, lastActivity: "Submitted Test", lastActivityTime: "1 day ago" }
    ]
  };
}

export async function saveFollowUps(evaluationId: string, data: any): Promise<any> {
  try {
    return await restApiAuthUtil.post(`/skill_evaluation/evaluations/${evaluationId}/follow_ups/`, data);
  } catch (err) {
    console.error("saveFollowUps error:", err);
    return null;
  }
}

export async function inviteCandidates(evaluationId: string, emails: Array<{name: string; email: string}> | string[], subject: string = "", body: string = ""): Promise<any> {
  try {
    return await restApiAuthUtil.post(`/skill_evaluation/evaluations/${evaluationId}/invite/`, { emails, subject, body });
  } catch (err) {
    console.error("inviteCandidates error:", err);
    return null;
  }
}

export async function generateSharedReportLink(
  evaluationId: string, 
  candidateEmail: string,
  candidateId?: string
): Promise<{ token: string, expires_at: string } | null> {
  try {
    return await restApiAuthUtil.post(`/skill_evaluation/evaluations/${evaluationId}/generate_share_link/`, {
      candidate_email: candidateEmail,
      candidate_id: candidateId
    });
  } catch {
    return null;
  }
}

import { formatTimelineEvents } from "./recruiterCandidateDetail";

export async function getSharedReportByToken(token: string): Promise<any> {
  try {
    const data = await restApiAuthUtil.get<any>(`/skill_evaluation/shared-report/${token}/`);
    return {
      evaluation: mapBackendToFrontend(data.evaluation),
      submission: data.submission,
      timelineEvents: formatTimelineEvents(data.timeline_events || [])
    };
  } catch {
    return null;
  }
}

export async function toggleFollowUp(evId: string, email: string, enabled: boolean): Promise<boolean> {
  const res = await fetch(`${API_BASE}/evaluations/${evId}/toggle_followup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("access") },
    body: JSON.stringify({ email, enabled })
  });
  return res.ok;
}

export async function removeFollowUp(evId: string, email: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/evaluations/${evId}/remove_followup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("access") },
    body: JSON.stringify({ email })
  });
  return res.ok;
}

export async function triggerAiCall(evId: string, email: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/evaluations/${evId}/trigger_ai_call/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("access") },
    body: JSON.stringify({ email })
  });
  return res.ok;
}

export async function sendReminderNow(evId: string, email: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/evaluations/${evId}/send_reminder/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("access") },
    body: JSON.stringify({ email })
  });
  return res.ok;
}

export async function editCandidateDeadline(evId: string, email: string, deadline: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/evaluations/${evId}/edit_candidate_deadline/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("access") },
    body: JSON.stringify({ email, deadline })
  });
  return res.ok;
}

export async function forceFinishSubmissions(evaluationId: string, candidateEmails: string[]): Promise<boolean> {
  try {
    const res = await restApiAuthUtil.post(`/skill_evaluation/evaluations/${evaluationId}/force_finish_submissions/`, { candidate_emails: candidateEmails });
    return !!res;
  } catch (err) {
    console.error("forceFinishSubmissions error:", err);
    return false;
  }
}
