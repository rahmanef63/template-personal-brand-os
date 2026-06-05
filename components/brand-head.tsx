"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { useTheme } from "next-themes";
import { api } from "@/convex/_generated/api";
import { useThemePreset } from "@/features/theme-presets";

/**
 * Applies owner-configured branding (set in the onboarding wizard / admin
 * Settings, stored in Convex) at runtime: document title, favicon, the
 * --brand accent, the site-wide color preset, and the default light/dark
 * mode. Client-side so a non-coder's changes show up with no rebuild.
 */
export function BrandHead() {
  const s = useQuery(api.settings.get);
  const { setSiteDefault } = useThemePreset();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    if (!s) return;
    if (s.siteName) {
      document.title = s.tagline ? `${s.siteName} — ${s.tagline}` : s.siteName;
    }
    if (s.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = s.faviconUrl;
    }
    if (s.brandColor) {
      document.documentElement.style.setProperty("--brand", s.brandColor);
    }
  }, [s]);

  // Site-wide color preset (owner default; visitors with an explicit
  // localStorage choice keep theirs — resolution lives in the provider).
  React.useEffect(() => {
    if (s === undefined) return;
    setSiteDefault(s?.themePreset || null);
  }, [s, setSiteDefault]);

  // Owner's default light/dark mode — only when this visitor never chose a
  // mode themselves. next-themes persists every setTheme under "theme", so a
  // sibling marker records "this value came from the site default": if the
  // stored value diverges from the marker, the visitor picked their own.
  React.useEffect(() => {
    const d = s?.themeDefault;
    if (!d || !["light", "dark", "system"].includes(d)) return;
    try {
      const stored = localStorage.getItem("theme");
      const marker = localStorage.getItem("theme-site-applied");
      if (stored && stored !== marker) return; // visitor's own choice wins
      if (stored === d) return; // already applied
      setTheme(d);
      localStorage.setItem("theme-site-applied", d);
    } catch { /* ignore */ }
  }, [s, setTheme]);

  return null;
}
