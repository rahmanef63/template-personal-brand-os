"use client";

/** ListView — compact one-row-per-page layout. Shows title + first
 *  visible property cells inline. Use when density matters more than
 *  per-column comparison. Row hover reveals open/duplicate/delete via
 *  RowActionsMenu. */

import { cn } from "@/lib/utils";
import { RowActionsMenu } from "../RowActionsMenu";
import type { ViewProps } from "./types";

export function ListView({
  db, rows, renderCell,
  onOpenRow, onRowDuplicate, onRowRemove, readOnly,
}: ViewProps) {
  const visible = db.properties.filter((p) => !p.hidden);
  const showActions = !readOnly && (!!onOpenRow || !!onRowDuplicate || !!onRowRemove);
  return (
    <div className="divide-y divide-border">
      {rows.map((r) => (
        <div
          key={r.id}
          className="group/row flex items-center gap-3 px-3 py-2 hover:bg-accent/30"
        >
          <span
            className={cn("w-48 shrink-0 truncate text-sm font-medium", onOpenRow && "cursor-pointer hover:underline")}
            onClick={onOpenRow ? () => onOpenRow(r.id) : undefined}
          >
            {r.title || "Untitled"}
          </span>
          <div className="flex flex-1 flex-wrap items-center gap-3 text-xs">
            {visible.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-1">
                <span className="text-muted-foreground">{p.name}:</span>
                <span className="max-w-[16ch] truncate">{renderCell(p, r)}</span>
              </div>
            ))}
          </div>
          {showActions && (
            <span className="opacity-0 transition group-hover/row:opacity-100">
              <RowActionsMenu
                onOpen={onOpenRow ? () => onOpenRow(r.id) : undefined}
                onDuplicate={onRowDuplicate ? () => onRowDuplicate(r.id) : undefined}
                onRemove={onRowRemove ? () => onRowRemove(r.id) : undefined}
              />
            </span>
          )}
        </div>
      ))}
      {rows.length === 0 && (
        <div className="px-3 py-4 text-center text-xs italic text-muted-foreground">
          No rows match
        </div>
      )}
    </div>
  );
}
