import type { Metadata } from "next";
import { PortfolioDetailPage } from "@/components/templates/personal-brand/slices/portfolio/PortfolioDetailPage";
import { SEED_PORTFOLIO } from "@/components/templates/personal-brand/shared/seed";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = SEED_PORTFOLIO.find((p) => p.slug === slug);
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
  return <PortfolioDetailPage slug={slug} />;
}
