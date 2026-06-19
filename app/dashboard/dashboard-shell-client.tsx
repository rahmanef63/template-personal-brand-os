"use client";

import type { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardShell } from "@/features/_shared/ui/dashboard-shell";
import { useStore } from "@/features/_app/store";
import { DEFAULT_SITE_CONFIG } from "@/features/_app/site-config";
import {
  ADMIN_PANEL_BASE,
  ADMIN_SETTINGS_NAV,
  OWNER_USER,
  buildAdminNav,
} from "@/features/_app/nav-config";

export function DashboardShellClient({ children }: { children: ReactNode }) {
  const { state } = useStore();
  const me = useQuery(api.users.currentUser);
  const settings = useQuery(api.settings.get);
  const primaryNavGroups = buildAdminNav(state);

  // Real signed-in admin (falls back to the template default before load).
  const user = me
    ? {
        name: me.name || me.email || "Admin",
        email: me.email ?? undefined,
        role: me.role,
        initials: me.initials,
      }
    : OWNER_USER;

  // Owner branding in the sidebar/topbar (brand name from onboarding settings).
  const brand = settings?.siteName
    ? {
        ...DEFAULT_SITE_CONFIG,
        brandName: settings.siteName,
        brandLetter: settings.siteName.charAt(0).toUpperCase() || DEFAULT_SITE_CONFIG.brandLetter,
      }
    : DEFAULT_SITE_CONFIG;

  return (
    <DashboardShell
      brand={brand}
      appLabel="Admin Panel"
      homeHref={ADMIN_PANEL_BASE}
      primaryNavGroups={primaryNavGroups}
      settingsNav={ADMIN_SETTINGS_NAV}
      user={user}
      searchPlaceholder="Search posts, leads, contacts…"
    >
      {children}
    </DashboardShell>
  );
}
