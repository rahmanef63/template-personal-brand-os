/** Pure helpers — apply DatabaseViewConfig (filter + sort + search) to
 *  a row list. Caller owns row data + props; this only re-orders and
 *  filters. Used by every view component (Table / Board / List / etc.).
 *
 *  Filter matchers + PropertyValue coercion live in ./viewData-filters
 *  (CK-2C split — keeps this file under the 200-LOC audit cap). */

import type {
  Database,
  DatabaseViewConfig,
  Page,
  Property,
  PropertyValue,
} from "../types";
import { asString, matchesFilter } from "./viewData-filters";

function matchesSearch(row: Page, q: string, props: Property[]): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  if (row.title.toLowerCase().includes(needle)) return true;
  for (const p of props) {
    const v = asString(row.rowProps?.[p.id]);
    if (v.toLowerCase().includes(needle)) return true;
  }
  return false;
}

function compare(a: PropertyValue | undefined, b: PropertyValue | undefined): number {
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return asString(a).localeCompare(asString(b));
}

export function applyView(
  rows: Page[],
  db: Database,
  view: DatabaseViewConfig,
): Page[] {
  const propMap = new Map(db.properties.map((p) => [p.id, p]));
  let out = rows;

  for (const f of view.filters ?? []) {
    out = out.filter((r) => matchesFilter(r, f, propMap.get(f.propertyId)));
  }

  if (view.search) {
    out = out.filter((r) => matchesSearch(r, view.search, db.properties));
  }

  const sorts = view.sorts ?? [];
  if (sorts.length > 0) {
    out = [...out].sort((a, b) => {
      for (const s of sorts) {
        const av = a.rowProps?.[s.propertyId] ?? null;
        const bv = b.rowProps?.[s.propertyId] ?? null;
        const cmp = compare(av, bv);
        if (cmp !== 0) return s.direction === "asc" ? cmp : -cmp;
      }
      return 0;
    });
  }

  return out;
}

/** Group rows by a select-shaped property's value id. `null` bucket is
 *  for rows with no value. Used by BoardView. */
export function groupBy(
  rows: Page[],
  prop: Property,
): Array<{ key: string | null; label: string; color: string; rows: Page[] }> {
  const buckets = new Map<string | null, Page[]>();
  for (const r of rows) {
    const raw = r.rowProps?.[prop.id];
    const k = typeof raw === "string" ? raw : null;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(r);
  }
  const out: Array<{ key: string | null; label: string; color: string; rows: Page[] }> = [];
  if (buckets.has(null)) {
    out.push({ key: null, label: "No value", color: "muted", rows: buckets.get(null)! });
  }
  for (const opt of prop.options ?? []) {
    const rs = buckets.get(opt.id);
    if (rs) out.push({ key: opt.id, label: opt.name, color: opt.color, rows: rs });
  }
  // Surface option columns that exist on the property but have zero rows
  // so BoardView can render them as empty droppable lanes.
  for (const opt of prop.options ?? []) {
    if (!buckets.has(opt.id)) {
      out.push({ key: opt.id, label: opt.name, color: opt.color, rows: [] });
    }
  }
  return out;
}

/** Bucket rows into a month grid keyed by `YYYY-MM-DD`. Used by
 *  CalendarView. `prop` must be a date-shaped property. */
export function bucketByDate(
  rows: Page[],
  prop: Property,
): Map<string, Page[]> {
  const out = new Map<string, Page[]>();
  const push = (key: string, r: Page) => {
    if (!out.has(key)) out.set(key, []);
    out.get(key)!.push(r);
  };
  for (const r of rows) {
    const raw = r.rowProps?.[prop.id];
    const obj = typeof raw === "object" && raw ? (raw as { date?: string; end?: string }) : null;
    const date = obj?.date ? String(obj.date).slice(0, 10) : null;
    if (!date) continue;
    const end = obj?.end ? String(obj.end).slice(0, 10) : null;
    // Range (start→end): place the row on every spanned day so the
    // Calendar shows it across the bar. Capped at 366 days as a guard.
    if (end && end > date) {
      for (let d = date, i = 0; d <= end && i < 366; d = addDay(d), i++) push(d, r);
    } else {
      push(date, r);
    }
  }
  return out;
}

/** Next calendar day for a "YYYY-MM-DD" string (UTC-safe). */
function addDay(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}
