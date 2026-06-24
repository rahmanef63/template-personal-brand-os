import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ASPECT_RATIO_CLASS,
  type AspectRatio,
  type HeroLayer,
} from "@/features/_shared/landing/types";
import { HeroLayers } from "@/features/_shared/landing/HeroLayers";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { HERO_IMG } from "./home-data";

export interface HeroProps {
  /** Headline. Defaults to the built-in copy when unset. */
  title?: string;
  /** Sub-headline / lead paragraph. */
  subtitle?: string;
  /** Pill above the headline. */
  badge?: string;
  /** Trust strip below the CTAs. */
  trust?: string;
  /** Optional foreground illustration. Renders as right-column when
   *  set, with the text content auto-narrowing to fit. */
  image?: { url: string; ratio?: AspectRatio; alt?: string };
  /** Admin-composed background / foreground layers. When a background
   *  layer is set it replaces the default HERO_IMG; otherwise HERO_IMG is
   *  the fallback. */
  layers?: HeroLayer[];
  /** Section background image (admin `bgImageUrl`). The hero background when
   *  no layers are set; falls back to HERO_IMG when blank. */
  background?: string;
  /** Readability scrim + brand glow. Off by default → image shows in full
   *  real color; on → gradient + glow for legibility. */
  shade?: boolean;
  /** Primary CTA label. Defaults to the original copy when unset. */
  ctaPrimaryLabel?: string;
  /** Primary CTA href. Defaults to the services page when unset. */
  ctaPrimaryHref?: string;
  /** Secondary CTA label. Defaults to the original copy when unset. */
  ctaSecondaryLabel?: string;
  /** Secondary CTA href. Defaults to the portfolio page when unset. */
  ctaSecondaryHref?: string;
  /** Content alignment. "center" only applies when there is no foreground
   *  image (with an image the layout is a left text + right image split). */
  align?: "left" | "center";
}

const DEFAULTS = {
  title: "Bantu founder & tim produk Indonesia ambil keputusan yang tepat — lebih cepat.",
  subtitle:
    "Strategi produk, mentorship engineering, dan riset go-to-market. Esai panjang dan catatan singkat, terbit rutin di blog dan newsletter.",
  badge: "2026 mentorship cohort open",
  trust: "Dipercaya tim di — Sinar Ventures · Nusantara Labs · Kode Kolektif · Padi Digital · Terra Studio",
} as const;

export function Hero({
  title,
  subtitle,
  badge,
  trust,
  image,
  layers,
  background,
  shade,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  align = "left",
}: HeroProps = {}) {
  const t = title?.trim() || DEFAULTS.title;
  const s = subtitle?.trim() || DEFAULTS.subtitle;
  const b = badge?.trim() || DEFAULTS.badge;
  const tr = trust?.trim() || DEFAULTS.trust;
  const hasImage = Boolean(image?.url);
  const centered = align === "center" && !hasImage;
  const ratioClass = ASPECT_RATIO_CLASS[image?.ratio ?? "16:9"];
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image band — admin layers, or HERO_IMG fallback (full
          opacity = real colors). */}
      <HeroLayers placement="background" layers={layers} fallbackImg={background || HERO_IMG} />
      {/* Readability scrim + brand glow — opt-in via the `shade` toggle so
          the image can show in full real color by default. */}
      {shade && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" />
          <div className="motion-blob absolute -right-40 top-32 h-96 w-96 rounded-full bg-brand/15 blur-3xl" />
          <div
            className="motion-blob absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[oklch(0.78_0.11_78_/_0.12)] blur-3xl"
            style={{ animationDelay: "-8s", animationDuration: "22s" }}
          />
        </div>
      )}
      <div
        className={cn(
          "mx-auto max-w-6xl gap-10 px-6 pt-24 pb-28 md:pt-32 md:pb-36",
          hasImage && "grid items-center md:grid-cols-12",
        )}
      >
        <div className={cn(hasImage ? "md:col-span-7" : "", centered && "text-center")}>
          <Badge
            variant="secondary"
            className="reveal rounded-full border-brand/30 bg-brand/5 px-3 py-1 text-[11px] text-brand"
          >
            <Sparkles className="mr-1 size-3" /> {b}
          </Badge>
          <h1
            className={cn(
              "reveal mt-6 max-w-4xl text-[2.6rem] font-semibold leading-[1.03] tracking-tight md:text-[4.25rem]",
              centered && "mx-auto",
            )}
            style={{ "--d": "0.06s" } as React.CSSProperties}
          >
            {t}
          </h1>
          <p
            className={cn(
              "reveal mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl",
              centered && "mx-auto",
            )}
            style={{ "--d": "0.12s" } as React.CSSProperties}
          >
            {s}
          </p>
          <div
            className={cn(
              "reveal mt-9 flex flex-wrap gap-3",
              centered && "justify-center",
            )}
            style={{ "--d": "0.18s" } as React.CSSProperties}
          >
            <Button size="lg" asChild className="group shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)]">
              <Link href={ctaPrimaryHref ?? `${PUBLIC_BASE}/services`}>
                {ctaPrimaryLabel ?? "Lihat layanan"}{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={ctaSecondaryHref ?? `${PUBLIC_BASE}/portfolio`}>{ctaSecondaryLabel ?? "Karya terpilih"}</Link>
            </Button>
          </div>
          <p
            className="reveal mt-12 text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
            style={{ "--d": "0.24s" } as React.CSSProperties}
          >
            {tr}
          </p>
        </div>
        {hasImage && image && (
          <div className={cn("overflow-hidden rounded-2xl border border-border/60 shadow-xl md:col-span-5", ratioClass)}>
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
        )}
      </div>
      {/* Foreground layers — above the content, click-through. */}
      <HeroLayers placement="foreground" layers={layers} />
    </section>
  );
}
