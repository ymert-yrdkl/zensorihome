// Tarayıcıda localStorage'a yazılan küçük bir depo. React'e useSyncExternalStore ile bağlanır;
// sunucuda ve ilk çizimde varsayılan değer döner, böylece hidrasyon uyuşmazlığı olmaz.

export function yerelDepo<T>(anahtar: string, varsayilan: T) {
  let deger = varsayilan;
  let okundu = false;
  const dinleyiciler = new Set<() => void>();

  function oku() {
    if (okundu || typeof window === "undefined") return;
    okundu = true;
    try {
      const ham = window.localStorage.getItem(anahtar);
      if (ham) deger = JSON.parse(ham) as T;
    } catch {
      deger = varsayilan;
    }
  }

  function yay() {
    for (const dinleyici of dinleyiciler) dinleyici();
  }

  return {
    abone(dinleyici: () => void) {
      dinleyiciler.add(dinleyici);
      // Başka sekmede değişirse burada da güncelle
      const sekme = (olay: StorageEvent) => {
        if (olay.key !== anahtar) return;
        okundu = false;
        oku();
        yay();
      };
      window.addEventListener("storage", sekme);
      return () => {
        dinleyiciler.delete(dinleyici);
        window.removeEventListener("storage", sekme);
      };
    },
    anlik() {
      oku();
      return deger;
    },
    sunucuAnlik() {
      return varsayilan;
    },
    yaz(yeni: T) {
      deger = yeni;
      okundu = true;
      try {
        window.localStorage.setItem(anahtar, JSON.stringify(yeni));
      } catch {
        // Gizli pencere ya da dolu depo: değer yalnız bu oturumda kalır
      }
      yay();
    },
  };
}
