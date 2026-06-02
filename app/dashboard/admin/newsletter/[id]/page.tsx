import { SubscriberEditorView } from "@/components/templates/personal-brand/slices/admin/newsletter/SubscriberEditorView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubscriberEditorView id={id} />;
}
