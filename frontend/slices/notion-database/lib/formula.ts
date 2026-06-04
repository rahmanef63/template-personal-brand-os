/** Formula barrel — public API for the engine + legacy `evaluateFormula`
 *  wrapper (string-returning) preserved for callers that don't need the
 *  typed FormulaValue tree.
 *
 *  Engine surface lives in `./formulaEngine/`. Prefer importing
 *  `evalFormula` (typed) for new code. */

import type { Database, Page, Property, PropertyValue } from "../types";
import { evalFormula } from "./formulaEngine";
import { formatFormulaValue } from "./formulaEngine";

export * from "./formulaEngine";

/** Legacy string-returning evaluator. Returns "" on null,
 *  "Invalid formula" on parse / eval error. `pages` optional — pass
 *  the workspace pages when relation refs need resolving. */
export function evaluateFormula(
  expression: string,
  row: Page,
  db: Database,
  pages: Page[] = [],
): string {
  const { value, error } = evalFormula(expression, { row, db, pages });
  if (error) return "Invalid formula";
  return formatFormulaValue(value);
}

/** Format a property value as plain text — useful when host code wants
 *  the same string a formula `{{prop}}` would render. */
export function formatPropertyValue(
  value: PropertyValue | undefined,
  prop: Property,
): string {
  if (value === undefined || value === null || value === "") return "";
  if (prop.type === "checkbox") return value === true ? "Checked" : "Unchecked";
  if (prop.type === "date") {
    return typeof value === "object" && "date" in value ? value.date ?? "" : "";
  }
  if (prop.type === "select" || prop.type === "status") {
    return prop.options?.find((o) => o.id === value)?.name ?? String(value);
  }
  if (prop.type === "multi_select") {
    const ids = Array.isArray(value) ? value : [];
    return ids.map((id) => prop.options?.find((o) => o.id === id)?.name ?? id).join(", ");
  }
  if (prop.type === "files") {
    const files = Array.isArray(value) ? value : [];
    return files.map((url) => url.split("/").pop() ?? url).join(", ");
  }
  if (prop.type === "person") {
    const ids = Array.isArray(value) ? value : [];
    return ids.join(", ");
  }
  if (prop.type === "created_time" || prop.type === "last_edited_time") return "";
  return String(value);
}
