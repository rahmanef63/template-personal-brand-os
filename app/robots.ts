import type { MetadataRoute } from "next";
import { DEFAULT_SITE_CONFIG, TEMPLATE_SLUG } from "@/components/templates/personal-brand/shared/site-config";
import { buildTemplatePaths } from "@/components/templates/_shared/config/template-paths";

export default function robots(): MetadataRoute.Robots {
  const paths = buildTemplatePaths(TEMPLATE_SLUG);
  return {
    rules: [{ userAgent: "*", allow: paths.publicBase, disallow: paths.dashboardBase }],
    sitemap: `${DEFAULT_SITE_CONFIG.baseUrl}/sitemap.xml`,
  };
}
