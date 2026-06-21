"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// The two demo frames side-by-side with a custom draggable divider — no npm
// resizable dep. Desktop: flex-row, vertical divider, drag X sets the LEFT
// pane width %. Mobile: flex-col, horizontal divider, drag Y sets the TOP pane
// height %. The first pane is clamped to 20–80% either way.
//
// Pointer events + setPointerCapture keep the drag glued to the divider even
// when the cursor crosses into an iframe (which would otherwise swallow the
// move events). We read the container rect on each move to map client coords to
// a percentage.

const MIN = 20;
const MAX = 80;
const clamp = (n: number) => Math.min(MAX, Math.max(MIN, n));

export function SplitOverlay({ leftSrc, rightSrc }: { leftSrc: string; rightSrc: string }) {
  const isMobile = useIsMobile();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [pct, setPct] = React.useState(50); // size of the first pane, %
  const [dragging, setDragging] = React.useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = isMobile
      ? ((e.clientY - rect.top) / rect.height) * 100
      : ((e.clientX - rect.left) / rect.width) * 100;
    setPct(clamp(next));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const first = `${pct}%`;
  const second = `${100 - pct}%`;

  return (
    <div
      ref={containerRef}
      className={cn("relative flex size-full", isMobile ? "flex-col" : "flex-row")}
    >
      <iframe
        src={leftSrc}
        title="Public preview"
        className="min-h-0 min-w-0 border-0 bg-background"
        style={isMobile ? { height: first, width: "100%" } : { width: first, height: "100%" }}
      />
      <DividerHandle
        isMobile={isMobile}
        dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      <iframe
        src={rightSrc}
        title="Admin dashboard"
        className="min-h-0 min-w-0 border-0 bg-background"
        style={isMobile ? { height: second, width: "100%" } : { width: second, height: "100%" }}
      />
      {/* Transparent capture layer over BOTH iframes during a drag so the move
          events keep flowing to the divider instead of being eaten by a frame. */}
      {dragging && <div className="absolute inset-0 z-10" style={{ cursor: isMobile ? "row-resize" : "col-resize" }} />}
    </div>
  );
}

function DividerHandle({
  isMobile,
  dragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  isMobile: boolean;
  dragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}) {
  return (
    <div
      role="separator"
      aria-orientation={isMobile ? "horizontal" : "vertical"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        "z-20 flex shrink-0 items-center justify-center bg-border/70 transition-colors hover:bg-primary/60 touch-none select-none",
        dragging && "bg-primary/70",
        isMobile ? "h-2 w-full cursor-row-resize" : "h-full w-2 cursor-col-resize",
      )}
    >
      <span className={cn("rounded-full bg-background/80", isMobile ? "h-0.5 w-8" : "h-8 w-0.5")} />
    </div>
  );
}
