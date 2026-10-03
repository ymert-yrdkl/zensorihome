"use client";

import Image from "next/image";
import Link from "next/link";
import { anahtar, useSepet } from "@/istemci/sepet";
import { tl } from "@/magaza/para";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { IkonSepet } from "@/bilesenler/ikon";
import { AdetSecici } from "./AdetSecici";
import { KargoIlerleme } from "./KargoIlerleme";

export function SepetSayfasi({ odemeNotu }: { odemeNotu: React.ReactNode }) {
  const sepet = useSepet();

  if (sepet.kalemler.length === 0) {
    return (
      <div className="kabuk pb-24">
        <div className="mx-auto max-w-lg rounded-panel bg-kagit-2 px-6 py-14 text-center">
          <IkonSepet size={40} className="mx-auto text-murekkep-3" />
          <h2 className="mt-4 font-baslik text-2xl">Sepetiniz boş</h2>
          <p className="mt-2 text-murekkep-2">Beğendiğiniz ürünü “Sepete ekle” ile buraya taşıyın.</p>
          {sepet.silinen ? (
            <p className="mt-4 text-sm">
              {sepet.silinen.kalem.ad} çıkarıldı.{" "}
              <button type="button" onClick={sepet.geriAl} className="min-h-11 font-medium underline underline-offset-4">
                Geri al
              </button>
            </p>
          ) : null}
          <Link href="/urunler" className={dugmeSinifi({ ek: "mt-6" })}>
            Ürünlere göz at
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="kabuk grid grid-cols-1 gap-10 pb-24 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-8">
        <ul role="list" className="divide-y divide-cizgi border-y border-cizgi">
          {sepet.kalemler.map((k) => (
            <li key={anahtar(k.slug, k.kod)} className="flex gap-4 py-5 sm:gap-6">
              <Link
                href={`/urun/${k.slug}?v=${k.kod}`}
                className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-kucuk sm:w-28"
                style={{ backgroundColor: k.gorsel.renk }}
              >
                <Image src={k.gorsel.src} alt={k.ad} fill sizes="112px" className="object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                  <div className="min-w-0">
                    <Link href={`/urun/${k.slug}?v=${k.kod}`} className="font-medium hover:underline hover:underline-offset-4">
                      {k.ad}
                    </Link>
                    {k.etiket ? <p className="text-sm text-murekkep-2">{k.etiket}</p> : null}
                    <p className="rakam mt-1 text-sm text-murekkep-3">Birim fiyat {tl(k.fiyat)}</p>
                  </div>
                  <p className="rakam font-medium">{tl(k.fiyat * k.adet)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                  <AdetSecici deger={k.adet} ad={k.ad} degistir={(a) => sepet.adetAyarla(k.slug, k.kod, a)} />
                  <button
                    type="button"
                    onClick={() => sepet.cikar(k.slug, k.kod)}
                    className="min-h-11 text-sm text-murekkep-2 underline decoration-cizgi-koyu underline-offset-4 hover:text-murekkep"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {sepet.silinen ? (
          <p role="status" className="mt-3 flex items-center justify-between gap-3 rounded-kontrol bg-kagit-2 px-4 py-2 text-sm">
            <span>{sepet.silinen.kalem.ad} sepetten çıkarıldı.</span>
            <button type="button" onClick={sepet.geriAl} className="min-h-11 font-medium underline underline-offset-4">
              Geri al
            </button>
          </p>
        ) : null}
        <Link href="/urunler" className={dugmeSinifi({ tur: "metin", ek: "mt-6" })}>
          Alışverişe devam et
        </Link>
      </div>

      <aside aria-label="Sepet toplamı" className="lg:col-span-4">
        <div className="rounded-panel border border-cizgi bg-yuzey px-6 py-6 lg:sticky lg:top-32">
          <KargoIlerleme araToplam={sepet.araToplam} />
          <dl className="mt-5 space-y-2 text-[0.9375rem]">
            <div className="flex justify-between">
              <dt className="text-murekkep-2">Ara toplam ({sepet.adetToplam} ürün)</dt>
              <dd className="rakam">{tl(sepet.araToplam)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-murekkep-2">Kargo</dt>
              <dd className="rakam">{sepet.kargo === 0 ? "Ücretsiz" : tl(sepet.kargo)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-cizgi pt-3">
              <dt className="font-medium">Toplam</dt>
              <dd className="rakam text-xl font-medium">{tl(sepet.araToplam + sepet.kargo)}</dd>
            </div>
          </dl>
          <Link href="/odeme" className={dugmeSinifi({ boy: "b", tam: true, ek: "mt-6" })}>
            Ödemeye geç
          </Link>
          <div className="mt-5 text-sm text-murekkep-2">{odemeNotu}</div>
        </div>
      </aside>
    </div>
  );
}
