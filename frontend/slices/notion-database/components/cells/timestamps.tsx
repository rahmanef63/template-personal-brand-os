"use client";

/** Read-only system timestamp + unique-id cells.
 *  - CreatedTimeCell: row.createdAt
 *  - LastEditedTimeCell: row.updatedAt
 *  - UniqueIdCell: prop.uniqueIdPrefix + zero-padded row index in db */

import { Clock, History, Hash } from "lucide-react";
import type { Database, Page, Property } from "../../types";

function fmtDateTime(ts: number | undefined): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export function CreatedTimeCell({ row }: { row: Page }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Clock className="h-3 w-3" />
      {fmtDateTime(row.createdAt)}
    </span>
  );
}

export function LastEditedTimeCell({ row }: { row: Page }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <History className="h-3 w-3" />
      {fmtDateTime(row.updatedAt)}
    </span>
  );
}

export function UniqueIdCell({ db, row, prop }: { db: Database; row: Page; prop: Property }) {
  const index = db.rowIds.indexOf(row.id);
  const safeIdx = index >= 0 ? index + 1 : (db.uniqueIdCounter ?? 0);
  const padded = String(safeIdx).padStart(3, "0");
  const prefix = prop.uniqueIdPrefix ?? "";
  return (
    <span className="flex items-center gap-1 font-mono text-xs">
      <Hash className="h-3 w-3 text-muted-foreground" />
      {prefix ? `${prefix}-${padded}` : padded}
    </span>
  );
}

/** User-attribution cells. Render initials chip when userLookup
 *  resolves the id; fall back to raw id string when no resolver. */
function UserChip({ userId, userLookup }: { userId?: string; userLookup?: (id: string) => { name: string; icon?: string } | null }) {
  if (!userId) return <span className="text-xs text-muted-foreground/60">—</span>;
  const user = userLookup?.(userId);
  const label = user?.name ?? userId;
  const ini = label.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
        {user?.icon ?? ini}
      </span>
      {label}
    </span>
  );
}

export function CreatedByCell({ row, userLookup }: { row: Page; userLookup?: (id: string) => { name: string; icon?: string } | null }) {
  return <UserChip userId={row.createdBy} userLookup={userLookup} />;
}

export function LastEditedByCell({ row, userLookup }: { row: Page; userLookup?: (id: string) => { name: string; icon?: string } | null }) {
  return <UserChip userId={row.lastEditedBy} userLookup={userLookup} />;
}
