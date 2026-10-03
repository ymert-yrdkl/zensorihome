import { tl } from "@/magaza/para";

// Fiyat gösterimi. İndirim varsa eski fiyat üstü çizili ve fark TL olarak yazılır (yüzde değil).
export function Fiyat({
  fiyat,
  eskiFiyat,
  baslangic = false,
  boy = "normal",
}: {
  fiyat: number;
  eskiFiyat?: number;
  baslangic?: boolean;
  boy?: "normal" | "buyuk";
}) {
  const buyuk = boy === "buyuk";
  return (
    <span className={`rakam inline-flex flex-wrap items-baseline gap-x-2 ${buyuk ? "text-2xl" : "text-[0.9375rem]"}`}>
      <span className={buyuk ? "font-medium" : ""}>
        {tl(fiyat)}
        {baslangic ? <span className="text-etiket text-murekkep-3">’den başlayan</span> : null}
      </span>
      {eskiFiyat && eskiFiyat > fiyat ? (
        <>
          <s className={`text-murekkep-3 ${buyuk ? "text-base" : "text-sm"}`}>
            <span className="sr-only">Önceki fiyat </span>
            {tl(eskiFiyat)}
          </s>
          {buyuk ? <span className="text-sm text-orman">{tl(eskiFiyat - fiyat)} indirim</span> : null}
        </>
      ) : null}
    </span>
  );
}
