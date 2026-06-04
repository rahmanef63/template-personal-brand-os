"use client";

/** CalendarView — month grid (Sun-Sat) showing the current month.
 *  Buckets rows by the view's `groupBy` date property (falls back to
 *  the first date prop). Empty if none. Navigation is per-month via
 *  ←/→ buttons; "Today" resets. */

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { bucketByDate } from "../../lib/viewData";
import type { ViewProps } from "./types";

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number) { return String(n).padStart(2, "0"); }

function monthCells(year: number, month: number): string[] {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: string[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push("");
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${year}-${pad(month + 1)}-${pad(d)}`);
  while (cells.length % 7 !== 0) cells.push("");
  return cells;
}

export function CalendarView({ db, view, rows }: ViewProps) {
  const dateProp =
    db.properties.find((p) => p.id === view.groupBy && p.type === "date") ??
    db.properties.find((p) => p.type === "date");
  const [cursor, setCursor] = useState(() => new Date());

  const cells = useMemo(() => monthCells(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const buckets = useMemo(() => (dateProp ? bucketByDate(rows, dateProp) : new Map()), [rows, dateProp]);
  const today = new Date().toISOString().slice(0, 10);

  if (!dateProp) {
    return (
      <div className="px-4 py-8 text-center text-xs text-muted-foreground">
        Calendar view needs a <span className="font-medium">date</span> property
        on the database. Add one and pick it as the view's group-by property.
      </div>
    );
  }

  const label = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="p-3">
      <div className="mb-2 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="h-7 w-7 text-muted-foreground"><ChevronLeft className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="h-7 w-7 text-muted-foreground"><ChevronRight className="h-3.5 w-3.5" /></Button>
        <span className="text-sm font-medium">{label}</span>
        <Button variant="ghost" size="sm" onClick={() => setCursor(new Date())} className="ml-auto h-7 px-2 text-xs text-muted-foreground">Today</Button>
      </div>
      <div className="grid grid-cols-7 border-l border-t border-border text-xs">
        {WEEK.map((w) => (
          <div key={w} className="border-b border-r border-border bg-muted/30 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">{w}</div>
        ))}
        {cells.map((day, i) => {
          const rs = day ? buckets.get(day) ?? [] : [];
          const isToday = day === today;
          return (
            <div
              key={i}
              className={cn(
                "min-h-[90px] border-b border-r border-border p-1",
                day ? "bg-card" : "bg-muted/20",
              )}
            >
              {day && (
                <div className={cn("mb-1 text-[10px]", isToday ? "font-semibold text-primary" : "text-muted-foreground")}>
                  {Number(day.slice(8))}
                </div>
              )}
              <div className="space-y-1">
                {rs.slice(0, 3).map((r: { id: string; title: string }) => (
                  <div key={r.id} className="truncate rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                    {r.title || "Untitled"}
                  </div>
                ))}
                {rs.length > 3 && (
                  <div className="text-[10px] text-muted-foreground">+{rs.length - 3}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
