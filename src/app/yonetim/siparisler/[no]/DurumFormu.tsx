"use client";

import { useState, useTransition } from "react";
import { durumDegistir } from "@/sunucu/yonetim-eylemleri";
import { DURUM_ADI, type SiparisDurumu } from "@/sunucu/siparis-tipi";
import { Alan, UzunAlan } from "@/bilesenler/ui/Alan";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";

const SIRA: SiparisDurumu[] = ["odeme-bekleniyor", "hazirlaniyor", "kargoda", "teslim-edildi", "iptal"];

export function DurumFormu({ no, durum, takipNo }: { no: string; durum: SiparisDurumu; takipNo: string }) {
  const [secili, setSecili] = useState<SiparisDurumu>(durum);
  const [mesaj, setMesaj] = useState<{ tur: "hata" | "tamam"; metin: string } | null>(null);
  const [bekliyor, baslat] = useTransition();

  return (
    <form
      noValidate
      className="mt-4"
      onSubmit={(olay) => {
        olay.preventDefault();
        const v = new FormData(olay.currentTarget);
        setMesaj(null);
        baslat(async () => {
          const sonuc = await durumDegistir(no, secili, String(v.get("takipNo") ?? ""), String(v.get("not") ?? ""));
          setMesaj(sonuc.hata ? { tur: "hata", metin: sonuc.hata } : { tur: "tamam", metin: "Durum güncellendi." });
        });
      }}
    >
      <fieldset>
        <legend className="sr-only">Yeni durum</legend>
        <div className="flex flex-wrap gap-2">
          {SIRA.map((d) => (
            <label
              key={d}
              className={`inline-flex min-h-10 cursor-pointer items-center rounded-kontrol border px-3 text-sm ${
                secili === d ? "border-murekkep bg-murekkep text-kagit" : "border-cizgi-koyu hover:border-murekkep"
              }`}
            >
              <input
                type="radio"
                name="durum"
                value={d}
                checked={secili === d}
                onChange={() => setSecili(d)}
                className="sr-only"
              />
              {DURUM_ADI[d]}
            </label>
          ))}
        </div>
      </fieldset>
      {secili === "kargoda" ? (
        <Alan etiket="Kargo takip numarası" ad="takipNo" defaultValue={takipNo} ek="mt-5" istege={Boolean(takipNo)} />
      ) : null}
      <UzunAlan etiket="İç not" ad="not" istege rows={2} ek="mt-5" yardim="Yalnız panelde görünür." />
      <button
        type="submit"
        disabled={bekliyor || (secili === durum && secili !== "kargoda")}
        className={dugmeSinifi({ tam: true })}
      >
        {bekliyor ? "Kaydediliyor…" : "Kaydet"}
      </button>
      {mesaj ? (
        <p role="status" className={`mt-3 text-sm ${mesaj.tur === "hata" ? "text-hata" : "text-orman"}`}>
          {mesaj.metin}
        </p>
      ) : null}
    </form>
  );
}
