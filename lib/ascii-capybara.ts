export type CapybaraFacing = "left" | "right";
export type CapybaraStep = 0 | 1 | 2;

export interface CapybaraFrameOptions {
  facing?: CapybaraFacing;
  following?: boolean;
  step?: CapybaraStep;
}

export interface CapybaraBounds {
  width: number;
  height: number;
}

export interface CapybaraState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  facing: CapybaraFacing;
  following: boolean;
  moving: boolean;
  pauseRemaining: number;
  strideTime: number;
  waypointIndex: number;
}

export const CAPYBARA_WIDTH = 136;
export const CAPYBARA_HEIGHT = 88;
const VIEWPORT_MARGIN = 16;
const ROAM_SPEED = 96;
const FOLLOW_SPEED = 220;
const ROAM_PAUSE = 1.1;

const legsByStep: Record<CapybaraStep, string> = {
  0: " |_| '---' |_|  ",
  1: "/_/  '---'  \\_\\ ",
  2: " \\_\\ '---' /_/  ",
};

const mirrorMap: Record<string, string> = {
  "(": ")",
  ")": "(",
  "/": "\\",
  "\\": "/",
  "<": ">",
  ">": "<",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
};

function mirrorLine(line: string): string {
  return Array.from(line)
    .reverse()
    .map((char) => mirrorMap[char] ?? char)
    .join("");
}

export function capybaraFrame(options: CapybaraFrameOptions = {}): string {
  const { facing = "right", following = false, step = 0 } = options;
  const lines = [
    following ? "        * n____ " : "          n____ ",
    following ? "  .------( o  .)" : "  .------( -  .)",
    " /        '---' ",
    "(   _     _   ) ",
    legsByStep[step],
  ];
  return (facing === "left" ? lines.map(mirrorLine) : lines).join("\n");
}

export const capybaraArt = capybaraFrame();

export function clampCapybaraTarget(
  x: number,
  y: number,
  bounds: CapybaraBounds,
): { x: number; y: number } {
  const maxX = Math.max(VIEWPORT_MARGIN, bounds.width - CAPYBARA_WIDTH - VIEWPORT_MARGIN);
  const maxY = Math.max(VIEWPORT_MARGIN, bounds.height - CAPYBARA_HEIGHT - VIEWPORT_MARGIN);
  return {
    x: Math.min(maxX, Math.max(VIEWPORT_MARGIN, Math.round(x))),
    y: Math.min(maxY, Math.max(VIEWPORT_MARGIN, Math.round(y))),
  };
}

function waypointForIndex(index: number, bounds: CapybaraBounds): { x: number; y: number } {
  const maxX = Math.max(VIEWPORT_MARGIN, bounds.width - CAPYBARA_WIDTH - VIEWPORT_MARGIN);
  const maxY = Math.max(VIEWPORT_MARGIN, bounds.height - CAPYBARA_HEIGHT - VIEWPORT_MARGIN);
  const rx = ((index * 0.6180339887) % 1 + 1) % 1;
  const ry = ((index * 0.3819660113 + 0.25) % 1 + 1) % 1;
  return {
    x: Math.round(VIEWPORT_MARGIN + rx * (maxX - VIEWPORT_MARGIN)),
    y: Math.round(VIEWPORT_MARGIN + ry * (maxY - VIEWPORT_MARGIN)),
  };
}

export function createCapybaraState(bounds: CapybaraBounds): CapybaraState {
  const start = clampCapybaraTarget(24, bounds.height - CAPYBARA_HEIGHT - 24, bounds);
  const firstTarget = waypointForIndex(1, bounds);
  return {
    x: start.x,
    y: start.y,
    targetX: firstTarget.x,
    targetY: firstTarget.y,
    facing: firstTarget.x < start.x ? "left" : "right",
    following: false,
    moving: true,
    pauseRemaining: 0,
    strideTime: 0,
    waypointIndex: 1,
  };
}

export function stepCapybara(
  state: CapybaraState,
  dt: number,
  bounds: CapybaraBounds,
): CapybaraState {
  const clampedCurrent = clampCapybaraTarget(state.x, state.y, bounds);
  if (!state.following && state.pauseRemaining > 0) {
    const remaining = Math.max(0, state.pauseRemaining - dt);
    if (remaining > 0) {
      return {
        ...state,
        x: clampedCurrent.x,
        y: clampedCurrent.y,
        moving: false,
        pauseRemaining: remaining,
      };
    }
    const nextIndex = state.waypointIndex + 1;
    const nextTarget = waypointForIndex(nextIndex, bounds);
    return {
      ...state,
      x: clampedCurrent.x,
      y: clampedCurrent.y,
      targetX: nextTarget.x,
      targetY: nextTarget.y,
      facing: nextTarget.x < clampedCurrent.x ? "left" : "right",
      moving: true,
      pauseRemaining: 0,
      waypointIndex: nextIndex,
    };
  }

  const target = clampCapybaraTarget(state.targetX, state.targetY, bounds);
  const dx = target.x - clampedCurrent.x;
  const dy = target.y - clampedCurrent.y;
  const distance = Math.hypot(dx, dy);
  const stopThreshold = state.following ? 4 : 3;

  if (distance <= stopThreshold) {
    return {
      ...state,
      x: target.x,
      y: target.y,
      targetX: target.x,
      targetY: target.y,
      moving: false,
      pauseRemaining: state.following ? 0 : ROAM_PAUSE,
    };
  }

  const speed = state.following ? FOLLOW_SPEED : ROAM_SPEED;
  const travel = Math.min(distance, speed * dt);
  const nextX = clampedCurrent.x + (dx / distance) * travel;
  const nextY = clampedCurrent.y + (dy / distance) * travel;
  const facing: CapybaraFacing = Math.abs(dx) > 1 ? (dx < 0 ? "left" : "right") : state.facing;

  return {
    ...state,
    x: nextX,
    y: nextY,
    targetX: target.x,
    targetY: target.y,
    facing,
    moving: true,
    strideTime: state.strideTime + dt,
  };
}
