"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Filter, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { rel, usePosts, useStore } from "@/features/_app/store";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { PUBLIC_BASE } from "@/features/_app/nav-config";

export function PostsList() {
  const { dispatch } = useStore();
  const posts = usePosts();
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "draft" | "scheduled" | "published">("all");

  const filtered = React.useMemo(() => {
    return posts.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [posts, q, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
          <p className="text-sm text-muted-foreground">
            {posts.length} total · {posts.filter((p) => p.status === "draft").length} draft · {posts.filter((p) => p.status === "published").length} published
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-9 w-48" />
          </div>
          <Button variant="outline" size="sm" className="gap-1"><Filter className="size-3.5" /> All ({posts.length})</Button>
          <Button asChild size="sm" className="gap-1">
            <Link href={`${ADMIN_BASE}/posts/new`}><Plus className="size-4" /> New post</Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-1 text-xs">
        {(["all", "draft", "scheduled", "published"] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={statusFilter === s ? "default" : "outline"}
            onClick={() => setStatusFilter(s)}
            className={
              "h-7 rounded-full px-3 text-xs capitalize " +
              (statusFilter === s ? "" : "border-border/60 text-muted-foreground")
            }
          >
            {s} ({s === "all" ? posts.length : posts.filter((p) => p.status === s).length})
          </Button>
        ))}
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">Tidak ada post yang cocok.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Updated</th>
                  <th className="px-4 py-3 text-right">Views</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3">
                      <Link href={`${ADMIN_BASE}/posts/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
                      <p className="text-[11px] text-muted-foreground">/blog/{p.slug}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{p.author}</td>
                    <td className="px-4 py-3 text-muted-foreground">{rel(p.publishedAt || Date.now())}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">{p.views.toLocaleString()}</td>
                    <td className="flex items-center gap-1 px-4 py-3">
                      {p.status === "published" && (
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`${PUBLIC_BASE}/blog/${p.slug}`} target="_top"><Eye className="size-3.5" /></Link>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Hapus post "${p.title}"?`)) {
                            dispatch({ type: "post.delete", id: p.id });
                            toast.success("Post dihapus");
                          }
                        }}
                      >
                        <Trash2 className="size-3.5 text-rose-400" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    scheduled: "bg-amber-500/15 text-amber-300 hover:bg-amber-500/15",
    review: "bg-blue-500/15 text-blue-300 hover:bg-blue-500/15",
    published: "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15",
  };
  return <Badge className={"rounded-full text-[10px] capitalize " + (map[status] ?? "")}>{status}</Badge>;
}
