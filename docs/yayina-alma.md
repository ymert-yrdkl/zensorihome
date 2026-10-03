# Yayına alma (Coolify, zensorihomecom.ahmcloud.com)

Sunucu Ahmet'in; adımlar Yusuf ve Ahmet'in onayıyla yapılır. Kurgu nfcqrkartim ile aynı: açık GitHub deposu,
Coolify'da Dockerfile ile derleme, kalıcı `/veri` birimi.

## 1. Kod
Açık depo: https://github.com/ymert-yrdkl/zensorihome (dal `main`).

```bash
git remote add origin git@github.com:ymert-yrdkl/zensorihome.git
git push -u origin main
```

## 2. Coolify kaynağı
1. Yeni proje `zensorihome` › ortam `production` › yeni kaynak › **Public Git Repository** →
   `https://github.com/ymert-yrdkl/zensorihome`, dal `main`, Build Pack **Dockerfile**.
2. Port **3000**. Alan adı `https://zensorihomecom.ahmcloud.com`.
3. **Kalıcı depolama:** hedef yol `/veri`. Eklenmezse her dağıtımda siparişler ve mesajlar silinir.
4. Ortam değişkenleri (derleme argümanı olarak da işaretlenmeli):
   - `NEXT_PUBLIC_SITE_ADRESI` = `https://zensorihomecom.ahmcloud.com`
   - `NEXT_PUBLIC_DEMO_MODU` = `1` (gerçek satışa geçince `0`)
5. Sağlık kontrolü: `/api/saglik` (imajda HEALTHCHECK var).

Depo açık olduğu için GitHub webhook yok: `git push` sonrası Coolify'da **Deploy** düğmesine basılır.

## 3. DNS
Hostinger › ahmcloud.com DNS: A kaydı `zensorihomecom` → `187.124.174.57` (diğer alt alanlarla aynı sunucu), TTL 300.
Kayıt yayılınca Coolify Let's Encrypt sertifikasını kendisi alır.

## 4. Kayıtlara bakmak
Siparişler `/veri/siparisler.jsonl`, iletişim mesajları `/veri/mesajlar.jsonl` (satır başına bir JSON).
Coolify › uygulama › Terminal: `tail -n 5 /veri/siparisler.jsonl`.

## 5. Gerçek satışa geçmeden önce
`docs/acik-kararlar.md` listesindeki kararlar verilmeli; yasal metinler hukukçuya okutulmalı; kartla ödeme için
iyzico/PayTR üye işyeri hesabı açılmalı; sipariş bildirimi (e-posta) ve bir yönetim ekranı eklenmeli.
