"use client";

import { useState, useTransition } from "react";
import { girisYap } from "@/sunucu/yonetim-eylemleri";
import { Alan } from "@/bilesenler/ui/Alan";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";

export function GirisFormu() {
  const [hata, setHata] = useState("");
  const [bekliyor, baslat] = useTransition();
  return (
    <form
      className="mt-8"
      onSubmit={(olay) => {
        olay.preventDefault();
        const sifre = String(new FormData(olay.currentTarget).get("sifre") ?? "");
        setHata("");
        baslat(async () => {
          const sonuc = await girisYap(sifre);
          if (sonuc?.hata) setHata(sonuc.hata);
        });
      }}
    >
      <Alan etiket="Şifre" ad="sifre" type="password" autoComplete="current-password" hata={hata || undefined} />
      <button type="submit" disabled={bekliyor} className={dugmeSinifi({ tam: true, ek: "mt-2" })}>
        {bekliyor ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
