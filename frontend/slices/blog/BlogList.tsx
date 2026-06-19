"use client";

import * as React from "react";
import { Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BlogListSection,
  type BlogPost as SliceBlogPost,
} from "@/features/blog-section";
import { Reveal } from "@/features/_shared/motion";
import { usePublishedPosts } from "@/features/_app/store";
import { PUBLIC_BASE } from "@/features/_app/nav-config";

/**
 * Hybrid wrapper: filter + search chrome bespoke (single-tag chips +
 * substring search), grid delegated to canonical BlogListSection slice.
 * Admin edits propagate via createTemplateStore BroadcastChannel.
 */
export function BlogList() {
  const posts = usePublishedPosts();
  const [q, setQ] = React.useState("");
  const [tag, setTag] = React.useState<string | null>(null);

  const tags = React.useMemo(() => Array.from(new Set(posts.map((p) => p.tag))), [posts]);

  const filtered = React.useMemo(() => {
    return posts.filter((p) => {
      if (tag && p.tag !== tag) return false;
      if (q && !(p.title + " " + p.excerpt).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [posts, tag, q]);

  const items: SliceBlogPost[] = filtered.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    tags: [p.tag],
    cover: { src: p.cover, alt: p.title },
  }));

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Blog</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Tulisan</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Esai panjang dan catatan singkat. Cari berdasarkan judul atau filter berdasarkan kategori.
          </p>
        </header>
      </Reveal>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari tulisan…"
            className="pl-3"
          />
        </div>
        <Filter className="size-3.5 text-muted-foreground" />
        <Button
          variant={!tag ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setTag(null)}
        >
          All
        </Button>
        {tags.map((t) => (
          <Button
            key={t}
            variant={tag === t ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setTag(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      <Reveal delay={120}>
        {items.length === 0 ? (
          <Card className="border-dashed bg-muted/10 p-10 text-center text-sm text-muted-foreground">
            Tidak ada post yang cocok. Reset filter atau buat post baru di Admin.
          </Card>
        ) : (
          <BlogListSection
            posts={items}
            hrefFor={(p) => `${PUBLIC_BASE}/blog/${p.slug}`}
            layout="cards"
            columns={3}
            className="!p-0"
          />
        )}
      </Reveal>
    </section>
  );
}
