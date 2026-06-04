/** Pure helper for NotionBlock.onInput. Encapsulates the three things
 *  the inline editor cares about on every keystroke:
 *
 *   1. Markdown shortcut conversion ("# " → h1, "[] " → todo, …).
 *      Only fires on `paragraph` blocks; consumes the text + emits a
 *      type change in one edit.
 *   2. Slash menu open/close detection. Caller passes the current
 *      `slashOpen` so we can emit a close intent when the user backs
 *      out of the slash without re-rendering twice.
 *   3. Text decoration trigger. Skipped while the slash menu is open
 *      so `/he` never gets WYSIWYG-decorated as if it were markdown.
 *
 *  All three outcomes are encoded as a discriminated union so the
 *  React component can apply them without duplicating logic. Kept
 *  free of React imports + DOM I/O so it can be unit-tested headless
 *  if we ever bring tests over from open-silong.
 */
import type { Block, BlockType } from "../types";
import { MARKDOWN_TRIGGERS } from "./markdownTriggers";

export type BlockInputDecision =
  | { kind: "markdownTrigger"; type: BlockType; patch?: Partial<Block> }
  | { kind: "slashOpen"; query: string }
  | { kind: "slashClose" }
  | { kind: "text"; decorate: boolean };

export function decideBlockInput(args: {
  text: string;
  blockType: BlockType;
  canTurnInto: boolean;
  slashOpen: boolean;
}): BlockInputDecision {
  const { text, blockType, canTurnInto, slashOpen } = args;

  if (canTurnInto && blockType === "paragraph") {
    const trigger = MARKDOWN_TRIGGERS[text];
    if (trigger) return { kind: "markdownTrigger", type: trigger.type, patch: trigger.patch };
  }

  const isSlash =
    canTurnInto && (text === "/" || (text.startsWith("/") && !text.includes("\n")));
  if (isSlash) return { kind: "slashOpen", query: text.slice(1) };
  if (slashOpen) return { kind: "slashClose" };

  return { kind: "text", decorate: true };
}
