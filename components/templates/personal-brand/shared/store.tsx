"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  PagesProvider,
  type PagesStore,
} from "@/components/templates/_shared/pages/pages-context";
import type { PageEntry } from "@/components/templates/_shared/pages/types";
import {
  LandingProvider,
  type LandingStore,
} from "@/components/templates/_shared/landing/landing-context";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import { ADMIN_BASE, PUBLIC_BASE } from "./nav-config";
import { StoreCtx, useStore, type Ctx } from "./store-context";
import { useConvexDispatch } from "./store-dispatch";
import type { State } from "./types";

// Convex-backed store. Replaces the old localStorage reducer: `state` is
// assembled from live Convex queries; `dispatch` routes each action to the
// matching Convex mutation (see store-dispatch.tsx). Consuming components are
// unchanged — they still call useStore()/useX()/dispatch(action).
//
// id mapping: frontend objects key by `id` (string); Convex keys by `_id`.
// On read we map `_id` -> `id`. On upsert we pass `id` only when it's a known
// Convex id (existing row); a fresh nid -> insert.

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

  const dispatch = useConvexDispatch(state);

  const value = React.useMemo<Ctx>(
    () => ({ state, dispatch, ready, progress }),
    [state, dispatch, ready, progress],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
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
export function usePosts() { return useStore().state.posts; }
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
export function usePortfolio() { return useStore().state.portfolio; }
export function usePortfolioItem(slug: string) {
  return useStore().state.portfolio.find((p) => p.slug === slug) ?? null;
}
export function useServices() { return useStore().state.services; }
export function useResources() { return useStore().state.resources; }
export function useLeads() { return useStore().state.leads; }
export function useComments() { return useStore().state.comments; }
export function usePostComments(postId: string) {
  const { state } = useStore();
  return state.comments.filter((c) => c.postId === postId && c.status === "approved");
}
export function useSubscribers() { return useStore().state.subscribers; }
export function useChatSessions() { return useStore().state.chatSessions; }
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
