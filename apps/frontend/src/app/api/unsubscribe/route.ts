import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    if (BACKEND_URL) {
      await fetch(
        `${BACKEND_URL}/api/sequences/unsubscribe?token=${encodeURIComponent(token)}`
      );
    }
  } catch {
    // Continue vers la page de confirmation meme si le backend echoue
  }

  return NextResponse.redirect(new URL("/unsubscribe/confirmed", request.url));
}
