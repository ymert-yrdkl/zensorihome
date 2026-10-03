import Link from "next/link";
import { yonetimGerekli } from "@/sunucu/yonetim";
import { mesajlariOku, siparisleriOku } from "@/sunucu/kayitlar";
import { tl } from "@/magaza/para";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";
import { DurumRozeti } from "./DurumRozeti";

export const metadata = { title: { absolute: "Özet | Yönetim | Zensori Home" } };

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function YonetimOzet() {
  await yonetimGerekli();
  const [siparisler, mesajlar] = await Promise.all([siparisleriOku(), mesajlariOku()]);
  const aktif = siparisler.filter((s) => s.durum !== "iptal");
  const bekleyen = siparisler.filter((s) => s.durum === "odeme-bekleniyor" || s.durum === "hazirlaniyor");
  const okunmamis = mesajlar.filter((m) => !m.okundu);
  const bugun = new Date().toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" });
  const bugunku = aktif.filter((s) => new Date(s.tarih).toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" }) === bugun);

  const kutular = [
    { ad: "İşlem bekleyen sipariş", deger: String(bekleyen.length), href: "/yonetim/siparisler?durum=bekleyen" },
    { ad: "Bugünkü sipariş", deger: String(bugunku.length), href: "/yonetim/siparisler" },
    { ad: "Toplam ciro (iptaller hariç)", deger: tl(aktif.reduce((t, s) => t + s.toplam, 0)), href: "/yonetim/siparisler" },
    { ad: "Okunmamış mesaj", deger: String(okunmamis.length), href: "/yonetim/mesajlar" },
  ];

  return (
    <>
      <h1 className="baslik-2">Özet</h1>
      <ul
        role="list"
        className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-cizgi bg-cizgi lg:grid-cols-4"
      >
        {kutular.map((k) => (
          <li key={k.ad} className="bg-yuzey">
            <Link href={k.href} className="block px-5 py-5 hover:bg-kagit-2">
              <span className="block text-sm text-murekkep-2">{k.ad}</span>
              <span className="rakam mt-1 block font-baslik text-3xl">{k.deger}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-end justify-between gap-4">
        <h2 className="baslik-3">Son siparişler</h2>
        <Link href="/yonetim/siparisler" className={dugmeSinifi({ tur: "metin" })}>
          Tümü
        </Link>
      </div>
      {siparisler.length === 0 ? (
        <p className="mt-4 rounded-panel bg-kagit-2 px-5 py-8 text-murekkep-2">Henüz sipariş yok.</p>
      ) : (
        <ul role="list" className="mt-4 divide-y divide-cizgi rounded-panel border border-cizgi bg-yuzey">
          {siparisler.slice(0, 8).map((s) => (
            <li key={s.no}>
              <Link
                href={`/yonetim/siparisler/${s.no}`}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-5 py-3 hover:bg-kagit-2 sm:grid-cols-[10rem_minmax(0,1fr)_8rem_auto]"
              >
                <span className="rakam font-medium">{s.no}</span>
                <span className="truncate text-murekkep-2">
                  {s.musteri.ad} {s.musteri.soyad} · {s.teslimat.il}
                </span>
                <span className="rakam text-sm text-murekkep-3">{tarihBicimi.format(new Date(s.tarih))}</span>
                <span className="flex items-center justify-end gap-3">
                  <span className="rakam">{tl(s.toplam)}</span>
                  <DurumRozeti durum={s.durum} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
