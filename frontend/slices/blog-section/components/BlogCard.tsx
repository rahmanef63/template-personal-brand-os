import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { PostMeta } from "./PostMeta";
import type { BlogPost } from "../views/BlogListSection";

export type BlogCardProps = {
  post: BlogPost;
  href: string;
  /** Visual variant — matches BlogListSection layout. */
  variant?: "cards" | "list" | "featured";
  className?: string;
};

function Cover({
  cover,
  variant,
}: {
  cover?: BlogPost["cover"];
  variant: NonNullable<BlogCardProps["variant"]>;
}) {
  if (!cover) return null;
  const ratio = variant === "featured" ? "aspect-[16/10]" : "aspect-video";
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md border bg-muted",
        ratio,
      )}
    >
      <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
    </div>
  );
}

export function BlogCard({ post, href, variant = "cards", className }: BlogCardProps) {
  if (variant === "list") {
    return (
      <article className={cn("flex flex-col gap-2 py-6", className)}>
        <Link href={href} className="group">
          <h3 className="text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </Link>
        {post.excerpt ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        ) : null}
        <PostMeta
          author={post.author}
          publishedAt={post.publishedAt}
          tags={post.tags}
        />
      </article>
    );
  }

  const isFeatured = variant === "featured";

  return (
    <Card
      className={cn(
        "group h-full overflow-hidden transition-shadow hover:shadow-md",
        className,
      )}
    >
      <Link href={href} className="flex h-full flex-col">
        {post.cover ? (
          <div className={cn(isFeatured ? "p-0" : "p-4 pb-0")}>
            <Cover cover={post.cover} variant={variant} />
          </div>
        ) : null}
        <CardHeader className="flex flex-col gap-2">
          <CardTitle
            className={cn(
              "leading-snug transition-colors group-hover:text-primary",
              isFeatured ? "text-2xl md:text-3xl" : "text-lg",
            )}
          >
            {post.title}
          </CardTitle>
          {post.excerpt ? (
            <CardDescription className="text-sm leading-relaxed">
              {post.excerpt}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="mt-auto">
          <PostMeta
            author={post.author}
            publishedAt={post.publishedAt}
            tags={post.tags}
          />
        </CardContent>
      </Link>
    </Card>
  );
}
