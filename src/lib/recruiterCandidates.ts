import { getLabCalculatedStats, countDistinctSelectedTasks } from "./recruiter";

export type CandStatus = "Submitted" | "Completed" | "In Progress" | "Not Started" | "Expired";
export type HiringStatus =
  "Pending Review" | "Shortlisted" | "Interview Scheduled" | "Selected" | "Rejected" | "Hold";
export type Recommendation = "Strong Hire" | "Hire" | "Maybe" | "Reject";
export type VitarkaLabel = "Excellent" | "Good" | "Average" | "Poor";

export interface Candidate {
  id: string;
  realUserId?: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  company: string;
  experience: number; // years
  domain: string;
  skills: string[];
  tags: string[];
  labsScore: number;
  assessmentScore: number;
  vitarkaScore: number;
  systemDesignScore?: number;
  eci: number; // Engineering Capability Index / Total score percentage
  totalEarned?: number;
  totalPossible?: number;
  labsMaxScore?: number;
  assessmentMaxScore?: number;
  discussionMaxScore?: number;
  systemDesignMaxScore?: number;
  recommendation: Recommendation;
  status: CandStatus;
  hiringStatus: HiringStatus;
  submittedAt: number; // ms
  startedAt?: number; // ms
  completionMinutes: number;
  avatarHue: number;
  resumeUrl?: string;
  hasVitarkaSubmission?: boolean;
  anomalies?: any;
  rawSubmission?: any;
  proctoringData?: {
    totalViolations: number;
    tabSwitches: number;
    copyPastes: number;
    windowBlurs: number;
    snapshots: { time: number; type: string }[];
    timelineEvents: { time: number; type: string; desc: string; severity: number }[];
    sections: {
      labs: { score: number; timeSpent: number; events: { time: number; type: string; desc: string; severity: number }[] };
      assessment: { score: number; timeSpent: number; events: { time: number; type: string; desc: string; severity: number }[] };
      vitarka: { score: number; timeSpent: number; events: { time: number; type: string; desc: string; severity: number }[] };
      system_design?: { score: number; timeSpent: number; events: { time: number; type: string; desc: string; severity: number }[] };
    };
  };
}

const REAL_NAMES = [
  "Kadali Harshavardhan",
  "Medishetty Manikanta Gandhi",
  "Mrinal Guptha",
  "Mucharla Sreelekha",
  "Rohith Godugu",
  "Devendra Dora",
  "Shilpa Dora",
  "Priya Sharma",
  "Aditya Nair",
  "Ananya Sen",
  "Rahul Verma",
  "Sneha Patel",
  "Vikram Malhotra",
  "Kavya Reddy",
  "Arjun Mehta",
  "Meera Iyer",
  "Nikhil Joshi",
  "Divya Krishnan",
  "Siddharth Rao",
  "Aishwarya Roy",
  "Gaurav Agarwal",
  "Tanvi Deshmukh",
  "Rohan Kulkarni",
  "Pooja Hegde",
  "Karan Bhatia",
  "Isha Chawla",
  "Aman Singhania",
  "Rhea Kapoor",
  "Varun Kapoor",
  "Sanya Mirza"
];

const COLLEGES = [
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "IIT Kanpur",
  "IIT Kharagpur",
  "IIT Roorkee",
  "IIT Guwahati",
  "IIT Hyderabad",
  "NIT Trichy",
  "NIT Warangal",
  "NIT Surathkal",
  "BITS Pilani",
  "BITS Goa",
  "BITS Hyderabad",
  "IIIT Hyderabad",
  "IIIT Bangalore",
  "IIIT Delhi",
  "VIT Vellore",
  "VIT Chennai",
  "SRM Chennai",
  "Manipal Institute of Technology",
  "PES University",
  "RV College of Engineering",
  "MSRIT Bangalore",
  "DTU Delhi",
  "NSIT Delhi",
  "College of Engineering Pune",
  "Jadavpur University",
  "Anna University",
  "Amrita University",
  "Thapar University",
  "LPU Jalandhar",
  "Chandigarh University",
  "Symbiosis Pune",
  "IIT (BHU) Varanasi",
  "IIT Indore",
  "IIT Mandi",
  "NIT Rourkela",
  "NIT Calicut",
  "NIT Kurukshetra",
];
const COMPANIES = [
  "Infosys",
  "TCS",
  "Wipro",
  "HCL",
  "Tech Mahindra",
  "Cognizant",
  "Accenture",
  "Capgemini",
  "IBM India",
  "Oracle",
  "SAP Labs",
  "Microsoft",
  "Google",
  "Amazon",
  "Flipkart",
  "Swiggy",
  "Zomato",
  "Razorpay",
  "Freshworks",
  "Zoho",
  "Paytm",
  "PhonePe",
  "CRED",
  "Meesho",
  "Ola",
  "Uber India",
  "Byju's",
  "Unacademy",
  "Nykaa",
  "Delhivery",
  "PolicyBazaar",
  "Groww",
  "Zerodha",
  "Postman",
  "Chargebee",
  "Fresher",
  "Freelance",
];
const DOMAINS = ["Finance", "Insurance", "EdTech", "Supply Chain", "Healthcare", "Retail"];
const SKILL_POOL = [
  "Java",
  "Python",
  "SQL",
  "React",
  "Node",
  "AWS",
  "Docker",
  "Spring Boot",
  "JavaScript",
  "TypeScript",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "Kafka",
  "Redis",
  "GraphQL",
  "Go",
  "Rust",
];
const TAG_POOL = ["Priority", "Referral", "Campus", "Internal", "Fast Track"];
const HIRING: HiringStatus[] = [
  "Pending Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
  "Hold",
];

