/** Default view registry — maps DbView → component. Pure barrel so
 *  callers can `import { VIEW_REGISTRY } from "@/features/notion-shell"`
 *  or grab one view directly. Override / extend at the host by
 *  spreading a custom map. */

import type { ComponentType } from "react";
import type { DbView } from "../../types";
import type { ViewProps } from "./types";
import { TableView } from "./TableView";
import { BoardView } from "./BoardView";
import { ListView } from "./ListView";
import { GalleryView } from "./GalleryView";
import { CalendarView } from "./CalendarView";
import { FeedView } from "./FeedView";
import { ChartView } from "./ChartView";
import { DashboardView } from "./DashboardView";
import { FormView } from "./FormView";
import { MapView } from "./MapView";
import { TimelineView } from "./TimelineView";

export type ViewRegistry = Partial<Record<DbView, ComponentType<ViewProps>>>;

export const VIEW_REGISTRY: ViewRegistry = {
  table: TableView,
  board: BoardView,
  list: ListView,
  gallery: GalleryView,
  calendar: CalendarView,
  feed: FeedView,
  chart: ChartView,
  dashboard: DashboardView,
  form: FormView,
  map: MapView,
  timeline: TimelineView,
};

export {
  TableView, BoardView, ListView, GalleryView, CalendarView, FeedView,
  ChartView, DashboardView, FormView, MapView, TimelineView,
};
export type { ViewProps };
