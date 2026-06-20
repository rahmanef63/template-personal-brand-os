"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { AnalyticsBindings } from "./bindings";
import { FUNNEL, KPI_CARDS, SERIES_30D, SOURCES, TOP_PAGES } from "./seed";

/** Convex-backed AnalyticsBindings — read-only. KPIs / series / sources /
 *  topPages / funnel are computed from REAL pb tables by
 *  api.adminPanel_analytics.get. While the query is loading (=== undefined)
 *  we return the seed so the charts are never blank, mirroring the demo. */
export function useConvexAnalyticsBindings(): AnalyticsBindings {
  const data = useQuery(api.adminPanel_analytics.get);
  const isLoading = data === undefined;
  return {
    kpis: data?.kpis ?? KPI_CARDS,
    series: data?.series ?? SERIES_30D,
    sources: data?.sources ?? SOURCES,
    topPages: data?.topPages ?? TOP_PAGES,
    funnel: data?.funnel ?? FUNNEL,
    isLoading,
  };
}
