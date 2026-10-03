// Uzun metin sayfaları için ortak yazı düzeni (yasal metinler, kargo ve iade)
export function MetinGovdesi({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[68ch] text-[1.0625rem] leading-[1.7] text-murekkep-2 [&_a]:text-murekkep [&_a]:underline [&_a]:decoration-cizgi-koyu [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:font-baslik [&_h2]:text-2xl [&_h2]:text-murekkep [&_h3]:mt-8 [&_h3]:font-govde [&_h3]:text-base [&_h3]:font-medium [&_h3]:tracking-normal [&_h3]:text-murekkep [&_li]:mt-1.5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:font-medium [&_strong]:text-murekkep [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </div>
  );
}
