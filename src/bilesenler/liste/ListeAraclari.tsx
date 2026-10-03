"use client";

// Liste sayfasının istemci parçaları: mobil filtre çekmecesi ve sıralama seçicisi.

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Cekmece } from "@/bilesenler/ui/Cekmece";
import { IkonFiltre } from "@/bilesenler/ikon";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";

export function FiltreCekmecesi({
  children,
  filtreSayisi,
  sonucSayisi,
}: {
  children: React.ReactNode;
  filtreSayisi: number;
  sonucSayisi: number;
}) {
  const [acik, setAcik] = useState(false);
  // Filtre bağlantısına tıklayınca adres değişir; çekmece açık kalır, kullanıcı sonucu sayaçtan görür.
  return (
    <>
      <button type="button" onClick={() => setAcik(true)} className={dugmeSinifi({ tur: "ikincil", boy: "k", ek: "lg:hidden" })}>
        <IkonFiltre size={18} />
        Filtrele
        {filtreSayisi > 0 ? (
          <span className="rakam grid size-5 place-items-center rounded-full bg-orman text-[0.6875rem] text-kagit">
            {filtreSayisi}
          </span>
        ) : null}
      </button>
      <Cekmece
        acik={acik}
        kapat={() => setAcik(false)}
        baslik="Filtrele"
        taraf="sol"
        genislik="22rem"
        alt={
          <div className="px-5 py-4">
            <button type="button" onClick={() => setAcik(false)} className={dugmeSinifi({ tam: true })}>
              {sonucSayisi} ürünü göster
            </button>
          </div>
        }
      >
        <div className="px-5 py-2">{children}</div>
      </Cekmece>
    </>
  );
}

export function SiralaSecici({ secenekler, secili }: { secenekler: { deger: string; ad: string }[]; secili: string }) {
  const router = useRouter();
  const yol = usePathname();
  const parametreler = useSearchParams();
  const [bekliyor, baslat] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm text-murekkep-2">
      <span className="hidden sm:inline">Sırala</span>
      <span className="sr-only sm:hidden">Sırala</span>
      <select
        value={secili}
        disabled={bekliyor}
        onChange={(olay) => {
          const p = new URLSearchParams(parametreler.toString());
          if (olay.target.value === "onerilen") p.delete("sirala");
          else p.set("sirala", olay.target.value);
          const metin = p.toString();
          baslat(() => router.push(metin ? `${yol}?${metin}` : yol, { scroll: false }));
        }}
        className="h-10 rounded-kontrol border border-cizgi-koyu bg-yuzey pl-3 pr-8 text-sm text-murekkep"
      >
        {secenekler.map((s) => (
          <option key={s.deger} value={s.deger}>
            {s.ad}
          </option>
        ))}
      </select>
    </label>
  );
}
