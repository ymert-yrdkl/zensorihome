// Katalog: ürün verisi (veri.json, `npm run katalog` üretir) ve onu okuyan yardımcılar.
// Sunucuda ve istemcide aynı veri kullanılır; fiyatlar kuruş cinsinden tam sayıdır.

import "server-only";
import veri from "./veri.json";
import { katla } from "./katla";

export { RENK_ORNEGI } from "./renkler";
export { katla };

export type Gorsel = { src: string; genislik: number; yukseklik: number; renk: string };

export type SecenekTuru = "renk" | "boyut" | "hacim" | "model";

export type Varyant = {
  kod: string;
  secimler: Partial<Record<SecenekTuru, string>>;
  renk: string;
  fiyat: number;
  eskiFiyat?: number;
  barkod: string;
  stokta: boolean;
  gorseller: Gorsel[];
  trendyol: string;
};

export type Urun = {
  slug: string;
  ad: string;
  marka: string;
  kategori: string;
  koleksiyonlar: string[];
  sira: number;
  ozet: string;
  aciklama: string[];
  ozellikler: [string, string][];
  bakim: string[];
  secenekler: SecenekTuru[];
  varyantlar: Varyant[];
  kaynaklar: { trendyol: string[]; hepsiburada: string[] };
};

export type Kategori = { slug: string; ad: string; ozet: string };
export type Koleksiyon = { slug: string; ad: string; ozet: string };
export type InstagramGonderi = Gorsel & { url: string };

export const urunler = veri.urunler as Urun[];
export const kategoriler = veri.kategoriler as Kategori[];
export const koleksiyonlar = veri.koleksiyonlar as Koleksiyon[];
export const instagramGonderileri = veri.instagram as InstagramGonderi[];

export const SECENEK_ADI: Record<SecenekTuru, string> = {
  renk: "Renk",
  boyut: "Boyut",
  hacim: "Hacim",
  model: "Model",
};

export function urunBul(slug: string) {
  return urunler.find((u) => u.slug === slug);
}

export function kategoriBul(slug: string) {
  return kategoriler.find((k) => k.slug === slug);
}

export function koleksiyonBul(slug: string) {
  return koleksiyonlar.find((k) => k.slug === slug);
}

export function varyantBul(urun: Urun, kod: string | undefined) {
  return urun.varyantlar.find((v) => v.kod === kod) ?? urun.varyantlar[0];
}

// Sepette ve siparişte görünen kısa varyant adı: "10 cm, Krem"
export function varyantEtiketi(urun: Urun, varyant: Varyant) {
  if (urun.varyantlar.length === 1) return "";
  return urun.secenekler
    .map((tur) => varyant.secimler[tur])
    .filter(Boolean)
    .join(", ");
}

export function enDusukFiyat(urun: Urun) {
  return Math.min(...urun.varyantlar.map((v) => v.fiyat));
}

export function fiyatAraligi(urun: Urun) {
  const fiyatlar = urun.varyantlar.map((v) => v.fiyat);
  return { min: Math.min(...fiyatlar), max: Math.max(...fiyatlar) };
}

// Ürünün farklı renkleri (sıra korunur)
export function urunRenkleri(urun: Urun) {
  return [...new Set(urun.varyantlar.map((v) => v.renk))];
}

// Bir seçenek türünün değerleri, örn. boyut → ["8 cm", "10 cm"]
export function secenekDegerleri(urun: Urun, tur: SecenekTuru) {
  return [...new Set(urun.varyantlar.map((v) => v.secimler[tur]).filter((d): d is string => Boolean(d)))];
}

// Filtrelerde kullanılan sade malzeme adı
export function urunMalzemesi(urun: Urun) {
  const deger = urun.ozellikler.find(([ad]) => ad === "Malzeme")?.[1].toLocaleLowerCase("tr") ?? "";
  if (urun.kategori === "mum") return "Mum";
  if (deger.includes("mango")) return "Mango ağacı";
  if (deger.includes("ceviz")) return "Ceviz";
  if (deger.includes("borosilikat")) return "Borosilikat cam";
  if (deger.includes("cam")) return "Cam";
  if (deger.includes("seramik")) return "Seramik";
  if (deger.includes("plastik")) return "Plastik";
  return urun.kategori === "sunum-servis" ? "Ahşap" : "Diğer";
}

function aramaMetni(urun: Urun) {
  const kategori = kategoriBul(urun.kategori)?.ad ?? "";
  const koleksiyon = urun.koleksiyonlar.map((s) => koleksiyonBul(s)?.ad ?? "").join(" ");
  const secimler = urun.varyantlar.flatMap((v) => Object.values(v.secimler)).join(" ");
  return katla([urun.ad, urun.marka, kategori, koleksiyon, secimler, urun.ozet, urunMalzemesi(urun)].join(" "));
}

