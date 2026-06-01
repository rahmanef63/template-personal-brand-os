"use client";

import * as React from "react";
import {
  useLandingSections,
  usePortfolio,
  usePublishedPosts,
  useServices,
} from "../../shared/store";
import { renderLanding } from "./LandingRenderer";

/**
 * Composes the public home from admin-editable `landingSections`.
 * Order + visibility + per-section copy (hero title, etc) are owned by
 * /admin/landing; BroadcastChannel sync makes edits appear here without
 * a reload.
 *
 * Pre-AE-wave this file hard-coded section order + uneditable copy.
 */
export function HomePage() {
  // Mounted gate: this composition is fully driven by client-side Convex data
  // (landingSections). Static prerender renders the empty set; the client then
  // renders the full section list — a structural mismatch that is fatal under
  // prod hydration (dev tolerates it). Rendering only after mount makes the
  // server + initial-client output identical, then fills in client-side.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const sections = useLandingSections();
  const posts = usePublishedPosts();
  const portfolio = usePortfolio();
  const services = useServices();

  const ordered = React.useMemo(
    () => [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order),
    [sections],
  );

  if (!mounted) return null;

  return (
    <>
      {ordered.map((s) => (
        <React.Fragment key={s.id}>
          {renderLanding(s, { posts, portfolio, services })}
        </React.Fragment>
      ))}
    </>
  );
}
