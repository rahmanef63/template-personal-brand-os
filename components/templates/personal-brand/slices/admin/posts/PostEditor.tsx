"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Eye, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { nid, slugify, useStore } from "../../../shared/store";
import type { Post, PostStatus } from "../../../shared/types";
import { ADMIN_BASE, PUBLIC_BASE } from "../../../shared/nav-config";
import { COVERS, TAGS } from "./post-editor-data";
import { PostEditorSidebar } from "./PostEditorSidebar";

export function PostEditor({ id }: { id: string | null }) {
  const router = useRouter();
  const { state, dispatch } = useStore();

  const existing = id ? state.posts.find((p) => p.id === id) ?? null : null;

  const [title, setTitle] = React.useState(existing?.title ?? "");
  const [slug, setSlug] = React.useState(existing?.slug ?? "");
  const [excerpt, setExcerpt] = React.useState(existing?.excerpt ?? "");
  const [body, setBody] = React.useState(
    existing?.body ??
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  );
  const [tag, setTag] = React.useState(existing?.tag ?? TAGS[0]);
  const [cover, setCover] = React.useState(existing?.cover ?? COVERS[0]);
  const [status, setStatus] = React.useState<PostStatus>(existing?.status ?? "draft");

  // Auto-slug from title for new posts.
  React.useEffect(() => {
    if (!existing && title && !slug) setSlug(slugify(title));
  }, [title, existing, slug]);

  const readMin = Math.max(1, Math.round(body.split(/\s+/).length / 220));

  function save(nextStatus?: PostStatus) {
    if (!title) { toast.error("Title wajib diisi"); return; }
    if (!slug) { toast.error("Slug wajib diisi"); return; }
    const finalStatus = nextStatus ?? status;
    const post: Post = {
      id: existing?.id ?? nid("post"),
      slug, title, excerpt: excerpt || title, body, cover, tag,
      author: existing?.author ?? "Lorem D.",
      status: finalStatus,
      publishedAt:
        finalStatus === "published"
          ? existing?.status === "published" ? existing.publishedAt : Date.now()
          : existing?.publishedAt ?? 0,
      views: existing?.views ?? 0,
      readMin,
    };
    dispatch({ type: "post.upsert", post });
    setStatus(finalStatus);
    toast.success(
      finalStatus === "published" ? "Post dipublish — cek tab Public"
        : finalStatus === "scheduled" ? "Post dijadwalkan"
        : "Draft tersimpan",
    );
    if (!existing) router.push(`${ADMIN_BASE}/posts/${post.id}`);
  }

  function aiOutline() {
    const outline = `Hook: ${title || "Lorem opener"} — kenapa ini penting sekarang.\n\n## Section 1 — Konteks\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n## Section 2 — Argumen utama\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\n## Section 3 — Implikasi\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum.\n\n## Closing\nCTA: invite reader untuk diskusi via newsletter.`;
    setBody(outline);
    toast.success("AI outline generated");
  }

  function aiHeadlines() {
    const variants = [
      "Lorem ipsum dolor sit amet — yang sering dilewatkan",
      "5 alasan kenapa lorem ipsum penting di 2026",
      "Cara kerja lorem ipsum — penjelasan untuk founder",
      "Lorem ipsum vs alternatives: panduan praktis",
    ];
    setTitle(variants[Math.floor(Math.random() * variants.length)]);
    toast.success("Headline regenerated");
  }

  function onDelete() {
    if (existing && confirm("Delete post?")) {
      dispatch({ type: "post.delete", id: existing.id });
      router.push(`${ADMIN_BASE}/posts`);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild size="sm" variant="ghost" className="gap-1">
          <Link href={`${ADMIN_BASE}/posts`}><ArrowLeft className="size-3.5" /> Posts</Link>
        </Button>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm">{existing ? "Edit" : "New post"}</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {existing?.status === "published" && (
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link href={`${PUBLIC_BASE}/blog/${existing.slug}`} target="_top">
                <Eye className="size-3.5" /> View live
              </Link>
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => save("draft")} className="gap-1">
            <Save className="size-3.5" /> Save draft
          </Button>
          <Button size="sm" onClick={() => save("published")} className="gap-1">
            <ArrowUpRight className="size-3.5" /> Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="space-y-4 p-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="h-12 border-none bg-transparent text-2xl font-semibold tracking-tight focus-visible:ring-0"
            />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">/blog/</span>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="h-7 w-64" />
              <Badge variant="outline" className="ml-auto rounded-full text-[10px]">{readMin} min read</Badge>
            </div>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short excerpt — appears in blog list and SEO meta."
              rows={2}
            />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={20}
              placeholder="Tulis isi post — paragraph dipisah dengan baris kosong."
              className="font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>

        <PostEditorSidebar
          title={title}
          excerpt={excerpt}
          tag={tag}
          setTag={setTag}
          cover={cover}
          setCover={setCover}
          status={status}
          setStatus={setStatus}
          hasExisting={!!existing}
          onAiOutline={aiOutline}
          onAiHeadlines={aiHeadlines}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
