"use client";

import Link from "next/link";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";

export default function Hata({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="kabuk flex flex-1 flex-col justify-center py-24">
      <h1 className="baslik-2 max-w-[20ch]">Sayfa yüklenirken bir sorun çıktı.</h1>
      <p className="giris-metni mt-4">
        Sunucudan beklenen yanıt gelmedi. Sayfayı yeniden deneyin; sorun sürerse ana sayfadan devam edin. Sepetinizdeki ürünler
        duruyor.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className={dugmeSinifi()}>
          Yeniden dene
        </button>
        <Link href="/" className={dugmeSinifi({ tur: "ikincil" })}>
          Ana sayfa
        </Link>
      </div>
      {error.digest ? <p className="rakam mt-6 text-sm text-murekkep-3">Hata kodu: {error.digest}</p> : null}
    </div>
  );
}