const aramaDizini = urunler.map((u) => ({ urun: u, metin: aramaMetni(u), ad: katla(u.ad) }));

// Her kelime eşleşmeli; adda geçen kelime daha yüksek puan alır.
export function ara(sorgu: string) {
  const kelimeler = katla(sorgu).split(" ").filter(Boolean);
  if (kelimeler.length === 0) return [];
  return aramaDizini
    .map(({ urun, metin, ad }) => {
      let puan = 0;
      for (const k of kelimeler) {
        if (!metin.includes(k)) return null;
        puan += ad.includes(k) ? 3 : 1;
        if (ad.startsWith(k)) puan += 2;
      }
      return { urun, puan };
    })
    .filter((s): s is { urun: Urun; puan: number } => s !== null)
    .sort((a, b) => b.puan - a.puan || a.urun.sira - b.urun.sira)
    .map((s) => s.urun);
}

// ───────── Liste filtreleri (URL'deki parametrelerden) ─────────

export type Siralama = "onerilen" | "fiyat-artan" | "fiyat-azalan" | "ad";

export const SIRALAMALAR: { deger: Siralama; ad: string }[] = [
  { deger: "onerilen", ad: "Önerilen" },
  { deger: "fiyat-artan", ad: "Fiyat: düşükten yükseğe" },
  { deger: "fiyat-azalan", ad: "Fiyat: yüksekten düşüğe" },
  { deger: "ad", ad: "Ada göre (A-Z)" },
];

export const FIYAT_ARALIKLARI = [
  { deger: "0-500", ad: "500 TL altı", min: 0, max: 50000 },
  { deger: "500-1000", ad: "500 - 1.000 TL", min: 50000, max: 100000 },
  { deger: "1000-2000", ad: "1.000 - 2.000 TL", min: 100000, max: 200000 },
  { deger: "2000+", ad: "2.000 TL üzeri", min: 200000, max: Infinity },
];

export type Filtre = {
  kategori?: string;
  renkler: string[];
  malzemeler: string[];
  markalar: string[];
  fiyat?: string;
  siralama: Siralama;
};

