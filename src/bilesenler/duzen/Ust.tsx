"use client";

// Site başlığı. Masaüstü: [arama] [logo] [favori, sepet] + altında kategori satırı.
// Mobil: [menü, arama] [logo] [favori, sepet]. Aşağı kaydırınca gizlenir, yukarı kaydırınca geri gelir.

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/bilesenler/Logo";
import { IkonAra, IkonAsagi, IkonInstagram, IkonKalp, IkonMenu, IkonSepet } from "@/bilesenler/ikon";
import { simgeDugmeSinifi } from "@/bilesenler/ui/dugme";
import { Cekmece } from "@/bilesenler/ui/Cekmece";
import { useSepet } from "@/istemci/sepet";
import { useFavoriler } from "@/istemci/favori";
import { AramaPaneli } from "./AramaPaneli";

export type MenuKategori = { slug: string; ad: string };
export type MenuKoleksiyon = { slug: string; ad: string; ozet: string; gorsel: { src: string; renk: string } };

function Sayac({ deger, etiket }: { deger: number; etiket: string }) {
  if (deger === 0) return null;
  return (
    <span className="rakam absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-orman px-1 text-[0.6875rem] font-medium leading-5 text-kagit">
      {deger}
      <span className="sr-only"> {etiket}</span>
    </span>
  );
}

function useKaydirmaGizle(kilitli: boolean) {
  const [gizli, setGizli] = useState(false);
  const son = useRef(0);
  useEffect(() => {
    let bekliyor = false;
    function dinle() {
      if (bekliyor) return;
      bekliyor = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const fark = y - son.current;
        if (Math.abs(fark) > 8) {
          setGizli(fark > 0 && y > 180);
          son.current = y;
        }
        bekliyor = false;
      });
    }
    window.addEventListener("scroll", dinle, { passive: true });
    return () => window.removeEventListener("scroll", dinle);
  }, []);
  return gizli && !kilitli;
}

