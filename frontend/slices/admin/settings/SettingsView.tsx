"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { Wand2, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SiteSettingsForm } from "./SiteSettingsForm";
import { AboutContentForm } from "./AboutContentForm";
import { UpdateCard } from "@/components/admin/update-card";
import { BackupCard } from "@/components/admin/backup-card";
import { ThemeCard } from "@/components/admin/theme-card";
import { ResetLandingCard } from "@/features/_shared/ui/reset-landing-card";

export function SettingsView({ section }: { section: "ai" | "team" | "site" }) {
  const TITLES = {
    ai: "AI Configuration",
    team: "Team & Permissions",
    site: "Profile & Site",
  };
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{TITLES[section]}</h1>
        <p className="text-sm text-muted-foreground">
          {section === "site"
            ? "Profil owner, identitas situs, dan aset brand — tersimpan di Convex dan dipakai di public site."
            : section === "team"
            ? "Admin yang bisa mengelola situs ini. Akun pertama = pemilik."
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
      {section === "team" && <TeamList />}
      {section === "site" && (
        <>
          <SiteSettingsForm />
          <AboutContentForm />
          <ThemeCard />
          <UpdateCard />
          <BackupCard />
        </>
      )}
      {section === "ai" && (
        <p className="text-[11px] text-muted-foreground">
          <Wand2 className="mr-1 inline size-3" /> Per-feature model picker, system prompt edit, cost dashboard — di Convex `ai_config` table.
        </p>
      )}
      <ResetLandingCard />
    </div>
  );
}

function TeamList() {
  const admins = useQuery(api.users.listAdmins);
  return (
    <Card className="border-border/60">
      <CardContent className="p-6 text-sm">
        {admins === undefined ? (
          <div className="grid h-20 place-items-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : admins.length === 0 ? (
          <p className="text-muted-foreground">Belum ada admin. Daftar sebagai pemilik di /admin.</p>
        ) : (
          <>
            <p className="text-muted-foreground">{admins.length} admin:</p>
            <ul className="mt-3 space-y-2">
              {admins.map((a) => (
                <li key={a._id} className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-full bg-muted text-xs">{a.initials}</div>
                  <div className="flex-1">
                    <p className="font-medium">{a.name || a.email || "Admin"}</p>
                    {a.email && <p className="text-xs text-muted-foreground">{a.email}</p>}
                  </div>
                  <Badge variant={a.role === "owner" ? "default" : "outline"}>{a.role}</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Tambah admin lain: set <code>ADMIN_SIGNUP_KEY</code> di Convex env, bagikan kunci itu.
            </p>
          </>
        )}
      </CardContent>
    </Card>
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
