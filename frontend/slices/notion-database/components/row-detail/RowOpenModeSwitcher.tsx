"use client";

/** RowOpenModeSwitcher — three-button toggle group (sheet / dialog /
 *  open-as-page). The first two persist as the user's new default via
 *  the parent's `onPickMode`. Open-as-page is one-shot — the parent's
 *  `onOpenAsPage` typically navigates to /p/<id>; it does NOT change
 *  the persisted default. */

import { PanelRight, Maximize2, ExternalLink } from "lucide-react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import type { RowOpenMode } from "./useRowOpenMode";

interface Props {
  mode: RowOpenMode;
  onPickMode: (mode: RowOpenMode) => void;
  /** One-shot: close the peek and navigate to a full row page. Omit to
   *  hide the page button entirely (host has no router). */
  onOpenAsPage?: () => void;
  /** When the host is already a full-page DB, hide the page button to
   *  avoid awkward sibling-navigation. Defaults to true. */
  showPage?: boolean;
}

export function RowOpenModeSwitcher({
  mode, onPickMode, onOpenAsPage, showPage = true,
}: Props) {
  const showPageButton = showPage && !!onOpenAsPage;
  return (
    <TooltipProvider>
      <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-background/40 p-0.5">
        <ToggleGroup
          type="single"
          size="sm"
          value={mode}
          onValueChange={(v) => v && onPickMode(v as RowOpenMode)}
          className="gap-0.5"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="sheet" aria-label="Open in side sheet (default)" className="h-6 w-6 p-0">
                <PanelRight className="h-3.5 w-3.5" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">Open in side sheet (default)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="dialog" aria-label="Open in centered dialog (set as default)" className="h-6 w-6 p-0">
                <Maximize2 className="h-3.5 w-3.5" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">Open in centered dialog (set as default)</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        {showPageButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open as full page"
                onClick={onOpenAsPage}
                className="h-6 w-6 text-muted-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">Open as full page</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
