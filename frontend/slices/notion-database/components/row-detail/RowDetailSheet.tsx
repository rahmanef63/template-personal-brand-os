"use client";

/** RowDetailSheet — right-side drawer variant of the row peek. The host
 *  fetches the page row by `pageId` and passes `title` + slots in.
 *  Body identical to RowDetailDialog so toggling preserves edit state.
 *  Lifted from notion-page-clone CK-1D Phase 1. */

import { type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { RowDetailBody } from "./RowDetailBody";

export interface RowDetailSheetProps {
  pageId: string | null;
  onOpenChange: (open: boolean) => void;
  title?: string;
  headerExtras?: ReactNode;
  onTitleChange?: (next: string) => void;
  iconSlot?: ReactNode;
  propertiesSlot?: ReactNode;
  blocksSlot?: ReactNode;
}

export function RowDetailSheet({
  pageId, onOpenChange, title, headerExtras,
  onTitleChange, iconSlot, propertiesSlot, blocksSlot,
}: RowDetailSheetProps) {
  const displayTitle = title || "Untitled row";
  return (
    <Sheet open={!!pageId} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl [&>button.absolute]:hidden"
      >
        <SheetTitle className="sr-only">{displayTitle}</SheetTitle>
        <SheetDescription className="sr-only">Row detail</SheetDescription>
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
      </SheetContent>
    </Sheet>
  );
}
