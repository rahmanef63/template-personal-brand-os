/** Pure DOM-rect hit-test for the marquee. Extracted from the hook so
 *  useMarqueeDrag stays under the 200-LOC audit cap. */

import type { MarqueeMode, Rect } from "./marquee-types";

interface CollectArgs {
  container: HTMLElement;
  itemSelector: string;
  getItemId: (el: HTMLElement) => string | undefined;
  baseSnapshot: string[];
  marqueeRect: Rect;
  mode: MarqueeMode;
  excludeAncestorsWhenDescendantHit: boolean;
}

export function collectHits({
  container, itemSelector, getItemId, baseSnapshot, marqueeRect, mode,
  excludeAncestorsWhenDescendantHit,
}: CollectArgs): string[] {
  const items = container.querySelectorAll<HTMLElement>(itemSelector);
  const cr = container.getBoundingClientRect();
  const ox = cr.left;
  const oy = cr.top;
  const hits = new Set(baseSnapshot);
  const hitEls = new Map<string, HTMLElement>();

  items.forEach((el) => {
    const id = getItemId(el);
    if (!id) return;
    const r = el.getBoundingClientRect();
    const ix = r.left - ox + container.scrollLeft;
    const iy = r.top - oy + container.scrollTop;
    const intersects =
      ix < marqueeRect.x + marqueeRect.w && ix + r.width > marqueeRect.x &&
      iy < marqueeRect.y + marqueeRect.h && iy + r.height > marqueeRect.y;
    if (!intersects) return;
    const fullyEnclosed =
      ix >= marqueeRect.x && iy >= marqueeRect.y &&
      ix + r.width <= marqueeRect.x + marqueeRect.w &&
      iy + r.height <= marqueeRect.y + marqueeRect.h;
    const hit = mode === "window" ? fullyEnclosed : intersects;
    if (hit) {
      hits.add(id);
      hitEls.set(id, el);
    }
  });

  let arr = [...hits];
  if (excludeAncestorsWhenDescendantHit && hitEls.size > 1) {
    const drop = new Set<string>();
    const els = [...hitEls.entries()];
    for (const [aId, aEl] of els) {
      for (const [bId, bEl] of els) {
        if (aId === bId) continue;
        if (aEl !== bEl && aEl.contains(bEl)) drop.add(aId);
      }
    }
    if (drop.size) arr = arr.filter((id) => !drop.has(id));
  }
  return arr;
}
