// Liste sayfalarının ortak gövdesi: filtreler (masaüstünde solda, mobilde çekmecede), sıralama, ızgara.
// Filtreler sıradan bağlantılardır; JavaScript olmadan da çalışır.

import Link from "next/link";
import {
  filtreSecenekleri,
  filtreUygula,
  kategoriBul,
  SIRALAMALAR,
  urunleriListele,
  type Filtre,
  type Urun,
} from "@/katalog/katalog";
import { renkOrnegi } from "@/katalog/renkler";
import { filtreSayisi, filtreUrl } from "@/katalog/filtre-url";
import { UrunIzgara } from "@/bilesenler/urun/UrunKarti";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { IkonKapat, IkonTamam } from "@/bilesenler/ikon";
import { FiltreCekmecesi, SiralaSecici } from "./ListeAraclari";

type Props = {
  temelYol: string;
  urunler: Urun[];
  filtre: Filtre;
  kategoriFiltresi?: boolean;
  sorgu?: string;
};

export function UrunListesi({ temelYol, urunler, filtre, kategoriFiltresi = false, sorgu }: Props) {
  const secenekler = filtreSecenekleri(urunler);
  const sonuc = filtreUygula(urunler, filtre);
  const url = (degisim: Parameters<typeof filtreUrl>[2]) => filtreUrl(temelYol, filtre, degisim, sorgu);
  const aktifSayi = filtreSayisi(filtre, kategoriFiltresi);

  const gruplar = (
    <div className="divide-y divide-cizgi">
      {kategoriFiltresi && secenekler.kategoriler.length > 1 ? (
        <FiltreGrubu baslik="Kategori">
          {secenekler.kategoriler.map(({ deger, adet }) => (
            <SecimBaglantisi key={deger} href={url({ tur: "kategori", deger })} secili={filtre.kategori === deger} adet={adet}>
              {kategoriBul(deger)?.ad ?? deger}
            </SecimBaglantisi>
          ))}
        </FiltreGrubu>
      ) : null}
      {secenekler.renkler.length > 1 ? (
        <FiltreGrubu baslik="Renk">
          {secenekler.renkler.map(({ deger, adet }) => (
            <SecimBaglantisi
              key={deger}
              href={url({ tur: "renk", deger })}
              secili={filtre.renkler.includes(deger)}
              adet={adet}
              ornek={renkOrnegi(deger)}
            >
              {deger}
            </SecimBaglantisi>
          ))}
        </FiltreGrubu>
      ) : null}
      {secenekler.fiyatlar.filter((f) => f.adet > 0).length > 1 ? (
        <FiltreGrubu baslik="Fiyat">
          {secenekler.fiyatlar
            .filter((f) => f.adet > 0)
            .map((f) => (
              <SecimBaglantisi
                key={f.deger}
                href={url({ tur: "fiyat", deger: f.deger })}
                secili={filtre.fiyat === f.deger}
                adet={f.adet}
              >
                {f.ad}
              </SecimBaglantisi>
            ))}
        </FiltreGrubu>
      ) : null}
      {secenekler.malzemeler.length > 1 ? (
        <FiltreGrubu baslik="Malzeme">
          {secenekler.malzemeler.map(({ deger, adet }) => (
            <SecimBaglantisi
              key={deger}
              href={url({ tur: "malzeme", deger })}
              secili={filtre.malzemeler.includes(deger)}
              adet={adet}
            >
              {deger}
            </SecimBaglantisi>
          ))}
        </FiltreGrubu>
      ) : null}
      {secenekler.markalar.length > 1 ? (
        <FiltreGrubu baslik="Marka">
          {secenekler.markalar.map(({ deger, adet }) => (
            <SecimBaglantisi key={deger} href={url({ tur: "marka", deger })} secili={filtre.markalar.includes(deger)} adet={adet}>
              {deger === "zensori" ? "Zensori" : deger}
            </SecimBaglantisi>
          ))}
        </FiltreGrubu>
      ) : null}
    </div>
  );

  const aktifler: { ad: string; href: string }[] = [
    ...(kategoriFiltresi && filtre.kategori
      ? [{ ad: kategoriBul(filtre.kategori)?.ad ?? filtre.kategori, href: url({ tur: "kategori", deger: filtre.kategori }) }]
      : []),
    ...filtre.renkler.map((r) => ({ ad: r, href: url({ tur: "renk", deger: r }) })),
    ...(filtre.fiyat
      ? [
          {
            ad: secenekler.fiyatlar.find((f) => f.deger === filtre.fiyat)?.ad ?? "",
            href: url({ tur: "fiyat", deger: filtre.fiyat }),
          },
        ]
      : []),
    ...filtre.malzemeler.map((m) => ({ ad: m, href: url({ tur: "malzeme", deger: m }) })),
    ...filtre.markalar.map((m) => ({ ad: m === "zensori" ? "Zensori" : m, href: url({ tur: "marka", deger: m }) })),
  ];

  return (
    <div className="kabuk grid grid-cols-1 gap-8 pb-20 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <aside aria-label="Filtreler" className="hidden lg:block">
        <div className="sticky top-32">{gruplar}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cizgi pb-4">
          <div className="flex items-center gap-3">
            <FiltreCekmecesi filtreSayisi={aktifSayi} sonucSayisi={sonuc.length}>
              {gruplar}
            </FiltreCekmecesi>
            <p className="rakam text-sm text-murekkep-2" aria-live="polite">
              {sonuc.length} ürün
            </p>
          </div>
          <SiralaSecici secenekler={SIRALAMALAR} secili={filtre.siralama} />
        </div>

        {aktifler.length ? (
          <ul role="list" className="mt-4 flex flex-wrap items-center gap-2">
            {aktifler.map((a) => (
              <li key={a.ad}>
                <Link
                  href={a.href}
                  scroll={false}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-kagit-2 pl-3.5 pr-2.5 text-sm hover:bg-kagit-3"
                  aria-label={`${a.ad} filtresini kaldır`}
                >
                  {a.ad}
                  <IkonKapat size={14} />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={url({ tur: "temizle" })}
                scroll={false}
                className="ml-1 inline-flex h-9 items-center text-sm underline underline-offset-4"
              >
                Hepsini temizle
              </Link>
            </li>
          </ul>
        ) : null}

        <div className="mt-8">
          {sonuc.length ? (
            <UrunIzgara urunler={urunleriListele(sonuc)} ilkOncelikli={4} />
          ) : (
            <div className="rounded-panel bg-kagit-2 px-6 py-14 text-center">
              <p className="font-baslik text-xl">Bu seçimlerle eşleşen ürün yok.</p>
              <p className="mt-2 text-murekkep-2">Bir filtreyi kaldırın ya da hepsini temizleyip baştan bakın.</p>
              <Link href={url({ tur: "temizle" })} className={dugmeSinifi({ tur: "ikincil", ek: "mt-6" })}>
                Filtreleri temizle
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FiltreGrubu({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return (
    <section className="py-5 first:pt-0" aria-label={baslik}>
      <h2 className="font-govde text-sm font-medium tracking-normal text-murekkep">{baslik}</h2>
      <ul role="list" className="mt-2 space-y-0.5">
        {children}
      </ul>
    </section>
  );
}

function SecimBaglantisi({
  href,
  secili,
  adet,
  ornek,
  children,
}: {
  href: string;
  secili: boolean;
  adet: number;
  ornek?: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        rel="nofollow"
        aria-current={secili ? "true" : undefined}
        className="group flex min-h-10 items-center gap-2.5 text-[0.9375rem] text-murekkep-2 hover:text-murekkep"
      >
        {ornek ? (
          <span
            className={`grid size-5 shrink-0 place-items-center rounded-full ${secili ? "ring-2 ring-orman ring-offset-2 ring-offset-kagit" : ""}`}
            style={{ backgroundColor: ornek, boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.14)" }}
          />
        ) : (
          <span
            className={`grid size-[1.125rem] shrink-0 place-items-center rounded-kucuk border ${
              secili ? "border-orman bg-orman text-kagit" : "border-cizgi-koyu bg-yuzey"
            }`}
          >
            {secili ? <IkonTamam size={12} weight="bold" /> : null}
          </span>
        )}
        <span className={secili ? "font-medium text-murekkep" : ""}>{children}</span>
        <span className="rakam ml-auto text-etiket text-murekkep-3">{adet}</span>
      </Link>
    </li>
  );
}
