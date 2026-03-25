import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Wobble premium panna cotta";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1f2937 50%, #111827 100%)",
          color: "white",
          padding: "56px",
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "32px",
            padding: "44px",
            background:
              "radial-gradient(circle at top right, rgba(255,107,157,0.2), transparent 35%), rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.05em",
            }}
          >
            Wobble
            <span style={{ color: "#FF6B9D" }}>.</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              premium panna cotta
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 760,
                fontSize: 72,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.06em",
              }}
            >
              gifting-ready jars with direct WhatsApp ordering
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              fontSize: 22,
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <span>wiggle into happiness</span>
            <span style={{ color: "#FF6B9D" }}>•</span>
            <span>telegram login ready</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
