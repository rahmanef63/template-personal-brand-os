import * as React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type PricingTierCardProps = {
  name: string;
  price: string;
  period?: string;
  blurb?: string;
  bullets: string[];
  cta?: { label: string; href: string };
  /** When provided, overrides the default Link-based CTA. Use for modal triggers, onClick handlers, etc. */
  customCta?: React.ReactNode;
  featured?: boolean;
  badge?: string;
  /** Visual treatment when `featured` is true. */
  featuredVariant?: "ring" | "scale" | "tint";
  className?: string;
};

const featuredClass: Record<NonNullable<PricingTierCardProps["featuredVariant"]>, string> = {
  ring: "ring-2 ring-primary shadow-lg",
  scale: "ring-2 ring-primary shadow-xl lg:scale-[1.03]",
  tint: "bg-primary/5 ring-1 ring-primary/40 shadow-md",
};

export function PricingTierCard({
  name,
  price,
  period,
  blurb,
  bullets,
  cta,
  customCta,
  featured = false,
  badge,
  featuredVariant = "ring",
  className,
}: PricingTierCardProps) {
  return (
    <Card
      className={cn(
        "relative flex h-full flex-col",
        featured && featuredClass[featuredVariant],
        className,
      )}
    >
      {badge ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground shadow-sm">
          {badge}
        </span>
      ) : null}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        {blurb ? <CardDescription>{blurb}</CardDescription> : null}
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tight">{price}</span>
          {period ? (
            <span className="text-sm text-muted-foreground">/ {period}</span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3 text-sm">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="text-foreground/90">{bullet}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      {customCta ? (
        <CardFooter>{customCta}</CardFooter>
      ) : cta ? (
        <CardFooter>
          <Button
            asChild
            className="w-full"
            variant={featured ? "default" : "outline"}
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
