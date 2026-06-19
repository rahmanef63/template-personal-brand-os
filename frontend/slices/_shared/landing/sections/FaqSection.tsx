"use client";

import * as React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { SectionHead } from "../../ui/section-head";
import { Reveal } from "../../motion";
import {
  cfgArray,
  cfgString,
  isFaqItem,
  parseConfigObject,
  type FaqItem,
} from "./config";
import type { LandingSection } from "../types";

/**
 * FAQ accordion. Content priority: section.config { items, ctaLabel,
 * ctaHref } > props. Renders inside LandingSectionShell (caller wraps).
 */
export function FaqSection({
  section,
  items,
  ctaLabel,
  ctaHref,
  ctaPrefix = "Masih ada pertanyaan?",
  eyebrow = "FAQ",
  className,
}: {
  section: LandingSection;
  items: FaqItem[];
  /** Escape-hatch link under the accordion (label + href). */
  ctaLabel?: string;
  ctaHref?: string;
  /** Lead-in text before the escape-hatch link. Override per-locale or via config.ctaPrefix. */
  ctaPrefix?: string;
  /** Section eyebrow. Default "FAQ". */
  eyebrow?: string;
  className?: string;
}) {
  const cfg = parseConfigObject(section.config);
  const list = cfgArray(cfg, "items", isFaqItem) ?? items;
  const label = cfgString(cfg, "ctaLabel") ?? ctaLabel;
  const href = cfgString(cfg, "ctaHref") ?? ctaHref;
  const prefix = cfgString(cfg, "ctaPrefix") ?? ctaPrefix;
  if (list.length === 0) return null;

  return (
    <div className={cn("mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20", className)}>
      <SectionHead align="center" eyebrow={eyebrow} title={section.title} subtitle={section.subtitle} />
      <Reveal delay={120} className="mt-10">
        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="rounded-xl border border-border/60 bg-card/50 px-5"
        >
          {list.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
      {label && href && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {prefix}{" "}
          <Link href={href} className="font-medium text-foreground underline underline-offset-4">
            {label}
          </Link>
        </p>
      )}
    </div>
  );
}
