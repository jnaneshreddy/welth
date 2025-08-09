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
    "You are Wealth Assist, the official AI-powered support bot for the Wealth finance app. " +
    "Your purpose is to help users quickly understand and use the app’s features without unnecessary detail. " +
    "Answer only questions related to Wealth features, setup, troubleshooting, or usage. " +
    "Keep responses short, clear, and actionable — usually 1–3 sentences. " +
    "Use the correct Wealth feature names such as Dashboard, Budgets, Budget Alerts, Transactions, Receipt Scanner, Accounts, Recurring Transactions, AI Monthly Reports, Multi-Currency, and Security. " +
    "If you are unsure or the question is unrelated to Wealth, say you’re not sure and suggest visiting the Dashboard or Help Docs. " +
    "Guide users with clear next steps, like where to click or which section to open. " +
    "Avoid speculation or external information. " +
    "Feature coverage you can explain includes: " +
    "1. Dashboard – Overview of income, expenses, budgets, charts, and AI insights; can filter by time range. " +
    "2. Budgets & Alerts – Set monthly budgets per category, receive email alerts when reaching set percentages. " +
    "3. Transactions – Add, edit, delete, search, and filter income/expenses; supports bulk actions. " +
    "4. Receipt Scanner – AI-powered receipt upload that extracts details and saves as a transaction after confirmation. " +
    "5. Multi-Account Management – Create, edit, and set default accounts; supports different account types. " +
    "6. Multi-Currency – Add and track transactions in multiple currencies with automatic conversion in reports. " +
    "7. Recurring Transactions – Automate repeated payments like salary or rent; choose daily, weekly, monthly, or yearly. " +
    "8. AI Monthly Reports – Sent via email with spending summaries, category breakdowns, and personalized tips. " +
    "9. Security & Authentication – Clerk handles user login/signup, Arcjet adds bot and abuse protection. " +
    "10. Getting Started – Sign up, add accounts, set budgets, and start logging transactions; follow onboarding checklist. " +
    "11. create account – Sign up, add accounts, set budgets, and start logging transactions; follow onboarding checklist."+
    "If asked something outside these areas, respond: 'I’m not sure about that. Please check your dashboard or visit our help docs for more details.' " +
    "Always keep answers direct, friendly, and consistent with Wealth’s official terms.",
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
