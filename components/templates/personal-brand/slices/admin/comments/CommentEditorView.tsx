"use client";

import * as React from "react";
import { CrudFormView } from "@/components/templates/_shared/crud/CrudFormView";
import type { CrudController, EntityMeta, FieldDef } from "@/components/templates/_shared/crud/types";
import { useStore } from "../../../shared/store";
import { ADMIN_BASE } from "../../../shared/nav-config";
import type { Comment } from "../../../shared/types";

const META: EntityMeta = { label: "Comment", labelPlural: "Comments" };

export const FIELDS: FieldDef<Comment>[] = [
  { kind: "text", key: "author", label: "Author" },
  { kind: "text", key: "email", label: "Email", mono: true },
  { kind: "text", key: "postTitle", label: "On post (title)" },
  { kind: "text", key: "postId", label: "Post ID", mono: true },
  { kind: "textarea", key: "body", label: "Comment body", rows: 4 },
  {
    kind: "select",
    key: "status",
    label: "Status",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "spam", label: "Spam" },
    ],
  },
  { kind: "date", key: "ts", label: "Posted at" },
];

function useCommentsController(): CrudController<Comment> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: state.comments,
      getId: (c) => c.id,
      blank: () => ({
        id: `cmt-${Math.random().toString(36).slice(2, 10)}`,
        postId: "",
        postTitle: "",
        author: "",
        email: "",
        body: "",
        status: "pending",
        aiFlag: null,
        ts: Date.now(),
      }),
      create: (comment) => dispatch({ type: "comment.upsert", comment }),
      update: (id, patch) => {
        const cur = state.comments.find((c) => c.id === id);
        if (!cur) return;
        dispatch({ type: "comment.upsert", comment: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "comment.delete", id }),
    }),
    [state.comments, dispatch],
  );
}

export function CommentEditorView({ id }: { id: string }) {
  const controller = useCommentsController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/comments`}
    />
  );
}
