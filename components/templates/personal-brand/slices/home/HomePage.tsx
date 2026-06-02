"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  // Fresh/unseeded site: no landing sections yet → guide instead of a blank page.
  if (ordered.length === 0) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-6 text-center">
        <div>
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
            <Sparkles className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Situs sedang disiapkan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Belum ada konten. Kalau kamu pemiliknya, masuk ke dashboard dan klik
            "Isi konten contoh" untuk mulai.
          </p>
          <Button asChild className="mt-6">
            <Link href="/admin">Masuk admin</Link>
          </Button>
        </div>
      </div>
    );
  }

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