function liste(deger: string | string[] | undefined) {
  if (!deger) return [];
  const metin = Array.isArray(deger) ? deger.join(",") : deger;
  return metin
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function filtreOku(parametreler: Record<string, string | string[] | undefined>): Filtre {
  const siralama = String(parametreler.sirala ?? "onerilen") as Siralama;
  const kategori = typeof parametreler.kategori === "string" ? parametreler.kategori : undefined;
  const fiyat = typeof parametreler.fiyat === "string" ? parametreler.fiyat : undefined;
  return {
    kategori: kategori && kategoriBul(kategori) ? kategori : undefined,
    renkler: liste(parametreler.renk),
    malzemeler: liste(parametreler.malzeme),
    markalar: liste(parametreler.marka),
    fiyat: FIYAT_ARALIKLARI.some((a) => a.deger === fiyat) ? fiyat : undefined,
    siralama: SIRALAMALAR.some((s) => s.deger === siralama) ? siralama : "onerilen",
  };
}

export function filtreUygula(liste: Urun[], filtre: Filtre) {
  const aralik = FIYAT_ARALIKLARI.find((a) => a.deger === filtre.fiyat);
  const sonuc = liste.filter((u) => {
    if (filtre.kategori && u.kategori !== filtre.kategori) return false;
    if (filtre.renkler.length && !urunRenkleri(u).some((r) => filtre.renkler.includes(r))) return false;
    if (filtre.malzemeler.length && !filtre.malzemeler.includes(urunMalzemesi(u))) return false;
    if (filtre.markalar.length && !filtre.markalar.includes(u.marka)) return false;
    if (aralik) {
      const fiyat = enDusukFiyat(u);
      if (fiyat < aralik.min || fiyat >= aralik.max) return false;
    }
    return true;
  });
  const karsilastir: Record<Siralama, (a: Urun, b: Urun) => number> = {
    onerilen: () => 0, // gelen sırayı korur (katalog sırası ya da arama puanı)
    "fiyat-artan": (a, b) => enDusukFiyat(a) - enDusukFiyat(b),
    "fiyat-azalan": (a, b) => enDusukFiyat(b) - enDusukFiyat(a),
    ad: (a, b) => a.ad.localeCompare(b.ad, "tr"),
  };
  return sonuc.sort(karsilastir[filtre.siralama]);
}

// Filtre seçenekleri, eldeki ürünlerden sayılarıyla
export function filtreSecenekleri(liste: Urun[]) {
  const say = (degerler: string[]) => {
    const sayac = new Map<string, number>();
    for (const d of degerler) sayac.set(d, (sayac.get(d) ?? 0) + 1);
    return [...sayac.entries()].map(([deger, adet]) => ({ deger, adet }));
  };
  return {
    kategoriler: say(liste.map((u) => u.kategori)),
    renkler: say(liste.flatMap((u) => urunRenkleri(u))).sort((a, b) => b.adet - a.adet),
    malzemeler: say(liste.map((u) => urunMalzemesi(u))).sort((a, b) => b.adet - a.adet),
    markalar: say(liste.map((u) => u.marka)),
    fiyatlar: FIYAT_ARALIKLARI.map((a) => ({
      ...a,
      adet: liste.filter((u) => enDusukFiyat(u) >= a.min && enDusukFiyat(u) < a.max).length,
    })),
  };
}

// İlgili ürünler: aynı koleksiyon, sonra aynı kategori
export function ilgiliUrunler(urun: Urun, adet = 4) {
  const puan = (u: Urun) =>
    (u.koleksiyonlar.some((k) => urun.koleksiyonlar.includes(k)) ? 2 : 0) + (u.kategori === urun.kategori ? 1 : 0);
  return urunler
    .filter((u) => u.slug !== urun.slug)
    .map((u) => ({ u, p: puan(u) }))
    .filter((s) => s.p > 0)
    .sort((a, b) => b.p - a.p || a.u.sira - b.u.sira)
    .slice(0, adet)
    .map((s) => s.u);
}

// ───────── Kart ve istemci dizini ─────────

// Ürün kartında gereken alanlar. İstemciye (arama, favoriler) yalnız bu gönderilir.
export type UrunKarti = {
  slug: string;
  ad: string;
  marka: string;
  kategori: string;
  fiyat: number;
  fiyatFarkli: boolean;
  eskiFiyat?: number;
  gorsel: Gorsel;
  gorsel2?: Gorsel;
  renkler: string[];
  secenekOzeti: string;
  aramaMetni: string;
};

export function secenekOzeti(urun: Urun) {
  const parcalar: string[] = [];
  const renkSayisi = urunRenkleri(urun).length;
  if (urun.secenekler.includes("renk") && renkSayisi > 1) parcalar.push(`${renkSayisi} renk`);
  for (const tur of ["boyut", "hacim", "model"] as const) {
    const adet = secenekDegerleri(urun, tur).length;
    if (urun.secenekler.includes(tur) && adet > 1) parcalar.push(`${adet} ${tur === "model" ? "model" : "boy"}`);
  }
  return parcalar.join(", ");
}

export function kartModeli(urun: Urun): UrunKarti {
  const ilk = urun.varyantlar[0];
  const { min, max } = fiyatAraligi(urun);
  const indirimli = urun.varyantlar.find((v) => v.eskiFiyat && v.fiyat === min);
  return {
    slug: urun.slug,
    ad: urun.ad,
    marka: urun.marka,
    kategori: urun.kategori,
    fiyat: min,
    fiyatFarkli: min !== max,
    eskiFiyat: indirimli?.eskiFiyat,
    gorsel: ilk.gorseller[0],
    gorsel2: ilk.gorseller[1],
    renkler: urunRenkleri(urun),
    secenekOzeti: secenekOzeti(urun),
    aramaMetni: aramaMetni(urun),
  };
}

export function urunleriListele(liste: Urun[] = urunler) {
  return liste.map(kartModeli);
}

// Koleksiyon ve kategori kapak görselleri (elle seçildi: ürün, varyant sırası, görsel sırası)
const KAPAKLAR: Record<string, [string, number, number]> = {
  "bonbon-serisi": ["dramatic-cool-bonbon-vazo", 0, 0],
  "yesil-ekose": ["mango-ekose-kare-servis-tabagi", 0, 1],
  "yeni-yil-sofrasi": ["kar-tanesi-desenli-tabak", 0, 1],
  "heykelsi-seramikler": ["modern-tasarimli-seramik-vazo", 0, 0],
  "vazo-obje": ["istanbul-bonbon-vazo", 0, 0],
  mum: ["ahenk-samdan-mum-dortlu", 0, 0],
  "sunum-servis": ["mango-ekose-sapli-sunum-tahtasi", 1, 0],
  mutfak: ["arow-zensori-fluid-yagdanlik", 2, 0],
  banyo: ["acar-vega-sivi-sabunluk", 0, 0],
};

export function kapakGorseli(slug: string): Gorsel {
  const [urunSlug, varyantSira, gorselSira] = KAPAKLAR[slug] ?? [urunler[0].slug, 0, 0];
  const urun = urunBul(urunSlug) ?? urunler[0];
  const varyant = urun.varyantlar[varyantSira] ?? urun.varyantlar[0];
  return varyant.gorseller[gorselSira] ?? varyant.gorseller[0];
}

export function koleksiyonKapagi(slug: string) {
  const g = kapakGorseli(slug);
  return { src: g.src, renk: g.renk };
}
