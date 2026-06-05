"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Palette } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import {
  SaveSiteDefaultButton,
  ThemePresetSwitcher,
} from "@/features/theme-presets";

/**
 * Appearance card (Settings → Site). The switcher previews/commits a preset
 * for THIS browser; "Jadikan default situs" persists the current preset to
 * siteSettings.themePreset so every visitor gets it by default (they can
 * still pick their own via the public switcher).
 */
export function ThemeCard() {
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-4 p-6">
        <div>
          <h3 className="flex items-center gap-2 font-medium">
            <Palette className="size-4 text-brand" /> Tampilan & Tema
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Default situs saat ini:{" "}
            <b>{settings?.themePreset || "bawaan template (cosmic-night)"}</b>
            {settings?.themeDefault ? <> · mode {settings.themeDefault}</> : null}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ThemePresetSwitcher />
          <SaveSiteDefaultButton
            onSave={async (preset) => {
              await upsert({ themePreset: preset ?? "" });
              toast.success(
                preset
                  ? `Preset "${preset}" jadi default situs.`
                  : "Default situs kembali ke bawaan template.",
              );
            }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Switcher hanya mengubah tampilan browser kamu; tombol di sampingnya
          yang menyimpan ke seluruh situs. Mode terang/gelap default diatur di
          form identitas situs (Tema default).
        </p>
      </CardContent>
    </Card>
  );
}
