"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StepIdentity, StepContent, StepDone } from "./steps";
import { StepBranding } from "./step-branding";
import {
  normalizePresetOptions,
  type ImageFieldComponent,
  type OnboardingFields,
  type PresetOption,
} from "../lib/types";

const STEPS = ["Identitas", "Branding", "Konten", "Selesai"];

/**
 * Post-claim onboarding wizard. Stores ALL site config in the backend
 * (editable later in admin Settings) so a non-coder configures their site
 * with zero code. Shown once (until siteSettings.onboardedAt is set).
 * Skippable.
 *
 * Props-driven (R3): the host injects the backend calls —
 *  - `save`: `settings.upsert` with `markOnboarded: true` merged in
 *  - `seedSample`: `seed.seedSample` (auth-gated, only-when-empty)
 *  - `seeded`: from `setup.status` (hides the seed button when content exists)
 *  - `ImageField`: the repo's backend-coupled upload control (optional)
 *  - `presetOptions` + `onPresetPreview`: theme system bridge (optional) —
 *    e.g. theme-presets slice registry + `previewTweakcnPreset`.
 */
export function OnboardingWizard({
  onDone,
  save,
  seedSample,
  seeded,
  ImageField,
  presetOptions,
  defaultPresetLabel,
  onPresetPreview,
  defaultBrandColor = "#c4583a",
}: {
  onDone: () => void;
  save: (fields: Partial<OnboardingFields> & { markOnboarded: true }) => Promise<unknown>;
  seedSample?: () => Promise<unknown>;
  seeded?: boolean;
  ImageField?: ImageFieldComponent;
  /** Theme presets for the Branding picker (names or rich options; omit to hide). */
  presetOptions?: ReadonlyArray<string | PresetOption>;
  /** Reset-row label, e.g. `Bawaan template (cosmic-night)`. */
  defaultPresetLabel?: string;
  /** Live preview hook — called as the user browses presets (null = default). */
  onPresetPreview?: (name: string | null) => void;
  defaultBrandColor?: string;
}) {
  const [step, setStep] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [justSeeded, setJustSeeded] = React.useState(false);
  const [f, setF] = React.useState<OnboardingFields>({
    siteName: "",
    tagline: "",
    ownerName: "",
    contactEmail: "",
    brandColor: defaultBrandColor,
    themeDefault: "system",
    themePreset: "",
    logoUrl: "",
    faviconUrl: "",
    analyticsId: "",
  });
  const set = (k: keyof OnboardingFields, v: string) => setF((p) => ({ ...p, [k]: v }));
  const alreadySeeded = justSeeded || Boolean(seeded);
  const presets = React.useMemo(() => normalizePresetOptions(presetOptions), [presetOptions]);

  async function finish() {
    setBusy(true);
    try {
      await save({
        siteName: f.siteName || undefined,
        tagline: f.tagline || undefined,
        ownerName: f.ownerName || undefined,
        contactEmail: f.contactEmail || undefined,
        brandColor: f.brandColor || undefined,
        themeDefault: f.themeDefault || undefined,
        themePreset: f.themePreset || undefined,
        logoUrl: f.logoUrl || undefined,
        faviconUrl: f.faviconUrl || undefined,
        analyticsId: f.analyticsId || undefined,
        markOnboarded: true,
      });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  /** Skip = mark onboarded without fields; un-preview any browsed preset. */
  async function skip() {
    onPresetPreview?.(null);
    setBusy(true);
    try {
      await save({ markOnboarded: true });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  async function doSeed() {
    if (!seedSample) return;
    setBusy(true);
    try {
      await seedSample();
      setJustSeeded(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 py-10">
      <Card className="w-full max-w-lg border-border/60">
        <CardContent className="p-7">
          <div className="mb-1 flex items-center gap-2 text-primary">
            <Sparkles className="size-4" />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">
              Setup · {step + 1}/{STEPS.length}
            </span>
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="mb-5 mt-2 h-1.5" />

          {step === 0 && <StepIdentity f={f} set={set} />}
          {step === 1 && (
            <StepBranding
              f={f}
              set={set}
              ImageField={ImageField}
              presetOptions={presets}
              defaultPresetLabel={defaultPresetLabel}
              onPresetPreview={onPresetPreview}
            />
          )}
          {step === 2 && <StepContent alreadySeeded={alreadySeeded} busy={busy} onSeed={doSeed} />}
          {step === 3 && <StepDone siteName={f.siteName} />}

          <div className="mt-7 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)} disabled={busy}>
                <ArrowLeft className="size-4" /> Kembali
              </Button>
            ) : (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={skip}
                disabled={busy}
                className="px-0 text-xs text-muted-foreground"
              >
                Lewati setup
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={busy}>
                Lanjut <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button type="button" onClick={finish} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Selesai"} <Check className="size-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
