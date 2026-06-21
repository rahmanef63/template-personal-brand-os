"use client";

import { ConceptListPage } from "@/features/_shared/concepts/ConceptListPage";
import { blogAdapter } from "@/features/_app/concepts";

/**
 * Public blog list — header + filter + grid now live in the shared
 * ConceptListPage; this template's data wiring (selector + field map) is in
 * `_app/concepts` (blogAdapter). Admin edits propagate via the store
 * BroadcastChannel exactly as before.
 */
export function BlogList() {
  return <ConceptListPage adapter={blogAdapter} />;
}
