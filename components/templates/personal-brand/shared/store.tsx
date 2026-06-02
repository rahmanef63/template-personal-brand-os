"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  PagesProvider,
  type PagesStore,
} from "@/components/templates/_shared/pages/pages-context";
import type { PageEntry } from "@/components/templates/_shared/pages/types";
import { pagesReducer } from "@/components/templates/_shared/pages/reducer";
import {
  LandingProvider,
  type LandingStore,
} from "@/components/templates/_shared/landing/landing-context";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import { ADMIN_BASE, PUBLIC_BASE } from "./nav-config";
import type { Action, State } from "./types";

// Convex-backed store. Replaces the old localStorage reducer: `state` is
// assembled from live Convex queries; `dispatch` routes each action to the
// matching Convex mutation. Consuming components are unchanged — they still
// call useStore()/useX()/dispatch(action).
//
// id mapping: frontend objects key by `id` (string); Convex keys by `_id`.
// On read we map `_id` -> `id`. On upsert we pass `id` only when it's a known
// Convex id (existing row); a fresh nid -> insert.

type Ctx = { state: State; dispatch: (a: Action) => void; ready: boolean; progress: number };
const StoreCtx = React.createContext<Ctx | null>(null);

const withId = <T,>(rows: ReadonlyArray<Record<string, unknown>> | undefined): T[] =>
  ((rows ?? []) as Array<Record<string, unknown>>).map((r) => ({ ...r, id: r._id })) as T[];

