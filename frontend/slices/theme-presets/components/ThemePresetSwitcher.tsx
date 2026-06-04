"use client";

/** Unified theme controller — light/dark/system mode tabs + color
 *  preset palette in one Popover. Replaces the prior dual setup
 *  (TweakcnSwitcher + ThemePicker). Pattern lifted from CareerPack.
 *
 *  Layout:
 *    [palette + chevron trigger]
 *      ├─ sticky mode-tabs header (3-button segmented)
 *      ├─ sticky preset-count row with Default reset
 *      └─ scrollable preset list (grouped, hover-preview, click-commit)
 *
 *  Requires ThemePresetProvider higher in the tree so state survives
 *  across mounts + deeply-nested consumers can read `useThemePreset()`. */

import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { ChevronDown, Palette, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  groupTweakcnPresets, tweakcnSwatches,
  type TweakcnPresetGroup, type TweakcnPresetItem,
} from "../lib/tweakcn";
import { useThemePreset } from "./ThemePresetProvider";
import { ModeTabs, type ModeId } from "./mode-tabs";

interface ThemePresetSwitcherProps {
  size?: "sm" | "mobile";
  triggerClassName?: string;
}

export function ThemePresetSwitcher({
  size = "sm",
  triggerClassName,
}: ThemePresetSwitcherProps) {
  const { registry, presetName, setPreset, preview, restore } = useThemePreset();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const groups: TweakcnPresetGroup<TweakcnPresetItem>[] = useMemo(
    () => (registry ? groupTweakcnPresets(registry.items) : []),
    [registry],
  );

  const presetCount = useMemo(
    () => groups.reduce((sum, g) => sum + g.items.length, 0),
    [groups],
  );

  const activeMode: ModeId =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  const commit = (name: string) => {
    setPreset(name);
    setOpen(false);
  };

  const resetDefault = () => {
    setPreset(null);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => { if (!next) restore(); setOpen(next); }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Theme and color preset"
          className={cn(size === "mobile" && "h-11 w-11", "gap-1.5", triggerClassName)}
        >
          <Palette className="h-4 w-4" />
          <ChevronDown
            className={cn("h-3 w-3 transition-transform opacity-70", open && "rotate-180")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        collisionPadding={8}
        avoidCollisions
        className="flex h-[min(80vh,34rem)] w-[min(20rem,calc(100vw-1rem))] sm:w-80 flex-col overflow-hidden p-0"
        onMouseLeave={() => restore()}
      >
        <ModeTabs activeMode={activeMode} onPick={setTheme} />

        <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Color Preset{" "}
            <span className="font-normal text-muted-foreground/70">({presetCount})</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={resetDefault}
            onMouseEnter={() => preview(null)}
            onMouseLeave={() => restore()}
            className={cn(
              "flex h-auto items-center gap-1 rounded-md px-2 py-1 text-[11px] font-normal text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              presetName === null && "text-foreground",
            )}
          >
            <RotateCcw className="h-3 w-3" />
            Default
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {groups.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Loading presets…
            </p>
          )}
          {groups.map((grp) => (
            <div key={grp.id}>
              <div className="sticky top-0 z-10 border-b border-border/30 bg-popover/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
                {grp.label}
              </div>
              {grp.items.map((p) => {
                const selected = p.name === presetName;
                const swatches = tweakcnSwatches(p);
                return (
                  <Button
                    key={p.name}
                    variant="ghost"
                    type="button"
                    onClick={() => commit(p.name)}
                    onMouseEnter={() => preview(p.name)}
                    onFocus={() => preview(p.name)}
                    className={cn(
                      "flex h-auto w-full items-center justify-start gap-3 rounded-none border-b border-border/40 px-3 py-2 text-left text-sm font-normal transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      selected && "bg-accent text-accent-foreground",
                    )}
                    aria-pressed={selected}
                  >
                    <span className="flex shrink-0 items-center gap-0.5">
                      {swatches.map((c, i) => (
                        <span
                          key={i}
                          aria-hidden
                          className="block h-3 w-3 rounded-full ring-1 ring-foreground/25"
                          style={{ background: c }}
                        />
                      ))}
                    </span>
                    <span className="flex-1 truncate">{p.title}</span>
                    {selected && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                    )}
                  </Button>
                );
              })}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
