import * as React from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { aiFlag, nid, rel, usePostComments, useStore } from "@/features/_app/store";

export function CommentSection({ postId, postTitle }: { postId: string; postTitle: string }) {
  const comments = usePostComments(postId);
  const { dispatch } = useStore();
  const [author, setAuthor] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [body, setBody] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!author || !email.includes("@") || body.length < 4) {
      toast.error("Lengkapi nama, email, dan komentar minimal 4 karakter");
      return;
    }
    const flag = aiFlag(body);
    dispatch({
      type: "comment.create",
      comment: {
        id: nid("com"),
        postId,
        postTitle,
        author,
        email,
        body,
        status: flag === "spam" ? "spam" : "pending",
        aiFlag: flag,
        ts: Date.now(),
      },
    });
    toast.success(
      flag === "spam"
        ? "Komentar masuk antrian moderasi (terdeteksi spam)"
        : "Komentar terkirim — menunggu moderasi admin",
    );
    setBody("");
  }

  return (
    <section className="mt-16 border-t border-border/60 pt-10">
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <MessageSquare className="size-4" />
        Comments ({comments.length})
      </h2>

      <ul className="mt-4 space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada komentar — jadilah yang pertama.</p>
        )}
        {comments.map((c) => (
          <li key={c.id} className="rounded-md border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="grid size-7 place-items-center rounded-full bg-muted text-[11px]">
                {c.author.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-medium text-foreground">{c.author}</span>
              <span>· {rel(c.ts)}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed">{c.body}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <div className="grid gap-2 md:grid-cols-2">
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nama" />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com" type="email" />
        </div>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tulis komentar…" rows={4} />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground">
            AI moderation aktif. Comment akan masuk antrian sebelum tampil.
          </p>
          <Button type="submit" size="sm" className="gap-1">
            <Send className="size-3.5" /> Kirim komentar
          </Button>
        </div>
      </form>
    </section>
  );
}
