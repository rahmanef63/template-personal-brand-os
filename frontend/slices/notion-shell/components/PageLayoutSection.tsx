"use client";

/** PageLayoutSection — the "Layout" block of PageActionsMenu: font cycle,
 *  full-width, small-text, lock. Items keep the menu open (onSelect
 *  preventDefault) so several can be toggled in one pass. Pure callbacks. */

import { Type, AlignJustify, Maximize2, Lock, LockOpen, Check } from "lucide-react";
import {
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export type PageFont = "default" | "serif" | "mono";

export interface PageLayoutSectionProps {
  font?: PageFont;
  fullWidth?: boolean;
  smallText?: boolean;
  locked?: boolean;
  onSetFont?: (font: PageFont) => void;
  onToggleFullWidth?: () => void;
  onToggleSmallText?: () => void;
  onToggleLock?: () => void;
}

const FONT_LABEL: Record<PageFont, string> = { default: "Default", serif: "Serif", mono: "Mono" };
const NEXT_FONT: Record<PageFont, PageFont> = { default: "serif", serif: "mono", mono: "default" };

export function PageLayoutSection(p: PageLayoutSectionProps) {
  const keepOpen = (e: Event) => e.preventDefault();
  const font = p.font ?? "default";
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-xs text-muted-foreground">Layout</DropdownMenuLabel>
      {p.onSetFont && (
        <DropdownMenuItem className="gap-2 text-sm" onSelect={keepOpen} onClick={() => p.onSetFont!(NEXT_FONT[font])}>
          <Type className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="flex-1">Font</span>
          <span className="text-[11px] text-muted-foreground">{FONT_LABEL[font]}</span>
        </DropdownMenuItem>
      )}
      {p.onToggleFullWidth && (
        <DropdownMenuItem className="gap-2 text-sm" onSelect={keepOpen} onClick={p.onToggleFullWidth}>
          <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="flex-1">Full width</span>
          {p.fullWidth && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
      )}
      {p.onToggleSmallText && (
        <DropdownMenuItem className="gap-2 text-sm" onSelect={keepOpen} onClick={p.onToggleSmallText}>
          <AlignJustify className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="flex-1">Small text</span>
          {p.smallText && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
      )}
      {p.onToggleLock && (
        <DropdownMenuItem className="gap-2 text-sm" onSelect={keepOpen} onClick={p.onToggleLock}>
          {p.locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : <LockOpen className="h-3.5 w-3.5 text-muted-foreground" />}
          <span className="flex-1">{p.locked ? "Locked" : "Lock page"}</span>
          {p.locked && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
      )}
    </>
  );
}
