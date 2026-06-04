"use client";

/** CSV → property mapping editor. One row per detected column. */

import {
  type Database,
  PROPERTY_TYPES_CSV_IMPORTABLE,
  PROPERTY_TYPE_META,
} from "../../types";

const SKIP = "__skip__";
const TITLE = "__title__";
const NEW_PREFIX = "__new:";

export const CSV_SKIP = SKIP;
export const CSV_TITLE = TITLE;
export const CSV_NEW_PREFIX = NEW_PREFIX;

/** @deprecated use `PROPERTY_TYPES_CSV_IMPORTABLE` from `@/features/notion-shell`
 *  — this re-export stays for back-compat with consumers that imported
 *  `NEW_TYPES` before the SSOT registry landed (v0.5.2). */
export const NEW_TYPES = PROPERTY_TYPES_CSV_IMPORTABLE;

export function CsvMapping({
  db, headers, mapping, onSet,
}: {
  db: Database;
  headers: string[];
  mapping: Record<number, string>;
  onSet: (col: number, value: string) => void;
}) {
  return (
    <div className="max-h-[420px] space-y-2 overflow-y-auto">
      <div className="text-xs text-muted-foreground">
        {headers.length} columns detected — map each to a property below.
      </div>
      {headers.map((h, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="flex-1 truncate font-medium">{h || `Column ${i + 1}`}</span>
          <span className="text-muted-foreground">→</span>
          <select
            value={mapping[i] ?? SKIP}
            onChange={(e) => onSet(i, e.target.value)}
            className="min-w-48 rounded border border-border bg-background px-2 py-1 text-xs"
          >
            <option value={SKIP}>(skip)</option>
            <option value={TITLE}>Title</option>
            <optgroup label="Existing properties">
              {db.properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name} · {p.type}</option>
              ))}
            </optgroup>
            <optgroup label="+ Create new property">
              {PROPERTY_TYPES_CSV_IMPORTABLE.map((t) => (
                <option key={t} value={`${NEW_PREFIX}${t}`}>+ New · {PROPERTY_TYPE_META[t].label}</option>
              ))}
            </optgroup>
          </select>
        </div>
      ))}
    </div>
  );
}
