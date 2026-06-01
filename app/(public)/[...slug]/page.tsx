import { CatchAllRenderer } from "./catch-all-renderer";

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const joined = (slug ?? []).join("/");
  return <CatchAllRenderer slug={joined} />;
}
