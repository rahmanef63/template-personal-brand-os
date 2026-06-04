/**
 * selection slice contract.
 *
 * Framework-agnostic marquee multi-selection for vertical lists. Pure-UI
 * primitive — no convex tables, no deps beyond `@/lib/utils` + react-dom.
 * AutoCAD-style rubber-band (drag-right = enclose, drag-left = cross). Lifted
 * from notion-page-clone's block-selection slice; pairs with notion-shell.
 */

import { defineSliceContract } from "@/packages/cli/lib/contract";

export const contract = defineSliceContract({
  id: "selection",
  version: "0.1.0",
  category: "ui",
  kind: "ui",
  provides: {
    components: ["SelectionProvider", "SelectableBlock", "SelectionMarquee"],
    utils: ["useMarquee"],
    hooks: ["useSelection"],
    types: ["SelectionCtx", "SelectableBlockProps", "MarqueeRect", "MarqueeMode"],
  },
  requires: {
    npm: [],
    shadcn: [],
    env: [],
    peers: [],
    routes: [],
    tables: [],
  },
});
