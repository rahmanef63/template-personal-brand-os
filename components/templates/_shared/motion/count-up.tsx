"use client";

import * as React from "react";
import { useInView } from "./use-in-view";

/**
 * Animates 0 → value once scrolled into view (rAF + ease-out cubic).
 * Reduced-motion users jump straight to the final number. Use for stat
 * rows where the value is numeric; keep prefix/suffix ("+", "rb", "%")
 * as plain siblings.
 */
export function CountUp({
  value,
  duration = 1200,
  format,
  locale = "id-ID",
  className,
}: {
  value: number;
  duration?: number;
  /** custom formatter; overrides `locale`. */
  format?: (n: number) => string;
  /** thousands-separator locale when no `format` given. Default "id-ID". */
  locale?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {format ? format(display) : display.toLocaleString(locale)}
    </span>
  );
}
