import type { Metadata } from "next";
import { CheckoutPage } from "@/components/templates/personal-brand/slices/checkout/CheckoutPage";

export const metadata: Metadata = { title: "Checkout" };

export default function Page() {
  return <CheckoutPage />;
}
