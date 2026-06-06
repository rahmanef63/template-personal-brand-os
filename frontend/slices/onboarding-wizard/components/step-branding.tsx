"use client";

// Branding step — logo/favicon upload (injected ImageField), brand color
// chips + free picker, default light/dark/system mode, theme preset Select
// with live preview, optional Analytics ID.

import * as React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemePresetField } from "./theme-preset-field";
import { Field, type SetField } from "./steps";
import type { ImageFieldComponent, OnboardingFields, PresetOption } from "../lib/types";

/** Quick-pick brand colors (warm → cool) — free input next to them wins. */
const BRAND_CHIPS = [
  "#c4583a", "#d97706", "#16a34a", "#0d9488", "#2563eb", "#7c3aed", "#db2777", "#0f172a",
];

const MODES = [
  { value: "light", label: "Terang" },
  { value: "dark", label: "Gelap" },
  { value: "system", label: "Sistem" },
];

export function StepBranding({
  f,
  set,
  ImageField,
  presetOptions,
  defaultPresetLabel,
  onPresetPreview,
}: {
  f: OnboardingFields;
  set: SetField;
  ImageField?: ImageFieldComponent;
  /** Theme presets the host offers. Omit/empty to hide the picker. */
  presetOptions?: PresetOption[];
  /** Reset-row label, e.g. `Bawaan template (cosmic-night)`. */
  defaultPresetLabel?: string;
  /** Live preview hook (null = restore template default). */
  onPresetPreview?: (name: string | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Branding</h1>
        <p className="text-sm text-muted-foreground">Logo, favicon, warna — semua tersimpan di situs kamu.</p>
      </div>
      {ImageField ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Logo">
            {f.logoUrl ? (
              <Image src={f.logoUrl} alt="logo" width={120} height={40} unoptimized className="mb-2 h-10 w-auto rounded object-contain" />
            ) : null}
            <ImageField label="Upload logo" onUploaded={(u) => set("logoUrl", u)} />
          </Field>
          <Field label="Favicon">
            {f.faviconUrl ? (
              <Image src={f.faviconUrl} alt="favicon" width={32} height={32} unoptimized className="mb-2 size-8 rounded object-contain" />
            ) : null}
            <ImageField label="Upload favicon" onUploaded={(u) => set("faviconUrl", u)} />
          </Field>
        </div>
      ) : null}
      <Field label="Warna brand">
        <div className="flex flex-wrap items-center gap-1.5">
          {BRAND_CHIPS.map((c) => (
            <Button
              key={c}
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Pilih warna ${c}`}
              onClick={() => set("brandColor", c)}
              className={
                "size-7 rounded-full transition-transform hover:scale-110 " +
                (f.brandColor.toLowerCase() === c ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : "")
              }
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input type="color" value={f.brandColor} onChange={(e) => set("brandColor", e.target.value)} className="h-10 w-16 p-1" />
          <Input value={f.brandColor} onChange={(e) => set("brandColor", e.target.value)} className="flex-1" />
        </div>
      </Field>
      <Field label="Tema default">
        <div className="flex gap-2">
          {MODES.map((m) => (
            <Button
              key={m.value}
              type="button"
              variant={f.themeDefault === m.value ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => set("themeDefault", m.value)}
            >
              {m.label}
            </Button>
          ))}
        </div>
      </Field>
      {presetOptions && presetOptions.length > 0 ? (
        <Field label="Preset warna situs">
          <ThemePresetField
            value={f.themePreset}
            options={presetOptions}
            defaultLabel={defaultPresetLabel}
            onChange={(name) => set("themePreset", name)}
            onPreview={onPresetPreview}
          />
          <p className="text-xs text-muted-foreground">
            Langsung dipratinjau — tersimpan saat kamu menekan Selesai.
          </p>
        </Field>
      ) : null}
      <Field label="Google Analytics ID (opsional)">
        <div className="flex items-center gap-2">
          <Input value={f.analyticsId} onChange={(e) => set("analyticsId", e.target.value)} placeholder="G-XXXXXXX" className="flex-1" />
          <a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              Dapatkan <ExternalLink className="size-3" />
            </Button>
          </a>
        </div>
      </Field>
    </div>
  );
}
