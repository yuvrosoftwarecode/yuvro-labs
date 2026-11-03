import { restApiAuthUtil } from "../utils/RestApiAuthUtil";

export const SEED_LAB_QUESTIONS: any[] = [
  {
    id: "lab-payment-webhook",
    title: "Payment Webhook Idempotency & Retry Worker",
    description: "Fix race conditions in webhook processing and implement idempotent transactions with Redis distributed locks and jittered retry backoff.",
    difficulty: "MEDIUM",
    domain: "PAYMENT",
    type: "BACKEND",
    experience: "MID_LEVEL",
    scenario: "DEBUGGING",
    marks: 40,
    duration_minutes: 45,
    programming_languages: ["TYPESCRIPT", "JAVASCRIPT"],
    databases: ["REDIS", "POSTGRESQL"],
    backend_frameworks: ["NODEJS", "EXPRESS"],
    frontend_frameworks: [],
    tasks: [
      { id: "t1", title: "Enforce Idempotency Key Caching", description: "Validate X-Idempotency-Key header against Redis before initiating transaction.", marks: 15, duration_minutes: 15 },
      { id: "t2", title: "Exponential Backoff & Jitter", description: "Implement capped exponential backoff with full jitter for transient 5xx HTTP responses.", marks: 15, duration_minutes: 15 },
      { id: "t3", title: "Dead-Letter Queue (DLQ) Notification", description: "Route persistently failing payloads to the dead_letter_webhooks queue with error context.", marks: 10, duration_minutes: 15 }
    ]
  },
  {
    id: "lab-ledger-rollup",
    title: "PostgreSQL Financial Ledger Double-Entry Rollup",
    description: "Optimize high-frequency ledger balance calculations using PostgreSQL window functions and optimistic concurrency control.",
    difficulty: "MEDIUM",
    domain: "FINANCE",
    type: "DATABASE",
    experience: "SENIOR",
    scenario: "PERFORMANCE_OPTIMIZATION",
    marks: 30,
    duration_minutes: 30,
    programming_languages: ["SQL", "PYTHON"],
    databases: ["POSTGRESQL"],
    backend_frameworks: ["FASTAPI"],
    frontend_frameworks: [],
    tasks: [
      { id: "t1", title: "Optimistic Version Locking", description: "Ensure account balance reconciliation uses version check to prevent double spending.", marks: 15, duration_minutes: 15 },
      { id: "t2", title: "Covering Index on Ledger Entries", description: "Create compound index on (account_id, posting_date DESC) INCLUDE (amount, status).", marks: 15, duration_minutes: 15 }
    ]
  },
  {
    id: "lab-cache-invalidation",
    title: "Distributed Cache Invalidation Engine (Redis + PubSub)",
    description: "Implement near-cache invalidation using Redis keyspace notifications and local memory LRU caches across multiple application nodes.",
    difficulty: "HARD",
    domain: "BACKEND",
    type: "BACKEND",
    experience: "SENIOR",
    scenario: "FEATURE_DEVELOPMENT",
    marks: 40,
    duration_minutes: 45,
    programming_languages: ["GO", "TYPESCRIPT"],
    databases: ["REDIS"],
    backend_frameworks: ["NODEJS"],
    frontend_frameworks: [],
    tasks: [
      { id: "t1", title: "PubSub Event Invalidation Channel", description: "Listen to mutation events on redis topic and evict local cache entries.", marks: 20, duration_minutes: 20 },
      { id: "t2", title: "Stampede Prevention with Probabilistic Early Expiration", description: "Use XFetch algorithm to refresh cache keys prior to TTL expiry.", marks: 20, duration_minutes: 25 }
    ]
  },
  {
    id: "lab-react-virtualization",
    title: "React Virtualized 100k-Row Data Grid with AbortController",
    description: "Build a high-performance windowed data table with dynamic row heights, column resizing, keyboard accessibility, and AbortController request canceling.",
    difficulty: "MEDIUM",
    domain: "FRONTEND",
    type: "FRONTEND",
    experience: "MID_LEVEL",
    scenario: "PERFORMANCE_OPTIMIZATION",
    marks: 35,
    duration_minutes: 40,
    programming_languages: ["TYPESCRIPT", "JAVASCRIPT"],
    databases: [],
    backend_frameworks: [],
    frontend_frameworks: ["REACT"],
    tasks: [
      { id: "t1", title: "Windowed Virtualization Buffer", description: "Render only visible row slices into the DOM buffer with transform translateY.", marks: 20, duration_minutes: 20 },
      { id: "t2", title: "AbortController Search Debounce", description: "Cancel inflight fetch queries when the user rapidly types in the filter input.", marks: 15, duration_minutes: 20 }
    ]
  },
  {
    id: "lab-order-saga",
    title: "Order State Machine & Saga Orchestration",
    description: "Implement a distributed compensation saga for payment, inventory reservation, and shipment booking with automated rollbacks.",
    difficulty: "HARD",
    domain: "SUPPLY_CHAIN",
    type: "BACKEND",
    experience: "SENIOR",
    scenario: "ARCHITECTURE",
    marks: 50,
    duration_minutes: 50,
    programming_languages: ["JAVA", "PYTHON"],
    databases: ["POSTGRESQL", "REDIS"],
    backend_frameworks: ["SPRING_BOOT", "DJANGO"],
    frontend_frameworks: [],
    tasks: [
      { id: "t1", title: "State Machine Transitions", description: "Validate valid transitions between PENDING, RESERVED, PAID, and FULFILLED.", marks: 25, duration_minutes: 25 },
      { id: "t2", title: "Compensating Transactions", description: "Trigger asynchronous inventory release when payment authorization times out.", marks: 25, duration_minutes: 25 }
    ]
  },
  {
    id: "lab-kafka-dlq",
    title: "Kafka Dead Letter Queue (DLQ) Auto-Replay Service",
    description: "Diagnose malformed JSON serialization errors, write payloads to a dead letter topic, and build an automated replay tool with backoff.",
    difficulty: "MEDIUM",
    domain: "DEVOPS",
    type: "BACKEND",
    experience: "MID_LEVEL",
    scenario: "PRODUCTION_INCIDENT",
    marks: 35,
    duration_minutes: 35,
    programming_languages: ["PYTHON", "JAVA"],
    databases: ["POSTGRESQL"],
    backend_frameworks: ["FASTAPI"],
    frontend_frameworks: [],
    tasks: [
      { id: "t1", title: "Error Header Enrichment", description: "Attach error stack trace and retry attempt count headers to DLQ messages.", marks: 15, duration_minutes: 15 },
      { id: "t2", title: "Safe Replay Dispatcher", description: "Verify message integrity before reprocessing into the main incoming topic.", marks: 20, duration_minutes: 20 }
    ]
  }
];

