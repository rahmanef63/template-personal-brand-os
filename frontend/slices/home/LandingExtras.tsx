"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BlogListSection,
  type BlogPost as SliceBlogPost,
} from "@/features/blog-section";
import {
  cfgNumber,
  parseConfigObject,
  type FaqItem,
  type PricingTier,
  type StatItem,
} from "@/features/_shared/landing/sections";
import type { LandingSection } from "@/features/_shared/landing/types";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import type { Post } from "@/features/_app/types";
import { STATS, CLIENTS, FAQS, PRICING } from "@/convex/landingContent";

/** Personal-brand default landing content lives in convex/landingContent.ts —
 *  the SINGLE source the seed also reads (it writes the same content into
 *  Convex config). These re-exports are the render fallback before the seed
 *  runs; edit the content in that module, not here. Hrefs in the module are
 *  root-relative (publicBase = ""), matching `${PUBLIC_BASE}/…`. */

export const BRAND_STATS: StatItem[] = STATS;
export const BRAND_CLIENTS = CLIENTS;
export const BRAND_FAQS: FaqItem[] = FAQS;
export const BRAND_TIERS: PricingTier[] = PRICING;

/** Latest published posts teaser — backs the "blog"/"changelog" landing
 *  kinds with real store data (admin CRUD via /admin → Blog). Honors
 *  config `{"limit":n}`; title/subtitle come from the section row. */
export function BlogTeaser({
  section,
  posts,
}: {
  section: LandingSection;
  posts: Post[];
}) {
  const limit = cfgNumber(parseConfigObject(section.config), "limit") ?? 3;
  const latest = [...posts]
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, limit);
  if (latest.length === 0) return null;

  const items: SliceBlogPost[] = latest.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    tags: [p.tag],
    cover: { src: p.cover, alt: p.title },
  }));

  return (
    <>
      <BlogListSection
        eyebrow="Blog"
        title={section.title}
        subtitle={section.subtitle}
        posts={items}
        hrefFor={(p) => `${PUBLIC_BASE}/blog/${p.slug}`}
        columns={3}
        layout="cards"
        limit={limit}
      />
      <div className="mx-auto -mt-12 max-w-6xl px-6 pb-8 text-right">
        <Button asChild variant="ghost" size="sm">
          <Link href={`${PUBLIC_BASE}/blog`}>
            Semua tulisan <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </>
  );
}
