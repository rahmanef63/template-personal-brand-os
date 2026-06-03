import type { Metadata } from "next";
import { type ReactNode } from "react";
import { StoreProvider } from "@/components/templates/personal-brand/shared/store";
import { SiteLoader } from "@/components/site-loader";
import { DemoRibbon } from "@/components/demo-ribbon";
import { PublicChrome } from "@/components/public-chrome";
import { AiChatFab } from "@/components/ai-chat-fab";
import { DEFAULT_SITE_CONFIG } from "@/components/templates/personal-brand/shared/site-config";

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
    <StoreProvider>
      <SiteLoader brandLetter={DEFAULT_SITE_CONFIG.brandLetter} />
      <PublicChrome>{children}</PublicChrome>
      <AiChatFab brand={DEFAULT_SITE_CONFIG.brandName} />
      <DemoRibbon />
    </StoreProvider>
  );
}
