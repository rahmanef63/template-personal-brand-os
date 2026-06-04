import { describe, expect, it } from "vitest";
import { decideBlockInput } from "./blockInputHandler";

describe("decideBlockInput", () => {
  const base = { blockType: "paragraph" as const, canTurnInto: true, slashOpen: false };

  it("returns markdownTrigger for '# ' on paragraph", () => {
    expect(decideBlockInput({ ...base, text: "# " })).toEqual({
      kind: "markdownTrigger",
      type: "h1",
    });
  });

  it("returns markdownTrigger with patch for '[] '", () => {
    expect(decideBlockInput({ ...base, text: "[] " })).toEqual({
      kind: "markdownTrigger",
      type: "todo",
      patch: { checked: false },
    });
  });

  it("ignores markdownTrigger on non-paragraph", () => {
    expect(
      decideBlockInput({ ...base, blockType: "h2", text: "# " }),
    ).toMatchObject({ kind: "text" });
  });

  it("ignores markdownTrigger when canTurnInto is false (read-only host)", () => {
    expect(
      decideBlockInput({ ...base, canTurnInto: false, text: "# " }),
    ).toMatchObject({ kind: "text" });
  });

  it("opens slash menu on bare '/'", () => {
    expect(decideBlockInput({ ...base, text: "/" })).toEqual({
      kind: "slashOpen",
      query: "",
    });
  });

  it("opens slash menu with query for '/head'", () => {
    expect(decideBlockInput({ ...base, text: "/head" })).toEqual({
      kind: "slashOpen",
      query: "head",
    });
  });

  it("emits slashClose when text no longer starts with '/' but slash was open", () => {
    expect(
      decideBlockInput({ ...base, text: "hello", slashOpen: true }),
    ).toEqual({ kind: "slashClose" });
  });

  it("returns text when no trigger fires and slash was already closed", () => {
    expect(decideBlockInput({ ...base, text: "hello" })).toEqual({
      kind: "text",
      decorate: true,
    });
  });

  it("does not open slash when canTurnInto is false", () => {
    expect(
      decideBlockInput({ ...base, canTurnInto: false, text: "/" }),
    ).toMatchObject({ kind: "text" });
  });

  it("does not treat text containing newline + leading slash as slash menu", () => {
    expect(
      decideBlockInput({ ...base, text: "/hello\nworld" }),
    ).toMatchObject({ kind: "text" });
  });
});
