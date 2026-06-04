"use client";

/** PageActionsMenu — header-right "⋯" dropdown for page-level actions:
 *  duplicate / move to trash / toggle favorite / set cover. Pure
 *  callbacks — host wires to its store. Slots into NotionPage via the
 *  `actions` prop (or used standalone in custom headers). */

import { type ComponentProps } from "react";
import {
  MoreHorizontal, Copy, Star, StarOff, Trash2, Image as ImageIcon, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PageLayoutSection, type PageLayoutSectionProps } from "./PageLayoutSection";

export interface PageActionsMenuProps extends ComponentProps<typeof Button>, PageLayoutSectionProps {
  favorite?: boolean;
  onDuplicate?: () => void;
  onToggleFavorite?: () => void;
  onAddCover?: () => void;
  onExport?: () => void;
  onTrash?: () => void;
}

export function PageActionsMenu({
  favorite, onDuplicate, onToggleFavorite, onAddCover, onExport, onTrash, className,
  font, fullWidth, smallText, locked,
  onSetFont, onToggleFullWidth, onToggleSmallText, onToggleLock,
  ...props
}: PageActionsMenuProps) {
  const hasLayout = !!(onSetFont || onToggleFullWidth || onToggleSmallText || onToggleLock);
  const hasTop = !!(onAddCover || onToggleFavorite);
  const hasMid = !!(onDuplicate || onExport);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          {...props}
          variant="ghost"
          size="icon"
          aria-label="Page actions"
          className={cn("h-7 w-7 text-muted-foreground", className)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {onAddCover && (
          <DropdownMenuItem onClick={onAddCover} className="gap-2 text-sm">
            <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" /> Add cover
          </DropdownMenuItem>
        )}
        {onToggleFavorite && (
          <DropdownMenuItem onClick={onToggleFavorite} className="gap-2 text-sm">
            {favorite ? (
              <>
                <StarOff className="h-3.5 w-3.5 text-muted-foreground" /> Remove from favorites
              </>
            ) : (
              <>
                <Star className="h-3.5 w-3.5 text-muted-foreground" /> Add to favorites
              </>
            )}
          </DropdownMenuItem>
        )}
        {hasTop && hasMid && <DropdownMenuSeparator />}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate} className="gap-2 text-sm">
            <Copy className="h-3.5 w-3.5 text-muted-foreground" /> Duplicate
          </DropdownMenuItem>
        )}
        {onExport && (
          <DropdownMenuItem onClick={onExport} className="gap-2 text-sm">
            <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export
          </DropdownMenuItem>
        )}
        {(hasTop || hasMid) && onTrash && <DropdownMenuSeparator />}
        {onTrash && (
          <DropdownMenuItem
            onClick={onTrash}
            className="gap-2 text-sm text-destructive focus:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> Move to trash
          </DropdownMenuItem>
        )}
        {hasLayout && (
          <PageLayoutSection
            font={font} fullWidth={fullWidth} smallText={smallText} locked={locked}
            onSetFont={onSetFont} onToggleFullWidth={onToggleFullWidth}
            onToggleSmallText={onToggleSmallText} onToggleLock={onToggleLock}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
