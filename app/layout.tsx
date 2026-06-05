import type { Metadata } from "next";
import { Hanken_Grotesk, Fraunces } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  ),
  title: { default: "Personal Brand OS", template: "%s — Personal Brand OS" },
  description:
    "Personal site OS — blog + portfolio, testimonials, FAQ + pricing, newsletter + leads, own admin dashboard. Free website template, clone-to-own.",
  openGraph: {
    title: "Personal Brand OS",
    description:
      "Personal site OS — blog + portfolio, testimonials, FAQ + pricing, newsletter + leads, own admin dashboard. Free website template, clone-to-own.",
    type: "website",
    siteName: "Personal Brand OS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Brand OS",
    description:
      "Personal site OS — blog + portfolio, testimonials, FAQ + pricing, newsletter + leads, own admin dashboard. Free website template, clone-to-own.",
  },
};

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
