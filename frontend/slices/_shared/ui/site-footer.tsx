"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { IconBrandGithub, IconBrandLinkedin, IconBrandX, IconBrandYoutube } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import type { Brand, FooterColumn } from "../types/common";

// Social platform key -> icon. The footer renders only the platforms an admin
// has actually set a URL for (settings.socials), so there are no dead "#" links.
const SOCIAL_ICONS: Record<string, typeof IconBrandX> = {
  x: IconBrandX,
  linkedin: IconBrandLinkedin,
  github: IconBrandGithub,
  youtube: IconBrandYoutube,
};

// settings.socials is an optional JSON string ({ x, linkedin, github, youtube }).
// Parse it safely into a key->url map for the footer; never throw on bad JSON.
export function parseSocials(raw?: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/**
 * Shared public footer. Per-template config:
 * - `brand`        : brand identity, ownership, copy
 * - `homeHref`     : link target for the brand mark
 * - `columns`      : right-hand link columns (e.g. Site, Legal, Office)
 * - `copyrightHolder`: name on the copyright line (defaults to brand.brandName)
 * - `tagline`      : footer line opposite copyright (e.g. "Built with X OS")
 * - `socials`      : optional social icons row
 * - `belowBrand`   : optional slot beneath the brand description (e.g. newsletter form)
 */
export function SiteFooter({
  brand,
  homeHref,
  columns,
  copyrightHolder,
  tagline,
  socials = {},
  belowBrand,
}: {
  brand: Pick<Brand, "brandLetter" | "brandName" | "description" | "logoUrl">;
  homeHref: string;
  columns: FooterColumn[];
  copyrightHolder?: string;
  tagline?: string;
  socials?: Record<string, string>;
  belowBrand?: React.ReactNode;
}) {
  const socialEntries = Object.entries(socials).filter(([k, url]) => url && SOCIAL_ICONS[k]);
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className={`mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-${Math.min(4, columns.length + 2)}`}>
        <div className="md:col-span-2">
          <Link href={homeHref || "/"} className="flex items-center gap-2 font-semibold">
            {brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logoUrl} alt={brand.brandName} className="h-7 w-auto rounded-md object-contain" />
            ) : (
              <span className="grid size-7 place-items-center rounded-md bg-foreground text-background">{brand.brandLetter}</span>
            )}
            <span>{brand.brandName}</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{brand.description}</p>
          {belowBrand}
          {socialEntries.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              {socialEntries.map(([k, url]) => {
                const Icon = SOCIAL_ICONS[k];
                return (
                  <a
                    key={k}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={k}
                    className="grid size-9 place-items-center rounded-full border border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
        {columns.map((col) => (
          <div key={col.heading}>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{col.heading}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {col.items.map((it) => (
                <li key={`${col.heading}-${it.label}`}>
                  <Link href={it.href} className="text-muted-foreground hover:text-foreground">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Separator />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {copyrightHolder ?? brand.brandName}. All rights reserved.</p>
        {tagline && (
          <p className="inline-flex items-center gap-1">
            {tagline}
            <ChevronRight className="size-3" />
          </p>
        )}
      </div>
    </footer>
  );
}
