import { LandingEditorView } from "@/features/_shared/landing";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LandingEditorView id={id} />;
}
