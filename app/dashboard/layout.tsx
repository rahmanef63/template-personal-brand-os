import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { StoreProvider } from "@/features/_app/store";
import { DEFAULT_SITE_CONFIG } from "@/features/_app/site-config";
import { AdminGate } from "@/components/admin-gate";
import { DashboardShellClient } from "./dashboard-shell-client";

export const metadata: Metadata = {
  title: { default: `${DEFAULT_SITE_CONFIG.brandName} dashboard`, template: `%s — dashboard` },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <StoreProvider>
        <AdminGate>
          <DashboardShellClient>{children}</DashboardShellClient>
        </AdminGate>
      </StoreProvider>
    </Suspense>
  );
}
