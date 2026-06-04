/** Live inline-markdown decorator for contentEditable blocks.
 *
 *  Keeps the Slack-model source-of-truth (`**bold**`, `_italic_`,
 *  `~~strike~~`, `` `code` ``, `[label](url)`) and layers a decoration
 *  pass on top so the rendered glyphs look bold/italic/etc. in the
 *  editor — Notion-style WYSIWYG. Pass is idempotent and structure-
 *  only; visible characters are unchanged, so `el.innerText` after a
 *  pass returns the source the user typed.
 *
 *  Caller wires this from `onInput` / mount. IME-safe — caller should
 *  skip the pass between `compositionstart` and `compositionend`. */

import { getCaretOffset, setCaretAtOffset } from "./inline-decorator/caret";
import { decorateLineToFragment } from "./inline-decorator/decorate";

export { getCaretOffset, setCaretAtOffset, decorateLineToFragment };

export function decorateInPlace(host: HTMLElement, source: string, opts?: { hideMarkers?: boolean }): void {
  const caret = getCaretOffset(host);
  while (host.firstChild) host.removeChild(host.firstChild);

  const lines = source.split("\n");
  for (let i = 0; i < lines.length; i++) {
    host.appendChild(decorateLineToFragment(lines[i], opts));
    if (i < lines.length - 1) {
      host.appendChild(document.createElement("br"));
    }
  }
  if (caret >= 0) setCaretAtOffset(host, caret);
}

export function visibleLength(source: string): number {
  return source.length;
}
