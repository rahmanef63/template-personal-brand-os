"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudFormBody } from "./CrudFormBody";
import type { CrudController, EntityMeta, FieldDef } from "./types";

/**
 * Full-page editor — used by deep-link /admin/<entity>/[id] routes.
 * For inline row-click editing, prefer mounting CrudRowDialog from
 * CrudListView (default since AF-wave).
 */
export function CrudFormView<T>({
  id,
  meta,
  controller,
  fields,
  backHref,
}: {
  id: string;
  meta: EntityMeta;
  controller: CrudController<T>;
  fields: FieldDef<T>[];
  /** /admin/<entity> list URL. */
  backHref: string;
}) {
  const entity = controller.items.find((it) => controller.getId(it) === id);
  const [draft, setDraft] = React.useState<T | null>(entity ?? null);

  React.useEffect(() => setDraft(entity ?? null), [entity]);

  if (!entity || !draft) {
    return (
      <div className="space-y-3">
        <BackLink href={backHref} label={meta.labelPlural} />
        <p className="text-sm text-muted-foreground">{meta.label} not found.</p>
      </div>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(entity);
  const publicHref = meta.publicHref?.(draft as unknown);

  function patch(key: keyof T & string, value: unknown) {
    setDraft((d) => (d ? ({ ...d, [key]: value } as T) : d));
  }

  function save() {
    if (!draft) return;
    controller.update(id, draft);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <BackLink href={backHref} label={meta.labelPlural} />
        <div className="flex items-center gap-2">
          {publicHref && (
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href={publicHref} target="_blank">
                <ExternalLink className="size-3.5" /> View public
              </Link>
            </Button>
          )}
          <Button size="sm" className="gap-1.5" disabled={!dirty} onClick={save}>
            <Save className="size-3.5" /> Save{dirty ? " (unsaved)" : ""}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 sm:p-5">
        <CrudFormBody
          fields={fields}
          draft={draft}
          onChange={patch}
          ctx={{ total: controller.items.length, editing: true }}
        />
      </div>
    </div>
  );
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-3" /> All {label.toLowerCase()}
    </Link>
  );
}
