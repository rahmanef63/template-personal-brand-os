"use client";

/** DashboardView — KPI strip + group breakdowns + recent updates feed.
 *  Pure read view; KPI / breakdown picks come from view config
 *  (dashboardKPIs, dashboardBreakdowns, dashboardRecentLimit). Host
 *  wires onOpenRow to surface row clicks in a detail sheet. */

import { useMemo } from "react";
import { Calendar as CalIcon, Hash, ListChecks, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVisibleProps } from "../../lib/visibility";
import type { ViewProps } from "./types";
import { GroupBreakdown, Stat } from "./dashboard-parts";

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export function DashboardView({ db, view, rows, onOpenRow }: ViewProps) {
  const visible = useMemo(() => getVisibleProps(db, view), [db, view]);
  const allNum = useMemo(() => visible.filter((p) => p.type === "number"), [visible]);
  const allGroup = useMemo(
    () => visible.filter((p) => p.type === "select" || p.type === "status"),
    [visible],
  );
  const allCheckbox = useMemo(() => visible.filter((p) => p.type === "checkbox"), [visible]);

  const kpiIds = view.dashboardKPIs;
  const breakdownIds = view.dashboardBreakdowns;
  const recentLimit = view.dashboardRecentLimit ?? 5;

  const numProps = kpiIds?.length
    ? allNum.filter((p) => kpiIds.includes(p.id))
    : allNum.slice(0, 2);
  const checkboxProps = kpiIds?.length
    ? allCheckbox.filter((p) => kpiIds.includes(p.id))
    : allCheckbox.slice(0, 1);
  const groupProps = breakdownIds?.length
    ? allGroup.filter((p) => breakdownIds.includes(p.id))
    : allGroup.slice(0, 4);

  const total = rows.length;
  const recent = useMemo(() => {
    const sorted = [...rows].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    return sorted.slice(0, recentLimit);
  }, [rows, recentLimit]);

  return (
    <div className="space-y-3 p-3">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Stat label="Total rows" value={total} icon={Hash} accent="primary" />
        {checkboxProps.map((p) => {
          const done = rows.filter((r) => r.rowProps?.[p.id] === true).length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <Stat
              key={p.id}
              label={`${p.name} done`}
              value={`${done}/${total}`}
              sub={`${pct}%`}
              icon={ListChecks}
              accent="emerald"
            />
          );
        })}
        {numProps.map((p) => {
          const vals = rows.map((r) => num(r.rowProps?.[p.id]));
          const sum = vals.reduce((a, b) => a + b, 0);
          const avg = total ? sum / total : 0;
          return (
            <Stat
              key={p.id}
              label={p.name}
              value={fmt(sum)}
              sub={`avg ${fmt(avg)}`}
              icon={TrendingUp}
              accent="blue"
            />
          );
        })}
        {numProps.length === 0 && checkboxProps.length === 0 && (
          <Stat label="Properties" value={db.properties.length} icon={Hash} accent="purple" />
        )}
      </div>

      {groupProps.length > 0 && (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {groupProps.map((p) => (
            <GroupBreakdown key={p.id} prop={p} rows={rows} />
          ))}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <CalIcon className="h-3.5 w-3.5" /> Recent updates
          </div>
          <span className="text-[10px] text-muted-foreground">
            {recent.length} of {total}
          </span>
        </div>
        <div className="divide-y divide-border">
          {recent.length === 0 && (
            <div className="py-4 text-center text-xs text-muted-foreground">No rows yet</div>
          )}
          {recent.map((r) => (
            <Button
              key={r.id}
              variant="ghost"
              type="button"
              onClick={() => onOpenRow?.(r.id)}
              className="flex h-auto w-full items-center justify-between gap-2 rounded px-1 py-1.5 text-left font-normal hover:bg-accent/50"
              aria-label={`Open ${r.title || "Untitled"}`}
            >
              <span className="flex min-w-0 items-center gap-1.5 text-sm">
                <span>{r.icon}</span>
                <span className="truncate">{r.title || "Untitled"}</span>
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {new Date(r.updatedAt ?? Date.now()).toLocaleDateString()}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
