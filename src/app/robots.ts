import type { MetadataRoute } from "next";
import { MAGAZA } from "@/magaza/ayarlar";

// Demo sürümünde arama motorları siteyi taramaz.
export default function robots(): MetadataRoute.Robots {
  if (MAGAZA.demo) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/odeme", "/sepet", "/siparis/", "/arama", "/api/"] },
    sitemap: `${MAGAZA.siteAdresi}/sitemap.xml`,
  };
}
