export type Siparis = {
  no: string;
  anahtar: string; // sipariş sayfasını yalnız siparişi verenin açabilmesi için
  tarih: string;
  demo: boolean;
  durum: "odeme-bekleniyor" | "hazirlaniyor";
  musteri: { ad: string; soyad: string; eposta: string; telefon: string };
  teslimat: { il: string; ilce: string; adres: string };
  fatura: {
    adres: string | null;
    kurumsal: { firma: string; vergiDairesi: string; vergiNo: string } | null;
  };
  odeme: "havale" | "kapida";
  not: string | null;
  izinler: { sozlesme: true; ticariIleti: boolean };
  satirlar: {
    slug: string;
    kod: string;
    ad: string;
    etiket: string;
    barkod: string;
    birimFiyat: number;
    adet: number;
    gorsel: string;
  }[];
  araToplam: number;
  kargo: number;
  odemeUcreti: number;
  toplam: number;
};
