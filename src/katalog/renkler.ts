// İstemcide de kullanılır; katalog verisini içe aktarmaz.

// Renk adı → örnek renk (swatch). Ürün fotoğraflarından seçildi.
export const RENK_ORNEGI: Record<string, string> = {
  Beyaz: "#F3F0E8",
  Krem: "#E9DDC6",
  Bej: "#D8C7AC",
  Gri: "#9C9E9A",
  Siyah: "#2B2B2A",
  Vizon: "#8D7A72",
  Mavi: "#A9C1D0",
  Haki: "#8E8A63",
  Pembe: "#E3B9B4",
  Lavanta: "#B9A6CF",
  Bal: "#D9B07A",
  Yeşil: "#5E8A55",
  Kırmızı: "#B23A33",
  Altın: "#C4A14E",
  Sarı: "#E0B442",
  Şeffaf: "#EEF1F0",
  Doğal: "#B48A5A",
  Ceviz: "#6E4B33",
};

export function renkOrnegi(renk: string) {
  return RENK_ORNEGI[renk] ?? "#CFC8BC";
}
