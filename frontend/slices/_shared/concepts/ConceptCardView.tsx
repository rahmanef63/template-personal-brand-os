"use client";

import Link from "next/link";
import type { ConceptCard } from "./ConceptListPage";

/**
 * The canonical reusable card for a ConceptCard — cover + tag chips + title +
 * excerpt + date. Used by ConceptListPage's default grid so any template's list
 * (blog, portfolio, showcase, …) renders with one consistent look, no bespoke
 * per-template section needed. Cover is an admin/arbitrary URL → raw <img>
 * (next/image can't take an unconfigured host); see fleet img convention.
 */
export function ConceptCardView({ card, href }: { card: ConceptCard; href: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-md"
    >
      {card.cover ? (
        <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin/arbitrary cover URL, host unknown ahead */}
          <img
            src={card.cover}
            alt={card.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        {card.tags.length ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {card.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
          {card.title}
        </h3>
        {card.excerpt ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{card.excerpt}</p>
        ) : null}
        {card.date ? (
          <p className="mt-3 text-xs text-muted-foreground">
            {new Date(card.date).toLocaleDateString()}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
