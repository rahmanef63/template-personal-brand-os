import { PostEditor } from "@/components/templates/personal-brand/slices/admin/posts/PostEditor";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostEditor id={id} />;
}
