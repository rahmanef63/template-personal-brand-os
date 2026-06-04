/** CalcKind — TableView per-column footer aggregate. Kept in a sibling
 *  module to keep `types.ts` under the 200-LOC pre-commit gate. */

export type CalcKind =
  | "none"
  | "count_all" | "count_values" | "count_unique_values"
  | "count_empty" | "count_not_empty"
  | "percent_empty" | "percent_not_empty"
  | "sum" | "average" | "median" | "min" | "max" | "range"
  | "checked" | "unchecked" | "percent_checked" | "percent_unchecked"
  | "earliest_date" | "latest_date" | "date_range";
