"use client";

/** Shared primitives for OptionPicker — colors, chip, per-option menu.
 *  Split from option-picker.tsx to keep both under 200-LOC pre-commit gate. */

import { Check, Edit2, MoreHorizontal, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SelectOption } from "../../types";

export const OPTION_COLORS = [
  { id: "default", label: "Default", className: "bg-muted text-foreground" },
  { id: "gray",    label: "Gray",    className: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100" },
  { id: "brown",   label: "Brown",   className: "bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100" },
  { id: "orange",  label: "Orange",  className: "bg-orange-200 text-orange-900 dark:bg-orange-900 dark:text-orange-100" },
  { id: "yellow",  label: "Yellow",  className: "bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100" },
  { id: "green",   label: "Green",   className: "bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-100" },
  { id: "blue",    label: "Blue",    className: "bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-100" },
  { id: "purple",  label: "Purple",  className: "bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-100" },
  { id: "pink",    label: "Pink",    className: "bg-pink-200 text-pink-900 dark:bg-pink-900 dark:text-pink-100" },
  { id: "red",     label: "Red",     className: "bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100" },
];

export function colorClass(color?: string): string {
  return OPTION_COLORS.find((c) => c.id === color)?.className ?? OPTION_COLORS[0].className;
}

export function OptionChip({ opt, onRemove }: { opt: SelectOption; onRemove?: () => void }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs", colorClass(opt.color))}>
      {opt.name}
      {onRemove && (
        <Button variant="ghost" size="icon" type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="h-auto w-auto p-0 opacity-60 hover:bg-transparent hover:opacity-100" aria-label="Remove option">
          <X className="h-3 w-3" />
        </Button>
      )}
    </span>
  );
}

export function OptionMenu({ opt, onRename, onDelete, onSetColor }: {
  opt: SelectOption;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onSetColor: (id: string, color: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Option actions" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => onRename(opt.id)}><Edit2 className="mr-2 h-3 w-3" />Rename</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(opt.id)}><Trash2 className="mr-2 h-3 w-3" />Delete</DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">Color</div>
        {OPTION_COLORS.map((c) => (
          <DropdownMenuItem key={c.id} onClick={() => onSetColor(opt.id, c.id)}>
            <span className={cn("mr-2 inline-block h-3 w-3 rounded-full", c.className)} />
            {c.label}
            {opt.color === c.id && <Check className="ml-auto h-3 w-3" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
