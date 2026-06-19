import type { Metadata } from "next";
import { Hanken_Grotesk, Fraunces } from "next/font/google";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ConvexClientProvider } from "@/components/convex-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { BrandHead } from "@/components/brand-head";
import { Toaster } from "sonner";
import "./globals.css";

// Editorial pairing: characterful serif display + clean grotesk body.
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const DEFAULT_NAME = "Personal Brand OS";
const DEFAULT_DESC =
  "Personal site OS — blog + portfolio, testimonials, FAQ + pricing, newsletter + leads, own admin dashboard. Free website template, clone-to-own.";

// SEO/OG <head> driven by the owner's Convex settings (server-side, so social
// scrapers + crawlers that don't run JS see the real brand). BrandHead handles
// the runtime browser title/favicon; this handles the initial HTML + OG tags.
export async function generateMetadata(): Promise<Metadata> {
  const s = await fetchQuery(api.settings.get, {}).catch(() => null);
  const name = s?.siteName || DEFAULT_NAME;
  const description = s?.seoDescription || DEFAULT_DESC;
  const image = s?.logoUrl || s?.profileImageUrl || undefined;
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ??
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
    ),
    title: { default: name, template: `%s — ${name}` },
    description,
    openGraph: {
      title: name,
      description,
      type: "website",
      siteName: name,
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ConvexClientProvider>
            <BrandHead />
            {children}
          </ConvexClientProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
