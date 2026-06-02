import type { Metadata } from "next";
import { Suspense } from "react";
import { Hanken_Grotesk, Fraunces } from "next/font/google";
import { ConvexClientProvider } from "@/components/convex-provider";
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
  title: { default: "personal-brand-os", template: "%s — personal-brand-os" },
  description: "Built with rahman-resources kitab.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </Suspense>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
