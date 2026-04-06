import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aïssa BELKOUSSA — Sites et automatisations pour artisans et PME";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "16px",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              fontWeight: 700,
            }}
          >
            Freelance Albi — Tarn, Occitanie
          </span>
        </div>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1.1,
            margin: "0 0 20px 0",
          }}
        >
          Aïssa BELKOUSSA
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "26px",
            lineHeight: 1.4,
            margin: "0 0 32px 0",
            maxWidth: "700px",
          }}
        >
          Sites et automatisations pour artisans BTP et prestataires B2B. Livre en 10 jours.
        </p>
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 700 }}>2 900 EUR</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Accelerateur</span>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 700 }}>6 900 EUR</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Partenaire</span>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 700 }}>10 jours</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Livraison</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
