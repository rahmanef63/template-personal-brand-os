"use client";

/** SortableBlockList — DnD-kit wrapper for block reorder. Render-prop
 *  pattern: caller passes `(id, dragProps) => ReactNode` and decides
 *  where to mount the drag handle (NotionBlock takes a `dragHandle`
 *  slot that consumes dragProps).
 *
 *  Pure orchestration — emits `(fromIndex, toIndex)` via `onReorder`.
 *  Host owns the array state. Pointer + keyboard sensors enabled. */

import type { ReactNode, CSSProperties } from "react";
import {
  DndContext, KeyboardSensor, PointerSensor, closestCenter,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface SortableBlockDragProps {
  setActivatorNodeRef: (el: HTMLElement | null) => void;
  /** Spread on the drag-handle element. */
  attributes: Record<string, unknown>;
  listeners: Record<string, unknown> | undefined;
}

export interface SortableBlockListProps {
  items: string[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  /** Render-prop: (id, dragProps) => ReactNode. Spread dragProps on
   *  the drag-handle element (typically a grip button). */
  children: (id: string, dragProps: SortableBlockDragProps) => ReactNode;
  className?: string;
}

function SortableBlockItem({
  id, children,
}: {
  id: string;
  children: (dragProps: SortableBlockDragProps) => ReactNode;
}) {
  const {
    attributes, listeners,
    setNodeRef, setActivatorNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} data-sortable-id={id}>
      {children({
        setActivatorNodeRef: setActivatorNodeRef as (el: HTMLElement | null) => void,
        attributes: attributes as unknown as Record<string, unknown>,
        listeners: listeners as unknown as Record<string, unknown> | undefined,
      })}
    </div>
  );
}

export function SortableBlockList({ items, onReorder, children, className }: SortableBlockListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = items.indexOf(String(active.id));
    const to = items.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    onReorder(from, to);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((id) => (
            <SortableBlockItem key={id} id={id}>
              {(dragProps) => children(id, dragProps)}
            </SortableBlockItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
