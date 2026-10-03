"use client";

// Ürün sayfasının etkileşimli kısmı: galeri, seçenekler, adet ve sepete ekleme.
// Seçilen varyant adres satırına (?v=kod) yazılır; paylaşılan bağlantı aynı seçimle açılır.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SecenekTuru } from "@/katalog/katalog";
import { renkOrnegi } from "@/katalog/renkler";
import { useSepet } from "@/istemci/sepet";
import { tl } from "@/magaza/para";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { Cekmece } from "@/bilesenler/ui/Cekmece";
import { IkonSol, IkonSag, IkonTamam } from "@/bilesenler/ikon";
import { AdetSecici } from "@/bilesenler/sepet/AdetSecici";
import { Fiyat } from "./Fiyat";
import { FavoriDugmesi } from "./FavoriDugmesi";

export type IstemciGorsel = { src: string; genislik: number; yukseklik: number; renk: string };
export type IstemciVaryant = {
  kod: string;
  secimler: Partial<Record<SecenekTuru, string>>;
  renk: string;
  fiyat: number;
  eskiFiyat?: number;
  stokta: boolean;
  gorseller: IstemciGorsel[];
};
export type IstemciUrun = {
  slug: string;
  ad: string;
  marka: string;
  secenekler: SecenekTuru[];
  varyantlar: IstemciVaryant[];
};

const SECENEK_ADI: Record<SecenekTuru, string> = { renk: "Renk", boyut: "Boyut", hacim: "Hacim", model: "Model" };

function etiket(urun: IstemciUrun, v: IstemciVaryant) {
  if (urun.varyantlar.length === 1) return "";
  return urun.secenekler
    .map((t) => v.secimler[t])
    .filter(Boolean)
    .join(", ");
}

// Bir seçeneğe tıklanınca: o değeri taşıyan ve diğer seçimlerle en çok örtüşen varyant
function enUygunVaryant(urun: IstemciUrun, mevcut: IstemciVaryant, tur: SecenekTuru, deger: string) {
  const adaylar = urun.varyantlar.filter((v) => v.secimler[tur] === deger);
  const puan = (v: IstemciVaryant) => urun.secenekler.filter((t) => t !== tur && v.secimler[t] === mevcut.secimler[t]).length;
  return adaylar.sort((a, b) => puan(b) - puan(a))[0] ?? mevcut;
}

