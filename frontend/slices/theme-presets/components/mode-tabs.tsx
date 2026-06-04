"use client";

/** Sticky display-mode row (light / dark / system) for the switcher
 *  Popover. Extracted to keep ThemePresetSwitcher.tsx ≤200 LOC. */

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "system", label: "System", Icon: Monitor },
] as const;

export type ModeId = (typeof MODES)[number]["id"];

export function ModeTabs({
  activeMode,
  onPick,
}: {
  activeMode: ModeId;
  onPick: (m: ModeId) => void;
}) {
  return (
    <div className="sticky top-0 z-20 shrink-0 border-b border-border bg-popover/95 px-3 py-2 backdrop-blur">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Display Mode
      </p>
      <div
        role="tablist"
        aria-label="Display mode"
        className="grid grid-cols-3 gap-1 rounded-md bg-muted/60 p-1"
      >
        {MODES.map(({ id, label, Icon }) => {
          const active = id === activeMode;
          return (
            <Button
              key={id}
              role="tab"
              aria-selected={active}
              type="button"
              variant="ghost"
              onClick={() => onPick(id)}
              className={cn(
                "flex h-auto items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
