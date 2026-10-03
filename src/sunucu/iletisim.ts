"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { hizSiniriAsildi, satirEkle } from "./depo";
import { KONULAR } from "./iletisim-konulari";

const Form = z.object({
  ad: z.string().trim().min(2, "Adınızı yazın.").max(80),
  eposta: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "E-posta adresini kontrol edin. Örnek: ad@ornek.com"),
  konu: z.enum(KONULAR, { message: "Bir konu seçin." }),
  siparisNo: z.string().trim().max(30).optional(),
  mesaj: z
    .string()
    .trim()
    .min(10, "Mesajınız çok kısa; birkaç cümleyle anlatın.")
    .max(2000, "Mesaj en çok 2000 karakter olabilir."),
  tuzak: z.string().max(0).optional(), // botlar için gizli alan: dolu gelirse kaydedilmez
});

export type IletisimSonucu = { tamam: true } | { tamam: false; mesaj: string; hatalar: Record<string, string> };

export async function mesajGonder(girdi: z.input<typeof Form>): Promise<IletisimSonucu> {
  const istek = await headers();
  const ip = istek.get("x-real-ip") ?? istek.get("x-forwarded-for")?.split(",").pop()?.trim() ?? "yerel";
  if (hizSiniriAsildi(`iletisim:${ip}`, 5, 10 * 60 * 1000)) {
    return { tamam: false, mesaj: "Kısa sürede çok fazla mesaj gönderildi. On dakika sonra yeniden deneyin.", hatalar: {} };
  }
  const sonuc = Form.safeParse(girdi);
  if (!sonuc.success) {
    const hatalar: Record<string, string> = {};
    for (const sorun of sonuc.error.issues) hatalar[String(sorun.path[0])] ??= sorun.message;
    if (hatalar.tuzak) return { tamam: true }; // bot: sessizce yok say
    return { tamam: false, mesaj: "Bazı alanlar eksik ya da hatalı.", hatalar };
  }
  const { ad, eposta, konu, siparisNo, mesaj } = sonuc.data;
  await satirEkle("mesajlar.jsonl", { ad, eposta, konu, siparisNo, mesaj, tarih: new Date().toISOString() });
  return { tamam: true };
}
