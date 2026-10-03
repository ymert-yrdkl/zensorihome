import Link from "next/link";
import { Logo } from "@/bilesenler/Logo";
import { IkonInstagram } from "@/bilesenler/ikon";
import { kategoriler } from "@/katalog/katalog";
import { MAGAZA } from "@/magaza/ayarlar";
import { tl } from "@/magaza/para";
import { YASAL_METINLER } from "@/icerik/yasal";

// Altbilgi: koyu orman zemin. Üstte markanın kendi cümlesi, altta yasal satıcı bilgileri.
export function Alt() {
  const s = MAGAZA.sirket;
  return (
    <footer className="mt-auto bg-gece text-kagit">
      <div className="kabuk grid grid-cols-1 gap-12 pb-10 pt-16 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:pt-20">
        <div className="max-w-md">
          <Logo ters />
          <p className="mt-6 font-baslik text-2xl leading-snug">Sakin evler için cam, seramik, ahşap ve mum.</p>
          <p className="mt-3 text-krem-soluk">
            Zen felsefesinden ilham alan ev dekorasyonu ve mutfak ürünleri. Doğal dokular, sade formlar, İstanbul’dan.
          </p>
          <a
            href={MAGAZA.sosyal.instagram}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-kagit underline decoration-krem-soluk/50 underline-offset-4 hover:decoration-kagit"
          >
            <IkonInstagram size={20} />
            {MAGAZA.sosyal.instagramKullanici}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          <AltGrup baslik="Alışveriş">
            <AltBag href="/urunler">Tüm ürünler</AltBag>
            {kategoriler.map((k) => (
              <AltBag key={k.slug} href={`/kategori/${k.slug}`}>
                {k.ad}
              </AltBag>
            ))}
          </AltGrup>
          <AltGrup baslik="Yardım">
            <AltBag href="/kargo-ve-iade">Kargo ve iade</AltBag>
            <AltBag href="/sss">Sık sorulanlar</AltBag>
            <AltBag href="/iletisim">İletişim</AltBag>
            <AltBag href="/favoriler">Favorilerim</AltBag>
            <AltBag href="/hakkimizda">Hikâyemiz</AltBag>
          </AltGrup>
          <AltGrup baslik="Pazar yerlerinde">
            {MAGAZA.pazarYerleri.map((p) => (
              <li key={p.ad}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-10 flex-col justify-center py-1 hover:text-kagit"
                >
                  <span className="text-kagit">{p.ad}</span>
                  <span className="text-etiket text-krem-soluk">{p.not}</span>
                </a>
              </li>
            ))}
          </AltGrup>
        </div>
      </div>

      <div className="kabuk border-t border-gece-2 py-8">
        <ul role="list" className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-krem-soluk">
          {YASAL_METINLER.map((m) => (
            <li key={m.slug}>
              <Link href={`/yasal/${m.slug}`} className="inline-flex min-h-10 items-center hover:text-kagit">
                {m.kisaAd}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid grid-cols-1 gap-2 text-etiket text-krem-soluk lg:grid-cols-[1fr_auto] lg:gap-8">
          <p>
            {s.unvan}. {s.adres}. {s.vergiDairesi}, VKN {s.vergiNo}. Ticaret sicil no {s.ticaretSicilNo}. KEP {s.kep}.
          </p>
          <p className="whitespace-nowrap">Havale / EFT ve kapıda ödeme · {tl(MAGAZA.ucretsizKargoEsigi)} üzeri kargo ücretsiz</p>
        </div>
        <p className="mt-6 text-etiket text-krem-soluk">© {new Date().getFullYear()} Zensori Home</p>
      </div>
    </footer>
  );
}

function AltGrup({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-govde text-sm font-medium tracking-normal text-krem-soluk">{baslik}</h2>
      <ul role="list" className="mt-3 space-y-0.5 text-[0.9375rem] text-kagit">
        {children}
      </ul>
    </div>
  );
}

function AltBag({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="inline-flex min-h-10 items-center hover:underline hover:decoration-krem-soluk hover:underline-offset-4"
      >
        {children}
      </Link>
    </li>
  );
}
