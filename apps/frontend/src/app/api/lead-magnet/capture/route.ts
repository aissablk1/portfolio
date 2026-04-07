import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, resourceSlug, resourceTitle, downloadUrl, lang } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Trigger lead magnet sequence via backend (fire and forget)
    if (BACKEND_URL) {
      fetch(`${BACKEND_URL}/api/sequences/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          sequence_type: "lead_magnet",
          trigger_data: {
            resource_slug: resourceSlug,
            resource_title: resourceTitle,
            download_url: downloadUrl,
            lang,
          },
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, downloadUrl });
  } catch {
    return NextResponse.json({ success: false });
  }
}
