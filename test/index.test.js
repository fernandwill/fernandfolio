const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const test = require("node:test");

const html = readFileSync(resolve(__dirname, "..", "index.html"), "utf8");
const css = readFileSync(resolve(__dirname, "..", "css", "styles.css"), "utf8");

test("presents recruiter-facing identity and proof", () => {
  assert.match(html, /<h1[^>]*>\s*Fernand William Citra\s*<\/h1>/);
  assert.match(html, /Founding Engineer\s*\|\s*Full Stack Software Engineer/);
  assert.match(html, /500 sales reps/);
  assert.match(html, /125 million rupiah sale within two weeks/);
});

test("provides the planned portfolio sections", () => {
  ["about", "skills", "experience", "projects", "education", "contact"].forEach((sectionId) => {
    assert.match(html, new RegExp(`<section id="${sectionId}"`));
  });

  assert.match(html, /<details class="md:hidden"/);
});

test("supports safe external links and reduced motion", () => {
  const externalLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((match) => match[0]);

  assert.ok(externalLinks.length > 0);
  externalLinks.forEach((link) => {
    assert.match(link, /rel="noopener noreferrer"/);
  });

  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(html, /data-reveal/);
});
