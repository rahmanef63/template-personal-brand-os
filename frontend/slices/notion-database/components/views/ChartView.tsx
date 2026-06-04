"use client";

/** ChartView — recharts-driven bar/line/area/pie/donut over aggregated
 *  rows. View config drives chart kind / X axis / aggregate / Y axis +
 *  palette / decimals / topN / labels. Mutations fan out via
 *  onViewConfigChange (host owns persistence). */

import { useMemo } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Label, LabelList,
  Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip,
  XAxis, YAxis,
} from "recharts";
import {
  AreaChart as AreaIcon, BarChart3, Donut, LineChart as LineIcon,
  PieChart as PieIcon,
} from "lucide-react";
import type { ChartAggregate, ChartKind } from "../../types";
import type { ViewProps } from "./types";
import {
  AGG_LABEL, CHART_KIND_LABELS, PALETTES, buildChartData,
} from "./chart-data";
import { ChartEmpty, Picker } from "./chart-picker";

const KIND_ICONS: Record<ChartKind, React.ComponentType<{ className?: string }>> = {
  bar: BarChart3, line: LineIcon, area: AreaIcon, pie: PieIcon, donut: Donut,
};

export function ChartView({ db, view, rows, onViewConfigChange }: ViewProps) {
  const kind: ChartKind = view.chartKind ?? "bar";
  const agg: ChartAggregate = view.chartAggregate ?? "count";

  const xProp = useMemo(
    () => db.properties.find((p) => p.id === view.chartXProp)
      ?? db.properties.find((p) => p.type === "select" || p.type === "status")
      ?? db.properties.find((p) => p.type !== "number")
      ?? db.properties[0],
    [db.properties, view.chartXProp],
  );
  const yProp = useMemo(
    () => db.properties.find((p) => p.id === view.chartYProp && p.type === "number"),
    [db.properties, view.chartYProp],
  );

  const palette = PALETTES[view.chartPalette ?? "warm"] ?? PALETTES.warm;
  const decimals = Math.max(0, Math.min(4, view.chartDecimals ?? 0));
  const showGrid = view.chartShowGrid ?? true;
  const showLegend = view.chartShowLegend ?? true;
  const showValues = view.chartShowValues ?? false;
  const sortBy = view.chartSortBy ?? "value";
  const sortDir = view.chartSortDir ?? "desc";
  const topN = view.chartTopN ?? 0;
  const xLabel = view.chartXLabel?.trim() || xProp?.name || "";
  const yLabel = view.chartYLabel?.trim() || (agg === "count" ? "Count" : yProp?.name ?? "Value");
  const chartTitle = view.chartTitle?.trim();
  const heightPx = view.chartHeight === "small" ? 240 : view.chartHeight === "large" ? 520 : 360;

  const data = useMemo(
    () => buildChartData({ rows, xProp, yProp, agg, decimals, sortBy, sortDir, topN }),
    [rows, xProp, yProp, agg, decimals, sortBy, sortDir, topN],
  );

  const numProps = db.properties.filter((p) => p.type === "number");
  const set = (patch: Partial<typeof view>) => onViewConfigChange?.(patch);

  const renderChart = () => {
    if (!xProp) return <ChartEmpty msg="Pick a category property" />;
    if (!data.length) return <ChartEmpty msg="No data yet" />;
    if (kind === "pie" || kind === "donut") {
      const inner = kind === "donut" ? 56 : 0;
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            {showLegend && <Legend />}
            <Pie data={data} dataKey="value" nameKey="name" outerRadius="75%" innerRadius={inner} label={showValues}>
              {data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    }
    const Wrapper = kind === "line" ? LineChart : kind === "area" ? AreaChart : BarChart;
    const bottomMargin = xLabel ? 28 : 12;
    const leftMargin = yLabel ? 18 : 0;
    return (
      <ResponsiveContainer width="100%" height="100%">
        <Wrapper data={data} margin={{ top: 12, right: 12, left: leftMargin, bottom: bottomMargin }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-border" />}
          <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0}
            angle={data.length > 8 ? -25 : 0}
            textAnchor={data.length > 8 ? "end" : "middle"}
            height={data.length > 8 ? 60 : 30}
          >
            {xLabel && <Label value={xLabel} position="insideBottom" offset={-12} className="fill-muted-foreground" style={{ fontSize: 11 }} />}
          </XAxis>
          <YAxis tick={{ fontSize: 11 }} allowDecimals={decimals > 0}>
            {yLabel && <Label value={yLabel} position="insideLeft" angle={-90} className="fill-muted-foreground" style={{ fontSize: 11, textAnchor: "middle" }} />}
          </YAxis>
          <Tooltip />
          {showLegend && <Legend />}
          {kind === "bar" && (
            <Bar dataKey="value" fill={palette[0]} radius={[4, 4, 0, 0]}>
              {showValues && <LabelList dataKey="value" position="top" style={{ fontSize: 10 }} />}
            </Bar>
          )}
          {kind === "line" && (
            <Line type="monotone" dataKey="value" stroke={palette[0]} strokeWidth={2} dot>
              {showValues && <LabelList dataKey="value" position="top" style={{ fontSize: 10 }} />}
            </Line>
          )}
          {kind === "area" && (
            <Area type="monotone" dataKey="value" stroke={palette[0]} fill={palette[0]} fillOpacity={0.25}>
              {showValues && <LabelList dataKey="value" position="top" style={{ fontSize: 10 }} />}
            </Area>
          )}
        </Wrapper>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-3 p-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Picker
          label="Chart"
          icon={KIND_ICONS[kind]}
          value={CHART_KIND_LABELS[kind]}
          items={(Object.keys(CHART_KIND_LABELS) as ChartKind[]).map((k) => ({
            id: k, label: CHART_KIND_LABELS[k], icon: KIND_ICONS[k],
            onClick: () => set({ chartKind: k }),
          }))}
        />
        <Picker
          label="X axis"
          value={xProp?.name ?? "—"}
          items={db.properties.length ? db.properties.map((p) => ({
            id: p.id, label: p.name, onClick: () => set({ chartXProp: p.id }),
          })) : [{ id: "_", label: "Add a select/status property", onClick: () => {} }]}
        />
        <Picker
          label="Aggregate"
          value={AGG_LABEL[agg]}
          items={(Object.keys(AGG_LABEL) as ChartAggregate[]).map((a) => ({
            id: a, label: AGG_LABEL[a], onClick: () => set({ chartAggregate: a }),
          }))}
        />
        {agg !== "count" && (
          <Picker
            label="Y value"
            value={yProp?.name ?? "—"}
            items={numProps.length ? numProps.map((p) => ({
              id: p.id, label: p.name, onClick: () => set({ chartYProp: p.id }),
            })) : [{ id: "_", label: "Add a number property", onClick: () => {} }]}
          />
        )}
      </div>
      {chartTitle && <h3 className="text-sm font-semibold text-foreground">{chartTitle}</h3>}
      <div className="rounded-lg border border-border bg-card p-2" style={{ height: heightPx }}>
        {renderChart()}
      </div>
    </div>
  );
}
