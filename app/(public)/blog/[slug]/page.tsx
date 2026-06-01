import type { Metadata } from "next";
import { BlogDetail } from "@/components/templates/personal-brand/slices/blog/BlogDetail";
import { SEED_POSTS } from "@/components/templates/personal-brand/shared/seed";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = SEED_POSTS.find((p) => p.slug === slug);
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
  return <BlogDetail slug={slug} />;
}
