"use client";

/** RowDetailBody — shared chrome for sheet + dialog row peeks. Renders
 *  header (mode switcher + close), icon slot, editable title, then the
 *  host-provided properties + blocks slots. Pure / slot-based — no
 *  Convex, no comments provider, no block-editor coupling. The host
 *  drops in its own BlockEditor via `blocksSlot` and its own
 *  PropertiesPanel via `propertiesSlot`.
 *
 *  Lifted from notion-page-clone row/components/RowDetailBody (CK-1D
 *  Phase 1). Original tied to useDbAdapter / useNotionAdapter /
 *  useDatabasesComponents / PageCommentsProvider — all stripped in
 *  favour of render slots so the rr distribution stays portable. */

import { type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  pageId: string;
  title: string;
  /** Mode switcher + any host-defined buttons. */
  headerExtras?: ReactNode;
  /** Called when user clicks the close button in the header. */
  onClose?: () => void;
  /** Inline title edit. Omit to render title as static text. */
  onTitleChange?: (next: string) => void;
  /** Icon picker / display. Host owns; fallback shows a neutral glyph. */
  iconSlot?: ReactNode;
  /** Properties form (typically a NotionProperty list). */
  propertiesSlot?: ReactNode;
  /** Block editor surface (rich-text / blocks). */
  blocksSlot?: ReactNode;
}

export function RowDetailBody({
  pageId, title, headerExtras, onClose,
  onTitleChange, iconSlot, propertiesSlot, blocksSlot,
}: Props) {
  const showHeader = headerExtras !== undefined || !!onClose;
  return (
    <>
      {showHeader && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 shrink-0">
          <span className="text-xs text-muted-foreground shrink-0">Row peek</span>
          <div className="flex items-center gap-2 shrink-0">
            {headerExtras}
            {onClose && (
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={onClose}
                aria-label="Close"
                className="h-6 w-6 rounded p-0 text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </header>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-8 md:px-10" data-page-id={pageId}>
        <div className="flex items-start gap-2">
          {iconSlot ?? (
            <div
              className="flex h-10 w-10 select-none items-center justify-center rounded-md text-2xl"
              aria-hidden
            >
              📄
            </div>
          )}
        </div>
        {onTitleChange ? (
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled"
            className="mt-2 h-auto w-full border-0 bg-transparent px-0 text-3xl font-bold tracking-tight shadow-none outline-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
          />
        ) : (
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            {title || "Untitled"}
          </h2>
        )}
        {propertiesSlot && <div className="mt-5">{propertiesSlot}</div>}
        {blocksSlot && <div className="prose-editor mt-2">{blocksSlot}</div>}
      </div>
    </>
  );
}
