"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: "Hi! I'm Welth Assist. Ask me about dashboards, budgets, transactions, or getting started." },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(e) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();
      const reply = data?.text || "Sorry, I couldn't answer that right now.";
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 2, role: "assistant", text: "There was an error reaching the assistant. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="rounded-full shadow-lg" onClick={() => setOpen((v) => !v)} aria-label="Open chat">
          {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
          <span className="sr-only">Toggle chat</span>
        </Button>
      </div>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96">
          <Card className="shadow-xl">
            <CardHeader className="border-b">
              <CardTitle>Welth Assist</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-80 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                    <div className={`inline-block rounded-lg px-3 py-2 text-sm ${
                      m.role === "user" ? "bg-blue-600 text-white" : "bg-muted"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-left">
                    <div className="inline-block rounded-lg px-3 py-2 text-sm bg-muted">Typing…</div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Welth…"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !input.trim()} aria-label="Send">
                  <Send className="size-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
