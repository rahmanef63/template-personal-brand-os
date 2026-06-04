"use client";

/** GalleryView — card grid (3-up at md, 4-up at lg). Card top shows the
 *  doc's icon emoji or first letter; body shows title + first 3 visible
 *  property cells. Hover reveals RowActionsMenu (open/duplicate/delete);
 *  card click → onOpenRow. */

import { Button } from "@/components/ui/button";
import { RowActionsMenu } from "../RowActionsMenu";
import type { ViewProps } from "./types";

export function GalleryView({
  db, rows, renderCell,
  onOpenRow, onRowDuplicate, onRowRemove, readOnly,
}: ViewProps) {
  const visible = db.properties.filter((p) => !p.hidden);
  const showActions = !readOnly && (!!onOpenRow || !!onRowDuplicate || !!onRowRemove);
  return (
    <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 lg:grid-cols-4">
      {rows.map((r) => (
        <div
          key={r.id}
          className="group/card relative overflow-hidden rounded-md border border-border bg-card shadow-sm transition hover:border-foreground/20"
        >
          {showActions && (
            <div className="absolute right-1 top-1 z-10 opacity-0 transition group-hover/card:opacity-100">
              <RowActionsMenu
                onOpen={onOpenRow ? () => onOpenRow(r.id) : undefined}
                onDuplicate={onRowDuplicate ? () => onRowDuplicate(r.id) : undefined}
                onRemove={onRowRemove ? () => onRowRemove(r.id) : undefined}
              />
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            className="block h-auto w-full whitespace-normal p-0 text-left hover:bg-transparent"
            onClick={onOpenRow ? () => onOpenRow(r.id) : undefined}
            disabled={!onOpenRow}
          >
            <div className="flex h-20 w-full items-center justify-center bg-muted/40 text-3xl">
              {r.icon || (r.title?.[0]?.toUpperCase() ?? "·")}
            </div>
            <div className="p-2">
              <div className="mb-1 truncate text-sm font-medium">{r.title || "Untitled"}</div>
              <div className="space-y-1">
                {visible.slice(0, 3).map((p) => (
                  <div key={p.id} className="truncate text-[11px]">{renderCell(p, r)}</div>
                ))}
              </div>
            </div>
          </Button>
        </div>
      ))}
      {rows.length === 0 && (
        <div className="col-span-full px-3 py-6 text-center text-xs italic text-muted-foreground">
          No rows match
        </div>
      )}
    </div>
  );
}
