import type { ClipboardEvent } from "react";
import type { Block, BlockType } from "../types";
import { MARKDOWN_TRIGGERS } from "./markdownTriggers";

interface ParsedLine { type: BlockType; text: string; patch?: Partial<Block> }

// Space-terminated triggers ("# ", "- ", "> " …), longest first.
const PREFIXES = Object.entries(MARKDOWN_TRIGGERS)
  .filter(([k]) => k.endsWith(" "))
  .sort((a, b) => b[0].length - a[0].length);

function parseLine(line: string): ParsedLine {
  const t = line.trim();
  if (t === "---" || t === "***" || t === "___") return { type: "divider", text: "" };
  const num = line.match(/^\d+\.\s(.*)$/);
  if (num) return { type: "numbered", text: num[1] ?? "" };
  for (const [prefix, spec] of PREFIXES) {
    if (line.startsWith(prefix)) return { type: spec.type, text: line.slice(prefix.length), patch: spec.patch };
  }
  return { type: "paragraph", text: line };
}

export interface BlockPasteDeps {
  block: Block;
  onUpdate?: (patch: Partial<Block>) => void;
  onTurnInto?: (type: BlockType) => void;
  onInsertAfter?: (type: BlockType, init?: Partial<Block>) => string | void;
}

/** Multi-line / markdown clipboard → real blocks. A single plain line falls
 *  through to the browser's default inline paste (keeps formatting markers).
 *  Multiple lines are parsed per-line into blocks: the first fills the
 *  current block when empty; the rest are inserted after (reversed, since the
 *  host inserts each right after the same anchor → preserves order). */
export function handleBlockPaste(e: ClipboardEvent<HTMLElement>, deps: BlockPasteDeps): void {
  const data = e.clipboardData?.getData("text/plain");
  if (!data) return;
  const lines = data.replace(/\r\n/g, "\n").split("\n").map((l) => l.replace(/\s+$/, ""));
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length <= 1) return; // let default inline paste run
  e.preventDefault();

  const parsed = nonEmpty.map(parseLine);
  let start = 0;
  if ((deps.block.text ?? "").trim() === "" && parsed[0]) {
    deps.onUpdate?.({ text: parsed[0].text, ...(parsed[0].patch ?? {}) });
    if (parsed[0].type !== deps.block.type) deps.onTurnInto?.(parsed[0].type);
    start = 1;
  }
  for (let i = parsed.length - 1; i >= start; i--) {
    const p = parsed[i]!;
    deps.onInsertAfter?.(p.type, { text: p.text, ...(p.patch ?? {}) });
  }
}
