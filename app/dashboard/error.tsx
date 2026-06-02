"use client";

import * as React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[dashboard] route error:", error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center p-6 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard error</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bagian ini gagal dimuat. Datamu aman — coba muat ulang.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-muted-foreground">Ref: {error.digest}</p>
        )}
        <Button onClick={reset} className="mt-6 gap-2">
          <RotateCw className="size-4" /> Muat ulang
        </Button>
      </div>
    </div>
  );
}
