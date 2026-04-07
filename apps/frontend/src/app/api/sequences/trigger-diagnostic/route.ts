import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, score, maxScore, weakestId, weakestQuestion, weakestArea, recommendedPlan, answers } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ success: false, error: "Backend not configured" });
    }

    // Fire and forget — ne pas bloquer le frontend
    fetch(`${BACKEND_URL}/api/sequences/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        sequence_type: "post_diagnostic",
        trigger_data: {
          score,
          max_score: maxScore,
          weakest_id: weakestId,
          weakest_question: weakestQuestion,
          weakest_area: weakestArea,
          recommended_plan: recommendedPlan,
          answers,
        },
      }),
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
