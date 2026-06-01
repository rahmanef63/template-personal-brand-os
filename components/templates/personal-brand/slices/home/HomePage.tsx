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
  const sections = useLandingSections();
  const posts = usePublishedPosts();
  const portfolio = usePortfolio();
  const services = useServices();

  const ordered = React.useMemo(
    () => [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order),
    [sections],
  );

  return <>{ordered.map((s) => renderLanding(s, { posts, portfolio, services }))}</>;
}
