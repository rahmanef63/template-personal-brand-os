"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INTEGRATIONS, INTEGRATION_STATUS_META } from "./seed";

export function IntegrationGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {INTEGRATIONS.map((i) => {
        const meta = INTEGRATION_STATUS_META[i.status];
        const isConnected = i.status === "connected";
        const isError = i.status === "error";
        return (
          <div key={i.id} className="rounded-lg border bg-card p-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted text-[10px] font-bold uppercase">
                {i.label.slice(0, 2)}
              </div>
              <p className="truncate text-sm font-medium">{i.label}</p>
              <Badge
                variant="outline"
                className={"ml-auto text-[10px] uppercase " + meta.tone}
              >
                {meta.label}
              </Badge>
            </div>
            <p className="mt-2 truncate text-xs text-muted-foreground">{i.detail}</p>
            <p className="mt-0.5 text-[10px] uppercase text-muted-foreground">{i.category}</p>
            <div className="mt-3 flex gap-1.5">
              <Button variant="outline" size="sm" className="h-7 flex-1 text-xs">
                {isConnected ? "Configure" : isError ? "Reconnect" : "Connect"}
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="size-7"
                title={`${i.label} docs`}
              >
                <a href={i.docsUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
