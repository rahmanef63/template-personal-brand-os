"use client";

/** Hover-revealed actions cluster anchored to the left edge of every
 *  text-shape NotionBlock. Renders the optional drag handle slot +
 *  the "⋯" button that opens BlockActionsMenu (turn-into / duplicate /
 *  delete). Extracted from NotionBlock to keep that file under the
 *  200-LOC budget enforced by audit:file-size. */

import type { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlockType } from "../types";
import { BlockActionsMenu } from "./BlockActionsMenu";

export interface BlockActionsHandleProps {
  currentType: BlockType;
  onTurnInto: (t: BlockType) => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  dragHandle?: ReactNode;
  color?: string;
  bgColor?: string;
  onSetColor?: (color?: string, bgColor?: string) => void;
  onCopyLink?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function BlockActionsHandle({
  currentType, onTurnInto, onDuplicate, onRemove, dragHandle,
  color, bgColor, onSetColor, onCopyLink, onMoveUp, onMoveDown,
}: BlockActionsHandleProps) {
  return (
    <div className="absolute -left-12 top-1 flex items-center gap-0.5 opacity-0 transition group-hover/block:opacity-100">
      {dragHandle}
      <BlockActionsMenu
        currentType={currentType}
        onTurnInto={onTurnInto}
        onDuplicate={onDuplicate}
        onDelete={onRemove}
        color={color}
        bgColor={bgColor}
        onSetColor={onSetColor}
        onCopyLink={onCopyLink}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground"
          aria-label="Block actions"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </BlockActionsMenu>
    </div>
  );
}
