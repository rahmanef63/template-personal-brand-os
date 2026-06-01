import { ImageResponse } from "next/og";
import { DEFAULT_SITE_CONFIG } from "@/components/templates/personal-brand/shared/site-config";

export const runtime = "edge";
export const alt = "Personal Brand OS";
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
          justifyContent: "space-between",
          padding: 80,
          background: "#0a0a0a",
          color: "#f5f5f5",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#f5f5f5",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 32,
            }}
          >
            {DEFAULT_SITE_CONFIG.brandLetter}
          </div>
          <span style={{ fontWeight: 600 }}>{DEFAULT_SITE_CONFIG.brandName}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            {DEFAULT_SITE_CONFIG.tagline}
          </div>
          <div style={{ fontSize: 28, color: "#a3a3a3", maxWidth: 900 }}>
            {DEFAULT_SITE_CONFIG.description}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
