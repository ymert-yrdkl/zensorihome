"use client";

import { IkonArti, IkonEksi } from "@/bilesenler/ikon";
import { EN_FAZLA_ADET } from "@/istemci/sepet";

export function AdetSecici({
  deger,
  degistir,
  ad,
  buyuk = false,
}: {
  deger: number;
  degistir: (adet: number) => void;
  ad: string;
  buyuk?: boolean;
}) {
  const yukseklik = buyuk ? "h-12" : "h-10";
  return (
    <div
      className={`inline-flex ${yukseklik} items-center rounded-kontrol border border-cizgi-koyu`}
      role="group"
      aria-label={`${ad} adedi`}
    >
      <button
        type="button"
        className="grid h-full w-11 place-items-center rounded-l-kontrol hover:bg-kagit-2 disabled:opacity-40"
        onClick={() => degistir(deger - 1)}
        disabled={deger <= 1}
        aria-label="Bir azalt"
      >
        <IkonEksi size={16} />
      </button>
      <span className="rakam w-8 text-center text-[0.9375rem]" aria-live="polite">
        {deger}
      </span>
      <button
        type="button"
        className="grid h-full w-11 place-items-center rounded-r-kontrol hover:bg-kagit-2 disabled:opacity-40"
        onClick={() => degistir(deger + 1)}
        disabled={deger >= EN_FAZLA_ADET}
        aria-label="Bir artır"
      >
        <IkonArti size={16} />
      </button>
    </div>
  );
}