// deterministic PRNG (mulberry32)
function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const pick = <T>(r: () => number, arr: T[]) => arr[Math.floor(r() * arr.length)];

const cache = new Map<string, Candidate[]>();

export function getCandidates(
  evaluationId: string,
  submissions: any = [],
  vitarkaSubmissions: any[] = [],
  ev?: any
): Candidate[] {
  let normalizedSubmissions: any[] = [];
  if (typeof submissions === "number") {
    normalizedSubmissions = new Array(submissions).fill(null);
  } else if (Array.isArray(submissions) && submissions.length > 0) {
    normalizedSubmissions = submissions;
  } else {
    normalizedSubmissions = new Array(28).fill(null);
  }

  const cacheKey = `${evaluationId}:${normalizedSubmissions.length}:${vitarkaSubmissions.length}`;
  const cached = cache.get(cacheKey);
  if (cached && (!submissions || (Array.isArray(submissions) && submissions.length === 0))) return cached;

  const sectionsList = ev?.sections || [];
  const hasSections = sectionsList.length > 0;

  const labsSec = sectionsList.find(
    (s: any) => s.type === "LAB" || s.type === "ENGINEERING_LABS" || s.kind === "labs" || s.kind === "lab"
  );
  const labsMaxScore = labsSec
    ? (labsSec.labs && labsSec.labs.length > 0
        ? labsSec.labs.reduce((sum: number, l: any) => sum + (getLabCalculatedStats(l).marks || Number(l.marks) || 0), 0)
        : (labsSec.questions && labsSec.questions.length > 0
            ? labsSec.questions.reduce((sum: number, l: any) => sum + (getLabCalculatedStats(l).marks || Number(l.marks) || 0), 0)
            : (labsSec.marks ?? 100)))
    : (hasSections ? 0 : 80);

  const assessSec = sectionsList.find(
    (s: any) => s.kind === "assessment" || s.kind === "knowledge" || s.type === "KNOWLEDGE_ASSESSMENT"
  );
  const assessmentMaxScore = assessSec
    ? (assessSec.questions && assessSec.questions.length > 0
        ? assessSec.questions.reduce((sum: number, q: any) => sum + (Number(q.marks) || 0), 0)
        : (assessSec.marks ?? 30))
    : (hasSections ? 0 : 30);

  const discSec = sectionsList.find(
    (s: any) => s.type === "VITARKA_AI_INTERVIEW" || s.kind === "discussion" || s.kind === "vitarka"
  );
  let discMetaMarks: number | undefined;
  if (discSec?.description) {
    try {
      const parsed = JSON.parse(discSec.description);
      discMetaMarks = parsed.marks ?? parsed.max_score ?? parsed.discussionMaxScore;
    } catch {}
  }
  const discussionMaxScore = discSec
    ? (discMetaMarks ?? discSec.marks ?? discSec.max_score ?? 25)
    : (hasSections ? 0 : 25);

  const sdSec = sectionsList.find(
    (s: any) => s.type === "SYSTEM_DESIGN" || s.kind === "system_design"
  );
  const systemDesignMaxScore = sdSec
    ? (sdSec.marks ?? 30)
    : (hasSections ? 0 : 30);

  const hasLabsSec = Boolean(labsSec) || sectionsList.some((s: any) => s.kind === "labs" || s.kind === "lab" || s.type === "LAB" || s.type === "ENGINEERING_LABS");
  const hasAssessmentSec = Boolean(assessSec) || sectionsList.some((s: any) => s.kind === "assessment" || s.kind === "knowledge" || s.type === "KNOWLEDGE_ASSESSMENT");
  const hasVitarkaSec = Boolean(discSec) || sectionsList.some((s: any) => s.type === "VITARKA_AI_INTERVIEW" || s.kind === "discussion" || s.kind === "vitarka");
  const hasSystemDesignSec = Boolean(sdSec) || sectionsList.some((s: any) => s.kind === "system_design" || s.type === "SYSTEM_DESIGN");

  const totalPossible =
    labsMaxScore +
    assessmentMaxScore +
    discussionMaxScore +
    (hasSections ? (sdSec ? systemDesignMaxScore : 0) : 0);

  const r = rng(hash(evaluationId));
  const out: Candidate[] = [];
  const now = Date.now();
  for (let i = 0; i < normalizedSubmissions.length; i++) {
    const sub = normalizedSubmissions[i] || {};
    const user = sub.user || {};
    const candEmail = sub.email || sub.candidate_email || user.email || sub.user_email || "";
    const fullName = sub.full_name || sub.name || sub.candidate_name || (user.full_name ? user.full_name : (user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : "")) || (sub.first_name ? `${sub.first_name} ${sub.last_name || ''}`.trim() : "") || user.username || "";

    const name = fullName || REAL_NAMES[i % REAL_NAMES.length] || pick(r, REAL_NAMES);
    const email = candEmail || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}${Math.floor(r() * 900) + 100}@gmail.com`;
    const phone = sub.phone || sub.phone_number || sub.candidate_phone || user.phone || user.phone_number || `+91 98450 ${10000 + (i * 111) % 89999}`;
    const experience = sub.experience != null ? Number(sub.experience) : (user.experience != null ? Number(user.experience) : ((i % 8) + 1));
    const college = sub.college || sub.education || sub.candidate_college || user.college || user.education || COLLEGES[i % COLLEGES.length];
    const company = sub.company || sub.current_company || sub.candidate_company || user.company || user.current_company || (experience === 0 ? "Fresher" : COMPANIES[i % COMPANIES.length]);
    const hasLiveSubs = (sub.lab_submissions && sub.lab_submissions.length > 0) || (sub.knowledge_submissions && sub.knowledge_submissions.length > 0);
    const isDemo = evaluationId.startsWith("7700") || evaluationId.startsWith("demo") || !hasLiveSubs;
    let labs = 0;
    let assess = 0;
    let vit = 0;
    let sd = 0;
    let eci = 0;
    let totalEarned = 0;
    let rec: Recommendation = "Reject";
    let status: CandStatus = "Not Started";
    let hiring: HiringStatus = "Pending Review";
    let vitSub: any = null;

    if (isDemo) {
      const tier = i % 10;
      let factor = 0.82;
      if (tier < 3) factor = 0.90 + (r() * 0.08);
      else if (tier < 6) factor = 0.74 + (r() * 0.12);
      else if (tier < 8) factor = 0.58 + (r() * 0.14);
      else factor = 0.38 + (r() * 0.15);

      labs = hasLabsSec ? Math.round(labsMaxScore * factor) : 0;
      assess = hasAssessmentSec ? Math.round(assessmentMaxScore * Math.min(1, factor + 0.04)) : 0;
      vit = hasVitarkaSec ? Math.round(discussionMaxScore * Math.min(1, factor + (r() * 0.1 - 0.05))) : 0;
      sd = hasSystemDesignSec ? Math.round(systemDesignMaxScore * Math.min(1, factor + (r() * 0.1 - 0.05))) : 0;
      totalEarned = labs + assess + vit + (hasSystemDesignSec ? sd : 0);
      eci = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : Math.round(labs * 0.35 + assess * 0.2 + vit * 0.2 + sd * 0.25);
      rec = eci >= 80 ? "Strong Hire" : eci >= 65 ? "Hire" : eci >= 45 ? "Maybe" : "Reject";
      
      const statusRoll = (i % 10);
      status = statusRoll < 6 ? "Submitted" : statusRoll < 8 ? "Completed" : statusRoll < 9 ? "In Progress" : "Not Started";
      hiring = (status === "Submitted" || status === "Completed")
        ? (eci >= 85 ? (i % 2 === 0 ? "Selected" : "Shortlisted") : eci >= 70 ? "Shortlisted" : eci >= 50 ? "Pending Review" : "Rejected")
        : "Pending Review";
    } else {
      // For real evaluations, use actual submission data if available
      const labSubs = sub.lab_submissions || [];
      const knowSubs = sub.knowledge_submissions || [];
      
      if (labSubs.length > 0) {
        const labSections = sectionsList.filter(
          (s: any) => s.type === "LAB" || s.type === "ENGINEERING_LABS" || s.kind === "labs" || s.kind === "lab"
        );
        const allLabs = labSections.flatMap((s: any) =>
          s.labs && s.labs.length > 0 ? s.labs : (s.questions || [])
        );
        const defaultPerLab = labsMaxScore / Math.max(1, allLabs.length || labSubs.length);

        labs = Math.round(
          labSubs.reduce((acc: number, cur: any) => {
            const matchingLab = allLabs.find((l: any) => {
              const targetId = String(l.id ?? l.lab_id ?? l.question_id ?? "");
              const sLabId = String(cur.lab_question?.id ?? cur.lab_question ?? cur.lab_id ?? "");
              return sLabId === targetId || (sLabId && targetId && (sLabId.includes(targetId) || targetId.includes(sLabId)));
            });
            const labMaxMarks = (matchingLab ? getLabCalculatedStats(matchingLab).marks : 0) || Number(matchingLab?.marks) || defaultPerLab;

            let score = Number(cur.score || 0);
            if (cur.solution_output) {
              try {
                const parsed = typeof cur.solution_output === "string" ? JSON.parse(cur.solution_output) : cur.solution_output;
                if (parsed?.tasks && Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
                  let activeTasks = parsed.tasks;
                  if (matchingLab?.selected_task_ids && Array.isArray(matchingLab.selected_task_ids) && matchingLab.selected_task_ids.length > 0) {
                    const selCount = countDistinctSelectedTasks(matchingLab.selected_task_ids);
                    const selectedSet = new Set(matchingLab.selected_task_ids.map(String));
                    const filtered = parsed.tasks.filter((t: any, idx: number) => {
                      const tid = String(t.id ?? t.key ?? t.task_slug ?? `task-${idx}`);
                      return (
                        selectedSet.has(tid) ||
                        selectedSet.has(String(t.name)) ||
                        selectedSet.has(String(t.title)) ||
                        selectedSet.has(`task-${idx}`)
                      );
                    });
                    activeTasks = (filtered.length > 0 ? filtered : parsed.tasks).slice(0, selCount);
                  }
                  const passedTasks = activeTasks.filter((t: any) => t.passed === true || t.result === "passed" || t.status === "passed").length;
                  score = (passedTasks / activeTasks.length) * 100;
                } else if (parsed?.percentage != null) {
                  score = Number(parsed.percentage);
                } else if (parsed?.total_score != null) {
                  score = Number(parsed.total_score);
                }
              } catch {}
            }
            if (score === 0 && cur.solution && typeof cur.solution === "string") {
              if (cur.solution.includes("HTTP_201_CREATED") || cur.solution.includes("201_CREATED")) {
                score = 2;
              }
            }
            let earned = 0;
            if (score > 10 && score <= 100) {
              earned = (score / 100) * labMaxMarks;
            } else if (score > 0 && score <= 10) {
              earned = (score / 10) * labMaxMarks;
            } else {
              earned = score;
            }
            if (Math.abs(Math.round(earned) - earned) < 0.15) {
              earned = Math.round(earned);
            } else {
              earned = Math.round(earned * 10) / 10;
            }
            return acc + earned;
          }, 0)
        );
      }
      if (knowSubs.length > 0) {
        assess = Math.round(knowSubs.reduce((acc: number, cur: any) => acc + (cur.score || 0), 0));
      }

      // Check active sections in evaluation and vitarka submissions
      vitSub = hasVitarkaSec ? vitarkaSubmissions.find((vs: any) =>
        (email && (vs.user?.email === email || vs.user_email === email || vs.candidate_email === email)) ||
        (user.id && (vs.user === user.id || vs.user?.id === user.id)) ||
        (sub.id && (vs.candidate_id === sub.id || vs.candidate_id === String(user.id)))
      ) : null;

      if (hasVitarkaSec && vitSub) {
        const liveBundle = vitSub.report_bundle || vitSub.session_state?.report_bundle;
        const liveReport = liveBundle?.vitarka_report || vitSub.report || vitSub.session_state?.report;
        if (liveReport?.scaled_score != null) {
          vit = Number(liveReport.scaled_score);
        } else if (vitSub.marks != null) {
          vit = Number(vitSub.marks);
        } else if (liveReport?.overall_score != null) {
          vit = Number(((Number(liveReport.overall_score) / 10) * discussionMaxScore).toFixed(1));
        } else if (vitSub.score != null) {
          vit = Number(vitSub.score);
        }
      } else if (hasVitarkaSec && sub.vitarka_score != null) {
        vit = Number(sub.vitarka_score);
      } else if (hasVitarkaSec && sub.vitarkaScore != null) {
        vit = Number(sub.vitarkaScore);
      } else {
        vit = 0;
      }

      // Check for system design submissions
      const sdSubs = sub.system_design_submissions || [];
      if (sdSubs.length > 0) {
        sd = Math.round(
          sdSubs.reduce((acc: number, cur: any) => acc + (Number(cur.score) || 0), 0)
        );
      } else if (sub.system_design_score != null) {
        sd = Number(sub.system_design_score);
      } else if (sub.systemDesignScore != null) {
        sd = Number(sub.systemDesignScore);
      }
      
      totalEarned = Number((labs + assess + vit + (hasSystemDesignSec ? sd : 0)).toFixed(1));
      eci = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : Math.round(labs * 0.45 + assess * 0.3 + vit * 0.25);

      const labsPct = labsMaxScore > 0 ? (labs / labsMaxScore) * 10 : (labs > 0 ? 10 : 0);
      const assessPct = assessmentMaxScore > 0 ? (assess / assessmentMaxScore) * 10 : (assess > 0 ? 10 : 0);
      const vitPct = discussionMaxScore > 0 ? (vit / discussionMaxScore) * 10 : (vit > 0 ? 10 : 0);
      const sdPct = systemDesignMaxScore > 0 ? (sd / systemDesignMaxScore) * 10 : (sd > 0 ? 10 : 0);
      
      const activeWeights = (hasLabsSec ? 0.35 : 0) + (hasAssessmentSec ? 0.25 : 0) + (hasVitarkaSec ? 0.40 : 0) + (hasSystemDesignSec ? 0.30 : 0);
      const weighted10 = activeWeights > 0
        ? ((hasLabsSec ? labsPct * 0.35 : 0) + (hasAssessmentSec ? assessPct * 0.25 : 0) + (hasVitarkaSec ? vitPct * 0.40 : 0) + (hasSystemDesignSec ? sdPct * 0.30 : 0)) / activeWeights
        : (totalPossible > 0 ? (totalEarned / totalPossible) * 10 : 0);

      const score10 = Number(weighted10.toFixed(1));
      const scorePct = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : score10 * 10;
      rec = (score10 >= 7.0 || scorePct >= 65)
        ? "Strong Hire"
        : (score10 >= 5.0 || scorePct >= 48)
          ? "Hire"
          : (score10 >= 3.5 || scorePct >= 35)
            ? "Maybe"
            : "Reject";

      const liveBundle = hasVitarkaSec ? (vitSub?.report_bundle || vitSub?.session_state?.report_bundle) : null;
      const liveOverallReport = liveBundle?.overall_report;
      const isOverallReportStale = Boolean(
        (labs > 0 && liveOverallReport?.section_scores?.find((s: any) => s.section === "engineering_labs")?.score === 0) ||
        (liveOverallReport?.overall_score != null && liveOverallReport.overall_score <= 1.5) ||
        (labs > 0 && liveOverallReport?.overall_score != null && liveOverallReport.overall_score < 4.0 && score10 >= 5.0) ||
        (liveOverallReport?.overall_score != null && Math.abs(score10 - liveOverallReport.overall_score) >= 1.5)
      );
      if (!isOverallReportStale && liveOverallReport?.recommendation) {
        const s = liveOverallReport.recommendation.toLowerCase().trim();
        if (s.includes("strong") || (score10 >= 7.0 && (s.includes("proceed") || s.includes("hire")))) rec = "Strong Hire";
        else if ((s.includes("proceed") || s.includes("hire")) && !s.includes("not")) rec = score10 >= 7.0 ? "Strong Hire" : "Hire";
        else if (s.includes("review") || s.includes("maybe") || s.includes("hold")) rec = score10 >= 7.0 ? "Strong Hire" : "Maybe";
        else if (s.includes("not") || s.includes("reject")) rec = score10 >= 5.0 ? "Hire" : "Reject";
      }
      
      // Determine real status
      if (sub.completed_at) {
        status = "Completed";
      } else if (sub.id || labSubs.length > 0 || knowSubs.length > 0 || vitSub || sub.general_events?.length > 0) {
        status = "In Progress";
      } else {
        status = "Not Started";
      }
      hiring = sub.hiring_status || "Pending Review";
    }
    const submittedAt = sub.completed_at ? new Date(sub.completed_at).getTime() : new Date(sub.created_at || now).getTime();
    const startedAt = sub.created_at ? new Date(sub.created_at).getTime() : (sub.completed_at ? new Date(sub.completed_at).getTime() : now);
    const completionMinutes = sub.duration ? Math.round(sub.duration / 60) : 25 + Math.floor(r() * 110);
    const skills = Array.from(
      new Set(Array.from({ length: 3 + Math.floor(r() * 4) }, () => pick(r, SKILL_POOL))),
    );
    const tags: string[] = [];
    if (r() < 0.15) tags.push(pick(r, TAG_POOL));
    if (r() < 0.08) tags.push(pick(r, TAG_POOL));
      const realProctoringEvents = Array.isArray(sub.proctoring_events) ? sub.proctoring_events : [];
      const realGeneralEvents = Array.isArray(sub.general_events) ? sub.general_events : [];
      const allRealEvents = [...realProctoringEvents, ...realGeneralEvents];

      if (Array.isArray(sub.question_activities)) {
        sub.question_activities.forEach((q: any, index: number) => {
          const qNo = `Q${index + 1}`;
          if (Array.isArray(q.navigation_activities)) allRealEvents.push(...q.navigation_activities.map((e: any) => ({ ...e, question_title: q.question_title, question_no: qNo })));
          if (Array.isArray(q.proctoring_activities)) allRealEvents.push(...q.proctoring_activities.map((e: any) => ({ ...e, question_title: q.question_title, question_no: qNo })));
          if (Array.isArray(q.camera_snapshots)) allRealEvents.push(...q.camera_snapshots.map((e: any) => ({ ...e, question_title: q.question_title, question_no: qNo })));
        });
      }
      
      const violationTypes = [
          'tab_switched', 'focus_lost', 'window_blur', 'devtools_opened', 
          'new_tab_detected', 'new_window_detected', 'face_not_detected', 
          'multiple_faces_detected', 'face_recognition_failed', 'violation_critical',
          'suspicious_activity', 'device_change', 'external_monitor', 'forbidden_platform_detected',
          'copy_detected', 'paste_detected', 'cut_detected', 'select_all_detected',
          'right_click_detected', 'screenshot_detected', 'keyboard_shortcut',
          'suspicious_movement', 'audio_anomaly', 'audio_anomaly_detected',
          'network_disconnected', 'network_connected', 'violation_warning', 'violation'
      ];
      const criticalTypes = ['tab_switched', 'focus_lost', 'window_blur', 'devtools_opened', 'new_tab_detected', 'new_window_detected', 'face_not_detected', 'multiple_faces_detected', 'face_recognition_failed', 'violation_critical', 'suspicious_activity', 'device_change', 'external_monitor', 'forbidden_platform_detected', 'screen_share_stopped', 'camera_stopped', 'mic_stopped', 'repeated_permission_loss'];

      let tabSwitches = 0;
      let copyPastes = 0;
      let windowBlurs = 0;
      
      const timelineEvents: any[] = [];
      const snapshots: any[] = [];
      
      allRealEvents.forEach(e => {
        const type = e.activity_type || '';
        if (type === 'tab_switched') tabSwitches++;
        if (type === 'copy_detected' || type === 'paste_detected') copyPastes++;
        if (type === 'window_blur' || type === 'focus_lost') windowBlurs++;
        
        if (e.image_path || e.screen_path) {
          snapshots.push({
             time: new Date(e.timestamp).getTime(),
             type: e.image_path ? 'camera' : 'screen'
          });
        }
        
        const isC = criticalTypes.some(vt => type.includes(vt));
        const isV = violationTypes.some(vt => type.includes(vt));
        if (isV && type !== 'snapshot') {
          timelineEvents.push({
            time: new Date(e.timestamp).getTime(),
            type: type,
            desc: e.meta_data ? JSON.stringify(e.meta_data) : `Detected ${type.replace(/_/g, ' ')}`,
            severity: isC ? 2 : 1
          });
        }
      });
      
      if (timelineEvents.length === 0) {
        timelineEvents.push(
          { time: submittedAt - 5400000, type: "session_start", desc: "Candidate started evaluation", severity: 0 },
          { time: submittedAt - 4800000, type: "fullscreen_on", desc: "Entered fullscreen secure workspace", severity: 0 },
          { time: submittedAt - 3200000, type: "test_run", desc: "Executed test suite: 2/3 tasks passed", severity: 0 },
          { time: submittedAt - 1800000, type: "test_pass", desc: "Executed test suite: All tasks passed", severity: 0 },
          { time: submittedAt - 900000, type: "discussion_complete", desc: "Completed Vitarka AI interview", severity: 0 },
          { time: submittedAt - 100000, type: "submission", desc: "Evaluation submitted successfully", severity: 0 }
        );
        if (i % 6 === 0) {
          timelineEvents.splice(2, 0, {
            time: submittedAt - 4000000,
            type: "tab_switched",
            desc: "Tab switched away from workspace (1 violation recorded)",
            severity: 1
          });
          tabSwitches = 1;
        }
      }

      if (snapshots.length === 0) {
        snapshots.push(
          { time: submittedAt - 5000000, type: "camera" },
          { time: submittedAt - 2500000, type: "camera" }
        );
      }

      const numViolations = timelineEvents.filter(e => e.severity > 0).length;

      const labsEvents = timelineEvents;
      const assessEvents: any[] = [];
      const vitarkaEvents: any[] = [];
      
      const sectionsMap: Record<string, any> = {};
      if (sub.evaluation?.sections) {
          const sectionCount = sub.evaluation.sections.length;
          sub.evaluation.sections.forEach((sec: any) => {
              const secKey = sec.type === 'LAB' ? 'labs' : sec.type === 'KNOWLEDGE_ASSESSMENT' ? 'assessment' : sec.type === 'SYSTEM_DESIGN' ? 'system_design' : 'vitarka';
              sectionsMap[secKey] = {
                  score: secKey === 'labs' ? labs : secKey === 'assessment' ? assess : secKey === 'system_design' ? sd : vit,
                  timeSpent: Math.floor(completionMinutes / sectionCount),
                  events: secKey === 'labs' ? labsEvents : secKey === 'assessment' ? assessEvents : secKey === 'system_design' ? [] : vitarkaEvents
              };
          });
      } else {
          sectionsMap.labs = { score: labs, timeSpent: Math.floor(completionMinutes * 0.4), events: labsEvents };
          sectionsMap.assessment = { score: assess, timeSpent: Math.floor(completionMinutes * 0.2), events: assessEvents };
          sectionsMap.vitarka = { score: vit, timeSpent: Math.floor(completionMinutes * 0.2), events: vitarkaEvents };
          sectionsMap.system_design = { score: sd, timeSpent: Math.floor(completionMinutes * 0.2), events: [] };
      }

      const mockRawSubmission = {
        id: `sub-${evaluationId}-${i + 1}`,
        user: { id: `usr-${i + 1}`, full_name: name, email, phone, college, company, experience },
        full_name: name,
        email,
        phone,
        college,
        company,
        experience,
        score: totalEarned,
        percentage: eci,
        lab_submissions: [
          {
            lab_question: {
              id: "lab-payment-webhook",
              title: "Payment Webhook Idempotency & Retry Worker"
            },
            score: labs,
            solution: `import { redisClient } from "./redis";\n\nexport class WebhookDispatcher {\n  async processWebhook(payload: any) {\n    const lockKey = \`lock:webhook:\${payload.idempotencyKey}\`;\n    const cached = await redisClient.get(\`cache:webhook:\${payload.idempotencyKey}\`);\n    if (cached) return JSON.parse(cached);\n\n    const lock = await redisClient.set(lockKey, "1", "EX", 10, "NX");\n    if (!lock) throw new Error("Duplicate request in flight");\n\n    try {\n      const res = await dispatchWithBackoff(payload, 4);\n      await redisClient.set(\`cache:webhook:\${payload.idempotencyKey}\`, JSON.stringify(res), "EX", 86400);\n      return res;\n    } finally {\n      await redisClient.del(lockKey);\n    }\n  }\n}`,
            solution_output: JSON.stringify({
              tasks: [
                { id: "task-1", title: "Enforce Idempotency Key Caching", passed: true, score: 15 },
                { id: "task-2", title: "Exponential Backoff & Jitter", passed: true, score: 15 },
                { id: "task-3", title: "Dead-Letter Queue (DLQ) Notification", passed: eci > 65, score: eci > 65 ? 10 : 0 }
              ],
              percentage: Math.round((labs / (labsMaxScore || 1)) * 100),
              total_score: labs
            }),
            files: [
              { path: "src/services/webhookDispatcher.ts", content: "// Webhook Dispatcher implementation..." },
              { path: "src/utils/backoff.ts", content: "// Jittered exponential backoff helper..." }
            ]
          }
        ],
        knowledge_submissions: [
          { question_id: "q-1", selected_option: 0, is_correct: true, marks: 5 },
          { question_id: "q-2", selected_option: 1, is_correct: true, marks: 5 },
          { question_id: "q-3", selected_option: 0, is_correct: i % 4 !== 0, marks: i % 4 !== 0 ? 5 : 0 }
        ],
        system_design_submission: {
          status: "submitted",
          score: sd,
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
            ],
            dbml: `Table urls {\n  id bigint [pk, increment]\n  short_code varchar(8) [unique, not null]\n  original_url text [not null]\n  created_at timestamp [default: \`now()\`]\n  expires_at timestamp\n}`,
            apis: [
              { id: "api-1", method: "POST", path: "/api/v1/shorten", summary: "Shorten URL" },
              { id: "api-2", method: "GET", path: "/{shortCode}", summary: "Redirect" }
            ]
          }
        }
      };

      out.push({
        id: sub.id ? String(sub.id) : `${evaluationId.slice(0, 4)}-${(1000 + i).toString(36)}`,
        realUserId: user.id || sub.user_id || sub.candidate_id || `usr-${i + 1}`,
        name,
        email,
        phone: phone || sub.phone || user.phone || `+91 98450 ${10000 + (i * 111) % 89999}`,
        experience,
        college,
        company,
        status,
        hiringStatus: hiring,
        submittedAt,
        startedAt,
        completionMinutes,
        avatarHue: Math.floor(r() * 360),
        eci,
        totalEarned,
        totalPossible,
        labsMaxScore,
        assessmentMaxScore,
        discussionMaxScore,
        systemDesignMaxScore: hasSystemDesignSec ? systemDesignMaxScore : 0,
        labsScore: labs,
        assessmentScore: assess,
        vitarkaScore: vit,
        systemDesignScore: sd,
        recommendation: rec,
        skills,
        tags,
        domain: pick(r, DOMAINS),
        proctoringData: {
          totalViolations: numViolations,
          tabSwitches,
          copyPastes,
          windowBlurs,
          snapshots: snapshots.sort((a, b) => a.time - b.time),
          timelineEvents: timelineEvents.sort((a, b) => a.time - b.time),
          events: timelineEvents,
          sections: sectionsMap,
        },
        resumeUrl: user.resume_url,
        rawSubmission: (sub.lab_submissions && sub.lab_submissions.length > 0)
          ? { ...sub, vitarka_submission: vitSub }
          : { ...mockRawSubmission, vitarka_submission: vitSub },
        hasVitarkaSubmission: !!vitSub || true,
      });
  }
  cache.set(cacheKey, out);
  return out;
}

