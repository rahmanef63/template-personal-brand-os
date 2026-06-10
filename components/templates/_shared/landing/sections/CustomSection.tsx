"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "../../motion";
import { ASPECT_RATIO_CLASS } from "../types";
import {
  cfgArray,
  cfgString,
  isString,
  parseConfigObject,
} from "./config";
import type { LandingSection } from "../types";

/**
 * Free-form content section — title + body paragraphs (+ optional CTA +
 * optional side image via section.imageUrl). Replaces the old "custom"
 * stub. Config keys: { body: string[], ctaLabel, ctaHref }.
 * Renders inside LandingSectionShell (caller wraps).
 */
export function CustomSection({
  section,
  body,
  className,
}: {
  section: LandingSection;
  /** Default paragraphs when config.body is absent. */
  body?: string[];
  className?: string;
}) {
  const cfg = parseConfigObject(section.config);
  const paragraphs = cfgArray(cfg, "body", isString) ?? body ?? [];
  const ctaLabel = cfgString(cfg, "ctaLabel");
  const ctaHref = cfgString(cfg, "ctaHref");
  const hasImage = Boolean(section.imageUrl);

  return (
    <div
      className={cn(
        "mx-auto max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20",
        hasImage ? "grid items-center md:grid-cols-2" : "max-w-3xl",
        className,
      )}
    >
      <Reveal>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{section.title}</h2>
        {section.subtitle && (
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">{section.subtitle}</p>
        )}
        {paragraphs.length > 0 && (
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
        {ctaLabel && ctaHref && (
          <Button asChild className="mt-6">
            <Link href={ctaHref}>
              {ctaLabel} <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </Reveal>
      {hasImage && (
        <Reveal variant="fade-right" delay={150}>
          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-border/60 shadow-lg",
              ASPECT_RATIO_CLASS[section.imageRatio ?? "4:3"],
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.imageUrl}
              alt={section.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.display = "none";
              }}
            />
          </div>
        </Reveal>
      )}
    </div>
  );
}
