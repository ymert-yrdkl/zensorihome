import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { urunBul } from "@/katalog/katalog";
import { MAGAZA } from "@/magaza/ayarlar";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { IkonInstagram } from "@/bilesenler/ikon";

export const metadata: Metadata = {
  title: "Hikâyemiz",
  description:
    "Zensori, Zen felsefesinden ilham alan bir ev dekorasyonu ve mutfak ürünleri markası. Doğal dokular, sade formlar, İstanbul Acıbadem’den.",
};

function gorsel(slug: string, varyant: number, sira: number) {
  const u = urunBul(slug);
  const v = u?.varyantlar[varyant] ?? u?.varyantlar[0];
  return v?.gorseller[sira] ?? v?.gorseller[0];
}

const MALZEMELER = [
  {
    ad: "Cam",
    metin: "Bonbon serisinin iki parçalı vazoları ve el yapımı, bal tonlu cam kaseler. Işığı geçiren, rengi taşıyan parçalar.",
    gorsel: gorsel("istanbul-bonbon-vazo", 0, 0),
    href: "/koleksiyon/bonbon-serisi",
  },
  {
    ad: "Seramik",
    metin: "Mat beyaz ve siyah gövdeler, hardal kulplar, oval boşluklar. El yapımı oldukları için her biri biraz farklı.",
    gorsel: gorsel("heykelsi-seramik-vazo", 0, 0),
    href: "/koleksiyon/heykelsi-seramikler",
  },
  {
    ad: "Mango ağacı",
    metin: "Emaye iç yüzeyli tabaklar ve sunum tahtaları. Yeşil ekose, kar tanesi, çam ağacı ve yıldız formları.",
    gorsel: gorsel("mango-ekose-kalp-tabak", 0, 1),
    href: "/kategori/sunum-servis",
  },
  {
    ad: "Mum",
    metin: "Türkiye’de üretilen kokusuz top mumlar, şamdan mumları ve figürlü mumlar.",
    gorsel: gorsel("tirtikli-samdan-mum", 2, 0),
    href: "/kategori/mum",
  },
];

export default function Hakkimizda() {
  const giris = gorsel("dramatic-cool-bonbon-vazo", 0, 1);
  return (
    <>
      <section className="kabuk grid grid-cols-1 items-end gap-10 pb-16 pt-10 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-6">
          <p className="text-sm text-murekkep-3">Hikâyemiz</p>
          <h1 className="baslik-1 mt-3">Acıbadem’den, sakin evler için.</h1>
          <p className="giris-metni mt-6">
            Zensori, Zen felsefesinden ilham alan bir ev dekorasyonu ve mutfak ürünleri markası. Doğal dokular, sade formlar ve
            şiirsel detaylarla yaşam alanlarına biraz sükûnet getirmek istiyor.
          </p>
        </div>
        {giris ? (
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-kucuk lg:col-span-5 lg:col-start-8"
            style={{ backgroundColor: giris.renk }}
          >
            <Image
              src={giris.src}
              alt="Dramatic Cool Bonbon Vazo, çiçeklerle bir yemek masasında"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              preload
            />
          </div>
        ) : null}
      </section>

      <section aria-labelledby="kelimeler" className="bg-adacayi">
        <div className="kabuk grid grid-cols-1 gap-8 py-16 lg:grid-cols-12 lg:py-24">
          <h2
            id="kelimeler"
            className="font-baslik text-[clamp(1.875rem,1.3rem+2.4vw,3.25rem)] leading-[1.1] tracking-[-0.02em] lg:col-span-6"
          >
            Doğal, yalın, uyumlu ve şiirsel.
          </h2>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-murekkep-2">Bu dört kelime ürün açıklamalarımızda tekrar tekrar geçer.</p>
            <dl className="mt-6 divide-y divide-murekkep/10 border-y border-murekkep/10">
              {[
                ["Doğal", "Ahşabın damarı, camın içindeki renk, seramiğin pürüzü görünür kalır."],
                ["Yalın", "Formda süs için eklenmiş fazlalık yoktur."],
                ["Uyumlu", "Evdeki diğer eşyalarla yarışmaz, yanlarında durur."],
                ["Şiirsel", "Kapağın rengi, bir yıldız formu, bir kalp: küçük bir detay yeterlidir."],
              ].map(([kelime, aciklama]) => (
                <div key={kelime} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-3">
                  <dt className="font-baslik text-lg">{kelime}</dt>
                  <dd className="text-murekkep-2">{aciklama}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="malzemeler" className="kabuk py-16 lg:py-24">
        <h2 id="malzemeler" className="baslik-2">
          Dört malzeme
        </h2>
        <ul role="list" className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {MALZEMELER.map((m) => (
            <li key={m.ad}>
              <Link href={m.href} className="group block">
                {m.gorsel ? (
                  <span
                    className="relative block aspect-[3/4] overflow-hidden rounded-kucuk"
                    style={{ backgroundColor: m.gorsel.renk }}
                  >
                    <Image
                      src={m.gorsel.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                      className="object-cover"
                    />
                  </span>
                ) : null}
                <span className="mt-4 block font-baslik text-xl group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                  {m.ad}
                </span>
                <span className="mt-1.5 block text-[0.9375rem] text-murekkep-2">{m.metin}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="bul" className="border-t border-cizgi">
        <div className="kabuk grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-5">
            <h2 id="bul" className="baslik-3">
              Bizi başka nerede bulursunuz
            </h2>
            <p className="mt-3 text-murekkep-2">
              Ürünlerimiz pazar yerlerinde de satışta. Bu sitede aynı ürünleri doğrudan bizden alırsınız.
            </p>
            <a
              href={MAGAZA.sosyal.instagram}
              target="_blank"
              rel="noopener"
              className={dugmeSinifi({ tur: "ikincil", ek: "mt-6" })}
            >
              <IkonInstagram size={20} />
              Instagram’da {MAGAZA.sosyal.instagramKullanici}
            </a>
          </div>
          <ul role="list" className="divide-y divide-cizgi border-y border-cizgi lg:col-span-6 lg:col-start-7">
            {MAGAZA.pazarYerleri.map((p) => (
              <li key={p.ad}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  className="flex min-h-16 items-center justify-between gap-4 py-3 hover:text-orman"
                >
                  <span className="font-baslik text-xl">{p.ad}</span>
                  <span className="text-sm text-murekkep-2">{p.not}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Şirket bilgileri" className="kabuk pb-24">
        <div className="rounded-panel bg-kagit-2 px-6 py-6 text-sm text-murekkep-2">
          <p className="font-medium text-murekkep">{MAGAZA.sirket.unvan}</p>
          <p className="mt-1">{MAGAZA.sirket.adres}</p>
          <p className="mt-1">
            {MAGAZA.sirket.vergiDairesi}, VKN {MAGAZA.sirket.vergiNo} · KEP {MAGAZA.sirket.kep}
          </p>
        </div>
      </section>
    </>
  );
}