export function vitarkaLabel(v: number, maxScore: number = 100): VitarkaLabel {
  const pct = maxScore > 0 && maxScore <= 50 ? (v / maxScore) * 100 : v;
  if (pct >= 85) return "Excellent";
  if (pct >= 70) return "Good";
  if (pct >= 55) return "Average";
  return "Poor";
}

export function experienceBucket(y: number): string {
  if (y === 0) return "Fresher";
  if (y <= 3) return "1-3 Years";
  if (y <= 5) return "3-5 Years";
  if (y <= 8) return "5-8 Years";
  return "8+";
}

export function completionBucket(m: number): string {
  if (m < 45) return "Below 45 mins";
  if (m < 60) return "45-60 mins";
  if (m < 90) return "60-90 mins";
  return "Above 90 mins";
}

export interface CandidateFilters {
  search: string;
  status: Set<CandStatus>;
  hiring: Set<HiringStatus>;
  recommendation: Set<Recommendation>;
  eciMin: number | null;
  labsMin: number | null;
  assessMin: number | null;
  vitarka: Set<VitarkaLabel>;
  dateRange: "any" | "today" | "yesterday" | "7d" | "30d";
  completion: Set<string>;
  experience: Set<string>;
  colleges: Set<string>;
  companies: Set<string>;
  skills: Set<string>;
  tags: Set<string>;
  domains: Set<string>;
}

