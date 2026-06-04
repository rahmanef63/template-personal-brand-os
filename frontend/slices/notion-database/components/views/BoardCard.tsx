"use client";

/** BoardCard — single kanban card. Draggable, with RowActions overlay.
 *  Extracted from BoardView.tsx (CK-2C, 2026-05-24) to keep parent
 *  under the 200-LOC audit cap. */

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { RowActionsMenu } from "../RowActionsMenu";
import type { Page, Property } from "../../types";
import type { ViewProps } from "./types";

const CARD_PREFIX = "card:";

export function BoardCard({
  row, groupProp, draggable, isDragging,
  onOpen, onDuplicate, onRemove, renderCell, db,
}: {
  row: Page;
  groupProp: Property;
  draggable: boolean;
  isDragging: boolean;
  onOpen?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  renderCell: ViewProps["renderCell"];
  db: ViewProps["db"];
}) {
  const id = `${CARD_PREFIX}${row.id}`;
  const { attributes, listeners, setNodeRef } = useDraggable({ id, disabled: !draggable });
  const showActions = !!onOpen || !!onDuplicate || !!onRemove;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group/card relative rounded-md border border-border bg-card p-2 shadow-sm transition",
        draggable && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 ring-2 ring-foreground/30",
        onOpen && !draggable && "cursor-pointer",
      )}
      {...attributes}
      {...listeners}
    >
      {showActions && (
        <div className="absolute right-1 top-1 z-10 opacity-0 transition group-hover/card:opacity-100">
          <RowActionsMenu
            onOpen={onOpen}
            onDuplicate={onDuplicate}
            onRemove={onRemove}
          />
        </div>
      )}
      <div
        className={cn("mb-1 pr-6 text-sm font-medium", onOpen && "cursor-pointer hover:underline")}
        onClick={onOpen}
      >
        {row.title || "Untitled"}
      </div>
      <div className="space-y-1">
        {db.properties
          .filter((p) => !p.hidden && p.id !== groupProp.id)
          .slice(0, 4)
          .map((p) => (
            <div key={p.id} className="text-[11px]">{renderCell(p, row)}</div>
          ))}
      </div>
    </div>
  );
}

export { CARD_PREFIX };
