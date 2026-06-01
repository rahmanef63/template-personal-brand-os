import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn("grid gap-4", cols, className)}>
      {items.map((f) => {
        const Icon = f.icon;
        return (
          <Card key={f.title} className="border-border/60 bg-card/60">
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
