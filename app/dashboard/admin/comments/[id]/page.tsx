import { CommentEditorView } from "@/features/admin/comments/CommentEditorView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommentEditorView id={id} />;
}
