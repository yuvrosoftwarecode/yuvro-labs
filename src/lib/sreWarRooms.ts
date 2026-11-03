// SRE War Room labs: domain-specific production incident simulations.
export type ActionId =
  | "rollback" | "restart" | "scale" | "kill-queries" | "warm-cache"
  | "circuit-breaker" | "disable-feature" | "failover" | "rate-limit";

export const ACTIONS: { id: ActionId; label: string; cost: number }[] = [
  { id: "rollback", label: "Rollback Deploy", cost: 40 },
  { id: "restart", label: "Restart Service", cost: 25 },
  { id: "scale", label: "Scale Horizontally", cost: 60 },
  { id: "kill-queries", label: "Kill Long Queries", cost: 30 },
  { id: "warm-cache", label: "Warm Cache", cost: 35 },
  { id: "circuit-breaker", label: "Circuit Breaker", cost: 20 },
  { id: "disable-feature", label: "Disable Feature", cost: 15 },
  { id: "failover", label: "Failover Region", cost: 70 },
  { id: "rate-limit", label: "Rate Limit Traffic", cost: 20 },
];

export type Incident = {
  id: string;
  title: string;
  service: string; // service key that goes critical
  story: string;
  fix: ActionId;
  hint: string;
};

export type WarRoom = {
  slug: string;
  domain: string;
  name: string;
  description: string;
  services: { key: string; label: string; p99: number }[];
  incidents: Incident[];
};

