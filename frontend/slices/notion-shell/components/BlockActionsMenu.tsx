"use client";

/** BlockActionsMenu — turn-into / duplicate / delete popover. Trigger
 *  is the host's "⋯" button (caller provides via `children`). Pure
 *  callbacks — host wires to store mutations. The "turn into" submenu
 *  is rendered inline (no nested dropdown) to keep the component <200
 *  LOC and avoid radix sub-menu coordination. */

import { Trash2, Copy, Shapes, Palette, Link2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { BLOCK_SPECS, specFor, type BlockSpec } from "../lib/blockSpecs";
import { BlockColorPicker } from "./BlockColorPicker";
import type { BlockType } from "../types";

const TURN_INTO_DEFAULT: BlockType[] = [
  "paragraph", "h1", "h2", "h3",
  "todo", "bullet", "numbered", "toggle",
  "quote", "callout", "code", "divider",
];

export interface BlockActionsMenuProps {
  currentType: BlockType;
  onTurnInto: (type: BlockType) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  /** Restrict the "turn into" set. Defaults to the basic-blocks subset. */
  turnIntoTypes?: BlockType[];
  /** Override the spec source (matched by type). */
  specs?: BlockSpec[];
  /** Current block colour ids — drive the picker's active swatches. */
  color?: string;
  bgColor?: string;
  /** Set text + background colour. When omitted the Color section hides. */
  onSetColor?: (color?: string, bgColor?: string) => void;
  /** Copy a deep link to this block. */
  onCopyLink?: () => void;
  /** Reorder one slot. When omitted the row hides. */
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: React.ReactNode;
}

export function BlockActionsMenu({
  currentType,
  onTurnInto,
  onDuplicate,
  onDelete,
  turnIntoTypes = TURN_INTO_DEFAULT,
  specs = BLOCK_SPECS,
  color,
  bgColor,
  onSetColor,
  onCopyLink,
  onMoveUp,
  onMoveDown,
  children,
}: BlockActionsMenuProps) {
  const current = specFor(currentType);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shapes className="h-3.5 w-3.5" />
          Turn into
        </DropdownMenuLabel>
        <div className="grid max-h-48 grid-cols-1 overflow-y-auto px-1 pb-1">
          {turnIntoTypes.map((t) => {
            const spec = specs.find((s) => s.type === t);
            if (!spec) return null;
            const Icon = spec.icon;
            const isCurrent = t === currentType;
            return (
              <DropdownMenuItem
                key={t}
                onClick={() => onTurnInto(t)}
                className={cn("gap-2 text-sm", isCurrent && "bg-accent/60")}
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="flex-1">{spec.label}</span>
                {isCurrent && <span className="text-[10px] text-muted-foreground">current</span>}
              </DropdownMenuItem>
            );
          })}
        </div>
        {onSetColor && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
              <Palette className="h-3.5 w-3.5" />
              Color
            </DropdownMenuLabel>
            <BlockColorPicker color={color} bgColor={bgColor} onSet={onSetColor} />
          </>
        )}
        {(onDuplicate || onDelete) && <DropdownMenuSeparator />}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate} className="gap-2 text-sm">
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            Duplicate
          </DropdownMenuItem>
        )}
        {onCopyLink && (
          <DropdownMenuItem onClick={onCopyLink} className="gap-2 text-sm">
            <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
            Copy link to block
          </DropdownMenuItem>
        )}
        {onMoveUp && (
          <DropdownMenuItem onClick={onMoveUp} className="gap-2 text-sm">
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
            Move up
          </DropdownMenuItem>
        )}
        {onMoveDown && (
          <DropdownMenuItem onClick={onMoveDown} className="gap-2 text-sm">
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
            Move down
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="gap-2 text-sm text-destructive focus:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
            {current && <span className="ml-auto text-[10px] text-muted-foreground">{current.label}</span>}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
