"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { IconBrandGithub, IconBrandLinkedin, IconBrandX, IconBrandYoutube } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import type { Brand, FooterColumn } from "../types/common";

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
  socials = [{ Icon: IconBrandX }, { Icon: IconBrandLinkedin }, { Icon: IconBrandGithub }, { Icon: IconBrandYoutube }],
  belowBrand,
}: {
  brand: Pick<Brand, "brandLetter" | "brandName" | "description" | "logoUrl">;
  homeHref: string;
  columns: FooterColumn[];
  copyrightHolder?: string;
  tagline?: string;
  socials?: Array<{ Icon: any; href?: string }>;
  belowBrand?: React.ReactNode;
}) {
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
          {socials.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href ?? "#"}
                  className="grid size-9 place-items-center rounded-full border border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
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
