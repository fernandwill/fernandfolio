import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/portfolio-data", () => import("../lib/portfolio-data"));
vi.mock("@/lib/ascii-desk", () => import("../lib/ascii-desk"));
vi.mock("@/components/ascii-intro", () => import("../components/ascii-intro"));
vi.mock("@/components/page-intro", () => import("../components/page-intro"));
vi.mock("@/components/ascii-steam", () => import("../components/ascii-steam"));
vi.mock("@/lib/ascii-steam", () => import("../lib/ascii-steam"));
vi.mock("@/components/ascii-confetti", () => import("../components/ascii-confetti"));
vi.mock("@/lib/ascii-confetti", () => import("../lib/ascii-confetti"));

import HomePage from "../app/page";
import { contact, experiences, metrics, project, stack } from "../lib/portfolio-data";
import { deskWide, deskSmall } from "../lib/ascii-desk";

const html = () => renderToStaticMarkup(createElement(HomePage));

describe("Paper-and-ink portfolio", () => {
  it.each([
    ["desktop desk", deskWide, 64],
    ["phone desk", deskSmall, 28],
  ] as const)("keeps the %s readable within its character budget", (_, art, columns) => {
    expect(art.split("\n").length).toBeGreaterThan(5);
    expect(art.split("\n").every((line) => line.length <= columns)).toBe(true);
    expect(art).not.toMatch(/[^\x20-\x7e\n]/);
  });

  it("renders responsive character artwork without image or animation dependencies", () => {
    const markup = html();
    expect(markup).toContain('class="desk-art desk-wide"');
    expect(markup).toContain('class="desk-art desk-small"');
    expect(markup).toContain("An ASCII workspace");
    expect(markup).not.toMatch(/<(img|svg|canvas|video)\b/);
    expect(markup).not.toMatch(/[^\x00-\x7f]/);
    expect(markup).toContain('[ skip intro ]');
    expect(markup).not.toContain('data-phase="drawing"');
    expect(markup).not.toMatch(/<dialog[^>]*\bopen(?:=|\s|>)/);
    expect(markup).not.toContain("NORD / PORTFOLIO");
  });

  it.each([
    ["desk-wide", deskWide],
    ["desk-small", deskSmall],
  ] as const)("overlays a steam block in %s without changing the desk or cup", (className, art) => {
    const markup = html();
    const drawing = markup.match(new RegExp(`<div class="desk-art ${className}">(<pre[\\s\\S]*?</pre>)`))?.[1];
    expect(drawing?.match(/class="desk-steam-block"/g)).toHaveLength(1);
    expect(drawing?.replace(/<span class="desk-steam-block"[\s\S]*<\/span><\/pre>$/, "</pre>"))
      .toBe(renderToStaticMarkup(createElement("pre", { "aria-hidden": true }, art)));
  });

  it("places the confetti figures below the footer links", () => {
    const markup = html();
    expect(markup).toMatch(/<footer>[\s\S]*back to top[\s\S]*class="confetti-scene"[\s\S]*<\/footer>/);
    expect(markup.match(/class="confetti-person"/g)).toHaveLength(2);
    expect(markup).not.toContain("Animate confetti");
  });

  it("keeps identity and impact available in the initial HTML", () => {
    const markup = html();
    expect(markup).toContain("Fernand William Citra");
    for (const metric of metrics) expect(markup).toContain(metric.value);
    expect(markup).toContain('id="main-content"');
    expect(markup).toContain('href="#main-content"');
    expect(markup.indexOf('<dialog class="page-intro"')).toBeLessThan(markup.indexOf('class="portfolio-shell"'));
  });

  it("keeps the main content free of a focus frame", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
    expect(css).not.toMatch(/main:focus-visible[^{]*\{[^}]*outline/);
    expect(css).toMatch(/main:focus\s*\{[^}]*outline:\s*none/);
    expect(html()).toMatch(/<main id="main-content" tabindex="-1"/);
  });

  it("preserves accessible navigation and contact destinations", () => {
    const markup = html();
    for (const id of ["about", "projects", "experience", "contact"]) {
      expect(markup).toContain(`id="${id}"`);
      expect(markup).toContain(`href="#${id}"`);
    }
    for (const href of [`mailto:${contact.email}`, contact.github, contact.linkedin, project.liveUrl, project.githubUrl]) {
      expect(markup).toContain(`href="${href}"`);
    }
    expect(markup).toContain('aria-label="Main navigation"');
  });

  it("preserves experience, technologies, and complete project notes", () => {
    const markup = html();
    for (const entry of experiences) {
      expect(markup).toContain(entry.company);
      expect(markup).toContain(entry.role);
      expect(markup).toContain(entry.description);
    }
    for (const item of stack) expect(markup).toContain(item.label);
    expect(markup).toContain("<details");
    expect(markup.match(/class="project-note"/g)).toHaveLength(project.achievements.length);
    expect(markup).toContain('aria-hidden="true"');
  });
});
