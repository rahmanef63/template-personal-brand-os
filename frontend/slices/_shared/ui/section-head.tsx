"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInView } from "../motion/use-in-view";
import type { Cta } from "../types/common";

/**
 * Shared section heading.
 *
 * Two layouts supported via `align`:
 * - "left"   : eyebrow + h2 + optional subtitle, optional CTA on the right side.
 * - "center" : centered eyebrow + h2 + subtitle (no CTA — pure visual).
 */
export function SectionHead({
  eyebrow,
  title,
  subtitle,
  cta,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: Cta;
  align?: "left" | "center";
  className?: string;
}) {
  // Self-observing reveal — works standalone on list pages and inside
  // LandingSectionShell (independent observers fire together).
  const { ref, inView } = useInView<HTMLDivElement>();

  if (align === "center") {
    return (
      <div
        ref={ref}
        data-reveal="fade-up"
        className={cn("mx-auto max-w-3xl text-center", inView && "is-inview", className)}
      >
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{eyebrow}</p>
        )}
        <h2 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-base text-muted-foreground md:text-lg">{subtitle}</p>}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-reveal="fade-up"
      className={cn(
        "mb-10 flex flex-wrap items-end justify-between gap-4",
        inView && "is-inview",
        className,
      )}
    >
      <div className="max-w-xl">
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{eyebrow}</p>
        )}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      {cta && (
        <Button asChild variant="ghost" className="gap-1">
          <Link href={cta.href}>
            {cta.label} <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
