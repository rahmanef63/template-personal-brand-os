"use client";

import * as React from "react";
import { FUNNEL, KPI_CARDS, SERIES_30D, SOURCES, TOP_PAGES } from "./seed";
import type { DayPoint, FunnelStep, KpiCardData, PageStat, TrafficSource } from "./types";

/** Adapter pattern (CC-wave). Read-only block — bindings expose
 *  pre-aggregated analytics shapes. Convex impl would run aggregations
 *  in a query (or a scheduled function), demo just hands back seed. */
export type AnalyticsBindings = {
  kpis: KpiCardData[];
  series: DayPoint[];
  sources: TrafficSource[];
  topPages: PageStat[];
  funnel: FunnelStep[];
  isLoading: boolean;
};

export function useDefaultAnalyticsBindings(): AnalyticsBindings {
  return {
    kpis: KPI_CARDS,
    series: SERIES_30D,
    sources: SOURCES,
    topPages: TOP_PAGES,
    funnel: FUNNEL,
    isLoading: false,
  };
}

const Ctx = React.createContext<AnalyticsBindings | null>(null);

export function AnalyticsBindingsProvider({
  value,
  children,
}: {
  value: AnalyticsBindings;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAnalyticsBindings(): AnalyticsBindings {
  const ctx = React.useContext(Ctx);
  const fallback = useDefaultAnalyticsBindings();
  return ctx ?? fallback;
}
