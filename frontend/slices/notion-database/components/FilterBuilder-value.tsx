"use client";

/** Value inputs for FilterBuilder. Switches per `kind`. Extracted from
 *  FilterBuilder.tsx (CK-2C, 2026-05-24) to keep parent under the
 *  200-LOC audit cap. */

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DatabaseFilterOp, Property } from "../types";
import { inputTypeForProp } from "./FilterBuilder-ops";

export function ValueInput({
  prop, op, kind, value, onChange,
}: {
  prop: Property | undefined;
  op: DatabaseFilterOp;
  kind: "none" | "single" | "between" | "select";
  value: string;
  onChange: (next: string) => void;
}) {
  if (kind === "none") return null;
  if (kind === "between") {
    const [a = "", b = ""] = value.split("|");
    const inputType = inputTypeForProp(prop?.type);
    return (
      <div className="flex items-center gap-1">
        <Input
          type={inputType}
          value={a}
          onChange={(e) => onChange(`${e.target.value}|${b}`)}
          className="h-7 w-20 text-xs"
          placeholder="min"
        />
        <span className="text-[10px] text-muted-foreground">to</span>
        <Input
          type={inputType}
          value={b}
          onChange={(e) => onChange(`${a}|${e.target.value}`)}
          className="h-7 w-20 text-xs"
          placeholder="max"
        />
      </div>
    );
  }
  if (kind === "select" && (prop?.type === "select" || prop?.type === "multi_select" || prop?.type === "status")) {
    return <SelectOptionPicker prop={prop} value={value} onChange={onChange} multi={op !== "equals"} />;
  }
  return (
    <Input
      type={inputTypeForProp(prop?.type)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 w-32 text-xs"
      placeholder="value"
    />
  );
}

function SelectOptionPicker({
  prop, value, onChange, multi,
}: {
  prop: Property;
  value: string;
  onChange: (next: string) => void;
  multi: boolean;
}) {
  const selected = value ? value.split(",").filter(Boolean) : [];
  const options = prop.options ?? [];
  const toggle = (id: string) => {
    if (!multi) {
      onChange(selected[0] === id ? "" : id);
      return;
    }
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onChange(next.join(","));
  };
  const label = selected.length === 0
    ? "Pick options"
    : selected
        .map((id) => options.find((o) => o.id === id)?.name ?? id)
        .join(", ");
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 w-40 justify-start truncate px-2 text-xs font-normal">
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        {options.length === 0 && (
          <div className="px-2 py-2 text-[11px] text-muted-foreground">No options defined.</div>
        )}
        {options.map((opt) => {
          const id = `filter-opt-${prop.id}-${opt.id}`;
          return (
            <label
              key={opt.id}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs hover:bg-accent"
            >
              <Checkbox
                id={id}
                checked={selected.includes(opt.id)}
                onCheckedChange={() => toggle(opt.id)}
              />
              <span className="truncate">{opt.name}</span>
            </label>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
