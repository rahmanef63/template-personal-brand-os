import type { Block } from "../types";
import type { TocHeading } from "../components/blocks/TocBlock";

const LEVEL: Partial<Record<Block["type"], number>> = {
  h1: 1, h2: 2, h3: 3,
};

/** Walk a block list (incl. toggle children + columns) and gather h1–h3 for a
 *  table of contents. The id matches `data-block-id`, so `focusBlock(id)` (or
 *  a `#block-<id>` hash) jumps to it. */
export function collectHeadings(blocks: Block[]): TocHeading[] {
  const out: TocHeading[] = [];
  const walk = (list: Block[]) => {
    for (const b of list) {
      const level = LEVEL[b.type];
      if (level) out.push({ id: b.id, text: b.text ?? "", level });
      if (b.children?.length) walk(b.children);
      if (b.columns?.length) b.columns.forEach(walk);
    }
  };
  walk(blocks);
  return out;
}
