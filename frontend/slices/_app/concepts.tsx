"use client";

import * as React from "react";
import { BlogListSection } from "@/features/blog-section";
import { PortfolioListSection } from "@/features/portfolio-section";
import { usePublishedPosts, usePortfolio } from "@/features/_app/store";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import type {
  ConceptCard,
  ConceptListAdapter,
} from "@/features/_shared/concepts/ConceptListPage";

/**
 * Per-template CONCEPT REGISTRY — maps a canonical concept to {data selector +
 * field map + grid renderer}, so the shared ConceptListPage works for this
 * template's real tables/fields. Adapter-only: no schema/table/state rename,
 * wraps existing selectors → zero data migration. Other templates ship their
 * own _app/concepts pointing at their own tables (e.g. agencyArticles).
 */

export const blogAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Blog",
    title: "Tulisan",
    subtitle:
      "Esai panjang dan catatan singkat. Cari berdasarkan judul atau filter berdasarkan kategori.",
  },
  searchable: true,
  emptyText: "Tidak ada post yang cocok. Reset filter atau buat post baru di Admin.",
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
  renderGrid: (cards) => (
    <BlogListSection
      posts={cards.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        excerpt: c.excerpt ?? "",
        publishedAt: c.date ?? 0,
        tags: c.tags,
        cover: { src: c.cover ?? "", alt: c.title },
      }))}
      hrefFor={(p) => `${PUBLIC_BASE}/blog/${p.slug}`}
      layout="cards"
      columns={3}
      className="!p-0"
    />
  ),
};

export const portfolioAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Portfolio",
    title: "Karya terpilih",
    subtitle:
      "Case study dengan struktur problem→approach→result. Pilih kategori untuk filter.",
  },
  emptyText: "Belum ada case study di kategori ini.",
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
  renderGrid: (cards) => (
    <PortfolioListSection
      items={cards.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        summary: c.excerpt ?? "",
        tags: c.tags,
        cover: { src: c.cover ?? "", alt: c.title },
      }))}
      hrefFor={(i) => `${PUBLIC_BASE}/portfolio/${i.slug}`}
      layout="uniform"
      columns={2}
      className="!p-0"
    />
  ),
};
