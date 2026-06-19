"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite horizontal marquee for logo/client strips. Children render
 * twice and the track scrolls -50% on a loop (`marquee` keyframes in
 * globals.css). Pauses on hover; reduced-motion users get a static row.
 * Edge fade via mask keeps the loop seam invisible.
 */
export function Marquee({
  children,
  className,
  speed = 36,
}: {
  children: React.ReactNode;
  className?: string;
  /** seconds per loop — higher = slower. */
  speed?: number;
}) {
  return (
    <div
      className={cn(
        "motion-marquee relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className="motion-marquee-track flex w-max items-center gap-10"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center gap-10">{children}</div>
        <div className="flex shrink-0 items-center gap-10" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
