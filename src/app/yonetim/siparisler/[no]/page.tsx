import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { yonetimGerekli } from "@/sunucu/yonetim";
import { siparisBul } from "@/sunucu/kayitlar";
import { DURUM_ADI } from "@/sunucu/siparis-tipi";
import { tl } from "@/magaza/para";
import { DurumRozeti } from "../../DurumRozeti";
import { DurumFormu } from "./DurumFormu";

export const metadata = { title: "Sipariş" };

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "long", timeStyle: "short" });

function Bilgi({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return (
    <section className="rounded-panel border border-cizgi bg-yuzey px-5 py-4">
      <h2 className="font-govde text-sm font-medium tracking-normal text-murekkep-3">{baslik}</h2>
      <div className="mt-2 text-[0.9375rem]">{children}</div>
    </section>
  );
}

export default async function YonetimSiparis({ params }: PageProps<"/yonetim/siparisler/[no]">) {
  await yonetimGerekli();
  const s = await siparisBul((await params).no);
  if (!s) notFound();

  return (
    <>
      <Link href="/yonetim/siparisler" className="text-sm text-murekkep-2 hover:underline hover:underline-offset-4">
        ← Siparişler
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="baslik-2 rakam">{s.no}</h1>
        <DurumRozeti durum={s.durum} />
        {s.demo ? <span className="rounded-full bg-kagit-3 px-2.5 py-0.5 text-etiket">Demo</span> : null}
      </div>
      <p className="mt-1 text-murekkep-2">{tarihBicimi.format(new Date(s.tarih))}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <section className="rounded-panel border border-cizgi bg-yuzey px-5 py-4">
            <h2 className="font-govde text-sm font-medium tracking-normal text-murekkep-3">Ürünler</h2>
            <ul role="list" className="mt-2 divide-y divide-cizgi">
              {s.satirlar.map((k) => (
                <li key={`${k.slug}:${k.kod}`} className="flex items-center gap-4 py-3">
                  <span className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden rounded-kucuk bg-kagit-3">
                    <Image src={k.gorsel} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link href={`/urun/${k.slug}?v=${k.kod}`} target="_blank" className="font-medium hover:underline">
                      {k.ad}
                    </Link>
                    <span className="block text-sm text-murekkep-2">
                      {[k.etiket, `Barkod ${k.barkod}`].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className="rakam shrink-0 text-right text-sm">
                    {k.adet} × {tl(k.birimFiyat)}
                    <span className="block font-medium text-murekkep">{tl(k.adet * k.birimFiyat)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-2 space-y-1 border-t border-cizgi pt-3 text-[0.9375rem]">
              <div className="flex justify-between">
                <dt className="text-murekkep-2">Ara toplam</dt>
                <dd className="rakam">{tl(s.araToplam)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-murekkep-2">Kargo</dt>
                <dd className="rakam">{s.kargo ? tl(s.kargo) : "Ücretsiz"}</dd>
              </div>
              {s.odemeUcreti ? (
                <div className="flex justify-between">
                  <dt className="text-murekkep-2">Kapıda ödeme ücreti</dt>
                  <dd className="rakam">{tl(s.odemeUcreti)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between font-medium">
                <dt>Toplam</dt>
                <dd className="rakam">{tl(s.toplam)}</dd>
              </div>
            </dl>
          </section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Bilgi baslik="Müşteri">
              <p>
                {s.musteri.ad} {s.musteri.soyad}
              </p>
              <p>
                <a href={`mailto:${s.musteri.eposta}`} className="baglanti">
                  {s.musteri.eposta}
                </a>
              </p>
              <p className="rakam">
                <a href={`tel:+90${s.musteri.telefon}`} className="baglanti">
                  0{s.musteri.telefon}
                </a>
              </p>
              {s.izinler.ticariIleti ? <p className="mt-2 text-sm text-murekkep-3">Ticari ileti izni verdi.</p> : null}
            </Bilgi>
            <Bilgi baslik="Teslimat adresi">
              <p>{s.teslimat.adres}</p>
              <p>
                {s.teslimat.ilce} / {s.teslimat.il}
              </p>
            </Bilgi>
            <Bilgi baslik="Ödeme">
              <p>{s.odeme === "havale" ? "Havale / EFT" : "Kapıda ödeme"}</p>
            </Bilgi>
            <Bilgi baslik="Fatura">
              {s.fatura.kurumsal ? (
                <>
                  <p>{s.fatura.kurumsal.firma}</p>
                  <p className="rakam">
                    {s.fatura.kurumsal.vergiDairesi} · {s.fatura.kurumsal.vergiNo}
                  </p>
                </>
              ) : (
                <p>Bireysel</p>
              )}
              <p className="mt-1 text-murekkep-2">{s.fatura.adres ?? "Teslimat adresiyle aynı"}</p>
            </Bilgi>
          </div>
          {s.not ? (
            <Bilgi baslik="Müşteri notu">
              <p className="whitespace-pre-line">{s.not}</p>
            </Bilgi>
          ) : null}
        </div>

        <div className="space-y-6 lg:col-span-5">
          <section className="rounded-panel border border-cizgi bg-yuzey px-5 py-5">
            <h2 className="font-baslik text-xl">Durumu güncelle</h2>
            <DurumFormu no={s.no} durum={s.durum} takipNo={s.takipNo ?? ""} />
          </section>
          <section className="rounded-panel border border-cizgi bg-yuzey px-5 py-5">
            <h2 className="font-govde text-sm font-medium tracking-normal text-murekkep-3">Geçmiş</h2>
            <ol className="mt-3 space-y-3 text-[0.9375rem]">
              <li>
                <span className="font-medium">Sipariş alındı</span> · {s.odeme === "havale" ? "ödeme bekleniyor" : "hazırlanıyor"}
                <span className="rakam block text-sm text-murekkep-3">{tarihBicimi.format(new Date(s.tarih))}</span>
              </li>
              {s.gecmis.map((o) => (
                <li key={o.tarih}>
                  <span className="font-medium">{DURUM_ADI[o.durum]}</span>
                  {o.takipNo ? <span className="rakam"> · Takip no {o.takipNo}</span> : null}
                  {o.not ? <span className="block text-murekkep-2">{o.not}</span> : null}
                  <span className="rakam block text-sm text-murekkep-3">{tarihBicimi.format(new Date(o.tarih))}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
