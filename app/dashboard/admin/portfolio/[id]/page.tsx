import { PortfolioEditor } from "@/components/templates/personal-brand/slices/admin/portfolio/PortfolioEditor";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PortfolioEditor id={id} />;
}
