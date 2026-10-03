import "server-only";

// Yönetim paneli oturumu. Şifre YONETICI_SIFRE ortam değişkeninde; tanımlı değilse panel kapalıdır.
// Oturum çerezi: "<bitiş zamanı>.<imza>"; imza şifreden türetilir, şifre değişince bütün oturumlar düşer.

import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const OTURUM_CEREZI = "zh_yonetim";
export const OTURUM_SURESI_MS = 12 * 60 * 60 * 1000; // 12 saat

export function yonetimSifresi() {
  const sifre = process.env.YONETICI_SIFRE ?? "";
  return sifre.length >= 8 ? sifre : null;
}

function imza(bitis: number, sifre: string) {
  return crypto.createHmac("sha256", sifre).update(`zensori-yonetim:${bitis}`).digest("base64url");
}

export function oturumDegeri(bitis: number) {
  const sifre = yonetimSifresi();
  if (!sifre) throw new Error("YONETICI_SIFRE tanımlı değil");
  return `${bitis}.${imza(bitis, sifre)}`;
}

export function esitMi(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export async function oturumGecerliMi() {
  const sifre = yonetimSifresi();
  if (!sifre) return false;
  const deger = (await cookies()).get(OTURUM_CEREZI)?.value ?? "";
  const [bitisMetni, gelenImza] = deger.split(".");
  const bitis = Number(bitisMetni);
  if (!bitis || !gelenImza || bitis < Date.now()) return false;
  return esitMi(gelenImza, imza(bitis, sifre));
}

// Her yönetim sayfası ve eyleminin ilk satırında çağrılır
export async function yonetimGerekli() {
  if (!(await oturumGecerliMi())) redirect("/yonetim/giris");
}

export async function istekIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",").pop()?.trim() ?? "yerel";
}

export async function guvenliBaglantiMi() {
  const h = await headers();
  return h.get("x-forwarded-proto") === "https";
}
