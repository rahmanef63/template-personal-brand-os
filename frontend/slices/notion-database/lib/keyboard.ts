/** Keyboard navigation helper — focus the next/previous sibling matching
 *  a selector inside a `[data-keyboard-scope]` container (or document). */

export function focusSiblingBySelector(
  current: HTMLElement,
  selector: string,
  delta: 1 | -1,
): boolean {
  const scope = current.closest<HTMLElement>("[data-keyboard-scope]") ?? document;
  const anchor = current.closest<HTMLElement>(selector) ?? current;
  const items = Array.from(scope.querySelectorAll<HTMLElement>(selector)).filter((el) => {
    const disabled = el.getAttribute("aria-disabled") === "true" || el.hasAttribute("disabled");
    return !disabled && el.offsetParent !== null;
  });
  const index = items.indexOf(anchor);
  if (index === -1) return false;
  const next = items[index + delta];
  if (!next) return false;
  next.focus();
  return true;
}
