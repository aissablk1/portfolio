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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top — badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#1a1a1a",
            }}
          />
          <span
            style={{
              color: "#999999",
              fontSize: "13px",
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              fontWeight: 600,
            }}
          >
            Albi, Tarn — Occitanie
          </span>
        </div>

        {/* Center — title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              color: "#1a1a1a",
              fontSize: "72px",
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Aïssa Belkoussa
          </h1>
          <p
            style={{
              color: "#666666",
              fontSize: "24px",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              margin: 0,
              maxWidth: "640px",
            }}
          >
            Systèmes digitaux & IA pour PME et artisans.
            Automatisation, sites web, chatbots — livrés en 10 jours.
          </p>
        </div>

        {/* Bottom — stats + domain */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #eeeeee",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "48px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#1a1a1a",
                  fontSize: "32px",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                }}
              >
                93
              </span>
              <span
                style={{
                  color: "#999999",
                  fontSize: "11px",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                }}
              >
                Projets livrés
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#1a1a1a",
                  fontSize: "32px",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                }}
              >
                10j
              </span>
              <span
                style={{
                  color: "#999999",
                  fontSize: "11px",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                }}
              >
                Délai moyen
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#1a1a1a",
                  fontSize: "32px",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                }}
              >
                1 500 €
              </span>
              <span
                style={{
                  color: "#999999",
                  fontSize: "11px",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                }}
              >
                À partir de
              </span>
            </div>
          </div>
          <span
            style={{
              color: "#999999",
              fontSize: "15px",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            aissabelkoussa.fr
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
