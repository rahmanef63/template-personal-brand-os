import type { Metadata } from "next";
import { SetupHealth } from "@/components/setup/setup-health";

export const metadata: Metadata = {
  title: "Setup",
  description: "Status & langkah setup website kamu.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SetupHealth />;
}
