import { describe, expect, it } from "vitest";
import { introFrame } from "../lib/ascii-loading";

describe("ASCII loading screen animation frames", () => {
  it.each([
    [false, 64, 27],
    [true, 28, 22],
  ] as const)("keeps compact=%s frames within a fixed %dx%d printable-ASCII grid", (compact, columns, rows) => {
    for (const progress of [0, 0.08, 0.2, 0.45, 0.7, 0.9, 1]) {
      const frame = introFrame(progress, compact);
      const lines = frame.split("\n");
      expect(lines).toHaveLength(rows);
      expect(lines.every((line) => line.length === columns)).toBe(true);
      expect(frame).not.toMatch(/[^\x20-\x7e\n]/);
      expect( lines[0]).toBe(`+${"-".repeat(columns - 2)}+`);
      expect(lines[lines.length - 1]).toBe(`+${"-".repeat(columns - 2)}+`);
    }
  });

  it("animates the workspace, monitor prompt, capybara, and progress bar from 0% to 100%", () => {
    const start = introFrame(0);
    const quarter = introFrame(0.25);
    const half = introFrame(0.5);
    const threeQuarter = introFrame(0.75);
    const done = introFrame(1);

    expect(start).toContain("  0%");
    expect(quarter).toContain(" 25%");
    expect(half).toContain(" 50%");
    expect(threeQuarter).toContain(" 75%");
    expect(done).toContain("100%");

    expect(start).not.toBe(quarter);
    expect(quarter).not.toBe(half);
    expect(half).not.toBe(threeQuarter);
    expect(threeQuarter).not.toBe(done);

    expect(done).toContain("|___ |___ |__/");
    expect(done).toContain("> ready_");
    expect(done).toContain(".------( o  .)");
  });

  it("animates the compact phone frame deterministically from 0% to 100%", () => {
    const start = introFrame(0, true);
    const mid = introFrame(0.5, true);
    const done = introFrame(1, true);

    expect(start).toContain("  0%");
    expect(mid).toContain(" 50%");
    expect(done).toContain("100%");
    expect(start).not.toBe(mid);
    expect(mid).not.toBe(done);
    expect(done).toContain("|___ | | |");
  });
});