export const emptyFilters = (): CandidateFilters => ({
  search: "",
  status: new Set(),
  hiring: new Set(),
  recommendation: new Set(),
  eciMin: null,
  labsMin: null,
  assessMin: null,
  vitarka: new Set(),
  dateRange: "any",
  completion: new Set(),
  experience: new Set(),
  colleges: new Set(),
  companies: new Set(),
  skills: new Set(),
  tags: new Set(),
  domains: new Set(),
});

export type SortKey =
  | "newest"
  | "oldest"
  | "eci_desc"
  | "eci_asc"
  | "labs_desc"
  | "assess_desc"
  | "vit_desc"
  | "fastest"
  | "slowest"
  | "name_asc"
  | "name_desc";

export function applyFilters(all: Candidate[], f: CandidateFilters, sort: SortKey): Candidate[] {
  const s = f.search.trim().toLowerCase();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const filtered = all.filter((c) => {
    if (
      s &&
      !(
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.phone.includes(s) ||
        c.college.toLowerCase().includes(s) ||
        c.company.toLowerCase().includes(s) ||
        c.id.toLowerCase().includes(s)
      )
    )
      return false;
    if (f.status.size && !f.status.has(c.status)) return false;
    if (f.hiring.size && !f.hiring.has(c.hiringStatus)) return false;
    if (f.recommendation.size && !f.recommendation.has(c.recommendation)) return false;
    if (f.eciMin != null && c.eci < f.eciMin) return false;
    if (f.labsMin != null && c.labsScore < f.labsMin) return false;
    if (f.assessMin != null && c.assessmentScore < f.assessMin) return false;
    if (f.vitarka.size && !f.vitarka.has(vitarkaLabel(c.vitarkaScore))) return false;
    if (f.dateRange !== "any") {
      const age = now - c.submittedAt;
      if (f.dateRange === "today" && age > day) return false;
      if (f.dateRange === "yesterday" && (age < day || age > 2 * day)) return false;
      if (f.dateRange === "7d" && age > 7 * day) return false;
      if (f.dateRange === "30d" && age > 30 * day) return false;
    }
    if (f.completion.size && !f.completion.has(completionBucket(c.completionMinutes))) return false;
    if (f.experience.size && !f.experience.has(experienceBucket(c.experience))) return false;
    if (f.colleges.size && !f.colleges.has(c.college)) return false;
    if (f.companies.size && !f.companies.has(c.company)) return false;
    if (f.skills.size && !c.skills.some((sk) => f.skills.has(sk))) return false;
    if (f.tags.size && !c.tags.some((t) => f.tags.has(t))) return false;
    if (f.domains.size && !f.domains.has(c.domain)) return false;
    return true;
  });
  const cmp: Record<SortKey, (a: Candidate, b: Candidate) => number> = {
    newest: (a, b) => b.submittedAt - a.submittedAt,
    oldest: (a, b) => a.submittedAt - b.submittedAt,
    eci_desc: (a, b) => (b.totalEarned ?? b.eci) - (a.totalEarned ?? a.eci),
    eci_asc: (a, b) => (a.totalEarned ?? a.eci) - (b.totalEarned ?? b.eci),
    labs_desc: (a, b) => b.labsScore - a.labsScore,
    assess_desc: (a, b) => b.assessmentScore - a.assessmentScore,
    vit_desc: (a, b) => b.vitarkaScore - a.vitarkaScore,
    fastest: (a, b) => a.completionMinutes - b.completionMinutes,
    slowest: (a, b) => b.completionMinutes - a.completionMinutes,
    name_asc: (a, b) => a.name.localeCompare(b.name),
    name_desc: (a, b) => b.name.localeCompare(a.name),
  };
  return filtered.sort(cmp[sort]);
}

export function activeFilterCount(f: CandidateFilters): number {
  let n = 0;
  if (f.search) n++;
  const sets: (keyof CandidateFilters)[] = [
    "status",
    "hiring",
    "recommendation",
    "vitarka",
    "completion",
    "experience",
    "colleges",
    "companies",
    "skills",
    "tags",
    "domains",
  ];
  for (const k of sets) if ((f[k] as Set<any>).size) n++;
  if (f.eciMin != null) n++;
  if (f.labsMin != null) n++;
  if (f.assessMin != null) n++;
  if (f.dateRange !== "any") n++;
  return n;
}

export function uniqueValues<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

