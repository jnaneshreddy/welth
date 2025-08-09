"use client";

import dynamic from "next/dynamic";

// Client-only dynamic import is allowed here
const ChatbotWidget = dynamic(() => import("@/components/chatbot-widget"), { ssr: false });

export default function ChatbotClientMount() {
  return <ChatbotWidget />;
}
