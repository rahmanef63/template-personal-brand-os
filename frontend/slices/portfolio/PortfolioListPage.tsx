"use client";

import { ConceptListPage } from "@/features/_shared/concepts/ConceptListPage";
import { portfolioAdapter } from "@/features/_app/concepts";

/**
 * Public portfolio list — header + filter + grid now live in the shared
 * ConceptListPage; this template's data wiring (selector + field map) is in
 * `_app/concepts` (portfolioAdapter). Admin edits propagate via the store
 * BroadcastChannel exactly as before.
 */
export function PortfolioListPage() {
  return <ConceptListPage adapter={portfolioAdapter} />;
}
