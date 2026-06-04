"use client";

/** BlockColorPicker — two swatch rows (text tint + background) for the
 *  block actions menu. Pure callback: `onSet(color, bgColor)` writes both
 *  at once so a pick on one row preserves the other. */

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BLOCK_COLORS } from "../lib/blockColors";

interface BlockColorPickerProps {
  color?: string;
  bgColor?: string;
  onSet: (color?: string, bgColor?: string) => void;
}

export function BlockColorPicker({ color, bgColor, onSet }: BlockColorPickerProps) {
  return (
    <div className="px-2 pb-1">
      <div className="mb-1 flex flex-wrap gap-1">
        {BLOCK_COLORS.map((c) => (
          <Button
            key={`t-${c.id}`}
            variant="ghost" size="icon" type="button"
            title={`Text: ${c.label}`} aria-label={`Text ${c.label}`}
            onClick={() => onSet(c.id, bgColor)}
            className={cn(
              "h-6 w-6 rounded border border-border text-xs font-semibold",
              c.text, (color ?? "default") === c.id && "ring-1 ring-primary",
            )}
          >
            A
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {BLOCK_COLORS.map((c) => (
          <Button
            key={`b-${c.id}`}
            variant="ghost" size="icon" type="button"
            title={`Background: ${c.label}`} aria-label={`Background ${c.label}`}
            onClick={() => onSet(color, c.id)}
            className={cn(
              "h-6 w-6 rounded border border-border",
              c.bg || "bg-background", (bgColor ?? "default") === c.id && "ring-1 ring-primary",
            )}
          />
        ))}
      </div>
    </div>
  );
}
