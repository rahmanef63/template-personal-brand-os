"use client";

import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RANGE_LABELS, type RangeLabel } from "./seed";
import { useAnalyticsBindings } from "./bindings";
import { TrafficChart } from "./traffic-chart";
import { SourcesDonut } from "./sources-donut";
import { FunnelList, TopPagesTable } from "./funnel-and-pages";
import { BlockHeader } from "../../ui/block-header";
import type { KpiCardData } from "./types";

/** Real admin-panel "Analytics" block — fourth BS-pattern impl
 *  (after users / audit-log / ai-config). Pure client demo: 4 KPI
 *  cards (with delta vs prev period), 30-day stacked area chart
 *  (views + sessions, recharts via shadcn chart wrapper), traffic
 *  source donut + legend, top-pages table, and 5-step funnel with
 *  drop-off %. No persistence. Range chips are presentational
 *  (single 30d series seeded). Real impl backed by the event-tracking
 *  slice (today config-only — schema + ingest endpoint deferred to a
 *  separate wave). */
export function AnalyticsBlockView() {
  const { kpis } = useAnalyticsBindings();
  const [range, setRange] = React.useState<RangeLabel>("30d");
  return (
    <div className="space-y-6 p-6">
      <BlockHeader
        title="Analytics"
        meta="Page views, sessions, traffic sources, top pages, funnel"
        actions={
          <>
            <div
              role="radiogroup"
              aria-label="Time range"
              className="flex items-center gap-1 rounded-md border bg-card p-0.5"
            >
              {RANGE_LABELS.map((r) => (
                <Button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={range === r}
                  size="sm"
                  variant={range === r ? "secondary" : "ghost"}
                  onClick={() => setRange(r)}
                  className="h-6 px-2 text-[10px]"
                >
                  {r}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <RefreshCcw className="size-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="size-3.5" />
              Export
            </Button>
          </>
        }
      />

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.id} kpi={k} />
        ))}
      </section>

      <section className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Traffic — last 30 days</h2>
          <span className="text-[10px] uppercase text-muted-foreground">{range}</span>
        </div>
        <div className="mt-3">
          <TrafficChart />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Traffic sources</h2>
          <div className="mt-3">
            <SourcesDonut />
          </div>
        </section>
        <section className="rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Conversion funnel</h2>
          <div className="mt-3">
            <FunnelList />
          </div>
        </section>
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Top pages</h2>
          <span className="text-[10px] text-muted-foreground">by views</span>
        </div>
        <TopPagesTable />
      </section>

      <p className="text-[10px] text-muted-foreground">
        Demo data — deterministic seed, resets on browser reload. Real impl backed by{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-[10px]">event-tracking</code> slice +
        Convex events table.
      </p>
    </div>
  );
}

function KpiCard({ kpi }: { kpi: KpiCardData }) {
  const up = kpi.deltaPct >= 0;
  const good = kpi.id === "bounce" ? !up : up;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
      <p className="mt-1 font-mono text-xl tabular-nums">{kpi.value}</p>
      <div className="mt-1 flex items-center gap-1.5 text-[10px]">
        <span className={good ? "text-emerald-400" : "text-rose-400"}>
          <Icon className="inline size-3" />
          {kpi.deltaPct > 0 ? "+" : ""}
          {kpi.deltaPct.toFixed(1)}%
        </span>
        <span className="text-muted-foreground">{kpi.hint}</span>
      </div>
    </div>
  );
}
