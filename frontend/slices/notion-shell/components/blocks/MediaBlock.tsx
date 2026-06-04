"use client";

/** MediaBlock — block-types "video" and "audio". Paste a URL → native
 *  <video controls> / <audio controls> player + optional caption. Pure
 *  callback: URL in `block.url`, caption in `block.caption`. (rr-pragmatic
 *  vs notion-page-clone's Convex-storage upload — host can swap the URL
 *  source for a real uploader.) */

import { useState } from "react";
import { Film, Music, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BlockRendererProps } from "../../types";

function makeMedia(kind: "video" | "audio") {
  const Icon = kind === "video" ? Film : Music;
  const label = kind === "video" ? "Video URL" : "Audio URL";

  return function MediaBlock({ block, onUpdate }: BlockRendererProps) {
    const url = block.url ?? "";
    const [editing, setEditing] = useState(!url);

    if (editing || !url) {
      return (
        <div className="rounded-md border border-dashed border-border bg-muted/20 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5" /> {label}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              autoFocus type="url" inputMode="url" value={url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder={`https://example.com/clip.${kind === "video" ? "mp4" : "mp3"}`}
              className="h-8 text-xs"
            />
            <Button size="sm" disabled={!url} onClick={() => setEditing(false)} className="h-8 text-xs">
              Embed
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="group/media my-1 space-y-1">
        {kind === "video" ? (
          <video src={url} controls className="max-h-80 w-full rounded-md border border-border" />
        ) : (
          <audio src={url} controls className="w-full" />
        )}
        <div className="flex items-center gap-2">
          <Input
            value={block.caption ?? ""}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Add a caption…"
            className="h-6 flex-1 border-0 bg-transparent px-0 text-xs text-muted-foreground shadow-none focus-visible:ring-0"
          />
          <Button
            variant="ghost" size="icon" onClick={() => setEditing(true)}
            aria-label="Change URL" className="h-6 w-6 text-muted-foreground opacity-0 transition group-hover/media:opacity-100"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };
}

export const VideoBlock = makeMedia("video");
export const AudioBlock = makeMedia("audio");
