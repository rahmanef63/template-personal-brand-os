// The site-settings contract — the shape the onboarding wizard writes, the admin
// Settings form edits, and the public chrome reads. Mirrors the Convex
// `siteSettings` singleton (all optional; one row). Centralised here so every
// surface (and any template adopting the core) shares one definition.
export type SiteSettings = {
  siteName?: string;
  tagline?: string;
  ownerName?: string;
  contactEmail?: string;
  brandColor?: string;
  themeDefault?: string; // "light" | "dark" | "system"
  logoUrl?: string;
  faviconUrl?: string;
  socials?: string; // JSON string
  seoDescription?: string;
  analyticsId?: string;
  onboardedAt?: number;
};

// The editable subset (everything except the server-managed onboardedAt).
export type SiteSettingsInput = Omit<SiteSettings, "onboardedAt">;
