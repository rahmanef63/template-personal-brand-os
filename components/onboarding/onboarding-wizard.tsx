"use client";

// Host adapter for the onboarding-wizard slice (rr add onboarding-wizard).
// Wires Convex (settings.upsert / seed.seedSample / setup.status), the
// Convex-coupled ImageField, and the theme-presets bridge (grouped registry
// + swatches + live preview) into the props-driven wizard.

import * as React from "react";
import { useConvex, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ImageField } from "@/components/image-field";
import { TEMPLATE_DEFAULT_PRESET } from "@/components/theme-provider";
import {
  groupTweakcnPresets,
  tweakcnSwatches,
  useThemePreset,
} from "@/features/theme-presets";
import {
  OnboardingWizard as WizardView,
  type PresetOption,
} from "@/features/onboarding-wizard";

export function OnboardingWizard({ onDone }: { onDone: () => void }) {
  const upsert = useMutation(api.settings.upsert);
  const convex = useConvex();
  const seedSample = useMutation(api.seed.seedSample);
  const importAll = useMutation(api.backup.importAll);
  const status = useQuery(api.setup.status);
  const { registry, preview } = useThemePreset();

  const presetOptions = React.useMemo<PresetOption[]>(() => {
    if (!registry) return [];
    return groupTweakcnPresets(registry.items).flatMap((g) =>
      g.items.map((p) => ({
        name: p.name,
        group: g.label,
        swatches: tweakcnSwatches(p),
      })),
    );
  }, [registry]);

  return (
    <WizardView
      onDone={onDone}
      save={(fields) => upsert(fields)}
      seedSample={() => seedSample({})}
      seeded={status?.seeded}
      exportJson={() => convex.query(api.backup.exportAll, {})}
      importJson={(snapshot) => importAll({ snapshot })}
      ImageField={ImageField}
      presetOptions={presetOptions}
      defaultPresetLabel={`Bawaan template (${TEMPLATE_DEFAULT_PRESET})`}
      onPresetPreview={preview}
    />
  );
}
