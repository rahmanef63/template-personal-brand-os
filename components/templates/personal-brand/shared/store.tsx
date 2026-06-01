"use client";

import * as React from "react";
import { createTemplateStore } from "@/components/templates/_shared/hooks/create-template-store";
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
import type { Action, State } from "./types";
import { SEED_STATE } from "./seed";
import { reducer } from "./store-reducer";

const { Provider, useStore } = createTemplateStore<State, Action>({
  // AE-wave: hero/blog/portfolio/services/etc seeded with template-specific
  // copy so admin Hero edits are visible from first load.
  storageKey: "pbos:state:v7-simple",
  channel: "pbos:sync",
  seed: SEED_STATE,
  reducer,
});

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
      upsertSection: (pageId, section) => dispatch({ type: "PAGE_SECTION_UPSERT", payload: { pageId, section } }),
      removeSection: (pageId, sectionId) => dispatch({ type: "PAGE_SECTION_DELETE", payload: { pageId, sectionId } }),
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
      create: (section: LandingSection) =>
        dispatch({ type: "LANDING_UPSERT", payload: section }),
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

// Convenience derived selectors.

export function usePosts() {
  const { state } = useStore();
  return state.posts;
}
export function usePublishedPosts() {
  const { state } = useStore();
  return React.useMemo(
    () => state.posts.filter((p) => p.status === "published").sort((a, b) => b.publishedAt - a.publishedAt),
    [state.posts],
  );
}
export function usePost(slug: string) {
  const { state } = useStore();
  return state.posts.find((p) => p.slug === slug) ?? null;
}
export function usePortfolio() {
  const { state } = useStore();
  return state.portfolio;
}
export function usePortfolioItem(slug: string) {
  const { state } = useStore();
  return state.portfolio.find((p) => p.slug === slug) ?? null;
}
export function useServices() {
  const { state } = useStore();
  return state.services;
}
export function useResources() {
  const { state } = useStore();
  return state.resources;
}
export function useLeads() {
  const { state } = useStore();
  return state.leads;
}
export function useComments() {
  const { state } = useStore();
  return state.comments;
}
export function usePostComments(postId: string) {
  const { state } = useStore();
  return state.comments.filter((c) => c.postId === postId && c.status === "approved");
}
export function useSubscribers() {
  const { state } = useStore();
  return state.subscribers;
}
export function useChatSessions() {
  const { state } = useStore();
  return state.chatSessions;
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
