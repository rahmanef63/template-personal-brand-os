"use client";

/** BoardView — kanban grouped by the view's `groupBy` select / status
 *  property. Drag cards between columns to reassign the property value;
 *  click "+" on a column header to add a row with that bucket pre-set.
 *  Each card hover reveals RowActionsMenu (open / duplicate / delete).
 *  Same-column reorder is intentionally NOT implemented — view sorts
 *  determine row order.
 *
 *  BoardColumn + BoardCard live in sibling files (CK-2C split). */

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { groupBy as groupRows } from "../../lib/viewData";
import type { ViewProps } from "./types";
import { BoardColumn } from "./BoardColumn";
import { BoardCard, CARD_PREFIX } from "./BoardCard";

const GROUP_PREFIX = "group:";

export function BoardView({
  db, view, rows, renderCell, readOnly,
  onRowUpdate, onOpenRow, onRowDuplicate, onRowRemove, onRowAddInGroup,
}: ViewProps) {
  const groupProp = db.properties.find((p) => p.id === view.groupBy);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );
  const [activeDrag, setActiveDrag] = useState<string | null>(null);

  if (!groupProp || (groupProp.type !== "select" && groupProp.type !== "status")) {
    return (
      <div className="px-4 py-8 text-center text-xs text-muted-foreground">
        Board view needs a <span className="font-medium">select</span> or{" "}
        <span className="font-medium">status</span> property to group by. Set
        one via the view options.
      </div>
    );
  }

  const groups = groupRows(rows, groupProp);
  const draggable = !readOnly && !!onRowUpdate;

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDrag(null);
    if (!draggable || !onRowUpdate) return;
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (!activeId.startsWith(CARD_PREFIX) || !overId.startsWith(GROUP_PREFIX)) return;
    const rowId = activeId.slice(CARD_PREFIX.length);
    const targetGroupKey = overId.slice(GROUP_PREFIX.length);
    const newValue = targetGroupKey === "_none" ? null : targetGroupKey;
    const row = rows.find((r) => r.id === rowId);
    const current = row?.rowProps?.[groupProp.id];
    const same = (current ?? null) === newValue;
    if (same) return;
    onRowUpdate(rowId, groupProp.id, newValue as never);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveDrag(String(e.active.id))}
      onDragCancel={() => setActiveDrag(null)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-3 overflow-x-auto p-3">
        {groups.map((g) => (
          <BoardColumn
            key={g.key ?? "_none"}
            groupKey={g.key}
            label={g.label}
            count={g.rows.length}
            onAdd={
              onRowAddInGroup
                ? () => onRowAddInGroup({ groupPropId: groupProp.id, groupValue: g.key })
                : undefined
            }
          >
            {g.rows.map((r) => (
              <BoardCard
                key={r.id}
                row={r}
                groupProp={groupProp}
                draggable={draggable}
                isDragging={activeDrag === `${CARD_PREFIX}${r.id}`}
                onOpen={onOpenRow ? () => onOpenRow(r.id) : undefined}
                onDuplicate={onRowDuplicate ? () => onRowDuplicate(r.id) : undefined}
                onRemove={onRowRemove ? () => onRowRemove(r.id) : undefined}
                renderCell={renderCell}
                db={db}
              />
            ))}
            {g.rows.length === 0 && (
              <div className="rounded border border-dashed border-border/60 px-2 py-3 text-center text-[11px] italic text-muted-foreground">
                drop here
              </div>
            )}
          </BoardColumn>
        ))}
      </div>
    </DndContext>
  );
}
