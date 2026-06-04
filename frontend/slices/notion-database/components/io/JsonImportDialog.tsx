"use client";

/** JsonImportDialog — file picker for previously-exported .json files. */

import { useState } from "react";
import { AlertCircle, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePicker } from "@/shared/ui/FilePicker";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { Database } from "../../types";
import {
  buildImportResult, parseExport,
  type DatabaseExportV1, type JsonImportResult,
} from "../../lib/io/serialize";

export interface JsonImportDialogProps {
  db: Database;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (result: JsonImportResult) => Promise<void> | void;
}

export function JsonImportDialog({ db, open, onOpenChange, onImport }: JsonImportDialogProps) {
  const [parsed, setParsed] = useState<DatabaseExportV1 | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => { setParsed(null); setBusy(false); setDone(null); setError(null); };

  const onFile = async (file: File) => {
    setError(null);
    try {
      setParsed(parseExport(await file.text()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse JSON");
    }
  };

  const submit = async () => {
    if (!parsed) return;
    setBusy(true);
    setError(null);
    try {
      const result = buildImportResult(parsed, db.properties);
      await onImport(result);
      setDone(result.rows.length);
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
          <DialogTitle>Import database (JSON) → {db.name}</DialogTitle>
          <DialogDescription>
            Pick a previously-exported `.json` file. Schema matched by property name
            (case-insensitive + type). Unmatched properties listed as new.
          </DialogDescription>
        </DialogHeader>

        {!parsed && (
          <FilePicker
            accept=".json,application/json"
            aria-label="Choose a .json file"
            onFiles={(files) => { const f = files[0]; if (f) void onFile(f); }}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border p-8 transition hover:bg-accent/30"
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm">Click to choose .json file</span>
          </FilePicker>
        )}

        {parsed && done === null && (
          <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-md bg-muted/40 p-3 text-xs">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <span>{parsed.database.icon || "🗂️"}</span>
              <span>{parsed.database.name}</span>
            </div>
            <div className="text-muted-foreground">
              {parsed.database.properties.length} properties · {parsed.database.views.length} views ·{" "}
              {parsed.rows.length} rows
            </div>
            {parsed.database.properties.length > 0 && (
              <ul className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
                {parsed.database.properties.slice(0, 12).map((p) => (
                  <li key={p.id}>· {p.name} <span className="opacity-60">({p.type})</span></li>
                ))}
                {parsed.database.properties.length > 12 && (
                  <li className="opacity-60">… +{parsed.database.properties.length - 12} more</li>
                )}
              </ul>
            )}
            <p className="pt-2 text-[10px] text-muted-foreground/70">
              Exported {new Date(parsed.exportedAt).toLocaleString()}
            </p>
          </div>
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
