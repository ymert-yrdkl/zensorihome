# Zensori Home

Zensori Home'un e-ticaret sitesi (tanıtım sürümü). Next.js 16, React 19, Tailwind 4, TypeScript.

- Demo: https://zensorihomecom.ahmcloud.com
- Ürünler ve görseller markanın Trendyol, Hepsiburada ve n11 mağazalarından derlendi (`kaynak/`).

## Çalıştırma

```bash
npm install
npm run dev -- --port 3200
```

Siparişler ve iletişim mesajları `veri/` klasörüne (yayında `VERI_DIZINI=/veri`) JSONL olarak yazılır.

## Klasörler

| Yol | İçerik |
| --- | --- |
| `kaynak/` | Pazar yeri verisi ve katalog planı (`katalog-plani.mjs`) |
| `scripts/katalog-olustur.mjs` | Katalog ve görselleri üretir (`npm run katalog`) |
| `src/katalog/` | Ürün verisi ve okuyan fonksiyonlar |
| `src/magaza/ayarlar.ts` | Kargo eşiği, ödeme yöntemleri, şirket bilgileri |
| `src/sunucu/` | Sipariş ve iletişim sunucu fonksiyonları |
| `src/icerik/yasal.ts` | Yasal metinler (taslak) |
| `docs/` | Tasarım dili, yayına alma, açık kararlar |

## Ortam değişkenleri

| Ad | Varsayılan | Açıklama |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_ADRESI` | `https://zensorihomecom.ahmcloud.com` | Paylaşım ve site haritası adresleri (derleme anında) |
| `NEXT_PUBLIC_DEMO_MODU` | `1` | `0` olursa demo notları kalkar, arama motorları siteyi tarar |
| `VERI_DIZINI` | `./veri` (imajda `/veri`) | Sipariş ve mesaj kayıtları |
| `YONETICI_SIFRE` | (yok) | Yönetim paneli `/yonetim` şifresi; tanımlı değilse panel kapalı |
