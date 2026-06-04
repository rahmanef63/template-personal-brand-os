"use client";

/** RowSelectionToolbar — floating bottom-center action bar that appears
 *  whenever ≥1 row is selected. Strip vs upstream: dropped the inline
 *  "Edit property across selection" popover (depends on
 *  PropertyFormInput, a deferred upstream slice). Host can inject any
 *  bulk-edit UI via `extraSlot`. Lifted from notion-page-clone
 *  CK-1D Phase 3. */

import { type ReactNode } from "react";
import { Lock, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRowSelection } from "./RowSelectionProvider";

interface Props {
  /** Bulk delete callback. Omit to hide the Delete button. */
  onDelete?: (ids: string[]) => void;
  /** Ids that should be skipped (e.g. locked rows). Renders a "N
   *  locked" badge. Optional. */
  lockedIds?: Set<string>;
  /** Host-injected actions (e.g. Edit property popover). Renders to
   *  the left of the Delete button. */
  extraSlot?: ReactNode;
}

export function RowSelectionToolbar({ onDelete, lockedIds, extraSlot }: Props) {
  const { state, count, clear } = useRowSelection();
  if (count === 0) return null;

  const ids = [...state.ids];
  const editableIds = lockedIds ? ids.filter((id) => !lockedIds.has(id)) : ids;
  const lockedCount = ids.length - editableIds.length;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      data-row-selection-toolbar
      onMouseDown={stop}
      onClick={stop}
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-border bg-card px-2 py-1.5 shadow-lg"
    >
      <span className="px-2 text-xs tabular-nums text-muted-foreground">
        {count} {count === 1 ? "row" : "rows"} selected
      </span>
      {lockedCount > 0 && (
        <span
          title={`${lockedCount} row${lockedCount === 1 ? "" : "s"} locked — will be skipped`}
          className="flex items-center gap-1 px-2 text-[11px] text-amber-600"
        >
          <Lock className="h-3 w-3" /> {lockedCount} locked
        </span>
      )}
      {(extraSlot || onDelete) && <Separator orientation="vertical" className="h-5" />}
      {extraSlot}
      {onDelete && (
        <Button
          variant="ghost"
          onClick={() => { onDelete(editableIds); clear(); }}
          title="Delete (Del/Backspace)"
          className="h-auto gap-1 rounded px-2 py-1 text-xs font-normal text-destructive hover:bg-destructive/10 hover:text-destructive [&_svg]:size-3.5"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
      )}
      <Button
        variant="ghost"
        onClick={clear}
        aria-label="Clear (Esc)"
        title="Clear (Esc)"
        className="ml-1 h-7 w-7 rounded p-0 text-muted-foreground [&_svg]:size-3.5"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
