import { ImageResponse } from "next/og";

// Default favicon (brand letter). The owner's uploaded favicon overrides this at
// runtime via <BrandHead>. Having this avoids the empty /favicon.ico request.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#17150f",
          color: "#f5f1e8",
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 7,
        }}
      >
        L
      </div>
    ),
    { ...size },
  );
}
