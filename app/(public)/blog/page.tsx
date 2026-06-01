import type { Metadata } from "next";
import { BlogList } from "@/components/templates/personal-brand/slices/blog/BlogList";

export const metadata: Metadata = { title: "Blog", description: "Articles, essays, and notes." };

export default function Page() {
  return <BlogList />;
}
