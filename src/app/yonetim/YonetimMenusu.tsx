"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BAGLANTILAR = [
  { href: "/yonetim", ad: "Özet" },
  { href: "/yonetim/siparisler", ad: "Siparişler" },
  { href: "/yonetim/mesajlar", ad: "Mesajlar" },
];

export function YonetimMenusu() {
  const yol = usePathname();
  return (
    <nav aria-label="Yönetim" className="-ml-3 flex items-center gap-1 sm:ml-0">
      {BAGLANTILAR.map((b) => {
        const aktif = b.href === "/yonetim" ? yol === "/yonetim" : yol.startsWith(b.href);
        return (
          <Link
            key={b.href}
            href={b.href}
            aria-current={aktif ? "page" : undefined}
            className={`menu-baglantisi ${aktif ? "is-aktif" : ""}`}
          >
            {b.ad}
          </Link>
        );
      })}
    </nav>
  );
}
