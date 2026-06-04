"use client";

/** LinkCell — shared cell for url / email / phone types.
 *  - readOnly: renders as clickable <a> (mailto:/tel:/href).
 *  - edit: inline input; pressing Enter or blur commits.
 *  Single component for all 3 link-like types — DRY via `kind` prop. */

import { useState } from "react";
import { Mail, Phone, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type LinkKind = "url" | "email" | "phone";

function hrefFor(kind: LinkKind, raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  if (kind === "email") return v.startsWith("mailto:") ? v : `mailto:${v}`;
  if (kind === "phone") return v.startsWith("tel:") ? v : `tel:${v.replace(/[^0-9+]/g, "")}`;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function placeholderFor(kind: LinkKind): string {
  if (kind === "email") return "name@example.com";
  if (kind === "phone") return "+1 555 123 4567";
  return "https://…";
}

function iconFor(kind: LinkKind) {
  if (kind === "email") return Mail;
  if (kind === "phone") return Phone;
  return LinkIcon;
}

interface LinkCellProps {
  kind: LinkKind;
  value: string | null;
  readOnly?: boolean;
  onChange?: (next: string) => void;
}

export function LinkCell({ kind, value, readOnly, onChange }: LinkCellProps) {
  const [draft, setDraft] = useState(value ?? "");
  const Icon = iconFor(kind);
  const v = (value ?? "").trim();

  if (readOnly) {
    if (!v) return <span className="text-muted-foreground/60">—</span>;
    return (
      <a
        href={hrefFor(kind, v)}
        target={kind === "url" ? "_blank" : undefined}
        rel={kind === "url" ? "noreferrer noopener" : undefined}
        className="inline-flex items-center gap-1 text-sm text-primary underline-offset-2 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        <Icon className="h-3 w-3 shrink-0" />
        <span className="truncate">{v}</span>
      </a>
    );
  }

  const commit = () => {
    const next = draft.trim();
    if (next !== v) onChange?.(next);
  };

  return (
    <div className={cn("flex items-center gap-1 rounded-md border border-border bg-background px-2 h-7")}>
      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
      <input
        type={kind === "email" ? "email" : kind === "phone" ? "tel" : "url"}
        inputMode={kind === "phone" ? "tel" : kind === "email" ? "email" : "url"}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") { commit(); (e.target as HTMLInputElement).blur(); } }}
        placeholder={placeholderFor(kind)}
        className="h-full w-full bg-transparent text-sm focus:outline-none"
      />
    </div>
  );
}
