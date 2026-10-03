import type { Metadata } from "next";
import { urunler } from "@/katalog/katalog";
import { MAGAZA, ODEME_YONTEMLERI } from "@/magaza/ayarlar";
import { SayfaBasi } from "@/bilesenler/liste/SayfaBasi";
import { OdemeFormu } from "@/bilesenler/sepet/OdemeFormu";

export const metadata: Metadata = { title: "Ödeme", robots: { index: false } };

export default function OdemeSayfasi() {
  // Sepetteki fiyatları doğrulamak için güncel fiyat listesi (slug:kod → kuruş)
  const fiyatlar: Record<string, number> = {};
  for (const u of urunler) for (const v of u.varyantlar) if (v.stokta) fiyatlar[`${u.slug}:${v.kod}`] = v.fiyat;

  return (
    <>
      <SayfaBasi kirintilar={[{ ad: "Sepet", href: "/sepet" }, { ad: "Ödeme" }]} baslik="Ödeme" />
      <OdemeFormu
        fiyatlar={fiyatlar}
        odemeYontemleri={ODEME_YONTEMLERI}
        kapidaOdemeUcreti={MAGAZA.kapidaOdemeUcreti}
        demo={MAGAZA.demo}
      />
    </>
  );
}
