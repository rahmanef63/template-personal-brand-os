import type { Metadata } from "next";
import { BlogList } from "@/features/blog/BlogList";

export const metadata: Metadata = { title: "Blog", description: "Articles, essays, and notes." };

export default function Page() {
  return <BlogList />;
}
