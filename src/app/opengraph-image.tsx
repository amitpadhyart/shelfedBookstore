import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Shelfed Bookstore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EFEAE0",
          backgroundImage: "linear-gradient(135deg, #EFEAE0 0%, #E4DCC8 100%)",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontFamily: "Georgia, serif",
            color: "#221F1A",
            letterSpacing: "-0.02em",
          }}
        >
          Shelfed
        </div>
        <div
          style={{
            fontSize: 32,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            color: "#55503F",
            marginTop: 12,
          }}
        >
          a bookstore, mostly
        </div>
      </div>
    ),
    { ...size }
  );
}
