"use client";

/** "Jadikan default situs" — saves the CURRENT preset as the site-wide
 *  default. Props-driven (R3): the host injects the persistence call,
 *  typically `(preset) => settingsUpsert({ themePreset: preset ?? "" })`.
 *  Mount next to ThemePresetSwitcher in the admin Appearance section. */

import * as React from "react";
import { Check, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemePreset } from "./ThemePresetProvider";

export function SaveSiteDefaultButton({
  onSave,
}: {
  onSave: (preset: string | null) => Promise<unknown>;
}) {
  const { presetName } = useThemePreset();
  const [busy, setBusy] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  async function save() {
    setBusy(true);
    try {
      await onSave(presetName);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={save}
      disabled={busy}
      className="gap-1.5"
      title="Semua pengunjung melihat preset ini secara default; mereka tetap bisa memilih sendiri lewat switcher."
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : saved ? (
        <Check className="size-4 text-primary" />
      ) : (
        <Star className="size-4" />
      )}
      Jadikan default situs
    </Button>
  );
}
