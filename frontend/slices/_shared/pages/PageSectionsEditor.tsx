"use client";

import * as React from "react";
import { CrudListView } from "@/features/_shared/crud/CrudListView";
import { Badge } from "@/components/ui/badge";
import type {
  ColumnDef,
  CrudController,
  EntityMeta,
} from "@/features/_shared/crud/types";
import { LANDING_FIELDS } from "../landing/landing-fields";
import { blankSection } from "../landing/LandingEditorView";
import type { LandingSection, LandingSectionKind } from "../landing/types";

/**
 * BI-wave — shared section editor used by BOTH the landing surface AND
 * custom-page admin. One UI for one composition primitive
 * (`LandingSection`). Templates wire the data-source and dispatch
 * callbacks; the editor stays store-agnostic.
 *
 * Layout matches LandingView (row-per-section + click-to-edit dialog
 * via CrudRowDialog) so operators see the same shape whether they're
 * editing the landing page or a custom page.
 */
export function PageSectionsEditor({
  sections,
  onCreate,
  onUpdate,
  onRemove,
  editPath,
  publicHref,
  emptyHint,
}: {
  sections: LandingSection[];
  onCreate: (section: LandingSection) => void;
  onUpdate: (id: string, patch: Partial<LandingSection>) => void;
  onRemove: (id: string) => void;
  /** Optional per-row edit link (for full-page editor route). When omitted
   *  CrudListView falls back to the inline dialog. */
  editPath?: (id: string) => string;
  /** "View public" link in the list header. */
  publicHref?: string | (() => string);
  emptyHint?: string;
}) {
  const controller = React.useMemo<CrudController<LandingSection>>(() => {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const swap = (id: string, delta: -1 | 1) => {
      const idx = sorted.findIndex((s) => s.id === id);
      if (idx < 0) return;
      const next = idx + delta;
      if (next < 0 || next >= sorted.length) return;
      const a = sorted[idx];
      const b = sorted[next];
      onUpdate(a.id, { order: b.order });
      onUpdate(b.id, { order: a.order });
    };
    const lastOrder = sorted.at(-1)?.order ?? 0;
    return {
      items: sorted,
      getId: (s) => s.id,
      blank: () => blankSection(lastOrder),
      create: onCreate,
      update: onUpdate,
      remove: onRemove,
      moveUp: (id) => swap(id, -1),
      moveDown: (id) => swap(id, 1),
    };
  }, [sections, onCreate, onUpdate, onRemove]);

  const enabled = controller.items.filter((s) => s.enabled).length;
  return (
    <CrudListView
      meta={{
        label: "Section",
        labelPlural: "Sections",
        publicHref: typeof publicHref === "function" ? publicHref : publicHref ? () => publicHref : undefined,
      }}
      controller={controller}
      columns={COLUMNS}
      fields={LANDING_FIELDS}
      editPath={editPath}
      description={
        controller.items.length === 0
          ? emptyHint ?? "No sections yet — click + Add to add the first one."
          : `${enabled}/${controller.items.length} sections visible`
      }
    />
  );
}

const KIND_LABEL: Record<LandingSectionKind, string> = {
  hero: "Hero",
  features: "Features",
  testimonials: "Testimonials",
  pricing: "Pricing",
  blog: "Blog",
  changelog: "Changelog",
  faq: "FAQ",
  portfolio: "Portfolio",
  services: "Services",
  stats: "Stats",
  newsletter: "Newsletter",
  cta: "CTA",
  custom: "Custom",
};

const COLUMNS: ColumnDef<LandingSection>[] = [
  { key: "title", header: "Title", width: "w-[34%]" },
  {
    key: "kind",
    header: "Kind",
    width: "w-[14%]",
    hideOnMobile: true,
    render: (v) => (
      <Badge variant="outline" className="capitalize">
        {KIND_LABEL[v as LandingSectionKind] ?? String(v)}
      </Badge>
    ),
  },
  { key: "subtitle", header: "Subtitle", width: "w-[34%]", hideOnMobile: true },
  {
    key: "order",
    header: "#",
    width: "w-[8%]",
    mono: true,
    hideOnMobile: true,
    render: (v) => String(v ?? "—").padStart(2, "0"),
  },
  {
    key: "enabled",
    header: "Visible",
    width: "w-[10%]",
    render: (v) =>
      v ? (
        <Badge variant="default" className="bg-emerald-500/20 text-emerald-300">
          on
        </Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          off
        </Badge>
      ),
  },
];

export { blankSection };
