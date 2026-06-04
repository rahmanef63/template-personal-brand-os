"use client";

/** Convex-persisted Notion page editor — the dashboard "Notes" page body.
 *  Full notion-shell surface: blocks + slash menu + inline format toolbar +
 *  selection marquee + page actions (font / full-width / small-text / lock).
 *  Whole doc lives in one `notion_docs` row (kind "page", debounce-saved). */

import * as React from "react";
import {
  NotionPage,
  NotionBlock,
  InsertBlockButton,
  InlineFormatToolbar,
  PageActionsMenu,
  collectHeadings,
} from "@/features/notion-shell";
import { SelectionProvider, SelectableBlock, SelectionMarquee } from "@/features/selection";
import { useNotionDoc } from "./use-notion-doc";
import { useBlockOps } from "./use-block-ops";
import { NOTES_BLOCK_RENDERERS, TocHeadingsContext } from "./block-renderers";
import { INITIAL_NOTES, type NotesDoc } from "./defaults";

export function NotionNotesHost({ slug = "notes" }: { slug?: string }) {
  const { value: doc, setValue: setDoc, loaded } = useNotionDoc<NotesDoc>(
    slug,
    "page",
    INITIAL_NOTES,
  );
  const ops = useBlockOps(doc.blocks, setDoc);
  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const blockIds = doc.blocks.map((b) => b.id);
  const headings = React.useMemo(() => collectHeadings(doc.blocks), [doc.blocks]);
  const patch = (p: Partial<NotesDoc>) => setDoc((d) => ({ ...d, ...p }));

  if (!loaded) {
    return <div className="h-64 animate-pulse rounded-lg border border-border/60 bg-muted/30" />;
  }
  return (
    <TocHeadingsContext.Provider value={headings}>
      <div className="rounded-lg border border-border bg-background">
        <InlineFormatToolbar />
        <NotionPage
          icon={doc.icon}
          title={doc.title}
          onIconChange={(icon) => patch({ icon })}
          onTitleChange={(title) => patch({ title })}
          font={doc.font}
          fullWidth={doc.fullWidth}
          smallText={doc.smallText}
          locked={doc.locked}
          actions={
            <PageActionsMenu
              font={doc.font}
              fullWidth={doc.fullWidth}
              smallText={doc.smallText}
              locked={doc.locked}
              onSetFont={(font) => patch({ font })}
              onToggleFullWidth={() => patch({ fullWidth: !doc.fullWidth })}
              onToggleSmallText={() => patch({ smallText: !doc.smallText })}
              onToggleLock={() => patch({ locked: !doc.locked })}
            />
          }
        >
          <SelectionProvider onBulkDelete={ops.removeMany} onBulkDuplicate={ops.duplicateMany}>
            <div ref={surfaceRef} className="relative min-h-[24rem] space-y-1 pb-10 pl-6">
              <SelectionMarquee containerRef={surfaceRef} />
              {doc.blocks.map((b) => (
                <SelectableBlock key={b.id} id={b.id} orderedIds={blockIds}>
                  <NotionBlock
                    block={b}
                    blockRenderers={NOTES_BLOCK_RENDERERS}
                    readOnly={doc.locked}
                    onUpdate={(p) => ops.update(b.id, p)}
                    onTurnInto={doc.locked ? undefined : (type) => ops.turnInto(b.id, type)}
                    onDuplicate={() => ops.duplicate(b.id)}
                    onRemove={() => ops.remove(b.id)}
                    onMoveUp={() => ops.move(b.id, -1)}
                    onMoveDown={() => ops.move(b.id, 1)}
                    onInsertAfter={(type, init) => ops.insertAfter(b.id, type, init)}
                    onMergeBack={() => ops.mergeBack(b.id)}
                    onFocusSibling={(dir) => ops.focusSibling(b.id, dir)}
                  />
                </SelectableBlock>
              ))}
              {!doc.locked && (
                <div className="pt-3">
                  <InsertBlockButton onInsert={ops.insert} label="Add block" />
                </div>
              )}
            </div>
          </SelectionProvider>
        </NotionPage>
      </div>
    </TocHeadingsContext.Provider>
  );
}
