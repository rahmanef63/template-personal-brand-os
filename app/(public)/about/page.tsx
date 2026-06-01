import type { Metadata } from "next";
import { AboutPage } from "@/components/templates/personal-brand/slices/about/AboutPage";

export const metadata: Metadata = { title: "About", description: "Background, focus areas, and a bit of context." };

export default function Page() {
  return <AboutPage />;
}
