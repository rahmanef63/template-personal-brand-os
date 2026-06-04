/** Op definitions per PropertyType. Extracted from FilterBuilder.tsx
 *  (CK-2C, 2026-05-24) to keep parent under 200-LOC audit cap. */

import type { DatabaseFilterOp, PropertyType } from "../types";

export type OpDef = {
  value: DatabaseFilterOp;
  label: string;
  needsValue: "none" | "single" | "between" | "select";
};

const TEXT_OPS: OpDef[] = [
  { value: "contains",         label: "contains",        needsValue: "single" },
  { value: "does_not_contain", label: "does not contain", needsValue: "single" },
  { value: "starts_with",      label: "starts with",     needsValue: "single" },
  { value: "ends_with",        label: "ends with",       needsValue: "single" },
  { value: "equals",           label: "equals",          needsValue: "single" },
  { value: "not_equals",       label: "does not equal",  needsValue: "single" },
  { value: "is_empty",         label: "is empty",        needsValue: "none" },
  { value: "not_empty",        label: "is not empty",    needsValue: "none" },
];

const NUMBER_OPS: OpDef[] = [
  { value: "equals",     label: "=",                 needsValue: "single" },
  { value: "not_equals", label: "≠",                 needsValue: "single" },
  { value: "gt",         label: ">",                 needsValue: "single" },
  { value: "gte",        label: "≥",                 needsValue: "single" },
  { value: "lt",         label: "<",                 needsValue: "single" },
  { value: "lte",        label: "≤",                 needsValue: "single" },
  { value: "between",    label: "between",           needsValue: "between" },
  { value: "is_empty",   label: "is empty",          needsValue: "none" },
  { value: "not_empty",  label: "is not empty",      needsValue: "none" },
];

const DATE_OPS: OpDef[] = [
  { value: "on",         label: "on",                needsValue: "single" },
  { value: "before",     label: "before",            needsValue: "single" },
  { value: "after",      label: "after",             needsValue: "single" },
  { value: "between",    label: "between",           needsValue: "between" },
  { value: "is_today",   label: "is today",          needsValue: "none" },
  { value: "past_week",  label: "in past week",      needsValue: "none" },
  { value: "next_week",  label: "in next week",      needsValue: "none" },
  { value: "is_empty",   label: "is empty",          needsValue: "none" },
  { value: "not_empty",  label: "is not empty",      needsValue: "none" },
];

const SELECT_OPS: OpDef[] = [
  { value: "is_any_of",  label: "is any of",         needsValue: "select" },
  { value: "is_none_of", label: "is none of",        needsValue: "select" },
  { value: "equals",     label: "equals",            needsValue: "select" },
  { value: "is_empty",   label: "is empty",          needsValue: "none" },
  { value: "not_empty",  label: "is not empty",      needsValue: "none" },
];

const CHECKBOX_OPS: OpDef[] = [
  { value: "checked",    label: "is checked",        needsValue: "none" },
  { value: "unchecked",  label: "is unchecked",      needsValue: "none" },
];

export function opsForType(t: PropertyType | undefined): OpDef[] {
  switch (t) {
    case "number":       return NUMBER_OPS;
    case "date":         return DATE_OPS;
    case "select":
    case "multi_select":
    case "status":       return SELECT_OPS;
    case "checkbox":     return CHECKBOX_OPS;
    default:             return TEXT_OPS;
  }
}

export function inputTypeForProp(t: PropertyType | undefined): string {
  if (t === "number")   return "number";
  if (t === "date")     return "date";
  if (t === "url")      return "url";
  if (t === "email")    return "email";
  if (t === "phone")    return "tel";
  return "text";
}
