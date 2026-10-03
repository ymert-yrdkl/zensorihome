import type { MetadataRoute } from "next";
import { kategoriler, koleksiyonlar, urunler } from "@/katalog/katalog";
import { YASAL_METINLER } from "@/icerik/yasal";
import { MAGAZA } from "@/magaza/ayarlar";

export default function siteHaritasi(): MetadataRoute.Sitemap {
  const adres = MAGAZA.siteAdresi;
  const sabit = ["", "/urunler", "/hakkimizda", "/sss", "/kargo-ve-iade", "/iletisim"];
  return [
    ...sabit.map((yol) => ({ url: `${adres}${yol}`, changeFrequency: "weekly" as const, priority: yol === "" ? 1 : 0.6 })),
    ...kategoriler.map((k) => ({ url: `${adres}/kategori/${k.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...koleksiyonlar.map((k) => ({ url: `${adres}/koleksiyon/${k.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...urunler.map((u) => ({
      url: `${adres}/urun/${u.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: [`${adres}${u.varyantlar[0].gorseller[0].src}`],
    })),
    ...YASAL_METINLER.map((m) => ({ url: `${adres}/yasal/${m.slug}`, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
