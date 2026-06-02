"use client";

import * as React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[public] route error:", error);
  }, [error]);

  return (
    <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-6 text-center">
      <div>
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Ada yang error</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Halaman ini gagal dimuat. Coba lagi sebentar.
        </p>
        <Button onClick={reset} className="mt-6 gap-2">
          <RotateCw className="size-4" /> Coba lagi
        </Button>
      </div>
    </div>
  );
}