export function Ust({ kategoriler, koleksiyonlar }: { kategoriler: MenuKategori[]; koleksiyonlar: MenuKoleksiyon[] }) {
  const yol = usePathname();
  const sepet = useSepet();
  const { liste: favoriler } = useFavoriler();
  const [menuAcik, setMenuAcik] = useState(false);
  const [aramaAcik, setAramaAcik] = useState(false);
  const [koleksiyonAcik, setKoleksiyonAcik] = useState(false);
  const gizli = useKaydirmaGizle(koleksiyonAcik);
  const koleksiyonKutusu = useRef<HTMLDivElement>(null);

  // Sayfa değişince açık paneller kapanır
  const [oncekiYol, setOncekiYol] = useState(yol);
  if (yol !== oncekiYol) {
    setOncekiYol(yol);
    setMenuAcik(false);
    setKoleksiyonAcik(false);
  }

  // Koleksiyon paneli: dışarı tıklayınca ya da Esc ile kapanır
  useEffect(() => {
    if (!koleksiyonAcik) return;
    function tikla(olay: MouseEvent) {
      if (!koleksiyonKutusu.current?.contains(olay.target as Node)) setKoleksiyonAcik(false);
    }
    function tus(olay: KeyboardEvent) {
      if (olay.key === "Escape") setKoleksiyonAcik(false);
    }
    document.addEventListener("click", tikla);
    document.addEventListener("keydown", tus);
    return () => {
      document.removeEventListener("click", tikla);
      document.removeEventListener("keydown", tus);
    };
  }, [koleksiyonAcik]);

  const aktif = (yolBasi: string) => yol === yolBasi || yol.startsWith(`${yolBasi}/`);

  return (
    <>
      <header
        className={`sticky top-0 z-[200] border-b border-cizgi bg-kagit/92 backdrop-blur-md transition-transform duration-300 ease-cikis ${
          gizli ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="kabuk grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className={`${simgeDugmeSinifi} -ml-2.5 lg:hidden`}
              onClick={() => setMenuAcik(true)}
              aria-label="Menüyü aç"
            >
              <IkonMenu size={24} />
            </button>
            <button
              type="button"
              className={`${simgeDugmeSinifi} lg:hidden`}
              onClick={() => setAramaAcik(true)}
              aria-label="Ürün ara"
            >
              <IkonAra size={22} />
            </button>
            <button
              type="button"
              onClick={() => setAramaAcik(true)}
              className="hidden h-10 w-60 items-center gap-2.5 rounded-full border border-cizgi bg-yuzey/60 px-4 text-left text-sm text-murekkep-3 transition-colors hover:border-cizgi-koyu lg:flex"
            >
              <IkonAra size={18} className="text-murekkep-2" />
              Vazo, mum, tabak ara
            </button>
          </div>

          <Link href="/" className="rounded-kontrol px-1 py-1" aria-label="Zensori Home ana sayfa">
            <Logo />
          </Link>

          <div className="flex items-center justify-end gap-0.5">
            <Link href="/favoriler" className={`${simgeDugmeSinifi}`} aria-label="Favoriler">
              <IkonKalp size={22} />
              <Sayac deger={favoriler.length} etiket="favori ürün" />
            </Link>
            <button type="button" onClick={sepet.cekmeceyiAc} className={`${simgeDugmeSinifi} -mr-2.5`} aria-label="Sepeti aç">
              <IkonSepet size={23} />
              <Sayac deger={sepet.adetToplam} etiket="ürün sepette" />
            </button>
          </div>
        </div>

        <div ref={koleksiyonKutusu} className="relative hidden lg:block">
          <nav aria-label="Kategoriler" className="kabuk flex h-11 items-center justify-center gap-1">
            <Link
              href="/urunler"
              className={`menu-baglantisi ${aktif("/urunler") ? "is-aktif" : ""}`}
              aria-current={aktif("/urunler") ? "page" : undefined}
            >
              Tüm ürünler
            </Link>
            {kategoriler.map((k) => (
              <Link
                key={k.slug}
                href={`/kategori/${k.slug}`}
                className={`menu-baglantisi ${aktif(`/kategori/${k.slug}`) ? "is-aktif" : ""}`}
                aria-current={aktif(`/kategori/${k.slug}`) ? "page" : undefined}
              >
                {k.ad}
              </Link>
            ))}
            <button
              type="button"
              className={`menu-baglantisi inline-flex items-center gap-1 ${aktif("/koleksiyon") || koleksiyonAcik ? "is-aktif" : ""}`}
              aria-expanded={koleksiyonAcik}
              aria-controls="koleksiyon-paneli"
              onClick={() => setKoleksiyonAcik((a) => !a)}
            >
              Koleksiyonlar
              <IkonAsagi size={14} className={`transition-transform duration-200 ${koleksiyonAcik ? "rotate-180" : ""}`} />
            </button>
            <Link href="/hakkimizda" className={`menu-baglantisi ${aktif("/hakkimizda") ? "is-aktif" : ""}`}>
              Hikâyemiz
            </Link>
          </nav>

          <div
            id="koleksiyon-paneli"
            hidden={!koleksiyonAcik}
            className="absolute inset-x-0 top-full border-y border-cizgi bg-kagit shadow-katman"
          >
            <ul role="list" className="kabuk grid grid-cols-4 gap-6 py-8">
              {koleksiyonlar.map((k) => (
                <li key={k.slug}>
                  <Link href={`/koleksiyon/${k.slug}`} className="group block">
                    <span
                      className="relative block aspect-[4/3] overflow-hidden rounded-kucuk"
                      style={{ backgroundColor: k.gorsel.renk }}
                    >
                      <Image src={k.gorsel.src} alt="" fill sizes="22vw" className="object-cover" />
                    </span>
                    <span className="mt-3 block font-baslik text-lg group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                      {k.ad}
                    </span>
                    <span className="mt-1 block text-sm text-murekkep-2">{k.ozet}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <AramaPaneli acik={aramaAcik} kapat={() => setAramaAcik(false)} />

      <Cekmece acik={menuAcik} kapat={() => setMenuAcik(false)} baslik="Menü" taraf="sol" genislik="24rem">
        <nav aria-label="Mobil menü" className="px-5 py-4">
          <ul role="list" className="divide-y divide-cizgi">
            <li>
              <Link href="/urunler" className="flex min-h-14 items-center font-baslik text-xl">
                Tüm ürünler
              </Link>
            </li>
            {kategoriler.map((k) => (
              <li key={k.slug}>
                <Link href={`/kategori/${k.slug}`} className="flex min-h-14 items-center font-baslik text-xl">
                  {k.ad}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-etiket text-murekkep-3">Koleksiyonlar</p>
          <ul role="list" className="mt-2 grid grid-cols-2 gap-3">
            {koleksiyonlar.map((k) => (
              <li key={k.slug}>
                <Link href={`/koleksiyon/${k.slug}`} className="block">
                  <span
                    className="relative block aspect-square overflow-hidden rounded-kucuk"
                    style={{ backgroundColor: k.gorsel.renk }}
                  >
                    <Image src={k.gorsel.src} alt="" fill sizes="45vw" className="object-cover" />
                  </span>
                  <span className="mt-2 block text-sm font-medium">{k.ad}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul role="list" className="mt-8 space-y-1 text-[0.9375rem]">
            {[
              ["/hakkimizda", "Hikâyemiz"],
              ["/kargo-ve-iade", "Kargo ve iade"],
              ["/sss", "Sık sorulanlar"],
              ["/iletisim", "İletişim"],
            ].map(([href, ad]) => (
              <li key={href}>
                <Link href={href} className="flex min-h-11 items-center">
                  {ad}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://www.instagram.com/zensorihome/"
                target="_blank"
                rel="noopener"
                className="flex min-h-11 items-center gap-2"
              >
                <IkonInstagram size={20} /> @zensorihome
              </a>
            </li>
          </ul>
        </nav>
      </Cekmece>
    </>
  );
}
