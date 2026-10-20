import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({
  effect: undefined as (() => void | (() => void)) | undefined,
  node: { textContent: "" },
}));
vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { hooks.effect = effect; },
  useRef: () => ({ current: hooks.node }),
}));
vi.mock("@/lib/ascii-steam", () => import("../lib/ascii-steam"));
import { AsciiSteam } from "../components/ascii-steam";
import { steamFrame } from "../lib/ascii-steam";

let onVisibility: (entries: { isIntersecting: boolean }[]) => void;
let motion: EventTarget & { matches: boolean };
let page: EventTarget & { hidden: boolean };
let cleanup: void | (() => void);
let clock = 0;
let nextFrame = 0;
const frames = new Map<number, FrameRequestCallback>();
const disconnect = vi.fn();
const paint = vi.fn();

function mount(compact = false) {
  hooks.node.textContent = steamFrame(0, compact);
  paint.mockClear();
  AsciiSteam({ compact });
  cleanup = hooks.effect?.();
}
function step(now: number) {
  clock = now;
  const callbacks = [...frames.values()];
  frames.clear();
  for (const callback of callbacks) callback(now);
}

beforeEach(() => {
  clock = 0;
  nextFrame = 0;
  frames.clear();
  let text = "";
  hooks.node = { get textContent() { return text; }, set textContent(value: string) { text = value; paint(value); } };
  motion = Object.assign(new EventTarget(), { matches: false });
  page = Object.assign(new EventTarget(), { hidden: false });
  vi.stubGlobal("document", page);
  vi.stubGlobal("window", { matchMedia: () => motion });
  vi.spyOn(performance, "now").mockImplementation(() => clock);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => { frames.delete(id); });
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: typeof onVisibility) { onVisibility = callback; }
    observe() {}
    disconnect = disconnect;
  });
});
afterEach(() => {
  cleanup?.();
  cleanup = undefined;
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Coffee steam animation lifecycle", () => {
  it.each([false, true])("server-renders a static compact=%s character block", (compact) => {
    const markup = renderToStaticMarkup(createElement(AsciiSteam, { compact }));
    expect(markup).toContain('class="desk-steam-block" aria-hidden="true"');
    expect(markup).toContain(steamFrame(0, compact));
    expect(markup).not.toMatch(/<(canvas|img|svg)\b/);
  });

  it("starts only in view and caps painting at about 60 frames per second", () => {
    mount();
    expect(frames.size).toBe(0);
    onVisibility([{ isIntersecting: true }]);
    expect(frames.size).toBe(1);
    step(0);
    step(4);
    step(8);
    expect(paint).toHaveBeenCalledTimes(1);
    step(17);
    expect(paint).toHaveBeenCalledTimes(2);
    for (let now = 34; now < 500; now += 17) step(now);
    expect(hooks.node.textContent).not.toBe(steamFrame(0));
    expect(frames.size).toBe(1);
  });

  it("stops when offscreen or hidden and resumes without duplicate loops", () => {
    mount();
    onVisibility([{ isIntersecting: true }]);
    onVisibility([{ isIntersecting: true }]);
    expect(frames.size).toBe(1);
    onVisibility([{ isIntersecting: false }]);
    expect(frames.size).toBe(0);
    onVisibility([{ isIntersecting: true }]);
    page.hidden = true;
    page.dispatchEvent(new Event("visibilitychange"));
    expect(frames.size).toBe(0);
    page.hidden = false;
    page.dispatchEvent(new Event("visibilitychange"));
    expect(frames.size).toBe(1);
  });

  it("honors reduced motion initially and when the preference changes", () => {
    motion.matches = true;
    mount(true);
    onVisibility([{ isIntersecting: true }]);
    expect(frames.size).toBe(0);
    motion.matches = false;
    motion.dispatchEvent(new Event("change"));
    expect(frames.size).toBe(1);
    step(500);
    motion.matches = true;
    motion.dispatchEvent(new Event("change"));
    expect(frames.size).toBe(0);
    expect(hooks.node.textContent).toBe(steamFrame(0, true));
  });

  it("cancels frames, observers, and listeners on unmount", () => {
    mount();
    onVisibility([{ isIntersecting: true }]);
    cleanup?.();
    cleanup = undefined;
    expect(frames.size).toBe(0);
    expect(disconnect).toHaveBeenCalledOnce();
    motion.dispatchEvent(new Event("change"));
    page.dispatchEvent(new Event("visibilitychange"));
    expect(frames.size).toBe(0);
  });

  it("keeps static steam if IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    mount();
    expect(frames.size).toBe(0);
    expect(hooks.node.textContent).toBe(steamFrame(0));
  });
});
