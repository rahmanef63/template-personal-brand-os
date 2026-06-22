import { REGISTRY } from "./registry";
import type { BlockInstance } from "./types";

// SSOT renderer — turn a PageConfig's blocks into a rendered page. Server-safe
// (no "use client"): templates can render a stored config at build time. The
// builder reuses this for its live preview. One mapping, every surface.
//
// `collection` blocks hold no items in their props: their items are injected
// here from collections[props.source], so a preview block and a full-page block
// pointing at the same source render one shared list.
export default function BlockRenderer({
  blocks,
  collections,
}: {
  blocks: BlockInstance[];
  collections?: Record<string, Record<string, unknown>[]>;
}) {
  return (
    <>
      {blocks.map((b) => {
        const def = REGISTRY[b.type];
        if (!def) return null;
        const Block = def.component;
        const injected = def.collection
          ? { items: collections?.[b.props.source as string] ?? [] }
          : null;
        return <Block key={b.id} {...b.props} {...injected} />;
      })}
    </>
  );
}
