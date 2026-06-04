"use client";

/** TocBlock — a table of contents. Presentational + props-driven: the host
 *  collects its own page headings (walk the block list for h1–h3 with text)
 *  and passes them in, because a registry renderer can't see sibling blocks.
 *  Wrap it in a `toc` adapter at the app level and pass to
 *  createDefaultBlockRenderers({ toc }). */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { stripMd } from "../../lib/inlineMd";

export interface TocHeading {
  id: string;
  text: string;
  /** 1 | 2 | 3 — drives the indent. */
  level: number;
}

export interface TocBlockProps {
  headings: TocHeading[];
  onJump?: (id: string) => void;
}

const INDENT: Record<number, string> = { 1: "pl-0", 2: "pl-4", 3: "pl-8" };

export function TocBlock({ headings, onJump }: TocBlockProps) {
  if (headings.length === 0) {
    return (
      <div className="my-1 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
        Table of contents — add headings to populate it.
      </div>
    );
  }
  return (
    <nav className="my-1 flex flex-col gap-0.5 text-sm">
      {headings.map((h) => (
        <Button
          key={h.id}
          type="button"
          variant="ghost"
          onClick={() => onJump?.(h.id)}
          className={cn(
            "h-auto justify-start truncate rounded px-1 py-0.5 text-left font-normal text-muted-foreground hover:bg-muted hover:text-foreground",
            INDENT[h.level] ?? "pl-8",
          )}
        >
          {stripMd(h.text) || "Untitled heading"}
        </Button>
      ))}
    </nav>
  );
}
