export const SYSTEM_DESIGN_LABS = [
  { slug: "systemdesign", name: "System Design Ecommere", subject: "E-commerce", service: "Order Service", entity: "orders", action: "Place order", description: "Design an e-commerce platform: catalog, checkout, inventory, payments and order processing." },
  { slug: "systemdesign-url-shortener", name: "System Design URL Shortener", subject: "URL Shortener", service: "URL Service", entity: "urls", action: "Shorten URL", description: "Design a URL shortener: short codes, fast redirects, caching and click analytics." },
  { slug: "systemdesign-bookmysystem", name: "System Design BookMySystem", subject: "BookMySystem", service: "Booking Service", entity: "bookings", action: "Reserve seat", description: "Design a booking platform: event discovery, seat availability, reservations and payments." },
] as const;

export function getSystemDesignLab(slug: string) {
  return SYSTEM_DESIGN_LABS.find(lab => lab.slug === slug);
}

export const SYSTEM_DESIGN_SPRINTS = [
  { id: "SD1", name: "Sprint 1 · Fundamentals", goal: "Requirements, SLOs and API contracts", tags: ["SD Fundamentals"] },
  { id: "SD2", name: "Sprint 2 · Scalability", goal: "Scaling, load balancing and rate limiting", tags: ["SD Scalability"] },
  { id: "SD3", name: "Sprint 3 · Caching", goal: "Cache strategies, CDN and invalidation", tags: ["SD Caching"] },
  { id: "SD4", name: "Sprint 4 · Databases", goal: "Data modeling, sharding and consistency", tags: ["SD Databases"] },
  { id: "SD5", name: "Sprint 5 · Messaging", goal: "Queues and event-driven workflows", tags: ["SD Messaging"] },
  { id: "SD6", name: "Sprint 6 · End-to-end Design", goal: "Connect HLD, sequence diagrams, database schema and LLD", tags: ["SD Cases"] },
];