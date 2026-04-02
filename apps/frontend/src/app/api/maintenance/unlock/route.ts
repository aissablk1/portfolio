import { NextRequest, NextResponse } from "next/server";

const MAINTENANCE_PASSWORD = process.env.MAINTENANCE_PASSWORD || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Mot de passe requis." },
        { status: 400 },
      );
    }

    if (!MAINTENANCE_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Configuration serveur manquante." },
        { status: 503 },
      );
    }

    if (password !== MAINTENANCE_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Mot de passe incorrect." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("maintenance_unlocked", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Requete invalide." },
      { status: 400 },
    );
  }
}
