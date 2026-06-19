"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CellRender, renderForLabel } from "./CrudCells";
import { CrudRowActions } from "./CrudRowActions";
import { CrudRowDialog } from "./CrudRowDialog";
import type {
  ColumnDef,
  CrudController,
  EntityMeta,
  FieldDef,
} from "./types";

/**
 * Generic admin list. Row click opens an inline dialog editor (AF-wave
 * default). Optional fields prop wires the dialog form schema; when not
 * provided, rows still open dialog with a "use deep-link editor"
 * fallback to keep backward compat.
 *
 * New flow:
 *   • Click row → CrudRowDialog with full field form + Save / Cancel
 *     / Delete inside.
 *   • Click "New" → controller.create(blank()) → open dialog on the
 *     fresh row (no page navigation).
 *   • Old per-row Edit-link button removed; delete stays inline for
 *     destructive-action visibility but stops row-click propagation.
 *
 * Responsive: secondary columns get `hideOnMobile` to drop below md.
 */
export function CrudListView<T>({
  meta,
  controller,
  columns,
  editPath,
  fields,
  description,
}: {
  meta: EntityMeta;
  controller: CrudController<T>;
  columns: ColumnDef<T>[];
  /** Used for deep-link rows (e.g. share a URL). Dialog handles inline
   *  editing without navigation — when `fields` is provided this is
   *  unused. Optional since BI-wave (PageSectionsEditor uses dialog-only). */
  editPath?: (id: string) => string;
  /** Field schema for the inline dialog. Pass to enable row-click
   *  editing; omit to fall back to legacy navigate-on-click. */
  fields?: FieldDef<T>[];
  description?: React.ReactNode;
}) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const open = openId !== null;
  const setOpen = (next: boolean) => {
    if (!next) setOpenId(null);
  };

  function openRow(id: string) {
    if (fields) {
      setOpenId(id);
    } else if (typeof window !== "undefined") {
      window.location.href = editPath?.(id) ?? "#";
    }
  }

  function createNew() {
    const item = controller.blank();
    controller.create(item);
    const id = controller.getId(item);
    if (fields) {
      setOpenId(id);
    } else if (typeof window !== "undefined") {
      window.location.href = editPath?.(id) ?? "#";
    }
  }

  function deleteItem(id: string, label: string) {
    if (confirm(`Delete "${label}"?`)) controller.remove(id);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {meta.labelPlural}
          </h1>
          <p className="text-xs text-muted-foreground">
            {controller.items.length} total
            {description ? <> · {description}</> : null}
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={createNew}>
          <Plus className="size-3.5" /> New {meta.label.toLowerCase()}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c, i) => (
                <TableHead
                  key={c.key}
                  className={cn(c.width, i > 0 && c.hideOnMobile && "hidden md:table-cell")}
                >
                  {c.header}
                </TableHead>
              ))}
              <TableHead className="w-[60px] text-right">{/* delete */}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {controller.items.map((row, idx) => {
              const id = controller.getId(row);
              const label = renderForLabel(row, columns);
              const publicHref = meta.publicHref?.(row as unknown);
              const clickable = Boolean(fields);
              const canReorder = Boolean(controller.moveUp && controller.moveDown);
              const isFirst = idx === 0;
              const isLast = idx === controller.items.length - 1;
              return (
                <TableRow
                  key={id}
                  onClick={clickable ? () => openRow(id) : undefined}
                  className={cn(clickable && "cursor-pointer hover:bg-accent/40")}
                >
                  {columns.map((c, i) => (
                    <TableCell
                      key={c.key}
                      className={cn(
                        c.mono ? "font-mono text-xs" : "text-xs",
                        i > 0 && c.hideOnMobile && "hidden md:table-cell",
                      )}
                    >
                      <CellRender col={c} row={row} />
                    </TableCell>
                  ))}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <CrudRowActions
                      id={id}
                      label={label}
                      publicHref={publicHref}
                      canReorder={canReorder}
                      isFirst={isFirst}
                      isLast={isLast}
                      onMoveUp={controller.moveUp}
                      onMoveDown={controller.moveDown}
                      onDelete={deleteItem}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {controller.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-8 text-center text-xs text-muted-foreground">
                  No {meta.labelPlural.toLowerCase()} yet. Click{" "}
                  <span className="font-medium">New {meta.label.toLowerCase()}</span>.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {fields && (
        <CrudRowDialog
          open={open}
          onOpenChange={setOpen}
          id={openId}
          meta={meta}
          controller={controller}
          fields={fields}
        />
      )}
    </div>
  );
}

