import type { Metadata } from "next";
import { ServicesPage } from "@/features/services/ServicesPage";

export const metadata: Metadata = { title: "Services", description: "Mentoring, strategy sprints, and workshops." };

export default function Page() {
  return <ServicesPage />;
}
