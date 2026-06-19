"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useInView } from "../motion/use-in-view";

export type FeatureItem = {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
};

/**
 * Icon + title + blurb grid. Default 4-up on lg; auto-collapses to 2-up
 * on md, single column on sm. Used by every template's "features" section.
 */
export function FeatureGrid({
  items,
  columns = 4,
  className,
}: {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const cols =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 3
        ? "md:grid-cols-2 lg:grid-cols-3"
        : "md:grid-cols-2 lg:grid-cols-4";

  // One observer scopes the whole grid; items stagger via per-item delay.
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={cn("grid gap-4", inView && "is-inview", cols, className)}>
      {items.map((f, i) => {
        const Icon = f.icon;
        return (
          <Card
            key={f.title}
            data-reveal="fade-up"
            style={{ "--reveal-delay": `${Math.min(i * 80, 400)}ms` } as React.CSSProperties}
            className="border-border/60 bg-card/60 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"
          >
            <CardContent className="p-6">
              {Icon && <Icon className="size-5 text-foreground/80" />}
              <h3 className="mt-4 text-base font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.blurb}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
