"use client";

/** TimelineView — Gantt-style horizontal timeline. Reads start/end date
 *  properties from view config (timelineStartProp / timelineEndProp);
 *  optional select/status property for bar color (timelineColorByProp).
 *  Drag bars to shift dates → onRowUpdate. Pan range with chevrons. */

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ViewProps } from "./types";
import { TimelineBar } from "./timeline-bar";
import {
  TIMELINE_DAY_MS as DAY_MS, getBarStyle, msToYMD, timelineCellMetrics,
  ymdToMs as toMs,
} from "./timeline-helpers";

const LABEL_W = 160;

export function TimelineView({ db, view, rows, onRowUpdate, onOpenRow, onRowAdd }: ViewProps) {
  const dateProp =
    db.properties.find((p) => p.id === view.timelineStartProp && p.type === "date")
    ?? db.properties.find((p) => p.type === "date");
  const endProp =
    db.properties.find((p) => p.id === view.timelineEndProp && p.type === "date" && p.id !== dateProp?.id)
    ?? db.properties.find((p) => p.type === "date" && p.id !== dateProp?.id);
  const colorProp = db.properties.find(
    (p) => p.id === view.timelineColorByProp && (p.type === "select" || p.type === "status"),
  );

  const { cellW: CELL_W, days: DAYS } = timelineCellMetrics(view.timelineZoom ?? "month");

  const [startOffset, setStartOffset] = useState(0);
  const now = useMemo(() => new Date(), []);

  const weekStart = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay() + startOffset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [now, startOffset]);
  const days = useMemo(
    () => Array.from({ length: DAYS }, (_, i) => new Date(weekStart.getTime() + i * DAY_MS)),
    [weekStart, DAYS],
  );

  const rangeStart = weekStart.getTime();
  const rangeEnd = rangeStart + DAYS * DAY_MS;
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayOffset = todayMs - rangeStart;
  const todayPx = todayOffset >= 0 ? Math.floor(todayOffset / DAY_MS) * CELL_W : -1;

  const items = useMemo(() => {
    if (!dateProp) return [];
    return rows
      .map((r) => {
        const startVal = r.rowProps?.[dateProp.id] as { date?: string; end?: string } | undefined;
        const startStr = startVal?.date;
        // Configured end-prop wins; else fall back to the start date's
        // own `end` so a single range column drives the bar.
        const endStr = endProp
          ? (r.rowProps?.[endProp.id] as { date?: string })?.date
          : startVal?.end ?? null;
        if (!startStr) return null;
        const startMs = toMs(startStr);
        const endMs = endStr ? toMs(endStr) : startMs;
        return { row: r, startMs, endMs };
      })
      .filter((x): x is NonNullable<typeof x> => !!x);
  }, [rows, dateProp, endProp]);

  return (
    <div className="overflow-x-auto p-3">
      <div className="mb-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" type="button" onClick={() => setStartOffset((o) => o - 4)} className="h-auto w-auto rounded p-1 text-muted-foreground hover:bg-accent" aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" type="button" onClick={() => setStartOffset((o) => o + 4)} className="h-auto w-auto rounded p-1 text-muted-foreground hover:bg-accent" aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </Button>
        {startOffset !== 0 && (
          <Button variant="outline" size="sm" type="button" onClick={() => setStartOffset(0)} className="h-auto px-2 py-1 text-xs font-normal text-muted-foreground hover:bg-accent">
            Today
          </Button>
        )}
        <span className="text-xs text-muted-foreground">
          {days[0].toLocaleDateString("default", { month: "short", day: "numeric" })}
          {" – "}
          {days[DAYS - 1].toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        {!dateProp && (
          <span className="ml-2 text-xs text-muted-foreground">(add a Date property to see bars)</span>
        )}
        {onRowAdd && (
          <Button variant="outline" size="sm" type="button" onClick={onRowAdd} className="ml-auto h-auto gap-1 px-2 py-1 text-xs font-normal text-muted-foreground hover:bg-accent">
            <Plus className="h-3 w-3" /> New row
          </Button>
        )}
      </div>

      <div style={{ minWidth: LABEL_W + DAYS * CELL_W }}>
        <div className="flex border-b border-border bg-muted/30">
          <div style={{ width: LABEL_W }} className="shrink-0 border-r border-border px-2 py-1 text-[10px] text-muted-foreground">
            Name
          </div>
          <div className="relative flex" style={{ width: DAYS * CELL_W }}>
            {days.map((d, i) => {
              const isToday = d.getTime() === todayMs;
              const isWeekStart = d.getDay() === 0;
              return (
                <div
                  key={i}
                  style={{ width: CELL_W }}
                  className={cn(
                    "shrink-0 border-r border-border/50 px-0.5 py-1 text-center text-[9px]",
                    isToday ? "bg-primary/10 font-bold text-primary" : "text-muted-foreground",
                    isWeekStart && "border-r-border",
                  )}
                >
                  {d.getDate()}
                  {(i === 0 || d.getDate() === 1) && (
                    <div className="mt-0.5 text-[8px] leading-none opacity-70">
                      {d.toLocaleString("default", { month: "short" })}
                    </div>
                  )}
                </div>
              );
            })}
            {todayPx >= 0 && todayPx < DAYS * CELL_W && (
              <div
                className="pointer-events-none absolute bottom-0 top-0 z-10 w-px bg-primary/60"
                style={{ left: todayPx + CELL_W / 2 }}
              />
            )}
          </div>
        </div>

        {rows.map((row) => {
          const item = items.find((x) => x.row.id === row.id);
          const bar = item ? getBarStyle(item, rangeStart, CELL_W, DAYS) : null;
          const inView = item && item.endMs >= rangeStart && item.startMs < rangeEnd;
          return (
            <div key={row.id} className="group flex border-b border-border/50 hover:bg-muted/20" style={{ minHeight: 32 }}>
              <Button
                variant="ghost"
                type="button"
                style={{ width: LABEL_W }}
                onClick={() => onOpenRow?.(row.id)}
                data-db-nav-item
                className="flex h-auto shrink-0 items-center justify-start gap-1 truncate rounded-none border-r border-border px-2 text-left text-xs font-normal underline-offset-2 hover:bg-transparent hover:underline"
                aria-label={`Open ${row.title || "Untitled"}`}
              >
                <span>{row.icon}</span>
                <span className="truncate">{row.title || "Untitled"}</span>
              </Button>
              <div className="relative flex-1" style={{ width: DAYS * CELL_W }}>
                {days.map((d, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute bottom-0 top-0 border-r border-border/30",
                      d.getTime() === todayMs && "bg-primary/5",
                    )}
                    style={{ left: i * CELL_W, width: CELL_W }}
                  />
                ))}
                {bar && inView && item && (
                  <TimelineBar
                    row={row}
                    item={item}
                    bar={bar}
                    cellW={CELL_W}
                    colorProp={colorProp}
                    onOpenRow={onOpenRow}
                    onShift={(deltaDays, mode) => {
                      if (!dateProp || deltaDays === 0 || !onRowUpdate) return;
                      if (mode === "move" || mode === "start") onRowUpdate(row.id, dateProp.id, { date: msToYMD(item.startMs + deltaDays * DAY_MS) });
                      if ((mode === "move" || mode === "end") && endProp) onRowUpdate(row.id, endProp.id, { date: msToYMD(item.endMs + deltaDays * DAY_MS) });
                    }}
                  />
                )}
                {!item && (
                  <div className="absolute inset-y-0 flex items-center px-2">
                    <span className="text-[10px] text-muted-foreground/40">—</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {rows.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">No rows.</div>
        )}
      </div>
    </div>
  );
}
