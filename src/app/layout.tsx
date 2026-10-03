import type { Metadata, Viewport } from "next";
import { Albert_Sans, Literata } from "next/font/google";
import "./globals.css";
import { Ust } from "@/bilesenler/duzen/Ust";
import { Alt } from "@/bilesenler/duzen/Alt";
import { SepetCekmecesi } from "@/bilesenler/sepet/SepetCekmecesi";
import { SepetSaglayici } from "@/istemci/sepet";
import { YalnizMagazada } from "@/bilesenler/duzen/YalnizMagazada";
import { kategoriler, koleksiyonKapagi, koleksiyonlar } from "@/katalog/katalog";
import { MAGAZA } from "@/magaza/ayarlar";
import { tl } from "@/magaza/para";

const literata = Literata({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-literata",
  display: "swap",
});

const albert = Albert_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-albert",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(MAGAZA.siteAdresi),
  title: {
    default: "Zensori Home | Vazo, mum ve sunum tabakları",
    template: "%s | Zensori Home",
  },
  description:
    "Zen felsefesinden ilham alan ev dekorasyonu ve mutfak ürünleri: cam bonbon vazolar, el yapımı seramikler, kokusuz mumlar ve mango ağacı sunum tabakları.",
  applicationName: "Zensori Home",
  openGraph: { type: "website", locale: "tr_TR", siteName: "Zensori Home" },
  robots: MAGAZA.demo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#f8f4ec",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const menuKoleksiyonlari = koleksiyonlar.map((k) => ({ ...k, gorsel: koleksiyonKapagi(k.slug) }));
  return (
    <html lang="tr" className={`${literata.variable} ${albert.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#icerik"
          className="fixed left-4 top-2 z-[600] -translate-y-24 rounded-kontrol bg-orman px-4 py-3 text-kagit transition-transform focus-visible:translate-y-0"
        >
          İçeriğe geç
        </a>
        <SepetSaglayici>
          <YalnizMagazada>
            <p className="bg-orman px-4 py-2 text-center text-etiket text-kagit">
              {tl(MAGAZA.ucretsizKargoEsigi)} ve üzeri siparişlerde kargo ücretsiz
              <span className="hidden sm:inline">. Siparişler {MAGAZA.kargoyaVerilis} içinde kargoda.</span>
            </p>
            <Ust kategoriler={kategoriler.map(({ slug, ad }) => ({ slug, ad }))} koleksiyonlar={menuKoleksiyonlari} />
          </YalnizMagazada>
          <main id="icerik" className="flex flex-1 flex-col">
            {children}
          </main>
          <YalnizMagazada>
            <Alt />
            <SepetCekmecesi />
          </YalnizMagazada>
        </SepetSaglayici>
      </body>
    </html>
  );
}
