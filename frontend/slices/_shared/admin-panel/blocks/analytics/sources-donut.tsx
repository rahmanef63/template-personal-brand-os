"use client";

import * as React from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAnalyticsBindings } from "./bindings";

export function SourcesDonut() {
  const { sources } = useAnalyticsBindings();
  const config: ChartConfig = sources.reduce((acc, s) => {
    acc[s.id] = { label: s.label, color: s.color };
    return acc;
  }, {} as ChartConfig);
  const total = sources.reduce((s, x) => s + x.visits, 0);
  return (
    <div className="grid gap-4 md:grid-cols-[180px_1fr]">
      <ChartContainer config={config} className="aspect-square h-[180px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="label" hideLabel />} />
          <Pie data={sources} dataKey="visits" nameKey="label" innerRadius={48} strokeWidth={2}>
            {sources.map((s) => (
              <Cell key={s.id} fill={s.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="space-y-1.5 self-center text-xs">
        {sources.map((s) => {
          const pct = ((s.visits / (total || 1)) * 100).toFixed(1);
          return (
            <li key={s.id} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: s.color }}
              />
              <span className="flex-1">{s.label}</span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {s.visits.toLocaleString()}
              </span>
              <span className="w-12 text-right font-mono tabular-nums text-muted-foreground">
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
