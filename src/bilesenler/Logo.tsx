// Logo: markanın üç yapraklı filizi + "zensori" yazısı (logodaki harf karakterine en yakın aile: Literata).

export function Filiz({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 40" className={className} aria-hidden="true" focusable="false">
      <path d="M15.6 39 C15.8 32 15.2 25.5 13.4 18.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* üst yaprak */}
      <path d="M13.4 18.5 C10.4 12.6 12.2 5.6 17.6 1.8 C19.9 8 18.6 14.6 13.4 18.5 Z" fill="currentColor" />
      {/* sol yaprak */}
      <path d="M14.6 25.8 C9.4 26.4 4.6 23 2.6 17.4 C8.6 16.6 13.2 20 14.6 25.8 Z" fill="currentColor" />
      {/* sağ yaprak */}
      <path d="M15.2 26.6 C17.2 21.4 22.4 18.4 28.4 19 C26.4 24.6 21 27.6 15.2 26.6 Z" fill="currentColor" />
      <path
        d="M13.9 16.6 C14.6 12 15.6 7.6 17.2 4.2 M13.9 24.6 C10.8 22.6 7.6 20.6 4.8 18.6 M16.2 25.6 C19.6 23.8 22.8 21.6 26.2 20.2"
        fill="none"
        stroke="var(--color-kagit)"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function Logo({ ters = false }: { ters?: boolean }) {
  return (
    <span
      className={`inline-flex items-end gap-[0.25em] text-[1.35rem] leading-none sm:text-[1.6rem] ${ters ? "text-kagit" : "text-orman"}`}
    >
      <Filiz className="h-[1.25em] w-auto -mb-[0.08em] shrink-0" />
      <span className="font-baslik font-bold tracking-[-0.02em]">zensori</span>
      <span className={`font-baslik font-normal tracking-[-0.02em] ${ters ? "text-krem-soluk" : "text-murekkep-3"}`}>home</span>
    </span>
  );
}
