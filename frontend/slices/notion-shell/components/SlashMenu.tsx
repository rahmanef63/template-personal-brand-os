"use client";

/** SlashMenu — searchable block-type picker. Keyboard nav (↑↓ Enter Esc)
 *  + click. Pure props — caller controls open state + fires `onSelect`
 *  with the chosen BlockType. Filter via the `query` prop (substring +
 *  keyword prefix match). Override / extend the spec list via `specs`. */

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BLOCK_SPECS, type BlockSpec } from "../lib/blockSpecs";
import type { BlockType } from "../types";

export interface SlashMenuProps {
  query: string;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  /** Override the baseline spec list (defaults to BLOCK_SPECS). */
  specs?: BlockSpec[];
  className?: string;
}

function matches(spec: BlockSpec, q: string): boolean {
  if (!q) return true;
  return (
    spec.label.toLowerCase().includes(q) ||
    spec.keywords.some((k) => k.startsWith(q))
  );
}

export function SlashMenu({ query, onSelect, onClose, specs = BLOCK_SPECS, className }: SlashMenuProps) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return specs.filter((s) => matches(s, q));
  }, [specs, query]);

  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
      else if (e.key === "Enter") { e.preventDefault(); if (filtered[active]) onSelect(filtered[active].type); }
      else if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [filtered, active, onSelect, onClose]);

  if (filtered.length === 0) {
    return (
      <div className={cn("z-50 w-72 rounded-lg border border-border bg-popover p-2 shadow-lg", className)}>
        <div className="p-2 text-xs text-muted-foreground">No matching blocks</div>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className={cn("z-50 max-h-72 w-72 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg", className)}
    >
      <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Basic blocks
      </div>
      {filtered.map((spec, i) => {
        const Icon = spec.icon;
        return (
          <Button
            key={spec.type}
            variant="ghost"
            onClick={() => onSelect(spec.type)}
            onMouseEnter={() => setActive(i)}
            className={cn(
              "h-auto w-full justify-start gap-3 rounded-md px-2 py-1.5 text-left font-normal",
              i === active && "bg-accent",
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">{spec.label}</div>
              <div className="truncate text-xs text-muted-foreground">{spec.hint}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
