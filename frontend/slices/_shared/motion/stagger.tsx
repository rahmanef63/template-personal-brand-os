"use client";

import * as React from "react";
import { Reveal, type RevealVariant } from "./reveal";

/**
 * Wraps each direct child in its own <Reveal> with an incremental delay —
 * drop inside any grid/list for a staggered scroll-in. Each item observes
 * independently, so rows below the fold still animate on scroll instead
 * of all at once.
 *
 * Inside CSS grids pass `itemClassName="h-full"` (the Reveal div becomes
 * the grid child) so equal-height cards keep working.
 */
export function Stagger({
  children,
  step = 80,
  cap = 400,
  variant = "fade-up",
  itemClassName,
}: {
  children: React.ReactNode;
  /** ms between siblings. */
  step?: number;
  /** max delay — long lists stop accumulating here. */
  cap?: number;
  variant?: RevealVariant;
  itemClassName?: string;
}) {
  const items = React.Children.toArray(children);
  return (
    <>
      {items.map((child, i) => (
        <Reveal
          key={i}
          variant={variant}
          delay={Math.min(i * step, cap)}
          className={itemClassName}
        >
          {child}
        </Reveal>
      ))}
    </>
  );
}
