"use client";

import * as React from "react";
import {
  CtaBand,
  FeatureGrid,
  SectionHead,
} from "@/features/_shared";
import type { LandingSection } from "@/features/_shared/landing/types";
import { LandingSectionShell } from "@/features/_shared/landing/LandingSectionShell";
import { parseConfigBadge } from "@/features/_shared/landing/parse-config";
import {
  cfgArray,
  cfgNumber,
  cfgString,
  isTestimonialItem,
  parseConfigObject,
  CustomSection,
  FaqSection,
  PricingSection,
  StatsSection,
} from "@/features/_shared/landing/sections";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { Hero } from "./Hero";
import { NewsletterBlock } from "./NewsletterBlock";
import {
  PortfolioStrip,
  ServicesBand,
  TestimonialsGrid,
} from "./HomeSections";
import {
  BlogTeaser,
  BRAND_CLIENTS,
  BRAND_FAQS,
  BRAND_STATS,
  BRAND_TIERS,
} from "./LandingExtras";
import { resolveFeatureItems } from "./feature-config";
import type {
  Service,
  PortfolioItem,
  Post,
} from "@/features/_app/types";

interface Deps {
  posts: Post[];
  portfolio: PortfolioItem[];
  services: Service[];
}

/**
 * Personal-brand landing renderer. Maps each enabled section.kind to
 * its template-side component, threading admin-editable title / subtitle
 * through; section.config JSON overrides the template defaults that live
 * in LandingExtras (see _shared/landing/sections/config.ts for keys).
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
            layers={section.layers}
          />
        </LandingSectionShell>
      );

    case "stats":
      return (
        <LandingSectionShell section={section} defaultClassName="border-y border-border/50 bg-muted/10">
          <StatsSection section={section} stats={BRAND_STATS} clients={BRAND_CLIENTS} />
        </LandingSectionShell>
      );

    case "features":
      return (
        <LandingSectionShell section={section} defaultClassName="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead eyebrow="Fokus" title={section.title} subtitle={section.subtitle} />
          <FeatureGrid items={resolveFeatureItems(section.config)} columns={4} className="mt-10" />
        </LandingSectionShell>
      );

    case "blog":
    case "changelog":
      return (
        <LandingSectionShell section={section}>
          <BlogTeaser section={section} posts={deps.posts} />
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

    case "testimonials": {
      const cfg = parseConfigObject(section.config);
      const fromConfig = cfgArray(cfg, "items", isTestimonialItem)?.map((t, i) => ({
        id: `cfg-${i}`,
        quote: t.quote,
        author: t.author,
        role: t.role,
      }));
      return (
        <LandingSectionShell section={section}>
          <TestimonialsGrid
            title={section.title}
            subtitle={section.subtitle}
            items={fromConfig}
            limit={cfgNumber(cfg, "limit")}
          />
        </LandingSectionShell>
      );
    }

    case "pricing":
      return (
        <LandingSectionShell section={section} defaultClassName="border-y border-border/50 bg-muted/10">
          <PricingSection section={section} tiers={BRAND_TIERS} />
        </LandingSectionShell>
      );

    case "faq":
      return (
        <LandingSectionShell section={section}>
          <FaqSection
            section={section}
            items={BRAND_FAQS}
            ctaLabel="Hubungi saya"
            ctaHref={`${PUBLIC_BASE}/contact`}
          />
        </LandingSectionShell>
      );

    case "cta": {
      const cfg = parseConfigObject(section.config);
      return (
        <LandingSectionShell section={section}>
          <CtaBand
            title={section.title}
            subtitle={section.subtitle ?? "Ceritakan konteksmu — dibalas dalam 1×24 jam kerja."}
            cta={{
              label: cfgString(cfg, "ctaLabel") ?? "Book a call",
              href: cfgString(cfg, "ctaHref") ?? `${PUBLIC_BASE}/contact`,
            }}
          />
        </LandingSectionShell>
      );
    }

    case "newsletter": {
      const cfg = parseConfigObject(section.config);
      return (
        <LandingSectionShell section={section}>
          <NewsletterBlock
            title={section.title}
            subtitle={section.subtitle}
            placeholder={cfgString(cfg, "placeholder")}
            buttonLabel={cfgString(cfg, "buttonLabel")}
          />
        </LandingSectionShell>
      );
    }

    case "custom":
      return (
        <LandingSectionShell section={section}>
          <CustomSection section={section} />
        </LandingSectionShell>
      );

    default:
      return null;
  }
}
