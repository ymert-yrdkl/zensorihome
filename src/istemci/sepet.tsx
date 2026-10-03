"use client";

// Sepet: tarayıcıda saklanır. Kalem, eklendiği andaki ad/fiyat/görseli taşır;
// ödeme sırasında sunucu fiyatları katalogdan yeniden okur.

import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { yerelDepo } from "./yerel-depo";
import { kargoUcreti } from "@/magaza/para";

export type SepetKalemi = {
  slug: string;
  kod: string;
  ad: string;
  etiket: string;
  fiyat: number;
  gorsel: { src: string; renk: string };
  adet: number;
};

export const EN_FAZLA_ADET = 10;

const BOS: SepetKalemi[] = [];
const depo = yerelDepo<SepetKalemi[]>("zh-sepet-v1", BOS);

type Silinen = { kalem: SepetKalemi; sira: number };

type SepetBaglami = {
  kalemler: SepetKalemi[];
  adetToplam: number;
  araToplam: number;
  kargo: number;
  ekle: (kalem: Omit<SepetKalemi, "adet">, adet?: number) => void;
  adetAyarla: (slug: string, kod: string, adet: number) => void;
  cikar: (slug: string, kod: string) => void;
  silinen: Silinen | null;
  geriAl: () => void;
  temizle: () => void;
  fiyatlariGuncelle: (fiyatlar: Record<string, number>) => void;
  cekmeceAcik: boolean;
  cekmeceyiAc: () => void;
  cekmeceyiKapat: () => void;
  sonEklenen: string | null;
};

const Baglam = createContext<SepetBaglami | null>(null);

export function anahtar(slug: string, kod: string) {
  return `${slug}:${kod}`;
}

export function SepetSaglayici({ children }: { children: React.ReactNode }) {
  const kalemler = useSyncExternalStore(depo.abone, depo.anlik, depo.sunucuAnlik);
  const [cekmeceAcik, setCekmeceAcik] = useState(false);
  const [silinen, setSilinen] = useState<Silinen | null>(null);
  const [sonEklenen, setSonEklenen] = useState<string | null>(null);
  const silinenZamanlayici = useRef<ReturnType<typeof setTimeout>>(undefined);

  const ekle = useCallback((yeni: Omit<SepetKalemi, "adet">, adet = 1) => {
    const mevcut = depo.anlik();
    const bulunan = mevcut.find((k) => k.slug === yeni.slug && k.kod === yeni.kod);
    const sonraki = bulunan
      ? mevcut.map((k) => (k === bulunan ? { ...k, ...yeni, adet: Math.min(EN_FAZLA_ADET, k.adet + adet) } : k))
      : [...mevcut, { ...yeni, adet: Math.min(EN_FAZLA_ADET, adet) }];
    depo.yaz(sonraki);
    setSonEklenen(anahtar(yeni.slug, yeni.kod));
    setCekmeceAcik(true);
  }, []);

  const adetAyarla = useCallback((slug: string, kod: string, adet: number) => {
    const sinirli = Math.max(1, Math.min(EN_FAZLA_ADET, Math.round(adet)));
    depo.yaz(depo.anlik().map((k) => (k.slug === slug && k.kod === kod ? { ...k, adet: sinirli } : k)));
  }, []);

  const cikar = useCallback((slug: string, kod: string) => {
    const mevcut = depo.anlik();
    const sira = mevcut.findIndex((k) => k.slug === slug && k.kod === kod);
    if (sira < 0) return;
    setSilinen({ kalem: mevcut[sira], sira });
    depo.yaz(mevcut.filter((_, i) => i !== sira));
    clearTimeout(silinenZamanlayici.current);
    silinenZamanlayici.current = setTimeout(() => setSilinen(null), 8000);
  }, []);

  const geriAl = useCallback(() => {
    if (!silinen) return;
    const mevcut = [...depo.anlik()];
    mevcut.splice(Math.min(silinen.sira, mevcut.length), 0, silinen.kalem);
    depo.yaz(mevcut);
    setSilinen(null);
  }, [silinen]);

  const temizle = useCallback(() => depo.yaz([]), []);

  // Ödeme sayfası katalogdaki güncel fiyatları gönderir; sepetteki eski fiyatlar düzeltilir.
  const fiyatlariGuncelle = useCallback((fiyatlar: Record<string, number>) => {
    let degisti = false;
    const sonraki: SepetKalemi[] = [];
    for (const kalem of depo.anlik()) {
      const guncel = fiyatlar[anahtar(kalem.slug, kalem.kod)];
      if (guncel === undefined) {
        degisti = true; // ürün katalogdan kalkmış: sepetten çıkar
      } else if (guncel !== kalem.fiyat) {
        degisti = true;
        sonraki.push({ ...kalem, fiyat: guncel });
      } else {
        sonraki.push(kalem);
      }
    }
    if (degisti) depo.yaz(sonraki);
  }, []);

  const deger = useMemo<SepetBaglami>(() => {
    const araToplam = kalemler.reduce((t, k) => t + k.fiyat * k.adet, 0);
    return {
      kalemler,
      adetToplam: kalemler.reduce((t, k) => t + k.adet, 0),
      araToplam,
      kargo: kargoUcreti(araToplam),
      ekle,
      adetAyarla,
      cikar,
      silinen,
      geriAl,
      temizle,
      fiyatlariGuncelle,
      cekmeceAcik,
      cekmeceyiAc: () => setCekmeceAcik(true),
      cekmeceyiKapat: () => setCekmeceAcik(false),
      sonEklenen,
    };
  }, [kalemler, ekle, adetAyarla, cikar, silinen, geriAl, temizle, fiyatlariGuncelle, cekmeceAcik, sonEklenen]);

  return <Baglam.Provider value={deger}>{children}</Baglam.Provider>;
}

export function useSepet() {
  const baglam = useContext(Baglam);
  if (!baglam) throw new Error("useSepet, SepetSaglayici içinde kullanılmalı");
  return baglam;
}
