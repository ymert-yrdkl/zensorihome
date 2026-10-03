import Link from "next/link";
import { yonetimGerekli } from "@/sunucu/yonetim";
import { mesajlariOku } from "@/sunucu/kayitlar";
import { OkunduDugmesi } from "./OkunduDugmesi";

export const metadata = { title: "Mesajlar" };

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "medium", timeStyle: "short" });

export default async function YonetimMesajlar() {
  await yonetimGerekli();
  const mesajlar = await mesajlariOku();
  const okunmamis = mesajlar.filter((m) => !m.okundu).length;

  return (
    <>
      <h1 className="baslik-2">Mesajlar</h1>
      <p className="mt-2 text-murekkep-2">
        İletişim formundan gelenler. {okunmamis ? `${okunmamis} okunmamış.` : "Hepsi okundu."}
      </p>
      {mesajlar.length === 0 ? (
        <p className="mt-6 rounded-panel bg-kagit-2 px-5 py-8 text-murekkep-2">Henüz mesaj yok.</p>
      ) : (
        <ul role="list" className="mt-6 space-y-4">
          {mesajlar.map((m) => (
            <li
              key={m.id}
              className={`rounded-panel border px-5 py-4 ${m.okundu ? "border-cizgi bg-kagit" : "border-orman/40 bg-yuzey"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {!m.okundu ? (
                      <span className="mr-2 inline-block size-2 rounded-full bg-orman align-middle" aria-label="Okunmamış" />
                    ) : null}
                    {m.konu} · {m.ad}
                  </p>
                  <p className="text-sm text-murekkep-2">
                    <a href={`mailto:${m.eposta}?subject=${encodeURIComponent(`Zensori Home: ${m.konu}`)}`} className="baglanti">
                      {m.eposta}
                    </a>
                    {m.siparisNo ? (
                      <>
                        {" "}
                        · Sipariş{" "}
                        <Link href={`/yonetim/siparisler/${m.siparisNo}`} className="baglanti rakam">
                          {m.siparisNo}
                        </Link>
                      </>
                    ) : null}
                    <span className="rakam"> · {tarihBicimi.format(new Date(m.tarih))}</span>
                  </p>
                </div>
                <OkunduDugmesi id={m.id} okundu={m.okundu} />
              </div>
              <p className="mt-3 whitespace-pre-line text-[0.9375rem]">{m.mesaj}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
