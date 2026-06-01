"use client";

import * as React from "react";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import { LandingSectionShell } from "@/components/templates/_shared/landing/LandingSectionShell";
import { parseConfigBadge } from "@/components/templates/_shared/landing/parse-config";
import { Hero } from "./Hero";
import { NewsletterBlock } from "./NewsletterBlock";
import {
  FeaturedPosts,
  PortfolioStrip,
  ServicesBand,
  StatsStrip,
  TestimonialsGrid,
} from "./HomeSections";
import type {
  Service,
  PortfolioItem,
  Post,
} from "../../shared/types";

interface Deps {
  posts: Post[];
  portfolio: PortfolioItem[];
  services: Service[];
}

/**
 * Personal-brand landing renderer. Maps each enabled section.kind to
 * its template-side component, threading admin-editable title / subtitle
 * through. Unknown kinds render a minimal stub so admin still sees them
 * without crashing the page.
 */
export function renderLanding(section: LandingSection, deps: Deps) {
  switch (section.kind) {
    case "hero":
      return (
        <LandingSectionShell section={section}>
          <Hero
            title={section.title}
            subtitle={section.subtitle}
            badge={parseConfigBadge(section.config)}
            image={section.imageUrl ? { url: section.imageUrl, ratio: section.imageRatio } : undefined}
          />
        </LandingSectionShell>
      );

    case "stats":
      return (
        <LandingSectionShell section={section}>
          <StatsStrip />
        </LandingSectionShell>
      );

    case "blog":
      return (
        <LandingSectionShell section={section}>
          <FeaturedPosts posts={deps.posts.slice(0, 3)} />
        </LandingSectionShell>
      );

    case "portfolio":
      return (
        <LandingSectionShell section={section}>
          <PortfolioStrip items={deps.portfolio.slice(0, 4)} />
        </LandingSectionShell>
      );

    case "services":
      return (
        <LandingSectionShell section={section}>
          <ServicesBand services={deps.services} />
        </LandingSectionShell>
      );

    case "testimonials":
      return (
        <LandingSectionShell section={section}>
          <TestimonialsGrid />
        </LandingSectionShell>
      );

    case "newsletter":
    case "cta":
      return (
        <LandingSectionShell section={section}>
          <NewsletterBlock />
        </LandingSectionShell>
      );

    case "features":
    case "pricing":
    case "changelog":
    case "faq":
    case "custom":
      return (
        <LandingSectionShell
          section={section}
          defaultClassName="border-y border-border/40 bg-muted/10 py-12"
        >
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {section.kind}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {section.title}
            </h2>
            {section.subtitle ? (
              <p className="mt-3 text-sm text-muted-foreground">{section.subtitle}</p>
            ) : null}
          </div>
        </LandingSectionShell>
      );

    default:
      return null;
  }
}

