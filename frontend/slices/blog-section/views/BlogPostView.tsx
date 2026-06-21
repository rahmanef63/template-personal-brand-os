import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { BlogCard } from "../components/BlogCard";
import { PostMeta } from "../components/PostMeta";
import type { BlogPost } from "./BlogListSection";

export type BlogPostViewProps = {
  post: BlogPost;
  /** "All posts" link. */
  backHref?: string;
  /** Render markdown/plain body. Default: split body on \n\n into <p>. */
  renderBody?: (body: string) => ReactNode;
  /** Optional ReactNode rendered next to author + date + tags (e.g. views counter, read time). */
  extraMeta?: ReactNode;
  /** Optional slot rendered after body, before related (e.g. comments, newsletter signup). */
  afterContent?: ReactNode;
  /** Related posts grid below body. */
  related?: BlogPost[];
  hrefForRelated?: (post: BlogPost) => string;
  className?: string;
};

function Related({
  items,
  hrefFor,
}: {
  items: BlogPost[];
  hrefFor: (item: BlogPost) => string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-8 flex flex-col gap-4">
      <h2 className="text-xl font-semibold leading-tight">Related</h2>
      <ul className="flex flex-col gap-2">
        {items.map((rel) => (
          <li key={rel.id}>
            <BlogCard post={rel} href={hrefFor(rel)} variant="list" />
          </li>
        ))}
      </ul>
    </section>
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

export function BlogPostView({
  post,
  backHref,
  renderBody,
  extraMeta,
  afterContent,
  related,
  hrefForRelated,
  className,
}: BlogPostViewProps) {
  const body = post.body ?? "";
  const render = renderBody ?? defaultRenderBody;
  const relHref = hrefForRelated ?? ((r: BlogPost) => `/blog/${r.slug}`);

  return (
    <article className={cn("w-full px-6 py-16 md:py-24", className)}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {backHref ? (
          <Button asChild variant="link" size="sm" className="h-auto self-start p-0">
            <Link href={backHref}>&larr; All posts</Link>
          </Button>
        ) : null}

        <header className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <PostMeta
              author={post.author}
              publishedAt={post.publishedAt}
              tags={post.tags}
              maxTags={8}
            />
            {extraMeta}
          </div>
        </header>

        {post.cover ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        {post.excerpt ? (
          <p className="text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
        ) : null}

        <Separator />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          {body ? render(body) : (
            <p className="text-sm text-muted-foreground">No content.</p>
          )}
        </div>

        {afterContent}

        {related && related.length > 0 ? (
          <Related items={related} hrefFor={relHref} />
        ) : null}
      </div>
    </article>
  );
}
