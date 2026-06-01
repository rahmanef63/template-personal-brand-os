import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { PortfolioCard } from "../components/PortfolioCard";
import { ProjectMeta } from "../components/ProjectMeta";
import type { PortfolioItem } from "./PortfolioListSection";

export type PortfolioDetailViewProps = {
  item: PortfolioItem;
  backHref?: string;
  /** Render markdown/plain body. Default: split on \n\n into <p>. */
  renderBody?: (body: string) => ReactNode;
  /** Show related items below (next/prev or "More work"). */
  related?: PortfolioItem[];
  hrefForRelated?: (item: PortfolioItem) => string;
  /** Optional slot rendered after body+gallery+link, before related. */
  afterContent?: ReactNode;
  className?: string;
};

const SECTION_COLS: Record<2 | 3, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

function Sections({ sections }: { sections: NonNullable<PortfolioItem["sections"]> }) {
  if (sections.length === 0) return null;
  const cols = sections.length === 2 ? 2 : sections.length >= 3 ? 3 : 1;
  return (
    <div className={cn("grid grid-cols-1 gap-6", cols !== 1 && SECTION_COLS[cols as 2 | 3])}>
      {sections.map((s, i) => (
        <Card key={s.id ?? `${s.heading}-${i}`} className="border-border/60 bg-card/60">
          <CardContent className="p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {s.heading}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{s.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function defaultRenderBody(body: string): ReactNode {
  const paras = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paras.map((p, i) => (
    <p key={i} className="mb-4 text-base leading-relaxed text-foreground/90 last:mb-0">
      {p}
    </p>
  ));
}

function Gallery({ images }: { images: NonNullable<PortfolioItem["gallery"]> }) {
  if (images.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {images.map((img, i) => (
        <div
          key={`${img.src}-${i}`}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted"
        >
          <Image src={img.src} alt={img.alt} fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}

function Related({
  items,
  hrefFor,
}: {
  items: PortfolioItem[];
  hrefFor: (item: PortfolioItem) => string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-8 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold leading-tight">More work</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((rel) => (
          <PortfolioCard
            key={rel.id}
            item={rel}
            href={hrefFor(rel)}
            variant="uniform"
          />
        ))}
      </div>
    </section>
  );
}

export function PortfolioDetailView({
  item,
  backHref,
  renderBody,
  related,
  hrefForRelated,
  afterContent,
  className,
}: PortfolioDetailViewProps) {
  const body = item.body ?? "";
  const render = renderBody ?? defaultRenderBody;
  const relHref = hrefForRelated ?? ((r: PortfolioItem) => `/portfolio/${r.slug}`);

  return (
    <article className={cn("w-full px-6 py-16 md:py-24", className)}>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        {backHref ? (
          <Button asChild variant="link" size="sm" className="h-auto self-start p-0">
            <Link href={backHref}>&larr; All work</Link>
          </Button>
        ) : null}

        <header className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
            {item.title}
          </h1>
          {item.summary ? (
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
          ) : null}
          <ProjectMeta
            year={item.year}
            client={item.client}
            role={item.role}
            tags={item.tags}
            maxTags={8}
          />
        </header>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={item.cover.src}
            alt={item.cover.alt}
            fill
            className="object-cover"
            priority
          />
        </div>

        <Separator />

        {item.sections && item.sections.length > 0 ? (
          <Sections sections={item.sections} />
        ) : null}

        {body ? (
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {render(body)}
          </div>
        ) : !item.sections?.length ? (
          <p className="text-sm text-muted-foreground">No description.</p>
        ) : null}

        {item.gallery && item.gallery.length > 0 ? (
          <Gallery images={item.gallery} />
        ) : null}

        {item.link ? (
          <div>
            <Button asChild variant="default" size="lg">
              <Link href={item.link.href} target="_blank" rel="noreferrer">
                {item.link.label}
              </Link>
            </Button>
          </div>
        ) : null}

        {afterContent}

        {related && related.length > 0 ? (
          <Related items={related} hrefFor={relHref} />
        ) : null}
      </div>
    </article>
  );
}
