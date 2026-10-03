"use client";

import { usePathname } from "next/navigation";

// Mağaza başlığı, altbilgisi ve sepet çekmecesi yönetim panelinde gösterilmez.
export function YalnizMagazada({ children }: { children: React.ReactNode }) {
  const yol = usePathname();
  if (yol.startsWith("/yonetim")) return null;
  return children;
}
