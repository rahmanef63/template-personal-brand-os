import type { Metadata } from "next";
import { ResourcesPage } from "@/features/resources/ResourcesPage";

export const metadata: Metadata = { title: "Resources", description: "Free downloads — guides, templates, and worksheets." };

export default function Page() {
  return <ResourcesPage />;
}
