import type { MetadataRoute } from "next";
import { SEED_POSTS, SEED_PORTFOLIO } from "@/components/templates/personal-brand/shared/seed";
import { DEFAULT_SITE_CONFIG, TEMPLATE_SLUG } from "@/components/templates/personal-brand/shared/site-config";
import { buildTemplatePaths } from "@/components/templates/_shared/config/template-paths";

const PUBLIC_BASE = buildTemplatePaths(TEMPLATE_SLUG).publicBase;

export default function sitemap(): MetadataRoute.Sitemap {
  const root = DEFAULT_SITE_CONFIG.baseUrl;
  const lastModified = new Date();

  const staticRoutes = ["", "/about", "/blog", "/portfolio", "/services", "/resources", "/contact"].map((p) => ({
    url: `${root}${PUBLIC_BASE}${p}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const postRoutes = SEED_POSTS.filter((p) => p.status === "published").map((p) => ({
    url: `${root}${PUBLIC_BASE}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const portfolioRoutes = SEED_PORTFOLIO.map((p) => ({
    url: `${root}${PUBLIC_BASE}/portfolio/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...portfolioRoutes];
}