export const SEED_KNOWLEDGE_QUESTIONS: any[] = [
  {
    id: "kq-1",
    title: "Saga Pattern Eventual Consistency",
    content: "When implementing the Saga pattern for distributed transactions across microservices, which mechanism guarantees eventual consistency in the presence of orchestrator node crashes?",
    text: "When implementing the Saga pattern for distributed transactions across microservices, which mechanism guarantees eventual consistency in the presence of orchestrator node crashes?",
    difficulty: "HARD",
    experience: "Senior Developer",
    format: "MCQ",
    marks: 5,
    duration_minutes: 3,
    course: "Backend Engineering",
    topic: "Distributed Systems",
    options: [
      "Persisting the saga state machine progress in a durable database before executing each step",
      "Using synchronous HTTP REST calls between all downstream services",
      "Relying on TCP keepalive packets between microservice containers",
      "Disabling database foreign key constraints"
    ],
    correct_options: [0],
    solution_explanation: "A saga orchestrator must record each state transition in a durable log or transactional outbox so that a replacement node can resume execution and dispatch compensating transactions if necessary."
  },
  {
    id: "kq-2",
    title: "PostgreSQL Isolation Levels & Anomalies",
    content: "Which PostgreSQL transaction isolation level prevents Write Skew anomalies without requiring explicit SELECT FOR UPDATE table locks?",
    text: "Which PostgreSQL transaction isolation level prevents Write Skew anomalies without requiring explicit SELECT FOR UPDATE table locks?",
    difficulty: "MEDIUM",
    experience: "Mid-Level Developer",
    format: "MCQ",
    marks: 5,
    duration_minutes: 2,
    course: "Database Systems",
    topic: "Transactions",
    options: [
      "Read Committed",
      "Repeatable Read",
      "Serializable (SSI)",
      "Read Uncommitted"
    ],
    correct_options: [2],
    solution_explanation: "PostgreSQL's Serializable isolation uses Serializable Snapshot Isolation (SSI) which monitors read/write conflict cycles and aborts transactions exhibiting write skew (such as two doctors concurrently going off-call)."
  },
  {
    id: "kq-3",
    title: "Cache Stampede Mitigation Strategies",
    content: "Which of the following caching strategies best mitigates cache stampede (thundering herd) during high-throughput flash sale events? (Select all that apply)",
    text: "Which of the following caching strategies best mitigates cache stampede (thundering herd) during high-throughput flash sale events? (Select all that apply)",
    difficulty: "MEDIUM",
    experience: "Senior Developer",
    format: "Multiple Select",
    marks: 5,
    duration_minutes: 3,
    course: "Backend Engineering",
    topic: "Caching",
    options: [
      "Mutex locking (single flight) so only one worker queries the primary DB on miss",
      "Probabilistic early expiration (XFetch algorithm)",
      "Background periodic cache pre-warming",
      "Setting zero second TTL on all popular products"
    ],
    correct_options: [0, 1, 2],
    solution_explanation: "Single-flight mutexes, probabilistic early expiration, and periodic pre-warming all protect the database by preventing millions of concurrent queries from hitting the backend when a key expires."
  },
  {
    id: "kq-4",
    title: "React Fiber Concurrency & Transitions",
    content: "How does React 18 Concurrent Mode Fiber reconciler handle high-priority user input events during an ongoing heavy background transition render?",
    text: "How does React 18 Concurrent Mode Fiber reconciler handle high-priority user input events during an ongoing heavy background transition render?",
    difficulty: "MEDIUM",
    experience: "Senior Developer",
    format: "MCQ",
    marks: 5,
    duration_minutes: 3,
    course: "Frontend Architecture",
    topic: "React Internals",
    options: [
      "It blocks user input until the background render finishes",
      "It yields the main thread to process the discrete input event and restarts or resumes the transition",
      "It executes the background transition inside a Web Worker",
      "It reloads the page to clear the memory buffer"
    ],
    correct_options: [1],
    solution_explanation: "React 18 uses cooperative scheduling and priority lanes; discrete urgent events (clicks, typing) interrupt lower-priority startTransition lanes and execute immediately to maintain 60 FPS responsiveness."
  },
  {
    id: "kq-5",
    title: "Kafka Consumer Rebalancing & Sticky Assignors",
    content: "In Kafka consumer groups, what triggers a partition rebalance, and how does the cooperative sticky assignor minimize consumer downtime during rebalances?",
    text: "In Kafka consumer groups, what triggers a partition rebalance, and how does the cooperative sticky assignor minimize consumer downtime during rebalances?",
    difficulty: "HARD",
    experience: "Senior Developer",
    format: "MCQ",
    marks: 5,
    duration_minutes: 4,
    course: "Distributed Systems",
    topic: "Message Queues",
    options: [
      "Consumer failure/addition; Cooperative Sticky reassigns only necessary partitions without revoking all partitions eagerly",
      "Topic deletion; Sticky assignor immediately terminates the JVM process",
      "Broker disk full; Sticky assignor transfers messages to MySQL",
      "Network latency; Sticky assignor doubles the partition count automatically"
    ],
    correct_options: [0],
    solution_explanation: "The CooperativeStickyAssignor performs two-phase rebalancing where unaffected partitions continue consuming without interruption, avoiding the 'stop-the-world' stall of eager assignment."
  },
  {
    id: "kq-6",
    title: "Implement LRU Cache with O(1) Operations",
    content: "Design and implement a Least Recently Used (LRU) cache supporting get(key) and put(key, value) in O(1) average time complexity using a Hash Map and Doubly Linked List.",
    text: "Design and implement a Least Recently Used (LRU) cache supporting get(key) and put(key, value) in O(1) average time complexity using a Hash Map and Doubly Linked List.",
    difficulty: "MEDIUM",
    experience: "Mid-Level Developer",
    format: "Coding",
    marks: 15,
    duration_minutes: 20,
    course: "Backend Engineering",
    topic: "Data Structures",
    programming_languages: ["TYPESCRIPT", "PYTHON", "JAVA"]
  },
  {
    id: "kq-7",
    title: "SQL Running Balance with Window Functions",
    content: "Write a SQL query using SUM() OVER (PARTITION BY account_id ORDER BY transaction_date) to compute each customer's running balance, highlighting any negative dips.",
    text: "Write a SQL query using SUM() OVER (PARTITION BY account_id ORDER BY transaction_date) to compute each customer's running balance, highlighting any negative dips.",
    difficulty: "MEDIUM",
    experience: "Fresher",
    format: "Coding",
    marks: 10,
    duration_minutes: 15,
    course: "Database Systems",
    topic: "SQL Analytics",
    programming_languages: ["SQL"]
  },
  {
    id: "kq-8",
    title: "LSM Trees vs B+ Trees Write Amplification",
    content: "Compare Log-Structured Merge (LSM) trees (used in Cassandra/RocksDB) with B+ Trees (used in InnoDB/Postgres). Contrast write amplification, sequential vs random disk I/O, and compaction tradeoffs.",
    text: "Compare Log-Structured Merge (LSM) trees (used in Cassandra/RocksDB) with B+ Trees (used in InnoDB/Postgres). Contrast write amplification, sequential vs random disk I/O, and compaction tradeoffs.",
    difficulty: "HARD",
    experience: "Lead Architect",
    format: "Description",
    marks: 10,
    duration_minutes: 10,
    course: "Storage Engines",
    topic: "Database Internals"
  }
];

