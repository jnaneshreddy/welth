import { GoogleGenerativeAI } from "@google/generative-ai";

// Simple Gemini-backed chat endpoint
export async function POST(req) {
  try {
    const apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing Gemini API key. Set GOOGLE_GENERATIVE_AI_API_KEY." }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const { history = [], message } = await req.json();
    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid request: 'message' is required" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Keep the bot focused on Welth app questions; avoid hallucinations
      systemInstruction:
        "You are Welth Assist, a concise support bot for the Welth finance app. " +
        "Answer questions about features like dashboards, budgets, transactions, receipt scanner, multi-account and multi-currency, and getting started. " +
        "If you don't know or it's unrelated to Welth, say you’re not sure and suggest visiting the dashboard or help docs. Keep answers short and actionable.",
    });

    // Build contents array for multi-turn context (optional and lightweight)
    const contents = [];
    // Include up to last 6 messages to limit token usage
    const trimmed = Array.isArray(history) ? history.slice(-6) : [];
    for (const m of trimmed) {
      if (!m || !m.role || !m.text) continue;
      contents.push({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: String(m.text).slice(0, 4000) }] });
    }
    contents.push({ role: "user", parts: [{ text: message.slice(0, 8000) }] });

    const result = await model.generateContent({ contents });
    const text = result?.response?.text?.() || "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("/api/chat error", err);
    return new Response(
      JSON.stringify({ error: "Failed to get a response. Please try again." }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
