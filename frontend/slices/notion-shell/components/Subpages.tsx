"use client";

/** Subpages — a grid of child-page cards shown at the bottom of a page
 *  (Notion's "sub-pages" list). Pure / props-driven: pass the child pages
 *  + onOpen + optional onCreate. */

import { FileText, Plus, type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface SubpageItem { id: string; title: string; icon?: ReactNode }

export interface SubpagesProps {
  pages: SubpageItem[];
  onOpen?: (id: string) => void;
  onCreate?: () => void;
  title?: string;
  className?: string;
}

export function Subpages({ pages, onOpen, onCreate, title = "Sub-pages", className }: SubpagesProps) {
  if (pages.length === 0 && !onCreate) return null;
  return (
    <div className={cn("mt-6 space-y-2", className)}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {pages.map((p) => (
          <Button
            key={p.id}
            variant="outline" type="button"
            onClick={() => onOpen?.(p.id)}
            className="h-auto justify-start gap-2 px-3 py-2 text-left font-normal"
          >
            <span className="shrink-0 text-muted-foreground">{p.icon ?? <FileText className="h-4 w-4" />}</span>
            <span className="truncate text-sm">{p.title || "Untitled"}</span>
          </Button>
        ))}
        {onCreate && (
          <Button
            variant="ghost" type="button" onClick={onCreate}
            className="h-auto justify-start gap-2 px-3 py-2 text-left font-normal text-muted-foreground"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="text-sm">New sub-page</span>
          </Button>
        )}
      </div>
    </div>
  );
}

/** Re-export for convenience when a host wants the default page icon. */
export const SubpageIcon: LucideIcon = FileText;
