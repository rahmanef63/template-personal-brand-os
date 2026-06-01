"use client";

import type { ReactNode } from "react";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
import type { Brand, Cta, FooterColumn, NavItem } from "../types/common";

/**
 * Top-level public site shell. Composes <SiteNav> + <main> + <SiteFooter>.
 * Pass props once at the layout level — every public route gets the same chrome.
 *
 * Floating widgets (chat fab, cart drawer, cookie banner) can be added as
 * children alongside `<main>` by composing inside the layout.
 */
export function SiteShell({
  brand,
  homeHref,
  navItems,
  cta,
  navExtras,
  footerColumns,
  copyrightHolder,
  footerTagline,
  belowFooterBrand,
  children,
}: {
  brand: Brand;
  homeHref: string;
  navItems: NavItem[];
  cta?: Cta;
  navExtras?: ReactNode;
  footerColumns: FooterColumn[];
  copyrightHolder?: string;
  footerTagline?: string;
  belowFooterBrand?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav brand={brand} homeHref={homeHref} items={navItems} cta={cta} extras={navExtras} />
      <main>{children}</main>
      <SiteFooter
        brand={brand}
        homeHref={homeHref}
        columns={footerColumns}
        copyrightHolder={copyrightHolder}
        tagline={footerTagline}
        belowBrand={belowFooterBrand}
      />
    </div>
  );
}
