import Link from "next/link";
import { yonetimGerekli } from "@/sunucu/yonetim";
import { siparisleriOku } from "@/sunucu/kayitlar";
import { DURUM_ADI, type SiparisDurumu } from "@/sunucu/siparis-tipi";
import { katla } from "@/katalog/katla";
import { tl } from "@/magaza/para";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { DurumRozeti } from "../DurumRozeti";

export const metadata = { title: "Siparişler" };

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "medium", timeStyle: "short" });

const FILTRELER: { deger: string; ad: string }[] = [
  { deger: "", ad: "Tümü" },
  { deger: "bekleyen", ad: "İşlem bekleyen" },
  ...(Object.keys(DURUM_ADI) as SiparisDurumu[]).map((d) => ({ deger: d, ad: DURUM_ADI[d] })),
];

export default async function YonetimSiparisler({ searchParams }: PageProps<"/yonetim/siparisler">) {
  await yonetimGerekli();
  const p = await searchParams;
  const durum = typeof p.durum === "string" ? p.durum : "";
  const sorgu = typeof p.q === "string" ? p.q.trim() : "";
  const tumu = await siparisleriOku();

  const liste = tumu.filter((s) => {
    if (durum === "bekleyen" && !(s.durum === "odeme-bekleniyor" || s.durum === "hazirlaniyor")) return false;
    if (durum && durum !== "bekleyen" && s.durum !== durum) return false;
    if (sorgu) {
      const metin = katla(`${s.no} ${s.musteri.ad} ${s.musteri.soyad} ${s.musteri.eposta} ${s.musteri.telefon} ${s.teslimat.il}`);
      if (
        !katla(sorgu)
          .split(" ")
          .every((k) => metin.includes(k))
      )
        return false;
    }
    return true;
  });

  const adres = (yeniDurum: string) => {
    const q = new URLSearchParams();
    if (yeniDurum) q.set("durum", yeniDurum);
    if (sorgu) q.set("q", sorgu);
    return `/yonetim/siparisler${q.size ? `?${q}` : ""}`;
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="baslik-2">Siparişler</h1>
        <form className="flex gap-2" role="search">
          {durum ? <input type="hidden" name="durum" value={durum} /> : null}
          <label htmlFor="siparis-ara" className="sr-only">
            Sipariş ara
          </label>
          <input
            id="siparis-ara"
            name="q"
            type="search"
            defaultValue={sorgu}
            placeholder="No, ad, telefon, il"
            className="h-10 w-64 min-w-0 rounded-kontrol border border-cizgi-koyu bg-yuzey px-3 text-sm"
          />
          <button className={dugmeSinifi({ tur: "ikincil", boy: "k" })}>Ara</button>
        </form>
      </div>

      <nav aria-label="Durum filtresi" className="mt-5 flex flex-wrap gap-2">
        {FILTRELER.map((f) => (
          <Link
            key={f.deger || "tumu"}
            href={adres(f.deger)}
            aria-current={durum === f.deger ? "true" : undefined}
            className={`inline-flex h-9 items-center rounded-full border px-4 text-sm ${
              durum === f.deger ? "border-murekkep bg-murekkep text-kagit" : "border-cizgi hover:border-murekkep"
            }`}
          >
            {f.ad}
          </Link>
        ))}
      </nav>

      <p className="rakam mt-5 text-sm text-murekkep-2">{liste.length} sipariş</p>
      {liste.length === 0 ? (
        <p className="mt-3 rounded-panel bg-kagit-2 px-5 py-8 text-murekkep-2">Bu filtreyle sipariş yok.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-panel border border-cizgi bg-yuzey">
          <table className="w-full min-w-[46rem] text-left text-[0.9375rem]">
            <thead className="border-b border-cizgi text-sm text-murekkep-3">
              <tr>
                <th className="px-4 py-3 font-normal">Sipariş</th>
                <th className="px-4 py-3 font-normal">Müşteri</th>
                <th className="px-4 py-3 font-normal">Ödeme</th>
                <th className="px-4 py-3 text-right font-normal">Tutar</th>
                <th className="px-4 py-3 font-normal">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cizgi">
              {liste.map((s) => (
                <tr key={s.no} className="hover:bg-kagit-2">
                  <td className="px-4 py-3">
                    <Link
                      href={`/yonetim/siparisler/${s.no}`}
                      className="rakam font-medium underline decoration-cizgi-koyu underline-offset-4 hover:decoration-murekkep"
                    >
                      {s.no}
                    </Link>
                    <span className="rakam block text-sm text-murekkep-3">{tarihBicimi.format(new Date(s.tarih))}</span>
                  </td>
                  <td className="px-4 py-3">
                    {s.musteri.ad} {s.musteri.soyad}
                    <span className="block text-sm text-murekkep-3">
                      {s.teslimat.ilce} / {s.teslimat.il}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{s.odeme === "havale" ? "Havale / EFT" : "Kapıda ödeme"}</td>
                  <td className="rakam px-4 py-3 text-right">{tl(s.toplam)}</td>
                  <td className="px-4 py-3">
                    <DurumRozeti durum={s.durum} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
