"use client";

import * as React from "react";
import { CrudListView } from "@/components/templates/_shared/crud/CrudListView";
import { FIELDS } from "./CommentEditorView";
import type { ColumnDef, CrudController, EntityMeta } from "@/components/templates/_shared/crud/types";
import { useStore } from "../../../shared/store";
import { ADMIN_BASE } from "../../../shared/nav-config";
import type { Comment } from "../../../shared/types";

const META: EntityMeta = { label: "Comment", labelPlural: "Comments" };

const COLUMNS: ColumnDef<Comment>[] = [
  { key: "author", header: "Author", width: "w-[18%]" },
  { key: "body", header: "Body", width: "w-[40%]" },
  { key: "postTitle", header: "On post", width: "w-[22%]" },
  { key: "status", header: "Status", width: "w-[10%]", badge: "secondary" },
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

export function CommentsView() {
  const controller = useCommentsController();
  const pending = controller.items.filter((c) => c.status === "pending").length;
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/comments/${id}`}
      description={`${pending} pending moderation`}
    />
  );
}
