import type { Metadata } from "next";
import { filtreOku, urunler } from "@/katalog/katalog";
import { SayfaBasi } from "@/bilesenler/liste/SayfaBasi";
import { UrunListesi } from "@/bilesenler/liste/UrunListesi";

export const metadata: Metadata = {
  title: "Tüm ürünler",
  description:
    "Zensori Home’un bütün ürünleri: cam ve seramik vazolar, kokusuz mumlar, mango ağacı sunum tabakları, cam yağdanlıklar.",
};

export default async function TumUrunler({ searchParams }: PageProps<"/urunler">) {
  const filtre = filtreOku(await searchParams);
  return (
    <>
      <SayfaBasi
        kirintilar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Tüm ürünler" }]}
        baslik="Tüm ürünler"
        ozet="Vazolar, mumlar, sunum tabakları ve mutfak için cam yağdanlıklar. Renk, fiyat ya da malzemeye göre daraltabilirsiniz."
      />
      <UrunListesi temelYol="/urunler" urunler={urunler} filtre={filtre} kategoriFiltresi />
    </>
  );
}
