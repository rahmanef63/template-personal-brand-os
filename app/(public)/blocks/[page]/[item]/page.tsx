import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Hero from "@/components/blocks/Hero";
import { DEFAULT_CONFIG } from "@/components/blocks/registry";
import { itemSlug } from "@/components/blocks/itemSlug";

// Per-item detail pages for the shared collections, e.g. /blocks/services/<slug>.
// Each card on a Collection block (when itemBasePath is set) links here. Renders
// the one item via the shared Hero block, so it stays on-brand. Synced verbatim
// from templates-portal alongside components/blocks — do not edit here.
const collections = DEFAULT_CONFIG.collections ?? {};

export function generateStaticParams() {
  const params: { page: string; item: string }[] = [];
  for (const [name, items] of Object.entries(collections)) {
    for (const it of items) params.push({ page: name, item: itemSlug(it) });
  }
  return params;
}

export const metadata = { title: "Detail" };

export default async function CollectionItemPage({
  params,
}: {
  params: Promise<{ page: string; item: string }>;
}) {
  const { page, item } = await params;
  const items = collections[page] ?? [];
  const match = items.find((it) => itemSlug(it) === item);
  if (!match) notFound();

  return (
    <div>
      <Hero
        label={page}
        title={typeof match.title === "string" ? match.title : "Untitled"}
        subtitle={typeof match.blurb === "string" ? match.blurb : undefined}
        align="left"
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Link
          href={`/blocks/${page}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft weight="bold" className="size-4" />
          Back to {page}
        </Link>
      </div>
    </div>
  );
}
