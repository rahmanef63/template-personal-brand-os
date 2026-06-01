import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Cta } from "../types/common";

/**
 * Bottom-of-page CTA band. Every template has one. Single source for the
 * tone + spacing.
 */
export function CtaBand({
  title,
  subtitle,
  cta,
  secondaryCta,
  bordered = false,
  className,
}: {
  title: string;
  subtitle?: string;
  cta?: Cta;
  secondaryCta?: Cta;
  bordered?: boolean;
  className?: string;
}) {
  return (
    <section className={cn(bordered && "border-t border-border/60", className)}>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
        {(cta || secondaryCta) && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {cta && (
              <Button asChild size="lg">
                <Link href={cta.href}>
                  {cta.label} <ArrowRight className="size-4" />
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
    </section>
  );
}
