import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <div
        style={{
          color: "#f97316",
          fontSize: "80px",
          fontWeight: "bold",
          fontFamily: "system-ui",
          marginBottom: "20px",
        }}
      >
        Acme Inc
      </div>
      <div
        style={{
          color: "#e2e8f0",
          fontSize: "32px",
          fontFamily: "system-ui",
          textAlign: "center",
        }}
      >
        Suplementos & Alimentos para Gimnasio
      </div>
    </div>,
  );
}
