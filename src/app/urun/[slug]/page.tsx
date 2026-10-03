import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fiyatAraligi, ilgiliUrunler, kategoriBul, urunBul, urunleriListele, urunler, varyantBul } from "@/katalog/katalog";
import { UrunAlani, type IstemciUrun } from "@/bilesenler/urun/UrunAlani";
import { UrunIzgara } from "@/bilesenler/urun/UrunKarti";
import { Bolum } from "@/bilesenler/urun/Bolum";
import { IkonIade, IkonKargo, IkonOdeme } from "@/bilesenler/ikon";
import { MAGAZA } from "@/magaza/ayarlar";
import { tl } from "@/magaza/para";
import { tahminiKargoTarihi } from "@/magaza/kargo-tarihi";

export function generateStaticParams() {
  return urunler.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: PageProps<"/urun/[slug]">): Promise<Metadata> {
  const urun = urunBul((await params).slug);
  if (!urun) return {};
  const g = urun.varyantlar[0].gorseller[0];
  return {
    title: urun.ad,
    description: `${urun.ozet} ${tl(fiyatAraligi(urun).min)}’den başlayan fiyatla, ${tl(MAGAZA.ucretsizKargoEsigi)} üzeri kargo ücretsiz.`,
    alternates: { canonical: `/urun/${urun.slug}` },
    openGraph: { images: [{ url: g.src, width: g.genislik, height: g.yukseklik }] },
  };
}

export default async function UrunSayfasi({ params, searchParams }: PageProps<"/urun/[slug]">) {
  const urun = urunBul((await params).slug);
  if (!urun) notFound();
  const { v } = await searchParams;
  const varyant = varyantBul(urun, typeof v === "string" ? v : undefined);
  const kategori = kategoriBul(urun.kategori);
  const ilgili = ilgiliUrunler(urun, 4);

  const istemciUrun: IstemciUrun = {
    slug: urun.slug,
    ad: urun.ad,
    marka: urun.marka,
    secenekler: urun.secenekler,
    varyantlar: urun.varyantlar.map(({ kod, secimler, renk, fiyat, eskiFiyat, stokta, gorseller }) => ({
      kod,
      secimler,
      renk,
      fiyat,
      eskiFiyat,
      stokta,
      gorseller,
    })),
  };

  const { min, max } = fiyatAraligi(urun);
  const yapisalVeri = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: urun.ad,
      description: urun.aciklama.join(" "),
      brand: { "@type": "Brand", name: urun.marka === "zensori" ? "Zensori" : urun.marka },
      image: urun.varyantlar.map((x) => `${MAGAZA.siteAdresi}${x.gorseller[0].src}`),
      sku: varyant.barkod,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "TRY",
        lowPrice: (min / 100).toFixed(2),
        highPrice: (max / 100).toFixed(2),
        offerCount: urun.varyantlar.length,
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana sayfa", item: MAGAZA.siteAdresi },
        { "@type": "ListItem", position: 2, name: kategori?.ad, item: `${MAGAZA.siteAdresi}/kategori/${urun.kategori}` },
        { "@type": "ListItem", position: 3, name: urun.ad },
      ],
    },
  ];

  const kargoNotu = (
    <ul role="list" className="space-y-2.5 rounded-kontrol bg-kagit-2 px-4 py-4 text-sm">
      <li className="flex gap-3">
        <IkonKargo size={20} className="shrink-0 text-orman" />
        <span>
          Tahmini kargoya veriliş: <strong className="font-medium">{tahminiKargoTarihi()}</strong>
          <span className="block text-murekkep-3">
            {tl(MAGAZA.ucretsizKargoEsigi)} ve üzeri siparişlerde kargo ücretsiz, altında {tl(MAGAZA.kargoUcreti)}.
          </span>
        </span>
      </li>
      <li className="flex gap-3">
        <IkonIade size={20} className="shrink-0 text-orman" />
        <span>{MAGAZA.iadeSuresiGun} gün içinde gerekçe göstermeden iade hakkı</span>
      </li>
      <li className="flex gap-3">
        <IkonOdeme size={20} className="shrink-0 text-orman" />
        <span>Havale / EFT ya da kapıda ödeme</span>
      </li>
    </ul>
  );

  const bilgi = [
    <Bolum key="hakkinda" baslik="Ürün hakkında" acik>
      <div className="space-y-3">
        {urun.aciklama.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </Bolum>,
    <Bolum key="olcu" baslik="Ölçü ve özellikler">
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2">
        {urun.ozellikler.map(([ad, deger]) => (
          <div key={ad} className="contents">
            <dt className="text-murekkep-3">{ad}</dt>
            <dd className="text-murekkep">{deger}</dd>
          </div>
        ))}
        <div key="barkod" className="contents">
          <dt className="text-murekkep-3">Barkod</dt>
          <dd className="rakam text-murekkep">{varyant.barkod}</dd>
        </div>
      </dl>
    </Bolum>,
    urun.bakim.length ? (
      <Bolum key="bakim" baslik={urun.kategori === "mum" ? "Kullanım ve güvenlik" : "Bakım"}>
        <ul className="list-disc space-y-1.5 pl-5">
          {urun.bakim.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </Bolum>
    ) : null,
    <Bolum key="kargo" baslik="Kargo ve iade">
      <p>
        Siparişiniz {MAGAZA.kargoyaVerilis} içinde kargoya verilir. Ürünü teslim aldıktan sonra {MAGAZA.iadeSuresiGun} gün içinde
        gerekçe göstermeden iade edebilirsiniz. Ayrıntılar{" "}
        <Link href="/kargo-ve-iade" className="baglanti text-murekkep">
          kargo ve iade
        </Link>{" "}
        sayfasında.
      </p>
    </Bolum>,
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri) }} />
      <nav aria-label="Konum" className="kabuk pb-5 pt-6">
        <ol className="flex flex-wrap items-center gap-x-2 text-sm text-murekkep-3">
          <li>
            <Link href="/" className="hover:text-murekkep hover:underline hover:underline-offset-4">
              Ana sayfa
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/kategori/${urun.kategori}`} className="hover:text-murekkep hover:underline hover:underline-offset-4">
              {kategori?.ad}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-murekkep-2">
            {urun.ad}
          </li>
        </ol>
      </nav>

      <UrunAlani
        urun={istemciUrun}
        baslangicKod={varyant.kod}
        ozet={urun.ozet}
        kargoNotu={kargoNotu}
        ucretsizKargoEsigi={MAGAZA.ucretsizKargoEsigi}
        bilgi={bilgi}
      />

      {ilgili.length ? (
        <section aria-labelledby="ilgili-baslik" className="kabuk mt-20 border-t border-cizgi pb-20 pt-14 lg:mt-28">
          <h2 id="ilgili-baslik" className="baslik-3">
            Yanına yakışanlar
          </h2>
          <div className="mt-8">
            <UrunIzgara urunler={urunleriListele(ilgili)} />
          </div>
        </section>
      ) : (
        <div className="pb-20" />
      )}
    </>
  );
}
