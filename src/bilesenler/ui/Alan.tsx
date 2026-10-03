// Form alanı: etiket üstte, yardım ya da hata altta (satır yüksekliği sabit, sayfa zıplamaz).

import { useId } from "react";

const GIRIS =
  "w-full rounded-kontrol border bg-yuzey px-4 text-base text-murekkep transition-[border-color,box-shadow] duration-150 " +
  "placeholder:text-murekkep-3 hover:border-murekkep focus:border-orman focus:outline-none focus:ring-2 focus:ring-orman/25 " +
  "aria-invalid:border-hata aria-invalid:focus:ring-hata/20";

type Ortak = {
  etiket: string;
  ad: string;
  hata?: string;
  yardim?: string;
  istege?: boolean;
  ek?: string;
};

function AlanCercevesi({
  etiket,
  kimlik,
  hata,
  yardim,
  istege,
  ek,
  children,
}: Ortak & { kimlik: string; children: React.ReactNode }) {
  return (
    <div className={ek}>
      <label htmlFor={kimlik} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-murekkep">
        {etiket}
        {istege ? <span className="text-etiket font-normal text-murekkep-3">İsteğe bağlı</span> : null}
      </label>
      {children}
      <p
        id={`${kimlik}-not`}
        className={`mt-1.5 min-h-[1lh] text-sm ${hata ? "text-hata" : "text-murekkep-3"}`}
        role={hata ? "alert" : undefined}
      >
        {hata ?? yardim ?? ""}
      </p>
    </div>
  );
}

export function Alan({
  etiket,
  ad,
  hata,
  yardim,
  istege,
  ek,
  ...girdi
}: Ortak & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">) {
  const kimlik = useId();
  return (
    <AlanCercevesi etiket={etiket} ad={ad} kimlik={kimlik} hata={hata} yardim={yardim} istege={istege} ek={ek}>
      <input
        id={kimlik}
        name={ad}
        aria-invalid={hata ? true : undefined}
        aria-describedby={`${kimlik}-not`}
        required={!istege}
        className={`${GIRIS} h-12`}
        {...girdi}
      />
    </AlanCercevesi>
  );
}

export function UzunAlan({
  etiket,
  ad,
  hata,
  yardim,
  istege,
  ek,
  ...girdi
}: Ortak & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name">) {
  const kimlik = useId();
  return (
    <AlanCercevesi etiket={etiket} ad={ad} kimlik={kimlik} hata={hata} yardim={yardim} istege={istege} ek={ek}>
      <textarea
        id={kimlik}
        name={ad}
        aria-invalid={hata ? true : undefined}
        aria-describedby={`${kimlik}-not`}
        required={!istege}
        rows={3}
        className={`${GIRIS} min-h-24 resize-y py-3`}
        {...girdi}
      />
    </AlanCercevesi>
  );
}

export function Secim({
  etiket,
  ad,
  hata,
  yardim,
  istege,
  ek,
  secenekler,
  bosMetin,
  ...girdi
}: Ortak & { secenekler: readonly string[]; bosMetin: string } & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name">) {
  const kimlik = useId();
  return (
    <AlanCercevesi etiket={etiket} ad={ad} kimlik={kimlik} hata={hata} yardim={yardim} istege={istege} ek={ek}>
      <select
        id={kimlik}
        name={ad}
        aria-invalid={hata ? true : undefined}
        aria-describedby={`${kimlik}-not`}
        required={!istege}
        className={`${GIRIS} h-12 pr-10`}
        {...girdi}
      >
        <option value="">{bosMetin}</option>
        {secenekler.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </AlanCercevesi>
  );
}
