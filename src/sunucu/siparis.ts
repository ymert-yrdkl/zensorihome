"use server";

// Sipariş oluşturma. Fiyatlar istemciden alınmaz; her kalem katalogdan yeniden okunur.

import crypto from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { urunBul, varyantEtiketi } from "@/katalog/katalog";
import { MAGAZA, ODEME_YONTEMLERI } from "@/magaza/ayarlar";
import { ILLER } from "@/magaza/iller";
import { kargoUcreti } from "@/magaza/para";
import { hizSiniriAsildi, satirEkle } from "./depo";
import type { Siparis } from "./siparis-tipi";

function telefonTemizle(deger: string) {
  return deger.replace(/\D/g, "").replace(/^90/, "").replace(/^0/, "");
}

const metin = (enAz: number, enCok: number, mesaj: string) =>
  z.string().trim().min(enAz, mesaj).max(enCok, `En çok ${enCok} karakter yazabilirsiniz.`);

const Form = z
  .object({
    eposta: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "E-posta adresini kontrol edin. Örnek: ad@ornek.com"),
    telefon: z
      .string()
      .transform(telefonTemizle)
      .pipe(z.string().regex(/^5\d{9}$/, "Cep telefonu 5 ile başlayan 10 haneli olmalı. Örnek: 532 123 45 67")),
    ad: metin(2, 60, "Adınızı yazın."),
    soyad: metin(2, 60, "Soyadınızı yazın."),
    il: z.enum(ILLER, { message: "Teslimat ilini seçin." }),
    ilce: metin(2, 60, "İlçeyi yazın."),
    adres: metin(10, 300, "Adres kısa görünüyor. Mahalle, sokak, bina ve daire numarasını yazın."),
    faturaFarkli: z.boolean(),
    faturaAdres: z.string().trim().max(300).optional(),
    kurumsal: z.boolean(),
    firma: z.string().trim().max(120).optional(),
    vergiDairesi: z.string().trim().max(80).optional(),
    vergiNo: z.string().trim().optional(),
    odeme: z.enum(ODEME_YONTEMLERI.map((o) => o.deger) as ["havale", "kapida"], { message: "Bir ödeme yöntemi seçin." }),
    not: z.string().trim().max(500, "Not en çok 500 karakter olabilir.").optional(),
    sozlesme: z.literal(true, { message: "Siparişi tamamlamak için ön bilgilendirme formunu ve sözleşmeyi onaylayın." }),
    ticariIleti: z.boolean(),
    kalemler: z
      .array(z.object({ slug: z.string(), kod: z.string(), adet: z.number().int().min(1).max(10) }))
      .min(1, "Sepetiniz boş.")
      .max(30),
  })
  .superRefine((f, ctx) => {
    if (f.faturaFarkli && (!f.faturaAdres || f.faturaAdres.length < 10)) {
      ctx.addIssue({ code: "custom", path: ["faturaAdres"], message: "Fatura adresini yazın." });
    }
    if (f.kurumsal) {
      if (!f.firma || f.firma.length < 2) ctx.addIssue({ code: "custom", path: ["firma"], message: "Firma unvanını yazın." });
      if (!f.vergiDairesi || f.vergiDairesi.length < 2)
        ctx.addIssue({ code: "custom", path: ["vergiDairesi"], message: "Vergi dairesini yazın." });
      if (!/^\d{10,11}$/.test(f.vergiNo ?? ""))
        ctx.addIssue({ code: "custom", path: ["vergiNo"], message: "Vergi numarası 10, TC kimlik numarası 11 hanelidir." });
    }
  });

export type SiparisFormu = z.input<typeof Form>;

export type SiparisSonucu =
  { tamam: true; no: string; anahtar: string } | { tamam: false; mesaj: string; hatalar: Record<string, string> };

function siparisNo() {
  const tarih = new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(2, 10).replace(/-/g, "");
  const harfler = "ABCDEFGHJKLMNPRSTUVYZ23456789";
  const ek = Array.from(crypto.randomBytes(5), (b) => harfler[b % harfler.length]).join("");
  return `ZH-${tarih}-${ek}`;
}

export async function siparisVer(girdi: SiparisFormu): Promise<SiparisSonucu> {
  const istek = await headers();
  const ip = istek.get("x-real-ip") ?? istek.get("x-forwarded-for")?.split(",").pop()?.trim() ?? "yerel";
  if (hizSiniriAsildi(`siparis:${ip}`, 10, 60 * 60 * 1000)) {
    return {
      tamam: false,
      mesaj: "Kısa sürede çok fazla sipariş denemesi yapıldı. Bir saat sonra yeniden deneyin.",
      hatalar: {},
    };
  }

  const sonuc = Form.safeParse(girdi);
  if (!sonuc.success) {
    const hatalar: Record<string, string> = {};
    for (const sorun of sonuc.error.issues) {
      const alan = String(sorun.path[0] ?? "genel");
      hatalar[alan] ??= sorun.message;
    }
    return { tamam: false, mesaj: "Bazı alanlar eksik ya da hatalı. İşaretli alanları düzeltin.", hatalar };
  }
  const f = sonuc.data;

  // Kalemleri katalogdan kur
  const satirlar: Siparis["satirlar"] = [];
  for (const k of f.kalemler) {
    const urun = urunBul(k.slug);
    const varyant = urun?.varyantlar.find((v) => v.kod === k.kod);
    if (!urun || !varyant) {
      return {
        tamam: false,
        mesaj: "Sepetinizdeki bir ürün artık satışta değil. Sepeti kontrol edip yeniden deneyin.",
        hatalar: {},
      };
    }
    if (!varyant.stokta) {
      return { tamam: false, mesaj: `${urun.ad} şu an stokta yok. Sepetten çıkarıp yeniden deneyin.`, hatalar: {} };
    }
    satirlar.push({
      slug: urun.slug,
      kod: varyant.kod,
      ad: urun.ad,
      etiket: varyantEtiketi(urun, varyant),
      barkod: varyant.barkod,
      birimFiyat: varyant.fiyat,
      adet: k.adet,
      gorsel: varyant.gorseller[0].src,
    });
  }

  const araToplam = satirlar.reduce((t, s) => t + s.birimFiyat * s.adet, 0);
  const kargo = kargoUcreti(araToplam);
  const odemeUcreti = f.odeme === "kapida" ? MAGAZA.kapidaOdemeUcreti : 0;

  const siparis: Siparis = {
    no: siparisNo(),
    anahtar: crypto.randomBytes(16).toString("hex"),
    tarih: new Date().toISOString(),
    demo: MAGAZA.demo,
    durum: f.odeme === "havale" ? "odeme-bekleniyor" : "hazirlaniyor",
    musteri: { ad: f.ad, soyad: f.soyad, eposta: f.eposta, telefon: f.telefon },
    teslimat: { il: f.il, ilce: f.ilce, adres: f.adres },
    fatura: {
      adres: f.faturaFarkli ? (f.faturaAdres ?? "") : null,
      kurumsal: f.kurumsal ? { firma: f.firma ?? "", vergiDairesi: f.vergiDairesi ?? "", vergiNo: f.vergiNo ?? "" } : null,
    },
    odeme: f.odeme,
    not: f.not || null,
    izinler: { sozlesme: true, ticariIleti: f.ticariIleti },
    satirlar,
    araToplam,
    kargo,
    odemeUcreti,
    toplam: araToplam + kargo + odemeUcreti,
  };

  await satirEkle("siparisler.jsonl", siparis);
  return { tamam: true, no: siparis.no, anahtar: siparis.anahtar };
}
