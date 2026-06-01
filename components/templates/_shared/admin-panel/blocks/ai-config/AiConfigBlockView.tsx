"use client";

import * as React from "react";
import { RotateCcw, Save, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MODELS, PROVIDERS } from "./seed";
import { useAiConfigBindings } from "./bindings";
import { ProviderCard } from "./provider-card";
import { ModerationRowItem } from "./moderation-row";
import { ModelTab } from "./model-tab";
import { BlockHeader } from "../../ui/block-header";
import { SectionHeader } from "../../ui/section-header";

/** Real admin-panel "AI Config" block. BY-wave: 3-tab layout
 *  (Providers / Active model / Moderation) to reduce ~140vh scroll
 *  to per-tab focus. Header "Save changes" + "Reset" apply globally. */
export function AiConfigBlockView() {
  const { config, moderation, setConfig, toggleRule, setThreshold, reset } =
    useAiConfigBindings();
  const enabledRules = moderation.filter((r) => r.enabled).length;

  return (
    <div className="space-y-6 p-6">
      <BlockHeader
        title="AI configuration"
        meta={`${PROVIDERS.length} providers · ${MODELS.length} models · ${enabledRules} of ${moderation.length} moderation rules enabled`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={reset}>
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
            <Button size="sm" className="gap-1.5">
              <Save className="size-3.5" />
              Save changes
            </Button>
          </>
        }
      />

      <Tabs defaultValue="model">
        <TabsList>
          <TabsTrigger value="providers" className="text-xs">Providers</TabsTrigger>
          <TabsTrigger value="model" className="text-xs">Active model</TabsTrigger>
          <TabsTrigger value="moderation" className="text-xs">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {PROVIDERS.map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                modelCount={MODELS.filter((m) => m.provider === p.id).length}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="model" className="mt-4">
          <ModelTab config={config} setConfig={setConfig} />
        </TabsContent>

        <TabsContent value="moderation" className="mt-4">
          <div className="overflow-hidden rounded-lg border bg-card">
            <SectionHeader
              icon={Shield}
              title="Moderation rules"
              right={
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {enabledRules} / {moderation.length} active
                </span>
              }
            />
            <div className="divide-y">
              {moderation.map((r) => (
                <ModerationRowItem
                  key={r.id}
                  rule={r}
                  onToggle={(next) => toggleRule(r.id, next)}
                  onThreshold={(next) => setThreshold(r.id, next)}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <p className="text-[10px] text-muted-foreground">
        Demo data — resets on browser reload. Real impl backed by{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-[10px]">ai-router</code> slice (provider
        adapters + key vault) + Convex schema for persisted config.
      </p>
    </div>
  );
}
