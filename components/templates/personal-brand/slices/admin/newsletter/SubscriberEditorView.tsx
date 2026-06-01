"use client";

import * as React from "react";
import { CrudFormView } from "@/components/templates/_shared/crud/CrudFormView";
import type { CrudController, EntityMeta, FieldDef } from "@/components/templates/_shared/crud/types";
import { useStore } from "../../../shared/store";
import { ADMIN_BASE } from "../../../shared/nav-config";
import type { Subscriber } from "../../../shared/types";

const META: EntityMeta = { label: "Subscriber", labelPlural: "Subscribers" };

export const FIELDS: FieldDef<Subscriber>[] = [
  { kind: "text", key: "email", label: "Email", mono: true },
  {
    kind: "select",
    key: "status",
    label: "Status",
    options: [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "unsubscribed", label: "Unsubscribed" },
    ],
  },
  { kind: "text", key: "source", label: "Source", placeholder: "footer / lead-magnet / post:<slug>" },
  { kind: "date", key: "ts", label: "Subscribed at" },
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

export function SubscriberEditorView({ id }: { id: string }) {
  const controller = useSubscribersController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/newsletter`}
    />
  );
}
