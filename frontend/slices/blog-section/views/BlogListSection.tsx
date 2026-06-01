import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { BlogCard } from "../components/BlogCard";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  /** markdown/plain — used only for detail view. */
  body?: string;
  author?: string;
  /** ms timestamp. */
  publishedAt: number;
  tags?: string[];
  cover?: { src: string; alt: string };
};

export type BlogListSectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  posts: BlogPost[];
  /** Per-post URL builder. Required so each template controls routing. */
  hrefFor: (post: BlogPost) => string;
  columns?: 1 | 2 | 3;
  layout?: "cards" | "list" | "featured-split";
  /** Show first post as hero card. Used by "featured-split". */
  showFeatured?: boolean;
  /** Max items rendered. Useful for "Recent posts" excerpts on home pages. */
  limit?: number;
  align?: "left" | "center";
  className?: string;
};

const COLS: Record<NonNullable<BlogListSectionProps["columns"]>, string> = {
  1: "lg:grid-cols-1",
  2: "sm:grid-cols-2 lg:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

function Header({
  eyebrow,
  title,
  subtitle,
  align,
}: Pick<BlogListSectionProps, "eyebrow" | "title" | "subtitle"> & {
  align: NonNullable<BlogListSectionProps["align"]>;
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

function FeaturedSplit({
  posts,
  hrefFor,
}: {
  posts: BlogPost[];
  hrefFor: BlogListSectionProps["hrefFor"];
}) {
  const [hero, ...rest] = posts;
  const side = rest.slice(0, 4);
  if (!hero) return null;
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <BlogCard post={hero} href={hrefFor(hero)} variant="featured" />
      </div>
      <div className="flex flex-col gap-4">
        {side.map((p) => (
          <BlogCard key={p.id} post={p} href={hrefFor(p)} variant="cards" />
        ))}
      </div>
    </div>
  );
}

function ListLayout({
  posts,
  hrefFor,
}: {
  posts: BlogPost[];
  hrefFor: BlogListSectionProps["hrefFor"];
}) {
  return (
    <div className="flex flex-col divide-y">
      {posts.map((p, i) => (
        <div key={p.id} className={cn(i === 0 && "pt-0")}>
          <BlogCard post={p} href={hrefFor(p)} variant="list" />
        </div>
      ))}
      <Separator className="opacity-0" />
    </div>
  );
}

export function BlogListSection({
  eyebrow,
  title = "Blog",
  subtitle,
  posts,
  hrefFor,
  columns = 3,
  layout = "cards",
  showFeatured,
  limit,
  align = "left",
  className,
}: BlogListSectionProps) {
  const items = typeof limit === "number" ? posts.slice(0, limit) : posts;
  const useFeatured = layout === "featured-split" || (showFeatured && items.length > 0);

  return (
    <section className={cn("w-full px-6 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl">
        <Header eyebrow={eyebrow} title={title} subtitle={subtitle} align={align} />

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts yet.</p>
        ) : useFeatured ? (
          <FeaturedSplit posts={items} hrefFor={hrefFor} />
        ) : layout === "list" ? (
          <ListLayout posts={items} hrefFor={hrefFor} />
        ) : (
          <div className={cn("grid grid-cols-1 gap-6", COLS[columns])}>
            {items.map((p) => (
              <BlogCard key={p.id} post={p} href={hrefFor(p)} variant="cards" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
