// Katalog üretici: kaynak/katalog-plani.mjs + kaynak/trendyol.json → src/katalog/veri.json + public/urun/*.webp
// Çalıştırma: npm run katalog
// Ham görseller kaynak/ham/ altında tutulur (git'e girmez); yoksa Trendyol CDN'inden indirilir.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { KATEGORILER, KOLEKSIYONLAR, URUNLER } from "../kaynak/katalog-plani.mjs";

const KOK = path.resolve(import.meta.dirname, "..");
const trendyol = JSON.parse(fs.readFileSync(path.join(KOK, "kaynak/trendyol.json"), "utf8"));
const hepsiburada = JSON.parse(fs.readFileSync(path.join(KOK, "kaynak/hepsiburada.json"), "utf8"));
const instagram = JSON.parse(fs.readFileSync(path.join(KOK, "kaynak/instagram.json"), "utf8"));

const tyKayit = new Map(trendyol.map((u) => [u.id, u]));
const hbKayit = new Map(hepsiburada.map((u) => [u.url.split("-").pop(), u]));

function slugla(metin) {
  const harf = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u" };
  return metin
    .replace(/[çğıöşüİÇĞÖŞÜ]/g, (h) => harf[h])
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function hamGorsel(url, hedef) {
  if (fs.existsSync(hedef)) return hedef;
  const yanit = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!yanit.ok) throw new Error(`İndirilemedi (${yanit.status}): ${url}`);
  fs.mkdirSync(path.dirname(hedef), { recursive: true });
  fs.writeFileSync(hedef, Buffer.from(await yanit.arrayBuffer()));
  return hedef;
}

// Görseli WebP'ye çevirir, ölçüsünü ve baskın rengini döndürür.
// Bazı pazar yeri görsellerinde üstte/altta düz beyaz bant var; bunlar kırpılır (yalnız tamamen beyaz kenarlar).
const kirpilanlar = [];
async function isle(kaynakDosya, hedefDosya, enGenis) {
  fs.mkdirSync(path.dirname(hedefDosya), { recursive: true });
  const ham = await sharp(kaynakDosya).metadata();
  const kirpik = await sharp(kaynakDosya).trim({ background: "#ffffff", threshold: 8 }).toBuffer({ resolveWithObject: true });
  const kayip = 1 - (kirpik.info.width * kirpik.info.height) / (ham.width * ham.height);
  const kaynak = kayip > 0.03 && kayip < 0.6 ? kirpik.data : kaynakDosya;
  if (kaynak !== kaynakDosya) kirpilanlar.push(`${path.basename(hedefDosya)} %${Math.round(kayip * 100)}`);
  const bilgi = await sharp(kaynak).resize({ width: enGenis, withoutEnlargement: true }).webp({ quality: 82 }).toFile(hedefDosya);
  const { dominant } = await sharp(kaynak).stats();
  const hex = "#" + [dominant.r, dominant.g, dominant.b].map((n) => n.toString(16).padStart(2, "0")).join("");
  return { genislik: bilgi.width, yukseklik: bilgi.height, renk: hex };
}

const uyarilar = [];
const urunler = [];
let siraNo = 0;

for (const plan of URUNLER) {
  siraNo += 1;
  const varyantlar = [];
  for (const v of plan.varyantlar) {
    const ty = tyKayit.get(v.ty);
    if (!ty) throw new Error(`${plan.slug}: Trendyol kaydı yok (${v.ty})`);
    const secimler = {};
    for (const tur of plan.secenekler) secimler[tur] = v[tur];
    const kod = slugla(Object.values(secimler).join(" ")) || "standart";

    const gorseller = [];
    for (const [i, url] of ty.images.entries()) {
      const ham = await hamGorsel(url, path.join(KOK, "kaynak/ham/ty", `${ty.id}_${i}.jpg`));
      const dosyaAdi = `${kod}-${i + 1}.webp`;
      const olcu = await isle(ham, path.join(KOK, "public/urun", plan.slug, dosyaAdi), 1200);
      gorseller.push({ src: `/urun/${plan.slug}/${dosyaAdi}`, ...olcu });
    }

    if (Math.abs(ty.price.sell - v.fiyat) > 0.5) {
      uyarilar.push(`${plan.slug} ${kod}: Trendyol ${ty.price.sell} TL, sitede ${v.fiyat} TL`);
    }

    varyantlar.push({
      kod,
      secimler,
      renk: v.renk,
      fiyat: Math.round(v.fiyat * 100), // kuruş
      ...(v.eskiFiyat ? { eskiFiyat: Math.round(v.eskiFiyat * 100) } : {}),
      barkod: ty.barcode,
      stokta: ty.inStock !== false,
      gorseller,
      trendyol: ty.url,
    });
  }

  const hbUrl = [plan.hb, plan.hb2]
    .filter(Boolean)
    .map((id) => hbKayit.get(id)?.url)
    .filter(Boolean);
  urunler.push({
    slug: plan.slug,
    ad: plan.ad,
    marka: plan.marka,
    kategori: plan.kategori,
    koleksiyonlar: plan.koleksiyonlar,
    sira: siraNo,
    ozet: plan.ozet,
    aciklama: plan.aciklama,
    ozellikler: plan.ozellikler,
    bakim: plan.bakim ?? [],
    secenekler: plan.secenekler,
    varyantlar,
    kaynaklar: { trendyol: varyantlar.map((v) => v.trendyol), hepsiburada: hbUrl },
  });
  process.stdout.write(`✓ ${plan.slug} (${varyantlar.length} varyant)\n`);
}

// Instagram gönderileri (markanın kendi hesabı)
const instagramCikti = [];
for (const [i, gonderi] of instagram.posts.entries()) {
  const kod = gonderi.h.split("/")[3];
  const ham = path.join(KOK, "kaynak/ham/ig", `${i}_${kod}.jpg`);
  if (!fs.existsSync(ham)) {
    uyarilar.push(`Instagram görseli yok: ${ham}`);
    continue;
  }
  const olcu = await isle(ham, path.join(KOK, "public/instagram", `${kod}.webp`), 640);
  instagramCikti.push({ src: `/instagram/${kod}.webp`, url: `https://www.instagram.com/p/${kod}/`, ...olcu });
}

const veri = {
  olusturma: new Date().toISOString().slice(0, 10),
  kategoriler: KATEGORILER,
  koleksiyonlar: KOLEKSIYONLAR,
  urunler,
  instagram: instagramCikti,
};
fs.mkdirSync(path.join(KOK, "src/katalog"), { recursive: true });
fs.writeFileSync(path.join(KOK, "src/katalog/veri.json"), JSON.stringify(veri, null, 1));

console.log(`\n${urunler.length} ürün, ${urunler.reduce((t, u) => t + u.varyantlar.length, 0)} varyant yazıldı.`);
if (uyarilar.length) console.log("\nFiyat ve veri notları:\n- " + uyarilar.join("\n- "));
if (kirpilanlar.length)
  console.log(`
Beyaz kenarı kırpılan görsel sayısı: ${kirpilanlar.length}`);
