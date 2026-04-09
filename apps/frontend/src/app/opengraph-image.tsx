import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Aïssa BELKOUSSA — Systèmes digitaux & IA pour PME et artisans, Albi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fdfdfd",
          backgroundImage:
            "linear-gradient(#eeeeee 1px, transparent 1px), linear-gradient(90deg, #eeeeee 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Name — preloader style */}
        <h1
          style={{
            color: "#1a1a1a",
            fontSize: "80px",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            margin: 0,
            lineHeight: 1,
          }}
        >
          AÏSSA BELKOUSSA
        </h1>

        {/* Description */}
        <p
          style={{
            color: "#666666",
            fontSize: "22px",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            margin: "24px 0 0 0",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          Systèmes digitaux & IA pour PME et artisans.
          Automatisation, sites web, chatbots — livrés en 10 jours.
        </p>

        {/* Bottom — domain */}
        <span
          style={{
            position: "absolute",
            bottom: "40px",
            color: "#999999",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
          }}
        >
          aissabelkoussa.fr
        </span>
      </div>
    ),
    { ...size }
  );
}
