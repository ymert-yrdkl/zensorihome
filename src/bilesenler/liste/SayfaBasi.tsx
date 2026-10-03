import Link from "next/link";

export type Kirinti = { ad: string; href?: string };

// Sayfa başlığı: kırıntı yolu + başlık + kısa açıklama
export function SayfaBasi({
  kirintilar,
  baslik,
  ozet,
  ek,
}: {
  kirintilar: Kirinti[];
  baslik: string;
  ozet?: string;
  ek?: React.ReactNode;
}) {
  return (
    <div className="kabuk pb-8 pt-8 lg:pb-10 lg:pt-12">
      <nav aria-label="Konum">
        <ol className="flex flex-wrap items-center gap-x-2 text-sm text-murekkep-3">
          {kirintilar.map((k, i) => (
            <li key={k.ad} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden="true">/</span> : null}
              {k.href ? (
                <Link href={k.href} className="hover:text-murekkep hover:underline hover:underline-offset-4">
                  {k.ad}
                </Link>
              ) : (
                <span aria-current="page" className="text-murekkep-2">
                  {k.ad}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <h1 className="baslik-2 max-w-[18ch]">{baslik}</h1>
        {ozet ? <p className="max-w-[52ch] text-murekkep-2 lg:text-right">{ozet}</p> : null}
      </div>
      {ek}
    </div>
  );
}
