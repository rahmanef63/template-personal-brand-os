"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BlogPostView,
  type BlogPost as SliceBlogPost,
} from "@/features/blog-section";
import {
  usePost,
  usePublishedPosts,
  useStore,
} from "@/features/_app/store";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { NewsletterBlock } from "../home/NewsletterBlock";
import { CommentSection } from "./CommentSection";

/**
 * Hybrid wrapper: post detail via canonical BlogPostView. Views counter +
 * read time render via extraMeta. Comments + Newsletter blocks render via
 * afterContent. Related list via related/hrefForRelated. Draft-preview
 * gate preserved.
 */
export function BlogDetail({ slug }: { slug: string }) {
  const post = usePost(slug);
  const router = useRouter();
  const { dispatch } = useStore();
  const allPosts = usePublishedPosts();

  React.useEffect(() => {
    if (post) dispatch({ type: "post.view", id: post.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id]);

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="text-sm text-muted-foreground">Post tidak ditemukan.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href={`${PUBLIC_BASE}/blog`}><ArrowLeft className="size-4" /> Kembali ke blog</Link>
        </Button>
      </section>
    );
  }

  if (post.status !== "published") {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24">
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="p-8 text-center">
            <p className="text-sm font-medium text-amber-300">Draft preview</p>
            <p className="mt-1 text-xs text-muted-foreground">Post ini belum dipublish — hanya admin yang bisa lihat.</p>
            <Button asChild variant="outline" className="mt-4" onClick={() => router.back()}>
              <Link href={`${PUBLIC_BASE}/blog`}>Kembali ke blog</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const related = allPosts.filter((p) => p.id !== post.id && p.tag === post.tag).slice(0, 3);

  const slicePost: SliceBlogPost = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    publishedAt: post.publishedAt,
    tags: [post.tag],
    cover: { src: post.cover, alt: post.title },
  };

  const relatedItems: SliceBlogPost[] = related.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    publishedAt: r.publishedAt,
    tags: [r.tag],
    cover: { src: r.cover, alt: r.title },
  }));

  return (
    <BlogPostView
      post={slicePost}
      backHref={`${PUBLIC_BASE}/blog`}
      extraMeta={
        <span className="inline-flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" /> {post.readMin} min read
          </span>
          <span>·</span>
          <span>{post.views.toLocaleString()} views</span>
        </span>
      }
      afterContent={
        <>
          <CommentSection postId={post.id} postTitle={post.title} />
          <NewsletterBlock source={`post:${post.slug}`} />
        </>
      }
      related={relatedItems}
      hrefForRelated={(r) => `${PUBLIC_BASE}/blog/${r.slug}`}
    />
  );
}
