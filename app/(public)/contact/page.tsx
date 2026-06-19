import type { Metadata } from "next";
import { ContactPage } from "@/features/contact/ContactPage";

export const metadata: Metadata = { title: "Contact", description: "Send a message — usually replies within 1–2 working days." };

export default function Page() {
  return <ContactPage />;
}
