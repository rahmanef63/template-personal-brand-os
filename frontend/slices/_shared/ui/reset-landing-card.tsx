"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { IS_DEMO } from "@/lib/stage";

/**
 * Owner maintenance: re-insert any missing landing sections from the template
 * seed and realign their order (api.seed.syncLanding — idempotent, never
 * overwrites edited copy/config). Self-guards on IS_DEMO: the demo store is
 * localStorage-only with no Convex mutation path, so it renders nothing there
 * (and the useMutation hook never mounts).
 */
export function ResetLandingCard() {
  if (IS_DEMO) return null;
  return <ResetLandingCardInner />;
}

function ResetLandingCardInner() {
  const sync = useMutation(api.seed.syncLanding);
  const [busy, setBusy] = React.useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const r = await sync({});
      toast.success(`Landing restored — ${r.inserted} added, ${r.reordered} reordered.`);
    } catch (e) {
      toast.error("Could not reset landing sections.");
      console.error("[reset-landing]", e);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card className="border-border/60 bg-card/60">
      <CardContent className="flex items-center justify-between gap-4 p-5 text-sm">
        <div>
          <p className="font-medium text-foreground">Landing sections</p>
          <p className="text-muted-foreground">
            Restore missing sections to the template default. Your edited copy is preserved.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={run}>
          <RotateCcw className="size-4" />
          {busy ? "Resetting…" : "Reset to default"}
        </Button>
      </CardContent>
    </Card>
  );
}
