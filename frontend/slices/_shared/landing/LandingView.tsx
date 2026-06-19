"use client";

import * as React from "react";
import { CrudListView } from "@/features/_shared/crud/CrudListView";
import { Badge } from "@/components/ui/badge";
import type {
  ColumnDef,
  CrudController,
  EntityMeta,
} from "@/features/_shared/crud/types";
import { useLandingStore } from "./landing-context";
import { blankSection } from "./LandingEditorView";
import { LANDING_FIELDS } from "./landing-fields";
import type { LandingSection } from "./types";

const META: EntityMeta = {
  label: "Section",
  labelPlural: "Landing sections",
};

const KIND_LABEL: Record<LandingSection["kind"], string> = {
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
        {KIND_LABEL[v as LandingSection["kind"]] ?? String(v)}
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

export function LandingView() {
  const store = useLandingStore();
  const controller = React.useMemo<CrudController<LandingSection>>(() => {
    const sorted = [...store.items].sort((a, b) => a.order - b.order);
    const swap = (id: string, delta: -1 | 1) => {
      const idx = sorted.findIndex((s) => s.id === id);
      if (idx < 0) return;
      const next = idx + delta;
      if (next < 0 || next >= sorted.length) return;
      const a = sorted[idx];
      const b = sorted[next];
      store.update(a.id, { order: b.order });
      store.update(b.id, { order: a.order });
    };
    const lastOrder = sorted.at(-1)?.order ?? 0;
    return {
      items: sorted,
      getId: (s) => s.id,
      blank: () => blankSection(lastOrder),
      create: store.create,
      update: store.update,
      remove: store.remove,
      moveUp: (id) => swap(id, -1),
      moveDown: (id) => swap(id, 1),
    };
  }, [store]);
  const enabled = controller.items.filter((s) => s.enabled).length;
  return (
    <CrudListView
      meta={{
        ...META,
        publicHref: () => store.publicBase,
      }}
      controller={controller}
      columns={COLUMNS}
      fields={LANDING_FIELDS}
      editPath={(id) => `${store.adminBase}/landing/${id}`}
      description={`${enabled}/${controller.items.length} sections visible`}
    />
  );
}
