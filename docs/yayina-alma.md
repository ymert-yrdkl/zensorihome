# Yayına alma (Coolify, zensorihomecom.ahmcloud.com)

## Durum (3 Ekim 2026)
- Coolify: proje `zensorihome` › `production` › uygulama (Public Git Repository, Dockerfile, port 3000) kuruldu,
  ilk dağıtım başarılı. Kalıcı birim `…-zensorihome-veri` → `/veri`.
- Alan adları: `https://zensorihomecom.ahmcloud.com` (+ Coolify'ın eklediği www) ve geçici
  `http://zolfnbjmz6hzfx2yuab83yuq.187.124.174.57.sslip.io` (DNS gelene kadar bu adresten açılır).
- DNS: Hostinger'da A kaydı `zensorihomecom` → `187.124.174.57`, TTL 300 eklendi (3 Ekim 2026). HTTPS sertifikasını
  Coolify (Traefik + Let's Encrypt) ilk istekte kendisi alır.

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

## 4. Yönetim paneli
Adres: https://zensorihomecom.ahmcloud.com/yonetim. Açmak için Coolify › zensorihome › Environment Variables'a
`YONETICI_SIFRE` (en az 8 karakter, yalnız çalışma zamanı) eklenip uygulama **Restart** edilir. Şifre değişince açık
oturumlar kendiliğinden düşer.

## 5. Kayıtlara bakmak
Siparişler `/veri/siparisler.jsonl`, durum değişiklikleri `/veri/siparis-olaylari.jsonl`, iletişim mesajları
`/veri/mesajlar.jsonl` (satır başına bir JSON). Günlük kullanım için panel yeterli.
Coolify › uygulama › Terminal: `tail -n 5 /veri/siparisler.jsonl`.

## 6. Gerçek satışa geçmeden önce
`docs/acik-kararlar.md` listesindeki kararlar verilmeli; yasal metinler hukukçuya okutulmalı; kartla ödeme için
iyzico/PayTR üye işyeri hesabı açılmalı; sipariş bildirimi (e-posta) eklenmeli.
