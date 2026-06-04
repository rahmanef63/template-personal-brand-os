"use client";

/** <NotionProperty /> — single property cell + schema editor (per
 *  Notion canon: VALUE edit + SCHEMA edit merged into one primitive).
 *
 *  Per-type cells live in property-cells.tsx (text / number / checkbox
 *  / select / multi_select / status / date / url / email / phone). For
 *  richer cells (relation / rollup / formula / files), pair with the
 *  full databases slice. */

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { renderPropertyCell } from "./property-cells";
import type { Property, PropertyValue } from "../types";

export interface NotionPropertyProps {
  prop: Property;
  value: PropertyValue;
  onChange?: (next: PropertyValue) => void;
  /** Modify the property definition itself (rename / change type / add options). */
  onSchemaChange?: (patch: Partial<Property>) => void;
  /** Drop the property entirely. */
  onSchemaRemove?: () => void;
  readOnly?: boolean;
  className?: string;
  /** Hide the per-cell schema edit affordances (name + remove). */
  hideSchemaControls?: boolean;
}

export function NotionProperty({
  prop, value,
  onChange, onSchemaChange, onSchemaRemove,
  readOnly, className, hideSchemaControls,
}: NotionPropertyProps) {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(prop.name);
  const ro = readOnly || !onChange;

  const commitName = () => {
    if (draftName.trim() && draftName.trim() !== prop.name) {
      onSchemaChange?.({ name: draftName.trim() });
    }
    setEditingName(false);
  };

  if (hideSchemaControls) {
    return (
      <div className={className}>
        {renderPropertyCell({ prop, value, readOnly: ro, onChange })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 py-1", className)}>
      <div className="flex w-32 shrink-0 items-center gap-1 text-xs text-muted-foreground">
        {editingName ? (
          <Input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitName();
              if (e.key === "Escape") { setDraftName(prop.name); setEditingName(false); }
            }}
            className="h-6 border-0 bg-transparent px-1 py-0 text-xs shadow-none focus-visible:ring-0"
          />
        ) : (
          <span className="flex-1 truncate">{prop.name}</span>
        )}
        {onSchemaChange && !editingName && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingName(true)}
            className="h-4 w-4 text-muted-foreground/60 hover:text-foreground"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        )}
        {onSchemaRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSchemaRemove}
            className="h-4 w-4 text-muted-foreground/60 hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="flex-1">{renderPropertyCell({ prop, value, readOnly: ro, onChange })}</div>
    </div>
  );
}
