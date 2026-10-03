import Image from "next/image";
import Link from "next/link";
import type { UrunKarti as Kart } from "@/katalog/katalog";
import { renkOrnegi } from "@/katalog/renkler";
import { Fiyat } from "./Fiyat";
import { FavoriDugmesi } from "./FavoriDugmesi";

export const KART_GORSEL_BOYU = "(min-width: 1408px) 330px, (min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw";

export function UrunKarti({ urun, oncelikli = false }: { urun: Kart; oncelikli?: boolean }) {
  return (
    <article className="group relative flex flex-col">
      <Link href={`/urun/${urun.slug}`} className="flex flex-col rounded-kucuk focus-visible:outline-offset-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-kucuk" style={{ backgroundColor: urun.gorsel.renk }}>
          <Image
            src={urun.gorsel.src}
            alt={urun.ad}
            fill
            sizes={KART_GORSEL_BOYU}
            className="object-cover"
            {...(oncelikli ? { preload: true } : {})}
          />
          {urun.gorsel2 ? (
            <Image
              src={urun.gorsel2.src}
              alt=""
              fill
              sizes={KART_GORSEL_BOYU}
              className="object-cover opacity-0 transition-opacity duration-500 ease-cikis [@media(hover:hover)]:group-hover:opacity-100"
            />
          ) : null}
        </div>
        <div className="mt-3 flex flex-col gap-1 pr-1">
          {urun.marka !== "zensori" ? <span className="text-etiket text-murekkep-3">{urun.marka}</span> : null}
          <h3 className="font-govde text-[0.9375rem] font-medium leading-snug tracking-normal text-murekkep">{urun.ad}</h3>
          <Fiyat fiyat={urun.fiyat} eskiFiyat={urun.eskiFiyat} baslangic={urun.fiyatFarkli} />
          {urun.secenekOzeti ? (
            <span className="mt-0.5 flex items-center gap-2 text-etiket text-murekkep-3">
              {urun.renkler.length > 1 ? (
                <span className="flex -space-x-1" aria-hidden="true">
                  {urun.renkler.slice(0, 4).map((renk) => (
                    <span
                      key={renk}
                      className="size-3 rounded-full ring-1 ring-kagit"
                      style={{ backgroundColor: renkOrnegi(renk), boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.12)" }}
                    />
                  ))}
                </span>
              ) : null}
              {urun.secenekOzeti}
            </span>
          ) : null}
        </div>
      </Link>
      <FavoriDugmesi slug={urun.slug} ad={urun.ad} ek="absolute right-1 top-1" />
    </article>
  );
}

export function UrunIzgara({ urunler, ilkOncelikli = 0 }: { urunler: Kart[]; ilkOncelikli?: number }) {
  return (
    <ul role="list" className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
      {urunler.map((urun, i) => (
        <li key={urun.slug}>
          <UrunKarti urun={urun} oncelikli={i < ilkOncelikli} />
        </li>
      ))}
    </ul>
  );
}
