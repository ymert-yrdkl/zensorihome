// İstemcideki arama paneli ve favoriler sayfası için hafif ürün dizini (derlemede sabitlenir).
import { kategoriler, urunleriListele } from "@/katalog/katalog";

export const dynamic = "force-static";

export function GET() {
  return Response.json({ urunler: urunleriListele(), kategoriler });
}
