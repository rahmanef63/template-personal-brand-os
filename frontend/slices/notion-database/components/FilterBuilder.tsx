"use client";

/** FilterBuilder — popover UI for a view's filter list. Pure props —
 *  parent owns persistence (DatabaseViewConfig.filters). Filters apply
 *  AND-style (every row must match every filter).
 *
 *  Op picker is scoped to the chosen property's type. Value input
 *  switches per type (text / number / date / select multi-checkbox /
 *  none for is_empty/checked/etc). When a between op is picked, the
 *  value renders as two inputs (joined with `|` in storage).
 *
 *  Op definitions live in ./FilterBuilder-ops; value inputs in
 *  ./FilterBuilder-value (CK-2C split). */

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type {
  Database,
  DatabaseFilter,
  DatabaseFilterOp,
} from "../types";
import { opsForType } from "./FilterBuilder-ops";
import { ValueInput } from "./FilterBuilder-value";

export interface FilterBuilderProps {
  db: Database;
  filters: DatabaseFilter[];
  onChange: (next: DatabaseFilter[]) => void;
}

export function FilterBuilder({ db, filters, onChange }: FilterBuilderProps) {
  const addFilter = () => {
    const prop = db.properties[0];
    if (!prop) return;
    const ops = opsForType(prop.type);
    onChange([...filters, { propertyId: prop.id, op: ops[0]!.value, value: "" }]);
  };
  const remove = (i: number) => onChange(filters.filter((_, j) => j !== i));
  const update = (i: number, patch: Partial<DatabaseFilter>) =>
    onChange(filters.map((f, j) => (j === i ? { ...f, ...patch } : f)));

  return (
    <div className="min-w-[360px] space-y-2 p-2">
      <div className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Filters
      </div>
      {filters.length === 0 && (
        <div className="px-1 text-xs text-muted-foreground">No filters applied.</div>
      )}
      {filters.map((f, i) => {
        const prop = db.properties.find((p) => p.id === f.propertyId);
        const ops = opsForType(prop?.type);
        const opMeta = ops.find((o) => o.value === f.op) ?? ops[0];
        return (
          <div key={i} className="flex flex-wrap items-center gap-1.5">
            <Select
              value={f.propertyId}
              onValueChange={(v) => {
                const next = db.properties.find((p) => p.id === v);
                const allowed = opsForType(next?.type);
                const opStillValid = allowed.some((o) => o.value === f.op);
                update(i, {
                  propertyId: v,
                  op: opStillValid ? f.op : allowed[0]!.value,
                  value: "",
                });
              }}
            >
              <SelectTrigger className="h-7 w-32 text-xs">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                {db.properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={f.op} onValueChange={(v) => update(i, { op: v as DatabaseFilterOp, value: "" })}>
              <SelectTrigger className="h-7 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ops.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ValueInput
              prop={prop}
              op={f.op}
              kind={opMeta?.needsValue ?? "single"}
              value={f.value ?? ""}
              onChange={(value) => update(i, { value })}
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => remove(i)}
              className="h-auto w-auto rounded p-1 text-muted-foreground hover:bg-accent"
              aria-label="Remove filter"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={addFilter}
        className="mt-1 h-auto gap-1 px-0 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
      >
        <Plus className="h-3 w-3" /> Add filter
      </Button>
    </div>
  );
}
