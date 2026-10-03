import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { filtreOku, kategoriBul, kategoriler, urunler } from "@/katalog/katalog";
import { SayfaBasi } from "@/bilesenler/liste/SayfaBasi";
import { UrunListesi } from "@/bilesenler/liste/UrunListesi";

export function generateStaticParams() {
  return kategoriler.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kategori/[slug]">): Promise<Metadata> {
  const kategori = kategoriBul((await params).slug);
  if (!kategori) return {};
  return { title: kategori.ad, description: kategori.ozet };
}

export default async function KategoriSayfasi({ params, searchParams }: PageProps<"/kategori/[slug]">) {
  const kategori = kategoriBul((await params).slug);
  if (!kategori) notFound();
  const filtre = filtreOku(await searchParams);
  return (
    <>
      <SayfaBasi
        kirintilar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Tüm ürünler", href: "/urunler" }, { ad: kategori.ad }]}
        baslik={kategori.ad}
        ozet={kategori.ozet}
      />
      <UrunListesi
        temelYol={`/kategori/${kategori.slug}`}
        urunler={urunler.filter((u) => u.kategori === kategori.slug)}
        filtre={{ ...filtre, kategori: undefined }}
      />
    </>
  );
}
