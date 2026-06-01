import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ASPECT_RATIO_CLASS,
  type AspectRatio,
} from "../landing/types";
import type { Cta } from "../types/common";

/**
 * Shared hero block — used by every public template's home page.
 *
 * Two variants via `variant`:
 * - "centered" : tagline-style hero, content centered (saas/marketing).
 * - "split"    : 8/4 col split with optional sidekick on the right (agency/personal).
 *
 * Set `glow` to render the orange/emerald blur backdrop (used by wirausaha+kreator).
 */
export function HeroBlock({
  eyebrow,
  badge,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  variant = "centered",
  sidekick,
  image,
  glow = false,
  className,
}: {
  eyebrow?: string;
  badge?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  variant?: "centered" | "split";
  sidekick?: React.ReactNode;
  /** Foreground illustration. Auto-promotes variant to "split" when set
   *  and no sidekick is provided. */
  image?: { url: string; ratio?: AspectRatio; alt?: string };
  glow?: boolean;
  className?: string;
}) {
  const effectiveVariant =
    variant === "split" || (image && !sidekick) ? "split" : "centered";
  const imageSidekick = image && !sidekick ? <HeroImage image={image} /> : null;
  const rightCol = sidekick ?? imageSidekick;
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-border/60", className)}>
      {glow && (
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          <div className="absolute -right-40 top-32 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
      )}
      <div
        className={cn(
          "mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 sm:py-20 md:py-28",
          effectiveVariant === "split" ? "md:grid-cols-12" : "",
        )}
      >
        <div className={effectiveVariant === "split" ? "md:col-span-7" : ""}>
          {badge && (
            <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-[11px]">
              <Sparkles className="mr-1 size-3" /> {badge}
            </Badge>
          )}
          {eyebrow && !badge && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              {subtitle}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {primaryCta && (
                <Button asChild size="lg">
                  <Link href={primaryCta.href}>
                    {primaryCta.label} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
              {secondaryCta && (
                <Button asChild size="lg" variant="outline">
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
        {effectiveVariant === "split" && rightCol && (
          <div className="md:col-span-5">{rightCol}</div>
        )}
      </div>
    </section>
  );
}

function HeroImage({ image }: { image: { url: string; ratio?: AspectRatio; alt?: string } }) {
  const ratioClass = ASPECT_RATIO_CLASS[image.ratio ?? "16:9"];
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 shadow-lg",
        ratioClass,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.alt ?? ""}
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget.parentElement as HTMLElement).style.display = "none";
        }}
      />
    </div>
  );
}
