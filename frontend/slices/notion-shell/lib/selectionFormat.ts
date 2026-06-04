/** Wrap the current text selection in markdown markers via `insertText`
 *  (the de-facto contentEditable mutation API — it fires `input`, so the
 *  host block re-reads + re-decorates with zero wiring). Shared by the
 *  InlineFormatToolbar and the Cmd/Ctrl+B/I/E/Shift+X keyboard shortcuts. */
export function wrapSelection(prefix: string, suffix = prefix): void {
  if (typeof window === "undefined") return;
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return;
  const selected = sel.toString();
  document.execCommand("insertText", false, `${prefix}${selected}${suffix}`);
}
