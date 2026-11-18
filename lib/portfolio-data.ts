import {
  siDocker,
  siFastapi,
  siGooglecloud,
  siNestjs,
  siNextdotjs,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siSpringboot,
  siTailwindcss,
  siTypescript,
} from "simple-icons";

export type SectionId = "about" | "experience" | "projects";
export type NavItem = { id: SectionId; label: string };
export type ExperienceEntry = {
  role: string;
  company: string;
  location: string;
  date: string;
  description: string;
  highlights?: string[];
  technologies: string[];
};

export const navItems: NavItem[] = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
];

export const metrics = [
  { value: "125M+ IDR", label: "sales impact delivered" },
  { value: "~8000", label: "agents served" },
];

export const stack = [
  // Frontend
  { label: "React", icon: siReact },
  { label: "Next.js", icon: siNextdotjs },
  { label: "TypeScript", icon: siTypescript },
  { label: "Tailwind", icon: siTailwindcss },
  // Backend & Languages
  { label: "Python", icon: siPython },
  { label: "FastAPI", icon: siFastapi },
  { label: "NestJS", icon: siNestjs },
  { label: "Java Springboot", icon: siSpringboot },
  // Database, Cloud & DevOps
  { label: "PostgreSQL", icon: siPostgresql },
  { label: "Redis", icon: siRedis },
  { label: "Docker", icon: siDocker },
  // shortcut: simple-icons dropped its AWS icon in v15, and the page renders labels only.
  { label: "AWS" },
  { label: "GCP", icon: siGooglecloud },
];

export const experiences: ExperienceEntry[] = [
  {
    role: "Technical Lead",
    company: "Confidential Venture",
    location: "U.S.-based / Remote from Indonesia",
    date: "SEP 2026 - PRESENT",
    description:
      "Technical lead at a U.S.-based company. Further details are confidential under NDA.",
    technologies: [],
  },
  {
    role: "Head of Information Technology",
    company: "PRUaini Group",
    location: "Medan, Indonesia (Hybrid)",
    date: "JAN 2025 - PRESENT",
    description:
      "Technical owner of PRUaini Group's company portal, reporting directly to the founders and leading a team of 5. Designed, built, deployed and operate the platform for ~8000 agents across Indonesia, with 186 API routes covering quotes, learning, video, events, search, notifications and admin.",
    highlights: [
      "Built a quote engine for 17 insurance products that runs the official premium workbooks on a worker thread with a bounded queue and hang recovery, verified by parity tests against the source's own values.",
      "Delivered benefit illustrations for all 17 products from one shared layout that drives both the web view and the PDF, so their wording cannot drift apart.",
      "Made quotes, PDF export and training videos work offline as a PWA, using AES-GCM encrypted device storage, per-account keys, time-limited access and a server kill switch.",
      "Built a RAG knowledge assistant with hybrid search (PostgreSQL full-text and pgvector), SSE streaming, PDF and PPTX ingestion with vision extraction, PII redaction and a 64-question evaluation suite.",
      "Secured the platform with Argon2, passkeys, rotating JWT sessions with reuse detection, CSRF protection, CSP, automated role-access audits and an authenticated file proxy that keeps protected URLs from clients potentially sharing them outside.",
      "Built CI/CD with zero-downtime releases, a backup before every migration, one-command rollback, and Trivy and npm audit gates. Run hourly off-site backups with automated restore drills.",
      "Maintain 4,600+ automated tests, including Playwright E2E, plus k6 load testing and Sentry error monitoring with data scrubbing.",
    ],
    technologies: ["NestJS", "React", "PostgreSQL", "Redis", "Docker", "Nginx", "AWS"],
  },
  {
    role: "Freelance Software Engineer",
    company: "Retail Distributor Client",
    location: "Remote",
    date: "APR 2026 - PRESENT",
    description:
      "Built a field-sales activity app used by six managers to monitor territories and follow up on opportunities. Enabled a rediscovered activity to become a 125 million rupiah sale within two weeks of adoption.",
    technologies: ["Next.js", "Supabase", "PostgreSQL", "Analytics"],
  },
];

export const project = {
  name: "CapyHub",
  description: "Badminton match-management platform with real-time updates and printable match sheets.",
  technologies: ["Next.js", "PostgreSQL", "Recharts", "Vercel"],
  achievements: [
    "Spearheaded the development a full-stack match management platform with secure admin-only login that is used as the coordination tool for a local badminton club for 217 players, 67 matches, and 182+ hours of play tracked in one place since 2025, open-sourced so our member can contribute to this platform.",
    "Real-time data flow using Supabase Realtime (Postgres change events) feeding an SWR cache layer, player rosters, play counts, and match history sync across the dashboard without manual refreshes.",
    "Built the 2v2 court management flow system, including a randomizer that auto-assigns players to courts. Every finished game is recorded and builds up each player's play count automatically.",
    "Match statuses update automatically as matches progress, with a daily automated cron job on Vercel as a backup.",
    "Designed a printable PDF export system using jsPDF to generate formatted match sheets, allowing on-court coordinators to manually track player attendance and tally player games.",
  ],
  liveUrl: "https://capybara-dashboard.vercel.app/",
  githubUrl: "https://github.com/fernandwill/capybara-dashboard",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/fernandwill" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/fernandwill/" },
];

export const contact = {
  email: "fernandwilliam23@gmail.com",
  linkedin: "https://www.linkedin.com/in/fernandwill/",
  github: "https://github.com/fernandwill",
  location: "Medan, Indonesia (GMT+7)",
};
