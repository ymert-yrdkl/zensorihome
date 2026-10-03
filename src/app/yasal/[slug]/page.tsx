import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { YASAL_METINLER, yasalMetinBul } from "@/icerik/yasal";
import { SayfaBasi } from "@/bilesenler/liste/SayfaBasi";
import { MetinGovdesi } from "@/bilesenler/ui/Metin";

export function generateStaticParams() {
  return YASAL_METINLER.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/yasal/[slug]">): Promise<Metadata> {
  const metin = yasalMetinBul((await params).slug);
  if (!metin) return {};
  return { title: metin.baslik, description: metin.ozet };
}

export default async function YasalSayfa({ params }: PageProps<"/yasal/[slug]">) {
  const metin = yasalMetinBul((await params).slug);
  if (!metin) notFound();
  const [taslak, ...bolumler] = metin.bolumler;

  return (
    <>
      <SayfaBasi kirintilar={[{ ad: "Ana sayfa", href: "/" }, { ad: "Yasal" }, { ad: metin.kisaAd }]} baslik={metin.baslik} />
      <div className="kabuk grid grid-cols-1 gap-10 pb-24 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
        <article>
          <p className="text-sm text-murekkep-3">Son güncelleme: {metin.guncelleme}</p>
          {taslak ? (
            <p className="mt-4 max-w-[68ch] rounded-kontrol border border-cizgi bg-kagit-2 px-4 py-3 text-sm text-murekkep-2">
              {taslak.paragraflar.join(" ")}
            </p>
          ) : null}
          <MetinGovdesi>
            {bolumler.map((b) => (
              <section key={b.baslik}>
                <h2>{b.baslik}</h2>
                {b.paragraflar.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {b.maddeler?.length ? (
                  <ul>
                    {b.maddeler.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </MetinGovdesi>
        </article>
        <aside aria-label="Diğer yasal metinler">
          <nav className="lg:sticky lg:top-32">
            <p className="text-sm font-medium">Yasal metinler</p>
            <ul role="list" className="mt-3 space-y-1 text-[0.9375rem]">
              {YASAL_METINLER.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/yasal/${m.slug}`}
                    aria-current={m.slug === metin.slug ? "page" : undefined}
                    className={`inline-flex min-h-10 items-center ${m.slug === metin.slug ? "font-medium text-murekkep" : "text-murekkep-2 hover:text-murekkep"}`}
                  >
                    {m.kisaAd}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}
