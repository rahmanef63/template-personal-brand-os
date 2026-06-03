"use client";

/**
 * Real AI assistant FAB — replaces the old canned, store-coupled `ChatFab`
 * (components/templates/personal-brand/shared/ui/chat-fab.tsx) that returned
 * fake replies. This is the same reusable ai-chat widget the other templates
 * use, copied in and self-contained.
 *
 * Wires to the ai-chat convex action (`features/aiChat/action.chat`) which
 * calls Claude via the `ai` SDK + @ai-sdk/anthropic. The action is key-guarded:
 * when ANTHROPIC_API_KEY is not set on the deployment it returns a notice
 * instead of throwing, so this widget renders and degrades gracefully — the
 * build / prerender never needs the key.
 *
 * Mounted on the public site alongside <DemoRibbon /> (kept as-is).
 */

import * as React from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; text: string; notice?: boolean };

const SUGGESTIONS = [
  "Berapa harga strategy sprint?",
  "Bagaimana cara mulai kerja sama?",
  "Topik tulisan apa yang lagi populer?",
];

export function AiChatFab({ brand = "kami" }: { brand?: string }) {
  const chat = useAction(api.features.aiChat.action.chat);
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [msgs, setMsgs] = React.useState<Msg[]>([
    {
      role: "assistant",
      text: `Hai 👋 aku asisten ${brand}. Tanya apa saja soal layanan, tulisan, atau cara mulai kerja sama.`,
    },
  ]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length]);

  async function send(q: string) {
    const question = q.trim();
    if (!question || pending) return;
    setText("");
    const history = msgs
      .filter((m) => !m.notice)
      .map((m) => ({ role: m.role, content: m.text }));
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setPending(true);
    try {
      const res = await chat({ prompt: question, history });
      if (res.ok && res.text) {
        setMsgs((m) => [...m, { role: "assistant", text: res.text! }]);
      } else {
        setMsgs((m) => [
          ...m,
          { role: "assistant", text: res.notice ?? "AI is unavailable right now.", notice: true },
        ]);
      }
    } catch (e) {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          text: `Koneksi ke asisten gagal: ${(e as Error).message}`,
          notice: true,
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {open && (
        <Card className="fixed bottom-20 right-5 z-40 flex h-[26rem] w-[20rem] flex-col overflow-hidden border-border/60 shadow-xl sm:w-[22rem]">
          <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-primary" /> Asisten {brand}
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <CardContent ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : m.notice
                        ? "border border-dashed border-border/70 bg-muted/40 text-muted-foreground"
                        : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">…</div>
              </div>
            )}
            {msgs.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(text);
            }}
            className="flex items-center gap-2 border-t p-3"
          >
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tulis pesan…"
              className="h-9"
              disabled={pending}
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0" aria-label="Kirim" disabled={pending}>
              <Send className="size-4" />
            </Button>
          </form>
        </Card>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Buka asisten AI"
        className="fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:-translate-y-0.5"
      >
        {open ? <X className="size-5" /> : <Bot className="size-5" />}
      </button>
    </>
  );
}
