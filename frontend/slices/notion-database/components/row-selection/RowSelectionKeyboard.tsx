"use client";

/** RowSelectionKeyboard — listens for Escape (clear) and Backspace /
 *  Delete (bulk delete) while there are selected rows. Pointer-down
 *  anywhere outside the toolbar / a popover / a modifier-held click
 *  clears the selection.
 *
 *  Strip vs upstream: `onDelete` is a host-supplied callback instead of
 *  reaching into useDbAdapter. Pass `undefined` to disable bulk delete
 *  (Escape + outside-click still work). Lifted from notion-page-clone
 *  CK-1D Phase 3. */

import { useEffect } from "react";
import { useRowSelection } from "./RowSelectionProvider";

interface Props {
  /** Bulk delete the selected ids. Omit to disable. */
  onDelete?: (ids: string[]) => void;
}

export function RowSelectionKeyboard({ onDelete }: Props) {
  const { state, count, clear } = useRowSelection();

  useEffect(() => {
    if (count === 0) return;
    const ids = [...state.ids];

    const isEditable = (el: EventTarget | null): boolean => {
      const t = el as HTMLElement | null;
      if (!t) return false;
      if (t.isContentEditable) return true;
      const tag = t.tagName;
      return tag === "INPUT" || tag === "TEXTAREA";
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        clear();
        return;
      }
      if (isEditable(e.target)) return;
      if ((e.key === "Backspace" || e.key === "Delete") && onDelete) {
        e.preventDefault();
        onDelete(ids);
        clear();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-row-selection-toolbar]")) return;
      if (t.closest("[data-radix-popper-content-wrapper]")) return;
      if (t.closest("[data-radix-portal]")) return;
      if (e.shiftKey || e.metaKey || e.ctrlKey) return;
      clear();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [count, state.ids, clear, onDelete]);

  return null;
}
