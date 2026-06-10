"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "./use-in-view";

export type RevealVariant = "fade-up" | "fade" | "fade-left" | "fade-right" | "zoom";

/**
 * Scroll-reveal wrapper. Hidden via CSS (`[data-reveal]` in globals.css,
 * gated behind prefers-reduced-motion) until the element scrolls into
 * view, then transitions in. Two modes:
 *
 * - default: this element animates with `variant` + optional `delay`.
 * - `scope` : this element only toggles `.is-inview`; descendants carry
 *   their own `data-reveal` attrs + `--reveal-delay` vars and animate
 *   together (one observer for a cluster, e.g. a hero).
 *
 * IMPORTANT: a raw `data-reveal` attr stays invisible unless it sits
 * inside an `.is-inview` scope or a motion-aware component — never
 * sprinkle the attr without one.
 */
export function Reveal({
  variant = "fade-up",
  delay = 0,
  scope = false,
  className,
  children,
}: {
  variant?: RevealVariant;
  /** ms offset once visible (stagger between siblings). */
  delay?: number;
  scope?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-reveal={scope ? undefined : variant}
      className={cn(inView && "is-inview", className)}
      style={
        delay && !scope
          ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
