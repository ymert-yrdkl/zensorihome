"use client";

// Ödeme sayfası: tek sayfada iletişim, teslimat, fatura, ödeme yöntemi ve onay; yanda sipariş özeti.
// Form <form action> yerine onSubmit ile gönderilir: hata olduğunda React yazılanları silmesin.

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { anahtar, useSepet } from "@/istemci/sepet";
import { siparisVer } from "@/sunucu/siparis";
import { Alan, Secim, UzunAlan } from "@/bilesenler/ui/Alan";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { IkonSepet } from "@/bilesenler/ikon";
import { ILLER } from "@/magaza/iller";
import { tl } from "@/magaza/para";
import { KargoIlerleme } from "./KargoIlerleme";

type OdemeSecenegi = { deger: string; ad: string; aciklama: string };

export function OdemeFormu({
  fiyatlar,
  odemeYontemleri,
  kapidaOdemeUcreti,
  demo,
}: {
  fiyatlar: Record<string, number>;
  odemeYontemleri: readonly OdemeSecenegi[];
  kapidaOdemeUcreti: number;
  demo: boolean;
}) {
  const sepet = useSepet();
  const router = useRouter();
  const [bekliyor, baslat] = useTransition();
  const [hatalar, setHatalar] = useState<Record<string, string>>({});
  const [genelHata, setGenelHata] = useState("");
  const [faturaFarkli, setFaturaFarkli] = useState(false);
  const [kurumsal, setKurumsal] = useState(false);
  const [odeme, setOdeme] = useState("havale");
  const [tamamlandi, setTamamlandi] = useState(false);

  // Sepetteki fiyatları katalogdaki güncel fiyatlarla eşitle
  const { fiyatlariGuncelle } = sepet;
  useEffect(() => {
    fiyatlariGuncelle(fiyatlar);
  }, [fiyatlar, fiyatlariGuncelle]);

  const odemeUcreti = odeme === "kapida" ? kapidaOdemeUcreti : 0;
  const toplam = sepet.araToplam + sepet.kargo + odemeUcreti;

  if (sepet.kalemler.length === 0 && !tamamlandi) {
    return (
      <div className="kabuk pb-24">
        <div className="mx-auto max-w-lg rounded-panel bg-kagit-2 px-6 py-14 text-center">
          <IkonSepet size={40} className="mx-auto text-murekkep-3" />
          <h2 className="mt-4 font-baslik text-2xl">Sepetiniz boş</h2>
          <p className="mt-2 text-murekkep-2">Ödeme adımına geçmek için sepete en az bir ürün ekleyin.</p>
          <Link href="/urunler" className={dugmeSinifi({ ek: "mt-6" })}>
            Ürünlere göz at
          </Link>
        </div>
      </div>
    );
  }

  function gonder(olay: React.FormEvent<HTMLFormElement>) {
    olay.preventDefault();
    const v = new FormData(olay.currentTarget);
    const deger = (ad: string) => String(v.get(ad) ?? "");
    setGenelHata("");
    baslat(async () => {
      const sonuc = await siparisVer({
        eposta: deger("eposta"),
        telefon: deger("telefon"),
        ad: deger("ad"),
        soyad: deger("soyad"),
        il: deger("il") as (typeof ILLER)[number],
        ilce: deger("ilce"),
        adres: deger("adres"),
        faturaFarkli,
        faturaAdres: deger("faturaAdres"),
        kurumsal,
        firma: deger("firma"),
        vergiDairesi: deger("vergiDairesi"),
        vergiNo: deger("vergiNo").replace(/\D/g, ""),
        odeme: odeme as "havale" | "kapida",
        not: deger("not"),
        sozlesme: v.get("sozlesme") === "on",
        ticariIleti: v.get("ticariIleti") === "on",
        kalemler: sepet.kalemler.map((k) => ({ slug: k.slug, kod: k.kod, adet: k.adet })),
      } as Parameters<typeof siparisVer>[0]);

      if (sonuc.tamam) {
        setTamamlandi(true);
        sepet.temizle();
        router.push(`/siparis/${sonuc.no}?k=${sonuc.anahtar}`);
        return;
      }
      setHatalar(sonuc.hatalar);
      setGenelHata(sonuc.mesaj);
      // İlk hatalı alana odaklan
      requestAnimationFrame(() => {
        const ilk = document.querySelector<HTMLElement>("[aria-invalid='true']");
        (ilk ?? document.getElementById("odeme-hata"))?.focus();
        (ilk ?? document.getElementById("odeme-hata"))?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    });
  }

  const ozet = (
    <div>
      <ul role="list" className="divide-y divide-cizgi">
        {sepet.kalemler.map((k) => (
          <li key={anahtar(k.slug, k.kod)} className="flex gap-3 py-3">
            <span
              className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-kucuk"
              style={{ backgroundColor: k.gorsel.renk }}
            >
              <Image src={k.gorsel.src} alt="" fill sizes="56px" className="object-cover" />
              <span className="rakam absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-murekkep text-[0.6875rem] text-kagit">
                {k.adet}
              </span>
            </span>
            <span className="min-w-0 flex-1 text-sm">
              <span className="block font-medium">{k.ad}</span>
              {k.etiket ? <span className="block text-murekkep-2">{k.etiket}</span> : null}
              {k.adet > 1 ? (
                <span className="rakam block text-murekkep-3">
                  {k.adet} × {tl(k.fiyat)}
                </span>
              ) : null}
            </span>
            <span className="rakam shrink-0 text-sm">{tl(k.fiyat * k.adet)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 space-y-2 border-t border-cizgi pt-4 text-[0.9375rem]">
        <div className="flex justify-between">
          <dt className="text-murekkep-2">Ara toplam</dt>
          <dd className="rakam">{tl(sepet.araToplam)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-murekkep-2">Kargo</dt>
          <dd className="rakam">{sepet.kargo === 0 ? "Ücretsiz" : tl(sepet.kargo)}</dd>
        </div>
        {odemeUcreti > 0 ? (
          <div className="flex justify-between">
            <dt className="text-murekkep-2">Kapıda ödeme ücreti</dt>
            <dd className="rakam">{tl(odemeUcreti)}</dd>
          </div>
        ) : null}
        <div className="flex items-baseline justify-between border-t border-cizgi pt-3">
          <dt className="font-medium">Toplam</dt>
          <dd className="rakam text-xl font-medium">{tl(toplam)}</dd>
        </div>
        <p className="text-sm text-murekkep-3">Fiyatlara KDV dahildir.</p>
      </dl>
      <div className="mt-4">
        <KargoIlerleme araToplam={sepet.araToplam} />
      </div>
    </div>
  );

  return (
    <div className="kabuk grid grid-cols-1 gap-10 pb-24 lg:grid-cols-12 lg:gap-14">
      {/* Mobil: açılır özet */}
      <details className="rounded-panel border border-cizgi bg-yuzey px-4 lg:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <span>
            Sipariş özeti <span className="text-murekkep-3">({sepet.adetToplam} ürün)</span>
          </span>
          <span className="rakam font-medium">{tl(toplam)}</span>
        </summary>
        <div className="pb-4">{ozet}</div>
      </details>

      <form onSubmit={gonder} noValidate className="lg:col-span-7" aria-describedby={genelHata ? "odeme-hata" : undefined}>
        {genelHata ? (
          <div
            id="odeme-hata"
            tabIndex={-1}
            role="alert"
            className="mb-8 rounded-kontrol border border-hata/40 bg-hata-zemin px-4 py-3 text-[0.9375rem] text-hata"
          >
            {genelHata}
          </div>
        ) : null}

        <FormBolumu sira={1} baslik="İletişim">
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Alan
              etiket="E-posta"
              ad="eposta"
              type="email"
              autoComplete="email"
              inputMode="email"
              hata={hatalar.eposta}
              yardim="Sipariş bilgisi bu adrese yazılır."
            />
            <Alan
              etiket="Cep telefonu"
              ad="telefon"
              type="tel"
              autoComplete="tel-national"
              inputMode="tel"
              placeholder="5xx xxx xx xx"
              hata={hatalar.telefon}
              yardim="Kargo firması teslimat için arayabilir."
            />
          </div>
        </FormBolumu>

        <FormBolumu sira={2} baslik="Teslimat adresi">
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Alan etiket="Ad" ad="ad" autoComplete="given-name" hata={hatalar.ad} />
            <Alan etiket="Soyad" ad="soyad" autoComplete="family-name" hata={hatalar.soyad} />
            <Secim
              etiket="İl"
              ad="il"
              secenekler={ILLER}
              bosMetin="İl seçin"
              autoComplete="address-level1"
              hata={hatalar.il}
              defaultValue=""
            />
            <Alan etiket="İlçe" ad="ilce" autoComplete="address-level2" hata={hatalar.ilce} />
            <UzunAlan
              etiket="Adres"
              ad="adres"
              autoComplete="street-address"
              placeholder="Mahalle, cadde/sokak, bina no, daire no"
              hata={hatalar.adres}
              ek="sm:col-span-2"
            />
          </div>
        </FormBolumu>

        <FormBolumu sira={3} baslik="Fatura">
          <div className="space-y-3">
            <Kutucuk isaretli={faturaFarkli} degistir={setFaturaFarkli}>
              Fatura adresim teslimat adresinden farklı
            </Kutucuk>
            {faturaFarkli ? (
              <UzunAlan
                etiket="Fatura adresi"
                ad="faturaAdres"
                autoComplete="billing street-address"
                hata={hatalar.faturaAdres}
              />
            ) : null}
            <Kutucuk isaretli={kurumsal} degistir={setKurumsal}>
              Kurumsal fatura istiyorum
            </Kutucuk>
            {kurumsal ? (
              <div className="grid grid-cols-1 gap-x-4 pt-2 sm:grid-cols-2">
                <Alan etiket="Firma unvanı" ad="firma" autoComplete="organization" hata={hatalar.firma} ek="sm:col-span-2" />
                <Alan etiket="Vergi dairesi" ad="vergiDairesi" hata={hatalar.vergiDairesi} />
                <Alan etiket="Vergi no / TC kimlik no" ad="vergiNo" inputMode="numeric" hata={hatalar.vergiNo} />
              </div>
            ) : null}
          </div>
        </FormBolumu>

        <FormBolumu sira={4} baslik="Ödeme yöntemi">
          <fieldset aria-describedby={hatalar.odeme ? "odeme-yontemi-hata" : undefined}>
            <legend className="sr-only">Ödeme yöntemi</legend>
            <div className="space-y-3">
              {odemeYontemleri.map((y) => (
                <label
                  key={y.deger}
                  className={`flex cursor-pointer gap-3 rounded-kontrol border px-4 py-4 transition-colors ${
                    odeme === y.deger ? "border-orman bg-adacayi/50" : "border-cizgi-koyu hover:border-murekkep"
                  }`}
                >
                  <input
                    type="radio"
                    name="odeme"
                    value={y.deger}
                    checked={odeme === y.deger}
                    onChange={() => setOdeme(y.deger)}
                    className="mt-1 size-4 shrink-0"
                  />
                  <span>
                    <span className="block font-medium">
                      {y.ad}
                      {y.deger === "kapida" && kapidaOdemeUcreti > 0 ? (
                        <span className="rakam font-normal text-murekkep-2"> (+{tl(kapidaOdemeUcreti)})</span>
                      ) : null}
                    </span>
                    <span className="block text-sm text-murekkep-2">{y.aciklama}</span>
                  </span>
                </label>
              ))}
            </div>
            {hatalar.odeme ? (
              <p id="odeme-yontemi-hata" className="mt-2 text-sm text-hata">
                {hatalar.odeme}
              </p>
            ) : null}
          </fieldset>
          <UzunAlan
            etiket="Sipariş notu"
            ad="not"
            istege
            maxLength={500}
            ek="mt-6"
            yardim="Kargo için bir notunuz varsa yazın."
            hata={hatalar.not}
          />
        </FormBolumu>

        <div className="space-y-3 border-t border-cizgi pt-8">
          <label className="flex cursor-pointer gap-3 text-[0.9375rem]">
            <input
              type="checkbox"
              name="sozlesme"
              className="mt-1 size-4 shrink-0"
              aria-invalid={hatalar.sozlesme ? true : undefined}
            />
            <span>
              <Link href="/yasal/on-bilgilendirme-formu" target="_blank" className="baglanti">
                Ön bilgilendirme formunu
              </Link>{" "}
              ve{" "}
              <Link href="/yasal/mesafeli-satis-sozlesmesi" target="_blank" className="baglanti">
                mesafeli satış sözleşmesini
              </Link>{" "}
              okudum, onaylıyorum.
            </span>
          </label>
          {hatalar.sozlesme ? <p className="pl-7 text-sm text-hata">{hatalar.sozlesme}</p> : null}
          <label className="flex cursor-pointer gap-3 text-[0.9375rem] text-murekkep-2">
            <input type="checkbox" name="ticariIleti" className="mt-1 size-4 shrink-0" />
            <span>Yeni ürün ve kampanyalardan e-posta ile haberdar olmak istiyorum. (İsteğe bağlı)</span>
          </label>
          <p className="pt-1 text-sm text-murekkep-3">
            Kişisel verileriniz siparişinizi teslim etmek için işlenir.{" "}
            <Link href="/yasal/kvkk-aydinlatma" target="_blank" className="baglanti">
              Aydınlatma metni
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <button type="submit" disabled={bekliyor} aria-busy={bekliyor} className={dugmeSinifi({ boy: "b", tam: true })}>
            {bekliyor ? "Sipariş gönderiliyor…" : `Siparişi tamamla · ${tl(toplam)}`}
          </button>
          {demo ? (
            <p className="mt-3 rounded-kontrol bg-kagit-2 px-4 py-3 text-sm text-murekkep-2">
              Bu site tanıtım (demo) sürümüdür. Verdiğiniz sipariş kaydedilir ama işleme alınmaz, ürün gönderilmez.
            </p>
          ) : null}
        </div>
      </form>

      <aside aria-label="Sipariş özeti" className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-32 rounded-panel border border-cizgi bg-yuzey px-6 py-6">
          <h2 className="font-baslik text-xl">Sipariş özeti</h2>
          <div className="mt-2">{ozet}</div>
          <Link href="/sepet" className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4">
            Sepeti düzenle
          </Link>
        </div>
      </aside>
    </div>
  );
}

function FormBolumu({ sira, baslik, children }: { sira: number; baslik: string; children: React.ReactNode }) {
  return (
    <section className="mb-10" aria-labelledby={`bolum-${sira}`}>
      <h2 id={`bolum-${sira}`} className="mb-5 flex items-baseline gap-3 font-baslik text-xl">
        <span className="rakam grid size-7 shrink-0 place-items-center rounded-full bg-orman font-govde text-sm text-kagit">
          {sira}
        </span>
        {baslik}
      </h2>
      {children}
    </section>
  );
}

function Kutucuk({
  isaretli,
  degistir,
  children,
}: {
  isaretli: boolean;
  degistir: (d: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem]">
      <input type="checkbox" checked={isaretli} onChange={(e) => degistir(e.target.checked)} className="size-4 shrink-0" />
      {children}
    </label>
  );
}
