"use client";

/** DatabaseIOActions — single combined dropdown. Six items: Export CSV,
 *  Export JSON, Import CSV…, Import JSON…, Download CSV template,
 *  Download JSON template. Templates are generated from live
 *  db.properties (header set + per-type placeholder hint row). */

import { useState } from "react";
import { Download, FileDown, FileJson, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Database, Page } from "../../types";
import { downloadCsv, exportDatabaseToCsv } from "../../lib/io/csv";
import { downloadJson, exportDatabase, type JsonImportResult } from "../../lib/io/serialize";
import { buildCsvTemplate, buildJsonTemplate } from "../../lib/io/template";
import { CsvImportDialog, type CsvImportResult } from "./CsvImportDialog";
import { JsonImportDialog } from "./JsonImportDialog";

export interface DatabaseIOActionsProps {
  db: Database;
  rows: Page[];
  onImport: (
    result: CsvImportResult | JsonImportResult,
  ) => Promise<void> | void;
  className?: string;
  /** Label for the trigger button. Defaults to "Import / Export". */
  label?: string;
}

export function DatabaseIOActions({
  db, rows, onImport, className, label = "Import / Export",
}: DatabaseIOActionsProps) {
  const [csvOpen, setCsvOpen] = useState(false);
  const [jsonOpen, setJsonOpen] = useState(false);

  const safeName = db.name || "database";

  const onExportCsv = () => downloadCsv(`${safeName}.csv`, exportDatabaseToCsv(db, rows));
  const onExportJson = () => downloadJson(`${safeName}.json`, exportDatabase(db, rows));
  const onTemplateCsv = () => downloadCsv(`${safeName}.template.csv`, buildCsvTemplate(db));
  const onTemplateJson = () => downloadJson(`${safeName}.template.json`, buildJsonTemplate(db));

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className={
              className
              ?? "flex h-auto items-center gap-1 rounded-md px-2 py-1 text-xs font-normal text-muted-foreground hover:bg-accent"
            }
            aria-label="Import / Export"
          >
            <Download className="h-3.5 w-3.5" />
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56">
          <DropdownMenuLabel className="text-xs">
            Export {rows.length} row{rows.length === 1 ? "" : "s"}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={onExportCsv}>
            <FileText className="mr-2 h-3.5 w-3.5" /> Export CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportJson}>
            <FileJson className="mr-2 h-3.5 w-3.5" /> Export JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs">Import</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setCsvOpen(true)}>
            <Upload className="mr-2 h-3.5 w-3.5" /> Import CSV…
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setJsonOpen(true)}>
            <Upload className="mr-2 h-3.5 w-3.5" /> Import JSON…
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs">
            Template ({db.properties.length} column{db.properties.length === 1 ? "" : "s"})
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={onTemplateCsv}>
            <FileDown className="mr-2 h-3.5 w-3.5" /> Download CSV template
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onTemplateJson}>
            <FileDown className="mr-2 h-3.5 w-3.5" /> Download JSON template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CsvImportDialog db={db} open={csvOpen} onOpenChange={setCsvOpen} onImport={onImport} />
      <JsonImportDialog db={db} open={jsonOpen} onOpenChange={setJsonOpen} onImport={onImport} />
    </>
  );
}