export const warRooms: WarRoom[] = [
  {
    slug: "fintech-payments",
    domain: "Finance",
    name: "Fintech Payments War Room",
    description: "Keep card authorisations, ledgers and UPI settlements alive during market-hour spikes.",
    services: [
      { key: "gateway", label: "API Gateway", p99: 12 },
      { key: "auth", label: "Card Auth", p99: 22 },
      { key: "ledger", label: "Ledger Service", p99: 30 },
      { key: "fraud", label: "Fraud Engine", p99: 40 },
      { key: "db", label: "PostgreSQL", p99: 5 },
      { key: "cache", label: "Redis Cache", p99: 2 },
      { key: "queue", label: "Kafka", p99: 8 },
      { key: "bank", label: "Bank Connector", p99: 90 },
    ],
    incidents: [
      { id: "double-debit", title: "Double Debits", service: "ledger", story: "A deploy changed retry logic. Customers are being debited twice for the same payment.", fix: "rollback", hint: "Undo the change that introduced duplicate retries." },
      { id: "fraud-latency", title: "Fraud Engine Stall", service: "fraud", story: "The fraud model is timing out under salary-day load, blocking 40% of transactions.", fix: "circuit-breaker", hint: "Fail open with rule-based checks while the model recovers." },
      { id: "bank-outage", title: "Partner Bank Down", service: "bank", story: "A partner bank's API is returning 503s in one region.", fix: "failover", hint: "Route traffic to the secondary bank connector region." },
      { id: "ledger-locks", title: "Ledger Lock Contention", service: "db", story: "A reconciliation report is holding row locks on the ledger table.", fix: "kill-queries", hint: "Stop the long-running report query." },
      { id: "settlement-lag", title: "Settlement Lag", service: "queue", story: "Settlement consumers are 2M messages behind.", fix: "scale", hint: "Add more consumers to drain the backlog." },
    ],
  },
  {
    slug: "ecommerce-sale",
    domain: "E-commerce",
    name: "Big Sale Day War Room",
    description: "Survive a flash sale: carts, inventory, checkout and search under 20x traffic.",
    services: [
      { key: "gateway", label: "API Gateway", p99: 12 },
      { key: "catalog", label: "Catalog", p99: 18 },
      { key: "cart", label: "Cart Service", p99: 15 },
      { key: "checkout", label: "Checkout", p99: 25 },
      { key: "inventory", label: "Inventory DB", p99: 6 },
      { key: "cache", label: "Redis Cache", p99: 2 },
      { key: "search", label: "Search", p99: 30 },
      { key: "cdn", label: "CDN / Edge", p99: 3 },
    ],
    incidents: [
      { id: "cold-cache", title: "Cold Cache Stampede", service: "cache", story: "Redis restarted at midnight. Every product page now hits the database directly.", fix: "warm-cache", hint: "Pre-load hot product keys." },
      { id: "bot-traffic", title: "Bot Storm", service: "gateway", story: "Scalper bots are hammering the gateway with 80k requests/s.", fix: "rate-limit", hint: "Throttle abusive clients at the edge." },
      { id: "reco-crash", title: "Recommendations Crash", service: "checkout", story: "A new 'frequently bought together' widget is crashing checkout.", fix: "disable-feature", hint: "Turn off the non-critical widget via flag." },
      { id: "search-cpu", title: "Search CPU Pegged", service: "search", story: "Search nodes are at 98% CPU as traffic grows.", fix: "scale", hint: "Add more search replicas." },
      { id: "cart-leak", title: "Cart Memory Leak", service: "cart", story: "Cart pods are slowly leaking memory and swapping.", fix: "restart", hint: "Recycle the pods to buy time." },
    ],
  },
  {
    slug: "insurance-claims",
    domain: "Insurance",
    name: "Insurance Claims War Room",
    description: "Protect policy quotes, claims intake and document processing after a natural disaster.",
    services: [
      { key: "gateway", label: "API Gateway", p99: 12 },
      { key: "quote", label: "Quote Engine", p99: 35 },
      { key: "claims", label: "Claims Service", p99: 28 },
      { key: "docs", label: "Document OCR", p99: 120 },
      { key: "db", label: "PostgreSQL", p99: 5 },
      { key: "queue", label: "Kafka", p99: 8 },
      { key: "underwriting", label: "Underwriting", p99: 45 },
      { key: "notify", label: "Notifications", p99: 10 },
    ],
    incidents: [
      { id: "claim-surge", title: "Claim Surge", service: "claims", story: "A cyclone just hit. Claim submissions are up 30x.", fix: "scale", hint: "Add capacity to claims intake." },
      { id: "ocr-hang", title: "OCR Workers Hung", service: "docs", story: "OCR workers are stuck on corrupted PDFs and stop processing.", fix: "restart", hint: "Restart the stuck workers." },
      { id: "quote-bug", title: "Premium Miscalculation", service: "quote", story: "A rate-table deploy is quoting premiums at zero.", fix: "rollback", hint: "Revert the bad rate-table release." },
      { id: "actuarial-query", title: "Actuarial Query", service: "db", story: "An actuarial analytics query is saturating DB connections.", fix: "kill-queries", hint: "Terminate the analytics query." },
      { id: "sms-vendor", title: "SMS Vendor Timeouts", service: "notify", story: "The SMS vendor is timing out and blocking claim confirmations.", fix: "circuit-breaker", hint: "Stop calling the failing vendor synchronously." },
    ],
  },
  {
    slug: "ride-sharing",
    domain: "Ride sharing",
    name: "Ride Sharing War Room",
    description: "Keep driver matching, live location, surge pricing and trip payments running on Friday night.",
    services: [
      { key: "gateway", label: "API Gateway", p99: 12 },
      { key: "matching", label: "Driver Matching", p99: 40 },
      { key: "location", label: "Location Stream", p99: 6 },
      { key: "pricing", label: "Surge Pricing", p99: 20 },
      { key: "trips", label: "Trip Service", p99: 18 },
      { key: "payments", label: "Payments", p99: 25 },
      { key: "maps", label: "Maps / ETA", p99: 50 },
      { key: "cache", label: "Redis Geo", p99: 2 },
    ],
    incidents: [
      { id: "geo-cold", title: "Geo Index Empty", service: "cache", story: "Redis Geo failed over and lost driver positions. Matching returns no drivers.", fix: "warm-cache", hint: "Rebuild the geo index from the location stream." },
      { id: "surge-bug", title: "Runaway Surge", service: "pricing", story: "A pricing deploy is showing 9x surge across the city.", fix: "rollback", hint: "Revert the pricing release." },
      { id: "maps-region", title: "Maps Region Outage", service: "maps", story: "The ETA provider's primary region is down.", fix: "failover", hint: "Switch to the secondary maps region." },
      { id: "location-flood", title: "Location Flood", service: "location", story: "A buggy app build sends GPS pings every 50ms.", fix: "rate-limit", hint: "Throttle pings per device." },
      { id: "match-cpu", title: "Matching Overload", service: "matching", story: "Concert ended — matching CPU at 95%.", fix: "scale", hint: "Add matching workers." },
    ],
  },
  {
    slug: "food-delivery",
    domain: "Food delivery",
    name: "Food Delivery War Room",
    description: "Handle dinner-rush incidents across restaurant menus, order routing and rider dispatch.",
    services: [
      { key: "gateway", label: "API Gateway", p99: 12 },
      { key: "menu", label: "Menu Service", p99: 15 },
      { key: "orders", label: "Order Service", p99: 22 },
      { key: "dispatch", label: "Rider Dispatch", p99: 35 },
      { key: "db", label: "PostgreSQL", p99: 5 },
      { key: "cache", label: "Redis Cache", p99: 2 },
      { key: "queue", label: "Kafka", p99: 8 },
      { key: "promo", label: "Promotions", p99: 14 },
    ],
    incidents: [
      { id: "promo-crash", title: "Promo Code Crash", service: "promo", story: "A viral promo is crashing order placement.", fix: "disable-feature", hint: "Disable the promo flag." },
      { id: "dispatch-backlog", title: "Dispatch Backlog", service: "queue", story: "Order events are piling up in Kafka; riders aren't assigned.", fix: "scale", hint: "Scale the dispatch consumers." },
      { id: "menu-cache", title: "Menu Cache Miss", service: "cache", story: "Menu cache evicted after a config change; DB load tripled.", fix: "warm-cache", hint: "Warm popular restaurant menus." },
      { id: "orders-deploy", title: "Bad Order Deploy", service: "orders", story: "New order service build returns 500s for COD orders.", fix: "rollback", hint: "Roll back the order service." },
    ],
  },
  {
    slug: "streaming-live",
    domain: "Media streaming",
    name: "Live Streaming War Room",
    description: "Keep a live cricket final streaming for millions with CDN, transcoding and auth incidents.",
    services: [
      { key: "gateway", label: "API Gateway", p99: 12 },
      { key: "auth", label: "Auth Service", p99: 15 },
      { key: "transcode", label: "Transcoder", p99: 80 },
      { key: "playback", label: "Playback API", p99: 20 },
      { key: "cdn", label: "CDN / Edge", p99: 3 },
      { key: "db", label: "PostgreSQL", p99: 5 },
      { key: "cache", label: "Redis Cache", p99: 2 },
      { key: "ads", label: "Ad Insertion", p99: 30 },
    ],
    incidents: [
      { id: "login-storm", title: "Login Storm", service: "auth", story: "Toss happened — 10M users logging in at once.", fix: "scale", hint: "Scale auth horizontally." },
      { id: "cdn-pop", title: "CDN PoP Failure", service: "cdn", story: "The Mumbai CDN PoP is dropping segments.", fix: "failover", hint: "Shift traffic to another PoP." },
      { id: "ads-stall", title: "Ad Server Stall", service: "ads", story: "Ad insertion is freezing streams at every over break.", fix: "circuit-breaker", hint: "Skip ads when the ad server is slow." },
      { id: "transcoder-leak", title: "Transcoder Leak", service: "transcode", story: "Transcoder memory climbs; frames are dropping.", fix: "restart", hint: "Rolling-restart the transcoders." },
    ],
  },
  {
    slug: "healthcare-ehr",
    domain: "Healthcare",
    name: "Hospital EHR War Room",
    description: "Keep patient records, e-prescriptions and lab results flowing across a 40-hospital network during the night shift.",
    services: [
      { key: "gateway", label: "API Gateway", p99: 12 },
      { key: "ehr", label: "EHR Records", p99: 25 },
      { key: "rx", label: "e-Prescription", p99: 20 },
      { key: "lab", label: "Lab Results (HL7)", p99: 35 },
      { key: "imaging", label: "PACS Imaging", p99: 120 },
      { key: "db", label: "PostgreSQL", p99: 5 },
      { key: "queue", label: "HL7 Queue", p99: 8 },
      { key: "idp", label: "SSO / IdP", p99: 15 },
    ],
    incidents: [
      { id: "hl7-backlog", title: "Lab Results Delayed", service: "queue", story: "ICU doctors report lab results arriving 25 minutes late. The HL7 interface queue has 400k pending messages.", fix: "scale", hint: "Add more HL7 consumers to drain the backlog." },
      { id: "rx-deploy", title: "Prescription Dosage Bug", service: "rx", story: "Tonight's deploy rounds dosage units incorrectly in the e-prescription form. Pharmacists are flagging orders.", fix: "rollback", hint: "Patient safety first — revert the deploy immediately." },
      { id: "pacs-region", title: "Imaging Storage Outage", service: "imaging", story: "The primary PACS storage zone is unreachable; radiologists can't open CT scans.", fix: "failover", hint: "Switch imaging reads to the replica zone." },
      { id: "audit-query", title: "Audit Report Locks", service: "db", story: "A compliance audit export is scanning the full patient table and blocking chart updates.", fix: "kill-queries", hint: "Stop the long-running audit query and reschedule it." },
      { id: "sso-retry", title: "SSO Retry Storm", service: "idp", story: "Shift change — 6,000 nurses log in at once and clients retry aggressively, overloading SSO.", fix: "rate-limit", hint: "Throttle retries at the gateway so logins succeed in order." },
      { id: "ai-notes", title: "AI Notes Widget Crash", service: "ehr", story: "A new AI clinical-notes summary panel is crashing patient chart loads.", fix: "disable-feature", hint: "Turn off the non-critical panel via feature flag." },
    ],
  },
  {
    slug: "airline-booking",
    domain: "Travel",
    name: "Airline Booking War Room",
    description: "Hold up seat inventory, check-in and boarding passes while a monsoon storm reroutes 300 flights.",
    services: [
      { key: "gateway", label: "API Gateway", p99: 12 },
      { key: "search", label: "Fare Search", p99: 40 },
      { key: "seats", label: "Seat Inventory", p99: 18 },
      { key: "checkin", label: "Web Check-in", p99: 22 },
      { key: "gds", label: "GDS Connector", p99: 150 },
      { key: "notify", label: "SMS / Push", p99: 30 },
      { key: "db", label: "PostgreSQL", p99: 5 },
      { key: "cache", label: "Redis Cache", p99: 2 },
    ],
    incidents: [
      { id: "rebook-surge", title: "Rebooking Surge", service: "search", story: "Storm cancellations sent 2M passengers to search for new flights at once.", fix: "scale", hint: "Add fare search replicas." },
      { id: "gds-down", title: "GDS Provider Outage", service: "gds", story: "The primary GDS region returns timeouts; no new tickets can be issued.", fix: "failover", hint: "Route bookings to the secondary GDS region." },
      { id: "fare-cache", title: "Fare Cache Flushed", service: "cache", story: "An ops script flushed Redis; every fare lookup now hits the database.", fix: "warm-cache", hint: "Pre-load popular routes into cache." },
      { id: "sms-flood", title: "Notification Flood", service: "notify", story: "The SMS vendor is slow and delay alerts are piling up, blocking check-in threads.", fix: "circuit-breaker", hint: "Fail fast on SMS and queue alerts for later." },
      { id: "seat-leak", title: "Seat Map Memory Leak", service: "seats", story: "Seat inventory pods leak memory under seat-change bursts.", fix: "restart", hint: "Rolling-restart the pods to buy time." },
    ],
  },
];

export const getWarRoom = (slug: string) => warRooms.find((w) => w.slug === slug);
