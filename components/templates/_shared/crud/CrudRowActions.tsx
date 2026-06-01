"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  label: string;
  publicHref?: string | null;
  canReorder: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onDelete: (id: string, label: string) => void;
}

/** Right-aligned per-row action cluster used by CrudListView. Extracted
 *  to keep the parent under the 200-LOC cap once reorder arrows
 *  joined Delete / View-public. */
export function CrudRowActions({
  id,
  label,
  publicHref,
  canReorder,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-1">
      {canReorder && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            title="Move up"
            disabled={isFirst}
            onClick={() => onMoveUp?.(id)}
          >
            <ChevronUp className="size-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            title="Move down"
            disabled={isLast}
            onClick={() => onMoveDown?.(id)}
          >
            <ChevronDown className="size-3.5" />
          </Button>
        </>
      )}
      {publicHref && (
        <Button asChild size="icon" variant="ghost" className="size-7" title="View public">
          <Link href={publicHref} target="_blank">
            <ExternalLink className="size-3.5" />
          </Link>
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        className="size-7 text-destructive hover:text-destructive"
        title="Delete"
        onClick={() => onDelete(id, label)}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}
