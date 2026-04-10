import { NextResponse } from "next/server";
import { EVENT_SCORES, getSegment } from "@/lib/lead-scoring";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://portfolio-api-72tq.onrender.com";

export async function POST(request: Request) {
  let body: { leadId?: string; eventType?: string; eventData?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { leadId, eventType, eventData } = body;

  if (!leadId || !eventType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const scoreDelta = EVENT_SCORES[eventType] || 0;

  // Forward vers le backend MongoDB (fire-and-forget)
  fetch(`${BACKEND_URL}/api/leads/${leadId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: eventType,
      data: { ...eventData, score_delta: scoreDelta },
      created_at: new Date().toISOString(),
    }),
  }).catch(() => {});

  // Notification Telegram si le lead devient chaud
  if (scoreDelta >= 15) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `👀 Lead actif — ${eventType} (+${scoreDelta} pts)\nLead ID: ${leadId}`,
        }),
      }).catch(() => {});
    }
  }

  return NextResponse.json({ success: true, scoreDelta });
}
