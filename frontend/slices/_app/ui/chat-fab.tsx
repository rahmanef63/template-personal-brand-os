"use client";

import * as React from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { aiFlag, nid, useStore } from "../store";
import type { ChatMessage } from "../types";

const VISITOR_KEY = "pbos:visitor";

function getVisitorId(): string {
  if (typeof window === "undefined") return "anon-server";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = "anon-" + Math.random().toString(36).slice(2, 6);
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

const SUGGESTIONS = [
  "Berapa harga strategy sprint?",
  "Bisa share template hiring engineer?",
  "Topik blog apa yang lagi populer?",
];

const FAKE_REPLIES = [
  "Strategy sprint Rp 18jt/sprint, durasi 5 hari, deliverable roadmap + matriks prioritas. Mau saya kirimkan brief contohnya?",
  "Tentu — saya akan kirim ke email kamu. Bisa share email-nya di sini?",
  "Di office hours biasanya saya bahas pricing, hiring, dan eksekusi roadmap. 30 menit, fokus satu masalah.",
  "Mau saya jadwalkan office hours? 30 menit, gratis untuk first-timer.",
];

export function ChatFab() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [sessionId, setSessionId] = React.useState<string | null>(null);

  const session = sessionId ? state.chatSessions.find((s) => s.id === sessionId) ?? null : null;
  const messages: ChatMessage[] = session?.messages ?? [];
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function ensureSession(): string {
    if (sessionId) return sessionId;
    const id = nid("chat");
    setSessionId(id);
    dispatch({
      type: "chat.session.start",
      session: {
        id,
        visitorId: getVisitorId(),
        startedAt: Date.now(),
        flagged: false,
        messages: [
          {
            id: nid("msg"),
            role: "assistant",
            content: "Hai 👋 saya AI Mentor — boleh tau ada yang bisa dibantu?",
            ts: Date.now(),
          },
        ],
      },
    });
    return id;
  }

  function sendText(content: string) {
    const id = ensureSession();
    const flag = aiFlag(content);
    dispatch({
      type: "chat.message",
      sessionId: id,
      flag: !!flag,
      msg: { id: nid("msg"), role: "user", content, ts: Date.now() },
    });
    setText("");

    // Fake assistant reply after 700ms.
    window.setTimeout(() => {
      const reply = FAKE_REPLIES[Math.floor(Math.random() * FAKE_REPLIES.length)];
      dispatch({
        type: "chat.message",
        sessionId: id,
        msg: { id: nid("msg"), role: "assistant", content: reply, ts: Date.now() },
      });
    }, 700);
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-5 right-5 z-40 h-auto gap-2 rounded-full border-border/60 bg-background/90 px-4 py-2.5 text-sm font-medium shadow-xl backdrop-blur hover:bg-accent",
          open && "translate-y-2 opacity-0 pointer-events-none",
        )}
        aria-label="Open chatbot"
      >
        <MessageCircle className="size-4" />
        Tanya AI Mentor
      </Button>

      {open && (
        <Card className="fixed bottom-5 right-5 z-40 flex w-[min(380px,calc(100vw-2.5rem))] flex-col border-border/60 bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/60 p-3">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-foreground text-background">
                <Bot className="size-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium leading-tight">AI Mentor</p>
                <p className="text-[10px] text-muted-foreground">model: claude-sonnet-4-6 · vector-aware</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setOpen(false)}>
              <X className="size-3.5" />
            </Button>
          </div>

          <CardContent className="flex h-[420px] flex-col gap-3 p-0">
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-auto p-3">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <Sparkles className="mr-1 inline size-3 align-text-top" />
                    Coba salah satu:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant="outline"
                        onClick={() => sendText(s)}
                        className="h-auto rounded-full border-border/60 bg-muted/30 px-3 py-1 text-xs font-normal text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                    m.role === "user"
                      ? "ml-auto bg-foreground text-background"
                      : "bg-muted/40 text-foreground",
                  )}
                >
                  {m.content}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!text.trim()) return;
                sendText(text.trim());
              }}
              className="flex items-center gap-2 border-t border-border/60 p-2"
            >
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tanya apa saja…"
                className="h-8"
              />
              <Button type="submit" size="icon" className="size-8" aria-label="Send">
                <Send className="size-3.5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
