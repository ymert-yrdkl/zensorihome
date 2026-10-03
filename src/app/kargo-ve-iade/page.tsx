import type { Metadata } from "next";
import Link from "next/link";
import { SayfaBasi } from "@/bilesenler/liste/SayfaBasi";
import { MetinGovdesi } from "@/bilesenler/ui/Metin";
import { IkonIade, IkonKargo, IkonPaket } from "@/bilesenler/ikon";
import { MAGAZA } from "@/magaza/ayarlar";
import { tl } from "@/magaza/para";

export const metadata: Metadata = {
  title: "Kargo ve iade",
  description: `${tl(MAGAZA.ucretsizKargoEsigi)} üzeri kargo ücretsiz, ${MAGAZA.kargoyaVerilis} içinde kargoda, ${MAGAZA.iadeSuresiGun} gün içinde iade hakkı.`,
};

export default function KargoVeIade() {
  return (
    <>
      <SayfaBasi
        kirintilar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Kargo ve iade" }]}
        baslik="Kargo ve iade"
        ozet="Siparişiniz ne zaman yola çıkar, kargo ne kadar tutar, fikriniz değişirse ne yaparsınız."
      />
      <div className="kabuk pb-24">
        <ul
          role="list"
          className="grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-panel border border-cizgi bg-cizgi sm:grid-cols-3"
        >
          {[
            {
              Ikon: IkonKargo,
              baslik: `${tl(MAGAZA.ucretsizKargoEsigi)} üzeri ücretsiz`,
              metin: `Altında ${tl(MAGAZA.kargoUcreti)}`,
            },
            { Ikon: IkonPaket, baslik: `${MAGAZA.kargoyaVerilis} içinde kargoda`, metin: "Hafta sonu siparişleri ilk iş günü" },
            { Ikon: IkonIade, baslik: `${MAGAZA.iadeSuresiGun} gün içinde iade`, metin: "Gerekçe göstermeden" },
          ].map(({ Ikon, baslik, metin }) => (
            <li key={baslik} className="bg-yuzey px-6 py-6">
              <Ikon size={26} className="text-orman" />
              <p className="mt-3 font-medium">{baslik}</p>
              <p className="text-sm text-murekkep-2">{metin}</p>
            </li>
          ))}
        </ul>

        <MetinGovdesi>
          <h2>Kargo</h2>
          <p>
            Siparişler {MAGAZA.kargoyaVerilis} içinde kargoya verilir. Ürün sayfasında tahmini kargoya veriliş günü yazar. Havale
            / EFT ile ödenen siparişler ödeme hesabımıza geçtiğinde hazırlanır.
          </p>
          <p>
            {tl(MAGAZA.ucretsizKargoEsigi)} ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde kargo ücreti{" "}
            {tl(MAGAZA.kargoUcreti)}; ödeme adımında sipariş özetinde ayrı satır olarak görünür. Kargoya verildiğinde takip
            numarası size iletilir.
          </p>

          <h2>Teslim alırken</h2>
          <p>
            Cam ve seramik ürünlerde paketi mümkünse kargo görevlisinin yanında açın. Kırık ya da hasar görürseniz tutanak
            tutturun, ürünün ve kutunun fotoğrafını çekin ve sipariş numaranızla <Link href="/iletisim">bize yazın</Link>.
          </p>

          <h2>İade (cayma hakkı)</h2>
          <p>Ürünü teslim aldığınız günden itibaren {MAGAZA.iadeSuresiGun} gün içinde gerekçe göstermeden iade edebilirsiniz.</p>
          <ol>
            <li>
              <Link href="/iletisim">İletişim formundan</Link> sipariş numaranızı yazarak iade isteğinizi bildirin.
            </li>
            <li>
              Bildiriminizden sonraki 10 gün içinde ürünü, mümkünse orijinal ambalajıyla, size ileteceğimiz adrese gönderin.
            </li>
            <li>Ödemeniz, cayma bildiriminizin bize ulaşmasından itibaren en geç 14 gün içinde iade edilir.</li>
          </ol>
          <p>
            Yasal ayrıntılar <Link href="/yasal/iade-ve-cayma">iade ve cayma hakkı</Link> ile{" "}
            <Link href="/yasal/mesafeli-satis-sozlesmesi">mesafeli satış sözleşmesi</Link> metinlerinde.
          </p>
        </MetinGovdesi>
      </div>
    </>
  );
}
