"use client";

// Yandan ya da üstten açılan panel. Native <dialog> kullanır: odak panel içinde kalır,
// Esc kapatır, arka plan tıklanamaz. Arka plana (karartma) tıklamak da kapatır.

import { useEffect, useRef } from "react";
import { IkonKapat } from "@/bilesenler/ikon";
import { simgeDugmeSinifi } from "./dugme";

type Props = {
  acik: boolean;
  kapat: () => void;
  baslik: string;
  taraf?: "sag" | "sol" | "ust";
  genislik?: string;
  basligiGizle?: boolean;
  children: React.ReactNode;
  alt?: React.ReactNode;
};

export function Cekmece({ acik, kapat, baslik, taraf = "sag", genislik, basligiGizle, children, alt }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (acik && !dialog.open) {
      dialog.showModal();
      // İçerikte işaretli bir alan varsa odak oraya (ör. arama kutusu), yoksa kapat düğmesine gider
      dialog.querySelector<HTMLElement>("[data-ilk-odak]")?.focus();
    }
    if (!acik && dialog.open) dialog.close();
  }, [acik]);

  return (
    <dialog
      ref={ref}
      className="cekmece"
      data-taraf={taraf}
      data-kilit=""
      aria-label={baslik}
      style={genislik ? ({ "--cekmece-genislik": genislik } as React.CSSProperties) : undefined}
      onClose={kapat}
      onClick={(olay) => {
        if (olay.target === ref.current) kapat();
      }}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className={`flex items-center justify-between gap-4 px-5 py-3 ${basligiGizle ? "" : "border-b border-cizgi"}`}>
          <h2 className={basligiGizle ? "sr-only" : "font-baslik text-xl"}>{baslik}</h2>
          <button type="button" onClick={kapat} className={`${simgeDugmeSinifi} -mr-2 ml-auto`} aria-label="Kapat">
            <IkonKapat size={22} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {alt ? <div className="border-t border-cizgi bg-yuzey">{alt}</div> : null}
      </div>
    </dialog>
  );
}
