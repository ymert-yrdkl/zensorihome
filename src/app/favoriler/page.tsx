import type { Metadata } from "next";
import { SayfaBasi } from "@/bilesenler/liste/SayfaBasi";
import { FavoriListesi } from "./FavoriListesi";

export const metadata: Metadata = { title: "Favorilerim", robots: { index: false } };

export default function Favoriler() {
  return (
    <>
      <SayfaBasi kirintilar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Favorilerim" }]} baslik="Favorilerim" />
      <div className="kabuk pb-24">
        <FavoriListesi />
      </div>
    </>
  );
}
