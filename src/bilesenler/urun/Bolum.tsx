"use client";

// Ürün sayfasındaki açılır bilgi bölümü (<details>). İstemci bileşeni olarak tanımlı: sunucudan dizi
// içinde gönderildiğinde anahtarı (key) korunur.
export function Bolum({ baslik, acik = false, children }: { baslik: string; acik?: boolean; children: React.ReactNode }) {
  return (
    <details open={acik} className="group border-b border-cizgi">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
        {baslik}
        <span aria-hidden="true" className="relative size-3.5 shrink-0">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-murekkep" />
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-murekkep transition-transform duration-200 group-open:scale-y-0" />
        </span>
      </summary>
      <div className="pb-5 text-[0.9375rem] text-murekkep-2">{children}</div>
    </details>
  );
}
