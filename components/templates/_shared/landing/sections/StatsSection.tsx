"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CountUp, Marquee, Stagger } from "../../motion";
import {
  cfgArray,
  isStatItem,
  isString,
  parseConfigObject,
  type StatItem,
} from "./config";
import type { LandingSection } from "../types";

/**
 * Stats band — CountUp numerals + optional client-name marquee strip.
 * Content priority: section.config { stats, clients } > props (template
 * defaults). Renders inside LandingSectionShell (caller wraps).
 */
export function StatsSection({
  section,
  stats,
  clients,
  locale = "id-ID",
  className,
}: {
  section: LandingSection;
  stats: StatItem[];
  /** Client/brand names for the marquee strip; omit to hide it. */
  clients?: string[];
  /** Thousands-separator locale for the CountUp numerals. Default "id-ID". */
  locale?: string;
  className?: string;
}) {
  const cfg = parseConfigObject(section.config);
  const items = cfgArray(cfg, "stats", isStatItem) ?? stats;
  const names = cfgArray(cfg, "clients", isString) ?? clients;

  return (
    <div className={cn("mx-auto max-w-6xl px-4 py-14 sm:px-6", className)}>
      {(section.title || section.subtitle) && (
        <div className="mb-8 text-center">
          {section.title && (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {section.title}
            </p>
          )}
          {section.subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <Stagger step={70}>
          {items.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-semibold tabular-nums tracking-tight md:text-4xl">
                {s.prefix}
                <CountUp value={s.value} locale={locale} />
                {s.suffix}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </Stagger>
      </div>

      {names && names.length > 0 && (
        <Marquee speed={32} className="mt-10">
          {names.map((n) => (
            <span
              key={n}
              className="text-sm font-medium uppercase tracking-widest text-muted-foreground/70"
            >
              {n}
            </span>
          ))}
        </Marquee>
      )}
    </div>
  );
}
