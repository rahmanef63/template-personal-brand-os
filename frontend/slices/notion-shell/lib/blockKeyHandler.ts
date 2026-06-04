import type { KeyboardEvent } from "react";
import type { Block, BlockType } from "../types";
import { getCaretOffset } from "./inlineDecorator";
import { focusBlock } from "./focusBlock";
import { wrapSelection } from "./selectionFormat";

const LIST = new Set<BlockType>(["bullet", "numbered", "todo"]);
/** Text-shape blocks that downgrade to a plain paragraph on the first
 *  Backspace-while-empty (heading/quote/callout/list). A second Backspace
 *  from the resulting empty paragraph then merges into the previous block. */
const DOWNGRADE = new Set<BlockType>([
  "h1", "h2", "h3", "h4", "h5", "h6", "quote", "callout",
  "bullet", "numbered", "todo",
]);
const MAX_INDENT = 3;

export interface BlockKeyDeps {
  block: Block;
  slashOpen: boolean;
  closeSlash: () => void;
  onTurnInto?: (type: BlockType) => void;
  onUpdate?: (patch: Partial<Block>) => void;
  onRemove?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  /** Host inserts a new block right after this one; returns its id so the
   *  caret can hop into it. Enables Enter → new block (caret-split). */
  onInsertAfter?: (type: BlockType, init?: Partial<Block>) => string | void;
  /** Host deletes this (empty) block and focuses the previous one at the
   *  join point. Enables Backspace → merge into previous line. */
  onMergeBack?: () => void;
  /** Host moves focus to the adjacent block (caret at the near edge). */
  onFocusSibling?: (dir: -1 | 1) => void;
}

/** Cmd/Ctrl chords — formatting, duplicate, move, type conversion. Returns
 *  true if it consumed the event. */
function handleMeta(e: KeyboardEvent<HTMLElement>, deps: BlockKeyDeps): boolean {
  if (!(e.metaKey || e.ctrlKey)) return false;
  const k = e.key.toLowerCase();
  const done = () => e.preventDefault();
  if (k === "b") { done(); wrapSelection("**"); return true; }
  if (k === "i") { done(); wrapSelection("_"); return true; }
  if (k === "e") { done(); wrapSelection("`"); return true; }
  if (e.shiftKey && k === "x") { done(); wrapSelection("~~"); return true; }
  if (k === "d") { done(); deps.onDuplicate?.(); return true; }
  if (e.shiftKey && e.key === "ArrowUp") { done(); deps.onMoveUp?.(); return true; }
  if (e.shiftKey && e.key === "ArrowDown") { done(); deps.onMoveDown?.(); return true; }
  if (e.altKey && (e.key === "1" || e.key === "2" || e.key === "3")) {
    done(); deps.onTurnInto?.(("h" + e.key) as BlockType); return true;
  }
  if (e.shiftKey && e.key === "7") { done(); deps.onTurnInto?.("todo"); return true; }
  if (e.shiftKey && e.key === "8") { done(); deps.onTurnInto?.("bullet"); return true; }
  return false;
}

/** Notion-canonical editing keys for a text-shape block. The SlashMenu owns
 *  ArrowUp/Down/Enter while open (global capture listener), so we bail on
 *  those when `slashOpen`. */
export function handleBlockKeyDown(e: KeyboardEvent<HTMLElement>, deps: BlockKeyDeps): void {
  const { block, slashOpen, closeSlash, onTurnInto, onUpdate, onRemove } = deps;
  const el = e.currentTarget as HTMLElement;

  if (e.key === "Escape" && slashOpen) {
    e.preventDefault();
    closeSlash();
    return;
  }
  if (slashOpen && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
    return;
  }
  if (handleMeta(e, deps)) return;

  // Shift+Enter → soft line break inside the same block (not a new block).
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    document.execCommand("insertText", false, "\n");
    return;
  }

  // Tab / Shift+Tab → indent / outdent list items (persisted on the block).
  if (e.key === "Tab") {
    e.preventDefault();
    if (LIST.has(block.type)) {
      const cur = block.indent ?? 0;
      const next = e.shiftKey ? Math.max(0, cur - 1) : Math.min(MAX_INDENT, cur + 1);
      if (next !== cur) onUpdate?.({ indent: next });
    }
    return;
  }

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const text = block.text ?? el.innerText;
    // Empty list item → exit the list (convert to paragraph) instead of
    // stacking another empty bullet.
    if (LIST.has(block.type) && text === "") {
      onTurnInto?.("paragraph");
      focusBlock(block.id, 0);
      return;
    }
    const off = getCaretOffset(el);
    const head = text.slice(0, off);
    const tail = text.slice(off);
    // Lists continue their own type on Enter; everything else → paragraph.
    const nextType: BlockType = LIST.has(block.type) ? block.type : "paragraph";
    // Carry the list indent into the continued item.
    const init: Partial<Block> = { text: tail };
    if (LIST.has(block.type) && block.indent) init.indent = block.indent;
    if (head !== text) onUpdate?.({ text: head });
    const id = deps.onInsertAfter?.(nextType, init);
    if (typeof id === "string") focusBlock(id, 0);
    return;
  }

  if (e.key === "Backspace" && el.innerText === "") {
    e.preventDefault();
    // First Backspace on an empty non-paragraph drops the block-type so it
    // becomes a plain empty paragraph (re-triggerable with "/").
    if (block.type !== "paragraph" && DOWNGRADE.has(block.type)) {
      onTurnInto?.("paragraph");
      focusBlock(block.id, 0);
      return;
    }
    // Empty paragraph → merge into the previous block (host focuses it).
    if (deps.onMergeBack) deps.onMergeBack();
    else onRemove?.();
    return;
  }

  if (e.key === "ArrowDown" && getCaretOffset(el) === el.innerText.length) {
    deps.onFocusSibling?.(1);
  } else if (e.key === "ArrowUp" && getCaretOffset(el) === 0) {
    deps.onFocusSibling?.(-1);
  }
}
