"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemePresetProvider } from "@/features/theme-presets";
import type { ComponentProps } from "react";

/** Template's build-time color preset — matches the marketing poster
 *  (dark violet + purple accent). The owner overrides it site-wide via
 *  the onboarding wizard or Settings → Site (saved to
 *  siteSettings.themePreset); visitors override locally via the
 *  switcher. */
export const TEMPLATE_DEFAULT_PRESET = "cosmic-night";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemePresetProvider hostDefault={TEMPLATE_DEFAULT_PRESET}>{children}</ThemePresetProvider>
    </NextThemesProvider>
  );
}
