# onboarding-wizard — host wiring

Props-driven (R3). The slice never imports `convex/react`; the host injects
backend calls. Typical Convex wiring (personal-brand-os style):

```tsx
"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OnboardingWizard, type PresetOption } from "@/features/onboarding-wizard";
import { useThemePreset } from "@/features/theme-presets"; // optional bridge
import { tweakcnSwatches } from "@/features/theme-presets";
import { ImageField } from "@/components/image-field";      // host upload control

export function OnboardingWizardHost({ onDone }: { onDone: () => void }) {
  const upsert = useMutation(api.settings.upsert);
  const seedSample = useMutation(api.seed.seedSample);
  const status = useQuery(api.setup.status);
  const { registry, preview } = useThemePreset();

  const presetOptions: PresetOption[] = (registry?.items ?? []).map((p) => ({
    name: p.name,
    swatches: tweakcnSwatches(p),
  }));

  return (
    <OnboardingWizard
      onDone={onDone}
      save={(fields) => upsert(fields)}
      seedSample={() => seedSample({})}
      seeded={status?.seeded}
      ImageField={ImageField}
      presetOptions={presetOptions}
      defaultPresetLabel="Bawaan template (cosmic-night)"
      onPresetPreview={(name) => void preview(name)}
    />
  );
}
```

## Contract expectations

| Prop | Backend piece |
|---|---|
| `save` | `settings.upsert` mutation accepting all `OnboardingFields` + `markOnboarded: true` |
| `seedSample` | auth-gated only-when-empty seed mutation (optional) |
| `seeded` | `setup.status().seeded` (optional) |
| `ImageField` | upload control `{ label, onUploaded(url) }` (optional — fields hidden when omitted) |
| `presetOptions` | theme system names or `{ name, label?, group?, swatches? }` (optional — picker hidden when omitted) |
| `onPresetPreview` | live, non-persisting theme apply; `null` restores template default |

## Notes

- The preset picker is a shadcn `Select` — popover renders in the themed
  portal, readable on every preset/dark-mode combo (the old native
  `<select>` inherited unreadable option colors on some platforms).
- "Lewati setup" saves only `markOnboarded: true` and calls
  `onPresetPreview(null)` so any browsed-but-unsaved preset is reverted.
- Show the wizard from your admin gate when `status.onboarded === false`,
  unmount on `onDone()`.
