// Personal Brand OS — single source of brand identity.
// All UI (nav, footer, sidebar, metadata, og-image, sitemap) reads from here.
// Edit-driven: SettingsView writes patches via store; values fall back to these defaults.
//
// NOTE: `bookCallHref` uses `/*` for the rr sandbox.
// Consumers installing via `npx rr add personal-brand-os` (default `--at root`)
// get this rewritten to `/services` by the CLI's `rewritePreviewPaths()`.

import { buildTemplatePaths } from "@/components/templates/_shared/config/template-paths";

export type SiteConfig = {
  brandLetter: string;
  brandName: string;
  tagline: string;
  ownerName: string;
  ownerRole: string;
  ownerInitials: string;
  description: string;
  baseUrl: string;
  twitter: string;
  email: string;
  bookCallHref: string;
  defaultLocale: "id-ID" | "en-US";
  themeColor: string;
};

/** Canonical slug — rename here, all derived paths follow. */
export const TEMPLATE_SLUG = "personal-brand-os";
const paths = buildTemplatePaths(TEMPLATE_SLUG);

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandLetter: "L",
  brandName: "lorem.dev",
  tagline: "Personal brand operating system",
  ownerName: "Lorem Dolor",
  ownerRole: "owner",
  ownerInitials: "LD",
  description:
    "Lorem ipsum dolor sit amet — strategist, writer, and educator. Public site + admin dashboard powered by Personal Brand OS.",
  baseUrl: "https://lorem.dev",
  twitter: "@loremdev",
  email: "halo@lorem.dev",
  bookCallHref: `${paths.publicBase}/services`,
  defaultLocale: "id-ID",
  themeColor: "#0a0a0a",
};