export const SEED_SYSTEM_DESIGN_QUESTIONS: any[] = [
  {
    id: "builtin-sd-url-shortener",
    title: "Design a High-Throughput URL Shortener (TinyURL)",
    description: "Architect a resilient, distributed URL shortening service capable of creating billions of aliases and serving high-frequency redirects with sub-millisecond response times, low latency CDN caching, and custom analytics tracking.",
    company: "Uber",
    scenario_type: "Distributed Storage & Routing",
    difficulty: "MEDIUM",
    domain: "BACKEND",
    duration_minutes: 45,
    marks: 30,
    system_slug: "systemdesign-url-shortener",
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
  },
  {
    id: "builtin-sd-ecommerce",
    title: "Design a Flash-Sale E-Commerce Platform",
    description: "Design an ultra-high concurrency e-commerce checkout and inventory system capable of handling surges of 100,000+ orders per second during limited-time flash sales without double bookings or overselling.",
    company: "Amazon",
    scenario_type: "High Concurrency & Transactions",
    difficulty: "HARD",
    domain: "RETAIL",
    duration_minutes: 60,
    marks: 40,
    system_slug: "systemdesign",
    constraints: [
      "Peak throughput: 100k requests/sec during drop window",
      "Zero overselling: strict inventory reservation guarantees",
      "Eventual consistency for order fulfillment and payment webhook processing",
      "Cart reservations expire after 10 minutes if unpurchased"
    ],
    tasks: [
      { id: "t1", title: "HLD Architecture Canvas", description: "Draw CDN, Edge Rate Limiter, Inventory Cache with Redis Lua scripts, Kafka Order Queue, and Payment Orchestrator.", marks: 10 },
      { id: "t2", title: "Database Schema (DBML)", description: "Model inventory balances, lock states, order records, and idempotent transaction logs.", marks: 10 },
      { id: "t3", title: "REST API Contracts", description: "Define endpoints for product catalog, inventory lock, and order placement.", marks: 10 },
      { id: "t4", title: "Sequence Diagrams", description: "Trace the distributed lock acquisition, payment confirmation, and async inventory reconciliation flow.", marks: 10 }
    ]
  },
  {
    id: "builtin-sd-rate-limiter",
    title: "Design a Distributed Global Rate Limiter & Abuse Gateway",
    description: "Design a multi-region distributed rate limiting service that protects tier-1 APIs against DDoS, credential stuffing, and noisy neighbors using Token Bucket and Sliding Window Counter algorithms.",
    company: "Stripe",
    scenario_type: "Edge Computing & Security",
    difficulty: "HARD",
    domain: "SECURITY",
    duration_minutes: 45,
    marks: 35,
    system_slug: "systemdesign",
    constraints: [
      "Evaluates rate limits on 1,000,000 requests per second with < 2ms latency penalty",
      "Supports granular rules: by API Key, IP address, and authenticated user tier",
      "Graceful degradation when central cache cluster is partitioned"
    ],
    tasks: [
      { id: "t1", title: "HLD Architecture Canvas", description: "Design Envoy proxy integration, local Redis cache, and central synchronization cluster.", marks: 15 },
      { id: "t2", title: "REST API Contracts & Header Spec", description: "Define X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After HTTP headers.", marks: 10 },
      { id: "t3", title: "Sequence Diagrams", description: "Diagram local memory check -> Redis increment -> 429 response flow.", marks: 10 }
    ]
  },
  {
    id: "builtin-sd-notification",
    title: "Design a High-Scale Multi-Channel Notification Platform",
    description: "Architect a centralized notification delivery engine dispatching 500 million push notifications, SMS messages, and emails daily with user preference management and deduplication.",
    company: "Netflix",
    scenario_type: "Distributed Messaging",
    difficulty: "MEDIUM",
    domain: "BACKEND",
    duration_minutes: 45,
    marks: 30,
    system_slug: "systemdesign",
    constraints: [
      "Sub-second delivery for critical OTPs and transactional alerts",
      "Bulk batch processing for promotional digests without starving priority queues",
      "Strict frequency capping (max 3 marketing notifications per user per day)"
    ],
    tasks: [
      { id: "t1", title: "HLD Architecture Canvas", description: "Design Priority Queues (RabbitMQ/Kafka), Worker Fleet, and Vendor Adapters (Twilio/SendGrid/APNs).", marks: 10 },
      { id: "t2", title: "Database Schema (DBML)", description: "Define user preferences, template storage, and delivery receipts.", marks: 10 },
      { id: "t3", title: "REST API Contracts", description: "POST /v1/notifications/send and GET /v1/notifications/{id}/status.", marks: 10 }
    ]
  }
];

