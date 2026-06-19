"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

/**
 * BI-wave — extracted helpers from `PageEditorView` to stay under the
 * 200-LOC cap. Small presentational pieces with no business logic.
 */
export function Field({
  label,
  mono,
  children,
}: {
  label: string;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className={mono ? "text-[10px] font-mono uppercase" : "text-xs"}>{label}</Label>
      {children}
    </div>
  );
}

export function PageNotFound({ adminBase }: { adminBase: string }) {
  return (
    <div className="space-y-3">
      <Link
        href={`${adminBase}/pages`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Pages
      </Link>
      <p className="text-sm text-muted-foreground">Page not found.</p>
    </div>
  );
}

export function SystemPageNotice({ adminBase }: { adminBase: string }) {
  return (
    <div className="space-y-3">
      <Link
        href={`${adminBase}/pages`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Pages
      </Link>
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm">
        <p className="font-medium">System page — read-only.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          This page is rendered from JSX in the template source. To customize, duplicate
          it from the Pages list and edit the copy.
        </p>
      </div>
    </div>
  );
}
