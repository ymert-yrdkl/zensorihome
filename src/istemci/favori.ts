"use client";

// Favoriler: ürün slug'larının listesi, tarayıcıda saklanır.

import { useSyncExternalStore } from "react";
import { yerelDepo } from "./yerel-depo";

const BOS: string[] = [];
const depo = yerelDepo<string[]>("zh-favori-v1", BOS);

export function useFavoriler() {
  const liste = useSyncExternalStore(depo.abone, depo.anlik, depo.sunucuAnlik);
  return {
    liste,
    favoriMi: (slug: string) => liste.includes(slug),
    degistir: (slug: string) => {
      const mevcut = depo.anlik();
      depo.yaz(mevcut.includes(slug) ? mevcut.filter((s) => s !== slug) : [slug, ...mevcut]);
    },
  };
}
