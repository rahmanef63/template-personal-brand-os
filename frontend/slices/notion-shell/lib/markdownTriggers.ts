/** Inline markdown-like shortcuts. When the user types one of these
 *  strings into a paragraph block, NotionBlock fires `onTurnInto` with
 *  the mapped type and clears the text (plus applies any `patch` for
 *  blocks that ship default state — e.g. `todo` starts unchecked).
 *
 *  Ported verbatim from open-silong's editor slice — keep the maps in
 *  sync so the inline-trigger UX matches across the product + the rr
 *  demo.
 */
import type { Block, BlockType } from "../types";

export const MARKDOWN_TRIGGERS: Record<string, { type: BlockType; patch?: Partial<Block> }> = {
  "# ":    { type: "h1" },
  "## ":   { type: "h2" },
  "### ":  { type: "h3" },
  "#### ": { type: "h4" },
  "- ":    { type: "bullet" },
  "* ":    { type: "bullet" },
  "1. ":   { type: "numbered" },
  "[] ":   { type: "todo", patch: { checked: false } },
  "[ ] ":  { type: "todo", patch: { checked: false } },
  "> ":    { type: "quote" },
  "``` ":  { type: "code" },
  "```":   { type: "code" },
  "$$ ":   { type: "equation" },
  "$$":    { type: "equation" },
  "--- ":  { type: "divider" },
  "---":   { type: "divider" },
};
