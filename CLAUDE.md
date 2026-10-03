@AGENTS.md

# zensorihome — proje bağlamı

Zensori Home'un e-ticaret sitesi (demo). Zensori: İstanbul Acıbadem'de, Zen felsefesinden ilham alan ev dekorasyonu
ve mutfak ürünleri markası (cam bonbon vazolar, el yapımı seramikler, kokusuz mumlar, mango ağacı emaye tabaklar,
borosilikat cam yağdanlıklar). Şirket: Zensori Dayanıklı Tüketim Malları San. ve Dış Tic. Ltd. Şti. Pazar yerleri:
Trendyol (Zensorihome, satıcı puanı 9,4), Hepsiburada (Zensori Home), n11 (ZensoriHome), Instagram @zensorihome.
Demo adresi: https://zensorihomecom.ahmcloud.com (Ahmet'in Coolify sunucusu). Sahibi Yusuf (GitHub ymert-yrdkl).

## Çalışma kuralları
1. Dil: arayüz, metin ve kod adları Türkçe (Urun, Varyant, Sepet, Siparis); teknik terimler İngilizce kalabilir.
   Yusuf TypeScript öğreniyor: sade, az soyutlamalı kod, "sihir" yok.
2. Tasarım dili tek kaynak: `docs/tasarim-dili.md`. Renk yalnız `src/app/globals.css` token'larıyla (Tailwind'in hazır
   paleti kapalı: `bg-kagit`, `text-murekkep`, `bg-orman`...). Uzun çizgi (—) yok, şişirme sözcük yok, uydurma bilgi yok.
3. Ürün verisi elle düzenlenmez: `kaynak/katalog-plani.mjs` düzenlenir → `npm run katalog` → `src/katalog/veri.json` +
   `public/urun/*.webp`. Fiyat kuruş (tam sayı); sunucu siparişte fiyatı her zaman katalogdan okur.
4. Ticari ayarlar tek yer: `src/magaza/ayarlar.ts` ("ONAY BEKLİYOR" yazanlar Zensori'nin kararı; liste
   `docs/acik-kararlar.md`).
5. Okuma Server Component, yazma Server Function (`src/sunucu/*`, "use server" dosyası yalnız async fonksiyon dışa
   aktarır). Formlarda `<form action>` yerine `onSubmit` + `startTransition` (hata sonrası form silinmesin).
6. Kayıtlar dosyada: `VERI_DIZINI` (yerelde `veri/`, yayında `/veri` birimi) altında `siparisler.jsonl`,
   `mesajlar.jsonl`. Veritabanı yok.
7. Sunucu (Coolify) Ahmet'in; dağıtım ve DNS değişikliği Yusuf/Ahmet onayıyla. Commit mesajları Türkçe.
8. Bu proje bağımsızdır; başka projelerden kod/yapı taşınmaz.

## Komutlar
- `npm run dev -- --port 3200` · `npm run build` · `npm run lint` · `npm run typecheck` · `npm run format`
- Katalog: `npm run katalog` (ham görseller `kaynak/ham/` altında, yoksa Trendyol CDN'inden indirilir; beyaz kenar bantları
  kırpılır).
- Ekran görüntüsü (sistem Chrome'u, ek paket yok): `node scripts/ekran.mjs .ekran / /urunler@390 /odeme@1440`
  (Git Bash'te `MSYS_NO_PATHCONV=1`; `EKRAN_SEPET=1` örnek sepeti doldurur). Bölge kırpma: `python scripts/kirp.py`.
- Önizleme aracı (preview_start) bu projenin launch.json'unu görmüyor; dev sunucusu Bash arka planda çalıştırılır.

## Durum (3 Ekim 2026)
- Site tamam: ana sayfa, tüm ürünler / kategori / koleksiyon listeleri (filtre: renk, fiyat, malzeme, marka; sıralama),
  arama (Türkçe harf katlamalı, üst panelde anlık öneri), ürün sayfası (galeri, büyütme, renk/boyut seçimi URL'de,
  tahmini kargo tarihi, mobil yapışkan sepete ekle çubuğu, JSON-LD), sepet çekmecesi + sepet sayfası (geri alınabilir
  silme, ücretsiz kargo ilerlemesi), ödeme (havale/EFT, kapıda ödeme; demo notu), sipariş onay sayfası (gizli anahtarla),
  favoriler, Hikâyemiz, SSS (FAQPage), Kargo ve iade, İletişim (form, hız sınırı, bot tuzağı), 6 yasal metin (taslak),
  404, site haritası, robots (demoda kapalı), paylaşım görseli, ikonlar.
- Yönetim paneli `/yonetim` (3 Ekim 2026): şifre `YONETICI_SIFRE` ortam değişkeninde (yoksa panel kapalı); oturum
  çerezi şifreden türetilen HMAC, 12 saat. Özet, siparişler (arama, durum filtresi, durum değiştirme + kargo takip no,
  iç not), mesajlar (okundu). Kayıtlar değişmez; durumlar `siparis-olaylari.jsonl`, okundu bilgisi `mesaj-olaylari.jsonl`.
  Müşterinin sipariş sayfası güncel durumu ve takip numarasını gösterir. Her sayfa/eylem ilk satırda `yonetimGerekli()`.
  Yerelde şifre `.env.local` içinde; ekran görüntüsü için `EKRAN_YONETIM=1`.
- Uçtan uca denendi: varyant seç → sepete ekle → ödeme boş gönder (alan hataları) → doldur → sipariş → onay sayfası.
- Katalog: 43 ürün / 73 varyant (Trendyol 74 ilan, Hepsiburada 31, n11 48 ilan tarandı). Ayrıntı `kaynak/README.md`.
- YAYINDA (Coolify, 3 Ekim 2026): açık depo github.com/ymert-yrdkl/zensorihome (dal `main`); push sonrası Coolify'da
  elle Deploy (webhook yok). Adres https://zensorihomecom.ahmcloud.com (Hostinger A kaydı
  eklendi); yedek adres `zolfnbjmz6hzfx2yuab83yuq.187.124.174.57.sslip.io`. Ayrıntı `docs/yayina-alma.md`.
