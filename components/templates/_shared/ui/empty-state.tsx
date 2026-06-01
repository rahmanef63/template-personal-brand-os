import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * List-empty placeholder used by admin tables + public catalogs when no
 * items exist. Keeps tone consistent across templates.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  cta,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  className?: string;
}) {
  return (
    <Card className={cn("border-dashed bg-muted/10 p-10 text-center", className)}>
      {Icon && <Icon className="mx-auto mb-3 size-8 text-muted-foreground" />}
      <h3 className="text-base font-medium">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {cta && (
        <Button asChild className="mt-4">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      )}
    </Card>
  );
}
