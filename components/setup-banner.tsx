"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

/**
 * First-run helper shown on the dashboard when the site is still empty. Lets a
 * non-technical owner load sample content with one click — no CLI / `convex run`.
 * Disappears once content exists.
 */
export function SetupBanner() {
  const setup = useQuery(api.setup.status);
  const seedSample = useMutation(api.seed.seedSample);
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);

  if (!setup || setup.seeded || done) return null;

  async function fill() {
    setBusy(true);
    try {
      await seedSample();
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-lg border border-brand/30 bg-brand/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 size-5 shrink-0 text-brand" />
        <div>
          <p className="text-sm font-medium">Situs kamu masih kosong</p>
          <p className="text-xs text-muted-foreground">
            Isi dengan konten contoh (blog, portfolio, layanan, halaman depan) biar
            langsung kelihatan. Bisa kamu ganti kapan saja.
          </p>
        </div>
      </div>
      <Button onClick={fill} disabled={busy} className="shrink-0">
        {busy ? <Loader2 className="size-4 animate-spin" /> : "Isi konten contoh"}
      </Button>
    </div>
  );
}
