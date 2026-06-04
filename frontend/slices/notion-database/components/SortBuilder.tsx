"use client";

/** SortBuilder — popover UI for a view's sort list. Pure props — parent
 *  owns persistence (DatabaseViewConfig.sorts). Earlier sorts win on ties. */

import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Database, DatabaseSort } from "../types";

export interface SortBuilderProps {
  db: Database;
  sorts: DatabaseSort[];
  onChange: (next: DatabaseSort[]) => void;
}

export function SortBuilder({ db, sorts, onChange }: SortBuilderProps) {
  const addSort = () => {
    const prop = db.properties.find((p) => !sorts.some((s) => s.propertyId === p.id));
    if (!prop) return;
    onChange([...sorts, { propertyId: prop.id, direction: "asc" }]);
  };
  const remove = (i: number) => onChange(sorts.filter((_, j) => j !== i));
  const toggle = (i: number) =>
    onChange(sorts.map((s, j) => (j === i ? { ...s, direction: s.direction === "asc" ? "desc" : "asc" } : s)));
  const setProp = (i: number, propId: string) =>
    onChange(sorts.map((s, j) => (j === i ? { ...s, propertyId: propId } : s)));

  return (
    <div className="min-w-[260px] space-y-2 p-2">
      <div className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Sort
      </div>
      {sorts.length === 0 && (
        <div className="px-1 text-xs text-muted-foreground">No sorts applied.</div>
      )}
      {sorts.map((s, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Select value={s.propertyId} onValueChange={(v) => setProp(i, v)}>
            <SelectTrigger className="h-7 flex-1 text-xs">
              <SelectValue placeholder="Property" />
            </SelectTrigger>
            <SelectContent>
              {db.properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => toggle(i)}
            className="h-7 gap-1 px-2 text-xs font-normal"
          >
            {s.direction === "asc" ? (
              <><ArrowUp className="h-3 w-3" /> Asc</>
            ) : (
              <><ArrowDown className="h-3 w-3" /> Desc</>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => remove(i)}
            className="h-auto w-auto rounded p-1 text-muted-foreground hover:bg-accent"
            aria-label="Remove sort"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={addSort}
        className="mt-1 h-auto gap-1 px-0 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
      >
        <Plus className="h-3 w-3" /> Add sort
      </Button>
    </div>
  );
}
