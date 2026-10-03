"use client";

import Image from "next/image";
import Link from "next/link";
import { Cekmece } from "@/bilesenler/ui/Cekmece";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { IkonSepet } from "@/bilesenler/ikon";
import { anahtar, useSepet } from "@/istemci/sepet";
import { tl } from "@/magaza/para";
import { AdetSecici } from "./AdetSecici";
import { KargoIlerleme } from "./KargoIlerleme";

export function SepetCekmecesi() {
  const sepet = useSepet();
  const bos = sepet.kalemler.length === 0;

  return (
    <Cekmece
      acik={sepet.cekmeceAcik}
      kapat={sepet.cekmeceyiKapat}
      baslik={bos ? "Sepetiniz" : `Sepetiniz (${sepet.adetToplam})`}
      alt={
        bos ? null : (
          <div className="space-y-3 px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-murekkep-2">Ara toplam</span>
              <span className="rakam text-lg font-medium">{tl(sepet.araToplam)}</span>
            </div>
            <p className="text-sm text-murekkep-3">Kargo ve ödeme seçenekleri bir sonraki adımda.</p>
            <Link href="/odeme" onClick={sepet.cekmeceyiKapat} className={dugmeSinifi({ tam: true, boy: "b" })}>
              Ödemeye geç
            </Link>
            <Link href="/sepet" onClick={sepet.cekmeceyiKapat} className={dugmeSinifi({ tur: "ikincil", tam: true })}>
              Sepeti görüntüle
            </Link>
          </div>
        )
      }
    >
      {bos ? (
        <div className="flex flex-col items-center px-8 py-16 text-center">
          <IkonSepet size={40} className="text-murekkep-3" />
          <p className="mt-4 font-baslik text-xl">Sepetiniz boş</p>
          <p className="mt-2 max-w-[28ch] text-murekkep-2">Beğendiğiniz ürünü “Sepete ekle” ile buraya taşıyın.</p>
          <Link href="/urunler" onClick={sepet.cekmeceyiKapat} className={dugmeSinifi({ ek: "mt-6" })}>
            Ürünlere göz at
          </Link>
          {sepet.silinen ? <GeriAl /> : null}
        </div>
      ) : (
        <div className="px-5 py-4">
          <KargoIlerleme araToplam={sepet.araToplam} />
          <ul role="list" className="mt-4 divide-y divide-cizgi">
            {sepet.kalemler.map((k) => (
              <li
                key={anahtar(k.slug, k.kod)}
                className={`flex gap-4 py-4 ${sepet.sonEklenen === anahtar(k.slug, k.kod) ? "-mx-5 bg-adacayi/60 px-5" : ""}`}
              >
                <Link
                  href={`/urun/${k.slug}?v=${k.kod}`}
                  onClick={sepet.cekmeceyiKapat}
                  className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-kucuk"
                  style={{ backgroundColor: k.gorsel.renk }}
                >
                  <Image src={k.gorsel.src} alt="" fill sizes="80px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/urun/${k.slug}?v=${k.kod}`}
                        onClick={sepet.cekmeceyiKapat}
                        className="font-medium leading-snug hover:underline"
                      >
                        {k.ad}
                      </Link>
                      {k.etiket ? <p className="text-sm text-murekkep-2">{k.etiket}</p> : null}
                    </div>
                    <span className="rakam shrink-0 text-[0.9375rem]">{tl(k.fiyat * k.adet)}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <AdetSecici deger={k.adet} ad={k.ad} degistir={(adet) => sepet.adetAyarla(k.slug, k.kod, adet)} />
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
          {sepet.silinen ? <GeriAl /> : null}
        </div>
      )}
    </Cekmece>
  );
}

function GeriAl() {
  const sepet = useSepet();
  if (!sepet.silinen) return null;
  return (
    <p role="status" className="mt-2 flex items-center justify-between gap-3 rounded-kontrol bg-kagit-2 px-4 py-2 text-sm">
      <span className="min-w-0 truncate">{sepet.silinen.kalem.ad} sepetten çıkarıldı.</span>
      <button type="button" onClick={sepet.geriAl} className="min-h-11 shrink-0 font-medium underline underline-offset-4">
        Geri al
      </button>
    </p>
  );
}
