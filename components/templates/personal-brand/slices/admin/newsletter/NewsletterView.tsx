"use client";

import * as React from "react";
import { CrudListView } from "@/components/templates/_shared/crud/CrudListView";
import { FIELDS } from "./SubscriberEditorView";
import type { ColumnDef, CrudController, EntityMeta } from "@/components/templates/_shared/crud/types";
import { useStore } from "../../../shared/store";
import { ADMIN_BASE } from "../../../shared/nav-config";
import type { Subscriber } from "../../../shared/types";

const META: EntityMeta = { label: "Subscriber", labelPlural: "Subscribers" };

const COLUMNS: ColumnDef<Subscriber>[] = [
  { key: "email", header: "Email", width: "w-[40%]", mono: true },
  { key: "status", header: "Status", width: "w-[16%]", badge: "secondary" },
  { key: "source", header: "Source", width: "w-[20%]", badge: "outline" },
  {
    key: "ts",
    header: "Subscribed",
    width: "w-[14%]",
    render: (v) => new Date(Number(v ?? 0)).toLocaleDateString(),
  },
];

function useSubscribersController(): CrudController<Subscriber> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: state.subscribers,
      getId: (s) => s.id,
      blank: () => ({
        id: `sub-${Math.random().toString(36).slice(2, 10)}`,
        email: "",
        status: "pending",
        source: "footer",
        ts: Date.now(),
      }),
      create: (sub) => dispatch({ type: "subscriber.upsert", sub }),
      update: (id, patch) => {
        const cur = state.subscribers.find((s) => s.id === id);
        if (!cur) return;
        dispatch({ type: "subscriber.upsert", sub: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "subscriber.delete", id }),
    }),
    [state.subscribers, dispatch],
  );
}

export function NewsletterView() {
  const controller = useSubscribersController();
  const confirmed = controller.items.filter((s) => s.status === "confirmed").length;
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/newsletter/${id}`}
      description={`${confirmed} confirmed`}
    />
  );
}
