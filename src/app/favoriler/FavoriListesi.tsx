"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { UrunKarti as Kart } from "@/katalog/katalog";
import { useFavoriler } from "@/istemci/favori";
import { dizinAl } from "@/bilesenler/duzen/AramaPaneli";
import { UrunKarti } from "@/bilesenler/urun/UrunKarti";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { IkonKalp } from "@/bilesenler/ikon";

export function FavoriListesi() {
  const { liste } = useFavoriler();
  const [urunler, setUrunler] = useState<Kart[] | null>(null);

  useEffect(() => {
    dizinAl()
      .then((d) => setUrunler(d.urunler))
      .catch(() => setUrunler([]));
  }, []);

  if (urunler === null) {
    return <p className="text-murekkep-3">Yükleniyor…</p>;
  }

  const secilenler = liste.map((slug) => urunler.find((u) => u.slug === slug)).filter((u): u is Kart => Boolean(u));

  if (secilenler.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-panel bg-kagit-2 px-6 py-14 text-center">
        <IkonKalp size={40} className="mx-auto text-murekkep-3" />
        <h2 className="mt-4 font-baslik text-2xl">Henüz favoriniz yok</h2>
        <p className="mt-2 text-murekkep-2">
          Ürün görselindeki kalbe dokunun; beğendikleriniz burada toplanır ve bu tarayıcıda saklanır.
        </p>
        <Link href="/urunler" className={dugmeSinifi({ ek: "mt-6" })}>
          Ürünlere göz at
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="rakam mb-6 text-sm text-murekkep-2">{secilenler.length} ürün</p>
      <ul role="list" className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
        {secilenler.map((u) => (
          <li key={u.slug}>
            <UrunKarti urun={u} />
          </li>
        ))}
      </ul>
    </>
  );
}
