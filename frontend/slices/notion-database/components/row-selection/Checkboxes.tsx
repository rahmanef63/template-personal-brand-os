"use client";

/** Row multi-select checkboxes — `HeaderCheckboxGutter` (header
 *  "select all" w/ indeterminate state) + `RowCheckbox` (per-row
 *  toggle). Both require RowSelectionProvider in the tree.
 *
 *  These are shadcn <Button variant="ghost"> with `role="checkbox"` +
 *  `aria-checked="mixed"` forwarded for tri-state semantics — the role
 *  drives screen-reader announcements. The checkbox visuals live in the
 *  className (border + bg-primary when checked).
 *
 *  Lifted from notion-page-clone CK-1D Phase 5. */

import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRowSelection } from "./RowSelectionProvider";

export function HeaderCheckboxGutter({ rowIds }: { rowIds: string[] }) {
  const sel = useRowSelection();
  const total = rowIds.length;
  const selectedCount = rowIds.filter((id) => sel.isSelected(id)).length;
  const state: "checked" | "indeterminate" | "unchecked" =
    selectedCount === 0 ? "unchecked" : selectedCount === total ? "checked" : "indeterminate";
  const onClick = () => {
    if (state === "checked") sel.clear();
    else sel.setIds(rowIds);
  };
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      role="checkbox"
      aria-checked={state === "indeterminate" ? "mixed" : state === "checked"}
      aria-label={state === "checked" ? "Clear selection" : "Select all rows"}
      title={state === "checked" ? "Clear selection" : "Select all"}
      onClick={onClick}
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded-sm border p-0 transition",
        state !== "unchecked"
          ? "border-primary bg-primary text-primary-foreground"
          : "border-muted-foreground/40 hover:border-foreground",
      )}
    >
      {state === "checked" && <Check className="h-3 w-3" />}
      {state === "indeterminate" && <Minus className="h-3 w-3" />}
    </Button>
  );
}

export function RowCheckbox({ rowId }: { rowId: string }) {
  const sel = useRowSelection();
  const checked = sel.isSelected(rowId);
  const onClick = (e: React.MouseEvent) => { e.stopPropagation(); sel.toggle(rowId); };
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      role="checkbox"
      aria-checked={checked}
      aria-label={checked ? "Deselect row" : "Select row"}
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border p-0 transition",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-muted-foreground/40 opacity-60 hover:border-foreground group-hover/row:opacity-100",
      )}
    >
      {checked && <Check className="h-3 w-3" />}
    </Button>
  );
}
