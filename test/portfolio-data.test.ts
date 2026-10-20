import { describe, expect, it } from "vitest";
import { experiences, navItems, project, stack } from "../lib/portfolio-data";

describe("portfolio content contract", () => {
  it("contains the recruiter-facing navigation and proof", () => {
    expect(navItems.map((item) => item.id)).toEqual(["about", "experience", "projects"]);
    expect(experiences[0]).toMatchObject({
      role: "Technical Co-Founder",
      company: "Confidential Venture",
      location: "U.S.-registered / Fully remote from Indonesia",
      date: "SEP 2026 - PRESENT",
      technologies: [],
    });
    expect(experiences[0].description).toContain("NDA");
    expect(experiences[1]).toMatchObject({ role: "Founding Engineer", company: "PRUaini Group" });
    expect(experiences[1].description).toContain("500 sales reps");
    expect(experiences[2].description).toContain("125 million rupiah sale");
    expect(experiences[2].technologies).toEqual(["Next.js", "Supabase", "PostgreSQL", "Analytics"]);
  });

  it("keeps the requested current stack", () => {
    expect(stack.map((item) => item.label)).toEqual([
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Python",
      "FastAPI",
      "NestJS",
      "Java Springboot",
      "PostgreSQL",
      "Redis",
      "Docker",
      "GCP",
    ]);
  });

  it("exposes safe project destinations", () => {
    expect(project.liveUrl).toMatch(/^https:\/\//);
    expect(project.githubUrl).toMatch(/^https:\/\//);
  });
});
