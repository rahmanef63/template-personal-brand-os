import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CatchAllRenderer } from "./catch-all-renderer";

// Custom CMS pages live in the `pages` table keyed by slug. Resolve server-side
// so unknown slugs return a real SSR 404 (better SEO than a client-only 404).
// If Convex is unreachable we defer to the client renderer (which also guards).
export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const joined = (slug ?? []).join("/");
  try {
    const page = await fetchQuery(api.pages.bySlug, { slug: joined });
    if (!page) notFound();
  } catch {
    /* Convex unreachable — let the client renderer decide */
  }
  return <CatchAllRenderer slug={joined} />;
}
