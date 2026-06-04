/** Marquee primitive types — separated so the hook + the renderer can
 *  share the contract without the renderer pulling React hooks. */

import type { RefObject } from "react";

export type Rect = { x: number; y: number; w: number; h: number };
export type MarqueeMode = "window" | "crossing";

export interface MarqueeProps {
  containerRef: RefObject<HTMLElement | null>;
  itemSelector: string;
  getItemId: (el: HTMLElement) => string | undefined;
  onSelect: (ids: string[], additive: boolean, mode?: MarqueeMode) => void;
  onDragStart?: (additive: boolean) => void;
  onDragEnd?: () => void;
  getBaseline?: () => string[];
  /** Pixels of movement before the marquee activates from a non-text origin. */
  threshold?: number;
  /** Press-and-hold (ms) before the marquee activates from inside editable text. */
  longPressMs?: number;
  /** Pixels of movement BEFORE the long-press fires that cancel the gesture. */
  longPressMoveCancel?: number;
  skipSelector?: string;
  /** Drop ancestor items if any descendant item is also hit (block marquee
   *  inside columns). */
  excludeAncestorsWhenDescendantHit?: boolean;
  /** AutoCAD-style: drag L→R = window (fully enclosed); R→L = crossing
   *  (any intersection). Default crossing-only. */
  autocad?: boolean;
}
