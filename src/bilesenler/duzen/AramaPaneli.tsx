"use client";

// Üstten açılan arama paneli. Ürün dizini ilk açılışta /api/dizin'den bir kez alınır;
// yazdıkça (Türkçe harf farkını yok sayarak) en çok 6 öneri gösterilir. Enter tüm sonuçlara gider.

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { UrunKarti } from "@/katalog/katalog";
import { katla } from "@/katalog/katla";
import { Cekmece } from "@/bilesenler/ui/Cekmece";
import { IkonAra, IkonOk } from "@/bilesenler/ikon";
import { tl } from "@/magaza/para";

type Dizin = { urunler: UrunKarti[]; kategoriler: { slug: string; ad: string }[] };

let dizinSozu: Promise<Dizin> | null = null;
export function dizinAl() {
  dizinSozu ??= fetch("/api/dizin").then((y) => y.json() as Promise<Dizin>);
  return dizinSozu;
}

const ONERILER = ["bonbon vazo", "top mum", "ekose", "seramik", "yağdanlık"];

export function AramaPaneli({ acik, kapat }: { acik: boolean; kapat: () => void }) {
  const router = useRouter();
  const [sorgu, setSorgu] = useState("");
  const [dizin, setDizin] = useState<Dizin | null>(null);
  const ertelenen = useDeferredValue(sorgu);

  useEffect(() => {
    if (acik && !dizin)
      dizinAl()
        .then(setDizin)
        .catch(() => setDizin({ urunler: [], kategoriler: [] }));
  }, [acik, dizin]);

  const sonuclar = useMemo(() => {
    const kelimeler = katla(ertelenen).split(" ").filter(Boolean);
    if (!dizin || kelimeler.length === 0) return [];
    return dizin.urunler.filter((u) => kelimeler.every((k) => u.aramaMetni.includes(k)));
  }, [dizin, ertelenen]);

  function gonder(olay: React.FormEvent) {
    olay.preventDefault();
    if (!sorgu.trim()) return;
    kapat();
    router.push(`/arama?q=${encodeURIComponent(sorgu.trim())}`);
  }

  return (
    <Cekmece acik={acik} kapat={kapat} baslik="Ürün ara" taraf="ust" basligiGizle>
      <div className="kabuk pb-8">
        <form role="search" onSubmit={gonder} className="mx-auto max-w-3xl">
          <label htmlFor="arama-kutusu" className="sr-only">
            Ürün ara
          </label>
          <div className="flex items-center gap-3 border-b-2 border-murekkep pb-2">
            <IkonAra size={26} />
            <input
              id="arama-kutusu"
              type="search"
              name="q"
              autoComplete="off"
              enterKeyHint="search"
              placeholder="Vazo, mum, ekose tabak…"
              value={sorgu}
              onChange={(e) => setSorgu(e.target.value)}
              className="h-12 w-full min-w-0 bg-saydam font-baslik text-2xl outline-none placeholder:text-murekkep-3 sm:text-3xl"
              data-ilk-odak
            />
          </div>

          <div className="mt-6 min-h-40">
            {sorgu.trim() === "" ? (
              <div>
                <p className="text-etiket text-murekkep-3">Sık arananlar</p>
                <ul role="list" className="mt-3 flex flex-wrap gap-2">
                  {ONERILER.map((oneri) => (
                    <li key={oneri}>
                      <button
                        type="button"
                        onClick={() => setSorgu(oneri)}
                        className="h-10 rounded-full border border-cizgi px-4 text-sm hover:border-murekkep"
                      >
                        {oneri}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : !dizin ? (
              <p className="text-murekkep-3">Yükleniyor…</p>
            ) : sonuclar.length === 0 ? (
              <p className="text-murekkep-2" role="status">
                “{sorgu}” için ürün bulamadık. Daha kısa bir kelime deneyin, örneğin “mum” ya da “vazo”.
              </p>
            ) : (
              <>
                <p className="sr-only" role="status">
                  {sonuclar.length} ürün bulundu
                </p>
                <ul role="list" className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                  {sonuclar.slice(0, 6).map((u) => (
                    <li key={u.slug}>
                      <Link
                        href={`/urun/${u.slug}`}
                        onClick={kapat}
                        className="flex items-center gap-4 rounded-kontrol py-2 hover:bg-kagit-2"
                      >
                        <span
                          className="relative size-16 shrink-0 overflow-hidden rounded-kucuk"
                          style={{ backgroundColor: u.gorsel.renk }}
                        >
                          <Image src={u.gorsel.src} alt="" fill sizes="64px" className="object-cover" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{u.ad}</span>
                          <span className="rakam text-sm text-murekkep-2">{tl(u.fiyat)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="submit"
                  className="mt-5 inline-flex min-h-11 items-center gap-2 font-medium underline decoration-cizgi-koyu underline-offset-4 hover:decoration-murekkep"
                >
                  Tüm sonuçları gör ({sonuclar.length})
                  <IkonOk size={18} />
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </Cekmece>
  );
}
