import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({
  text: "",
  effect: undefined as (() => void | (() => void)) | undefined,
  scene: undefined as (EventTarget & { dataset: Record<string, string>; contains: () => boolean }) | undefined,
}));
vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { hooks.effect = effect; },
  useRef: () => ({ current: hooks.scene }),
  useState: () => [hooks.text, (text: string) => { hooks.text = text; }],
}));
vi.mock("@/lib/ascii-desk", () => import("../lib/ascii-desk"));
vi.mock("@/components/ascii-steam", () => import("../components/ascii-steam"));
vi.mock("@/lib/ascii-steam", () => import("../lib/ascii-steam"));
import { AsciiIntro } from "../components/ascii-intro";

let motion: EventTarget & { matches: boolean };
let storage: Map<string, string>;
let cleanup: void | (() => void);
const focus = vi.fn();

function mount() {
  AsciiIntro();
  cleanup = hooks.effect?.();
}

beforeEach(() => {
  vi.useFakeTimers();
  hooks.text = "";
  hooks.scene = Object.assign(new EventTarget(), { dataset: {}, contains: () => false });
  motion = Object.assign(new EventTarget(), { matches: false });
  storage = new Map();
  vi.stubGlobal("window", Object.assign(new EventTarget(), {
    matchMedia: () => motion, location: { hash: "" },
  }));
  vi.stubGlobal("sessionStorage", {
    getItem: (key: string) => storage.get(key),
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  vi.stubGlobal("document", { activeElement: null, getElementById: () => ({ focus }) });
});
afterEach(() => {
  cleanup?.();
  cleanup = undefined;
  focus.mockClear();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Desk intro", () => {
  it("finishes automatically and remembers the session", () => {
    mount();
    expect(hooks.scene?.dataset.intro).toBe("drawing");
    vi.runAllTimers();
    expect(hooks.scene?.dataset.intro).toBeUndefined();
    expect(storage.get("portfolio-desk-intro-v1")).toBe("seen");
    mount();
    expect(hooks.scene?.dataset.intro).toBeUndefined();
  });

  it.each(["motion", "anchor", "seen"])("stays static for %s visits", (reason) => {
    if (reason === "motion") motion.matches = true;
    if (reason === "anchor") window.location.hash = "#projects";
    if (reason === "seen") storage.set("portfolio-desk-intro-v1", "seen");
    mount();
    expect(hooks.scene?.dataset.intro).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["click", "focusin", "keydown", "change"])("can finish on %s", (event) => {
    mount();
    const target = event === "click" || event === "focusin" ? hooks.scene : event === "change" ? motion : window;
    target?.dispatchEvent(new Event(event));
    expect(hooks.scene?.dataset.intro).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("moves focus out of the disappearing skip control", () => {
    mount();
    if (hooks.scene) hooks.scene.contains = () => true;
    vi.stubGlobal("document", {
      activeElement: { classList: { contains: (name: string) => name === "desk-skip" } },
      getElementById: () => ({ focus }),
    });
    hooks.scene?.dispatchEvent(new Event("click"));
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("finishes the intro without stealing focus from the monitor input", () => {
    mount();
    if (hooks.scene) hooks.scene.contains = () => true;
    vi.stubGlobal("document", {
      activeElement: { classList: { contains: () => false } },
      getElementById: () => ({ focus }),
    });
    hooks.scene?.dispatchEvent(new Event("focusin"));
    expect(hooks.scene?.dataset.intro).toBeUndefined();
    expect(focus).not.toHaveBeenCalled();
  });

  it("renders labelled native inputs outside the hidden artwork", () => {
    const markup = renderToStaticMarkup(createElement(AsciiIntro));
    expect(markup.match(/maxlength="12"/gi)).toHaveLength(2);
    expect(markup.match(/aria-label="Type on the ASCII computer \(12 characters maximum\)"/g)).toHaveLength(2);
    const artwork = markup.match(/<pre\b[\s\S]*?<\/pre>/g);
    expect(artwork).toHaveLength(2);
    expect(artwork?.every((drawing) => !drawing.includes("<input"))).toBe(true);
    expect(markup.match(/data-empty="true"/g)).toHaveLength(2);
  });

  it("shares typed and cleared text between the desktop and phone monitors", () => {
    const figure = AsciiIntro();
    const input = figure.props.children[0].props.children[1].props.children;
    input.props.onChange({ currentTarget: { value: "hello" } });
    const markup = renderToStaticMarkup(createElement(AsciiIntro));
    expect(markup.match(/value="hello"/g)).toHaveLength(2);
    expect(markup.match(/data-empty="false"/g)).toHaveLength(2);
    input.props.onChange({ currentTarget: { value: "" } });
    expect(hooks.text).toBe("");
  });

  it("renders typed markup as text, not executable HTML", () => {
    hooks.text = "<script>";
    const markup = renderToStaticMarkup(createElement(AsciiIntro));
    expect(markup).not.toContain("<script>");
    expect(markup).toContain('value="&lt;script&gt;"');
  });

  it("still finishes when session storage is blocked", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => { throw new Error("blocked"); },
      setItem: () => { throw new Error("blocked"); },
    });
    mount();
    expect(() => vi.runAllTimers()).not.toThrow();
    expect(hooks.scene?.dataset.intro).toBeUndefined();
  });

  it("cleans up without marking an interrupted mount as seen", () => {
    mount();
    cleanup?.();
    expect(hooks.scene?.dataset.intro).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
    expect(storage.size).toBe(0);
    mount();
    expect(hooks.scene?.dataset.intro).toBe("drawing");
  });
});
