"use client";

/** TableView — Notion-canonical table layout. Pre-filtered rows in;
 *  cells delegated to host via renderCell. Header optionally wrapped by
 *  renderColumnHeader (typically ColumnHeaderMenu). Row hover reveals
 *  the RowActionsMenu (Open / Duplicate / Delete). Rows carry
 *  `data-row-shell-id` so RowMarqueeOverlay can hit-test against
 *  them; when wrapped in `<RowSelectionProvider>` selected rows render
 *  a subtle primary-tinted ring.
 *
 *  Cell-level selection + drag-to-fill (folded in from the former
 *  `database-cell-selection` slice, v0.16): click a cell to select it,
 *  then drag the bottom-right handle down/up to copy its value into the
 *  spanned rows via `onRowUpdate`. Active only when interactive
 *  (not readOnly + onRowUpdate supplied). */

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { RowActionsMenu } from "../RowActionsMenu";
import { useRowSelectionOptional } from "../row-selection/RowSelectionProvider";
import { HeaderCheckboxGutter, RowCheckbox } from "../row-selection/Checkboxes";
import { SelectableCell } from "../cells/SelectableCell";
import { useDragFill } from "../../hooks/useDragFill";
import { CalcFooter } from "./CalcFooter";
import type { ViewProps } from "./types";

export function TableView({
  db, view, rows, readOnly,
  onRowRemove, onOpenRow, onRowDuplicate, onRowUpdate,
  renderCell, renderColumnHeader,
}: ViewProps) {
  const visibleProps = useMemo(() => db.properties.filter((p) => !p.hidden), [db.properties]);
  const hasRowActions = !readOnly && (!!onRowRemove || !!onOpenRow || !!onRowDuplicate);
  const sel = useRowSelectionOptional();
  const showCheckboxGutter = !!sel;
  const rowIds = useMemo(() => rows.map((r) => r.id), [rows]);
  const emptyColSpan = visibleProps.length + (hasRowActions ? 1 : 0) + (showCheckboxGutter ? 1 : 0);

  // Cell-level selection + drag-fill (interactive only).
  const cellInteractive = !readOnly && !!onRowUpdate;
  const [activeCell, setActiveCell] = useState<{ rowId: string; propId: string } | null>(null);
  const fill = useDragFill({
    rowIds,
    onFill: (source, targets) => {
      const value = rows.find((r) => r.id === source.rowId)?.rowProps?.[source.propId];
      if (value === undefined) return;
      targets.forEach((rid) => onRowUpdate?.(rid, source.propId, value));
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
          <tr>
            {showCheckboxGutter && (
              <th aria-hidden className="w-8 px-2">
                <HeaderCheckboxGutter rowIds={rowIds} />
              </th>
            )}
            {visibleProps.map((p) => (
              <th key={p.id} className="px-3 py-1.5 font-normal">
                {renderColumnHeader ? renderColumnHeader(p) : (
                  <span className="truncate">{p.name}</span>
                )}
              </th>
            ))}
            {hasRowActions && <th aria-hidden className="w-8" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, rowIndex) => {
            const selected = sel?.isSelected(r.id) ?? false;
            return (
            <tr
              key={r.id}
              data-row-shell-id={r.id}
              aria-selected={selected || undefined}
              className={cn(
                "group/row border-b border-border/60 hover:bg-accent/30",
                selected && "bg-primary/5 ring-1 ring-inset ring-primary/40",
              )}
            >
              {showCheckboxGutter && (
                <td className="w-8 px-2">
                  <RowCheckbox rowId={r.id} />
                </td>
              )}
              {visibleProps.map((p) => {
                const cell = renderCell(p, r);
                if (!cellInteractive) {
                  return <td key={p.id} className="px-3 py-1.5">{cell}</td>;
                }
                const isActive = activeCell?.rowId === r.id && activeCell?.propId === p.id;
                return (
                  <td key={p.id} className="px-3 py-1.5">
                    <SelectableCell
                      rowId={r.id}
                      propId={p.id}
                      selected={isActive}
                      inFillRange={fill.isInFillRange(rowIndex, p.id)}
                      showFillHandle={isActive}
                      onSelect={() => setActiveCell({ rowId: r.id, propId: p.id })}
                      onStartFill={() => fill.start({ rowId: r.id, propId: p.id, rowIndex })}
                    >
                      {cell}
                    </SelectableCell>
                  </td>
                );
              })}
              {hasRowActions && (
                <td className="px-1">
                  <span className="inline-flex opacity-0 transition group-hover/row:opacity-100">
                    <RowActionsMenu
                      onOpen={onOpenRow ? () => onOpenRow(r.id) : undefined}
                      onDuplicate={onRowDuplicate ? () => onRowDuplicate(r.id) : undefined}
                      onRemove={onRowRemove ? () => onRowRemove(r.id) : undefined}
                    />
                  </span>
                </td>
              )}
            </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={emptyColSpan} className="px-3 py-4 text-center text-xs italic text-muted-foreground">
                No rows match
              </td>
            </tr>
          )}
        </tbody>
        <CalcFooter view={view} rows={rows} visibleProps={visibleProps} hasRowActions={hasRowActions} />
      </table>
    </div>
  );
}
