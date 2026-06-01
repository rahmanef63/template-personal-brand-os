"use client";

import * as React from "react";
import { CrudFormView } from "@/components/templates/_shared/crud/CrudFormView";
import type { CrudController, EntityMeta, FieldDef } from "@/components/templates/_shared/crud/types";
import { useStore } from "../../../shared/store";
import { ADMIN_BASE } from "../../../shared/nav-config";
import type { ChatSession } from "../../../shared/types";

const META: EntityMeta = { label: "Session", labelPlural: "Chat Sessions" };

export const FIELDS: FieldDef<ChatSession>[] = [
  { kind: "text", key: "visitorId", label: "Visitor ID", mono: true },
  { kind: "date", key: "startedAt", label: "Started at" },
  { kind: "switch", key: "flagged", label: "Flagged for review" },
];

function useChatSessionsController(): CrudController<ChatSession> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: state.chatSessions,
      getId: (s) => s.id,
      blank: () => ({
        id: `chat-${Math.random().toString(36).slice(2, 10)}`,
        visitorId: `visitor-${Math.random().toString(36).slice(2, 6)}`,
        startedAt: Date.now(),
        flagged: false,
        messages: [],
      }),
      create: (session) => dispatch({ type: "chat.session.upsert", session }),
      update: (id, patch) => {
        const cur = state.chatSessions.find((s) => s.id === id);
        if (!cur) return;
        dispatch({ type: "chat.session.upsert", session: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "chat.session.delete", id }),
    }),
    [state.chatSessions, dispatch],
  );
}

export function ChatSessionEditorView({ id }: { id: string }) {
  const controller = useChatSessionsController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/chatbot`}
    />
  );
}
