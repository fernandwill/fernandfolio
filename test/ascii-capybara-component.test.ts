import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({
  effect: undefined as (() => void | (() => void)) | undefined,
  button: undefined as (EventTarget & {
    dataset: Record<string, string>;
    style: { transform: string };
    setAttribute: (name: string, value: string) => void;
    getAttribute: (name: string) => string | null;
    querySelector: () => { textContent: string };
  }) | undefined,
  art: { textContent: "" },
}));

vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { hooks.effect = effect; },
  useRef: () => ({ current: hooks.button }),
}));
vi.mock("@/lib/ascii-capybara", () => import("../lib/ascii-capybara"));

import { AsciiCapybara } from "../components/ascii-capybara";
import { capybaraArt, capybaraFrame } from "../lib/ascii-capybara";

let motion: EventTarget & { matches: boolean };
let page: EventTarget & { hidden: boolean };
let win: EventTarget & { innerWidth: number; innerHeight: number; matchMedia: () => typeof motion };
let cleanup: void | (() => void);
let clock = 0;
let nextFrame = 0;
const frames = new Map<number, FrameRequestCallback>();

function mount() {
  AsciiCapybara();
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
  hooks.art = { textContent: capybaraArt };
  const attrs = new Map<string, string>([["aria-pressed", "false"]]);
  hooks.button = Object.assign(new EventTarget(), {
    dataset: {},
    style: { transform: "" },
    setAttribute: (name: string, value: string) => { attrs.set(name, value); },
    getAttribute: (name: string) => attrs.get(name) ?? null,
    querySelector: () => hooks.art,
  });
  motion = Object.assign(new EventTarget(), { matches: false });
  page = Object.assign(new EventTarget(), { hidden: false });
  win = Object.assign(new EventTarget(), {
    innerWidth: 960,
    innerHeight: 640,
    matchMedia: () => motion,
  });
  vi.stubGlobal("document", page);
  vi.stubGlobal("window", win);
  vi.spyOn(performance, "now").mockImplementation(() => clock);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => { frames.delete(id); });
});

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Interactive ASCII capybara component", () => {
  it("server-renders an accessible toggle button with ASCII capybara art", () => {
    const markup = renderToStaticMarkup(createElement(AsciiCapybara));
    expect(markup).toContain('class="ascii-capybara"');
    expect(markup).toContain('type="button"');
    expect(markup).toContain('aria-label="ASCII capybara"');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).toContain(renderToStaticMarkup(createElement("pre", { "aria-hidden": true }, capybaraArt)));
    expect(markup).not.toMatch(/<(canvas|img|svg|video)\b/);
  });

  it("roams around the viewport and animates its stride frames", () => {
    mount();
    expect(hooks.button?.dataset.ready).toBe("true");
    expect(hooks.button?.dataset.following).toBe("false");
    expect(frames.size).toBe(1);
    const initialTransform = hooks.button?.style.transform;

    for (let now = 17; now <= 340; now += 17) step(now);
    expect(hooks.button?.style.transform).not.toBe(initialTransform);
    expect(hooks.button?.dataset.moving).toBe("true");
  });

  it("toggles cursor following on click and tracks pointer movement", () => {
    mount();
    hooks.button?.dispatchEvent(Object.assign(new Event("click"), { clientX: 500, clientY: 300 }));
    expect(hooks.button?.getAttribute("aria-pressed")).toBe("true");
    expect(hooks.button?.dataset.following).toBe("true");
    expect(hooks.art.textContent).toContain("*");

    win.dispatchEvent(Object.assign(new Event("pointermove"), { clientX: 700, clientY: 220 }));
    const beforeFollow = hooks.button?.style.transform;
    for (let now = 17; now <= 500; now += 17) step(now);
    expect(hooks.button?.style.transform).not.toBe(beforeFollow);
    expect(hooks.button?.dataset.facing).toBe("right");

    hooks.button?.dispatchEvent(new Event("click"));
    expect(hooks.button?.getAttribute("aria-pressed")).toBe("false");
    expect(hooks.button?.dataset.following).toBe("false");
  });

  it("pauses when hidden or when reduced motion is enabled and cleans up on unmount", () => {
    mount();
    expect(frames.size).toBe(1);

    page.hidden = true;
    page.dispatchEvent(new Event("visibilitychange"));
    expect(frames.size).toBe(0);

    page.hidden = false;
    page.dispatchEvent(new Event("visibilitychange"));
    expect(frames.size).toBe(1);

    motion.matches = true;
    motion.dispatchEvent(new Event("change"));
    expect(frames.size).toBe(0);
    expect(hooks.art.textContent).toBe(capybaraFrame({ facing: "right", following: false, step: 0 }));

    motion.matches = false;
    motion.dispatchEvent(new Event("change"));
    expect(frames.size).toBe(1);

    cleanup?.();
    cleanup = undefined;
    expect(frames.size).toBe(0);
  });
});
