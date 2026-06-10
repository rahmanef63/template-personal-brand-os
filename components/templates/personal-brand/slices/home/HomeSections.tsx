"use client";

import * as React from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  PortfolioListSection,
  type PortfolioItem as SlicePortfolioItem,
} from "@/features/portfolio-section";
import {
  PricingSection,
  type PricingTier as SliceTier,
} from "@/features/pricing-page";
import {
  TestimonialCard,
  type Testimonial as SliceTestimonial,
} from "@/features/testimonials-grid";
import { usePortfolio, useServices } from "../../shared/store";
import { PUBLIC_BASE } from "../../shared/nav-config";
import { TESTIMONIALS } from "./home-data";

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

export function TestimonialsGrid({
  title = "Apa kata mereka",
  subtitle = "Sebagian feedback dari klien dan student.",
  items,
  limit,
}: {
  /** Landing passes admin-editable section.title / section.subtitle. */
  title?: string;
  subtitle?: string;
  /** Override list (e.g. parsed from section.config items). */
  items?: SliceTestimonial[];
  limit?: number;
} = {}) {
  const defaults: SliceTestimonial[] = TESTIMONIALS.map((t, i) => ({
    id: `t-${i}`,
    quote: t.quote,
    author: t.name,
    role: t.role,
  }));
  const list = (items ?? defaults).slice(0, limit);
  if (list.length === 0) return null;
  return (
    <section className="border-y border-border/50 bg-muted/10">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <header className="mb-8 flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Testimonials
          </span>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
          {subtitle ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {subtitle}
            </p>
          ) : null}
        </header>
        <Carousel
          opts={{ align: "start", loop: list.length > 3 }}
          plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
        >
          <div className="mb-4 flex items-center justify-end gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
          <CarouselContent>
            {list.map((t) => (
              <CarouselItem key={t.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  quote={t.quote}
                  author={t.author}
                  role={t.role}
                  className="h-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
