// Mağazanın ticari ayarları tek yerde. "ONAY BEKLİYOR" yazanlar Zensori Home'un kararıdır;
// şimdilik pazar yerlerindeki mevcut uygulamadan alındı (3 Ekim 2026).

export const MAGAZA = {
  ad: "Zensori Home",
  // Demo modunda siparişler kaydedilir ama işleme alınmaz; sayfalarda not gösterilir, arama motorları engellenir.
  demo: process.env.NEXT_PUBLIC_DEMO_MODU !== "0",
  siteAdresi: process.env.NEXT_PUBLIC_SITE_ADRESI ?? "https://zensorihomecom.ahmcloud.com",

  // Kargo: Trendyol mağazasında "350 TL ve üzeri kargo bedava (satıcı karşılar)" uygulanıyor.
  ucretsizKargoEsigi: 35000, // kuruş
  kargoUcreti: 4990, // kuruş. ONAY BEKLİYOR: eşik altındaki siparişlerde alınacak ücret
  kargoyaVerilis: "1 iş günü", // Hepsiburada ve Trendyol mağaza bilgisi
  kargoFirmasi: "Anlaşmalı kargo firması", // ONAY BEKLİYOR
  kapidaOdemeUcreti: 0, // ONAY BEKLİYOR
  iadeSuresiGun: 14, // Mesafeli Sözleşmeler Yönetmeliği cayma süresi

  // Havale / EFT bilgileri. ONAY BEKLİYOR: boşken sipariş sayfasında "bilgi iletilecek" notu çıkar.
  banka: { ad: "", alici: "", iban: "" },

  // Satıcı bilgileri: Trendyol satıcı profilinde yayımlanan resmi bilgiler.
  sirket: {
    unvan: "Zensori Dayanıklı Tüketim Malları Sanayi ve Dış Ticaret Limited Şirketi",
    adres: "Acıbadem Mah. Çilekli Sk. Aksüt Apt. No: 5 İç Kapı No: 6, Üsküdar / İstanbul",
    vergiDairesi: "Üsküdar Vergi Dairesi",
    vergiNo: "9971975060",
    ticaretSicilNo: "1088425",
    kep: "zensori@hs01.kep.tr",
    eposta: "", // ONAY BEKLİYOR: müşteri hizmetleri e-postası
    telefon: "", // ONAY BEKLİYOR
  },

  sosyal: {
    instagram: "https://www.instagram.com/zensorihome/",
    instagramKullanici: "@zensorihome",
  },

  // Pazar yeri mağazaları (güven ve bilgi için altbilgide)
  pazarYerleri: [
    { ad: "Trendyol", url: "https://www.trendyol.com/magaza/zensorihome-m-1187782", not: "Satıcı puanı 9,4" },
    { ad: "Hepsiburada", url: "https://www.hepsiburada.com/ara?q=zensori", not: "Zensori Home mağazası" },
    { ad: "n11", url: "https://www.n11.com/magaza/zensorihome", not: "ZensoriHome mağazası" },
  ],
} as const;

export const ODEME_YONTEMLERI = [
  {
    deger: "havale",
    ad: "Havale / EFT",
    aciklama: "Sipariş sonrası hesap bilgileri gösterilir. Ödemeniz ulaştığında siparişiniz hazırlanır.",
  },
  {
    deger: "kapida",
    ad: "Kapıda ödeme",
    aciklama: "Ürünü teslim alırken kargo görevlisine ödersiniz.",
  },
] as const;

export type OdemeYontemi = (typeof ODEME_YONTEMLERI)[number]["deger"];
