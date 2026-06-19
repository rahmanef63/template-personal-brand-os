"use client";

import { notFound } from "next/navigation";
import { BlocksRenderer } from "@/features/_shared/pages/block-renderer";
import { usePages } from "@/features/_app/store";

/**
 * Client catch-all: reads the pages slice (localStorage-hydrated) and
 * renders matching slug. System pages or unknown slugs → 404 (system
 * pages own their JSX routes; this catch-all handles only custom pages).
 */
export function CatchAllRenderer({ slug }: { slug: string }) {
  const pages = usePages();
  const page = pages.find((p) => !p.systemPage && p.slug === slug && p.status === "published");
  if (!page) notFound();
  return (
    <article>
      <BlocksRenderer blocks={page.blocks} />
    </article>
  );
}
