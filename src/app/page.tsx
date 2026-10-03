import Image from "next/image";
import Link from "next/link";
import {
  instagramGonderileri,
  kapakGorseli,
  kategoriler,
  kartModeli,
  koleksiyonBul,
  urunBul,
  urunler,
  type Gorsel,
  type Urun,
} from "@/katalog/katalog";
import { UrunKarti } from "@/bilesenler/urun/UrunKarti";
import { Fiyat } from "@/bilesenler/urun/Fiyat";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { IkonInstagram, IkonIade, IkonKargo, IkonOdeme, IkonOk, IkonPaket } from "@/bilesenler/ikon";
import { MAGAZA } from "@/magaza/ayarlar";
import { tl } from "@/magaza/para";

function urun(slug: string): Urun {
  const bulunan = urunBul(slug);
  if (!bulunan) throw new Error(`Ana sayfada kullanılan ürün katalogda yok: ${slug}`);
  return bulunan;
}

function gorsel(slug: string, varyant: number, sira: number): Gorsel {
  const v = urun(slug).varyantlar[varyant];
  return v.gorseller[sira] ?? v.gorseller[0];
}

export default function AnaSayfa() {
  const vitrin = [
    { u: urun("soft-cool-bonbon-vazo"), g: gorsel("soft-cool-bonbon-vazo", 0, 0) },
    { u: urun("dramatic-cool-bonbon-vazo"), g: gorsel("dramatic-cool-bonbon-vazo", 0, 0) },
    { u: urun("trendy-milas-vazo"), g: gorsel("trendy-milas-vazo", 0, 2) },
  ];
  const bonbonlar = urunler.filter((u) => u.koleksiyonlar.includes("bonbon-serisi"));
  const yeniYil = ["kurabiye-adam-sunum-tabagi", "cam-agaci-ekose-servis-tabagi", "tavus-kusu-desenli-mum"].map(urun);
  const mumlar = ["sessiz-kureler-mum", "tirtikli-samdan-mum", "dantel-dokunuslu-mum", "sevimli-kopek-mum"].map(urun);
  const seramikler = [
    { u: urun("modern-tasarimli-seramik-vazo"), g: gorsel("modern-tasarimli-seramik-vazo", 0, 1) },
    { u: urun("oval-bosluklu-seramik-vazo"), g: gorsel("oval-bosluklu-seramik-vazo", 0, 0) },
    { u: urun("kulplu-seramik-vazo"), g: gorsel("kulplu-seramik-vazo", 1, 0) },
    { u: urun("siyah-konturlu-seramik-vazo"), g: gorsel("siyah-konturlu-seramik-vazo", 0, 0) },
    { u: urun("heykelsi-seramik-vazo"), g: gorsel("heykelsi-seramik-vazo", 0, 1) },
  ];
  const yeniYilKoleksiyonu = koleksiyonBul("yeni-yil-sofrasi");

  return (
    <>
      {/* ───── Vitrin ───── */}
      <section aria-labelledby="vitrin-baslik" className="kabuk pb-16 pt-10 sm:pt-14 lg:pb-28">
        <div className="max-w-3xl">
          <h1 id="vitrin-baslik" className="baslik-1">
            Doğal dokular, sade formlar.
          </h1>
          <p className="giris-metni mt-5">
            Zen felsefesinden ilham alan vazolar, mumlar ve sunum tabakları. İstanbul’dan, {MAGAZA.kargoyaVerilis} içinde kargoda.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/urunler" className={dugmeSinifi({ boy: "b" })}>
              Bütün ürünleri gör
            </Link>
            <Link href="/koleksiyon/bonbon-serisi" className={dugmeSinifi({ tur: "metin" })}>
              Bonbon serisi
            </Link>
          </div>
        </div>

        <ul role="list" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:mt-14 lg:gap-6">
          {vitrin.map(({ u, g }, i) => (
            <li key={u.slug} className={i === 1 ? "sm:translate-y-10" : i === 2 ? "hidden sm:block" : ""}>
              <Link href={`/urun/${u.slug}`} className="group block">
                <span className="relative block aspect-[4/5] overflow-hidden rounded-kucuk" style={{ backgroundColor: g.renk }}>
                  <Image
                    src={g.src}
                    alt={u.ad}
                    fill
                    sizes="(min-width: 1408px) 440px, (min-width: 640px) 32vw, 48vw"
                    className="object-cover"
                    preload={i === 0}
                    fetchPriority={i === 0 ? "high" : undefined}
                  />
                </span>
                <span className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 text-[0.9375rem]">
                  <span className="font-medium group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                    {u.ad}
                  </span>
                  <Fiyat fiyat={u.varyantlar[0].fiyat} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ───── Kategoriler ───── */}
      <section aria-labelledby="kategori-baslik" className="border-t border-cizgi py-14 lg:py-20">
        <div className="kabuk flex items-end justify-between gap-6">
          <h2 id="kategori-baslik" className="baslik-2">
            Kategoriler
          </h2>
          <Link href="/urunler" className={dugmeSinifi({ tur: "metin", ek: "hidden sm:inline-flex" })}>
            Tüm ürünler ({urunler.length})
          </Link>
        </div>
        <div className="mx-auto mt-8 max-w-[var(--kabuk)] lg:px-[var(--kenar)]">
          <ul
            role="list"
            className="ray auto-cols-[42%] sm:auto-cols-[28%] lg:grid-flow-row lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-0"
          >
            {kategoriler.map((k) => {
              const g = kapakGorseli(k.slug);
              const adet = urunler.filter((u) => u.kategori === k.slug).length;
              return (
                <li key={k.slug}>
                  <Link href={`/kategori/${k.slug}`} className="group block">
                    <span
                      className="relative block aspect-[4/5] overflow-hidden rounded-kucuk"
                      style={{ backgroundColor: g.renk }}
                    >
                      <Image src={g.src} alt="" fill sizes="(min-width: 1024px) 18vw, 42vw" className="object-cover" />
                    </span>
                    <span className="mt-3 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
                      <span className="font-baslik text-lg leading-snug group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                        {k.ad}
                      </span>
                      <span className="rakam text-etiket text-murekkep-3">{adet} ürün</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───── Bonbon serisi (adaçayı bant) ───── */}
      <section aria-labelledby="bonbon-baslik" className="bg-adacayi">
        <div className="kabuk grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-kucuk lg:col-span-6 lg:aspect-[5/6]">
            <Image
              src={gorsel("boho-ege-bonbon-vazo", 0, 4).src}
              alt="Lavanta tonlu Boho Ege Bonbon Vazo, adaçayı yeşili bir duvarın önünde kuru başaklarla"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 id="bonbon-baslik" className="baslik-2">
              Kapağı şeker renginde, gövdesi cam.
            </h2>
            <p className="mt-4 max-w-[46ch] text-murekkep-2">
              Bonbon serisinin her parçası iki ayrı camdan oluşur. Kapağı kaldırınca küçük bir saklama kabı, kapalıyken rafta tek
              başına duran bir obje. Çiçeksiz de tamamlanmış görünür.
            </p>
            <ul role="list" className="mt-8 divide-y divide-murekkep/10 border-y border-murekkep/10">
              {bonbonlar.map((u) => {
                const g = u.varyantlar[0].gorseller[0];
                return (
                  <li key={u.slug}>
                    <Link href={`/urun/${u.slug}`} className="group flex items-center gap-4 py-3">
                      <span
                        className="relative size-16 shrink-0 overflow-hidden rounded-kucuk"
                        style={{ backgroundColor: g.renk }}
                      >
                        <Image src={g.src} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                          {u.ad}
                        </span>
                        <span className="block truncate text-sm text-murekkep-2">{u.ozet}</span>
                      </span>
                      <span className="rakam shrink-0 text-[0.9375rem]">{tl(u.varyantlar[0].fiyat)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link href="/koleksiyon/bonbon-serisi" className={dugmeSinifi({ tur: "metin", ek: "mt-5" })}>
              Seriyi tek sayfada gör
              <IkonOk size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Mumlar ───── */}
      <section aria-labelledby="mum-baslik" className="kabuk py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="mum-baslik" className="baslik-2 lg:col-span-6">
            Kokusuz mumlar, sofraya karışmayan ışık.
          </h2>
          <div className="flex flex-col gap-4 lg:col-span-5 lg:col-start-8">
            <p className="text-murekkep-2">
              Top mumlar, 25 cm şamdan mumları ve figürlü mumlar. Hepsi Türkiye’de üretiliyor ve kokusuz; yemeğin kokusuyla
              yarışmıyor.
            </p>
            <Link href="/kategori/mum" className={dugmeSinifi({ tur: "metin", ek: "self-start" })}>
              Bütün mumlar
              <IkonOk size={18} />
            </Link>
          </div>
        </div>
        <ul role="list" className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
          {mumlar.map((u) => (
            <li key={u.slug}>
              <UrunKarti urun={kartModeli(u)} />
            </li>
          ))}
        </ul>
      </section>

      {/* ───── Yeni yıl sofrası (koyu bant) ───── */}
      <section aria-labelledby="yeniyil-baslik" className="bg-gece text-kagit">
        <div className="kabuk grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:gap-12 lg:py-24">
          <div className="lg:col-span-5">
            <h2 id="yeniyil-baslik" className="baslik-2">
              Yeni yıl sofrası için tabaklar ve mumlar
            </h2>
            <p className="mt-4 max-w-[44ch] text-krem-soluk">{yeniYilKoleksiyonu?.ozet}</p>
            <Link href="/koleksiyon/yeni-yil-sofrasi" className={dugmeSinifi({ tur: "acik", ek: "mt-7" })}>
              Koleksiyonu gör
            </Link>
            <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-kucuk lg:block">
              <Image
                src={gorsel("kar-tanesi-desenli-tabak", 0, 1).src}
                alt="Kar tanesi desenli tabak, mumlar ve çam dallarıyla kurulmuş bir yeni yıl sofrası"
                fill
                sizes="36vw"
                className="object-cover"
              />
            </div>
          </div>
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6 lg:grid-cols-2 lg:gap-x-6 lg:self-end"
          >
            {yeniYil.map((u, i) => {
              const g = i === 0 ? gorsel(u.slug, 0, 3) : gorsel(u.slug, 0, 0);
              return (
                <li key={u.slug} className={i === 0 ? "col-span-2 sm:col-span-1 lg:col-span-2" : ""}>
                  <Link href={`/urun/${u.slug}`} className="group block">
                    <span
                      className={`relative block overflow-hidden rounded-kucuk ${i === 0 ? "aspect-[4/3] sm:aspect-[3/4] lg:aspect-[16/10]" : "aspect-[3/4]"}`}
                      style={{ backgroundColor: g.renk }}
                    >
                      <Image src={g.src} alt={u.ad} fill sizes="(min-width: 1024px) 34vw, 50vw" className="object-cover" />
                    </span>
                    <span className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 text-[0.9375rem]">
                      <span className="font-medium group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                        {u.ad}
                      </span>
                      <span className="rakam text-krem-soluk">{tl(u.varyantlar[0].fiyat)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───── Marka cümlesi ───── */}
      <section aria-labelledby="marka-baslik" className="kabuk grid grid-cols-1 gap-8 py-16 lg:grid-cols-12 lg:py-28">
        <h2
          id="marka-baslik"
          className="font-baslik text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] leading-[1.08] tracking-[-0.02em] lg:col-span-7"
        >
          Doğal, yalın, uyumlu ve şiirsel.
        </h2>
        <div className="space-y-4 text-murekkep-2 lg:col-span-4 lg:col-start-9">
          <p>
            Bu dört kelime Zensori’nin ürün açıklamalarında tekrar tekrar geçer. Mango ağacının damarı, mat seramiğin dokusu,
            camın içinden geçen ışık: bir parça bu kelimelere uyuyorsa rafa çıkar.
          </p>
          <p>
            Ürünlerimiz Trendyol’da 9,4 satıcı puanıyla satışta, Hepsiburada ve n11’de de mağazamız var. Burada aynı ürünleri
            doğrudan bizden alırsınız.
          </p>
          <Link href="/hakkimizda" className={dugmeSinifi({ tur: "metin" })}>
            Hikâyemizi okuyun
          </Link>
        </div>
      </section>

      {/* ───── Heykelsi seramikler (mozaik) ───── */}
      <section aria-labelledby="seramik-baslik" className="border-t border-cizgi py-16 lg:py-24">
        <div className="kabuk flex flex-wrap items-end justify-between gap-4">
          <h2 id="seramik-baslik" className="baslik-2">
            Heykelsi seramikler
          </h2>
          <Link href="/koleksiyon/heykelsi-seramikler" className={dugmeSinifi({ tur: "metin" })}>
            Koleksiyonu gör
            <IkonOk size={18} />
          </Link>
        </div>
        <ul role="list" className="kabuk mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:grid-rows-2 lg:gap-6">
          {seramikler.map(({ u, g }, i) => (
            <li key={u.slug} className={i === 0 ? "col-span-2 lg:row-span-2" : i === 4 ? "col-span-2 lg:col-span-1" : ""}>
              <Link href={`/urun/${u.slug}`} className="group relative block h-full">
                <span
                  className={`relative block overflow-hidden rounded-kucuk ${
                    i === 0 ? "aspect-[4/5] lg:aspect-auto lg:h-full" : i === 4 ? "aspect-[2/1] lg:aspect-[4/5]" : "aspect-[4/5]"
                  }`}
                  style={{ backgroundColor: g.renk }}
                >
                  <Image
                    src={g.src}
                    alt={u.ad}
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                    className="object-cover"
                  />
                </span>
                <span className="absolute inset-x-2 bottom-2 flex items-baseline justify-between gap-2 rounded-kontrol bg-kagit/90 px-3 py-2 text-sm backdrop-blur-sm">
                  <span className="truncate font-medium">{u.ad}</span>
                  <span className={`rakam shrink-0 text-murekkep-2 ${i === 0 || i === 4 ? "" : "hidden sm:inline"}`}>
                    {tl(u.varyantlar[0].fiyat)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ───── Instagram ───── */}
      <section aria-labelledby="instagram-baslik" className="bg-kagit-2 py-14 lg:py-20">
        <div className="kabuk flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="instagram-baslik" className="baslik-3">
              Evlerde Zensori
            </h2>
            <p className="mt-2 text-murekkep-2">Instagram hesabımızdan son paylaşımlar.</p>
          </div>
          <a href={MAGAZA.sosyal.instagram} target="_blank" rel="noopener" className={dugmeSinifi({ tur: "ikincil" })}>
            <IkonInstagram size={20} />
            {MAGAZA.sosyal.instagramKullanici}
          </a>
        </div>
        <ul role="list" className="kabuk mt-8 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {instagramGonderileri.slice(0, 6).map((g) => (
            <li key={g.src}>
              <a
                href={g.url}
                target="_blank"
                rel="noopener"
                className="relative block aspect-square overflow-hidden rounded-kucuk"
                style={{ backgroundColor: g.renk }}
              >
                <Image
                  src={g.src}
                  alt="Zensori Home Instagram paylaşımı"
                  fill
                  sizes="(min-width: 1024px) 16vw, 33vw"
                  className="object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ───── Alışveriş bilgileri ───── */}
      <section aria-label="Alışveriş bilgileri" className="kabuk py-12">
        <ul role="list" className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              ikon: IkonKargo,
              baslik: `${tl(MAGAZA.ucretsizKargoEsigi)} üzeri kargo ücretsiz`,
              metin: `Altındaki siparişlerde kargo ${tl(MAGAZA.kargoUcreti)}.`,
            },
            {
              ikon: IkonPaket,
              baslik: `${MAGAZA.kargoyaVerilis} içinde kargoda`,
              metin: "Tahmini kargo tarihi sipariş özetinde yazar.",
            },
            {
              ikon: IkonIade,
              baslik: `${MAGAZA.iadeSuresiGun} gün içinde iade`,
              metin: "Fikriniz değişirse gerekçe sormadan iade alırız.",
            },
            { ikon: IkonOdeme, baslik: "Havale / EFT ve kapıda ödeme", metin: "Sitemiz kart bilgisi istemez." },
          ].map(({ ikon: Ikon, baslik, metin }) => (
            <li key={baslik} className="flex gap-3">
              <Ikon size={24} className="mt-0.5 shrink-0 text-orman" />
              <div>
                <p className="font-medium">{baslik}</p>
                <p className="text-sm text-murekkep-2">{metin}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
