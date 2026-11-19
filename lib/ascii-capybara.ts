export type CapybaraFacing = "left" | "right";
export type CapybaraStep = 0 | 1 | 2 | 3 | 4;

export interface CapybaraFrameOptions {
  facing?: CapybaraFacing;
  following?: boolean;
  step?: CapybaraStep;
}

export interface CapybaraPoint {
  x: number;
  y: number;
}

export interface CapybaraBounds {
  width: number;
  height: number;
  column?: { left: number; right: number };
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

export const CAPYBARA_WIDTH = 280;
export const CAPYBARA_HEIGHT = 172;
const VIEWPORT_MARGIN = 16;
const ROAM_SPEED = 96;
const FOLLOW_SPEED = 220;
const ROAM_PAUSE = 1.1;

// Both passing poses of the walk cycle share one frame: the body lifts one dot while the legs pass under it.
const passingFrame = [
  "⠀⣀⠠⠤⠒⡛⢲⠫⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⡎⠰⠁⠀⠉⠋⠀⠀⠀⠑⠂⠤⢐⠒⠂⢉⠫⢍⢩⢁⠒⡢⢀⠀⠀⠀",
  "⢃⠒⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠔⠠⠐⠕⡑⡄⠀",
  "⠀⠉⠀⠒⠒⢦⡇⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⢀⠪⡘⡀",
  "⠀⠀⠀⠀⠀⠀⠹⡬⠌⡈⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠃",
  "⠀⠀⠀⠀⠀⠀⠀⠈⢲⠠⠀⡃⠀⠀⠀⠀⠀⢠⢸⡀⠀⢀⠄⢢⠎⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠈⡓⠂⡛⠑⠒⠒⠒⠒⢒⢀⡃⢐⣀⣘⠃⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⣃⢸⡇⠀⠀⠀⠀⠀⠈⢪⢀⣺⡅⢈⠆⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠶⡿⠤⠚⠁⠀⠀⠀⢀⣠⡤⢺⣥⠟⢡⠃⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀",
];

// Drawn facing left in Braille dots. Step 0 is the standing pose; steps 1-4 are a diagonal-pair walk cycle
// (legs swing in opposite pairs, the body lifts one dot on the passing frames).
const framesByStep: Record<CapybaraStep, readonly string[]> = {
  0: [
    "⠀⠀⢀⣀⠤⠿⢤⢖⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⡔⢩⠂⠀⠒⠗⠈⠀⠉⠢⠄⣀⠠⠤⠄⠒⢖⡒⢒⠂⠤⢄⠀⠀⠀⠀",
    "⠇⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠈⠀⠈⠈⡨⢀⠡⡪⠢⡀⠀",
    "⠈⠒⠀⠤⠤⣄⡆⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠢⠀⢕⠱⠀",
    "⠀⠀⠀⠀⠀⠈⢳⣐⡐⠐⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠁⠇",
    "⠀⠀⠀⠀⠀⠀⠀⠑⢤⢁⠀⠆⠀⠀⠀⠀⠀⢀⢰⠀⠀⠀⡀⢄⡜⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠘⡦⠄⡷⠢⠤⠤⠤⠤⢬⢈⡇⢠⣈⣰⠎⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⣃⢸⡇⠀⠀⠀⠀⠀⠈⢪⢀⣺⡅⢈⠆⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠶⡿⠤⠚⠁⠀⠀⠀⢀⣠⡤⢺⣥⠟⢡⠃⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀",
  ],
  1: [
    "⠀⠀⢀⣀⠤⠿⢤⢖⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⡔⢩⠂⠀⠒⠗⠈⠀⠉⠢⠄⣀⠠⠤⠄⠒⢖⡒⢒⠂⠤⢄⠀⠀⠀⠀",
    "⠇⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠈⠀⠈⠈⡨⢀⠡⡪⠢⡀⠀",
    "⠈⠒⠀⠤⠤⣄⡆⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠢⠀⢕⠱⠀",
    "⠀⠀⠀⠀⠀⠈⢳⣐⡐⠐⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠁⠇",
    "⠀⠀⠀⠀⠀⠀⠀⠑⢤⢁⠀⠆⠀⠀⠀⠀⠀⢀⢰⠀⠀⠀⡀⢄⡜⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠘⡦⠄⡷⠢⠤⠤⠤⠤⢬⢈⡇⢠⣈⣰⠎⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⢀⡃⣼⠃⠀⠀⠀⠀⠀⠈⠊⡄⣚⣥⠈⡢⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠴⡾⠧⠐⠋⠀⠀⠀⠀⠀⢀⣠⡴⢫⣼⠏⢸⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀",
  ],
  2: passingFrame,
  3: [
    "⠀⠀⢀⣀⠤⠿⢤⢖⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⡔⢩⠂⠀⠒⠗⠈⠀⠉⠢⠄⣀⠠⠤⠄⠒⢖⡒⢒⠂⠤⢄⠀⠀⠀⠀",
    "⠇⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠈⠀⠈⠈⡨⢀⠡⡪⠢⡀⠀",
    "⠈⠒⠀⠤⠤⣄⡆⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠢⠀⢕⠱⠀",
    "⠀⠀⠀⠀⠀⠈⢳⣐⡐⠐⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠁⠇",
    "⠀⠀⠀⠀⠀⠀⠀⠑⢤⢁⠀⠆⠀⠀⠀⠀⠀⢀⢰⠀⠀⠀⡀⢄⡜⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠘⡦⠄⡷⠢⠤⠤⠤⠤⢬⢈⡇⢠⣈⣰⠎⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢃⡘⣧⠀⠀⠀⠀⠀⠈⡎⣀⣾⠁⡨⠂⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠐⠾⡧⠴⠋⠀⠀⢀⣠⡤⢰⣯⠜⢫⠘⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  ],
  4: passingFrame,
};

const WALK_FRAME_SECONDS = 0.16;
const FOLLOWING_MARK_COLUMN = 10;
const BRAILLE_BASE = 0x2800;
// Braille dot bits: left column 1,2,3,7 and right column 4,5,6,8; mirroring swaps each pair.
const BRAILLE_COLUMN_PAIRS = [[0x01, 0x08], [0x02, 0x10], [0x04, 0x20], [0x40, 0x80]] as const;

function mirrorBraille(char: string): string {
  const code = char.codePointAt(0);
  if (code === undefined || code < BRAILLE_BASE || code > BRAILLE_BASE + 0xff) return char;
  const dots = code - BRAILLE_BASE;
  let mirrored = 0;
  for (const [left, right] of BRAILLE_COLUMN_PAIRS) {
    if (dots & left) mirrored |= right;
    if (dots & right) mirrored |= left;
  }
  return String.fromCodePoint(BRAILLE_BASE + mirrored);
}

function mirrorLine(line: string): string {
  return Array.from(line).reverse().map(mirrorBraille).join("");
}

export function capybaraWalkStep(strideTime: number): CapybaraStep {
  const steps = [1, 2, 3, 4] as const;
  return steps[Math.floor(strideTime / WALK_FRAME_SECONDS) % steps.length];
}

export function capybaraFrame(options: CapybaraFrameOptions = {}): string {
  const { facing = "right", following = false, step = 0 } = options;
  const lines = framesByStep[step].map((line, row) => row === 0 && following
    ? line.slice(0, FOLLOWING_MARK_COLUMN) + "*" + line.slice(FOLLOWING_MARK_COLUMN + 1)
    : line);
  return (facing === "right" ? lines.map(mirrorLine) : lines).join("\n");
}

export const capybaraArt = capybaraFrame();

export function clampCapybaraTarget(
  x: number,
  y: number,
  bounds: CapybaraBounds,
): CapybaraPoint {
  const maxX = Math.max(VIEWPORT_MARGIN, bounds.width - CAPYBARA_WIDTH - VIEWPORT_MARGIN);
  const maxY = Math.max(VIEWPORT_MARGIN, bounds.height - CAPYBARA_HEIGHT - VIEWPORT_MARGIN);
  return {
    x: Math.min(maxX, Math.max(VIEWPORT_MARGIN, Math.round(x))),
    y: Math.min(maxY, Math.max(VIEWPORT_MARGIN, Math.round(y))),
  };
}

// One lane only: switching gutters would walk the capybara across the text column.
function roamLane(bounds: CapybaraBounds): [number, number] | null {
  if (!bounds.column) return null;
  const left: [number, number] = [VIEWPORT_MARGIN, bounds.column.left - CAPYBARA_WIDTH - VIEWPORT_MARGIN];
  const right: [number, number] = [bounds.column.right + VIEWPORT_MARGIN, bounds.width - CAPYBARA_WIDTH - VIEWPORT_MARGIN];
  return [left, right].find(([min, max]) => max >= min) ?? null;
}

function waypointForIndex(index: number, bounds: CapybaraBounds): CapybaraPoint {
  const maxX = Math.max(VIEWPORT_MARGIN, bounds.width - CAPYBARA_WIDTH - VIEWPORT_MARGIN);
  const maxY = Math.max(VIEWPORT_MARGIN, bounds.height - CAPYBARA_HEIGHT - VIEWPORT_MARGIN);
  const rx = ((index * 0.6180339887) % 1 + 1) % 1;
  const ry = ((index * 0.3819660113 + 0.25) % 1 + 1) % 1;
  const [minLaneX, maxLaneX] = roamLane(bounds) ?? [VIEWPORT_MARGIN, maxX];
  return {
    x: Math.round(minLaneX + rx * (maxLaneX - minLaneX)),
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

export function retargetCapybara(state: CapybaraState, bounds: CapybaraBounds): CapybaraState {
  const current = clampCapybaraTarget(state.x, state.y, bounds);
  const nextIndex = state.waypointIndex + 1;
  const nextTarget = waypointForIndex(nextIndex, bounds);
  return {
    ...state,
    x: current.x,
    y: current.y,
    targetX: nextTarget.x,
    targetY: nextTarget.y,
    facing: nextTarget.x < current.x ? "left" : "right",
    moving: true,
    pauseRemaining: 0,
    waypointIndex: nextIndex,
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
    return retargetCapybara(state, bounds);
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
