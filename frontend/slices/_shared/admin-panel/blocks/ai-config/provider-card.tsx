"use client";

import * as React from "react";
import { ExternalLink, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_META } from "./seed";
import type { AiProvider } from "./types";

export function ProviderCard({
  provider,
  modelCount,
}: {
  provider: AiProvider;
  modelCount: number;
}) {
  const status = STATUS_META[provider.status];
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-start gap-2">
        <div
          className={
            "flex size-7 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold uppercase " +
            provider.tone
          }
        >
          {provider.label.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium">{provider.label}</p>
            <Badge
              variant="outline"
              className={"ml-auto text-[10px] uppercase " + status.tone}
            >
              {status.label}
            </Badge>
          </div>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {modelCount} model{modelCount === 1 ? "" : "s"} available
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <KeyRound className="size-3 text-muted-foreground" />
        <span className="font-mono text-[10px] text-muted-foreground">
          {provider.keyTail ? `sk-…${provider.keyTail}` : "(not set)"}
        </span>
      </div>
      <div className="mt-3 flex gap-1.5">
        <Button variant="outline" size="sm" className="h-7 flex-1 text-xs">
          {provider.keyTail ? "Rotate key" : "Connect"}
        </Button>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="size-7"
          title="Provider docs"
        >
          <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
