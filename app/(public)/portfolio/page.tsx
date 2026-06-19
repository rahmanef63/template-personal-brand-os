import type { Metadata } from "next";
import { PortfolioListPage } from "@/features/portfolio/PortfolioListPage";

export const metadata: Metadata = { title: "Portfolio", description: "Selected projects and case studies." };

export default function Page() {
  return <PortfolioListPage />;
}
