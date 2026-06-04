"use client";

/** RowMarqueeOverlay — drag-to-select rubber-band over a TableView (or
 *  any container with rows marked `data-row-shell-id`). Selects rows
 *  whose bounding rect intersects the band; shift/cmd-drag is additive
 *  over the prior selection. Lifted from notion-page-clone CK-1D
 *  Phase 3. */

import type { RefObject } from "react";
import { Marquee } from "./Marquee";
import { useRowSelection } from "./RowSelectionProvider";

interface Props {
  containerRef: RefObject<HTMLElement | null>;
  /** Override the default `[data-row-shell-id]` selector (e.g. when
   *  using row-selection over Board cards or Gallery tiles). */
  itemSelector?: string;
  /** Override the default DOM attr read for the item id. */
  getItemId?: (el: HTMLElement) => string | undefined;
}

const DEFAULT_SELECTOR = "[data-row-shell-id]";
const DEFAULT_GET_ID = (el: HTMLElement) => el.dataset.rowShellId;

export function RowMarqueeOverlay({
  containerRef,
  itemSelector = DEFAULT_SELECTOR,
  getItemId = DEFAULT_GET_ID,
}: Props) {
  const { state, setIds, clear } = useRowSelection();
  return (
    <Marquee
      containerRef={containerRef}
      itemSelector={itemSelector}
      getItemId={getItemId}
      onSelect={(ids) => setIds(ids)}
      onDragStart={(additive) => { if (!additive) clear(); }}
      getBaseline={() => [...state.ids]}
    />
  );
}
