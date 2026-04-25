import { ImageResponse } from "next/og";
import { getProducts } from "@/lib/modules/products";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const { products } = await getProducts();
  const count = products.length;
  
  const productList = products.slice(0, 3).map((p) => 
    `• ${p.name} - $${p.price.toFixed(2)}`
  ).join("\n");

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
          display: "flex",
        }}
      >
        Acme Inc Tienda
      </div>
      <div
        style={{
          color: "#e2e8f0",
          fontSize: "28px",
          fontFamily: "system-ui",
          textAlign: "center",
          marginBottom: "30px",
          display: "flex",
        }}
      >
        {count} productos disponibles
      </div>
      {productList && (
        <div
          style={{
            color: "#94a3b8",
            fontSize: "20px",
            fontFamily: "monospace",
            textAlign: "left",
            background: "rgba(0,0,0,0.3)",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
          }}
        >
          {productList}
        </div>
      )}
    </div>
  );
}