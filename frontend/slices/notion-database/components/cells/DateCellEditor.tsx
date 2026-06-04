"use client";

/** DateCellEditor — DateCell popover body. Uses the custom DateCalendar grid
 *  (plain buttons, no react-day-picker — rdp's selection path didn't register
 *  clicks here). Single mode picks one date. Range mode (End date on) uses a
 *  click sequence: 1st click = start, 2nd click = end (the earlier of the two
 *  is always kept as start — clicking before the start swaps them); clicking
 *  again once a full range exists starts a fresh range. Value shape:
 *  `{ date, end?, time?, endTime? }`. */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Property } from "../../types";
import { formatYmd } from "../../lib/dateFormat";
import { DateCellSettings } from "./DateCellSettings";
import { DateBox } from "./DateBox";
import { DateCalendar } from "./DateCalendar";

export interface DateEditorValue { date?: string; end?: string; time?: string; endTime?: string }

function pad2(n: number) { return n < 10 ? `0${n}` : `${n}`; }

function toISO(d: Date | undefined): string | undefined {
  if (!d) return undefined;
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function fromISO(s?: string): Date | undefined {
  if (!s) return undefined;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(+m[1]!, +m[2]! - 1, +m[3]!) : undefined;
}

interface Props {
  value: DateEditorValue | null;
  includeTime: boolean;
  rangeMode: boolean;
  onChange: (next: DateEditorValue | null) => void;
  /** Fired after a terminal pick so the host can close the popover. */
  onAfterPick?: () => void;
  prop?: Property;
  onPropPatch?: (patch: Partial<Property>) => void;
}

export function DateCellEditor({
  value, includeTime, rangeMode, onChange, onAfterPick, prop, onPropPatch,
}: Props) {
  const v = value ?? {};
  const fmt = prop?.dateFormat ?? "full";
  const start = fromISO(v.date);
  const end = fromISO(v.end);

  const patch = (p: Partial<DateEditorValue>) => {
    const next = { ...v, ...p };
    if (!next.date) { onChange(null); return; }
    onChange(next);
  };

  const setStart = (d: Date | undefined) => {
    const iso = toISO(d);
    if (!iso) { onChange(null); return; }
    patch({ date: iso });
    if (!includeTime) onAfterPick?.();
  };

  // Range click sequence:
  //  - no start yet, or a complete range exists  → this click starts a fresh
  //    range (sets start, clears end)
  //  - start set, no end yet                      → this click sets the end,
  //    swapping so the earlier date stays as start
  const onPickRange = (d: Date) => {
    const iso = toISO(d)!;
    if (!v.date || v.end) {
      onChange({ ...v, date: iso, end: undefined, endTime: undefined });
      return;
    }
    if (iso < v.date) onChange({ ...v, date: iso, end: v.date });
    else onChange({ ...v, date: v.date, end: iso });
  };

  const onPick = (d: Date) => (rangeMode ? onPickRange(d) : setStart(d));

  // End date is a PROPERTY-level setting (`prop.dateRange`) — the same switch
  // the column header's edit-property panel toggles — so the two stay in sync.
  const toggleRange = (on: boolean) => {
    onPropPatch?.({ dateRange: on || undefined });
    if (!on && (v.end || v.endTime)) patch({ end: undefined, endTime: undefined });
  };

  return (
    <div className="w-auto p-2">
      {/* Date field(s) */}
      {rangeMode ? (
        <div className="mb-2 grid grid-cols-2 gap-2">
          <DateBox label={v.date ? formatYmd(v.date, fmt) : ""} placeholder="Start date" />
          <DateBox label={v.end ? formatYmd(v.end, fmt) : ""} placeholder="End date" />
        </div>
      ) : (
        <div className="mb-2 flex items-center gap-2">
          <DateBox label={v.date ? formatYmd(v.date, fmt) : ""} placeholder="Empty" />
          <Button
            variant="ghost" type="button"
            onClick={() => setStart(new Date())}
            className="h-8 px-2 text-xs font-normal text-muted-foreground"
          >
            Today
          </Button>
        </div>
      )}

      {/* Time input(s) */}
      {includeTime && (
        rangeMode ? (
          <div className="mb-2 grid grid-cols-2 gap-2">
            <Input
              type="time" value={v.time ?? ""} disabled={!v.date}
              onChange={(e) => patch({ time: e.target.value || undefined })}
              aria-label="Start time" className="h-8 text-xs"
            />
            <Input
              type="time" value={v.endTime ?? ""} disabled={!v.end}
              onChange={(e) => patch({ endTime: e.target.value || undefined })}
              aria-label="End time" className="h-8 text-xs"
            />
          </div>
        ) : (
          <Input
            type="time" value={v.time ?? ""} disabled={!v.date}
            onChange={(e) => patch({ time: e.target.value || undefined })}
            aria-label="Start time" className="mb-2 h-8 w-full text-xs"
          />
        )
      )}

      <DateCalendar
        selected={rangeMode ? undefined : start}
        rangeStart={rangeMode ? start : undefined}
        rangeEnd={rangeMode ? end : undefined}
        defaultMonth={start}
        onPick={onPick}
      />

      <DateCellSettings
        prop={prop}
        rangeMode={rangeMode}
        includeTime={includeTime}
        hasValue={!!v.date}
        onRangeToggle={toggleRange}
        onPropPatch={onPropPatch}
        onClear={() => onChange(null)}
      />
    </div>
  );
}
