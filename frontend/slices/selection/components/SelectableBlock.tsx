"use client";

/** SelectableBlock — wrap each list item to opt it into selection (needs a
 *  <SelectionProvider> ancestor; without one it renders children untouched).
 *  Tags the item with data-selectable-id so the marquee can hit-test it, shows
 *  the selected ring, and its thin edge strips click-select (Shift = range,
 *  Cmd/Ctrl = toggle). */

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSelection } from "./SelectionProvider";

export interface SelectableBlockProps {
  id: string;
  orderedIds: string[];
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Render the thin top/bottom click-select edge strips. Default true; set
   *  false for free-floating canvas nodes where you select via the marquee or
   *  your own handle. */
  edges?: boolean;
}

export function SelectableBlock({ id, orderedIds, children, className, style, edges = true }: SelectableBlockProps) {
  const sel = useSelection();
  if (!sel) return <>{children}</>;

  const selected = sel.isSelected(id);
  const onEdge = (e: MouseEvent) => {
    e.preventDefault();
    if (e.shiftKey) sel.selectRange(id, orderedIds);
    else if (e.metaKey || e.ctrlKey) sel.toggle(id);
    else sel.selectOnly(id);
  };

  return (
    <div
      data-selectable-id={id}
      data-block-selected={selected || undefined}
      style={style}
      className={cn("relative rounded-sm transition-colors", selected && "bg-primary/10 ring-2 ring-primary/50", className)}
    >
      {edges && <div data-selectable-edge data-no-marquee onMouseDown={onEdge} aria-hidden className="absolute inset-x-0 top-0 z-10 h-1.5 cursor-pointer" />}
      {children}
      {edges && <div data-selectable-edge data-no-marquee onMouseDown={onEdge} aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-1.5 cursor-pointer" />}
    </div>
  );
}
