"use client";

import { Github, Rocket } from "lucide-react";
import { IS_DEMO, CLONE_URL, REPO_URL } from "@/lib/stage";

/**
 * Demo-stage only: a floating "deploy your own copy" CTA + source link. Renders
 * exclusively when NEXT_PUBLIC_DEMO=1 (set on the showcase deployment), so a
 * cloned site never shows it. Bottom-LEFT to avoid the bottom-right chat FAB.
 */
export function DemoRibbon() {
  if (!IS_DEMO) return null;
  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
      <a
        href={CLONE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/90 px-4 py-2 text-sm font-medium shadow-[var(--shadow-lift)] backdrop-blur transition hover:-translate-y-0.5 hover:border-brand/50 hover:text-brand"
      >
        <Rocket className="size-4 text-brand" />
        Deploy situs ini
        <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
          demo
        </span>
      </a>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Source di GitHub"
        title="Source di GitHub"
        className="grid size-9 place-items-center rounded-full border border-border/60 bg-background/90 text-muted-foreground shadow-[var(--shadow-soft)] backdrop-blur transition hover:-translate-y-0.5 hover:text-foreground"
      >
        <Github className="size-4" />
      </a>
    </div>
  );
}
