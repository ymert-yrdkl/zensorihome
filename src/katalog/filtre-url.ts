// Filtre durumunu URL'ye yazar. Her filtre bağlantısı mevcut seçimleri koruyup tek şeyi değiştirir.
import type { Filtre } from "./katalog";

type Degisim =
  | { tur: "renk" | "malzeme" | "marka"; deger: string }
  | { tur: "kategori" | "fiyat"; deger: string | undefined }
  | { tur: "sirala"; deger: string }
  | { tur: "temizle" };

export function filtreUrl(temel: string, filtre: Filtre, degisim: Degisim, sorgu?: string) {
  const yeni: Filtre = {
    ...filtre,
    renkler: [...filtre.renkler],
    malzemeler: [...filtre.malzemeler],
    markalar: [...filtre.markalar],
  };
  const degistir = (liste: string[], deger: string) =>
    liste.includes(deger) ? liste.filter((d) => d !== deger) : [...liste, deger];

  switch (degisim.tur) {
    case "renk":
      yeni.renkler = degistir(yeni.renkler, degisim.deger);
      break;
    case "malzeme":
      yeni.malzemeler = degistir(yeni.malzemeler, degisim.deger);
      break;
    case "marka":
      yeni.markalar = degistir(yeni.markalar, degisim.deger);
      break;
    case "kategori":
      yeni.kategori = yeni.kategori === degisim.deger ? undefined : degisim.deger;
      break;
    case "fiyat":
      yeni.fiyat = yeni.fiyat === degisim.deger ? undefined : degisim.deger;
      break;
    case "sirala":
      yeni.siralama = degisim.deger as Filtre["siralama"];
      break;
    case "temizle":
      yeni.renkler = [];
      yeni.malzemeler = [];
      yeni.markalar = [];
      yeni.fiyat = undefined;
      yeni.kategori = undefined;
      break;
  }

  const p = new URLSearchParams();
  if (sorgu) p.set("q", sorgu);
  if (yeni.kategori) p.set("kategori", yeni.kategori);
  if (yeni.renkler.length) p.set("renk", yeni.renkler.join(","));
  if (yeni.malzemeler.length) p.set("malzeme", yeni.malzemeler.join(","));
  if (yeni.markalar.length) p.set("marka", yeni.markalar.join(","));
  if (yeni.fiyat) p.set("fiyat", yeni.fiyat);
  if (yeni.siralama !== "onerilen") p.set("sirala", yeni.siralama);
  const metin = p.toString();
  return metin ? `${temel}?${metin}` : temel;
}

export function filtreSayisi(filtre: Filtre, kategoriSayilsin: boolean) {
  return (
    filtre.renkler.length +
    filtre.malzemeler.length +
    filtre.markalar.length +
    (filtre.fiyat ? 1 : 0) +
    (kategoriSayilsin && filtre.kategori ? 1 : 0)
  );
}
