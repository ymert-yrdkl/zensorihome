# Tasarım dili (bağlayıcı)

Kaynaklar: markanın kendi kimliği (Trendyol mağaza logosu, Instagram, Hepsiburada metinleri) ve Yusuf'un verdiği
Top100 listesindeki tasarım becerileri (ui-ux-pro-max, taste-skill, hallmark, huashu-design, open-design, gstack,
humanizer, marketingskills). Ham notlar Veteriner projesinin `docs/tasarim-kaynaklari/` klasöründe.

## Okuma
Sakin bir butik mağaza: krem kâğıt üstünde orman yeşili, fotoğraflar konuşur, arayüz susar. Ürün fotoğraflarının
pastel fonları (adaçayı, pudra mavisi, lila) renk taşır; arayüz nötr kalır.

## Renk (yalnız `globals.css` token'ları; hazır Tailwind paleti kapalı)
| Token | Değer | Kullanım |
| --- | --- | --- |
| `kagit` | #F8F4EC | Sayfa zemini (logodaki kremden açık) |
| `kagit-2` / `kagit-3` | #F0EADE / #E6DDCD | Bantlar, hover, görsel yer tutucu |
| `yuzey` | #FFFDF9 | Çekmece, form alanı, özet kutusu |
| `murekkep` / `-2` / `-3` | #1D2721 / #46514A / #5C655E | Metin (14:1, 7.5:1, ≥4.5:1) |
| `cizgi` / `cizgi-koyu` | #DDD5C7 / #8C857A | Ayırıcı / form kenarlığı (3.3:1) |
| `orman` / `orman-koyu` | #2E5B3D / #234A31 | Marka, birincil eylem, odak halkası |
| `adacayi` | #E2E8DA | Açık yeşil bant (Bonbon serisi, Hikâyemiz) |
| `gece` | #18291E | Tek koyu bant (yeni yıl) ve altbilgi |
| `hata` | #A3321F | Yalnız hata |

Terrakota vurgu, mor-mavi gradyan, saf siyah/beyaz yok. Vurgu (orman) ekranın küçük bir kısmında: birincil düğme,
sayaç rozeti, etkin menü çizgisi, ikon.

## Yazı
- Başlık ve logo: **Literata** (logodaki kalın serifin en yakın Google karşılığı). Başlıklar 450 ağırlık, sıkı harf
  aralığı, `text-wrap: balance`. İtalik başlık yok.
- Gövde ve arayüz: **Albert Sans** 400/500. Gövde 16px, satır 1.6, ölçü ≤ 68ch.
- Ölçek: `baslik-1` clamp(36→72px), `baslik-2` clamp(28→44px), `baslik-3` clamp(22→28px), etiket 13px.
- Fiyat ve sayılar `rakam` (tabular-nums). Para `tl()` ile: "1.499 TL", birimden önce bölünmez boşluk.

## Biçim
- Köşe: görsel 4px, kontrol 8px, panel 16px. Gölge yalnız açılır panelde (`shadow-katman`).
- Kabuk: `kabuk` sınıfı, en çok 88rem, kenar boşluğu clamp(16→40px). Bütün bölümler aynı içerik kenarına oturur.
- Ürün görseli oranı 3:4 (pazar yeri görsellerinin asıl oranı). Kartlar 3:4, mobil galeri 4:5.
- Dokunma hedefi en az 44px. Odak: 2px orman çizgisi, 2px boşluk.

## Hareket
Yalnız transform/opacity. Çekmece 340ms `ease-cikis`, kart ikinci görsele geçiş 500ms (yalnız fareli cihazda),
düğme basışı 1px. Her bölüme kaydırma animasyonu yok. `prefers-reduced-motion` saygı görür.

## Bileşenler
`dugmeSinifi` (birincil / ikincil / acik / metin), `Cekmece` (native dialog), `Alan` / `UzunAlan` / `Secim`
(etiket üstte, yardım ya da hata altta, satır yüksekliği sabit), `UrunKarti`, `Fiyat`, `KargoIlerleme`, `SayfaBasi`,
`MetinGovdesi`. İkonlar yalnız Phosphor (light), `src/bilesenler/ikon.tsx` üzerinden.

## Metin
Türkçe, cümle düzeninde başlık, uzun çizgi yok, ünlem yok, "eşsiz / benzersiz / sorunsuz / keşfedin" gibi dolgu yok.
Uydurma sayı, yorum, müşteri sayısı yok; her iddia pazar yerinde ya da markanın metninde doğrulanabilir olmalı.
Sahte kıtlık ("son 2 adet") yok. Hata mesajı: ne oldu ve ne yapmalı.
