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
  technologies: string[];
};

export const navItems: NavItem[] = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
];

export const metrics = [
  { value: "125M+ IDR", label: "sales impact delivered" },
  { value: "10.000", label: "active sales reps enabled" },
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
  { label: "GCP", icon: siGooglecloud },
];

export const experiences: ExperienceEntry[] = [
  {
    role: "Technical Co-Founder",
    company: "Confidential Venture",
    location: "U.S.-registered / Fully remote from Indonesia",
    date: "SEP 2026 - PRESENT",
    description:
      "Technical co-founder at a U.S.-registered company. Further details are confidential under NDA.",
    technologies: [],
  },
  {
    role: "Founding Engineer",
    company: "PRUaini Group",
    location: "Medan, Indonesia (Hybrid)",
    date: "JAN 2025 - PRESENT",
    description:
      "Led a three-person team delivering a Next.js, React, and PostgreSQL sales portal on Google Cloud for 500 sales reps across Indonesia.",
    technologies: ["Next.js", "React", "PostgreSQL", "GCP", "Vercel"],
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
  availability: "Available for full-time roles",
};
