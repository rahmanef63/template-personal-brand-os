/** computeRollup — pure aggregator for rollup cells.
 *
 *  Walks a list of linked pages (resolved from a relation property)
 *  and folds the target property's values into a single display
 *  string per the chosen aggregate kind.
 *
 *  Stripped vs upstream: nested formula evaluation is omitted — when
 *  the target is a formula or computed property, displays "—" instead
 *  of recursing through formulaEngine. Numeric / date / values /
 *  checked aggregates all behave as upstream. Lifted from
 *  notion-page-clone CK-1D Phase 2.
 *
 *  All returned strings are pre-formatted for direct cell rendering. */

import type { Page, Property, PropertyValue, RollupAggregate, SelectOption } from "../types";

function asOption(opts: SelectOption[] | undefined, id: unknown): string {
  if (typeof id !== "string") return "";
  return opts?.find((o) => o.id === id)?.name ?? id;
}

function formatLite(value: PropertyValue | undefined, prop: Property | undefined): string {
  if (value === undefined || value === null || value === "") return "";
  if (!prop) return String(value);
  if (prop.type === "checkbox") return value === true ? "Checked" : "Unchecked";
  if (prop.type === "date") {
    return typeof value === "object" && value && "date" in value ? value.date ?? "" : "";
  }
  if (prop.type === "select" || prop.type === "status") return asOption(prop.options, value);
  if (prop.type === "multi_select") {
    const ids = Array.isArray(value) ? value : [];
    return ids.map((id) => asOption(prop.options, id)).filter(Boolean).join(", ");
  }
  if (prop.type === "formula" || prop.type === "rollup") return "—";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export function computeRollup(
  aggregate: RollupAggregate,
  linkedPages: Page[],
  targetProp: Property | undefined,
): string {
  const total = linkedPages.length;
  if (aggregate === "count") return String(total);

  const titlesOrValues = linkedPages
    .map((page) => targetProp ? formatLite(page.rowProps?.[targetProp.id], targetProp) : (page.title || "Untitled"))
    .filter(Boolean);

  if (aggregate === "values") return titlesOrValues.length ? titlesOrValues.join(", ") : "—";

  if (aggregate === "count_unique") {
    const set = new Set(titlesOrValues.map((v) => v.toLowerCase()));
    return String(set.size);
  }

  if (aggregate === "checked") {
    if (!targetProp) return "0 checked";
    const checked = linkedPages.filter((page) => page.rowProps?.[targetProp.id] === true).length;
    return `${checked}/${total} checked`;
  }

  if (aggregate === "percent_checked") {
    if (!targetProp || total === 0) return "0%";
    const checked = linkedPages.filter((page) => page.rowProps?.[targetProp.id] === true).length;
    return `${Math.round((checked / total) * 100)}%`;
  }

  if (aggregate === "sum" || aggregate === "avg" || aggregate === "min" || aggregate === "max") {
    if (!targetProp) return "0";
    const nums = linkedPages
      .map((page) => Number(page.rowProps?.[targetProp.id] ?? NaN))
      .filter(Number.isFinite);
    if (nums.length === 0) return "—";
    if (aggregate === "sum") return String(nums.reduce((a, b) => a + b, 0));
    if (aggregate === "avg") {
      return String((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2).replace(/\.?0+$/, ""));
    }
    if (aggregate === "min") return String(Math.min(...nums));
    if (aggregate === "max") return String(Math.max(...nums));
  }

  if (aggregate === "earliest" || aggregate === "latest") {
    const dates = linkedPages
      .map((page) => targetProp ? page.rowProps?.[targetProp.id] : null)
      .map((value) => typeof value === "object" && value && "date" in value ? value.date : null)
      .filter((date): date is string => !!date)
      .sort();
    if (dates.length === 0) return "—";
    return aggregate === "earliest" ? dates[0]! : dates.at(-1)!;
  }

  return "—";
}
