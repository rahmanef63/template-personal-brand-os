"use client";

/** <NotionDatabase /> — full database surface: view tabs, view options
 *  (sort / filter / search), per-column header menu, + built-in views.
 *  Pure / callback-based — hand it `db` + `rows` + handlers; it emits
 *  CRUD intents only. View routing dispatches via VIEW_REGISTRY. */

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { renderPropertyCell } from "./property-cells";
import { ViewTabs } from "./ViewTabs";
import { ViewOptions } from "./ViewOptions";
import { VIEW_REGISTRY, type ViewRegistry } from "./views";
import { buildColumnHeader } from "./notion-database-helpers";
import { applyView } from "../lib/viewData";
import type {
  Database, DatabaseViewConfig, DbView, Page, Property, PropertyType, PropertyValue,
} from "../types";

const DEFAULT_NEW_PROP_TYPE: PropertyType = "text";

export interface NotionDatabaseProps {
  db: Database;
  rows: Page[];
  // Property CRUD
  onPropertyAdd?: (type: PropertyType) => void;
  onPropertyUpdate?: (propId: string, patch: Partial<Property>) => void;
  onPropertyRemove?: (propId: string) => void;
  /** Duplicate a column (schema + values) — Duplicate item. */
  onPropertyDuplicate?: (propId: string) => void;
  /** Insert a column next to `propId` (offset -1 left / +1 right). */
  onPropertyInsert?: (propId: string, offset: -1 | 1) => void;
  /** Reorder a column one slot (offset -1 left / +1 right). */
  onPropertyMove?: (propId: string, offset: -1 | 1) => void;
  // Row CRUD
  onRowAdd?: () => void;
  onRowUpdate?: (rowId: string, propId: string, value: PropertyValue) => void;
  onRowRemove?: (rowId: string) => void;
  // View CRUD (optional — when omitted the view tabs are read-only)
  onViewActivate?: (viewId: string) => void;
  onViewAdd?: (type: DbView) => void;
  onViewRemove?: (viewId: string) => void;
  onViewConfigChange?: (viewId: string, patch: Partial<DatabaseViewConfig>) => void;
  /** Override / extend the view registry (e.g. add timeline / chart). */
  viewRegistry?: ViewRegistry;
  /** Optional row-open callback — surfaced by Chart / Dashboard / Map /
   *  Timeline + per-view RowActionsMenu (Open entry). */
  onOpenRow?: (rowId: string) => void;
  /** Create a row with values — used by FormView submit. Host
   *  translates to addRow + setRowValue against its store. */
  onRowCreate?: (draft: { title: string; rowProps: Record<string, PropertyValue> }) => Promise<void> | void;
  /** Duplicate a row — surfaced by RowActionsMenu on every view. */
  onRowDuplicate?: (rowId: string) => void;
  /** "+" button in a Board column / Gallery row / Calendar day — caller
   *  creates a row with the given bucket value pre-set on `groupPropId`. */
  onRowAddInGroup?: (args: { groupPropId: string; groupValue: string | null }) => void;
  /** Resolves user id → { name, icon? } for person / created_by /
   *  last_edited_by cells. Optional — falls back to raw id when omitted. */
  userLookup?: (userId: string) => { id: string; name: string; icon?: string } | null;
  /** All workspace pages — required by `relation` (link picker) +
   *  `rollup` (aggregate). When omitted, relation/rollup cells render a
   *  graceful placeholder. */
  pages?: Page[];
  /** All workspace databases — required by `relation` (target picker) +
   *  `rollup` (target props). Required when the schema includes
   *  relation/rollup columns. */
  databases?: Database[];
  /** Wires the "+ Create new row" button in RelationCell. Host creates
   *  a new row in `dbId` and resolves to its id. */
  onCreateRelatedRow?: (dbId: string, draft?: { title?: string }) => Promise<string>;
  /** Optional chrome rendered to the right of the DB name in the
   *  built-in header. Drop a `<DatabaseMenu />` here for rename /
   *  duplicate / lock / delete actions. */
  headerActions?: import("react").ReactNode;
  readOnly?: boolean;
  className?: string;
}

