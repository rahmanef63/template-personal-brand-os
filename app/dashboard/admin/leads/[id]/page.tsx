import { LeadEditorView } from "@/components/templates/personal-brand/slices/admin/leads/LeadEditorView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LeadEditorView id={id} />;
}
