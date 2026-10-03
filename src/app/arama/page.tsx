import type { Metadata } from "next";
import Link from "next/link";
import { ara, filtreOku, kategoriler } from "@/katalog/katalog";
import { SayfaBasi } from "@/bilesenler/liste/SayfaBasi";
import { UrunListesi } from "@/bilesenler/liste/UrunListesi";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";

export const metadata: Metadata = { title: "Arama", robots: { index: false } };

export default async function AramaSayfasi({ searchParams }: PageProps<"/arama">) {
  const parametreler = await searchParams;
  const sorgu = typeof parametreler.q === "string" ? parametreler.q.trim().slice(0, 80) : "";
  const filtre = filtreOku(parametreler);
  const sonuclar = sorgu ? ara(sorgu) : [];

  return (
    <>
      <SayfaBasi
        kirintilar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Arama" }]}
        baslik={sorgu ? `“${sorgu}”` : "Arama"}
        ozet={sorgu ? `${sonuclar.length} ürün bulundu.` : "Aramak istediğiniz ürünü yazın."}
        ek={
          <form action="/arama" role="search" className="mt-6 flex max-w-xl gap-2">
            <label htmlFor="arama-sayfa" className="sr-only">
              Ürün ara
            </label>
            <input
              id="arama-sayfa"
              name="q"
              type="search"
              defaultValue={sorgu}
              placeholder="Vazo, mum, ekose tabak…"
              className="h-12 min-w-0 flex-1 rounded-kontrol border border-cizgi-koyu bg-yuzey px-4"
            />
            <button className={dugmeSinifi()}>Ara</button>
          </form>
        }
      />
      {sorgu && sonuclar.length === 0 ? (
        <div className="kabuk pb-20">
          <div className="rounded-panel bg-kagit-2 px-6 py-12">
            <p className="font-baslik text-xl">“{sorgu}” ile eşleşen ürün bulamadık.</p>
            <p className="mt-2 text-murekkep-2">Daha kısa bir kelime deneyin ya da bir kategoriye göz atın:</p>
            <ul role="list" className="mt-5 flex flex-wrap gap-2">
              {kategoriler.map((k) => (
                <li key={k.slug}>
                  <Link href={`/kategori/${k.slug}`} className={dugmeSinifi({ tur: "ikincil", boy: "k" })}>
                    {k.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : sorgu ? (
        <UrunListesi temelYol="/arama" urunler={sonuclar} filtre={filtre} kategoriFiltresi sorgu={sorgu} />
      ) : null}
    </>
  );
}
