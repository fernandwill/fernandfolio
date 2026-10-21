import { describe, expect, it } from "vitest";
import {
  capybaraArt,
  capybaraFrame,
  createCapybaraState,
  stepCapybara,
} from "../lib/ascii-capybara";

describe("ASCII capybara art and movement", () => {
  it("keeps all capybara frames within a fixed printable-ASCII grid", () => {
    expect(capybaraArt).toBe(capybaraFrame());
    for (const facing of ["right", "left"] as const) {
      for (const following of [false, true]) {
        for (const step of [0, 1, 2] as const) {
          const frame = capybaraFrame({ facing, following, step });
          const lines = frame.split("\n");
          expect(lines).toHaveLength(5);
          expect(lines.every((line) => line.length === 16)).toBe(true);
          expect(frame).not.toMatch(/[^\x20-\x7e\n]/);
        }
      }
    }
  });

  it("changes stride, facing direction, and alert expression across states", () => {
    const rightIdle = capybaraFrame({ facing: "right", following: false, step: 0 });
    const rightStrideA = capybaraFrame({ facing: "right", following: false, step: 1 });
    const rightStrideB = capybaraFrame({ facing: "right", following: false, step: 2 });
    const leftIdle = capybaraFrame({ facing: "left", following: false, step: 0 });
    const rightFollowing = capybaraFrame({ facing: "right", following: true, step: 0 });

    expect(rightStrideA).not.toBe(rightIdle);
    expect(rightStrideB).not.toBe(rightStrideA);
    expect(leftIdle).not.toBe(rightIdle);
    expect(rightFollowing).not.toBe(rightIdle);
    expect(rightFollowing).toContain("*");
  });

  it("roams autonomously within viewport bounds and pauses between waypoints", () => {
    const bounds = { width: 800, height: 600 };
    let state = createCapybaraState(bounds);
    const initialX = state.x;
    const initialY = state.y;

    state = stepCapybara(state, 0.5, bounds);
    expect(state.moving).toBe(true);
    expect(Math.hypot(state.x - initialX, state.y - initialY)).toBeGreaterThan(10);

    for (let i = 0; i < 60; i++) {
      state = stepCapybara(state, 0.25, bounds);
      expect(state.x).toBeGreaterThanOrEqual(16);
      expect(state.x).toBeLessThanOrEqual(bounds.width - 16);
      expect(state.y).toBeGreaterThanOrEqual(16);
      expect(state.y).toBeLessThanOrEqual(bounds.height - 16);
    }
  });

  it("runs toward the cursor when following and settles once it arrives", () => {
    const bounds = { width: 800, height: 600 };
    let state = {
      ...createCapybaraState(bounds),
      x: 100,
      y: 200,
      following: true,
      targetX: 400,
      targetY: 200,
    };

    state = stepCapybara(state, 0.5, bounds);
    expect(state.moving).toBe(true);
    expect(state.facing).toBe("right");
    expect(state.x).toBeGreaterThan(100);

    for (let i = 0; i < 20; i++) {
      state = stepCapybara(state, 0.2, bounds);
    }
    expect(state.moving).toBe(false);
    expect(state.x).toBe(400);
    expect(state.y).toBe(200);

    state = stepCapybara({ ...state, targetX: 120 }, 0.5, bounds);
    expect(state.moving).toBe(true);
    expect(state.facing).toBe("left");
    expect(state.x).toBeLessThan(400);
  });
});
