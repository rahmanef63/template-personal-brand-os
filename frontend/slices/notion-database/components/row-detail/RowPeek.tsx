"use client";

/** RowPeek — controller for the row-detail peek. Reads the persisted
 *  surface preference (sheet / dialog) and renders the matching
 *  component with the mode switcher injected into the header. The
 *  switcher's "Open as full page" action is one-shot — it calls the
 *  caller's `onOpenAsPage` (typically navigate to /p/<id>) and does
 *  NOT change the persisted default.
 *
 *  Use this when you want the full peek UX; if you only need one
 *  surface, mount RowDetailSheet or RowDetailDialog directly.
 *
 *  Lifted from notion-page-clone CK-1D Phase 1. */

import { type ReactNode } from "react";
import { useRowOpenMode, type RowOpenMode } from "./useRowOpenMode";
import { RowOpenModeSwitcher } from "./RowOpenModeSwitcher";
import { RowDetailSheet } from "./RowDetailSheet";
import { RowDetailDialog } from "./RowDetailDialog";

export interface RowPeekProps {
  pageId: string | null;
  onOpenChange: (open: boolean) => void;
  title?: string;
  onTitleChange?: (next: string) => void;
  iconSlot?: ReactNode;
  propertiesSlot?: ReactNode;
  blocksSlot?: ReactNode;
  /** One-shot navigate to a full row page. Omit to hide the "page"
   *  button (host has no router or is already a full-page DB). */
  onOpenAsPage?: () => void;
  /** Defaults true. Set false when host already IS a full-page DB. */
  showOpenAsPage?: boolean;
}

export function RowPeek({
  pageId, onOpenChange, title,
  onTitleChange, iconSlot, propertiesSlot, blocksSlot,
  onOpenAsPage, showOpenAsPage = true,
}: RowPeekProps) {
  const [mode, setMode] = useRowOpenMode();

  const handlePickMode = (next: RowOpenMode) => setMode(next);
  const handleOpenAsPage = onOpenAsPage
    ? () => {
        onOpenChange(false);
        onOpenAsPage();
      }
    : undefined;

  const switcher = (
    <RowOpenModeSwitcher
      mode={mode}
      onPickMode={handlePickMode}
      onOpenAsPage={handleOpenAsPage}
      showPage={showOpenAsPage}
    />
  );

  const shared = {
    pageId,
    onOpenChange,
    title,
    onTitleChange,
    iconSlot,
    propertiesSlot,
    blocksSlot,
    headerExtras: switcher,
  };

  if (mode === "dialog") return <RowDetailDialog {...shared} />;
  return <RowDetailSheet {...shared} />;
}
