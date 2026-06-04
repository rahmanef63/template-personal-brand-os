/** Per-view configuration fields. Extracted from `./types.ts` to keep
 *  the main domain module under the 200-LOC audit cap. Re-exported via
 *  the barrel — consumers should `import type { DatabaseViewConfig }
 *  from "./types"` as before. */

import type { CalcKind } from "./calc-types";
import type { ChartAggregate, ChartKind, DatabaseFilter, DatabaseSort, DbView } from "./types";

export interface DatabaseViewConfig {
  id: string;
  name: string;
  type: DbView;
  groupBy?: string;
  sorts: DatabaseSort[];
  filters: DatabaseFilter[];
  search: string;
  /** Per-view hidden property ids (independent of any global flag). */
  hiddenPropIds?: string[];
  /** Table view footer per-column aggregate. Unset / "none" hides cell. */
  tableCalcs?: Record<string, CalcKind>;
  chartKind?: ChartKind;
  chartXProp?: string;
  chartYProp?: string;
  chartAggregate?: ChartAggregate;
  chartPalette?: "warm" | "cool" | "rainbow" | "mono";
  chartDecimals?: number;
  chartShowGrid?: boolean;
  chartShowLegend?: boolean;
  chartShowValues?: boolean;
  chartSortBy?: "name" | "value";
  chartSortDir?: "asc" | "desc";
  chartTopN?: number;
  chartXLabel?: string;
  chartYLabel?: string;
  chartTitle?: string;
  chartHeight?: "small" | "medium" | "large";
  mapLatProp?: string;
  mapLngProp?: string;
  mapPinColorProp?: string;
  mapShowList?: boolean;
  formRequiredProps?: string[];
  formShownProps?: string[];
  formSuccessMessage?: string;
  formTitle?: string;
  formDescription?: string;
  dashboardKPIs?: string[];
  dashboardBreakdowns?: string[];
  dashboardRecentLimit?: number;
  feedTimestamp?: "createdAt" | "updatedAt";
  timelineStartProp?: string;
  timelineEndProp?: string;
  timelineColorByProp?: string;
  timelineZoom?: "day" | "week" | "month" | "quarter";
}
