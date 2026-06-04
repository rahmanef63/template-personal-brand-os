"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type MarqueeMode = "window" | "crossing";
export interface MarqueeRect { x: number; y: number; w: number; h: number; mode: MarqueeMode }

export interface UseMarqueeOpts {
  /** The positioned (relative) drag surface that contains the items. */
  containerRef: RefObject<HTMLElement | null>;
  /** CSS selector for selectable items inside the container. */
  itemSelector: string;
  getItemId: (el: HTMLElement) => string | undefined;
  /** Called on every move with the current hit set. */
  onSelect: (ids: string[], additive: boolean, mode: MarqueeMode) => void;
  /** Fired once when a drag actually begins (threshold crossed). */
  onDragStart?: (additive: boolean) => void;
  /** Existing selection to union with while Shift/Cmd-dragging (additive). */
  getBaseline?: () => string[];
  /** Bail on pointerdown inside this selector (e.g. nested DB blocks). */
  skipSelector?: string;
  /** AutoCAD direction modes: drag-right = window (enclose), drag-left =
   *  crossing (intersect). When false, always crossing. */
  autocad?: boolean;
}

const THRESHOLD = 4;
const INTERACTIVE =
  "input,textarea,button,a,select,[contenteditable='true'],[role='button'],[data-no-marquee]";

/** Rubber-band marquee drag over a container. Returns the live rect (null
 *  when idle) so a component can portal-render it. Mouse/pen only — touch is
 *  ignored so scrolling still works. */
export function useMarquee(opts: UseMarqueeOpts): MarqueeRect | null {
  const [rect, setRect] = useState<MarqueeRect | null>(null);
  const ref = useRef(opts);
  ref.current = opts;

  useEffect(() => {
    const container = opts.containerRef.current;
    if (!container) return;
    let armed = false, active = false, additive = false;
    let startX = 0, startY = 0, baseline: string[] = [];
    const origin = () => container.getBoundingClientRect();

    const collect = (r: MarqueeRect): string[] => {
      const o = origin();
      const hits = new Set(baseline);
      container.querySelectorAll<HTMLElement>(ref.current.itemSelector).forEach((el) => {
        const id = ref.current.getItemId(el);
        if (!id) return;
        const b = el.getBoundingClientRect();
        const ix = b.left - o.left + container.scrollLeft;
        const iy = b.top - o.top + container.scrollTop;
        const hit = ix < r.x + r.w && ix + b.width > r.x && iy < r.y + r.h && iy + b.height > r.y;
        if (!hit) return;
        const enclosed = ix >= r.x && iy >= r.y && ix + b.width <= r.x + r.w && iy + b.height <= r.y + r.h;
        if (r.mode === "window" ? enclosed : hit) hits.add(id);
      });
      return [...hits];
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === "touch") return;
      const t = e.target as HTMLElement;
      if (!container.contains(t) || t.closest(INTERACTIVE)) return;
      if (ref.current.skipSelector && t.closest(ref.current.skipSelector)) return;
      armed = true; active = false;
      additive = e.shiftKey || e.metaKey || e.ctrlKey;
      const o = origin();
      startX = e.clientX - o.left + container.scrollLeft;
      startY = e.clientY - o.top + container.scrollTop;
      baseline = additive && ref.current.getBaseline ? ref.current.getBaseline() : [];
    };
    const onMove = (e: PointerEvent) => {
      if (!armed) return;
      const o = origin();
      const curX = e.clientX - o.left + container.scrollLeft;
      const curY = e.clientY - o.top + container.scrollTop;
      if (!active) {
        if (Math.abs(curX - startX) < THRESHOLD && Math.abs(curY - startY) < THRESHOLD) return;
        active = true;
        ref.current.onDragStart?.(additive);
      }
      const cad = ref.current.autocad;
      const mode: MarqueeMode = cad && curX < startX ? "crossing" : cad ? "window" : "crossing";
      const r: MarqueeRect = {
        x: Math.min(startX, curX), y: Math.min(startY, curY),
        w: Math.abs(curX - startX), h: Math.abs(curY - startY), mode,
      };
      setRect(r);
      ref.current.onSelect(collect(r), additive, mode);
    };
    const onUp = () => { armed = false; active = false; setRect(null); };

    container.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      container.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [opts.containerRef]);

  return rect;
}
