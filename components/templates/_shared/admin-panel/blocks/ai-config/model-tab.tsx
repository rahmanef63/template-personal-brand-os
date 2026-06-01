"use client";

import * as React from "react";
import { Bot, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODELS, PROVIDERS, TIER_META } from "./seed";
import { Knob, Stat } from "./knobs";
import { SectionHeader } from "../../ui/section-header";
import type { AiConfig, ProviderId } from "./types";

export function ModelTab({
  config,
  setConfig,
}: {
  config: AiConfig;
  setConfig: React.Dispatch<React.SetStateAction<AiConfig>>;
}) {
  const activeModel = MODELS.find((m) => m.id === config.activeModelId)!;
  const activeProvider = PROVIDERS.find((p) => p.id === activeModel.provider)!;
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border bg-card">
        <SectionHeader
          icon={Sparkles}
          title="Active model"
          right={
            <Badge
              variant="outline"
              className={"text-[10px] uppercase " + TIER_META[activeModel.tier].tone}
            >
              {TIER_META[activeModel.tier].label}
            </Badge>
          }
        />
        <div className="grid gap-3 p-4 md:grid-cols-[1fr_220px]">
          <Select
            value={config.activeModelId}
            onValueChange={(id) => setConfig((c) => ({ ...c, activeModelId: id }))}
          >
            <SelectTrigger aria-label="Active model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["anthropic", "openai", "mistral", "google"] as ProviderId[]).map((pid) => (
                <SelectGroup key={pid}>
                  <SelectLabel className="text-[10px] uppercase">
                    {PROVIDERS.find((p) => p.id === pid)?.label}
                  </SelectLabel>
                  {MODELS.filter((m) => m.provider === pid).map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}{" "}
                      <span className="ml-1 text-[10px] text-muted-foreground">
                        · {m.contextWindowK}K · ${m.inputCostUSD}/${m.outputCostUSD} per 1M
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Context" value={`${activeModel.contextWindowK}K`} />
            <Stat label="Input $/1M" value={`$${activeModel.inputCostUSD}`} />
            <Stat label="Output $/1M" value={`$${activeModel.outputCostUSD}`} />
          </div>
        </div>
        <p className="border-t px-4 py-2 text-[10px] text-muted-foreground">
          Routed via <code className="rounded bg-muted px-1 py-0.5">{activeProvider.label}</code>{" "}
          adapter. Fallback chain: Sonnet → Haiku → GPT-4o mini.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <SectionHeader
          icon={Bot}
          title="System prompt & sampling"
          right={
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              {config.systemPrompt.length} / 4000
            </span>
          }
        />
        <div className="space-y-4 p-4">
          <Textarea
            value={config.systemPrompt}
            onChange={(e) => setConfig((c) => ({ ...c, systemPrompt: e.target.value }))}
            rows={4}
            className="font-mono text-xs"
            maxLength={4000}
            aria-label="System prompt"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Knob
              label="Temperature"
              value={config.temperature}
              min={0}
              max={1}
              step={0.05}
              format={(v) => v.toFixed(2)}
              onChange={(v) => setConfig((c) => ({ ...c, temperature: v }))}
            />
            <Knob
              label="Max output tokens"
              value={config.maxOutputTokens}
              min={256}
              max={8192}
              step={256}
              format={(v) => v.toString()}
              onChange={(v) => setConfig((c) => ({ ...c, maxOutputTokens: v }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
