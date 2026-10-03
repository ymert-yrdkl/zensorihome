import type { Metadata } from "next";
import Link from "next/link";
import { Filiz } from "@/bilesenler/Logo";
import { oturumGecerliMi } from "@/sunucu/yonetim";
import { cikisYap } from "@/sunucu/yonetim-eylemleri";
import { YonetimMenusu } from "./YonetimMenusu";

export const metadata: Metadata = {
  title: { default: "Yönetim", template: "%s | Yönetim | Zensori Home" },
  robots: { index: false, follow: false },
};

export default async function YonetimDuzeni({ children }: LayoutProps<"/yonetim">) {
  const girisli = await oturumGecerliMi();
  return (
    <div className="flex min-h-dvh flex-col bg-kagit">
      <header className="border-b border-cizgi bg-yuzey">
        <div className="kabuk flex min-h-14 flex-wrap items-center gap-x-6 gap-y-1 py-1.5">
          <Link href="/yonetim" className="flex items-center gap-2 text-orman">
            <Filiz className="h-6 w-auto" />
            <span className="font-baslik text-lg font-bold">zensori</span>
            <span className="text-sm text-murekkep-3">yönetim</span>
          </Link>
          {girisli ? (
            <div className="order-last w-full sm:order-none sm:w-auto">
              <YonetimMenusu />
            </div>
          ) : null}
          <div className="ml-auto flex items-center gap-4 text-sm">
            <Link href="/" className="text-murekkep-2 hover:text-murekkep hover:underline hover:underline-offset-4">
              Siteye dön
            </Link>
            {girisli ? (
              <form action={cikisYap}>
                <button className="min-h-10 text-murekkep-2 hover:text-murekkep hover:underline hover:underline-offset-4">
                  Çıkış
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </header>
      <div className="kabuk flex-1 py-8">{children}</div>
    </div>
  );
}
