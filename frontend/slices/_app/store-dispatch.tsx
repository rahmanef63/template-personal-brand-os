"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { dispatchSiteAction } from "./store-dispatch-cases";
import type { Action, State } from "./types";

// Dispatch wiring, split out of store.tsx (move-only): routes each store
// action to the matching Convex mutation. `id` is passed to upsert only when
// it's a known Convex id (existing row); a fresh nid -> insert.
//
// The action switch is split by domain to stay under the 200-LOC convention:
// content cases (post/portfolio/service/resource) live here in
// dispatchContentAction; site cases (lead/comment/subscriber/chat/pages/
// landing) live in store-dispatch-cases.tsx. Action types are disjoint
// between the two switches, so calling both equals the original single switch.

/** All Convex mutations the store dispatches to (moved verbatim from store.tsx). */
function useStoreMutations() {
  return {
    mPostUpsert: useMutation(api.posts.upsert),
    mPostRemove: useMutation(api.posts.remove),
    mPostView: useMutation(api.posts.incrementView),
    mPortUpsert: useMutation(api.portfolio.upsert),
    mPortRemove: useMutation(api.portfolio.remove),
    mSvcUpsert: useMutation(api.services.upsert),
    mSvcRemove: useMutation(api.services.remove),
    mResUpsert: useMutation(api.resources.upsert),
    mResRemove: useMutation(api.resources.remove),
    mResDownload: useMutation(api.resources.incrementDownload),
    mLeadCreate: useMutation(api.leads.create),
    mLeadUpdate: useMutation(api.leads.update),
    mLeadRemove: useMutation(api.leads.remove),
    mCommentCreate: useMutation(api.comments.create),
    mCommentModerate: useMutation(api.comments.moderate),
    mCommentUpsert: useMutation(api.storeExtra.commentUpsert),
    mCommentRemove: useMutation(api.storeExtra.commentRemove),
    mSubSubscribe: useMutation(api.subscribers.subscribe),
    mSubConfirm: useMutation(api.subscribers.confirm),
    mSubUnsub: useMutation(api.subscribers.unsubscribe),
    mSubUpsert: useMutation(api.storeExtra.subscriberUpsert),
    mSubRemove: useMutation(api.storeExtra.subscriberRemove),
    mChatStart: useMutation(api.chat.startSession),
    mChatSend: useMutation(api.chat.sendMessage),
    mChatUpsert: useMutation(api.storeExtra.chatUpsertSession),
    mChatRemove: useMutation(api.storeExtra.chatRemoveSession),
    mPageUpsert: useMutation(api.pages.upsert),
    mPageRemove: useMutation(api.pages.remove),
    mLandingUpsert: useMutation(api.landing.upsert),
    mLandingRemove: useMutation(api.landing.remove),
  };
}

export type StoreMutations = ReturnType<typeof useStoreMutations>;

export type KnownIds = {
  posts: Set<string>;
  portfolio: Set<string>;
  services: Set<string>;
  resources: Set<string>;
  comments: Set<string>;
  subscribers: Set<string>;
  chat: Set<string>;
};

export function useConvexDispatch(state: State): (a: Action) => void {
  const m = useStoreMutations();

  const knownIds = React.useMemo(
    () => ({
      posts: new Set(state.posts.map((p) => p.id)),
      portfolio: new Set(state.portfolio.map((p) => p.id)),
      services: new Set(state.services.map((s) => s.id)),
      resources: new Set(state.resources.map((r) => r.id)),
      comments: new Set(state.comments.map((c) => c.id)),
      subscribers: new Set(state.subscribers.map((s) => s.id)),
      chat: new Set(state.chatSessions.map((s) => s.id)),
    }),
    [state],
  );

  return React.useCallback(
    (action: Action) => {
      const fail = (e: unknown) => console.error(`[store] ${action.type} failed`, e);
      dispatchContentAction(action, m, knownIds, fail);
      dispatchSiteAction(action, state, m, knownIds, fail);
    },
    // mutations + knownIds + state.pages are stable enough; include knownIds/state
    [knownIds, state.pages], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

function dispatchContentAction(
  action: Action,
  m: StoreMutations,
  knownIds: KnownIds,
  fail: (e: unknown) => void,
) {
  switch (action.type) {
    case "post.upsert": {
      const { id, views: _views, ...d } = action.post;
      void (knownIds.posts.has(id)
        ? m.mPostUpsert({ id: id as Id<"posts">, ...d })
        : m.mPostUpsert(d)
      ).catch(fail);
      break;
    }
    case "post.delete":
      void m.mPostRemove({ id: action.id as Id<"posts"> }).catch(fail);
      break;
    case "post.view":
      void m.mPostView({ id: action.id as Id<"posts"> }).catch(fail);
      break;
    case "portfolio.upsert": {
      const { id, ...d } = action.item;
      void (knownIds.portfolio.has(id)
        ? m.mPortUpsert({ id: id as Id<"portfolio">, ...d })
        : m.mPortUpsert(d)
      ).catch(fail);
      break;
    }
    case "portfolio.delete":
      void m.mPortRemove({ id: action.id as Id<"portfolio"> }).catch(fail);
      break;
    case "service.upsert": {
      const { id, ...d } = action.svc;
      void (knownIds.services.has(id)
        ? m.mSvcUpsert({ id: id as Id<"services">, ...d })
        : m.mSvcUpsert(d)
      ).catch(fail);
      break;
    }
    case "service.delete":
      void m.mSvcRemove({ id: action.id as Id<"services"> }).catch(fail);
      break;
    case "resource.upsert": {
      const { id, downloads: _dl, ...d } = action.res;
      void (knownIds.resources.has(id)
        ? m.mResUpsert({ id: id as Id<"resources">, ...d })
        : m.mResUpsert(d)
      ).catch(fail);
      break;
    }
    case "resource.delete":
      void m.mResRemove({ id: action.id as Id<"resources"> }).catch(fail);
      break;
    case "resource.download":
      void m.mResDownload({ id: action.id as Id<"resources"> }).catch(fail);
      break;
  }
}
