"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Applies owner-configured branding (set in the onboarding wizard / admin
 * Settings, stored in Convex) at runtime: document title, favicon, and the
 * --brand accent. Client-side so a non-coder's changes show up with no rebuild.
 */
export function BrandHead() {
  const s = useQuery(api.settings.get);
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
  return null;
}
