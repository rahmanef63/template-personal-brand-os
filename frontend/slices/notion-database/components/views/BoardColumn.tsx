"use client";

/** BoardColumn — single kanban lane. Drop target for cards.
 *  Extracted from BoardView.tsx (CK-2C, 2026-05-24) to keep parent
 *  under the 200-LOC audit cap. */

import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const GROUP_PREFIX = "group:";

export function BoardColumn({
  groupKey, label, count, onAdd, children,
}: {
  groupKey: string | null;
  label: string;
  count: number;
  onAdd?: () => void;
  children: React.ReactNode;
}) {
  const id = `${GROUP_PREFIX}${groupKey ?? "_none"}`;
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-64 shrink-0 flex-col rounded-md border border-border bg-muted/20 transition-colors",
        isOver && "border-foreground/40 bg-accent/40",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="text-xs font-medium">{label}</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] tabular-nums text-muted-foreground">{count}</span>
          {onAdd && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={onAdd}
              aria-label={`Add card to ${label}`}
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2">{children}</div>
    </div>
  );
}
