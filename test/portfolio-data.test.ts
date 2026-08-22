import { describe, expect, it } from "vitest";
import { experiences, navItems, project, stack } from "../lib/portfolio-data";

describe("portfolio content contract", () => {
  it("contains the recruiter-facing navigation and proof", () => {
    expect(navItems.map((item) => item.id)).toEqual(["about", "experience", "projects"]);
    expect(experiences[0]).toMatchObject({ role: "Founding Engineer", company: "PRUaini Group" });
    expect(experiences[0].description).toContain("500 sales reps");
    expect(experiences[1].description).toContain("125 million rupiah sale");
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
