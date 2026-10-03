import "server-only";

// Siparişler ve iletişim mesajları satır başına bir JSON (JSONL) olarak diske yazılır.
// Yayında VERI_DIZINI kalıcı bir birime (Coolify volume) bağlanır.

import fs from "node:fs/promises";
import path from "node:path";

// Çalışma anında okunan klasör; derleme izleyicisi (turbopack) buna bakmaz
const DIZIN = process.env.VERI_DIZINI ?? path.join(/*turbopackIgnore: true*/ process.cwd(), "veri");

export async function satirEkle(dosya: string, kayit: object) {
  await fs.mkdir(/*turbopackIgnore: true*/ DIZIN, { recursive: true });
  await fs.appendFile(path.join(/*turbopackIgnore: true*/ DIZIN, dosya), JSON.stringify(kayit) + "\n", "utf8");
}

export async function satirlariOku<T>(dosya: string): Promise<T[]> {
  try {
    const metin = await fs.readFile(path.join(/*turbopackIgnore: true*/ DIZIN, dosya), "utf8");
    return metin
      .split("\n")
      .filter(Boolean)
      .map((satir) => JSON.parse(satir) as T);
  } catch {
    return [];
  }
}

// Basit hız sınırı: aynı anahtardan (IP) belirli sürede en çok N istek. Süreç belleğinde tutulur.
const kayitlar = new Map<string, number[]>();

export function hizSiniriAsildi(anahtar: string, enFazla: number, sureMs: number) {
  const simdi = Date.now();
  const liste = (kayitlar.get(anahtar) ?? []).filter((t) => simdi - t < sureMs);
  if (liste.length >= enFazla) {
    kayitlar.set(anahtar, liste);
    return true;
  }
  liste.push(simdi);
  kayitlar.set(anahtar, liste);
  return false;
}
