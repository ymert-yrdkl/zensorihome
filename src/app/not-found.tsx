import Link from "next/link";
import { kategoriler } from "@/katalog/katalog";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";

export default function Bulunamadi() {
  return (
    <div className="kabuk flex flex-1 flex-col justify-center py-24">
      <p className="rakam text-sm text-murekkep-3">404</p>
      <h1 className="baslik-1 mt-3 max-w-[16ch]">Aradığınız sayfa burada değil.</h1>
      <p className="giris-metni mt-5">
        Bağlantı eskimiş ya da ürün katalogdan kalkmış olabilir. Aramayı deneyin ya da bir kategoriden devam edin.
      </p>
      <form action="/arama" role="search" className="mt-8 flex max-w-md gap-2">
        <label htmlFor="bulunamadi-ara" className="sr-only">
          Ürün ara
        </label>
        <input
          id="bulunamadi-ara"
          name="q"
          type="search"
          placeholder="Vazo, mum, tabak…"
          className="h-12 min-w-0 flex-1 rounded-kontrol border border-cizgi-koyu bg-yuzey px-4"
        />
        <button className={dugmeSinifi()}>Ara</button>
      </form>
      <ul role="list" className="mt-8 flex flex-wrap gap-2">
        {kategoriler.map((k) => (
          <li key={k.slug}>
            <Link href={`/kategori/${k.slug}`} className={dugmeSinifi({ tur: "ikincil", boy: "k" })}>
              {k.ad}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
