import type { Metadata } from "next";
import Link from "next/link";
import { SayfaBasi } from "@/bilesenler/liste/SayfaBasi";
import { MAGAZA } from "@/magaza/ayarlar";
import { tl } from "@/magaza/para";

export const metadata: Metadata = {
  title: "Sık sorulanlar",
  description: "Kargo ücreti, teslimat süresi, ödeme yöntemleri, iade ve ürün bakımı hakkında sık sorulan sorular.",
};

const SORULAR: { soru: string; cevap: React.ReactNode; duzMetin: string }[] = [
  {
    soru: "Kargo ücreti ne kadar?",
    duzMetin: `${tl(MAGAZA.ucretsizKargoEsigi)} ve üzeri siparişlerde kargo ücretsiz. Altındaki siparişlerde kargo ücreti ${tl(MAGAZA.kargoUcreti)}.`,
    cevap: (
      <p>
        {tl(MAGAZA.ucretsizKargoEsigi)} ve üzeri siparişlerde kargo ücretsiz. Altındaki siparişlerde kargo ücreti{" "}
        {tl(MAGAZA.kargoUcreti)}; tutar ödeme adımında sipariş özetinde ayrıca yazar.
      </p>
    ),
  },
  {
    soru: "Siparişim ne zaman kargoya verilir?",
    duzMetin: `Siparişler ${MAGAZA.kargoyaVerilis} içinde kargoya verilir.`,
    cevap: (
      <p>
        {MAGAZA.kargoyaVerilis} içinde. Ürün sayfasında tahmini kargoya veriliş günü yazar; hafta sonu verilen siparişler ilk iş
        gününde yola çıkar. Havale ile ödenen siparişler ödeme hesaba geçtiğinde hazırlanır.
      </p>
    ),
  },
  {
    soru: "Hangi ödeme yöntemlerini kullanabilirim?",
    duzMetin: "Havale / EFT ve kapıda ödeme. Sitemiz kart bilgisi istemez.",
    cevap: (
      <p>
        Havale / EFT ve kapıda ödeme. Havalede hesap bilgileri sipariş onay sayfasında görünür. Sitemiz kart bilgisi istemez ve
        saklamaz.
      </p>
    ),
  },
  {
    soru: "Ürünü iade edebilir miyim?",
    duzMetin: `Evet. Teslim aldığınız günden itibaren ${MAGAZA.iadeSuresiGun} gün içinde gerekçe göstermeden iade edebilirsiniz.`,
    cevap: (
      <p>
        Evet. Teslim aldığınız günden itibaren {MAGAZA.iadeSuresiGun} gün içinde gerekçe göstermeden iade edebilirsiniz.{" "}
        <Link href="/iletisim">İletişim formundan</Link> sipariş numaranızla bize yazın; iade adımlarını{" "}
        <Link href="/kargo-ve-iade">kargo ve iade</Link> sayfasında da bulabilirsiniz.
      </p>
    ),
  },
  {
    soru: "Ürün kırık ya da hasarlı gelirse ne yapmalıyım?",
    duzMetin: "Paketi kargo görevlisinin yanında açın; hasar varsa tutanak tutturun ve fotoğrafla bize yazın.",
    cevap: (
      <p>
        Cam ve seramik ürünlerde paketi mümkünse kargo görevlisinin yanında açın. Hasar varsa tutanak tutturun, ürünün ve kutunun
        fotoğrafını çekip sipariş numaranızla <Link href="/iletisim">bize yazın</Link>; süreci birlikte başlatalım.
      </p>
    ),
  },
  {
    soru: "Mumlar kokulu mu?",
    duzMetin: "Ürün sayfasında Koku: Kokusuz yazan mumlarımız kokusuzdur; sofrada yemeğin kokusuna karışmaz.",
    cevap: (
      <p>
        Ürün sayfasında “Koku: Kokusuz” yazan mumlarımız (Sessiz Küreler, figürlü ve dekoratif mumlar) kokusuzdur; sofrada yemeğin
        kokusuna karışmaz. Mumlarımız Türkiye’de üretiliyor.
      </p>
    ),
  },
  {
    soru: "Mango ağacı tabaklar nasıl temizlenir?",
    duzMetin: "Nemli bezle silip hemen kurulayın; bulaşık makinesinde yıkamayın, suda bekletmeyin.",
    cevap: (
      <p>
        Nemli bezle silip hemen kurulayın. Bulaşık makinesinde yıkamayın ve suda bekletmeyin; ahşap su emerse çatlayabilir. Emaye
        iç yüzey peynir, kurabiye, kuruyemiş gibi kuru sunumlar için uygundur.
      </p>
    ),
  },
  {
    soru: "Fatura kesiliyor mu?",
    duzMetin: "Evet, her siparişe fatura kesilir. Kurumsal fatura için ödeme adımında seçim yapın.",
    cevap: (
      <p>
        Evet, her siparişe fatura kesilir. Kurumsal fatura istiyorsanız ödeme adımında “Kurumsal fatura istiyorum” kutusunu
        işaretleyip firma ve vergi bilgilerini yazın.
      </p>
    ),
  },
  {
    soru: "Ürünleriniz başka yerde de satılıyor mu?",
    duzMetin: "Evet. Zensori Home mağazası Trendyol, Hepsiburada ve n11'de de var.",
    cevap: (
      <p>
        Evet. Trendyol (satıcı puanı 9,4), Hepsiburada ve n11’de de mağazamız var; bağlantılar sayfanın altında. Bu sitede aynı
        ürünleri doğrudan bizden alırsınız.
      </p>
    ),
  },
];

export default function SSS() {
  const yapisalVeri = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SORULAR.map((s) => ({
      "@type": "Question",
      name: s.soru,
      acceptedAnswer: { "@type": "Answer", text: s.duzMetin },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri) }} />
      <SayfaBasi
        kirintilar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Sık sorulanlar" }]}
        baslik="Sık sorulanlar"
        ozet="Kargo, ödeme, iade ve ürün bakımı. Cevabını bulamadığınız soruyu iletişim formundan sorabilirsiniz."
      />
      <div className="kabuk pb-24">
        <div className="max-w-3xl divide-y divide-cizgi border-y border-cizgi">
          {SORULAR.map((s, i) => (
            <details key={s.soru} className="group" open={i === 0}>
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-baslik text-lg [&::-webkit-details-marker]:hidden">
                {s.soru}
                <span aria-hidden="true" className="relative size-3.5 shrink-0">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-murekkep" />
                  <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-murekkep transition-transform duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              <div className="max-w-[62ch] pb-6 text-murekkep-2 [&_a]:text-murekkep [&_a]:underline [&_a]:underline-offset-4">
                {s.cevap}
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
