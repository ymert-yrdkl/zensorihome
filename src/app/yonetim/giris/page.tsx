import { redirect } from "next/navigation";
import { oturumGecerliMi, yonetimSifresi } from "@/sunucu/yonetim";
import { GirisFormu } from "./GirisFormu";

export const metadata = { title: "Giriş" };

export default async function YonetimGiris() {
  if (await oturumGecerliMi()) redirect("/yonetim");
  const acik = Boolean(yonetimSifresi());
  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="baslik-2">Yönetim girişi</h1>
      {acik ? (
        <>
          <p className="mt-3 text-murekkep-2">Siparişleri ve mesajları görmek için yönetici şifresini yazın.</p>
          <GirisFormu />
        </>
      ) : (
        <div className="mt-6 rounded-panel border border-cizgi bg-yuzey px-5 py-5 text-[0.9375rem] text-murekkep-2">
          <p className="font-medium text-murekkep">Panel kapalı.</p>
          <p className="mt-2">
            Sunucuda <code className="rounded-kucuk bg-kagit-2 px-1.5 py-0.5 text-sm">YONETICI_SIFRE</code> ortam değişkeni
            tanımlı değil. Coolify › zensorihome › Environment Variables bölümüne en az 8 karakterlik bir şifre ekleyip uygulamayı
            yeniden başlatın.
          </p>
        </div>
      )}
    </div>
  );
}
