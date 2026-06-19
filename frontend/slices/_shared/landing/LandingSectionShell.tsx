"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "../motion/use-in-view";
import type { LandingSection } from "./types";

interface Props {
  section: LandingSection;
  children: React.ReactNode;
  /** Optional template-default classes (e.g. "border-b py-12"). Merged
   *  before the section's user-provided className so admin overrides win. */
  defaultClassName?: string;
}

/**
 * DRY wrapper every LandingRenderer kind wraps its output in. Applies
 * the admin-editable `bgImageUrl` (full-bleed background + readability
 * overlay) and appends `section.className` (custom Tailwind) to the
 * outer container. Renderers don't need to know about those fields —
 * just pass `section` through.
 */
export function LandingSectionShell({ section, children, defaultClassName }: Props) {
  const hasBg = Boolean(section.bgImageUrl);
  // Scroll reveal: the shell fades up as a unit and doubles as the
  // `.is-inview` scope for any `data-reveal` descendants (motion kit).
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.05 });
  return (
    <section
      ref={ref}
      data-reveal="fade-up"
      className={cn(
        "relative",
        inView && "is-inview",
        defaultClassName,
        section.className,
        hasBg && "isolate overflow-hidden text-foreground",
      )}
    >
      {hasBg && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={section.bgImageUrl}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Soft readability scrim — keeps text legible but the bg
              image stays clearly visible (AL-A fix: was bg/70 blanket). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/10 to-background/60"
          />
        </>
      )}
      {children}
    </section>
  );
}
