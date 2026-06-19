import { ChatSessionEditorView } from "@/features/admin/chatbot/ChatSessionEditorView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatSessionEditorView id={id} />;
}
