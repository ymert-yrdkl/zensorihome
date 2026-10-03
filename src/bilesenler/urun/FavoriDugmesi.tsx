"use client";

import { IkonKalp } from "@/bilesenler/ikon";
import { useFavoriler } from "@/istemci/favori";

export function FavoriDugmesi({ slug, ad, ek = "", kutu = false }: { slug: string; ad: string; ek?: string; kutu?: boolean }) {
  const { favoriMi, degistir } = useFavoriler();
  const secili = favoriMi(slug);
  if (kutu) {
    return (
      <button
        type="button"
        onClick={() => degistir(slug)}
        aria-pressed={secili}
        aria-label={secili ? "Favorilerden çıkar" : "Favorilere ekle"}
        className={`grid size-12 place-items-center rounded-kontrol border border-cizgi-koyu transition-colors hover:border-murekkep ${ek}`}
      >
        <IkonKalp size={22} weight={secili ? "fill" : "light"} className={secili ? "text-orman" : ""} />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => degistir(slug)}
      aria-pressed={secili}
      aria-label={secili ? `${ad}: favorilerden çıkar` : `${ad}: favorilere ekle`}
      className={`grid size-11 place-items-center rounded-full transition-colors duration-150 ${ek}`}
    >
      <span className="grid size-9 place-items-center rounded-full bg-kagit/85 text-murekkep backdrop-blur-sm transition-colors hover:bg-kagit">
        <IkonKalp size={19} weight={secili ? "fill" : "light"} className={secili ? "text-orman" : ""} />
      </span>
    </button>
  );
}
