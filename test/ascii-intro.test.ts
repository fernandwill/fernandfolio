import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({ text: "" }));
vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useState: () => [hooks.text, (text: string) => { hooks.text = text; }],
}));
vi.mock("@/lib/ascii-desk", () => import("../lib/ascii-desk"));
vi.mock("@/components/ascii-steam", () => import("../components/ascii-steam"));
vi.mock("@/lib/ascii-steam", () => import("../lib/ascii-steam"));
import { AsciiIntro } from "../components/ascii-intro";

beforeEach(() => { hooks.text = ""; });

describe("Interactive desk", () => {
  it("renders labelled native inputs outside the hidden artwork", () => {
    const markup = renderToStaticMarkup(createElement(AsciiIntro));
    expect(markup.match(/maxlength="12"/gi)).toHaveLength(2);
    expect(markup.match(/aria-label="Type on the ASCII computer \(12 characters maximum\)"/g)).toHaveLength(2);
    const artwork = markup.match(/<pre\b[\s\S]*?<\/pre>/g);
    expect(artwork).toHaveLength(2);
    expect(artwork?.every((drawing) => !drawing.includes("<input"))).toBe(true);
    expect(markup.match(/data-empty="true"/g)).toHaveLength(2);
    expect(markup).not.toContain("skip intro");
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
});
