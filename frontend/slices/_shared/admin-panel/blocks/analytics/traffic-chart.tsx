"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { SERIES_30D } from "./seed";

const CONFIG = {
  views: { label: "Views", color: "var(--chart-1)" },
  sessions: { label: "Sessions", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function TrafficChart() {
  const data = React.useMemo(
    () =>
      SERIES_30D.map((p) => ({
        date: p.date.slice(5), // mm-dd
        views: p.views,
        sessions: p.sessions,
      })),
    [],
  );

  return (
    <ChartContainer config={CONFIG} className="h-[260px] w-full">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-sessions)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--color-sessions)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeOpacity={0.2} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          width={32}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Area
          dataKey="views"
          type="monotone"
          fill="url(#fillViews)"
          stroke="var(--color-views)"
          strokeWidth={2}
        />
        <Area
          dataKey="sessions"
          type="monotone"
          fill="url(#fillSessions)"
          stroke="var(--color-sessions)"
          strokeWidth={2}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
