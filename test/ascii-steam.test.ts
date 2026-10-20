import { describe, expect, it } from "vitest";
import { steamFrame } from "../lib/ascii-steam";

describe("ASCII steam field", () => {
  it.each([
    [false, 16, 8],
    [true, 12, 4],
  ] as const)("keeps compact=%s frames within the cup's fixed character block", (compact, columns, rows) => {
    for (const seconds of [0, 0.017, 0.5, 3, 60, 3600]) {
      const frame = steamFrame(seconds, compact);
      expect(frame.split("\n")).toHaveLength(rows);
      expect(frame.split("\n").every((line) => line.length === columns)).toBe(true);
      expect(frame).not.toMatch(/[^ .,:;~\n]/);
      expect(frame.trim()).not.toBe("");
    }
  });

  it("flows over time without random flicker or non-deterministic initial markup", () => {
    expect(steamFrame(0)).toBe(steamFrame(0));
    expect(steamFrame(0)).not.toBe(steamFrame(0.5));
    expect(steamFrame(1, true)).not.toBe(steamFrame(2, true));
  });
});
