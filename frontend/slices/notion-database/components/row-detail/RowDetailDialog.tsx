"use client";

/** RowDetailDialog — centered modal variant of the row peek. Wider +
 *  taller than a typical dialog so the row-blocks editing surface stays
 *  usable. Body identical to RowDetailSheet so toggling preserves
 *  edit state. Lifted from notion-page-clone CK-1D Phase 1. */

import { type ReactNode } from "react";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { RowDetailBody } from "./RowDetailBody";

export interface RowDetailDialogProps {
  pageId: string | null;
  onOpenChange: (open: boolean) => void;
  title?: string;
  headerExtras?: ReactNode;
  onTitleChange?: (next: string) => void;
  iconSlot?: ReactNode;
  propertiesSlot?: ReactNode;
  blocksSlot?: ReactNode;
}

export function RowDetailDialog({
  pageId, onOpenChange, title, headerExtras,
  onTitleChange, iconSlot, propertiesSlot, blocksSlot,
}: RowDetailDialogProps) {
  const displayTitle = title || "Untitled row";
  return (
    <Dialog open={!!pageId} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-[85vh] w-[95vw] max-w-3xl flex-col gap-0 overflow-hidden p-0 [&>button.absolute]:hidden"
      >
        <DialogTitle className="sr-only">{displayTitle}</DialogTitle>
        <DialogDescription className="sr-only">Row detail</DialogDescription>
        {pageId && (
          <RowDetailBody
            pageId={pageId}
            title={displayTitle}
            headerExtras={headerExtras}
            onClose={() => onOpenChange(false)}
            onTitleChange={onTitleChange}
            iconSlot={iconSlot}
            propertiesSlot={propertiesSlot}
            blocksSlot={blocksSlot}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
