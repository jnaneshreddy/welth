ongoing welth application 

## Chatbot (Gemini)

This app includes a lightweight Gemini-powered assistant that answers short questions about Welth (dashboards, budgets, transactions, receipt scanner, multi-account, multi-currency, and getting started).

Setup:
- Create `.env.local` and set `GOOGLE_GENERATIVE_AI_API_KEY`.
- Start the dev server and use the floating chat button at bottom-right.

Environment:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

API route: `app/api/chat/route.js`

Client widget: `components/chatbot-widget.jsx` (mounted in `app/layout.js`).
