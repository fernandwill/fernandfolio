import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({
  effect: undefined as (() => void | (() => void)) | undefined,
  scene: { dataset: {} as Record<string, string> },
}));
vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { hooks.effect = effect; },
  useRef: () => ({ current: hooks.scene }),
}));
vi.mock("@/lib/ascii-confetti", () => import("../lib/ascii-confetti"));
import { AsciiConfetti } from "../components/ascii-confetti";
import { kneelingPerson } from "../lib/ascii-confetti";

let onVisibility: (entries: { isIntersecting: boolean }[]) => void;
let cleanup: void | (() => void);
const observe = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
  hooks.scene.dataset = {};
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: typeof onVisibility) { onVisibility = callback; }
    observe = observe;
    disconnect = disconnect;
  });
});
afterEach(() => {
  cleanup?.();
  cleanup = undefined;
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

function mount() {
  AsciiConfetti();
  cleanup = hooks.effect?.();
}

describe("ASCII footer confetti", () => {
  it("keeps the kneeling person inside a small ASCII character budget", () => {
    expect(kneelingPerson).not.toMatch(/[^\x20-\x7e\n]/);
    expect(kneelingPerson.split("\n")).toHaveLength(9);
    expect(kneelingPerson.split("\n").every((line) => line.length <= 12)).toBe(true);
  });

  it("renders two decorative figures and ribbons without controls", () => {
    const markup = renderToStaticMarkup(createElement(AsciiConfetti));
    expect(markup.match(/class="confetti-person"/g)).toHaveLength(2);
    expect(markup.match(/class="confetti-ribbon"/g)).toHaveLength(12);
    expect(markup).toContain('class="confetti-stage" aria-hidden="true"');
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("Animate confetti");
    expect(markup).not.toContain("data-ready");
    expect(markup).not.toMatch(/<(canvas|img|svg)\b/);
  });

  it("only runs ribbons while the scene is visible", () => {
    mount();
    expect(observe).toHaveBeenCalledWith(hooks.scene);
    expect(hooks.scene.dataset.ready).toBe("true");
    expect(hooks.scene.dataset.visible).toBeUndefined();
    onVisibility([{ isIntersecting: true }]);
    expect(hooks.scene.dataset.visible).toBe("true");
    onVisibility([{ isIntersecting: false }]);
    expect(hooks.scene.dataset.visible).toBe("false");
  });

  it("disconnects the observer and restores static artwork on unmount", () => {
    mount();
    onVisibility([{ isIntersecting: true }]);
    cleanup?.();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(hooks.scene.dataset).toEqual({});
    cleanup = undefined;
  });

  it("keeps a static scene if IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    expect(mount).not.toThrow();
    expect(hooks.scene.dataset).toEqual({});
    expect(observe).not.toHaveBeenCalled();
  });
});
