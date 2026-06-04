"use client";

/** PageBreadcrumbs — ancestor trail above a page. Pure / props-driven:
 *  pass the ancestor chain (root → parent) + an onNavigate callback. The
 *  last crumb is the current page (rendered muted, not clickable). */

import { Fragment, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Crumb { id: string; label: string; icon?: ReactNode }

export interface PageBreadcrumbsProps {
  items: Crumb[];
  onNavigate?: (id: string) => void;
  className?: string;
}

export function PageBreadcrumbs({ items, onNavigate, className }: PageBreadcrumbsProps) {
  if (items.length === 0) return null;
  return (
    <nav className={cn("flex flex-wrap items-center gap-0.5 text-xs text-muted-foreground", className)} aria-label="Breadcrumb">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={c.id}>
            {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />}
            {last || !onNavigate ? (
              <span className={cn("flex max-w-40 items-center gap-1 truncate px-1", last && "text-foreground")}>
                {c.icon}
                <span className="truncate">{c.label || "Untitled"}</span>
              </span>
            ) : (
              <Button
                variant="ghost" size="sm" type="button"
                onClick={() => onNavigate(c.id)}
                className="h-auto max-w-40 gap-1 px-1 py-0.5 text-xs font-normal text-muted-foreground hover:text-foreground"
              >
                {c.icon}
                <span className="truncate">{c.label || "Untitled"}</span>
              </Button>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
