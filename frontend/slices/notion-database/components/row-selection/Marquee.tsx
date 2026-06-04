"use client";

/** Generic rubber-band drag-to-select overlay. Renders a portal-mounted
 *  rect inside the container while the user drags. AutoCAD convention:
 *  window mode (L→R) = solid brand ring, crossing mode (R→L) = dashed
 *  emerald ring. Geometry lives in `useMarqueeDrag`. Lifted from
 *  notion-page-clone CK-1D Phase 3. */

import { createPortal } from "react-dom";
import { useMarqueeDrag } from "./useMarqueeDrag";
import type { MarqueeProps } from "./marquee-types";

export function Marquee(props: MarqueeProps) {
  const rect = useMarqueeDrag(props);
  if (!rect || !props.containerRef.current) return null;
  const isWindow = rect.mode === "window";
  return createPortal(
    <div
      aria-hidden
      className={
        isWindow
          ? "pointer-events-none absolute z-40 rounded-sm bg-primary/10 ring-1 ring-primary/60"
          : "pointer-events-none absolute z-40 rounded-sm bg-emerald-500/10 ring-1 ring-emerald-500/60 outline-dashed outline-1 outline-emerald-500/70"
      }
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
    />,
    props.containerRef.current,
  );
}
