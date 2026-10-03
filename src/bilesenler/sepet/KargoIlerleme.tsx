import { IkonKargo } from "@/bilesenler/ikon";
import { MAGAZA } from "@/magaza/ayarlar";
import { tl } from "@/magaza/para";

// Ücretsiz kargoya kalan tutar ve ilerleme çizgisi
export function KargoIlerleme({ araToplam }: { araToplam: number }) {
  const esik = MAGAZA.ucretsizKargoEsigi;
  const kalan = Math.max(0, esik - araToplam);
  const oran = Math.min(1, araToplam / esik);
  return (
    <div className="rounded-kontrol bg-kagit-2 px-4 py-3">
      <p className="flex items-center gap-2 text-sm">
        <IkonKargo size={18} className="shrink-0 text-orman" />
        {kalan === 0 ? (
          <span>Kargo ücretsiz.</span>
        ) : (
          <span>
            Ücretsiz kargo için <strong className="rakam font-medium">{tl(kalan)}</strong> daha ekleyin.
          </span>
        )}
      </p>
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-cizgi" aria-hidden="true">
        <div
          className="h-full origin-left rounded-full bg-orman transition-transform duration-500 ease-cikis"
          style={{ transform: `scaleX(${oran})` }}
        />
      </div>
    </div>
  );
}
