import { DURUM_ADI, type SiparisDurumu } from "@/sunucu/siparis-tipi";

const RENK: Record<SiparisDurumu, string> = {
  "odeme-bekleniyor": "bg-kagit-3 text-murekkep",
  hazirlaniyor: "bg-adacayi text-orman-koyu",
  kargoda: "bg-orman text-kagit",
  "teslim-edildi": "bg-gece text-kagit",
  iptal: "bg-hata-zemin text-hata",
};

export function DurumRozeti({ durum }: { durum: SiparisDurumu }) {
  return (
    <span className={`inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-etiket font-medium ${RENK[durum]}`}>
      {DURUM_ADI[durum]}
    </span>
  );
}
