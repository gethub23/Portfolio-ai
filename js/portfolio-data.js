/**
 * Single source of truth for portfolio copy — edit here to update the site.
 * Sourced from CV + https://gethub23.github.io/Portfolio/
 */
window.PORTFOLIO = {
  profile: {
    name: "Ahmed Abdullah",
    title: "Senior Software Engineer",
    subtitle: "Backend Architect · Team Lead",
    tagline:
      "I architect backends that hold under real load — APIs, queues, and data paths you can trust when it counts.",
    bio: "Senior Software Engineer, Backend Architect, and Team Lead with 8+ years of experience designing high-performance, scalable backends in PHP and Laravel. Leading backend engineers with a focus on clean architecture, SOLID principles, and delivery from requirements to production. Based in Mansoura, Egypt.",
    location: "Mansoura, Egypt",
  },
  /** Legacy typing hook (hero stack is static); terminal may still echo this list */
  typingTerms: ["Laravel · Node.js · PHP · MySQL · Redis · WebSockets"],
  featuredSkillProject: {
    badge: "OPEN SOURCE",
    title: "Laravel Project Base",
    subtitle: "My personal starter — cloned at the start of every new project",
    description:
      "A production-ready Laravel 11 + PHP 8.2 fullstack starter with versioned API, reusable Admin panel, and clean architecture patterns baked in from day one.",
    github: "https://github.com/gethub23/my-project-base",
    githubLabel: "Open source",
    stack: ["Laravel 11", "PHP 8.2", "Vite", "Tailwind v4", "MySQL", "Redis", "Queue"],
    packages: ["Spatie Media", "Laravel Translatable", "Maatwebsite Excel", "PHPWord"],
    includes: [
      "Versioned API (v1 auto-routed, ready for v2)",
      "Admin Panel (Auth, Users, Roles, Notifications, Settings)",
      "CRUD with soft delete, bulk delete, block/unblock, filters, export",
      "Thin Controllers + Services + Form Requests",
      "Unified response Traits",
      "i18n + Media support from day one",
      "composer dev — server + queue + vite in one command",
    ],
    note: "This base saves me effort and days of work on every new project.",
  },
  skillsByCategory: {
    Languages: [
      { name: "PHP (Advanced OOP)", level: "advanced" },
      { name: "JavaScript", level: "advanced" },
      { name: "SQL", level: "advanced" },
      { name: "Python (growing)", level: "growing" },
    ],
    Frameworks: [
      { name: "Laravel", level: "expert" },
      { name: "Livewire", level: "advanced" },
      { name: "Native PHP", level: "advanced" },
      { name: "Node.js", level: "advanced" },
      { name: "REST API design", level: "advanced" },
    ],
    Databases: [
      { name: "MySQL (advanced optimization)", level: "expert" },
      { name: "Redis", level: "advanced" },
      { name: "Schema design", level: "advanced" },
      { name: "Query optimization", level: "advanced" },
      { name: "High-concurrency DB design", level: "expert" },
    ],
    "Architecture & Patterns": [
      { name: "SOLID principles", level: "expert" },
      { name: "Design patterns (Strategy, Factory, Observer, Command)", level: "expert" },
      { name: "Clean code", level: "advanced" },
      { name: "Microservices", level: "advanced" },
      { name: "Event-driven architecture", level: "expert" },
    ],
    "DevOps & Tools": [
      { name: "Git / GitHub / GitLab", level: "advanced" },
      { name: "CI/CD", level: "advanced" },
      { name: "Agile (Scrum / Kanban)", level: "advanced" },
      { name: "WebSockets", level: "advanced" },
      { name: "Queue systems", level: "advanced" },
      { name: "Docker (basics)", level: "growing" },
      { name: "Technical SEO", level: "advanced" },
    ],
    "AI & Modern Tools": {
      groups: [
        {
          label: "Daily",
          tone: "daily",
          items: [
            "Cursor AI",
            "Claude (Anthropic)",
            "ChatGPT (OpenAI)",
            "GLM (ZhipuAI)",
            "Qwen (Alibaba)",
          ],
        },
        {
          label: "Familiar",
          tone: "familiar",
          items: [
            "DeepSeek R1",
            "Gemini 2.5 Pro",
            "Llama 3 (Meta)",
            "Codestral (Mistral)",
          ],
        },
      ],
    },
  },
  experience: [
    {
      company: "Awamer Alshabaka (AAIT)",
      location: "Mansoura, Egypt",
      role: "Team Lead",
      levelTag: "LEADERSHIP",
      current: true,
      period: "2023 — Present",
      bullets: [
        "Led and mentored a team of 5–10 backend engineers, setting architectural standards and conducting rigorous code reviews.",
        "Architected scalable systems for FinTech and E-commerce platforms handling millions of daily transactions.",
        "Eliminated critical technical debt by introducing SOLID principles, design patterns, and systematic legacy refactoring.",
        "Acted as technical bridge between business stakeholders and engineering — translating requirements into reliable roadmaps.",
      ],
    },
    {
      company: "Awamer Alshabaka (AAIT)",
      location: "Mansoura, Egypt",
      role: "Senior Software Engineer",
      levelTag: "ENGINEERING",
      period: "2018 — 2023",
      bullets: [
        "Delivered 100+ production projects across Logistics, Healthcare, EdTech, E-commerce, and FinTech with full ownership.",
        "Engineered LMS platforms supporting live streaming and virtual classrooms for 20K+ concurrent users.",
        "Built high-availability backends handling 10K+ RPS with sub-100ms response times.",
        "Improved Core Web Vitals by 40–60% through advanced performance tuning and technical SEO audits.",
      ],
    },
    {
      company: "Freelance (Self-Employed)",
      location: "Remote",
      role: "PHP Web Developer & System Architect",
      levelTag: "FREELANCE",
      period: "Sep 2018 — Oct 2022",
      bullets: [
        "Architected custom Laravel and native PHP backends following strict SOLID principles and clean architecture.",
        "Built 20+ multi-vendor marketplaces with Stripe/PayPal integration and complex inventory synchronization.",
        "Designed high-throughput MySQL schemas handling 100K+ daily transactions with optimized query performance.",
      ],
    },
  ],
  projects: [
    {
      title: "Educational Platforms & Online Exams",
      description:
        "Full LMS with live classes, recorded content, online exams with anti-cheat, certificates, and student progress tracking.",
      impact: ["20K+ concurrent users", "live streaming", "automated certification"],
      category: "EDTECH",
      tech: ["Laravel", "WebSockets", "MySQL", "Redis"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Single-Vendor Stores",
      description:
        "Complete e-commerce stores with inventory management, order lifecycle, discount engines, and payment gateway integration.",
      impact: ["full order lifecycle", "multi-payment support", "real-time inventory"],
      category: "E-COMMERCE",
      tech: ["Laravel", "MySQL", "Payments", "Redis"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Multi-Vendor Marketplaces",
      description:
        "Complex marketplace platforms with vendor onboarding, commission engines, order routing, and warehouse sync.",
      impact: ["50K+ daily orders", "99.5% delivery accuracy", "dynamic pricing"],
      category: "E-COMMERCE",
      tech: ["Laravel", "MySQL", "Payments", "Redis"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Freelancer Broker Platform (وسيط فنيين)",
      description:
        "Marketplace connecting skilled technicians with customers — service matching, booking engine, rating system, and commission management.",
      impact: ["automated matching", "real-time booking", "multi-service support"],
      category: "MARKETPLACE",
      tech: ["Laravel", "MySQL", "Realtime", "Payments"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Food & Package Delivery",
      description:
        "End-to-end delivery platforms with order management, real-time driver tracking, ETA calculation, and customer notifications.",
      impact: ["100K+ daily deliveries", "5s GPS update", "live tracking"],
      category: "LOGISTICS",
      tech: ["Laravel", "Node.js", "Maps/GPS", "MySQL"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Loyalty & Rewards Systems",
      description:
        "Large-scale loyalty platforms with QR scanning, points engine, reward redemption, promo code distribution, and leaderboards.",
      impact: ["1M+ promo codes", "300K day-one scans", "99.99% uptime"],
      category: "FINTECH",
      tech: ["Laravel", "Node.js", "Redis", "MySQL"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Courier & Shipment Delivery",
      description:
        "B2B/B2C shipment tracking systems with warehouse integration, route optimization, and multi-stop delivery management.",
      impact: ["real-time tracking", "route optimization", "warehouse sync"],
      category: "LOGISTICS",
      tech: ["Laravel", "MySQL", "Maps/GPS", "Redis"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Ride-Hailing (Uber-style)",
      description:
        "Passenger transport platform with real-time driver matching, live GPS tracking, dynamic pricing, group rides, and in-app communication.",
      impact: ["real-time matching", "live GPS", "dynamic pricing"],
      category: "TRANSPORT",
      tech: ["Laravel", "Node.js", "WebSockets", "Maps/GPS"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Freight & Cargo Delivery",
      description:
        "Heavy goods transport system with load management, driver assignment, route planning, and delivery confirmation workflows.",
      impact: ["multi-stop routing", "load optimization", "real-time status"],
      category: "LOGISTICS",
      tech: ["Laravel", "MySQL", "Maps/GPS", "Node.js"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Hotel & Flight Booking",
      description:
        "Travel platform with availability search, seat/room reservation, booking management, payment processing, and cancellation workflows.",
      impact: ["real-time availability", "multi-provider support", "automated confirmations"],
      category: "TRAVEL",
      tech: ["Laravel", "MySQL", "Payments", "Redis"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Healthcare Management System",
      description:
        "Full medical ecosystem — hospital/clinic booking, pharmacy and medicine delivery, radiology requests and department routing, and complete patient visit cycle tracking on system.",
      impact: ["full patient cycle", "multi-department routing", "pharmacy integration"],
      category: "HEALTHCARE",
      tech: ["Laravel", "MySQL", "Redis", "Realtime"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Gym & Sports Club Apps",
      description:
        "Club management with membership plans, class scheduling, trainer booking, attendance tracking, and subscription billing.",
      impact: ["automated billing", "class scheduling", "real-time availability"],
      category: "FITNESS",
      tech: ["Laravel", "MySQL", "Payments", "Redis"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Classifieds & Commission Ads (حراج-style)",
      description:
        "Ad listing platform with category management, promoted listings, commission-based monetization, and seller/buyer messaging.",
      impact: ["commission engine", "promoted listings", "real-time messaging"],
      category: "MARKETPLACE",
      tech: ["Laravel", "MySQL", "Redis", "Payments"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Online Auctions & Bidding",
      description:
        "Real-time auction platform with WebSocket-based live bidding, anti-fraud validation, auto-bid engine, and instant winner notifications.",
      impact: ["1000+ concurrent bidders", "<100ms bid latency", "zero conflicts"],
      category: "REALTIME",
      tech: ["Node.js", "WebSockets", "Laravel", "Redis"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Mobile Car Wash",
      description:
        "On-demand car wash booking with technician dispatch, real-time location tracking, service scheduling, and subscription packages.",
      impact: ["on-demand dispatch", "real-time tracking", "subscription billing"],
      category: "ON-DEMAND",
      tech: ["Laravel", "MySQL", "Maps/GPS", "Payments"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Events & Venue Booking",
      description:
        "Event management platform for party planning, hall reservations, photography session booking, and vendor coordination.",
      impact: ["multi-vendor booking", "calendar management", "automated confirmations"],
      category: "EVENTS",
      tech: ["Laravel", "MySQL", "Payments", "Redis"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Social Media Platforms",
      description:
        "Full social network with posts, stories, follow system, real-time notifications, direct messaging, and content feed algorithms.",
      impact: ["real-time feed", "WebSocket notifications", "scalable architecture"],
      category: "SOCIAL",
      tech: ["Laravel", "Node.js", "WebSockets", "Redis", "MySQL"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Job Board Platform",
      description:
        "Recruitment platform with job listings, applicant tracking, company profiles, CV parsing, and employer/candidate matching.",
      impact: ["smart matching", "CV parsing", "application tracking"],
      category: "HR TECH",
      tech: ["Laravel", "MySQL", "Redis", "Elasticsearch"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Freelance Management Platform",
      description:
        "Platform connecting freelancers with clients — project posting, proposal system, milestone payments, dispute resolution, and review system.",
      impact: ["milestone payments", "escrow system", "dispute resolution"],
      category: "MARKETPLACE",
      tech: ["Laravel", "MySQL", "Payments", "Redis"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
    {
      title: "Legal Consultation Platform",
      description:
        "On-demand legal advisory platform with lawyer profiles, consultation booking, secure chat, document sharing, and session billing.",
      impact: ["secure consultation", "document sharing", "subscription billing"],
      category: "LEGAL TECH",
      tech: ["Laravel", "MySQL", "WebSockets", "Payments"],
      github: "https://github.com/gethub23",
      linkLabel: "GitHub",
    },
  ],
  education: {
    degree: "Bachelor of Computers and Information",
    school: "Mansoura University",
    period: "2012 — 2017",
  },
  socials: {
    email: "aa926626@gmail.com",
    linkedin: "https://www.linkedin.com/in/ahmed-abdullah-49b6a8170/",
    whatsapp: "https://wa.me/201033323110",
    github: "https://github.com/gethub23",
    portfolio: "https://gethub23.github.io/Portfolio/",
  },
};
