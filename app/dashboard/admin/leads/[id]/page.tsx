import { LeadEditorView } from "@/features/admin/leads/LeadEditorView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LeadEditorView id={id} />;
}
