"use client";

import * as React from "react";
import { Copy, KeyRound, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SCOPE_META, SEED_KEYS } from "./seed";
import type { ApiKey } from "./types";

export function ApiKeysList() {
  const [keys, setKeys] = React.useState<ApiKey[]>(SEED_KEYS);
  function remove(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {keys.length} key{keys.length === 1 ? "" : "s"} · rotate every 90 days
        </p>
        <Button size="sm" className="h-7 gap-1.5 text-xs">
          <Plus className="size-3" />
          Create key
        </Button>
      </div>
      <div className="divide-y rounded-lg border bg-card">
        {keys.length === 0 ? (
          <p className="p-6 text-center text-xs text-muted-foreground">No keys.</p>
        ) : (
          keys.map((k) => (
            <div key={k.id} className="flex items-center gap-3 px-3 py-2">
              <KeyRound className="size-3.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-medium">{k.label}</p>
                  <Badge
                    variant="outline"
                    className={"text-[10px] uppercase " + SCOPE_META[k.scope].tone}
                  >
                    {k.scope}
                  </Badge>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  rr_sk_live_…{k.tail} · created{" "}
                  <time dateTime={k.createdAt}>{formatDate(k.createdAt)}</time> · last used{" "}
                  {k.lastUsedAt ? (
                    <time dateTime={k.lastUsedAt}>{formatRelative(k.lastUsedAt)}</time>
                  ) : (
                    "never"
                  )}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="size-7" aria-label={`Copy ${k.label}`} title="Copy">
                <Copy className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-destructive"
                aria-label={`Revoke ${k.label}`}
                title="Revoke"
                onClick={() => remove(k.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}

function formatRelative(iso: string): string {
  const hrs = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (hrs < 1) return `${Math.floor(hrs * 60)}m ago`;
  if (hrs < 24) return `${Math.floor(hrs)}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
