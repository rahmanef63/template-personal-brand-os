// Route SSOT for website templates (Operasi Mise M2-BM).
//
// Every template lives at `/preview/<slug>` in the rr sandbox. Before
// this helper, each template hardcoded the slug in 2+ files
// (nav-config.ts, site-config.ts). Renaming a template meant editing
// 4–6 string literals across 16 files. Now: rename one
// `TEMPLATE_SLUG` constant per template, every derived path follows.
//
// Usage (in each template's `shared/site-config.ts`):
//
//   import { buildTemplatePaths } from "@/components/templates/_shared/config/template-paths";
//   export const TEMPLATE_SLUG = "saas-marketing-os";
//   const paths = buildTemplatePaths(TEMPLATE_SLUG);
//
//   export const DEFAULT_SITE_CONFIG = {
//     ctaPrimary: { label: "Start free", href: `${paths.publicBase}/pricing` },
//   };
//
// And in `shared/nav-config.ts`:
//
//   import { TEMPLATE_SLUG } from "./site-config";
//   import { buildTemplatePaths } from "@/components/templates/_shared/config/template-paths";
//   const paths = buildTemplatePaths(TEMPLATE_SLUG);
//   export const PUBLIC_BASE = paths.publicBase;
//   export const DASHBOARD_BASE = paths.dashboardBase;
//   export const ADMIN_PANEL_BASE = paths.adminPanelBase;
//   export const WORKSPACE_BASE = paths.workspaceBase;

export type TemplatePaths = {
  /** e.g. `"saas-marketing-os"` */
  templateSlug: string;
  /** `/preview/<slug>` — preview sandbox root */
  previewRoot: string;
  /** `/preview/<slug>/public` — public site root */
  publicBase: string;
  /** `/preview/<slug>/dashboard` — dashboard shell root */
  dashboardBase: string;
  /** `/preview/<slug>/dashboard/admin` — admin pages (CMS + Pages + Admin Panel) */
  adminPanelBase: string;
  /** `/preview/<slug>/dashboard/workspace` — Advanced archetype workspace shell */
  workspaceBase: string;
};

export function buildTemplatePaths(slug: string): TemplatePaths {
  const previewRoot = `/preview/${slug}`;
  const dashboardBase = `${previewRoot}/dashboard`;
  return {
    templateSlug: slug,
    previewRoot,
    publicBase: `${previewRoot}/public`,
    dashboardBase,
    adminPanelBase: `${dashboardBase}/admin`,
    workspaceBase: `${dashboardBase}/workspace`,
  };
}
