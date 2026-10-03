import "server-only";

// Siparişleri ve mesajları okur, ekle-yalnız olay dosyalarıyla birleştirip güncel durumu çıkarır.

import { satirlariOku } from "./depo";
import type { GuncelSiparis, IletisimMesaji, Siparis, SiparisOlayi } from "./siparis-tipi";

export async function siparisleriOku(): Promise<GuncelSiparis[]> {
  const [siparisler, olaylar] = await Promise.all([
    satirlariOku<Siparis>("siparisler.jsonl"),
    satirlariOku<SiparisOlayi>("siparis-olaylari.jsonl"),
  ]);
  return siparisler
    .map((s) => {
      const gecmis = olaylar.filter((o) => o.no === s.no);
      const son = gecmis.at(-1);
      const takipNo = [...gecmis].reverse().find((o) => o.takipNo)?.takipNo;
      return { ...s, durum: son?.durum ?? s.durum, takipNo, gecmis };
    })
    .sort((a, b) => b.tarih.localeCompare(a.tarih));
}

export async function siparisBul(no: string) {
  return (await siparisleriOku()).find((s) => s.no === no);
}

type MesajOlayi = { id: string; okundu: boolean; tarih: string };

export type GuncelMesaj = IletisimMesaji & { id: string; okundu: boolean };

export async function mesajlariOku(): Promise<GuncelMesaj[]> {
  const [mesajlar, olaylar] = await Promise.all([
    satirlariOku<IletisimMesaji>("mesajlar.jsonl"),
    satirlariOku<MesajOlayi>("mesaj-olaylari.jsonl"),
  ]);
  return mesajlar
    .map((m) => {
      const id = m.id ?? m.tarih; // eski kayıtlarda kimlik yok, tarih benzersizdir
      const son = olaylar.filter((o) => o.id === id).at(-1);
      return { ...m, id, okundu: son?.okundu ?? false };
    })
    .sort((a, b) => b.tarih.localeCompare(a.tarih));
}
