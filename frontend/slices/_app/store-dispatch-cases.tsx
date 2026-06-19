"use client";

import { pagesReducer } from "@/features/_shared/pages/reducer";
import type { LandingSection } from "@/features/_shared/landing/types";
import type { Id } from "@/convex/_generated/dataModel";
import type { KnownIds, StoreMutations } from "./store-dispatch";
import type { Action, State } from "./types";

// Site-domain dispatch cases (lead/comment/subscriber/chat/pages/landing),
// moved verbatim from store.tsx. Called from useConvexDispatch in
// store-dispatch.tsx alongside dispatchContentAction; the two switches handle
// disjoint action types.

export function dispatchSiteAction(
  action: Action,
  state: State,
  m: StoreMutations,
  knownIds: KnownIds,
  fail: (e: unknown) => void,
) {
  switch (action.type) {
    case "lead.create": {
      const { name, email, topic, source, message } = action.lead;
      void m.mLeadCreate({ name, email, topic, source, message }).catch(fail);
      break;
    }
    case "lead.update":
      void m.mLeadUpdate({
        id: action.id as Id<"leads">,
        status: action.patch.status,
        topic: action.patch.topic,
      }).catch(fail);
      break;
    case "lead.delete":
      void m.mLeadRemove({ id: action.id as Id<"leads"> }).catch(fail);
      break;
    case "comment.create": {
      const c = action.comment;
      void m.mCommentCreate({
        postId: c.postId as Id<"posts">,
        postTitle: c.postTitle,
        author: c.author,
        email: c.email,
        body: c.body,
        aiFlag: c.aiFlag,
      }).catch(fail);
      break;
    }
    case "comment.upsert": {
      const c = action.comment;
      const base = {
        postId: c.postId as Id<"posts">,
        postTitle: c.postTitle,
        author: c.author,
        email: c.email,
        body: c.body,
        status: c.status,
        aiFlag: c.aiFlag,
        ts: c.ts,
      };
      void (knownIds.comments.has(c.id)
        ? m.mCommentUpsert({ id: c.id as Id<"comments">, ...base })
        : m.mCommentUpsert(base)
      ).catch(fail);
      break;
    }
    case "comment.moderate":
      void m.mCommentModerate({ id: action.id as Id<"comments">, status: action.status }).catch(fail);
      break;
    case "comment.delete":
      void m.mCommentRemove({ id: action.id as Id<"comments"> }).catch(fail);
      break;
    case "subscriber.create":
      void m.mSubSubscribe({ email: action.sub.email, source: action.sub.source }).catch(fail);
      break;
    case "subscriber.upsert": {
      const s = action.sub;
      const base = { email: s.email, status: s.status, source: s.source, ts: s.ts };
      void (knownIds.subscribers.has(s.id)
        ? m.mSubUpsert({ id: s.id as Id<"subscribers">, ...base })
        : m.mSubUpsert(base)
      ).catch(fail);
      break;
    }
    case "subscriber.confirm":
      void m.mSubConfirm({ id: action.id as Id<"subscribers"> }).catch(fail);
      break;
    case "subscriber.unsubscribe":
      void m.mSubUnsub({ id: action.id as Id<"subscribers"> }).catch(fail);
      break;
    case "subscriber.delete":
      void m.mSubRemove({ id: action.id as Id<"subscribers"> }).catch(fail);
      break;
    case "chat.session.start":
      void m.mChatStart({ visitorId: action.session.visitorId }).catch(fail);
      break;
    case "chat.session.upsert": {
      const s = action.session;
      const base = { visitorId: s.visitorId, startedAt: s.startedAt, flagged: s.flagged };
      void (knownIds.chat.has(s.id)
        ? m.mChatUpsert({ id: s.id as Id<"chatSessions">, ...base })
        : m.mChatUpsert(base)
      ).catch(fail);
      break;
    }
    case "chat.session.delete":
      void m.mChatRemove({ id: action.id as Id<"chatSessions"> }).catch(fail);
      break;
    case "chat.message":
      void m.mChatSend({
        sessionId: action.sessionId as Id<"chatSessions">,
        role: action.msg.role,
        content: action.msg.content,
        flag: action.flag,
      }).catch(fail);
      break;
    case "PAGE_DELETE":
      void m.mPageRemove({ entryId: action.payload.id }).catch(fail);
      break;
    case "PAGE_CREATE":
    case "PAGE_UPDATE":
    case "PAGE_REORDER_BLOCK":
    case "PAGE_SECTION_UPSERT":
    case "PAGE_SECTION_DELETE": {
      const next = pagesReducer({ pages: state.pages }, action);
      const pid =
        (action.payload as { id?: string; pageId?: string }).id ??
        (action.payload as { pageId?: string }).pageId;
      const entry = next.pages.find((p) => p.id === pid);
      if (entry) void m.mPageUpsert({ entryId: entry.id, slug: entry.slug, data: entry }).catch(fail);
      break;
    }
    case "LANDING_UPSERT": {
      const s = action.payload as LandingSection;
      void m.mLandingUpsert({ sectionId: s.id, data: s }).catch(fail);
      break;
    }
    case "LANDING_DELETE":
      void m.mLandingRemove({ sectionId: (action.payload as { id: string }).id }).catch(fail);
      break;
    case "hydrate":
    case "reset":
      // Convex is the source of truth — no-op.
      break;
  }
}