export function NotionDatabase({
  db, rows,
  onPropertyAdd, onPropertyUpdate, onPropertyRemove,
  onPropertyDuplicate, onPropertyInsert, onPropertyMove,
  onRowAdd, onRowUpdate, onRowRemove,
  onViewActivate, onViewAdd, onViewRemove, onViewConfigChange,
  viewRegistry, onOpenRow, onRowCreate,
  onRowDuplicate, onRowAddInGroup,
  userLookup, pages, databases, onCreateRelatedRow,
  headerActions,
  readOnly, className,
}: NotionDatabaseProps) {
  const activeView = db.views.find((v) => v.id === db.activeViewId) ?? db.views[0];
  if (!activeView) {
    return (
      <div className={cn("rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground", className)}>
        {db.name} has no views configured yet.
      </div>
    );
  }

  const visibleRows = useMemo(
    () => applyView(rows, db, activeView),
    [rows, db, activeView],
  );
  const registry = useMemo(
    () => ({ ...VIEW_REGISTRY, ...(viewRegistry ?? {}) }),
    [viewRegistry],
  );
  const View = registry[activeView.type] ?? registry.table!;

  const renderCell = (prop: Property, row: Page) =>
    renderPropertyCell({
      prop,
      value: (row.rowProps?.[prop.id] as PropertyValue) ?? null,
      readOnly: !!readOnly || !onRowUpdate,
      onChange: onRowUpdate ? (v) => onRowUpdate(row.id, prop.id, v) : undefined,
      row,
      db,
      onPropertyChange: onPropertyUpdate ? (patch) => onPropertyUpdate(prop.id, patch) : undefined,
      userLookup,
      pages,
      databases,
      onCreateRelatedRow,
    });

  const renderColumnHeader = (prop: Property) => buildColumnHeader({
    prop, db, activeView, databases,
    onPropertyUpdate, onPropertyRemove, onPropertyDuplicate,
    onPropertyInsert, onPropertyMove, onViewConfigChange,
  });

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-card", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <h3 className="truncate text-sm font-semibold">{db.name}</h3>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {visibleRows.length} / {rows.length} row{rows.length === 1 ? "" : "s"}
          </span>
          {headerActions}
        </div>
      </div>
      <ViewTabs
        views={db.views}
        activeViewId={activeView.id}
        onActivate={onViewActivate ?? (() => {})}
        onAdd={onViewAdd}
        onRemove={onViewRemove}
      />
      {onViewConfigChange && (
        <ViewOptions
          db={db}
          view={activeView}
          onChange={(patch) => onViewConfigChange(activeView.id, patch)}
        />
      )}
      <View
        db={db}
        view={activeView}
        rows={visibleRows}
        readOnly={readOnly}
        onRowUpdate={onRowUpdate}
        onRowRemove={onRowRemove}
        onRowAdd={onRowAdd}
        renderCell={renderCell}
        renderColumnHeader={renderColumnHeader}
        onViewConfigChange={onViewConfigChange ? (patch) => onViewConfigChange(activeView.id, patch) : undefined}
        onOpenRow={onOpenRow}
        onRowCreate={onRowCreate}
        onRowDuplicate={onRowDuplicate}
        onRowAddInGroup={onRowAddInGroup}
      />
      {!readOnly && onPropertyAdd && (
        <div className="flex items-center gap-2 border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPropertyAdd(DEFAULT_NEW_PROP_TYPE)}
            className="h-7 gap-1 px-2 text-xs text-muted-foreground"
          >
            <Plus className="h-3 w-3" /> Add property
          </Button>
          {onRowAdd && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRowAdd}
              className="h-7 gap-1 px-2 text-xs text-muted-foreground"
            >
              <Plus className="h-3 w-3" /> Add row
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
