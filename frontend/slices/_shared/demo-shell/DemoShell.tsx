"use client";

import * as React from "react";
import { Github, Rocket, Compass, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IS_DEMO, CLONE_URL, REPO_URL } from "@/lib/stage";
import { resetDemoState } from "@/lib/demo-store";
import { useEmbedded } from "./use-embedded";
import { SplitOverlay } from "./SplitOverlay";

// Interactive demo shell — DEMO-only. A floating control bar lets a visitor
// flip the same seeded site between the PUBLIC page, the ADMIN dashboard, and a
// live SPLIT view, plus deploy/source/explore links and a Reset. Admin/Split
// render the routes inside self-framed iframes (?embed=1) so this shell never
// nests inside itself. Mounted in the ROOT layout; renders null in real clones
// (IS_DEMO false) and inside the iframes (embedded).

const PORTAL_URL = "https://portal-pi-lake.vercel.app";
const MODE_KEY = "pb:demo:mode";
type Mode = "public" | "admin" | "split";
const MODES: { id: Mode; label: string }[] = [
  { id: "public", label: "Public" },
  { id: "admin", label: "Admin" },
  { id: "split", label: "Split" },
];

export function DemoShell() {
  // Hooks always run (rules-of-hooks); the render branches below decide output.
  const embedded = useEmbedded();
  const [mode, setMode] = React.useState<Mode>("public");

  // Restore the persisted mode after mount (localStorage is client-only).
  React.useEffect(() => {
    const saved = window.localStorage.getItem(MODE_KEY) as Mode | null;
    if (saved === "admin" || saved === "split" || saved === "public") setMode(saved);
  }, []);

  const pick = (m: Mode) => {
    setMode(m);
    try {
      window.localStorage.setItem(MODE_KEY, m);
    } catch {
      /* ignore */
    }
  };

  const reset = () => {
    resetDemoState();
    // Hard reload re-seeds both this shell and any open iframe from SEED_STATE.
    window.location.reload();
  };

  if (!IS_DEMO || embedded) return null;

  return (
    <TooltipProvider delayDuration={200}>
      {/* Overlay: above the page, below the control bar. */}
      {mode !== "public" && (
        <div className="fixed inset-0 z-30 bg-background">
          {mode === "admin" ? (
            <iframe
              src="/dashboard/admin?embed=1"
              title="Admin dashboard"
              className="size-full border-0 bg-background"
            />
          ) : (
            <SplitOverlay leftSrc="/?embed=1" rightSrc="/dashboard/admin?embed=1" />
          )}
        </div>
      )}

      {/* Control bar — reuses the demo-ribbon position/style (bottom-left). */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-wrap items-center gap-2 rounded-full border border-border/60 bg-background/90 px-2 py-1.5 shadow-[var(--shadow-lift)] backdrop-blur">
        {/* Segmented Public | Admin | Split */}
        <div className="flex items-center gap-0.5 rounded-full bg-muted p-0.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => pick(m.id)}
              aria-pressed={mode === m.id}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                mode === m.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode !== "public" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="rounded-full" onClick={reset}>
                <RotateCcw className="size-4" />
                <span className="sr-only">Reset demo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset demo ke data awal</TooltipContent>
          </Tooltip>
        )}

        <span className="mx-0.5 h-5 w-px bg-border/70" aria-hidden />

        <Button asChild variant="default" size="sm" className="rounded-full">
          <a href={CLONE_URL} target="_blank" rel="noopener noreferrer">
            <Rocket className="size-4" />
            Deploy
          </a>
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon-sm" className="rounded-full">
              <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" aria-label="Explore templates">
                <Compass className="size-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Explore templates</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon-sm" className="rounded-full">
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label="Source di GitHub">
                <Github className="size-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Source di GitHub</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
