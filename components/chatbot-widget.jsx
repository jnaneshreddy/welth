"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  async function sendText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed || loading) return;
    setInput("");
    const userMsg = { id: Date.now(), role: "user", text: trimmed };
    // Prepare history including the new user message
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: nextHistory }),
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

  function handleSubmit(e) {
    e.preventDefault();
    sendText(input);
  }

  return (
    <>
      {/* Floating toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-lg px-5"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {open ? "Close" : "Chat"}
        </Button>
      </div>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96">
          <Card className="shadow-xl">
            <CardHeader className="border-b flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">Welth Assist</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setMessages([{ id: Date.now(), role: "assistant", text: "Chat cleared. How can I help?" }])}>
                Clear Chat
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-80 overflow-y-auto p-4 space-y-3">
    {messages.length <= 1 && (
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      "How do I create a budget?",
                      "How to scan receipts?",
                      "What does the dashboard show?",
                    ].map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        className="justify-start"
      onClick={() => sendText(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                )}
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

              <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Welth…"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !input.trim()} aria-label="Send">
                  Send
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