export function UrunAlani({
  urun,
  baslangicKod,
  ozet,
  kargoNotu,
  ucretsizKargoEsigi,
  bilgi,
}: {
  urun: IstemciUrun;
  baslangicKod: string;
  ozet: string;
  kargoNotu: React.ReactNode;
  ucretsizKargoEsigi: number;
  bilgi: React.ReactNode;
}) {
  const sepet = useSepet();
  const [kod, setKod] = useState(baslangicKod);
  const [adet, setAdet] = useState(1);
  const [eklendi, setEklendi] = useState(false);
  const [buyukGorsel, setBuyukGorsel] = useState<number | null>(null);
  const [altCubuk, setAltCubuk] = useState(false);
  const anaDugme = useRef<HTMLButtonElement>(null);

  const varyant = urun.varyantlar.find((v) => v.kod === kod) ?? urun.varyantlar[0];

  // Ana "Sepete ekle" düğmesi ekrandan çıkınca mobilde alt çubuk görünür
  useEffect(() => {
    const dugme = anaDugme.current;
    if (!dugme) return;
    const gozlemci = new IntersectionObserver(([g]) => setAltCubuk(!g.isIntersecting && g.boundingClientRect.top < 0));
    gozlemci.observe(dugme);
    return () => gozlemci.disconnect();
  }, []);

  function sec(tur: SecenekTuru, deger: string) {
    const yeni = enUygunVaryant(urun, varyant, tur, deger);
    setKod(yeni.kod);
    window.history.replaceState(null, "", `?v=${yeni.kod}`);
  }

  function sepeteEkle() {
    sepet.ekle(
      {
        slug: urun.slug,
        kod: varyant.kod,
        ad: urun.ad,
        etiket: etiket(urun, varyant),
        fiyat: varyant.fiyat,
        gorsel: { src: varyant.gorseller[0].src, renk: varyant.gorseller[0].renk },
      },
      adet,
    );
    setEklendi(true);
    setTimeout(() => setEklendi(false), 1800);
  }

  const gorseller = varyant.gorseller;
  const tekSayi = gorseller.length % 2 === 1;

  return (
    <div className="kabuk grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      {/* ───── Galeri ───── */}
      <div className="lg:col-span-7">
        {/* Mobil: yatay kaydırma */}
        <div className="-mx-[var(--kenar)] lg:hidden">
          <MobilGaleri key={varyant.kod} gorseller={gorseller} ad={urun.ad} ac={setBuyukGorsel} />
        </div>
        {/* Masaüstü: iki sütun */}
        <ul role="list" className="hidden grid-cols-2 gap-3 lg:grid">
          {gorseller.map((g, i) => (
            <li key={g.src} className={tekSayi && i === 0 ? "col-span-2" : ""}>
              <button
                type="button"
                onClick={() => setBuyukGorsel(i)}
                className={`relative block w-full cursor-zoom-in overflow-hidden rounded-kucuk ${tekSayi && i === 0 ? "aspect-[4/5]" : "aspect-[3/4]"}`}
                style={{ backgroundColor: g.renk }}
                aria-label={`${i + 1}. görseli büyüt`}
              >
                <Image
                  src={g.src}
                  alt={`${urun.ad}, ${varyant.renk.toLocaleLowerCase("tr")}, ${i + 1}. görsel`}
                  fill
                  sizes={tekSayi && i === 0 ? "(min-width: 1408px) 800px, 58vw" : "(min-width: 1408px) 400px, 29vw"}
                  className="object-cover"
                  preload={i === 0}
                  loading={i < 2 ? "eager" : undefined}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ───── Bilgi paneli ───── */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          {urun.marka !== "zensori" ? <p className="text-sm text-murekkep-3">{urun.marka}</p> : null}
          <h1 className="baslik-2 mt-1">{urun.ad}</h1>
          <div className="mt-4">
            <Fiyat fiyat={varyant.fiyat} eskiFiyat={varyant.eskiFiyat} boy="buyuk" />
            <p className="mt-1 text-sm text-murekkep-3">KDV dahil</p>
          </div>
          <p className="mt-5 max-w-[48ch] text-murekkep-2">{ozet}</p>

          {urun.varyantlar.length > 1
            ? urun.secenekler.map((tur) => {
                const degerler = [...new Set(urun.varyantlar.map((v) => v.secimler[tur]).filter((d): d is string => Boolean(d)))];
                if (degerler.length < 2) return null;
                const seciliDeger = varyant.secimler[tur];
                return (
                  <fieldset key={tur} className="mt-7">
                    <legend className="text-sm">
                      <span className="text-murekkep-2">{SECENEK_ADI[tur]}: </span>
                      <span className="font-medium">{seciliDeger}</span>
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {degerler.map((deger) => {
                        const secili = deger === seciliDeger;
                        // Diğer seçimlerle birlikte bu değer var mı?
                        const uyumlu = urun.varyantlar.some(
                          (v) =>
                            v.secimler[tur] === deger &&
                            urun.secenekler.every((t) => t === tur || v.secimler[t] === varyant.secimler[t]),
                        );
                        if (tur === "renk") {
                          return (
                            <button
                              key={deger}
                              type="button"
                              onClick={() => sec(tur, deger)}
                              aria-pressed={secili}
                              aria-label={uyumlu ? deger : `${deger} (bu seçenekle yok, seçince boyut değişir)`}
                              title={deger}
                              className={`grid size-11 place-items-center rounded-full transition-shadow ${
                                secili
                                  ? "ring-2 ring-murekkep ring-offset-2 ring-offset-kagit"
                                  : "hover:ring-1 hover:ring-cizgi-koyu hover:ring-offset-2 hover:ring-offset-kagit"
                              } ${uyumlu ? "" : "opacity-45"}`}
                            >
                              <span
                                className="size-9 rounded-full"
                                style={{ backgroundColor: renkOrnegi(deger), boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.14)" }}
                              />
                            </button>
                          );
                        }
                        const varyantFiyati = enUygunVaryant(urun, varyant, tur, deger).fiyat;
                        return (
                          <button
                            key={deger}
                            type="button"
                            onClick={() => sec(tur, deger)}
                            aria-pressed={secili}
                            className={`min-h-11 rounded-kontrol border px-4 text-[0.9375rem] transition-colors ${
                              secili ? "border-murekkep bg-murekkep text-kagit" : "border-cizgi-koyu hover:border-murekkep"
                            } ${uyumlu ? "" : "border-dashed text-murekkep-3"}`}
                          >
                            {deger}
                            {urun.varyantlar.some((v) => v.fiyat !== varyant.fiyat) ? (
                              <span className={`rakam ml-2 text-sm ${secili ? "text-kagit/80" : "text-murekkep-3"}`}>
                                {tl(varyantFiyati)}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })
            : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <AdetSecici deger={adet} degistir={(a) => setAdet(Math.max(1, Math.min(10, a)))} ad={urun.ad} buyuk />
            <button
              ref={anaDugme}
              type="button"
              onClick={sepeteEkle}
              disabled={!varyant.stokta}
              className={dugmeSinifi({ ek: "h-12 flex-1 basis-48" })}
            >
              {!varyant.stokta ? (
                "Tükendi"
              ) : eklendi ? (
                <>
                  <IkonTamam size={18} weight="bold" /> Sepete eklendi
                </>
              ) : (
                <>Sepete ekle · {tl(varyant.fiyat * adet)}</>
              )}
            </button>
            <FavoriDugmesi slug={urun.slug} ad={urun.ad} kutu />
          </div>
          <p role="status" className="sr-only">
            {eklendi ? `${urun.ad} sepete eklendi` : ""}
          </p>

          <div className="mt-6">
            {kargoNotu}
            {varyant.fiyat * adet >= ucretsizKargoEsigi ? (
              <p className="mt-2 text-sm text-orman">Bu siparişte kargo ücretsiz.</p>
            ) : null}
          </div>

          <div className="mt-8 border-t border-cizgi">{bilgi}</div>
        </div>
      </div>

      {/* Mobil alt çubuk */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[150] border-t border-cizgi bg-kagit/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 ease-cikis lg:hidden ${
          altCubuk ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!altCubuk}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{urun.ad}</p>
            <p className="rakam text-sm text-murekkep-2">
              {etiket(urun, varyant) ? `${etiket(urun, varyant)} · ` : ""}
              {tl(varyant.fiyat)}
            </p>
          </div>
          <button
            type="button"
            onClick={sepeteEkle}
            disabled={!varyant.stokta}
            tabIndex={altCubuk ? 0 : -1}
            className={dugmeSinifi()}
          >
            {eklendi ? "Eklendi" : "Sepete ekle"}
          </button>
        </div>
      </div>

      <Cekmece acik={buyukGorsel !== null} kapat={() => setBuyukGorsel(null)} baslik={urun.ad} taraf="sag" genislik="100vw">
        <BuyukGaleri gorseller={gorseller} ad={urun.ad} baslangic={buyukGorsel ?? 0} />
      </Cekmece>
    </div>
  );
}

function MobilGaleri({ gorseller, ad, ac }: { gorseller: IstemciGorsel[]; ad: string; ac: (i: number) => void }) {
  const [sira, setSira] = useState(0);
  const serit = useRef<HTMLUListElement>(null);
  return (
    <div className="relative">
      <ul
        ref={serit}
        role="list"
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]"
        onScroll={(e) => {
          const el = e.currentTarget;
          setSira(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {gorseller.map((g, i) => (
          <li key={g.src} className="w-full shrink-0 snap-start">
            <button
              type="button"
              onClick={() => ac(i)}
              className="relative block aspect-[4/5] w-full"
              style={{ backgroundColor: g.renk }}
              aria-label={`${i + 1}. görseli büyüt`}
            >
              <Image
                src={g.src}
                alt={`${ad}, ${i + 1}. görsel`}
                fill
                sizes="(min-width: 1024px) 2px, 100vw"
                className="object-cover"
                preload={i === 0}
              />
            </button>
          </li>
        ))}
      </ul>
      {gorseller.length > 1 ? (
        <>
          <span className="rakam absolute right-3 top-3 rounded-full bg-kagit/85 px-2.5 py-1 text-etiket backdrop-blur-sm">
            {sira + 1} / {gorseller.length}
          </span>
          <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
            {gorseller.map((g, i) => (
              <span
                key={g.src}
                className={`h-1 rounded-full transition-all duration-300 ${i === sira ? "w-6 bg-murekkep" : "w-2 bg-cizgi-koyu"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function BuyukGaleri({ gorseller, ad, baslangic }: { gorseller: IstemciGorsel[]; ad: string; baslangic: number }) {
  const [sira, setSira] = useState(baslangic);
  const [onceki, setOnceki] = useState(baslangic);
  if (baslangic !== onceki) {
    setOnceki(baslangic);
    setSira(baslangic);
  }
  const g = gorseller[sira] ?? gorseller[0];
  const git = (fark: number) => setSira((s) => (s + fark + gorseller.length) % gorseller.length);
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-4 px-4 pb-6"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") git(1);
        if (e.key === "ArrowLeft") git(-1);
      }}
    >
      <div className="relative h-[calc(100dvh-9rem)] w-full max-w-4xl">
        <Image src={g.src} alt={`${ad}, ${sira + 1}. görsel`} fill sizes="100vw" className="object-contain" quality={75} />
      </div>
      {gorseller.length > 1 ? (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => git(-1)}
            className={dugmeSinifi({ tur: "ikincil", boy: "k" })}
            aria-label="Önceki görsel"
          >
            <IkonSol size={18} />
          </button>
          <span className="rakam text-sm text-murekkep-2">
            {sira + 1} / {gorseller.length}
          </span>
          <button
            type="button"
            onClick={() => git(1)}
            className={dugmeSinifi({ tur: "ikincil", boy: "k" })}
            aria-label="Sonraki görsel"
          >
            <IkonSag size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
