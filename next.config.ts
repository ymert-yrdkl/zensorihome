import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker imajı için tek klasörlük çıktı (node server.js)
  output: "standalone",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Ürün görselleri nadiren değişir; iyileştirilmiş kopyalar bir gün önbellekte kalır
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: "/:yol*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Ürün görselleri /urun/<slug>/<dosya> (iki parça); ürün sayfaları /urun/<slug> (tek parça) etkilenmez
      { source: "/urun/:slug/:dosya", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] },
      { source: "/instagram/:dosya", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] },
    ];
  },
};

export default nextConfig;
