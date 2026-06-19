"use client";

/** Convex-persisted NotionDatabase surface — the dashboard "Database"
 *  page body. State lives in one `notion_docs` row (kind "database",
 *  whole `{ db, rows }` doc, debounce-saved by useNotionDoc). */

import { NotionDatabase, DatabaseIOActions } from "@/features/notion-database";
import { useNotionDoc } from "./use-notion-doc";
import { useDatabaseCallbacks } from "./use-database-callbacks";
import { INITIAL_DATABASE, userLookup, type DatabaseDoc } from "./defaults";

export function NotionDatabaseHost({ slug = "database-main" }: { slug?: string }) {
  const { value: doc, setValue: setDoc, loaded } = useNotionDoc<DatabaseDoc>(
    slug,
    "database",
    INITIAL_DATABASE,
  );
  const callbacks = useDatabaseCallbacks(setDoc);

  if (!loaded) {
    return <div className="h-64 animate-pulse rounded-lg border border-border/60 bg-muted/30" />;
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <DatabaseIOActions db={doc.db} rows={doc.rows} onImport={callbacks.onImport} />
      </div>
      <NotionDatabase db={doc.db} rows={doc.rows} userLookup={userLookup} {...callbacks} />
    </div>
  );
}
