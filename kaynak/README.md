# Kaynak veri (3 Ekim 2026)

Markanın kendi pazar yeri mağazalarından ve Instagram hesabından toplandı:

| Dosya | Kaynak | İçerik |
| --- | --- | --- |
| `trendyol.json` | trendyol.com/magaza/zensorihome-m-1187782 | 74 ilan: ad, fiyat, görseller, özellikler, barkod |
| `hepsiburada.json` | hepsiburada.com, satıcı "Zensori Home" | 31 ilan: markanın kendi ürün açıklamaları |
| `n11.json` | n11.com/magaza/zensorihome | 48 ilan: ad, fiyat, renk (görseller boş) |
| `instagram.json` | instagram.com/zensorihome | Profil tanımı ve son 12 paylaşım |
| `logo-trendyol.jpg` | Trendyol mağaza logosu | Yeşil "zensori" yazısı ve filiz |

Çiçeksepeti ve Pazarama'da marka bulunamadı; zensorihome.com.tr "yapım aşamasında" (Entegra).

`katalog-plani.mjs` bu kayıtları sitedeki 43 ürüne (73 varyant) eşler; `npm run katalog` siteye yazar.
Ham görseller `kaynak/ham/` altında tutulur (git'e girmez).
