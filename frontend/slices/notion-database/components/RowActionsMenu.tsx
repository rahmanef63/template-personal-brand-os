"use client";

/** RowActionsMenu — reusable per-row dropdown for every view (table,
 *  board, list, gallery, feed). Renders the trigger you pass and a
 *  three-action menu: Open / Duplicate / Delete. Each action is hidden
 *  when its handler is omitted. */

import { ExternalLink, Copy, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface RowActionsMenuProps {
  onOpen?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  /** Class applied to the trigger button. */
  className?: string;
  triggerLabel?: string;
}

export function RowActionsMenu({
  onOpen, onDuplicate, onRemove, className, triggerLabel = "Row actions",
}: RowActionsMenuProps) {
  if (!onOpen && !onDuplicate && !onRemove) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-6 w-6 text-muted-foreground hover:text-foreground", className)}
          aria-label={triggerLabel}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
        {onOpen && (
          <DropdownMenuItem onSelect={onOpen}>
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            Open
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onSelect={onDuplicate}>
            <Copy className="mr-2 h-3.5 w-3.5" />
            Duplicate
          </DropdownMenuItem>
        )}
        {onRemove && (
          <>
            {(onOpen || onDuplicate) && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onSelect={onRemove}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
