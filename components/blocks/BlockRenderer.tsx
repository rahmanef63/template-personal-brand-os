import { REGISTRY } from "./registry";
import type { BlockInstance } from "./types";

// SSOT renderer — turn a PageConfig's blocks into a rendered page. Server-safe
// (no "use client"): templates can render a stored config at build time. The
// builder reuses this for its live preview. One mapping, every surface.
export default function BlockRenderer({ blocks }: { blocks: BlockInstance[] }) {
  return (
    <>
      {blocks.map((b) => {
        const def = REGISTRY[b.type];
        if (!def) return null;
        const Block = def.component;
        return <Block key={b.id} {...b.props} />;
      })}
    </>
  );
}
