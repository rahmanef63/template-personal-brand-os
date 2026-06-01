import { cn } from "@/lib/utils";

import { PortfolioCard } from "../components/PortfolioCard";

export type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  /** long description, only used by detail view. */
  body?: string;
  /** e.g. 2025. */
  year?: number;
  /** "Acme Corp". */
  client?: string;
  /** "Lead designer". */
  role?: string;
  /** ["branding", "web", "motion"]. */
  tags?: string[];
  cover: { src: string; alt: string };
  /** detail-view images. */
  gallery?: { src: string; alt: string }[];
  /** external "view live". */
  link?: { label: string; href: string };
  /** Detail-view structured sub-sections (Brief/Outcome, Problem/Approach/Result, etc). Auto-grid by length: 2→2col, 3→3col, default stack. */
  sections?: { id?: string; heading: string; body: string }[];
};

export type PortfolioListSectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: PortfolioItem[];
  /** Per-item URL builder so each template controls routing. */
  hrefFor: (item: PortfolioItem) => string;
  columns?: 1 | 2 | 3;
  layout?: "masonry" | "uniform" | "asymmetric";
  /** Cap items shown. Useful for home-page "Selected work" excerpts. */
  limit?: number;
  align?: "left" | "center";
  className?: string;
};

const COLS: Record<NonNullable<PortfolioListSectionProps["columns"]>, string> = {
  1: "lg:grid-cols-1",
  2: "sm:grid-cols-2 lg:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

function Header({
  eyebrow,
  title,
  subtitle,
  align,
}: Pick<PortfolioListSectionProps, "eyebrow" | "title" | "subtitle"> & {
  align: NonNullable<PortfolioListSectionProps["align"]>;
}) {
  const show = Boolean(eyebrow || title || subtitle);
  if (!show) return null;
  const cls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <header className={cn("mb-12 flex flex-col gap-3", cls)}>
      {eyebrow ? (
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </span>
      ) : null}
      {title ? (
        <h2 className="text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
      ) : null}
      {subtitle ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

function MasonryLayout({
  items,
  hrefFor,
  columns,
}: {
  items: PortfolioItem[];
  hrefFor: PortfolioListSectionProps["hrefFor"];
  columns: NonNullable<PortfolioListSectionProps["columns"]>;
}) {
  const cls =
    columns === 1
      ? "columns-1"
      : columns === 2
        ? "columns-1 sm:columns-2"
        : "columns-1 sm:columns-2 lg:columns-3";
  return (
    <div className={cn(cls, "gap-6 [column-fill:_balance]")}>
      {items.map((item) => (
        <div key={item.id} className="mb-6 break-inside-avoid">
          <PortfolioCard item={item} href={hrefFor(item)} variant="masonry" />
        </div>
      ))}
    </div>
  );
}

function AsymmetricLayout({
  items,
  hrefFor,
}: {
  items: PortfolioItem[];
  hrefFor: PortfolioListSectionProps["hrefFor"];
}) {
  const [hero, ...rest] = items;
  if (!hero) return null;
  return (
    <div className="flex flex-col gap-6">
      <PortfolioCard item={hero} href={hrefFor(hero)} variant="featured" />
      {rest.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              href={hrefFor(item)}
              variant="uniform"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PortfolioListSection({
  eyebrow,
  title = "Portfolio",
  subtitle,
  items,
  hrefFor,
  columns = 3,
  layout = "uniform",
  limit,
  align = "left",
  className,
}: PortfolioListSectionProps) {
  const list = typeof limit === "number" ? items.slice(0, limit) : items;

  return (
    <section className={cn("w-full px-6 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl">
        <Header eyebrow={eyebrow} title={title} subtitle={subtitle} align={align} />

        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet.</p>
        ) : layout === "masonry" ? (
          <MasonryLayout items={list} hrefFor={hrefFor} columns={columns} />
        ) : layout === "asymmetric" ? (
          <AsymmetricLayout items={list} hrefFor={hrefFor} />
        ) : (
          <div className={cn("grid grid-cols-1 gap-6", COLS[columns])}>
            {list.map((item) => (
              <PortfolioCard
                key={item.id}
                item={item}
                href={hrefFor(item)}
                variant="uniform"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
