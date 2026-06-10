"use client";

import * as React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  PortfolioListSection,
  type PortfolioItem as SliceItem,
} from "@/features/portfolio-section";
import { Reveal } from "@/components/templates/_shared/motion";
import { usePortfolio } from "../../shared/store";
import { PUBLIC_BASE } from "../../shared/nav-config";

/**
 * Hybrid wrapper: filter chrome bespoke (category chips), grid delegated to
 * canonical PortfolioListSection slice. Admin edits propagate via
 * createTemplateStore BroadcastChannel.
 */
export function PortfolioListPage() {
  const items = usePortfolio();
  const [cat, setCat] = React.useState<string | null>(null);

  const cats = React.useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const filtered = cat ? items.filter((i) => i.category === cat) : items;

  const sliceItems: SliceItem[] = filtered.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.blurb,
    tags: [p.category],
    cover: { src: p.cover, alt: p.title },
  }));

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Portfolio</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Karya terpilih</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Case study dengan struktur problem→approach→result. Pilih kategori untuk filter.
          </p>
        </header>
      </Reveal>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Filter className="size-3.5 text-muted-foreground" />
        <Button
          variant={!cat ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setCat(null)}
        >
          All
        </Button>
        {cats.map((c) => (
          <Button
            key={c}
            variant={cat === c ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setCat(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      <Reveal delay={120}>
        {sliceItems.length === 0 ? (
          <Card className="border-dashed bg-muted/10 p-10 text-center text-sm text-muted-foreground">
            Belum ada case study di kategori ini.
          </Card>
        ) : (
          <PortfolioListSection
            items={sliceItems}
            hrefFor={(i) => `${PUBLIC_BASE}/portfolio/${i.slug}`}
            layout="uniform"
            columns={2}
            className="!p-0"
          />
        )}
      </Reveal>
    </section>
  );
}
