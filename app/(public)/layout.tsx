import type { Metadata } from "next";
import { type ReactNode } from "react";
import { StoreProvider } from "@/components/templates/personal-brand/shared/store";
import { SiteLoader } from "@/components/site-loader";
import { DemoRibbon } from "@/components/demo-ribbon";
import { PublicChrome } from "@/components/public-chrome";
import { AiChatFab } from "@/components/ai-chat-fab";
import { DEFAULT_SITE_CONFIG } from "@/components/templates/personal-brand/shared/site-config";

const c = DEFAULT_SITE_CONFIG;

/** Demo/clone-aware canonical origin — env wins over the seeded
 *  site-config domain so og/canonical URLs always match the real host. */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : c.baseUrl);

export const metadata: Metadata = {
  title: { default: `${c.brandName} — ${c.tagline}`, template: `%s — ${c.brandName}` },
  description: c.description,
  applicationName: c.brandName,
  authors: [{ name: c.ownerName }],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: c.brandName,
    title: `${c.brandName} — ${c.tagline}`,
    description: c.description,
    url: SITE_URL,
    images: ["/opengraph-image.jpg"],
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
