"use client";

/** SelectionMarquee — drop this on the drag surface (a position:relative
 *  container that holds the SelectableBlocks) to enable rubber-band select.
 *  Reads the SelectionProvider context, so the host only passes the ref.
 *
 *  AutoCAD direction: drag RIGHT → "window" (solid ring, only fully-enclosed
 *  items); drag LEFT → "crossing" (dashed green ring, anything touched). */

import { type RefObject } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useSelection } from "./SelectionProvider";
import { useMarquee } from "../lib/useMarquee";

export function SelectionMarquee({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const sel = useSelection();
  const rect = useMarquee({
    containerRef,
    itemSelector: "[data-selectable-id]",
    getItemId: (el) => el.dataset.selectableId,
    onSelect: (ids) => sel?.setIds(ids),
    onDragStart: (additive) => { if (!additive) sel?.clear(); },
    getBaseline: () => sel?.snapshot() ?? [],
    autocad: true,
  });

  if (!sel || !rect || !containerRef.current) return null;
  const win = rect.mode === "window";
  return createPortal(
    <div
      aria-hidden
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
      className={cn(
        "pointer-events-none absolute z-40 rounded-sm",
        win
          ? "bg-primary/10 ring-1 ring-primary/60"
          : "bg-emerald-500/10 outline-dashed outline-1 outline-emerald-500/70",
      )}
    />,
    containerRef.current,
  );
}
