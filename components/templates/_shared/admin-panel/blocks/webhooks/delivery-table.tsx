"use client";

import * as React from "react";
import { RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DELIVERY_META } from "./seed";
import type { WebhookDelivery, WebhookEndpoint } from "./types";

export function DeliveryTable({
  deliveries,
  endpoints,
}: {
  deliveries: WebhookDelivery[];
  endpoints: WebhookEndpoint[];
}) {
  return (
    <div role="table" aria-label="Recent webhook deliveries" className="divide-y rounded-lg border bg-card">
      <div
        role="row"
        className="grid grid-cols-[80px_1fr_140px_60px_60px_28px] gap-2 px-3 py-2 text-[10px] uppercase tracking-wide text-muted-foreground"
      >
        <span role="columnheader">When</span>
        <span role="columnheader">Endpoint · event</span>
        <span role="columnheader">Status</span>
        <span role="columnheader" className="text-right">HTTP</span>
        <span role="columnheader" className="text-right">ms</span>
        <span role="columnheader" aria-label="Actions" />
      </div>
      {deliveries.map((d) => {
        const endpoint = endpoints.find((e) => e.id === d.endpointId);
        const meta = DELIVERY_META[d.status];
        return (
          <div
            role="row"
            key={d.id}
            className="grid grid-cols-[80px_1fr_140px_60px_60px_28px] items-center gap-2 px-3 py-2 text-xs"
          >
            <time
              role="cell"
              dateTime={d.at}
              className="font-mono text-[10px] text-muted-foreground"
            >
              {formatTime(d.at)}
            </time>
            <div role="cell" className="min-w-0">
              <p className="truncate font-medium">{endpoint?.description ?? "(deleted)"}</p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">{d.event}</p>
            </div>
            <div role="cell" className="flex items-center gap-1.5">
              <Badge variant="outline" className={"text-[10px] uppercase " + meta.tone}>
                {meta.label}
              </Badge>
              {d.attempt > 0 && (
                <span className="font-mono text-[10px] text-muted-foreground">×{d.attempt + 1}</span>
              )}
            </div>
            <span role="cell" className="text-right font-mono text-[10px] text-muted-foreground">
              {d.httpCode || "—"}
            </span>
            <span role="cell" className="text-right font-mono text-[10px] tabular-nums text-muted-foreground">
              {d.durationMs}
            </span>
            <Button
              role="cell"
              variant="ghost"
              size="icon"
              className="size-6"
              aria-label={`Retry delivery ${d.id}`}
              title="Retry"
            >
              <RefreshCcw className="size-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = d.getUTCHours().toString().padStart(2, "0");
  const mm = d.getUTCMinutes().toString().padStart(2, "0");
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${hh}:${mm}`;
}
