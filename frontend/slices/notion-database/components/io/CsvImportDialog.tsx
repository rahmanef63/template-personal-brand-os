"use client";

/** CsvImportDialog — file picker + column mapper + import preview. */

import { useState } from "react";
import { AlertCircle, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePicker } from "@/shared/ui/FilePicker";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type {
  Database, Property, PropertyType, PropertyValue, SelectOption,
} from "../../types";
import { parseCsv, valueFromString, type ParsedCsv } from "../../lib/io/csv";
import {
  CSV_NEW_PREFIX, CSV_SKIP, CSV_TITLE, CsvMapping,
} from "./csv-mapping";

const OPTION_COLORS = ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"];

export interface CsvNewProperty {
  /** Synthetic id used as the rowProps key for values mapped to this
   *  new column. Host must remap to its real property id when persisting
   *  (see DatabaseIOActions agentRecipe in the catalog entry). */
  tempId: string;
  type: PropertyType;
  name: string;
  options?: SelectOption[];
}

export interface CsvRowDraft {
  title: string;
  rowProps: Record<string, PropertyValue>;
}

export interface CsvImportResult {
  newProperties: CsvNewProperty[];
  rows: CsvRowDraft[];
}

export interface CsvImportDialogProps {
  db: Database;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (result: CsvImportResult) => Promise<void> | void;
}

export function CsvImportDialog({ db, open, onOpenChange, onImport }: CsvImportDialogProps) {
  const [parsed, setParsed] = useState<ParsedCsv | null>(null);
  const [mapping, setMapping] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => { setParsed(null); setMapping({}); setBusy(false); setDone(null); setError(null); };

  const onFile = async (file: File) => {
    setError(null);
    try {
      const csv = parseCsv(await file.text());
      if (csv.headers.length === 0) { setError("CSV is empty."); return; }
      setParsed(csv);
      const initial: Record<number, string> = {};
      csv.headers.forEach((h, i) => {
        const lower = h.toLowerCase().trim();
        if (lower === "title" || lower === "name" || i === 0) { initial[i] = CSV_TITLE; return; }
        const matched = db.properties.find((p) => p.name.toLowerCase() === lower);
        initial[i] = matched ? matched.id : CSV_SKIP;
      });
      setMapping(initial);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse CSV");
    }
  };

  const submit = async () => {
    if (!parsed) return;
    setBusy(true);
    setError(null);
    try {
      const newProperties: CsvNewProperty[] = [];
      const colToTempId: Record<number, string> = {};
      parsed.headers.forEach((_, i) => {
        const target = mapping[i];
        if (!target?.startsWith(CSV_NEW_PREFIX)) return;
        const type = target.slice(CSV_NEW_PREFIX.length) as PropertyType;
        const name = parsed.headers[i] || `Column ${i + 1}`;
        const tempId = `new:${i}`;
        colToTempId[i] = tempId;
        let options: SelectOption[] | undefined;
        if (type === "select" || type === "multi_select" || type === "status") {
          const names = new Set<string>();
          for (const r of parsed.rows) {
            const raw = (r[i] ?? "").trim();
            if (!raw) continue;
            if (type === "multi_select") raw.split(/[;,]/).map((s) => s.trim()).filter(Boolean).forEach((n) => names.add(n));
            else names.add(raw);
          }
          options = [...names].map((n, idx) => ({
            id: `${tempId}_opt_${idx}`, name: n, color: OPTION_COLORS[idx % OPTION_COLORS.length],
          }));
        }
        newProperties.push({ tempId, type, name, options });
      });

      const newPropByCol: Record<number, Property> = {};
      Object.entries(colToTempId).forEach(([colStr, tempId], idx) => {
        const def = newProperties[idx];
        newPropByCol[Number(colStr)] = { id: tempId, name: def.name, type: def.type, options: def.options };
      });

      const lookupProp = (col: number): Property | null => {
        const target = mapping[col];
        if (!target || target === CSV_SKIP || target === CSV_TITLE) return null;
        if (target.startsWith(CSV_NEW_PREFIX)) return newPropByCol[col] ?? null;
        return db.properties.find((p) => p.id === target) ?? null;
      };

      const rows: CsvRowDraft[] = [];
      for (const r of parsed.rows) {
        if (r.every((c) => c.trim() === "")) continue;
        let title = "";
        const rowProps: Record<string, PropertyValue> = {};
        for (let i = 0; i < parsed.headers.length; i++) {
          const target = mapping[i];
          if (!target || target === CSV_SKIP) continue;
          const raw = r[i] ?? "";
          if (target === CSV_TITLE) { title = raw.trim(); continue; }
          const prop = lookupProp(i);
          if (!prop) continue;
          const v = valueFromString(raw, prop);
          if (v === null) continue;
          rowProps[prop.id] = v;
        }
        rows.push({ title, rowProps });
      }

      await onImport({ newProperties, rows });
      setDone(rows.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Import CSV → {db.name}</DialogTitle>
          <DialogDescription>
            Map each CSV column to an existing property, skip it, or create a new property.
          </DialogDescription>
        </DialogHeader>
        {!parsed && (
          <FilePicker
            accept=".csv,text/csv"
            aria-label="Choose a .csv file"
            onFiles={(files) => { const f = files[0]; if (f) void onFile(f); }}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border p-8 transition hover:bg-accent/30"
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm">Click to choose .csv file</span>
          </FilePicker>
        )}
        {parsed && done === null && (
          <CsvMapping
            db={db}
            headers={parsed.headers}
            mapping={mapping}
            onSet={(col, value) => setMapping((m) => ({ ...m, [col]: value }))}
          />
        )}
        {done !== null && (
          <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4 text-center text-sm">
            <Check className="mx-auto mb-2 h-6 w-6 text-green-600" />
            Imported {done} row{done === 1 ? "" : "s"} into {db.name}.
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        <DialogFooter>
          {parsed && done === null && (
            <Button onClick={submit} disabled={busy}>
              {busy ? "Importing…" : `Import ${parsed.rows.length} rows`}
            </Button>
          )}
          {done !== null && <Button onClick={() => onOpenChange(false)}>Done</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
