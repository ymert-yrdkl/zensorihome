import type { Metadata } from "next";
import crypto from "node:crypto";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { satirlariOku } from "@/sunucu/depo";
import type { Siparis } from "@/sunucu/siparis-tipi";
import { MAGAZA } from "@/magaza/ayarlar";
import { tl } from "@/magaza/para";
import { tahminiKargoTarihi } from "@/magaza/kargo-tarihi";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { IkonTamam } from "@/bilesenler/ikon";

export const metadata: Metadata = { title: "Siparişiniz alındı", robots: { index: false } };

function anahtarUyuyor(beklenen: string, gelen: string) {
  const a = Buffer.from(beklenen);
  const b = Buffer.from(gelen);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "long", timeStyle: "short" });

export default async function SiparisSayfasi({ params, searchParams }: PageProps<"/siparis/[no]">) {
  const { no } = await params;
  const { k } = await searchParams;
  const siparisler = await satirlariOku<Siparis>("siparisler.jsonl");
  const siparis = siparisler.find((s) => s.no === no);
  // Sipariş numarası tek başına yetmez; bağlantıdaki gizli anahtar da eşleşmeli
  if (!siparis || typeof k !== "string" || !anahtarUyuyor(siparis.anahtar, k)) notFound();

  const havale = siparis.odeme === "havale";
  const banka = MAGAZA.banka;
  const adimlar = havale
    ? [
        "Aşağıdaki hesaba sipariş tutarını gönderin; açıklamaya sipariş numaranızı yazın.",
        `Ödemeniz ulaştığında siparişiniz hazırlanır ve ${MAGAZA.kargoyaVerilis} içinde kargoya verilir.`,
        "Kargoya verildiğinde takip numarası size iletilir.",
      ]
    : [
        `Siparişiniz hazırlanıyor. Tahmini kargoya veriliş: ${tahminiKargoTarihi(new Date(siparis.tarih))}.`,
        "Kargoya verildiğinde takip numarası size iletilir.",
        `Ödemeyi ürünü teslim alırken kargo görevlisine yaparsınız (${tl(siparis.toplam)}).`,
      ];

  return (
    <div className="kabuk grid grid-cols-1 gap-12 pb-24 pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-16">
      <div className="lg:col-span-7">
        <span className="grid size-12 place-items-center rounded-full bg-orman text-kagit">
          <IkonTamam size={24} weight="bold" />
        </span>
        <h1 className="baslik-2 mt-6">Teşekkürler {siparis.musteri.ad}, siparişiniz alındı.</h1>
        <p className="mt-4 text-murekkep-2">
          Sipariş numaranız <strong className="rakam font-medium text-murekkep">{siparis.no}</strong>.{" "}
          {tarihBicimi.format(new Date(siparis.tarih))}.
        </p>
        {siparis.demo ? (
          <p className="mt-6 rounded-kontrol bg-kagit-2 px-4 py-3 text-sm text-murekkep-2">
            Bu site tanıtım (demo) sürümüdür. Sipariş kaydedildi ama işleme alınmayacak, ürün gönderilmeyecek.
          </p>
        ) : null}

        <h2 className="baslik-3 mt-12">Bundan sonra</h2>
        <ol className="mt-5 space-y-4">
          {adimlar.map((adim, i) => (
            <li key={adim} className="flex gap-4">
              <span className="rakam grid size-7 shrink-0 place-items-center rounded-full border border-cizgi-koyu text-sm">
                {i + 1}
              </span>
              <span className="pt-0.5">{adim}</span>
            </li>
          ))}
        </ol>

        {havale ? (
          <div className="mt-8 rounded-panel border border-cizgi bg-yuzey px-5 py-5">
            <h3 className="font-govde text-base font-medium tracking-normal">Havale / EFT bilgileri</h3>
            {banka.iban ? (
              <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 text-[0.9375rem]">
                <dt className="text-murekkep-3">Banka</dt>
                <dd>{banka.ad}</dd>
                <dt className="text-murekkep-3">Alıcı</dt>
                <dd>{banka.alici}</dd>
                <dt className="text-murekkep-3">IBAN</dt>
                <dd className="rakam break-all font-medium">{banka.iban}</dd>
                <dt className="text-murekkep-3">Tutar</dt>
                <dd className="rakam font-medium">{tl(siparis.toplam)}</dd>
                <dt className="text-murekkep-3">Açıklama</dt>
                <dd className="rakam">{siparis.no}</dd>
              </dl>
            ) : (
              <p className="mt-2 text-[0.9375rem] text-murekkep-2">
                Hesap bilgileri telefonla ya da e-postayla iletilecek. Ödenecek tutar:{" "}
                <strong className="rakam font-medium">{tl(siparis.toplam)}</strong>.
              </p>
            )}
          </div>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-6 text-[0.9375rem] sm:grid-cols-2">
          <div>
            <h3 className="font-govde text-sm font-medium tracking-normal text-murekkep-3">Teslimat adresi</h3>
            <p className="mt-2">
              {siparis.musteri.ad} {siparis.musteri.soyad}
              <br />
              {siparis.teslimat.adres}
              <br />
              {siparis.teslimat.ilce} / {siparis.teslimat.il}
            </p>
          </div>
          <div>
            <h3 className="font-govde text-sm font-medium tracking-normal text-murekkep-3">İletişim</h3>
            <p className="mt-2">
              {siparis.musteri.eposta}
              <br />
              <span className="rakam">0{siparis.musteri.telefon}</span>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/urunler" className={dugmeSinifi()}>
            Alışverişe devam et
          </Link>
          <Link href="/iletisim" className={dugmeSinifi({ tur: "ikincil" })}>
            Bize yazın
          </Link>
        </div>
      </div>

      <aside aria-label="Sipariş özeti" className="lg:col-span-5">
        <div className="rounded-panel border border-cizgi bg-yuzey px-6 py-6">
          <h2 className="font-baslik text-xl">Sipariş özeti</h2>
          <ul role="list" className="mt-2 divide-y divide-cizgi">
            {siparis.satirlar.map((s) => (
              <li key={`${s.slug}:${s.kod}`} className="flex gap-3 py-3">
                <span className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-kucuk bg-kagit-3">
                  <Image src={s.gorsel} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block font-medium">{s.ad}</span>
                  {s.etiket ? <span className="block text-murekkep-2">{s.etiket}</span> : null}
                  <span className="rakam block text-murekkep-3">
                    {s.adet} × {tl(s.birimFiyat)}
                  </span>
                </span>
                <span className="rakam shrink-0 text-sm">{tl(s.birimFiyat * s.adet)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-2 border-t border-cizgi pt-4 text-[0.9375rem]">
            <div className="flex justify-between">
              <dt className="text-murekkep-2">Ara toplam</dt>
              <dd className="rakam">{tl(siparis.araToplam)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-murekkep-2">Kargo</dt>
              <dd className="rakam">{siparis.kargo === 0 ? "Ücretsiz" : tl(siparis.kargo)}</dd>
            </div>
            {siparis.odemeUcreti > 0 ? (
              <div className="flex justify-between">
                <dt className="text-murekkep-2">Kapıda ödeme ücreti</dt>
                <dd className="rakam">{tl(siparis.odemeUcreti)}</dd>
              </div>
            ) : null}
            <div className="flex items-baseline justify-between border-t border-cizgi pt-3">
              <dt className="font-medium">Toplam</dt>
              <dd className="rakam text-xl font-medium">{tl(siparis.toplam)}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-murekkep-3">Ödeme</dt>
              <dd>{havale ? "Havale / EFT" : "Kapıda ödeme"}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
