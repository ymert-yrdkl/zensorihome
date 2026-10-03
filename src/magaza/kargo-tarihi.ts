// Tahmini kargoya veriliş günü: bir sonraki iş günü (Cumartesi-Pazar atlanır, resmî tatiller hesaba katılmaz).
// Türkiye saati UTC+3 sabittir.

const GUN = 24 * 60 * 60 * 1000;
const bicim = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", day: "numeric", month: "long", weekday: "long" });

export function tahminiKargoTarihi(simdi = new Date()) {
  let tarih = new Date(simdi.getTime() + GUN);
  // Türkiye saatine göre haftanın günü (0 Pazar, 6 Cumartesi)
  const gun = (d: Date) => new Date(d.getTime() + 3 * 60 * 60 * 1000).getUTCDay();
  while (gun(tarih) === 0 || gun(tarih) === 6) tarih = new Date(tarih.getTime() + GUN);
  return bicim.format(tarih); // "6 Ekim Pazartesi"
}
