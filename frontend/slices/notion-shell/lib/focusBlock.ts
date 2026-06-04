import { setCaretAtOffset } from "./inlineDecorator";

/** Focus the contentEditable of a block by id and place the caret.
 *  `offset` omitted → caret at end; `0` → start; otherwise that index.
 *  Deferred a tick so it runs after React commits the (possibly new or
 *  re-typed) element. Used by the keyboard handler (Enter → focus new
 *  block at start) and hosts (Backspace-merge → focus previous at the
 *  join point). */
export function focusBlock(id: string, offset?: number): void {
  if (typeof document === "undefined") return;
  setTimeout(() => {
    const el = document.querySelector<HTMLElement>(`[data-block-id="${id}"]`);
    if (!el) return;
    el.focus();
    if (typeof offset === "number") setCaretAtOffset(el, offset);
    else setCaretAtOffset(el, el.innerText.length);
  }, 0);
}
