"use client";

import { useState, useTransition } from "react";
import { mesajGonder } from "@/sunucu/iletisim";
import { KONULAR } from "@/sunucu/iletisim-konulari";
import { Alan, Secim, UzunAlan } from "@/bilesenler/ui/Alan";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { IkonTamam } from "@/bilesenler/ikon";

export function IletisimFormu() {
  const [bekliyor, baslat] = useTransition();
  const [hatalar, setHatalar] = useState<Record<string, string>>({});
  const [genel, setGenel] = useState("");
  const [gonderildi, setGonderildi] = useState(false);

  if (gonderildi) {
    return (
      <div role="status" className="rounded-panel bg-adacayi px-6 py-8">
        <span className="grid size-10 place-items-center rounded-full bg-orman text-kagit">
          <IkonTamam size={20} weight="bold" />
        </span>
        <p className="mt-4 font-baslik text-xl">Mesajınız bize ulaştı.</p>
        <p className="mt-2 text-murekkep-2">Yazdığınız e-posta adresine dönüş yapacağız.</p>
        <button type="button" onClick={() => setGonderildi(false)} className={dugmeSinifi({ tur: "metin", ek: "mt-4" })}>
          Yeni mesaj yaz
        </button>
      </div>
    );
  }

  function gonder(olay: React.FormEvent<HTMLFormElement>) {
    olay.preventDefault();
    const form = olay.currentTarget;
    const v = new FormData(form);
    const deger = (ad: string) => String(v.get(ad) ?? "");
    setGenel("");
    baslat(async () => {
      const sonuc = await mesajGonder({
        ad: deger("ad"),
        eposta: deger("eposta"),
        konu: deger("konu") as (typeof KONULAR)[number],
        siparisNo: deger("siparisNo"),
        mesaj: deger("mesaj"),
        tuzak: deger("web"),
      });
      if (sonuc.tamam) {
        form.reset();
        setHatalar({});
        setGonderildi(true);
      } else {
        setHatalar(sonuc.hatalar);
        setGenel(sonuc.mesaj);
      }
    });
  }

  return (
    <form onSubmit={gonder} noValidate className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
      {genel ? (
        <p
          role="alert"
          className="mb-6 rounded-kontrol border border-hata/40 bg-hata-zemin px-4 py-3 text-[0.9375rem] text-hata sm:col-span-2"
        >
          {genel}
        </p>
      ) : null}
      <Alan etiket="Adınız" ad="ad" autoComplete="name" hata={hatalar.ad} />
      <Alan etiket="E-posta" ad="eposta" type="email" autoComplete="email" inputMode="email" hata={hatalar.eposta} />
      <Secim etiket="Konu" ad="konu" secenekler={KONULAR} bosMetin="Konu seçin" defaultValue="" hata={hatalar.konu} />
      <Alan etiket="Sipariş numarası" ad="siparisNo" istege placeholder="ZH-…" hata={hatalar.siparisNo} />
      <UzunAlan etiket="Mesajınız" ad="mesaj" rows={6} ek="sm:col-span-2" hata={hatalar.mesaj} />
      {/* Botlar için gizli alan; insanlar görmez */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Web sitesi
          <input type="text" name="web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={bekliyor} aria-busy={bekliyor} className={dugmeSinifi()}>
          {bekliyor ? "Gönderiliyor…" : "Mesajı gönder"}
        </button>
      </div>
    </form>
  );
}
