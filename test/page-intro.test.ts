import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({
  effect: undefined as (() => void | (() => void)) | undefined,
  dialog: undefined as (EventTarget & {
    open: boolean;
    dataset: Record<string, string>;
    showModal?: () => void;
    close: () => void;
    querySelector: () => EventTarget;
  }) | undefined,
}));
vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { hooks.effect = effect; },
  useRef: () => ({ current: hooks.dialog }),
}));
vi.mock("@/lib/ascii-desk", () => import("../lib/ascii-desk"));
import { PageIntro } from "../components/page-intro";

let motion: EventTarget & { matches: boolean };
let storage: Map<string, string>;
let body: { style: { overflow: string } };
let skip: EventTarget;
let cleanup: void | (() => void);
const focus = vi.fn();
const showModal = vi.fn();
const sessionKey = "portfolio-page-intro-v1";

function mount() {
  PageIntro();
  cleanup = hooks.effect?.();
}

beforeEach(() => {
  vi.useFakeTimers();
  skip = new EventTarget();
  hooks.dialog = Object.assign(new EventTarget(), {
    open: false,
    dataset: {},
    showModal: () => { if (hooks.dialog) hooks.dialog.open = true; showModal(); },
    close: () => { if (hooks.dialog) hooks.dialog.open = false; },
    querySelector: () => skip,
  });
  motion = Object.assign(new EventTarget(), { matches: false });
  storage = new Map();
  body = { style: { overflow: "auto" } };
  vi.stubGlobal("window", { matchMedia: () => motion, location: { hash: "" }, scrollY: 0 });
  vi.stubGlobal("document", { body, activeElement: body, getElementById: () => ({ focus }) });
  vi.stubGlobal("sessionStorage", {
    getItem: (key: string) => storage.get(key),
    setItem: (key: string, value: string) => storage.set(key, value),
  });
});
afterEach(() => {
  cleanup?.();
  cleanup = undefined;
  vi.clearAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Full-screen page intro", () => {
  it("renders a closed, labelled native dialog with a skip button", () => {
    const markup = renderToStaticMarkup(createElement(PageIntro));
    expect(markup).toContain('<dialog class="page-intro"');
    expect(markup).toContain('aria-labelledby="page-intro-title"');
    expect(markup).not.toMatch(/<dialog[^>]*\bopen(?:=|\s|>)/);
    expect(markup).toContain('[ skip intro ]');
    expect(markup).toContain('class="intro-desk desk-wide"');
    expect(markup).toContain('class="intro-desk desk-small"');
  });

  it("draws the desk then crossfades before releasing the page and focus", () => {
    mount();
    expect(showModal).toHaveBeenCalledOnce();
    expect(hooks.dialog?.dataset.phase).toBe("drawing");
    expect(body.style.overflow).toBe("hidden");
    vi.advanceTimersByTime(1800);
    expect(hooks.dialog?.dataset.phase).toBe("leaving");
    expect(hooks.dialog?.open).toBe(true);
    vi.advanceTimersByTime(350);
    expect(hooks.dialog?.open).toBe(false);
    expect(body.style.overflow).toBe("auto");
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(storage.get(sessionKey)).toBe("seen");
    mount();
    expect(showModal).toHaveBeenCalledOnce();
  });

  it.each(["motion", "anchor", "seen", "scrolled", "focused", "unsupported"])("goes directly to content for %s", (reason) => {
    if (reason === "motion") motion.matches = true;
    if (reason === "anchor") window.location.hash = "#contact";
    if (reason === "seen") storage.set(sessionKey, "seen");
    if (reason === "scrolled") window.scrollY = 100;
    if (reason === "focused") vi.stubGlobal("document", { body, activeElement: {}, getElementById: () => ({ focus }) });
    if (reason === "unsupported" && hooks.dialog) hooks.dialog.showModal = undefined;
    mount();
    expect(showModal).not.toHaveBeenCalled();
    expect(body.style.overflow).toBe("auto");
    expect(vi.getTimerCount()).toBe(0);
    expect(focus).not.toHaveBeenCalled();
  });

  it.each([
    ["click", 0], ["click", 1800],
    ["cancel", 0], ["cancel", 1800],
    ["change", 0], ["change", 1800],
  ] as const)("dismisses immediately on %s after %dms", (event, elapsed) => {
    mount();
    vi.advanceTimersByTime(elapsed);
    const target = event === "click" ? skip : event === "cancel" ? hooks.dialog : motion;
    const dismissal = new Event(event, { cancelable: true });
    target?.dispatchEvent(dismissal);
    expect(dismissal.defaultPrevented).toBe(true);
    expect(hooks.dialog?.open).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    expect(body.style.overflow).toBe("auto");
    expect(focus).toHaveBeenCalledOnce();
  });

  it("still exits when session storage is blocked", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => { throw new Error("blocked"); },
      setItem: () => { throw new Error("blocked"); },
    });
    mount();
    expect(() => vi.runAllTimers()).not.toThrow();
    expect(hooks.dialog?.open).toBe(false);
    expect(body.style.overflow).toBe("auto");
  });

  it("restores the page and removes timers and listeners on interrupted mounts", () => {
    mount();
    cleanup?.();
    expect(hooks.dialog?.open).toBe(false);
    expect(hooks.dialog?.dataset.phase).toBeUndefined();
    expect(body.style.overflow).toBe("auto");
    expect(vi.getTimerCount()).toBe(0);
    skip.dispatchEvent(new Event("click"));
    expect(focus).not.toHaveBeenCalled();
    expect(storage.size).toBe(0);
    mount();
    expect(hooks.dialog?.open).toBe(true);
  });
});
