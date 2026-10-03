"use client";

import { useTransition } from "react";
import { mesajOkunduYap } from "@/sunucu/yonetim-eylemleri";
import { dugmeSinifi } from "@/bilesenler/ui/dugme";

export function OkunduDugmesi({ id, okundu }: { id: string; okundu: boolean }) {
  const [bekliyor, baslat] = useTransition();
  return (
    <button
      type="button"
      disabled={bekliyor}
      onClick={() => baslat(() => mesajOkunduYap(id, !okundu))}
      className={dugmeSinifi({ tur: "ikincil", boy: "k" })}
    >
      {okundu ? "Okunmadı yap" : "Okundu"}
    </button>
  );
}
