"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CrudFormBody } from "./CrudFormBody";
import type { CrudController, EntityMeta, FieldDef } from "./types";

interface Props<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string | null;
  meta: EntityMeta;
  controller: CrudController<T>;
  fields: FieldDef<T>[];
  /** Called after the user confirms deletion (closes the dialog). */
  onDeleted?: () => void;
}

/**
 * Inline editor mounted by CrudListView when a row is clicked. Avoids
 * the page-navigation hop and keeps context. Save commits via
 * controller.update; Cancel discards local draft.
 *
 * Responsive: full-height sheet feel on narrow screens via
 * `max-h-[90svh]` + scroll inside DialogContent.
 */
export function CrudRowDialog<T>({
  open,
  onOpenChange,
  id,
  meta,
  controller,
  fields,
  onDeleted,
}: Props<T>) {
  const entity = id
    ? controller.items.find((it) => controller.getId(it) === id) ?? null
    : null;

  const [draft, setDraft] = React.useState<T | null>(entity);

  React.useEffect(() => setDraft(entity), [entity, id, open]);

  if (!entity || !draft) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{meta.label} not found</DialogTitle>
            <DialogDescription>
              The row you tried to edit no longer exists.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(entity);
  const publicHref = meta.publicHref?.(draft as unknown);

  function patch(key: keyof T & string, value: unknown) {
    setDraft((d) => (d ? ({ ...d, [key]: value } as T) : d));
  }

  function save() {
    if (!draft || !id) return;
    controller.update(id, draft);
    onOpenChange(false);
  }

  function remove() {
    if (!id) return;
    const label = (draft as Record<string, unknown>)[fields[0]?.key as string];
    if (!confirm(`Delete "${String(label ?? "item")}"?`)) return;
    controller.remove(id);
    onOpenChange(false);
    onDeleted?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90svh] flex-col gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="flex-shrink-0 border-b px-5 py-3">
          <DialogTitle className="text-base">
            Edit {meta.label.toLowerCase()}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Changes save when you press <span className="font-medium">Save</span>.
            Cancel to discard.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
          <CrudFormBody
            fields={fields}
            draft={draft}
            onChange={patch}
            ctx={{ total: controller.items.length, editing: true }}
          />
        </div>

        <DialogFooter className="flex-shrink-0 flex-row items-center justify-between gap-2 border-t bg-muted/30 px-5 py-3 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={remove}
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-3.5" /> Delete
          </Button>
          <div className="flex items-center gap-2">
            {publicHref && (
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href={publicHref} target="_blank">
                  <ExternalLink className="size-3.5" /> View
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button size="sm" disabled={!dirty} onClick={save}>
              Save{dirty ? " (unsaved)" : ""}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
