"use client";

/** DateCell — Notion-canonical date picker.
 *  - Click trigger → opens a Popover with the DateCellEditor.
 *  - Single mode = one calendar.
 *  - Range mode = "Include end date" toggle reveals a second calendar;
 *    a range needs two explicit picks (start + end), like notion-page-clone.
 *  - `dateIncludeTime` adds HH:mm time inputs for start (+ end in range).
 *  - Value shape: { date, end?, time?, endTime? }.
 *  - readOnly = just renders the formatted span. */

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { Property } from "../../types";
import { formatDateValue } from "../../lib/dateFormat";
import { DateCellEditor, type DateEditorValue } from "./DateCellEditor";

/** Display preference precedence: when the host passes `prop` with any
 *  date setting, route through the typed formatter; otherwise fall back
 *  to a sensible full-date default (and surface time when the value
 *  itself carries one). */
function display(v: DateEditorValue | null, prop?: Property): string {
  if (!v?.date) return "";
  const hasPropFmt = !!(prop && (prop.dateFormat || prop.timeFormat || prop.dateIncludeTime));
  if (hasPropFmt) return formatDateValue(v, prop);
  return formatDateValue(v, {
    dateFormat: "full", timeFormat: "12h", dateIncludeTime: !!(v.time || v.endTime),
  });
}

interface DateCellProps {
  value: DateEditorValue | null;
  readOnly?: boolean;
  onChange?: (next: DateEditorValue | null) => void;
  /** When provided, dateFormat / timeFormat / dateIncludeTime / dateRange
   *  on the property drive display + which inputs the editor shows. */
  prop?: Property;
  /** Patch property-level date settings from the cell popover's options
   *  list (Date format / Include time / Remind). */
  onPropPatch?: (patch: Partial<Property>) => void;
}

export function DateCell({ value, readOnly, onChange, prop, onPropPatch }: DateCellProps) {
  const [open, setOpen] = useState(false);
  const v = value && typeof value === "object" ? value : null;
  // Range is "active" when the column defaults to a range (`prop.dateRange`,
  // toggled from EITHER the cell popover's End-date switch or the column
  // header's edit-property panel — both patch the same property) OR this cell
  // already has an end. Derived live so the two toggles stay in sync.
  const rangeMode = !!v?.end || !!prop?.dateRange;
  const includeTime = !!prop?.dateIncludeTime;

  const label = display(v, prop);

  if (readOnly) {
    if (label && rangeMode && !v?.end) {
      return (
        <span className="text-sm text-foreground">
          {label} <span className="text-muted-foreground/50">→ —</span>
        </span>
      );
    }
    return label
      ? <span className="text-sm text-foreground">{label}</span>
      : <span className="text-muted-foreground/60">—</span>;
  }

  // In range mode the end slot stays visible (even empty) so the column
  // visibly reflects the End-date toggle.
  const triggerContent = rangeMode && !v?.end ? (
    <span className="flex items-center gap-1 truncate">
      <span className={cn("truncate", !label && "text-muted-foreground/60")}>
        {label || "Start date"}
      </span>
      <span className="text-muted-foreground/50">→</span>
      <span className="text-muted-foreground/60">End date</span>
    </span>
  ) : label ? (
    <span className="truncate">{label}</span>
  ) : (
    <span className="text-muted-foreground/60">Pick a date</span>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" type="button" aria-label="Pick a date" className={cn(
          "flex h-7 w-full items-center justify-start gap-1.5 rounded-md border-border bg-background px-2 text-left text-sm font-normal hover:bg-accent",
        )}>
          <CalendarIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
          {triggerContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DateCellEditor
          value={v}
          includeTime={includeTime}
          rangeMode={rangeMode}
          onChange={onChange ?? (() => {})}
          onAfterPick={() => setOpen(false)}
          prop={prop}
          onPropPatch={onPropPatch}
        />
      </PopoverContent>
    </Popover>
  );
}
