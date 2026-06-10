"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHead } from "../../ui/section-head";
import { Stagger } from "../../motion";
import {
  cfgArray,
  cfgString,
  isPricingTier,
  parseConfigObject,
  type PricingTier,
} from "./config";
import type { LandingSection } from "../types";

const GRID_COLS: Record<number, string> = {
  1: "max-w-md",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Pricing tier cards — featured tier gets a ring + badge. Content
 * priority: section.config { tiers } > props.tiers. Renders inside
 * LandingSectionShell (caller wraps).
 */
export function PricingSection({
  section,
  tiers,
  featuredBadge = "Paling populer",
  eyebrow = "Harga",
  className,
}: {
  section: LandingSection;
  tiers: PricingTier[];
  featuredBadge?: string;
  /** Section eyebrow. Default "Harga"; override per-locale or via config.eyebrow. */
  eyebrow?: string;
  className?: string;
}) {
  const cfg = parseConfigObject(section.config);
  const list = cfgArray(cfg, "tiers", isPricingTier) ?? tiers;
  if (list.length === 0) return null;
  const cols = GRID_COLS[Math.min(list.length, 4)] ?? GRID_COLS[3];
  const eyebrowText = cfgString(cfg, "eyebrow") ?? eyebrow;

  return (
    <div className={cn("mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20", className)}>
      <SectionHead align="center" eyebrow={eyebrowText} title={section.title} subtitle={section.subtitle} />
      <div className={cn("mx-auto mt-10 grid gap-4", cols)}>
        <Stagger itemClassName="h-full">
          {list.map((t) => (
            <Card
              key={t.name}
              className={cn(
                "relative h-full border-border/60 bg-card/50 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg",
                t.featured && "border-foreground/30 ring-1 ring-foreground/20 shadow-md",
              )}
            >
              <CardContent className="flex h-full flex-col gap-4 p-6">
                {t.featured && (
                  <Badge className="absolute -top-2.5 left-5">{featuredBadge}</Badge>
                )}
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {t.name}
                  </p>
                  <p className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tracking-tight">{t.price}</span>
                    {t.period && <span className="text-sm text-muted-foreground">{t.period}</span>}
                  </p>
                  {t.blurb && <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>}
                </div>
                <ul className="flex-1 space-y-2 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-foreground/70" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                {t.ctaHref && (
                  <Button asChild variant={t.featured ? "default" : "outline"} className="w-full">
                    <Link href={t.ctaHref}>
                      {t.ctaLabel ?? "Pilih paket"} <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
