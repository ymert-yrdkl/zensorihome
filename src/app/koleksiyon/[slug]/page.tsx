import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { filtreOku, kapakGorseli, koleksiyonBul, koleksiyonlar, urunler } from "@/katalog/katalog";
import { UrunListesi } from "@/bilesenler/liste/UrunListesi";

export function generateStaticParams() {
  return koleksiyonlar.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: PageProps<"/koleksiyon/[slug]">): Promise<Metadata> {
  const koleksiyon = koleksiyonBul((await params).slug);
  if (!koleksiyon) return {};
  return { title: koleksiyon.ad, description: koleksiyon.ozet };
}

export default async function KoleksiyonSayfasi({ params, searchParams }: PageProps<"/koleksiyon/[slug]">) {
  const koleksiyon = koleksiyonBul((await params).slug);
  if (!koleksiyon) notFound();
  const filtre = filtreOku(await searchParams);
  const liste = urunler.filter((u) => u.koleksiyonlar.includes(koleksiyon.slug));
  const kapak = kapakGorseli(koleksiyon.slug);
  const digerleri = koleksiyonlar.filter((k) => k.slug !== koleksiyon.slug);

  return (
    <>
      <section className="kabuk grid grid-cols-1 items-end gap-8 pb-10 pt-8 lg:grid-cols-12 lg:gap-12 lg:pb-14 lg:pt-12">
        <div className="lg:col-span-5">
          <nav aria-label="Konum">
            <ol className="flex flex-wrap items-center gap-x-2 text-sm text-murekkep-3">
              <li>
                <Link href="/" className="hover:text-murekkep hover:underline hover:underline-offset-4">
                  Ana sayfa
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>Koleksiyonlar</li>
            </ol>
          </nav>
          <h1 className="baslik-1 mt-4">{koleksiyon.ad}</h1>
          <p className="giris-metni mt-5">{koleksiyon.ozet}</p>
          <p className="rakam mt-6 text-sm text-murekkep-3">{liste.length} ürün</p>
          <ul role="list" className="mt-8 flex flex-wrap gap-2">
            {digerleri.map((k) => (
              <li key={k.slug}>
                <Link
                  href={`/koleksiyon/${k.slug}`}
                  className="inline-flex h-9 items-center rounded-full border border-cizgi px-4 text-sm hover:border-murekkep"
                >
                  {k.ad}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-kucuk lg:col-span-7"
          style={{ backgroundColor: kapak.renk }}
        >
          <Image
            src={kapak.src}
            alt={`${koleksiyon.ad} koleksiyonundan bir görünüm`}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
            preload
          />
        </div>
      </section>
      <UrunListesi temelYol={`/koleksiyon/${koleksiyon.slug}`} urunler={liste} filtre={{ ...filtre, kategori: undefined }} />
    </>
  );
}
