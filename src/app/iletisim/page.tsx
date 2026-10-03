import type { Metadata } from "next";
import Link from "next/link";
import { SayfaBasi } from "@/bilesenler/liste/SayfaBasi";
import { IkonInstagram, IkonKonum, IkonEposta, IkonMagaza } from "@/bilesenler/ikon";
import { MAGAZA } from "@/magaza/ayarlar";
import { IletisimFormu } from "./IletisimFormu";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Sipariş, iade ve ürünlerle ilgili sorularınız için Zensori Home’a yazın.",
};

export default function Iletisim() {
  const s = MAGAZA.sirket;
  return (
    <>
      <SayfaBasi
        kirintilar={[{ ad: "Ana sayfa", href: "/" }, { ad: "İletişim" }]}
        baslik="Bize yazın"
        ozet="Sipariş, iade ya da bir ürün hakkında sorunuz varsa formu doldurun. Sipariş numaranızı eklerseniz daha hızlı yardımcı oluruz."
      />
      <div className="kabuk grid grid-cols-1 gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <IletisimFormu />
          <p className="mt-6 text-sm text-murekkep-3">
            Mesajınızdaki kişisel veriler yalnız sorunuzu yanıtlamak için kullanılır.{" "}
            <Link href="/yasal/kvkk-aydinlatma" className="baglanti">
              Aydınlatma metni
            </Link>
          </p>
        </div>
        <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
          <div className="flex gap-3">
            <IkonInstagram size={22} className="mt-0.5 shrink-0 text-orman" />
            <div>
              <p className="font-medium">Instagram</p>
              <a href={MAGAZA.sosyal.instagram} target="_blank" rel="noopener" className="baglanti text-murekkep-2">
                {MAGAZA.sosyal.instagramKullanici}
              </a>
            </div>
          </div>
          {s.eposta ? (
            <div className="flex gap-3">
              <IkonEposta size={22} className="mt-0.5 shrink-0 text-orman" />
              <div>
                <p className="font-medium">E-posta</p>
                <a href={`mailto:${s.eposta}`} className="baglanti text-murekkep-2">
                  {s.eposta}
                </a>
              </div>
            </div>
          ) : null}
          <div className="flex gap-3">
            <IkonKonum size={22} className="mt-0.5 shrink-0 text-orman" />
            <div>
              <p className="font-medium">Adres</p>
              <p className="text-murekkep-2">{s.adres}</p>
              <p className="mt-1 text-sm text-murekkep-3">KEP: {s.kep}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <IkonMagaza size={22} className="mt-0.5 shrink-0 text-orman" />
            <div>
              <p className="font-medium">Pazar yeri mağazalarımız</p>
              <ul className="mt-1 space-y-1 text-murekkep-2">
                {MAGAZA.pazarYerleri.map((p) => (
                  <li key={p.ad}>
                    <a href={p.url} target="_blank" rel="noopener" className="baglanti">
                      {p.ad}
                    </a>{" "}
                    <span className="text-sm text-murekkep-3">{p.not}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
