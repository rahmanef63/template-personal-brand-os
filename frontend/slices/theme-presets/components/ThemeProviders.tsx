"use client";

import { ThemeProvider } from "next-themes";
import { ThemePresetProvider } from "./ThemePresetProvider";
import type { ReactNode } from "react";

/**
 * App-wide theme providers. next-themes drives light/dark/system mode;
 * ThemePresetProvider (from the theme-presets slice) layers runtime
 * tweakcn color-preset swapping on top. Mounted high in the root layout
 * so every route (public + dashboard) shares the same theme state.
 */
export function ThemeProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemePresetProvider>{children}</ThemePresetProvider>
    </ThemeProvider>
  );
}
