// Düğme sınıfları: <button>, <Link> ve <a> aynı görünümü paylaşır.

type DugmeTuru = "birincil" | "ikincil" | "acik" | "metin";
type DugmeBoyu = "k" | "o" | "b";

const TEMEL =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none " +
  "transition-[background-color,color,border-color,transform] duration-150 ease-cikis " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55";

const TURLER: Record<DugmeTuru, string> = {
  birincil: "rounded-kontrol bg-orman text-kagit hover:bg-orman-koyu",
  ikincil: "rounded-kontrol border border-cizgi-koyu bg-saydam text-murekkep hover:border-murekkep hover:bg-kagit-2",
  acik: "rounded-kontrol bg-kagit text-murekkep hover:bg-kagit-2",
  metin: "text-murekkep underline decoration-1 underline-offset-4 decoration-cizgi-koyu hover:decoration-murekkep",
};

const BOYLAR: Record<DugmeBoyu, string> = {
  k: "h-10 px-4 text-sm",
  o: "h-12 px-6 text-[0.9375rem]",
  b: "h-14 px-8 text-base",
};

export function dugmeSinifi({
  tur = "birincil",
  boy = "o",
  tam = false,
  ek = "",
}: { tur?: DugmeTuru; boy?: DugmeBoyu; tam?: boolean; ek?: string } = {}) {
  const boyut = tur === "metin" ? "min-h-11 text-[0.9375rem]" : BOYLAR[boy];
  return [TEMEL, TURLER[tur], boyut, tam ? "w-full" : "", ek].filter(Boolean).join(" ");
}

// Simge düğmesi (44px dokunma hedefi)
export const simgeDugmeSinifi =
  "relative inline-grid size-11 place-items-center rounded-full text-murekkep transition-colors duration-150 hover:bg-kagit-2";
