"use client";

import * as React from "react";
import { useStore } from "@/components/templates/personal-brand/shared/store";

/**
 * Full-screen splash shown until the public site's Convex data is 100% loaded,
 * then fades out to reveal the site. Has a hard timeout so a slow/unreachable
 * backend can never leave a visitor stuck on the loader forever.
 */
export function SiteLoader({ brandLetter = "•" }: { brandLetter?: string }) {
  const { ready, progress } = useStore();
  const [done, setDone] = React.useState(false);
  const [removed, setRemoved] = React.useState(false);
  const [creep, setCreep] = React.useState(12);

  // Safety net — never block the site for more than 8s.
  React.useEffect(() => {
    const t = setTimeout(() => setDone(true), 8000);
    return () => clearTimeout(t);
  }, []);

  // Reveal as soon as data is ready.
  React.useEffect(() => {
    if (ready) setDone(true);
  }, [ready]);

  // Gentle creep so the bar always feels alive while waiting.
  React.useEffect(() => {
    if (done) return;
    const i = setInterval(() => setCreep((c) => Math.min(c + 5, 92)), 220);
    return () => clearInterval(i);
  }, [done]);

  // Unmount after the fade-out finishes.
  React.useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setRemoved(true), 500);
    return () => clearTimeout(t);
  }, [done]);

  if (removed) return null;
  const pct = done ? 100 : Math.max(progress, creep);

  return (
    <div
      aria-hidden={done}
      className={`fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-500 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-[220px] px-6 text-center">
        <div className="mx-auto mb-6 grid size-12 animate-pulse place-items-center rounded-xl bg-foreground text-lg font-bold text-background">
          {brandLetter}
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-3 text-xs tabular-nums text-muted-foreground">{pct}%</p>
      </div>
    </div>
  );
}
