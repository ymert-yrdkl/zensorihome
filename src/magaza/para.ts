import { MAGAZA } from "./ayarlar";

// Kuruş cinsinden tam sayıyı Türk lirası metnine çevirir: 149900 → "1.499 TL", 42216 → "422,16 TL"

const tamBicim = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
const kesirliBicim = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function tl(kurus: number) {
  const bicim = kurus % 100 === 0 ? tamBicim : kesirliBicim;
  return `${bicim.format(kurus / 100)} TL`;
}

export function kargoUcreti(araToplam: number) {
  if (araToplam === 0) return 0;
  return araToplam >= MAGAZA.ucretsizKargoEsigi ? 0 : MAGAZA.kargoUcreti;
}
