"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemePresetProvider } from "@/features/theme-presets";
import type { ComponentProps } from "react";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemePresetProvider>{children}</ThemePresetProvider>
    </NextThemesProvider>
  );
}
