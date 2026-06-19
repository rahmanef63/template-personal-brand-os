import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ASPECT_RATIO_CLASS,
  type AspectRatio,
} from "@/features/_shared/landing/types";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { HERO_IMG } from "./home-data";

export interface HeroProps {
  /** Headline. Defaults to the original lorem copy when unset. */
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
}

const DEFAULTS = {
  title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
  subtitle:
    "Tempor incididunt ut labore et dolore magna aliqua — strategi produk, mentorship engineer, dan riset go-to-market untuk founder & tim Indonesia.",
  badge: "2026 mentorship cohort open",
  trust: "Trusted by — Acme · Foobar · Beta Labs · Gamma · Delta · Zeta",
} as const;

export function Hero({ title, subtitle, badge, trust, image }: HeroProps = {}) {
  const t = title?.trim() || DEFAULTS.title;
  const s = subtitle?.trim() || DEFAULTS.subtitle;
  const b = badge?.trim() || DEFAULTS.badge;
  const tr = trust?.trim() || DEFAULTS.trust;
  const hasImage = Boolean(image?.url);
  const ratioClass = ASPECT_RATIO_CLASS[image?.ratio ?? "16:9"];
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image src={HERO_IMG} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" />
        <div className="motion-blob absolute -right-40 top-32 h-96 w-96 rounded-full bg-brand/15 blur-3xl" />
        <div
          className="motion-blob absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[oklch(0.78_0.11_78_/_0.12)] blur-3xl"
          style={{ animationDelay: "-8s", animationDuration: "22s" }}
        />
      </div>
      <div
        className={cn(
          "mx-auto max-w-6xl gap-10 px-6 pt-24 pb-28 md:pt-32 md:pb-36",
          hasImage && "grid items-center md:grid-cols-12",
        )}
      >
        <div className={hasImage ? "md:col-span-7" : ""}>
          <Badge
            variant="secondary"
            className="reveal rounded-full border-brand/30 bg-brand/5 px-3 py-1 text-[11px] text-brand"
          >
            <Sparkles className="mr-1 size-3" /> {b}
          </Badge>
          <h1
            className="reveal mt-6 max-w-4xl text-[2.6rem] font-semibold leading-[1.03] tracking-tight md:text-[4.25rem]"
            style={{ "--d": "0.06s" } as React.CSSProperties}
          >
            {t}
          </h1>
          <p
            className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            style={{ "--d": "0.12s" } as React.CSSProperties}
          >
            {s}
          </p>
          <div
            className="reveal mt-9 flex flex-wrap gap-3"
            style={{ "--d": "0.18s" } as React.CSSProperties}
          >
            <Button size="lg" asChild className="group shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)]">
              <Link href={`${PUBLIC_BASE}/services`}>
                Lihat layanan{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`${PUBLIC_BASE}/portfolio`}>Karya terpilih</Link>
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
    </section>
  );
}
