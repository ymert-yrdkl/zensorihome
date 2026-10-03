# Açık kararlar (Zensori Home'un vermesi gerekenler)

Hepsi `src/magaza/ayarlar.ts` içinde "ONAY BEKLİYOR" ile işaretli. Şimdilik pazar yerlerindeki mevcut uygulamadan
alındı (3 Ekim 2026).

| Konu | Şu anki değer | Kaynak |
| --- | --- | --- |
| Ücretsiz kargo eşiği | 350 TL | Trendyol mağazasındaki "350 TL ve üzeri kargo bedava" |
| Eşik altı kargo ücreti | 49,90 TL | Varsayım (Hepsiburada'da 44,90 TL görünüyor) |
| Kargoya veriliş | 1 iş günü | Hepsiburada ve Trendyol mağaza bilgisi |
| Kargo firması | Yazılmadı | |
| Kapıda ödeme ek ücreti | 0 TL | Trendyol'da kapıda ödeme açık |
| Havale/EFT banka ve IBAN | Boş (sipariş sayfasında "bilgi iletilecek" notu çıkar) | |
| Müşteri e-postası ve telefonu | Boş (iletişim formu, KEP ve adres kullanılıyor) | |
| İade kargo ücreti | Yasal metinde "satıcı tarafından netleştirilecek" | |
| Fiyatlar | Trendyol ve Hepsiburada'dan düşük olanı | `npm run katalog` çıktısında farklar listelenir |
| Ürün adları | Aynı formun renkleri tek üründe birleştirildi; birkaç ad netleştirildi (ör. "Kulplu Seramik Vazo", "Oval Boşluklu Seramik Vazo") | `kaynak/katalog-plani.mjs` |
| Yasal metinler | Taslak | Hukukçu incelemesi gerekli |
| Kartla ödeme | Yok | iyzico / PayTR hesabı gerekir |

Not: Trendyol'daki ACAR "SABJ6983 Vega Sıvı Sabunluk" (301,90 TL) ilanı, aynı modelin diğer renkleriyle çelişen fiyatı
nedeniyle kataloğa alınmadı.
