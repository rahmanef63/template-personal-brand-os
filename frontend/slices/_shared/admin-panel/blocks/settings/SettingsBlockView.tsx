"use client";

import * as React from "react";
import { AlertTriangle, Save, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettingsBindings } from "./bindings";
import { IdentityForm } from "./identity-form";
import { IntegrationGrid } from "./integration-grid";
import { ApiKeysList } from "./api-keys-list";
import { BlockHeader } from "../../ui/block-header";
import { SectionHeader } from "../../ui/section-header";

/** Real admin-panel "Settings" block — sixth + final BS-pattern impl.
 *  Pure client demo: 4-tab layout (Identity, Integrations, API keys,
 *  Danger zone). Identity has live workspace name/slug/timezone/lang/
 *  contact-email editor with slug auto-sanitization. Integrations
 *  shows 6 services (Slack, Resend, Stripe, Vercel, GitHub, DOKU)
 *  with connected/disconnected/error states + per-service docs links.
 *  API keys list supports revoke + create (presentational). Danger
 *  zone has 3 confirmation actions (transfer / archive / delete) all
 *  marked destructive. No persistence — resets on browser reload. */
export function SettingsBlockView() {
  const { identity, integrations, setIdentity } = useSettingsBindings();
  const connectedCount = integrations.filter((i) => i.status === "connected").length;
  return (
    <div className="space-y-6 p-6">
      <BlockHeader
        title="Workspace settings"
        meta={`${identity.name} · ${identity.timezone} · ${connectedCount} of ${integrations.length} integrations connected`}
        actions={
          <Button size="sm" className="gap-1.5">
            <Save className="size-3.5" />
            Save changes
          </Button>
        }
      />

      <Tabs defaultValue="identity">
        <TabsList>
          <TabsTrigger value="identity" className="text-xs">
            Identity
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="keys" className="text-xs">
            API keys
          </TabsTrigger>
          <TabsTrigger value="danger" className="text-xs">
            Danger zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="mt-4">
          <div className="overflow-hidden rounded-lg border bg-card">
            <SectionHeader icon={Settings2} title="Workspace identity" />
            <div className="p-4">
              <IdentityForm identity={identity} setIdentity={setIdentity} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <IntegrationGrid />
        </TabsContent>

        <TabsContent value="keys" className="mt-4">
          <ApiKeysList />
        </TabsContent>

        <TabsContent value="danger" className="mt-4">
          <DangerZone />
        </TabsContent>
      </Tabs>

      <p className="text-[10px] text-muted-foreground">
        Demo data — resets on browser reload. Real impl backs identity to a Convex workspace doc,
        integrations to encrypted secret vault, API keys to hashed table with audit-log writes.
      </p>
    </div>
  );
}

function DangerZone() {
  const actions = [
    {
      id: "transfer",
      label: "Transfer ownership",
      desc: "Hand the workspace over to another owner. Requires that recipient is already a member.",
      cta: "Transfer…",
    },
    {
      id: "archive",
      label: "Archive workspace",
      desc: "Make the workspace read-only. Reversible within 30 days.",
      cta: "Archive…",
    },
    {
      id: "delete",
      label: "Delete workspace",
      desc: "Permanently delete the workspace and all data. Cannot be undone.",
      cta: "Delete…",
    },
  ];
  return (
    <div className="overflow-hidden rounded-lg border border-destructive/30 bg-card">
      <div className="flex items-center gap-2 border-b border-destructive/30 bg-destructive/5 px-4 py-2">
        <AlertTriangle className="size-3.5 text-destructive" />
        <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
      </div>
      <div className="divide-y">
        {actions.map((a) => (
          <div key={a.id} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{a.label}</p>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </div>
            <Button variant="destructive" size="sm" className="text-xs">
              {a.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
