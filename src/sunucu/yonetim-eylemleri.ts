"use server";

// Yönetim paneli sunucu eylemleri. Her biri ilk satırda oturumu denetler (giriş hariç).

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hizSiniriAsildi, satirEkle } from "./depo";
import { siparisBul } from "./kayitlar";
import type { SiparisDurumu } from "./siparis-tipi";
import {
  OTURUM_CEREZI,
  OTURUM_SURESI_MS,
  esitMi,
  guvenliBaglantiMi,
  istekIp,
  oturumDegeri,
  yonetimGerekli,
  yonetimSifresi,
} from "./yonetim";

export async function girisYap(sifre: string): Promise<{ hata: string } | void> {
  const dogru = yonetimSifresi();
  if (!dogru) return { hata: "Panel kapalı: sunucuda YONETICI_SIFRE tanımlı değil." };
  if (hizSiniriAsildi(`giris:${await istekIp()}`, 5, 10 * 60 * 1000)) {
    return { hata: "Çok fazla deneme yapıldı. On dakika sonra yeniden deneyin." };
  }
  if (!esitMi(sifre, dogru)) return { hata: "Şifre yanlış." };
  const bitis = Date.now() + OTURUM_SURESI_MS;
  (await cookies()).set(OTURUM_CEREZI, oturumDegeri(bitis), {
    httpOnly: true,
    sameSite: "lax",
    secure: await guvenliBaglantiMi(),
    path: "/yonetim",
    expires: new Date(bitis),
  });
  redirect("/yonetim");
}

export async function cikisYap() {
  (await cookies()).delete({ name: OTURUM_CEREZI, path: "/yonetim" });
  redirect("/yonetim/giris");
}

const GECERLI_DURUMLAR: SiparisDurumu[] = ["odeme-bekleniyor", "hazirlaniyor", "kargoda", "teslim-edildi", "iptal"];

export async function durumDegistir(no: string, durum: SiparisDurumu, takipNo: string, not: string) {
  await yonetimGerekli();
  if (!GECERLI_DURUMLAR.includes(durum)) return { hata: "Geçersiz durum." };
  const siparis = await siparisBul(no);
  if (!siparis) return { hata: "Sipariş bulunamadı." };
  const temizTakip = takipNo.trim().slice(0, 60);
  if (durum === "kargoda" && !temizTakip && !siparis.takipNo)
    return { hata: "Kargoya verildi demek için takip numarasını yazın." };
  await satirEkle("siparis-olaylari.jsonl", {
    no,
    durum,
    ...(temizTakip ? { takipNo: temizTakip } : {}),
    ...(not.trim() ? { not: not.trim().slice(0, 300) } : {}),
    tarih: new Date().toISOString(),
  });
  revalidatePath("/yonetim", "layout");
  return { tamam: true };
}

export async function mesajOkunduYap(id: string, okundu: boolean) {
  await yonetimGerekli();
  await satirEkle("mesaj-olaylari.jsonl", { id, okundu, tarih: new Date().toISOString() });
  revalidatePath("/yonetim", "layout");
}
