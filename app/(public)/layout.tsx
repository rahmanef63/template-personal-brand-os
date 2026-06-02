import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { SiteShell } from "@/components/templates/_shared/ui/site-shell";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { StoreProvider } from "@/components/templates/personal-brand/shared/store";
import { ChatFab } from "@/components/templates/personal-brand/shared/ui/chat-fab";
import { DEFAULT_SITE_CONFIG } from "@/components/templates/personal-brand/shared/site-config";
import {
  FOOTER_COLUMNS,
  FOOTER_TAGLINE,
  PUBLIC_BASE,
  PUBLIC_CTA,
  PUBLIC_NAV,
} from "@/components/templates/personal-brand/shared/nav-config";

const c = DEFAULT_SITE_CONFIG;

export const metadata: Metadata = {
  title: { default: `${c.brandName} — ${c.tagline}`, template: `%s — ${c.brandName}` },
  description: c.description,
  applicationName: c.brandName,
  authors: [{ name: c.ownerName }],
  metadataBase: new URL(c.baseUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: c.brandName,
    title: `${c.brandName} — ${c.tagline}`,
    description: c.description,
    url: c.baseUrl,
    locale: c.defaultLocale,
  },
  twitter: { card: "summary_large_image", site: c.twitter, creator: c.twitter },
  themeColor: c.themeColor,
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <StoreProvider>
        <SiteShell
          brand={DEFAULT_SITE_CONFIG}
          homeHref={PUBLIC_BASE}
          navItems={PUBLIC_NAV}
          cta={PUBLIC_CTA}
          navExtras={<ThemeToggle />}
          footerColumns={FOOTER_COLUMNS}
          footerTagline={FOOTER_TAGLINE}
          copyrightHolder={DEFAULT_SITE_CONFIG.brandName}
        >
          {children}
        </SiteShell>
        <ChatFab />
      </StoreProvider>
    </Suspense>
  );
}
