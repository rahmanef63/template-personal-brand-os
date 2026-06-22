import { notFound } from "next/navigation";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { DEFAULT_CONFIG } from "@/components/blocks/registry";

// Dedicated pages from the shared PageConfig (e.g. /services), rendered under
// /blocks/<slug>. They share DEFAULT_CONFIG.collections with the home showcase,
// so a landing preview block and a page's full block render from one source.
// Synced verbatim from templates-portal alongside components/blocks — do not edit
// here; edit in the portal and re-sync.
const pages = DEFAULT_CONFIG.pages ?? [];
const slugOf = (path: string) => path.replace(/^\/+/, "") || "home";

export function generateStaticParams() {
  return pages.map((p) => ({ page: slugOf(p.path) }));
}

export const metadata = { title: "Blocks" };

export default async function BlocksSubPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const match = pages.find((p) => slugOf(p.path) === page);
  if (!match) notFound();
  return (
    <BlockRenderer blocks={match.blocks} collections={DEFAULT_CONFIG.collections} />
  );
}