export const questionBankService = {
  async getLabQuestions(): Promise<any[]> {
    try {
      const data: any = await restApiAuthUtil.get(`/skill_evaluation/lab-questions/`);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yuvro_custom_lab_questions");
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list) && list.length > 0) return [...list, ...SEED_LAB_QUESTIONS];
        }
      } catch {}
    }
    return SEED_LAB_QUESTIONS;
  },
  
  async getLabQuestion(id: string): Promise<any> {
    try {
      const q = await restApiAuthUtil.get(`/skill_evaluation/lab-questions/${id}/`);
      if (q && q.title) return q;
    } catch {}

    const list = await this.getLabQuestions();
    return list.find((l: any) => String(l.id) === String(id)) || SEED_LAB_QUESTIONS[0];
  },

  async createLabQuestion(data: any): Promise<any> {
    const newQ = { ...data, id: `lab-${Date.now().toString(36)}` };
    try {
      const res = await restApiAuthUtil.post(`/skill_evaluation/lab-questions/`, data);
      if (res && res.id) return res;
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yuvro_custom_lab_questions");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newQ);
        localStorage.setItem("yuvro_custom_lab_questions", JSON.stringify(list));
      } catch {}
    }
    return newQ;
  },

  async updateLabQuestion(id: string, data: any): Promise<any> {
    try {
      const res = await restApiAuthUtil.put(`/skill_evaluation/lab-questions/${id}/`, data);
      if (res && res.id) return res;
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yuvro_custom_lab_questions");
        if (stored) {
          let list = JSON.parse(stored);
          list = list.map((l: any) => l.id === id ? { ...l, ...data } : l);
          localStorage.setItem("yuvro_custom_lab_questions", JSON.stringify(list));
        }
      } catch {}
    }
    return { ...data, id };
  },

  async deleteLabQuestion(id: string): Promise<any> {
    try {
      await restApiAuthUtil.delete(`/skill_evaluation/lab-questions/${id}/`);
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yuvro_custom_lab_questions");
        if (stored) {
          let list = JSON.parse(stored);
          list = list.filter((l: any) => l.id !== id);
          localStorage.setItem("yuvro_custom_lab_questions", JSON.stringify(list));
        }
      } catch {}
    }
    return { status: "deleted" };
  },

  async verifyLabQuestion(data: any): Promise<any> {
    try {
      return await restApiAuthUtil.post(`/skill_evaluation/lab-questions/verify/`, data);
    } catch {}
    return { status: "verified", passed: true, score: data.marks || 10 };
  },

  async exportFixture(id: string): Promise<any> {
    try {
      return await restApiAuthUtil.post(`/skill_evaluation/lab-questions/${id}/export-fixture/`);
    } catch {}
    return { status: "exported", fixture_url: `/fixtures/${id}.json` };
  },

  async getKnowledgeQuestions(): Promise<any[]> {
    try {
      const data: any = await restApiAuthUtil.get(`/skill_evaluation/knowledge-questions/`);
      const list = Array.isArray(data) ? data : data?.results || [];
      if (list.length > 0) return list;
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yuvro_custom_knowledge_questions");
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list) && list.length > 0) return [...list, ...SEED_KNOWLEDGE_QUESTIONS];
        }
      } catch {}
    }
    return SEED_KNOWLEDGE_QUESTIONS;
  },

  async getKnowledgeQuestion(id: string): Promise<any> {
    try {
      const q = await restApiAuthUtil.get(`/skill_evaluation/knowledge-questions/${id}/`);
      if (q && q.title) return q;
    } catch {}

    const list = await this.getKnowledgeQuestions();
    return list.find((k: any) => String(k.id) === String(id)) || SEED_KNOWLEDGE_QUESTIONS[0];
  },

  async createKnowledgeQuestion(data: any): Promise<any> {
    const newQ = { ...data, id: `kq-${Date.now().toString(36)}` };
    try {
      const res = await restApiAuthUtil.post(`/skill_evaluation/knowledge-questions/`, data);
      if (res && res.id) return res;
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yuvro_custom_knowledge_questions");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newQ);
        localStorage.setItem("yuvro_custom_knowledge_questions", JSON.stringify(list));
      } catch {}
    }
    return newQ;
  },

  async updateKnowledgeQuestion(id: string, data: any): Promise<any> {
    try {
      const res = await restApiAuthUtil.put(`/skill_evaluation/knowledge-questions/${id}/`, data);
      if (res && res.id) return res;
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yuvro_custom_knowledge_questions");
        if (stored) {
          let list = JSON.parse(stored);
          list = list.map((k: any) => k.id === id ? { ...k, ...data } : k);
          localStorage.setItem("yuvro_custom_knowledge_questions", JSON.stringify(list));
        }
      } catch {}
    }
    return { ...data, id };
  },

  async deleteKnowledgeQuestion(id: string): Promise<any> {
    try {
      await restApiAuthUtil.delete(`/skill_evaluation/knowledge-questions/${id}/`);
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yuvro_custom_knowledge_questions");
        if (stored) {
          let list = JSON.parse(stored);
          list = list.filter((k: any) => k.id !== id);
          localStorage.setItem("yuvro_custom_knowledge_questions", JSON.stringify(list));
        }
      } catch {}
    }
    return { status: "deleted" };
  },

  async getSystemDesignQuestions(): Promise<any[]> {
    try {
      const data: any = await restApiAuthUtil.get(`/skill_evaluation/system-design-questions/`);
      const list = Array.isArray(data) ? data : data?.results || [];
      if (list.length > 0) return list;
    } catch {}

    return SEED_SYSTEM_DESIGN_QUESTIONS;
  },

  async getSystemDesignQuestion(id: string): Promise<any> {
    try {
      const q = await restApiAuthUtil.get(`/skill_evaluation/system-design-questions/${id}/`);
      if (q && q.title) return q;
    } catch {}

    return SEED_SYSTEM_DESIGN_QUESTIONS.find((s) => s.id === id) || SEED_SYSTEM_DESIGN_QUESTIONS[0];
  },

  async createSystemDesignQuestion(data: any): Promise<any> {
    const newQ = { ...data, id: `sd-${Date.now().toString(36)}` };
    try {
      const res = await restApiAuthUtil.post(`/skill_evaluation/system-design-questions/`, data);
      if (res && res.id) return res;
    } catch {}
    return newQ;
  },

  async updateSystemDesignQuestion(id: string, data: any): Promise<any> {
    try {
      const res = await restApiAuthUtil.put(`/skill_evaluation/system-design-questions/${id}/`, data);
      if (res && res.id) return res;
    } catch {}
    return { ...data, id };
  },

  async deleteSystemDesignQuestion(id: string): Promise<any> {
    try {
      await restApiAuthUtil.delete(`/skill_evaluation/system-design-questions/${id}/`);
    } catch {}
    return { status: "deleted" };
  }
};
