/** FormView helper predicates + draft factory.
 *  Pure functions — used by FormView to decide which properties are
 *  formable, seed empty draft, and validate required fields. */

import type { Property, PropertyType, PropertyValue } from "../../types";

/** Computed / system-managed types — never editable from a form. */
export const READ_ONLY_PROPERTY_TYPES: PropertyType[] = [
  "formula", "created_time", "last_edited_time", "unique_id",
];

export function isFormableProperty(p: Property): boolean {
  return !READ_ONLY_PROPERTY_TYPES.includes(p.type);
}

export function emptyDraft(props: Property[]): Record<string, PropertyValue> {
  const d: Record<string, PropertyValue> = {};
  for (const p of props) {
    if (p.type === "checkbox") d[p.id] = false;
    else if (p.type === "multi_select" || p.type === "person" || p.type === "files") d[p.id] = [];
    else d[p.id] = null;
  }
  return d;
}

export function isEmptyValue(v: PropertyValue | undefined): boolean {
  if (v === null || v === undefined || v === "") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}
