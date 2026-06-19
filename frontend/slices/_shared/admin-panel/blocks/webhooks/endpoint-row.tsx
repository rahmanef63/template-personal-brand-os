"use client";

import * as React from "react";
import { AlertTriangle, KeyRound, MoreHorizontal, PauseCircle, PlayCircle, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_META } from "./seed";
import type { WebhookEndpoint } from "./types";

export function EndpointRow({
  endpoint,
  onToggle,
  onDelete,
  onFire,
}: {
  endpoint: WebhookEndpoint;
  onToggle: () => void;
  onDelete: () => void;
  onFire?: () => void;
}) {
  const status = STATUS_META[endpoint.status];
  const isPaused = endpoint.status === "paused";
  return (
    <div className="space-y-2 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={"text-[10px] uppercase " + status.tone}>
          {status.label}
        </Badge>
        <p className="truncate text-sm font-medium">{endpoint.description}</p>
        {endpoint.failingRetries > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-rose-400">
            <AlertTriangle className="size-3" />
            {endpoint.failingRetries} retries
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={onFire}
            disabled={!onFire || endpoint.status === "paused"}
            title={endpoint.status === "paused" ? "Resume endpoint to fire" : "Fire a mock event"}
          >
            <Send className="size-3" />
            Test
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label={`Actions for ${endpoint.description}`}
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={onToggle}>
                {isPaused ? (
                  <>
                    <PlayCircle className="size-3.5" />
                    Resume
                  </>
                ) : (
                  <>
                    <PauseCircle className="size-3.5" />
                    Pause
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <KeyRound className="size-3.5" />
                Rotate secret
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="break-all font-mono text-[10px] text-muted-foreground">{endpoint.url}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {endpoint.events.map((e) => (
          <span key={e} className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {e}
          </span>
        ))}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          secret: whsec_…{endpoint.secretTail}
        </span>
      </div>
    </div>
  );
}
