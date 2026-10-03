import type { Metadata } from "next";
import { SayfaBasi } from "@/bilesenler/liste/SayfaBasi";
import { SepetSayfasi } from "@/bilesenler/sepet/SepetSayfasi";
import { MAGAZA } from "@/magaza/ayarlar";

export const metadata: Metadata = { title: "Sepet", robots: { index: false } };

export default function Sepet() {
  return (
    <>
      <SayfaBasi kirintilar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Sepet" }]} baslik="Sepetiniz" />
      <SepetSayfasi
        odemeNotu={
          <ul className="space-y-1">
            <li>Havale / EFT ya da kapıda ödeme</li>
            <li>Siparişler {MAGAZA.kargoyaVerilis} içinde kargoda</li>
            <li>{MAGAZA.iadeSuresiGun} gün içinde iade hakkı</li>
          </ul>
        }
      />
    </>
  );
}
