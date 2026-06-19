import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { BlogDetail } from "@/features/blog/BlogDetail";
import { SEED_POSTS } from "@/features/_app/seed";

// SSR fetch the post (real CMS data) for metadata + existence — falls back to
// the static seed if Convex is unreachable. cache() dedupes the call across
// generateMetadata + the page render within one request.
const getPost = cache(async (slug: string) => {
  try {
    const post = await fetchQuery(api.posts.bySlug, { slug });
    if (post) return post;
  } catch {
    /* Convex unreachable — fall through to seed */
  }
  return SEED_POSTS.find((p) => p.slug === slug) ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: [post.author],
      images: post.cover ? [{ url: post.cover }] : [],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <BlogDetail slug={slug} />;
}
