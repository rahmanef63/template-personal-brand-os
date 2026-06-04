/** notion-shell domain types — portable subset of nosion's domain. */

import type { ReactNode } from "react";
import type { Block } from "./block-types";

export type { Block, BlockType, BlockRenderers, BlockRendererProps } from "./block-types";

/** Structural cover value — a raw URL/CSS string OR a rich cover object
 *  (colour / gradient / texture / upload / link / unsplash + focal point).
 *  Defined structurally so notion-shell stays decoupled from the `image-picker`
 *  slice; the image-picker slice's ImageValue is assignable to this. */
export interface CoverValue {
  type: string;
  value: string;
  positionY?: number;
  metadata?: Record<string, unknown>;
}

export interface Page {
  id: string;
  parentId: string | null;
  title: string;
  icon: string;
  /** Optional cover — a URL/CSS string or a rich CoverValue. Rendered by the
   *  host (e.g. the `image-picker` slice's ImageBanner via NotionPage's coverSlot). */
  cover?: string | CoverValue;
  blocks: Block[];
  favorite: boolean;
  trashed: boolean;
  createdAt: number;
  updatedAt: number;
  /** Author + last-editor user ids — `created_by` / `last_edited_by` cells. */
  createdBy?: string;
  lastEditedBy?: string;
  /** When set, this page is a row in a database — `rowProps` carries the cell values. */
  rowOfDatabaseId?: string;
  rowProps?: Record<string, PropertyValue>;
  smallText?: boolean;
  fullWidth?: boolean;
}

export type PropertyType =
  | "text" | "number" | "select" | "multi_select" | "status"
  | "date" | "checkbox" | "url" | "email" | "phone"
  | "person" | "files" | "formula"
  | "created_time" | "last_edited_time" | "unique_id"
  | "created_by" | "last_edited_by"
  | "relation" | "rollup";

/** Rollup aggregation kinds. Determines how a rollup folds the values
 *  pulled from its relation's target property. */
export type RollupAggregate =
  | "count" | "count_unique" | "values"
  | "sum" | "avg" | "min" | "max"
  | "earliest" | "latest"
  | "checked" | "percent_checked";

// PROPERTY_TYPE_META + derived lists live in ./property-type-meta.ts.

export interface SelectOption {
  id: string;
  name: string;
  color: string;
}

export type NumberFormat = "number" | "decimal" | "percent" | "currency";

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  hidden?: boolean;
  description?: string;
  options?: SelectOption[];
  numberFormat?: NumberFormat;
  numberDecimals?: number;
  /** Formula expression — `{{prop}}` interpolation + fn(). type=formula. */
  formulaExpression?: string;
  /** Prefix for unique_id — e.g. "BUG" → "BUG-001". type=unique_id. */
  uniqueIdPrefix?: string;
  /** Target database for a relation cell. `null` / unset = "any database
   *  row". type=relation. */
  relationDatabaseId?: string | null;
  /** Relation property id this rollup pulls linked rows from. type=rollup. */
  rollupRelationPropertyId?: string | null;
  /** Property id on the relation's target database whose values get
   *  aggregated. Unset = aggregate page titles. type=rollup. */
  rollupTargetPropertyId?: string | null;
  /** Aggregation fold. Defaults to "count". type=rollup. */
  rollupAggregate?: RollupAggregate;
  /** ISO 4217 code (e.g. "USD", "IDR") — read when numberFormat="currency".
   *  Defaults to "USD" when unset. type=number. */
  numberCurrencyCode?: string;
  /** Date display pattern. Defaults to "full" when unset. type=date. */
  dateFormat?: "full" | "short" | "mdy" | "dmy" | "ymd" | "relative";
  /** Time display pattern. Defaults to "12h" when unset. type=date. */
  timeFormat?: "12h" | "24h";
  /** When true the date cell renders the optional `time` / `endTime`
   *  components alongside the date(s). type=date. */
  dateIncludeTime?: boolean;
  /** When true the date column defaults to a start→end range (the cell
   *  opens in range mode; Calendar spans the days; Timeline reads the
   *  value's own `end` when no separate end-prop is configured). The
   *  per-cell "Include end date" toggle still overrides per row.
   *  type=date. */
  dateRange?: boolean;
  /** Reminder lead time for the date (cosmetic — stored on the property,
   *  surfaced in the date cell's "Remind" submenu; no runtime scheduler).
   *  type=date. Unset / "none" = no reminder. */
  dateNotification?: "none" | "at_time" | "5m" | "10m" | "30m" | "1h" | "1d" | "2d";
}

export type PropertyValue =
  | string | number | boolean | null
  | string[]
  | { date?: string; end?: string; time?: string; endTime?: string };

export type DbView =
  | "table" | "board" | "list" | "gallery" | "calendar" | "feed"
  | "chart" | "dashboard" | "form" | "map" | "timeline";

export type ChartKind = "bar" | "line" | "area" | "pie" | "donut";
export type ChartAggregate = "count" | "sum" | "avg" | "min" | "max";

import type { CalcKind } from "./calc-types";
export type { CalcKind };

/** Filter operators, grouped by intended property type. The viewData
 *  matcher tolerates op/type mismatches (returns true) so legacy
 *  configs keep working when a property type changes. */
export type DatabaseFilterOp =
  // text / shared
  | "contains" | "does_not_contain" | "starts_with" | "ends_with"
  | "equals" | "not_equals"
  | "is_empty" | "not_empty"
  // checkbox
  | "checked" | "unchecked"
  // number
  | "gt" | "lt" | "gte" | "lte" | "between"
  // date
  | "before" | "after" | "on" | "is_today" | "past_week" | "next_week"
  // select / multi-select
  | "is_any_of" | "is_none_of";

export interface DatabaseFilter {
  propertyId: string;
  op: DatabaseFilterOp;
  /** Operand encoding:
   *   - text/number/date single ops: plain string
   *   - "between": "min|max" (numbers) or "ISO|ISO" (dates)
   *   - "is_any_of" / "is_none_of": "id1,id2,id3" (select option ids)
   *   - is_empty / not_empty / checked / unchecked / is_today / past_week / next_week: ignored
   */
  value?: string;
}

export interface DatabaseSort {
  propertyId: string;
  direction: "asc" | "desc";
}

export type { DatabaseViewConfig } from "./view-config-types";
import type { DatabaseViewConfig as _DBV } from "./view-config-types";

export interface Database {
  id: string;
  name: string;
  icon: string;
  properties: Property[];
  rowIds: string[];
  views: _DBV[];
  activeViewId: string;
  createdAt: number;
  updatedAt: number;
  /** Atomic counter for unique_id properties — increments on each new row.
   *  Read-only at the cell layer; host owns the bump. */
  uniqueIdCounter?: number;
  /** When true the DatabaseMenu's Lock action is engaged — UI surfaces
   *  read-only affordances; host enforces. */
  locked?: boolean;
}

export type ActionsSlot = ReactNode;
