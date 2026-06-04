/** Filter helpers extracted from viewData.ts (CK-2C, 2026-05-24) to keep
 *  viewData.ts under the 200-LOC audit cap. Pure functions — coerce
 *  PropertyValue into typed shapes + match against DatabaseFilterOp. */

import type {
  DatabaseFilter,
  DatabaseFilterOp,
  Page,
  Property,
  PropertyValue,
} from "../types";

export function asString(v: PropertyValue | undefined): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function asNumber(v: PropertyValue | undefined): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function asDate(v: PropertyValue | undefined): Date | null {
  if (!v) return null;
  let iso: string | null = null;
  if (typeof v === "string") iso = v;
  else if (typeof v === "object" && v && "date" in v && typeof (v as { date?: unknown }).date === "string") {
    iso = (v as { date: string }).date;
  }
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function selectedIds(v: PropertyValue | undefined): string[] {
  if (v === null || v === undefined || v === "") return [];
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [];
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysFromToday(days: number): Date {
  const d = startOfToday();
  d.setDate(d.getDate() + days);
  return d;
}

function parseBetween(value: string | undefined): [string, string] | null {
  if (!value) return null;
  const [a, b] = value.split("|");
  if (a === undefined || b === undefined) return null;
  return [a, b];
}

function isEmptyValue(raw: PropertyValue | undefined): boolean {
  if (raw === null || raw === undefined) return true;
  if (raw === "") return true;
  if (Array.isArray(raw) && raw.length === 0) return true;
  if (typeof raw === "object" && raw && "date" in raw && !(raw as { date?: string }).date) return true;
  return false;
}

function matchesText(text: string, op: DatabaseFilterOp, value: string): boolean {
  const t = text.toLowerCase();
  const v = value.toLowerCase();
  switch (op) {
    case "contains":          return t.includes(v);
    case "does_not_contain":  return !t.includes(v);
    case "starts_with":       return t.startsWith(v);
    case "ends_with":         return t.endsWith(v);
    case "equals":            return t === v;
    case "not_equals":        return t !== v;
    default:                  return true;
  }
}

function matchesNumber(n: number, op: DatabaseFilterOp, value: string): boolean {
  if (op === "between") {
    const range = parseBetween(value);
    if (!range) return true;
    const lo = Number(range[0]);
    const hi = Number(range[1]);
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return true;
    return n >= lo && n <= hi;
  }
  const target = Number(value);
  if (!Number.isFinite(target)) return true;
  switch (op) {
    case "equals":     return n === target;
    case "not_equals": return n !== target;
    case "gt":         return n > target;
    case "gte":        return n >= target;
    case "lt":         return n < target;
    case "lte":        return n <= target;
    default:           return true;
  }
}

function matchesDate(d: Date, op: DatabaseFilterOp, value: string | undefined): boolean {
  switch (op) {
    case "is_today": {
      const t = startOfToday();
      return d.toDateString() === t.toDateString();
    }
    case "past_week": {
      const lo = daysFromToday(-7);
      const hi = startOfToday();
      return d >= lo && d <= hi;
    }
    case "next_week": {
      const lo = startOfToday();
      const hi = daysFromToday(7);
      return d >= lo && d <= hi;
    }
    case "between": {
      const range = parseBetween(value);
      if (!range) return true;
      const lo = new Date(range[0]);
      const hi = new Date(range[1]);
      if (Number.isNaN(lo.getTime()) || Number.isNaN(hi.getTime())) return true;
      return d >= lo && d <= hi;
    }
    default: {
      if (!value) return true;
      const target = new Date(value);
      if (Number.isNaN(target.getTime())) return true;
      switch (op) {
        case "before": return d < target;
        case "after":  return d > target;
        case "on":     return d.toDateString() === target.toDateString();
        case "equals": return d.toDateString() === target.toDateString();
        default:       return true;
      }
    }
  }
}

function matchesSelect(
  selected: string[],
  op: DatabaseFilterOp,
  value: string,
): boolean {
  const wanted = value.split(",").map((s) => s.trim()).filter(Boolean);
  if (wanted.length === 0) return true;
  switch (op) {
    case "is_any_of":  return wanted.some((w) => selected.includes(w));
    case "is_none_of": return !wanted.some((w) => selected.includes(w));
    case "equals":     return selected.length === 1 && selected[0] === wanted[0];
    case "not_equals": return !(selected.length === 1 && selected[0] === wanted[0]);
    default:           return true;
  }
}

export function matchesFilter(row: Page, filter: DatabaseFilter, prop?: Property): boolean {
  const raw = row.rowProps?.[filter.propertyId];

  if (filter.op === "is_empty")  return isEmptyValue(raw);
  if (filter.op === "not_empty") return !isEmptyValue(raw);
  if (filter.op === "checked")   return raw === true;
  if (filter.op === "unchecked") return raw === false || raw === null || raw === undefined;

  const t = prop?.type;
  if (t === "number") {
    const n = asNumber(raw);
    if (n === null) return false;
    return matchesNumber(n, filter.op, filter.value ?? "");
  }
  if (t === "date") {
    const d = asDate(raw);
    if (!d) return filter.op === "before" || filter.op === "after" ? false : true;
    return matchesDate(d, filter.op, filter.value);
  }
  if (t === "select" || t === "multi_select" || t === "status") {
    const sel = selectedIds(raw);
    if (sel.length === 0 && filter.value) {
      return filter.op === "is_none_of";
    }
    return matchesSelect(sel, filter.op, filter.value ?? "");
  }

  return matchesText(asString(raw), filter.op, filter.value ?? "");
}
