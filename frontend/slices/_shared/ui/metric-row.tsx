import * as React from "react";

/**
 * Compact label/value pair for sidebar/sidekick stats.
 * Smaller than `<StatCard>` (which is the dashboard variant).
 *
 * Use as `<MetricRow rows={[{ k: "Active", v: "14" }, ...]} />` or
 * loop yourself with the inner `<MetricLine>`.
 */
export function MetricRow({ rows }: { rows: Array<{ k: string; v: React.ReactNode }> }) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r) => (
        <MetricLine key={r.k} k={r.k} v={r.v} />
      ))}
    </div>
  );
}

export function MetricLine({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className="text-xl font-semibold tracking-tight">{v}</span>
    </div>
  );
}
