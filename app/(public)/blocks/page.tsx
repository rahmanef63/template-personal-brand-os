import BlockRenderer from "@/components/blocks/BlockRenderer";
import { DEFAULT_CONFIG } from "@/components/blocks/registry";

// Showcase of the shared block-library SSOT, rendered from a PageConfig via
// BlockRenderer. Blocks inherit this template's theme tokens (--primary, --muted,
// --border, ...), so they appear on-brand automatically. The 10 files under
// components/blocks are synced verbatim from templates-portal — do not edit here;
// edit in the portal and re-sync.
export const metadata = { title: "Blocks" };

export default function BlocksPage() {
  return <BlockRenderer blocks={DEFAULT_CONFIG.blocks} collections={DEFAULT_CONFIG.collections} />;
}
