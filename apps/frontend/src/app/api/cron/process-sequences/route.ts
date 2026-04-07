import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
const CRON_SECRET = process.env.CRON_SECRET || "";

export async function GET(request: Request) {
  // Vercel envoie le header Authorization: Bearer <CRON_SECRET>
  const auth = request.headers.get("authorization");
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: "BACKEND_API_URL not configured" },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/sequences/process`, {
      method: "POST",
      headers: { "x-cron-secret": CRON_SECRET },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Backend unreachable", detail: String(err) },
      { status: 502 }
    );
  }
}
