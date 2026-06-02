import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { PortfolioDetailPage } from "@/components/templates/personal-brand/slices/portfolio/PortfolioDetailPage";
import { SEED_PORTFOLIO } from "@/components/templates/personal-brand/shared/seed";

const getItem = cache(async (slug: string) => {
  try {
    const item = await fetchQuery(api.portfolio.bySlug, { slug });
    if (item) return item;
  } catch {
    /* Convex unreachable — fall through to seed */
  }
  return SEED_PORTFOLIO.find((p) => p.slug === slug) ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) return { title: "Project not found" };
  return {
    title: item.title,
    description: item.blurb,
    openGraph: {
      title: item.title,
      description: item.blurb,
      type: "article",
      images: item.cover ? [{ url: item.cover }] : [],
    },
    twitter: { card: "summary_large_image", title: item.title, description: item.blurb },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) notFound();
  return <PortfolioDetailPage slug={slug} />;
}
