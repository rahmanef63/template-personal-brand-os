"use client";

/** DatabaseMenu — popover with database-level operations: rename,
 *  duplicate (structure-only / with rows), lock toggle, delete (with
 *  native confirm). Pure props-driven — host supplies the four
 *  callbacks; any omitted callback hides its row.
 *
 *  Strip vs upstream: dropped IconPickerPopover (rr's icon-picker is
 *  a separate slice that host wires externally), SubItemsPicker (needs
 *  subItemsParentPropId schema field — deferred), DataMenu (lives in
 *  database-json slice), inline PropertiesMenu (already covered by
 *  ColumnHeaderMenu per-column). Lifted from notion-page-clone CK-1D
 *  Phase 4. */

import { MoreHorizontal, Pencil, Copy, Lock, Unlock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Database } from "../../types";

export interface DatabaseMenuProps {
  db: Database;
  /** New name from a window.prompt fallback. Omit to hide. */
  onRename?: (next: string) => void;
  /** `includeRows` true = deep-copy rows alongside structure. Omit to hide. */
  onDuplicate?: (opts: { includeRows: boolean }) => void;
  /** Flip `db.locked`. Omit to hide. */
  onLockToggle?: (next: boolean) => void;
  /** Native confirm wraps before firing. Omit to hide. */
  onRemove?: () => void;
  /** Override default `<button><MoreHorizontal /></button>` trigger. */
  trigger?: React.ReactNode;
}

export function DatabaseMenu({
  db, onRename, onDuplicate, onLockToggle, onRemove, trigger,
}: DatabaseMenuProps) {
  const hasAny = !!(onRename || onDuplicate || onLockToggle || onRemove);
  if (!hasAny) return null;

  const handleRename = () => {
    if (!onRename) return;
    const next = window.prompt("Database name", db.name);
    if (next != null && next.trim()) onRename(next.trim());
  };
  const handleRemove = () => {
    if (!onRemove) return;
    if (window.confirm(`Move "${db.name || "Untitled"}" to Trash? Rows are kept and can be restored.`)) {
      onRemove();
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      type="button"
      className="h-auto rounded p-1 text-muted-foreground [&_svg]:size-3.5"
      title="Database menu"
      aria-label="Database menu"
    >
      <MoreHorizontal className="h-3.5 w-3.5" />
    </Button>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger ?? defaultTrigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-60 p-1">
        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Database
        </div>
        {onRename && (
          <Button
            variant="ghost"
            type="button"
            onClick={handleRename}
            className="h-auto w-full justify-start gap-2 rounded px-2 py-1.5 text-xs font-normal [&_svg]:size-3.5"
          >
            <Pencil className="h-3.5 w-3.5" /> Rename
          </Button>
        )}
        {onDuplicate && (
          <>
            <Button
              variant="ghost"
              type="button"
              onClick={() => onDuplicate({ includeRows: false })}
              title="Clone properties + views — rows are NOT copied"
              className="h-auto w-full justify-start gap-2 rounded px-2 py-1.5 text-xs font-normal [&_svg]:size-3.5"
            >
              <Copy className="h-3.5 w-3.5" /> Duplicate (structure only)
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => onDuplicate({ includeRows: true })}
              title="Clone structure + deep-copy rows"
              className="h-auto w-full justify-start gap-2 rounded px-2 py-1.5 text-xs font-normal [&_svg]:size-3.5"
            >
              <Copy className="h-3.5 w-3.5" /> Duplicate with rows
            </Button>
          </>
        )}
        {onLockToggle && (
          <Button
            variant="ghost"
            type="button"
            onClick={() => onLockToggle(!db.locked)}
            title={db.locked ? "Unlock — allow property/view edits" : "Lock — prevent property/view edits"}
            className="h-auto w-full justify-start gap-2 rounded px-2 py-1.5 text-xs font-normal [&_svg]:size-3.5"
          >
            {db.locked
              ? <Unlock className="h-3.5 w-3.5" />
              : <Lock className="h-3.5 w-3.5" />}
            {db.locked ? "Unlock database" : "Lock database"}
          </Button>
        )}
        {onRemove && (
          <Button
            variant="ghost"
            type="button"
            onClick={handleRemove}
            className="h-auto w-full justify-start gap-2 rounded px-2 py-1.5 text-xs font-normal text-destructive hover:bg-destructive/10 hover:text-destructive [&_svg]:size-3.5"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete database
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
