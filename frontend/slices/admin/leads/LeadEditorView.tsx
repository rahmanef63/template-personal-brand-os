"use client";

import * as React from "react";
import { CrudFormView } from "@/features/_shared/crud/CrudFormView";
import type { CrudController, EntityMeta, FieldDef } from "@/features/_shared/crud/types";
import { useStore } from "@/features/_app/store";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import type { Lead } from "@/features/_app/types";

const META: EntityMeta = { label: "Lead", labelPlural: "Leads" };

export const FIELDS: FieldDef<Lead>[] = [
  { kind: "text", key: "name", label: "Name" },
  { kind: "text", key: "email", label: "Email", mono: true },
  { kind: "text", key: "topic", label: "Topic" },
  { kind: "text", key: "source", label: "Source", placeholder: "Contact form / Lead magnet / etc." },
  { kind: "textarea", key: "message", label: "Message", rows: 4 },
  {
    kind: "select",
    key: "status",
    label: "Status",
    options: [
      { value: "new", label: "New" },
      { value: "contacted", label: "Contacted" },
      { value: "closed", label: "Closed" },
    ],
  },
  { kind: "date", key: "ts", label: "Received" },
];

function useLeadsController(): CrudController<Lead> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: state.leads,
      getId: (l) => l.id,
      blank: () => ({
        id: `lead-${Math.random().toString(36).slice(2, 10)}`,
        name: "New lead",
        email: "",
        topic: "",
        source: "Contact form",
        message: "",
        ts: Date.now(),
        status: "new",
      }),
      create: (lead) => dispatch({ type: "lead.create", lead }),
      update: (id, patch) => dispatch({ type: "lead.update", id, patch }),
      remove: (id) => dispatch({ type: "lead.delete", id }),
    }),
    [state.leads, dispatch],
  );
}

export function LeadEditorView({ id }: { id: string }) {
  const controller = useLeadsController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/leads`}
    />
  );
}
