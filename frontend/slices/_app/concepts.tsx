"use client";

import * as React from "react";
import { usePublishedPosts, usePortfolio } from "@/features/_app/store";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import type {
  ConceptCard,
  ConceptListAdapter,
} from "@/features/_shared/concepts/ConceptListPage";

/**
 * Per-template CONCEPT REGISTRY — maps a canonical concept to {data selector +
 * field map + link}, consumed by the shared ConceptListPage (default grid via
 * ConceptCardView). Adapter-only: wraps existing selectors, no schema/table/
 * state rename → zero data migration. Every template ships its own copy of this
 * file pointing at its own tables (e.g. agencyArticles), giving one consistent
 * list UI fleet-wide.
 */

export const blogAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Blog",
    title: "Tulisan",
    subtitle:
      "Esai panjang dan catatan singkat. Cari berdasarkan judul atau filter berdasarkan kategori.",
  },
  searchable: true,
  columns: 3,
  emptyText: "Tidak ada post yang cocok. Reset filter atau buat post baru di Admin.",
  hrefFor: (c) => `${PUBLIC_BASE}/blog/${c.slug}`,
  useCards: () => {
    const posts = usePublishedPosts();
    return React.useMemo<ConceptCard[]>(
      () =>
        posts.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          cover: p.cover,
          date: p.publishedAt,
          tags: [p.tag],
        })),
      [posts],
    );
  },
};

export const portfolioAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Portfolio",
    title: "Karya terpilih",
    subtitle:
      "Case study dengan struktur problem→approach→result. Pilih kategori untuk filter.",
  },
  columns: 2,
  emptyText: "Belum ada case study di kategori ini.",
  hrefFor: (c) => `${PUBLIC_BASE}/portfolio/${c.slug}`,
  useCards: () => {
    const items = usePortfolio();
    return React.useMemo<ConceptCard[]>(
      () =>
        items.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.blurb,
          cover: p.cover,
          tags: [p.category],
        })),
      [items],
    );
  },
};
