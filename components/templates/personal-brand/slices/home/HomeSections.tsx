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
  PortfolioListSection,
  type PortfolioItem as SlicePortfolioItem,
} from "@/features/portfolio-section";
import {
  PricingSection,
  type PricingTier as SliceTier,
} from "@/features/pricing-page";
import {
  TestimonialsGridSection,
  type Testimonial as SliceTestimonial,
} from "@/features/testimonials-grid";
import { usePortfolio, usePublishedPosts, useServices } from "../../shared/store";
import { PUBLIC_BASE } from "../../shared/nav-config";
import { STATS, TESTIMONIALS } from "./home-data";

export function StatsStrip() {
  return (
    <section className="border-y border-border/50 bg-muted/20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="text-3xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturedPosts({ posts }: { posts: ReturnType<typeof usePublishedPosts> }) {
  const items: SliceBlogPost[] = posts.map((p) => ({
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
        title="Tulisan terbaru"
        subtitle="Esai panjang & catatan singkat — strategy, engineering, refleksi."
        posts={items}
        hrefFor={(p) => `${PUBLIC_BASE}/blog/${p.slug}`}
        columns={3}
        layout="cards"
        limit={3}
      />
      <div className="mx-auto -mt-12 max-w-6xl px-6 text-right">
        <Button asChild variant="ghost" size="sm">
          <Link href={`${PUBLIC_BASE}/blog`}>
            Semua tulisan <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </>
  );
}

export function PortfolioStrip({ items }: { items: ReturnType<typeof usePortfolio> }) {
  const sliceItems: SlicePortfolioItem[] = items.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.blurb,
    tags: [p.category],
    cover: { src: p.cover, alt: p.title },
  }));
  return (
    <section className="border-y border-border/50 bg-muted/10">
      <PortfolioListSection
        eyebrow="Portfolio"
        title="Karya terpilih"
        subtitle="Case study dengan struktur problem→approach→result."
        items={sliceItems}
        hrefFor={(p) => `${PUBLIC_BASE}/portfolio/${p.slug}`}
        layout="uniform"
        columns={2}
      />
      <div className="mx-auto -mt-12 max-w-6xl px-6 pb-8 text-right">
        <Button asChild variant="ghost" size="sm">
          <Link href={`${PUBLIC_BASE}/portfolio`}>
            Lihat semua <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function ServicesBand({ services }: { services: ReturnType<typeof useServices> }) {
  const tiers: SliceTier[] = services.map((s) => ({
    id: s.id,
    name: s.name,
    price: s.priceLabel,
    period: s.period,
    blurb: s.description,
    bullets: s.bullets,
    featured: s.featured,
    badge: s.featured ? "Most picked" : undefined,
    cta: { label: "Book consultation", href: `${PUBLIC_BASE}/services#${s.slug}` },
  }));
  return (
    <>
      <PricingSection
        eyebrow="Services"
        title="Cara kerja sama"
        subtitle="Pilih yang paling sesuai konteks tim atau kariermu."
        tiers={tiers}
      />
      <div className="mx-auto -mt-12 max-w-6xl px-6 pb-8 text-right">
        <Button asChild variant="ghost" size="sm">
          <Link href={`${PUBLIC_BASE}/services`}>
            Detail <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </>
  );
}

export function TestimonialsGrid() {
  const items: SliceTestimonial[] = TESTIMONIALS.map((t, i) => ({
    id: `t-${i}`,
    quote: t.quote,
    author: t.name,
    role: t.role,
  }));
  return (
    <section className="border-y border-border/50 bg-muted/10">
      <TestimonialsGridSection
        eyebrow="Testimonials"
        title="Apa kata mereka"
        subtitle="Sebagian feedback dari klien dan student."
        items={items}
        columns={2}
        layout="cards"
      />
    </section>
  );
}
