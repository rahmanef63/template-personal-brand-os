import type { Metadata } from "next";
import { OrderTrackingPage } from "@/features/checkout/OrderTrackingPage";

export const metadata: Metadata = { title: "Lacak pesanan" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderTrackingPage orderId={id} />;
}
