"use client";

import * as React from "react";
import { Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_SITE_CONFIG } from "../../../shared/site-config";
import { SiteSettingsForm } from "./SiteSettingsForm";
import { UpdateCard } from "@/components/admin/update-card";
import { BackupCard } from "@/components/admin/backup-card";

export function SettingsView({ section }: { section: "ai" | "team" | "site" }) {
  const TITLES = {
    ai: "AI Configuration",
    team: "Team & Permissions",
    site: "Site Settings",
  };
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{TITLES[section]}</h1>
        <p className="text-sm text-muted-foreground">
          {section === "site"
            ? "Identitas situs — tersimpan di Convex, dipakai di seluruh situs."
            : "Demo placeholder — di production, wired ke Convex `ai_config` / `workspaces`."}
        </p>
      </div>
      {section === "ai" && (
        <Card className="border-border/60">
          <CardContent className="space-y-3 p-6 text-sm">
            <Row k="Chatbot model" v="claude-sonnet-4-6" />
            <Row k="CMS outline model" v="claude-sonnet-4-6" />
            <Row k="Headline variants" v="claude-haiku-4-5" />
            <Row k="Comment moderation" v="claude-haiku-4-5" />
            <Row k="Bilingual translate" v="claude-haiku-4-5" />
            <Row k="Daily budget" v="USD $5.00" mono />
          </CardContent>
        </Card>
      )}
      {section === "team" && (
        <Card className="border-border/60">
          <CardContent className="p-6 text-sm">
            <p className="text-muted-foreground">3 members:</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-full bg-muted text-xs">{DEFAULT_SITE_CONFIG.ownerInitials}</div>
                <div className="flex-1">
                  <p className="font-medium">{DEFAULT_SITE_CONFIG.ownerName}</p>
                  <p className="text-xs text-muted-foreground">{DEFAULT_SITE_CONFIG.email}</p>
                </div>
                <Badge variant="outline">{DEFAULT_SITE_CONFIG.ownerRole}</Badge>
              </li>
              <li className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-full bg-muted text-xs">EM</div>
                <div className="flex-1">
                  <p className="font-medium">Editor M.</p>
                  <p className="text-xs text-muted-foreground">editor@dev</p>
                </div>
                <Badge variant="outline">editor</Badge>
              </li>
              <li className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-full bg-muted text-xs">RA</div>
                <div className="flex-1">
                  <p className="font-medium">Reviewer A.</p>
                  <p className="text-xs text-muted-foreground">reviewer@dev</p>
                </div>
                <Badge variant="outline">reviewer</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
      {section === "site" && (
        <>
          <SiteSettingsForm />
          <UpdateCard />
          <BackupCard />
        </>
      )}
      <p className="text-[11px] text-muted-foreground">
        <Wand2 className="mr-1 inline size-3" /> Per-feature model picker, system prompt edit, cost dashboard — di Convex `ai_config` table.
      </p>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      {mono ? <span className="font-mono">{v}</span> : <Badge variant="outline">{v}</Badge>}
    </div>
  );
}
