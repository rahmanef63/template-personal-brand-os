"use client";

/** DatabasePage — full-page shell wrapper for a single database. Renders
 *  a big editable header (icon slot + inline title + DatabaseMenu) then
 *  hands every props-driven concern off to NotionDatabase below. Use
 *  this for canonical `/db/[id]` routes; for embedded DBs prefer
 *  NotionDatabase directly. Lifted from notion-page-clone CK-1D
 *  Phase 4. */

import { type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { NotionDatabase, type NotionDatabaseProps } from "../NotionDatabase";
import { DatabaseMenu } from "./DatabaseMenu";

export interface DatabasePageProps extends NotionDatabaseProps {
  /** Inline title edit. Omit to render title read-only. */
  onDatabaseRename?: (next: string) => void;
  onDatabaseDuplicate?: (opts: { includeRows: boolean }) => void;
  onDatabaseLockToggle?: (next: boolean) => void;
  onDatabaseRemove?: () => void;
  /** Icon picker / display — host owns. Neutral 🗂️ glyph fallback. */
  iconSlot?: ReactNode;
  /** Render extra chrome to the right of the menu (e.g. share button). */
  headerExtras?: ReactNode;
  pageClassName?: string;
}

export function DatabasePage({
  onDatabaseRename, onDatabaseDuplicate, onDatabaseLockToggle, onDatabaseRemove,
  iconSlot, headerExtras, pageClassName,
  ...notionProps
}: DatabasePageProps) {
  const { db } = notionProps;
  return (
    <div className={cn("flex flex-col gap-4 px-6 py-8 md:px-10", pageClassName)}>
      <header className="flex items-start gap-3">
        {iconSlot ?? (
          <div
            className="flex h-12 w-12 select-none items-center justify-center rounded-md text-3xl"
            aria-hidden
          >
            🗂️
          </div>
        )}
        <div className="min-w-0 flex-1">
          {onDatabaseRename ? (
            <Input
              value={db.name}
              onChange={(e) => onDatabaseRename(e.target.value)}
              placeholder="Untitled database"
              aria-label="Database name"
              className="h-auto w-full border-0 bg-transparent px-0 text-3xl font-bold tracking-tight shadow-none outline-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
            />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">
              {db.name || "Untitled database"}
            </h1>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {headerExtras}
          <DatabaseMenu
            db={db}
            onRename={onDatabaseRename}
            onDuplicate={onDatabaseDuplicate}
            onLockToggle={onDatabaseLockToggle}
            onRemove={onDatabaseRemove}
          />
        </div>
      </header>
      <NotionDatabase {...notionProps} />
    </div>
  );
}
