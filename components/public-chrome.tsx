"use client";

import { type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SiteShell } from "@/components/templates/_shared/ui/site-shell";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DEFAULT_SITE_CONFIG } from "@/components/templates/personal-brand/shared/site-config";
import {
  FOOTER_COLUMNS,
  FOOTER_TAGLINE,
  PUBLIC_CTA,
  PUBLIC_NAV,
} from "@/components/templates/personal-brand/shared/nav-config";

/**
 * Public chrome (nav + footer) with owner branding applied at runtime — the
 * brand name + tagline come from Convex `siteSettings` (set in onboarding /
 * admin Settings), falling back to the template defaults before load.
 */
export function PublicChrome({ children }: { children: ReactNode }) {
  const s = useQuery(api.settings.get);
  const brandName = s?.siteName || DEFAULT_SITE_CONFIG.brandName;
  const brand = {
    ...DEFAULT_SITE_CONFIG,
    brandName,
    brandLetter: brandName.charAt(0).toUpperCase() || DEFAULT_SITE_CONFIG.brandLetter,
  };
  const tagline = s?.tagline || FOOTER_TAGLINE;

  return (
    <SiteShell
      brand={brand}
      homeHref="/"
      navItems={PUBLIC_NAV}
      cta={PUBLIC_CTA}
      navExtras={<ThemeToggle />}
      footerColumns={FOOTER_COLUMNS}
      footerTagline={tagline}
      copyrightHolder={brand.brandName}
    >
      {children}
    </SiteShell>
  );
}
