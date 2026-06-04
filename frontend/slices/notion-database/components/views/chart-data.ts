/** Pure data helpers for ChartView — palettes, kind/agg metadata,
 *  labelFor + aggregate + bucket builder. Split out to keep the render
 *  layer ≤200 LOC. */

import type { ChartAggregate, ChartKind, Property } from "../../types";

export const PALETTES: Record<string, string[]> = {
  warm: ["#f97316", "#ef4444", "#eab308", "#f43f5e", "#ec4899", "#dc2626", "#fb923c", "#facc15"],
  cool: ["#3b82f6", "#06b6d4", "#10b981", "#6366f1", "#0ea5e9", "#14b8a6", "#22d3ee", "#3aa6ff"],
  rainbow: ["#f97316", "#3b82f6", "#10b981", "#a855f7", "#ec4899", "#eab308", "#06b6d4", "#ef4444", "#84cc16", "#6366f1"],
  mono: ["#0f172a", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0", "#f1f5f9"],
};

export const AGG_LABEL: Record<ChartAggregate, string> = {
  count: "Count", sum: "Sum", avg: "Average", min: "Min", max: "Max",
};

export const CHART_KIND_LABELS: Record<ChartKind, string> = {
  bar: "Bar", line: "Line", area: "Area", pie: "Pie", donut: "Donut",
};

export function labelFor(prop: Property | undefined, raw: unknown): string {
  if (raw === undefined || raw === null || raw === "") return "—";
  if (!prop) return String(raw);
  if (prop.type === "select" || prop.type === "status") {
    const opt = prop.options?.find((o) => o.id === raw);
    return opt?.name ?? "—";
  }
  if (prop.type === "multi_select") {
    const ids = Array.isArray(raw) ? raw : [];
    if (ids.length === 0) return "—";
    return ids.map((id) => prop.options?.find((o) => o.id === id)?.name ?? "—").join(", ");
  }
  if (prop.type === "checkbox") return raw ? "Checked" : "Unchecked";
  if (prop.type === "date") return (raw as { date?: string })?.date ?? "—";
  if (prop.type === "number") return Number.isFinite(raw) ? String(raw) : "—";
  if (Array.isArray(raw)) return raw.length ? raw.join(", ") : "—";
  return String(raw);
}

export function aggregate(values: number[], agg: ChartAggregate): number {
  if (!values.length) return 0;
  switch (agg) {
    case "count": return values.length;
    case "sum": return values.reduce((a, b) => a + b, 0);
    case "avg": return values.reduce((a, b) => a + b, 0) / values.length;
    case "min": return Math.min(...values);
    case "max": return Math.max(...values);
  }
}

export interface ChartDatum { key: string; name: string; value: number }

export function buildChartData(args: {
  rows: { rowProps?: Record<string, unknown> }[];
  xProp: Property | undefined;
  yProp: Property | undefined;
  agg: ChartAggregate;
  decimals: number;
  sortBy: "name" | "value";
  sortDir: "asc" | "desc";
  topN: number;
}): ChartDatum[] {
  const { rows, xProp, yProp, agg, decimals, sortBy, sortDir, topN } = args;
  if (!xProp) return [];
  const buckets = new Map<string, { values: number[]; label: string }>();
  const keyFor = (raw: unknown): string => {
    if (raw === undefined || raw === null || raw === "") return "__empty__";
    if (xProp.type === "date") return (raw as { date?: string })?.date ?? "__empty__";
    if (Array.isArray(raw)) return raw.length ? [...raw].sort().join("|") : "__empty__";
    if (typeof raw === "object") return JSON.stringify(raw);
    return String(raw);
  };
  for (const r of rows) {
    const raw = r.rowProps?.[xProp.id];
    const key = keyFor(raw);
    const num = yProp ? Number(r.rowProps?.[yProp.id] ?? 0) || 0 : 1;
    const b = buckets.get(key) ?? { values: [], label: labelFor(xProp, raw) };
    b.values.push(num);
    buckets.set(key, b);
  }
  let arr: ChartDatum[] = [...buckets.entries()].map(([key, { values, label }]) => ({
    key, name: label, value: Number(aggregate(values, agg).toFixed(decimals)),
  }));
  arr.sort((a, b) => {
    if (sortBy === "name") {
      const c = a.name.localeCompare(b.name);
      return sortDir === "asc" ? c : -c;
    }
    const c = a.value - b.value;
    return sortDir === "asc" ? c : -c;
  });
  if (topN > 0 && arr.length > topN) {
    const top = arr.slice(0, topN);
    const rest = arr.slice(topN);
    const restValue = aggregate(rest.map((r) => r.value), "sum");
    top.push({ key: "__other__", name: `Other (${rest.length})`, value: Number(restValue.toFixed(decimals)) });
    arr = top;
  }
  return arr;
}
