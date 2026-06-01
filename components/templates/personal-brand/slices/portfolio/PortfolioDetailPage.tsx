"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PortfolioDetailView,
  type PortfolioItem as SliceItem,
} from "@/features/portfolio-section";
import { usePortfolio, usePortfolioItem } from "../../shared/store";
import { PUBLIC_BASE } from "../../shared/nav-config";

/**
 * Hybrid wrapper: case-study detail via canonical PortfolioDetailView
 * slice. Problem/Approach/Result populate the new `sections` field
 * (auto 3-col). "Mau hasil serupa?" CTA card + related rendered via
 * afterContent + related slots.
 */
export function PortfolioDetailPage({ slug }: { slug: string }) {
  const item = usePortfolioItem(slug);
  const all = usePortfolio();

  if (!item) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="text-sm text-muted-foreground">Case study tidak ditemukan.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href={`${PUBLIC_BASE}/portfolio`}><ArrowLeft className="size-4" /> Kembali</Link>
        </Button>
      </section>
    );
  }

  const related = all.filter((p) => p.id !== item.id && p.category === item.category).slice(0, 3);

  const sliceItem: SliceItem = {
    id: item.id,
    slug: item.slug,
    title: item.title,
    summary: item.blurb,
    tags: [item.category],
    cover: { src: item.cover, alt: item.title },
    sections: [
      { id: "problem", heading: "Problem", body: item.problem },
      { id: "approach", heading: "Approach", body: item.approach },
      { id: "result", heading: "Result", body: item.result },
    ],
  };

  const relatedItems: SliceItem[] = related.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.blurb,
    tags: [r.category],
    cover: { src: r.cover, alt: r.title },
  }));

  return (
    <PortfolioDetailView
      item={sliceItem}
      backHref={`${PUBLIC_BASE}/portfolio`}
      related={relatedItems}
      hrefForRelated={(r) => `${PUBLIC_BASE}/portfolio/${r.slug}`}
      afterContent={
        <Card className="border-border/60 bg-gradient-to-br from-card/80 to-muted/20">
          <CardContent className="flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Mau hasil serupa?</h3>
              <p className="text-sm text-muted-foreground">Mulai dari office hours 30 menit, gratis untuk first-timer.</p>
            </div>
            <Button asChild>
              <Link href={`${PUBLIC_BASE}/services`}>Lihat layanan <ArrowUpRight className="size-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      }
    />
  );
}
