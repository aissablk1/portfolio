import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://portfolio-api-72tq.onrender.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to");
  const leadId = searchParams.get("lid");
  const emailId = searchParams.get("eid");

  if (!to) {
    return NextResponse.json({ error: "Missing 'to' param" }, { status: 400 });
  }

  // Track le clic (fire-and-forget)
  if (leadId) {
    fetch(`${BACKEND_URL}/api/leads/${leadId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "email_clicked",
        data: { destination: to, email_id: emailId },
        created_at: new Date().toISOString(),
      }),
    }).catch(() => {});
  }

  return NextResponse.redirect(to, 302);
}
