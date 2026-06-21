"use client";

import * as React from "react";
import { Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/features/_shared/motion";

/**
 * Canonical, normalized card shape every concept's adapter maps its rows into.
 * `tags` drives the filter chips (first tag = category). `excerpt`/`cover`/`date`
 * are optional so any concept (blog, portfolio, …) fits.
 */
export type ConceptCard = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string;
  date?: number;
  tags: string[];
};

/**
 * A reusable public list page (header + filter chips + optional search + empty
 * state), delegating the actual grid to the concept's own shared section slice
 * via `renderGrid`. One component used across all templates — each template's
 * `_app/concepts` supplies the adapter (data selector + field map + grid).
 */
export type ConceptListAdapter = {
  header: { eyebrow: string; title: string; subtitle?: string };
  searchable?: boolean;
  emptyText: string;
  /** Hook: wraps the template's existing selector + maps rows → ConceptCard[]. */
  useCards: () => ConceptCard[];
  /** Delegate the filtered cards to the concept's shared section renderer. */
  renderGrid: (cards: ConceptCard[]) => React.ReactNode;
};

export function ConceptListPage({ adapter }: { adapter: ConceptListAdapter }) {
  const cards = adapter.useCards();
  const [q, setQ] = React.useState("");
  const [tag, setTag] = React.useState<string | null>(null);

  const tags = React.useMemo(
    () => Array.from(new Set(cards.flatMap((c) => c.tags).filter(Boolean))),
    [cards],
  );

  const filtered = React.useMemo(
    () =>
      cards.filter((c) => {
        if (tag && !c.tags.includes(tag)) return false;
        if (
          adapter.searchable &&
          q &&
          !(`${c.title} ${c.excerpt ?? ""}`.toLowerCase().includes(q.toLowerCase()))
        )
          return false;
        return true;
      }),
    [cards, tag, q, adapter.searchable],
  );

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {adapter.header.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {adapter.header.title}
          </h1>
          {adapter.header.subtitle ? (
            <p className="mt-2 max-w-2xl text-muted-foreground">{adapter.header.subtitle}</p>
          ) : null}
        </header>
      </Reveal>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        {adapter.searchable ? (
          <div className="relative max-w-sm flex-1">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari…"
              className="pl-3"
            />
          </div>
        ) : null}
        <Filter className="size-3.5 text-muted-foreground" />
        <Button
          variant={!tag ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setTag(null)}
        >
          All
        </Button>
        {tags.map((t) => (
          <Button
            key={t}
            variant={tag === t ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setTag(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      <Reveal delay={120}>
        {filtered.length === 0 ? (
          <Card className="border-dashed bg-muted/10 p-10 text-center text-sm text-muted-foreground">
            {adapter.emptyText}
          </Card>
        ) : (
          adapter.renderGrid(filtered)
        )}
      </Reveal>
    </section>
  );
}
