"use client";

// Theme preset picker for the Branding step. shadcn Select (popover-based,
// always readable on any preset/dark-mode combo — replaces the native
// <select> whose option list inherited unreadable white-on-white colors)
// with per-preset color swatches, optional group headers, and a live
// preview callback so the whole app re-skins while the user browses.

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PresetOption } from "../lib/types";

/** Radix Select forbids `value=""` on items — sentinel for "template default". */
const DEFAULT_VALUE = "__default__";

export function ThemePresetField({
  value,
  options,
  defaultLabel = "Bawaan template",
  onChange,
  onPreview,
}: {
  /** Current preset name ("" = template default). */
  value: string;
  options: PresetOption[];
  /** Label for the reset row, e.g. `Bawaan template (cosmic-night)`. */
  defaultLabel?: string;
  onChange: (name: string) => void;
  /** Live preview hook — called with the preset name (null = restore default). */
  onPreview?: (name: string | null) => void;
}) {
  const grouped = React.useMemo(() => {
    const order: string[] = [];
    const byGroup = new Map<string, PresetOption[]>();
    for (const o of options) {
      const g = o.group ?? "";
      if (!byGroup.has(g)) {
        byGroup.set(g, []);
        order.push(g);
      }
      byGroup.get(g)!.push(o);
    }
    return order.map((g) => ({ group: g, items: byGroup.get(g)! }));
  }, [options]);

  const pick = (v: string) => {
    const name = v === DEFAULT_VALUE ? "" : v;
    onChange(name);
    onPreview?.(name || null);
  };

  return (
    <Select value={value || DEFAULT_VALUE} onValueChange={pick}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value={DEFAULT_VALUE}>
          <span className="text-muted-foreground">{defaultLabel}</span>
        </SelectItem>
        <SelectSeparator />
        {grouped.map(({ group, items }) =>
          group ? (
            <SelectGroup key={group}>
              <SelectLabel>{group}</SelectLabel>
              {items.map((o) => (
                <PresetItem key={o.name} option={o} />
              ))}
            </SelectGroup>
          ) : (
            items.map((o) => <PresetItem key={o.name} option={o} />)
          ),
        )}
      </SelectContent>
    </Select>
  );
}

function PresetItem({ option }: { option: PresetOption }) {
  return (
    <SelectItem value={option.name}>
      <span className="flex items-center gap-2">
        {option.swatches && option.swatches.length > 0 && (
          <span className="flex shrink-0 -space-x-1">
            {option.swatches.slice(0, 5).map((c, i) => (
              <span
                key={i}
                className="size-3 rounded-full border border-border/60"
                style={{ backgroundColor: c }}
              />
            ))}
          </span>
        )}
        {option.label ?? option.name}
      </span>
    </SelectItem>
  );
}
