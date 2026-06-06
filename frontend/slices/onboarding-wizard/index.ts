/** onboarding-wizard — first-run site setup for clone-to-own templates.
 *  Props-driven (R3): host injects backend calls (save/seedSample/seeded),
 *  upload control (ImageField), and theme bridge (presetOptions +
 *  onPresetPreview). See HOST-SETUP.md for the wiring recipe. */

export { OnboardingWizard } from "./components/OnboardingWizard";
export { StepIdentity, StepContent, StepDone, Field } from "./components/steps";
export { StepBranding } from "./components/step-branding";
export { ThemePresetField } from "./components/theme-preset-field";
export {
  normalizePresetOptions,
  type ImageFieldComponent,
  type OnboardingFields,
  type PresetOption,
} from "./lib/types";