function Provider({ children }: { children: React.ReactNode }) {
  const posts = useQuery(api.posts.listAll);
  const portfolio = useQuery(api.portfolio.list, {});
  const services = useQuery(api.services.list);
  const resources = useQuery(api.resources.list);
  const leads = useQuery(api.leads.list, {});
  const comments = useQuery(api.storeExtra.commentsListAll, {});
  const subscribers = useQuery(api.subscribers.list, {});
  const chatRows = useQuery(api.chat.listSessions, {});
  const pageRows = useQuery(api.pages.list, {});
  const landingRows = useQuery(api.landing.list, {});

  const ready =
    posts !== undefined &&
    portfolio !== undefined &&
    services !== undefined &&
    resources !== undefined &&
    leads !== undefined &&
    comments !== undefined &&
    subscribers !== undefined &&
    chatRows !== undefined &&
    pageRows !== undefined &&
    landingRows !== undefined;

  // 0–100 load progress for the splash loader.
  const progress = Math.round(
    ([posts, portfolio, services, resources, leads, comments, subscribers, chatRows, pageRows, landingRows]
      .filter((q) => q !== undefined).length /
      10) *
      100,
  );

  const state = React.useMemo<State>(
    () => ({
      posts: withId(posts),
      portfolio: withId(portfolio),
      services: withId(services),
      resources: withId(resources),
      leads: withId(leads),
      comments: withId(comments),
      subscribers: withId(subscribers),
      chatSessions: ((chatRows ?? []) as Array<Record<string, unknown>>).map((r) => ({
        id: r._id as string,
        visitorId: r.visitorId as string,
        startedAt: r.startedAt as number,
        flagged: r.flagged as boolean,
        messages: [],
      })),
      pages: (pageRows ?? []) as PageEntry[],
      landingSections: (landingRows ?? []) as LandingSection[],
    }),
    [posts, portfolio, services, resources, leads, comments, subscribers, chatRows, pageRows, landingRows],
  );

  // ---- mutations ----
  const mPostUpsert = useMutation(api.posts.upsert);
  const mPostRemove = useMutation(api.posts.remove);
  const mPostView = useMutation(api.posts.incrementView);
  const mPortUpsert = useMutation(api.portfolio.upsert);
  const mPortRemove = useMutation(api.portfolio.remove);
  const mSvcUpsert = useMutation(api.services.upsert);
  const mSvcRemove = useMutation(api.services.remove);
  const mResUpsert = useMutation(api.resources.upsert);
  const mResRemove = useMutation(api.resources.remove);
  const mResDownload = useMutation(api.resources.incrementDownload);
  const mLeadCreate = useMutation(api.leads.create);
  const mLeadUpdate = useMutation(api.leads.update);
  const mLeadRemove = useMutation(api.leads.remove);
  const mCommentCreate = useMutation(api.comments.create);
  const mCommentModerate = useMutation(api.comments.moderate);
  const mCommentUpsert = useMutation(api.storeExtra.commentUpsert);
  const mCommentRemove = useMutation(api.storeExtra.commentRemove);
  const mSubSubscribe = useMutation(api.subscribers.subscribe);
  const mSubConfirm = useMutation(api.subscribers.confirm);
  const mSubUnsub = useMutation(api.subscribers.unsubscribe);
  const mSubUpsert = useMutation(api.storeExtra.subscriberUpsert);
  const mSubRemove = useMutation(api.storeExtra.subscriberRemove);
  const mChatStart = useMutation(api.chat.startSession);
  const mChatSend = useMutation(api.chat.sendMessage);
  const mChatUpsert = useMutation(api.storeExtra.chatUpsertSession);
  const mChatRemove = useMutation(api.storeExtra.chatRemoveSession);
  const mPageUpsert = useMutation(api.pages.upsert);
  const mPageRemove = useMutation(api.pages.remove);
  const mLandingUpsert = useMutation(api.landing.upsert);
  const mLandingRemove = useMutation(api.landing.remove);

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

  const dispatch = React.useCallback(
    (action: Action) => {
      const fail = (e: unknown) => console.error(`[store] ${action.type} failed`, e);
      switch (action.type) {
        case "post.upsert": {
          const { id, views: _views, ...d } = action.post;
          void (knownIds.posts.has(id)
            ? mPostUpsert({ id: id as Id<"posts">, ...d })
            : mPostUpsert(d)
          ).catch(fail);
          break;
        }
        case "post.delete":
          void mPostRemove({ id: action.id as Id<"posts"> }).catch(fail);
          break;
        case "post.view":
          void mPostView({ id: action.id as Id<"posts"> }).catch(fail);
          break;
        case "portfolio.upsert": {
          const { id, ...d } = action.item;
          void (knownIds.portfolio.has(id)
            ? mPortUpsert({ id: id as Id<"portfolio">, ...d })
            : mPortUpsert(d)
          ).catch(fail);
          break;
        }
        case "portfolio.delete":
          void mPortRemove({ id: action.id as Id<"portfolio"> }).catch(fail);
          break;
        case "service.upsert": {
          const { id, ...d } = action.svc;
          void (knownIds.services.has(id)
            ? mSvcUpsert({ id: id as Id<"services">, ...d })
            : mSvcUpsert(d)
          ).catch(fail);
          break;
        }
        case "service.delete":
          void mSvcRemove({ id: action.id as Id<"services"> }).catch(fail);
          break;
        case "resource.upsert": {
          const { id, downloads: _dl, ...d } = action.res;
          void (knownIds.resources.has(id)
            ? mResUpsert({ id: id as Id<"resources">, ...d })
            : mResUpsert(d)
          ).catch(fail);
          break;
        }
        case "resource.delete":
          void mResRemove({ id: action.id as Id<"resources"> }).catch(fail);
          break;
        case "resource.download":
          void mResDownload({ id: action.id as Id<"resources"> }).catch(fail);
          break;
        case "lead.create": {
          const { name, email, topic, source, message } = action.lead;
          void mLeadCreate({ name, email, topic, source, message }).catch(fail);
          break;
        }
        case "lead.update":
          void mLeadUpdate({
            id: action.id as Id<"leads">,
            status: action.patch.status,
            topic: action.patch.topic,
          }).catch(fail);
          break;
        case "lead.delete":
          void mLeadRemove({ id: action.id as Id<"leads"> }).catch(fail);
          break;
        case "comment.create": {
          const c = action.comment;
          void mCommentCreate({
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
            ? mCommentUpsert({ id: c.id as Id<"comments">, ...base })
            : mCommentUpsert(base)
          ).catch(fail);
          break;
        }
        case "comment.moderate":
          void mCommentModerate({ id: action.id as Id<"comments">, status: action.status }).catch(fail);
          break;
        case "comment.delete":
          void mCommentRemove({ id: action.id as Id<"comments"> }).catch(fail);
          break;
        case "subscriber.create":
          void mSubSubscribe({ email: action.sub.email, source: action.sub.source }).catch(fail);
          break;
        case "subscriber.upsert": {
          const s = action.sub;
          const base = { email: s.email, status: s.status, source: s.source, ts: s.ts };
          void (knownIds.subscribers.has(s.id)
            ? mSubUpsert({ id: s.id as Id<"subscribers">, ...base })
            : mSubUpsert(base)
          ).catch(fail);
          break;
        }
        case "subscriber.confirm":
          void mSubConfirm({ id: action.id as Id<"subscribers"> }).catch(fail);
          break;
        case "subscriber.unsubscribe":
          void mSubUnsub({ id: action.id as Id<"subscribers"> }).catch(fail);
          break;
        case "subscriber.delete":
          void mSubRemove({ id: action.id as Id<"subscribers"> }).catch(fail);
          break;
        case "chat.session.start":
          void mChatStart({ visitorId: action.session.visitorId }).catch(fail);
          break;
        case "chat.session.upsert": {
          const s = action.session;
          const base = { visitorId: s.visitorId, startedAt: s.startedAt, flagged: s.flagged };
          void (knownIds.chat.has(s.id)
            ? mChatUpsert({ id: s.id as Id<"chatSessions">, ...base })
            : mChatUpsert(base)
          ).catch(fail);
          break;
        }
        case "chat.session.delete":
          void mChatRemove({ id: action.id as Id<"chatSessions"> }).catch(fail);
          break;
        case "chat.message":
          void mChatSend({
            sessionId: action.sessionId as Id<"chatSessions">,
            role: action.msg.role,
            content: action.msg.content,
            flag: action.flag,
          }).catch(fail);
          break;
        case "PAGE_DELETE":
          void mPageRemove({ entryId: action.payload.id }).catch(fail);
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
          if (entry) void mPageUpsert({ entryId: entry.id, slug: entry.slug, data: entry }).catch(fail);
          break;
        }
        case "LANDING_UPSERT": {
          const s = action.payload as LandingSection;
          void mLandingUpsert({ sectionId: s.id, data: s }).catch(fail);
          break;
        }
        case "LANDING_DELETE":
          void mLandingRemove({ sectionId: (action.payload as { id: string }).id }).catch(fail);
          break;
        case "hydrate":
        case "reset":
          // Convex is the source of truth — no-op.
          break;
      }
    },
    // mutations + knownIds + state.pages are stable enough; include knownIds/state
    [knownIds, state.pages], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const value = React.useMemo<Ctx>(
    () => ({ state, dispatch, ready, progress }),
    [state, dispatch, ready, progress],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function useStore() {
  const c = React.useContext(StoreCtx);
  if (!c) throw new Error("useStore must be inside <StoreProvider>");
  return c;
}

function PagesAdapter({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const value = React.useMemo<PagesStore>(
    () => ({
      pages: state.pages,
      create: (entry: PageEntry) => dispatch({ type: "PAGE_CREATE", payload: entry }),
      update: (id, patch) => dispatch({ type: "PAGE_UPDATE", payload: { id, patch } }),
      remove: (id: string) => dispatch({ type: "PAGE_DELETE", payload: { id } }),
      reorderBlock: (id, from, to) =>
        dispatch({ type: "PAGE_REORDER_BLOCK", payload: { id, from, to } }),
      upsertSection: (pageId, section) =>
        dispatch({ type: "PAGE_SECTION_UPSERT", payload: { pageId, section } }),
      removeSection: (pageId, sectionId) =>
        dispatch({ type: "PAGE_SECTION_DELETE", payload: { pageId, sectionId } }),
    }),
    [state.pages, dispatch],
  );
  return <PagesProvider value={value}>{children}</PagesProvider>;
}

function LandingAdapter({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const value = React.useMemo<LandingStore>(
    () => ({
      items: state.landingSections,
      publicBase: PUBLIC_BASE,
      adminBase: ADMIN_BASE,
      create: (section: LandingSection) => dispatch({ type: "LANDING_UPSERT", payload: section }),
      update: (id, patch) => {
        const current = state.landingSections.find((s) => s.id === id);
        if (!current) return;
        dispatch({ type: "LANDING_UPSERT", payload: { ...current, ...patch, id } });
      },
      remove: (id: string) => dispatch({ type: "LANDING_DELETE", payload: { id } }),
    }),
    [state.landingSections, dispatch],
  );
  return <LandingProvider value={value}>{children}</LandingProvider>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <PagesAdapter>
        <LandingAdapter>{children}</LandingAdapter>
      </PagesAdapter>
    </Provider>
  );
}

export { useStore };

// Convenience derived selectors (unchanged API).
export function usePosts() {
  return useStore().state.posts;
}
export function usePublishedPosts() {
  const { state } = useStore();
  return React.useMemo(
    () =>
      state.posts
        .filter((p) => p.status === "published")
        .sort((a, b) => b.publishedAt - a.publishedAt),
    [state.posts],
  );
}
export function usePost(slug: string) {
  return useStore().state.posts.find((p) => p.slug === slug) ?? null;
}
export function usePortfolio() {
  return useStore().state.portfolio;
}
export function usePortfolioItem(slug: string) {
  return useStore().state.portfolio.find((p) => p.slug === slug) ?? null;
}
export function useServices() {
  return useStore().state.services;
}
export function useResources() {
  return useStore().state.resources;
}
export function useLeads() {
  return useStore().state.leads;
}
export function useComments() {
  return useStore().state.comments;
}
export function usePostComments(postId: string) {
  const { state } = useStore();
  return state.comments.filter((c) => c.postId === postId && c.status === "approved");
}
export function useSubscribers() {
  return useStore().state.subscribers;
}
export function useChatSessions() {
  return useStore().state.chatSessions;
}
export const usePages = () => useStore().state.pages;
export const useLandingSections = () => useStore().state.landingSections;

// Re-export shared utils so existing T1 imports keep working.
export { nid, slugify, fmtDate, rel } from "@/components/templates/_shared/utils";

// Naive AI moderation flag — used by comment form (T1-specific business logic).
export function aiFlag(body: string): "spam" | "toxic" | null {
  const lower = body.toLowerCase();
  if (/(buy|cheap|http|https|crypto|loan|viagra|followers)/.test(lower)) return "spam";
  if (/(idiot|stupid|hate you|moron)/.test(lower)) return "toxic";
  return null;
}
