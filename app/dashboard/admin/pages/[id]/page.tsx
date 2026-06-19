import { PageEditorView } from "@/features/_shared/pages/PageEditorView";
import {
  ADMIN_BASE,
  PUBLIC_BASE,
} from "@/features/_app/nav-config";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PageEditorView id={id} publicBase={PUBLIC_BASE} adminBase={ADMIN_BASE} />;
}
