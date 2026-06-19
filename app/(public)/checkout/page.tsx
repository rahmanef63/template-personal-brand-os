import type { Metadata } from "next";
import { CheckoutPage } from "@/features/checkout/CheckoutPage";

export const metadata: Metadata = { title: "Checkout" };

export default function Page() {
  return <CheckoutPage />;
}
