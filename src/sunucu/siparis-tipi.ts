export type SiparisDurumu = "odeme-bekleniyor" | "hazirlaniyor" | "kargoda" | "teslim-edildi" | "iptal";

export const DURUM_ADI: Record<SiparisDurumu, string> = {
  "odeme-bekleniyor": "Ödeme bekleniyor",
  hazirlaniyor: "Hazırlanıyor",
  kargoda: "Kargoda",
  "teslim-edildi": "Teslim edildi",
  iptal: "İptal edildi",
};

export type Siparis = {
  no: string;
  anahtar: string; // sipariş sayfasını yalnız siparişi verenin açabilmesi için
  tarih: string;
  demo: boolean;
  durum: SiparisDurumu; // siparişin ilk durumu; sonraki değişiklikler siparis-olaylari.jsonl dosyasında
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

// Yönetim panelinden yapılan durum değişikliği (ekle-yalnız kayıt)
export type SiparisOlayi = { no: string; durum: SiparisDurumu; takipNo?: string; not?: string; tarih: string };

// Sipariş + güncel durumu
export type GuncelSiparis = Siparis & { takipNo?: string; gecmis: SiparisOlayi[] };

export type IletisimMesaji = {
  id?: string;
  ad: string;
  eposta: string;
  konu: string;
  siparisNo?: string;
  mesaj: string;
  tarih: string;
};
