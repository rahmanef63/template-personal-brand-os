"use client";

import * as React from "react";
import { CrudListView } from "@/components/templates/_shared/crud/CrudListView";
import { FIELDS } from "./ChatSessionEditorView";
import type { ColumnDef, CrudController, EntityMeta } from "@/components/templates/_shared/crud/types";
import { useStore } from "../../../shared/store";
import { ADMIN_BASE } from "../../../shared/nav-config";
import type { ChatSession } from "../../../shared/types";

const META: EntityMeta = { label: "Session", labelPlural: "Chat Sessions" };

const COLUMNS: ColumnDef<ChatSession>[] = [
  { key: "visitorId", header: "Visitor", width: "w-[22%]", mono: true },
  {
    key: "messages",
    header: "Messages",
    width: "w-[14%]",
    render: (v) => (Array.isArray(v) ? v.length : 0),
  },
  {
    key: "messages",
    header: "Latest",
    width: "w-[36%]",
    render: (v) => {
      const arr = Array.isArray(v) ? (v as { content?: string }[]) : [];
      const last = arr[arr.length - 1];
      return last?.content ?? "(empty)";
    },
  },
  { key: "flagged", header: "Flagged", width: "w-[14%]", badge: "outline" },
  {
    key: "startedAt",
    header: "Started",
    width: "w-[14%]",
    render: (v) => new Date(Number(v ?? 0)).toLocaleDateString(),
  },
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

export function ChatbotAdminView() {
  const controller = useChatSessionsController();
  const flagged = controller.items.filter((s) => s.flagged).length;
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/chatbot/${id}`}
      description={`${flagged} flagged`}
    />
  );
}
