import * as React from "react";
import { Sparkles, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PostStatus } from "../../../shared/types";
import { COVERS, TAGS } from "./post-editor-data";
import { ImageField } from "@/components/image-field";

export type PostEditorSidebarProps = {
  title: string;
  excerpt: string;
  tag: string;
  setTag: (v: string) => void;
  cover: string;
  setCover: (v: string) => void;
  status: PostStatus;
  setStatus: (v: PostStatus) => void;
  hasExisting: boolean;
  onAiOutline: () => void;
  onAiHeadlines: () => void;
  onDelete: () => void;
};

export function PostEditorSidebar(props: PostEditorSidebarProps) {
  const {
    title, excerpt, tag, setTag, cover, setCover, status, setStatus,
    hasExisting, onAiOutline, onAiHeadlines, onDelete,
  } = props;

  return (
    <div className="space-y-4">
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5">
          <Tabs defaultValue="ai">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="meta">Meta</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="mt-3 space-y-2">
              <Button variant="outline" size="sm" className="w-full gap-1" onClick={onAiOutline}>
                <Wand2 className="size-3.5" /> Generate outline
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-1" onClick={onAiHeadlines}>
                <Sparkles className="size-3.5" /> Suggest headline
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-1" disabled>
                <Wand2 className="size-3.5" /> Adjust tone
              </Button>
              <p className="text-[10px] text-muted-foreground">model: claude-sonnet-4-6</p>
            </TabsContent>
            <TabsContent value="meta" className="mt-3 space-y-2 text-sm">
              <div>
                <label className="text-xs text-muted-foreground">Tag</label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-2 py-1 text-sm"
                >
                  {TAGS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cover</label>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  {COVERS.map((c) => (
                    <Button
                      key={c}
                      variant="outline"
                      onClick={() => setCover(c)}
                      aria-label="Select cover"
                      className={
                        "h-auto aspect-video overflow-hidden rounded-md p-0 " +
                        (c === cover ? "border-foreground" : "border-border/60 opacity-60 hover:opacity-100")
                      }
                      style={{ backgroundImage: `url(${c})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    />
                  ))}
                </div>
                <div className="mt-1">
                  <ImageField onUploaded={setCover} label="Upload cover" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="seo" className="mt-3 space-y-2 text-sm">
              <p className="text-xs text-muted-foreground">Meta title</p>
              <p className="rounded border bg-muted/30 p-2 text-xs">{title || "—"}</p>
              <p className="text-xs text-muted-foreground">Meta description</p>
              <p className="rounded border bg-muted/30 p-2 text-xs">{excerpt || "—"}</p>
              <p className="text-[10px] text-muted-foreground">Auto-derived from title + excerpt.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-2 p-5 text-sm">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</p>
          <div className="flex flex-wrap gap-1">
            {(["draft", "scheduled", "published"] as PostStatus[]).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={status === s ? "default" : "outline"}
                onClick={() => setStatus(s)}
                className={
                  "h-7 rounded-full px-3 text-xs capitalize " +
                  (status === s ? "" : "border-border/60 text-muted-foreground")
                }
              >
                {s}
              </Button>
            ))}
          </div>
          {hasExisting && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start gap-1 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
              onClick={onDelete}
            >
              <Trash2 className="size-3.5" /> Delete post
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
