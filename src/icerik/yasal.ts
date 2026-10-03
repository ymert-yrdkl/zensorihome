import { MAGAZA } from "@/magaza/ayarlar";
import { tl } from "@/magaza/para";

// Yasal sayfa metinleri (/yasal/<slug>). Hepsi TASLAKTIR: yayına alınmadan önce bir hukukçu incelemelidir.
// Şirket, kargo ve iade bilgileri src/magaza/ayarlar.ts dosyasından gelir; burada elle yazılmaz.

export type YasalBolum = { baslik: string; paragraflar: string[]; maddeler?: string[] };
export type YasalMetin = {
  slug: string;
  kisaAd: string;
  baslik: string;
  guncelleme: string;
  ozet: string;
  bolumler: YasalBolum[];
};

const s = MAGAZA.sirket;

// E-posta ve telefon henüz boş olabilir. Boşsa metinlerde hiç geçmez; resmi kanal KEP ve posta adresidir.
const eposta: string = s.eposta;
const telefon: string = s.telefon;

const GUNCELLEME = "3 Ekim 2026";
const iadeGun = MAGAZA.iadeSuresiGun;
const iletisimSayfasi = `${MAGAZA.siteAdresi}/iletisim`;
const kvkkSayfasi = `${MAGAZA.siteAdresi}/yasal/kvkk-aydinlatma`;

const TASLAK_NOTU: YasalBolum = {
  baslik: "Taslak notu",
  paragraflar: ["Bu metin taslaktır ve yayına alınmadan önce bir hukukçu tarafından incelenmelidir."],
};

// Satıcının resmi bilgileri (ön bilgilendirme, sözleşme ve aydınlatma metninde kullanılır)
function saticiBilgileri(): string[] {
  const satirlar = [
    `Unvan: ${s.unvan}`,
    `Adres: ${s.adres}`,
    `Vergi dairesi ve numarası: ${s.vergiDairesi}, ${s.vergiNo}`,
    `Ticaret sicil numarası: ${s.ticaretSicilNo}`,
    `KEP adresi: ${s.kep}`,
  ];
  if (eposta) satirlar.push(`E-posta: ${eposta}`);
  if (telefon) satirlar.push(`Telefon: ${telefon}`);
  satirlar.push(`İletişim formu: ${iletisimSayfasi}`);
  return satirlar;
}

// Cayma bildirimi gibi yazılı bildirimlerin gönderilebileceği yollar (telefon yazılı kanal değildir)
function bildirimYollari(): string[] {
  const yollar = [`Sitedeki iletişim formu: ${iletisimSayfasi}`];
  if (eposta) yollar.push(`E-posta: ${eposta}`);
  yollar.push(`Kayıtlı elektronik posta (KEP): ${s.kep}`);
  yollar.push(`Posta ya da elden yazılı bildirim: ${s.unvan}, ${s.adres}`);
  return yollar;
}

// KVKK başvurusu yolları (Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ)
function kvkkBasvuruYollari(): string[] {
  const yollar = [
    `Islak imzalı dilekçeyle, elden ya da posta yoluyla: ${s.unvan}, ${s.adres}`,
    `Kayıtlı elektronik posta (KEP) adresinizden ya da güvenli elektronik imza veya mobil imzayla imzalanmış başvuruyla, KEP adresimize: ${s.kep}`,
  ];
  if (eposta) {
    yollar.push(`Daha önce bize bildirdiğiniz ve kayıtlarımızda bulunan e-posta adresinizden: ${eposta}`);
  }
  return yollar;
}

// Genel iletişim yolları
function iletisimYollari(): string[] {
  const yollar = [`İletişim formu: ${iletisimSayfasi}`];
  if (eposta) yollar.push(`E-posta: ${eposta}`);
  if (telefon) yollar.push(`Telefon: ${telefon}`);
  yollar.push(`KEP adresi: ${s.kep}`);
  yollar.push(`Posta adresi: ${s.adres}`);
  return yollar;
}

const kargoKurali = `Ürün toplamı ${tl(MAGAZA.ucretsizKargoEsigi)} ve üzeri olan siparişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde ${tl(MAGAZA.kargoUcreti)} kargo ücreti alınır.`;

const kapidaOdemeNotu =
  "Kapıda ödeme için ek bir ücret uygulanırsa bu ücret, sipariş onaylanmadan önce sipariş özetinde ayrıca gösterilir.";

const iadeKargoTaslagi = [
  "Taslak: iade gönderiminin masrafı satıcı tarafından karşılanır ya da iade, satıcının bildireceği anlaşmalı kargo koduyla yapılır. Bu madde satıcı tarafından netleştirilecektir.",
  "Mevzuata göre, satıcının ön bilgilendirmede iade için belirttiği kargo firmasıyla yapılan gönderimlerin masrafı alıcıdan istenmez. Satıcı iade için bir kargo firması belirtmemişse alıcıdan iade masrafı istenemez.",
];

const caymaIstisnalari = [
  "Alıcının istekleri ya da kişisel ihtiyaçları doğrultusunda hazırlanan ürünler.",
  "Çabuk bozulabilen ya da son kullanma tarihi geçebilecek ürünler.",
  "Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan ve iadesi sağlık ve hijyen açısından uygun olmayan ürünler.",
  "Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan ürünler.",
];

const uyusmazlikParagraflari = [
  "Alıcı, şikâyet ve taleplerini önce satıcıya iletebilir.",
  "Alıcı, Ticaret Bakanlığınca her yıl belirlenen parasal sınırlar içindeki uyuşmazlıklarda yerleşim yerindeki ya da işlemin yapıldığı yerdeki tüketici hakem heyetine başvurabilir. Bu sınırların üzerindeki uyuşmazlıklarda tüketici mahkemesine başvurulur. Tüketici hakem heyeti başvurusu e-Devlet üzerinden de yapılabilir.",
  "Tüketici mahkemesinde dava açılmadan önce arabulucuya başvurulması zorunludur. Bu zorunluluk, tüketici hakem heyetinin görev alanındaki uyuşmazlıklar için geçerli değildir.",
];

export const YASAL_METINLER: YasalMetin[] = [
  // 1. KVKK aydınlatma metni
  {
    slug: "kvkk-aydinlatma",
    kisaAd: "KVKK aydınlatma metni",
    baslik: "Kişisel verilerin işlenmesine ilişkin aydınlatma metni",
    guncelleme: GUNCELLEME,
    ozet: `${MAGAZA.ad} sipariş ve iletişim için hangi kişisel verileri, hangi amaç ve hukuki sebeple işler; verileriniz kime aktarılır ve haklarınız nelerdir.`,
    bolumler: [
      TASLAK_NOTU,
      {
        baslik: "Veri sorumlusu",
        paragraflar: [
          `Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanununun (KVKK) 10. maddesi uyarınca hazırlanmıştır. Kişisel verilerinizi veri sorumlusu sıfatıyla ${s.unvan} işler. Bu metinde şirket "${MAGAZA.ad}" ya da "biz" olarak anılır.`,
        ],
        maddeler: saticiBilgileri(),
      },
      {
        baslik: "İşlenen kişisel veriler",
        paragraflar: ["Siteyi kullandığınızda ve sipariş verdiğinizde aşağıdaki verileriniz işlenir:"],
        maddeler: [
          "Kimlik: ad ve soyad.",
          "İletişim: e-posta adresi, telefon numarası, teslimat adresi ve fatura adresi.",
          "Müşteri işlem: sipariş içeriği, sipariş tutarı, seçilen ödeme yöntemi (havale/EFT ya da kapıda ödeme), sipariş notu, iade ve cayma talepleri.",
          "Kurumsal fatura bilgisi (yalnız kurumsal fatura istenirse): firma adı, vergi dairesi ve vergi numarası.",
          "İletişim formu: formda yazdığınız ad, iletişim bilgisi ve mesaj.",
          "İşlem güvenliği: IP adresi ile istek zamanı ve istenen sayfa gibi sunucu kayıtları.",
        ],
      },
      {
        baslik: "Toplamadığımız veriler",
        paragraflar: [
          "Site banka kartı ya da kredi kartı bilgisi istemez ve saklamaz. Havale/EFT ödemesini kendi bankanız üzerinden yaparsınız. Kapıda ödemede ödemeyi teslimat sırasında yaparsınız.",
          "Sepetiniz ve favori listeniz yalnız kendi tarayıcınızda tutulur. Sepetinizin içeriği yalnız sipariş verdiğinizde siparişin parçası olarak bize ulaşır; favori listeniz bize gönderilmez. Ayrıntılar gizlilik ve çerez politikasındadır.",
          "Sağlık bilgisi gibi özel nitelikli kişisel verilere ihtiyacımız yoktur. Sipariş notuna ve iletişim formuna bu tür bilgiler yazmamanızı rica ederiz.",
        ],
      },
      {
        baslik: "İşleme amaçları",
        paragraflar: ["Kişisel verilerinizi şu amaçlarla işleriz:"],
        maddeler: [
          "Siparişin alınması, hazırlanması, teslim edilmesi ve faturalandırılması.",
          "Havale/EFT ödemelerinin siparişle eşleştirilmesi ve kapıda ödemenin tahsili.",
          "İade, cayma, değişim ve şikâyet taleplerinin yürütülmesi.",
          "Sorularınızın ve iletişim formu mesajlarınızın yanıtlanması.",
          "Vergi, ticaret ve tüketici mevzuatından doğan yükümlülüklerin yerine getirilmesi.",
          "Yetkili kamu kurumlarının bilgi taleplerinin karşılanması.",
          "Sitenin ve sipariş sisteminin güvenliğinin sağlanması, kötüye kullanımın önlenmesi.",
          "Açık rızanız varsa ticari elektronik ileti (kampanya ve duyuru) gönderilmesi.",
        ],
      },
      {
        baslik: "Hukuki sebepler",
        paragraflar: ["Kişisel verilerinizi KVKK'nın 5. maddesindeki şu hukuki sebeplere dayanarak işleriz:"],
        maddeler: [
          "Sözleşmenin kurulması veya ifası (m.5/2-c): siparişin alınması, ödemenin takibi, teslimat, iade ve cayma işlemleri.",
          "Hukuki yükümlülüğün yerine getirilmesi (m.5/2-ç): fatura düzenlenmesi, ticari defter ve kayıtların tutulması, tüketici mevzuatından doğan yükümlülükler ve yetkili kurumların talepleri.",
          "Bir hakkın tesisi, kullanılması veya korunması (m.5/2-e): olası uyuşmazlıklarda kayıtların delil olarak kullanılması.",
          "Meşru menfaat (m.5/2-f): sitenin güvenliği, sunucu kayıtlarının tutulması ve iletişim formu mesajlarının yanıtlanması. Bu işleme, temel hak ve özgürlüklerinize zarar vermeyecek ölçüde yapılır.",
          "Açık rıza (m.5/1): yalnız ticari elektronik ileti gönderimi için.",
        ],
      },
      {
        baslik: "Ticari elektronik ileti",
        paragraflar: [
          "Size kampanya ve duyuru iletisi göndermemiz yalnız açık rızanıza dayanır. Bu izin, önceden işaretlenmemiş ayrı bir kutuyla istenir. İzin vermemeniz sipariş vermenizi etkilemez.",
          "İzninizi dilediğiniz zaman, iletilerde yer alan ret yoluyla ya da bize başvurarak geri alabilirsiniz. Ticari elektronik ileti gönderimi ayrıca 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanuna tabidir.",
        ],
      },
      {
        baslik: "Toplama yöntemi",
        paragraflar: [
          "Kişisel verileriniz elektronik ortamda toplanır: sitedeki sipariş ve iletişim formlarına yazdığınız bilgilerden ve siteyi ziyaret ettiğinizde sunucunun kendiliğinden oluşturduğu kayıtlardan.",
          "Bize KEP ya da posta yoluyla yazdığınızda, yazınızdaki bilgiler de bu metne göre işlenir.",
        ],
      },
      {
        baslik: "Kişisel verilerin aktarılması",
        paragraflar: [
          "Kişisel verilerinizi yalnız yukarıdaki amaçlarla ve bu amaçlar için gereken ölçüde, KVKK'nın 8. maddesine uygun olarak şu alıcılara aktarırız:",
        ],
        maddeler: [
          "Kargo firması: teslimat için ad soyad, teslimat adresi ve telefon numarası; kapıda ödemede tahsil edilecek tutar.",
          "Barındırma ve sunucu hizmeti sağlayıcısı: sitenin ve sipariş kayıtlarının tutulduğu sunucu hizmeti için.",
          "Muhasebe hizmeti ve mali müşavir: fatura ve muhasebe kayıtları için.",
          "Yetkili kamu kurum ve kuruluşları ile yargı mercileri: mevzuatın gerektirdiği ya da resmi olarak istendiği hâllerde.",
        ],
      },
      {
        baslik: "Yurt dışına aktarım",
        paragraflar: [
          "Kişisel verilerinizin yurt dışına aktarılması öngörülmemektedir. Bu durum değişirse bu metin güncellenir ve KVKK'nın 9. maddesindeki şartlara uyulur.",
          "Kişisel verilerinizi satmayız ve reklam amacıyla kimseyle paylaşmayız.",
        ],
      },
      {
        baslik: "Saklama süreleri",
        paragraflar: [
          "Kişisel verilerinizi işleme amacı için gereken süre ve mevzuatın öngördüğü süreler boyunca saklarız. Süre dolduğunda veriler silinir, yok edilir ya da anonim hâle getirilir.",
          "Aşağıdaki süreler taslaktır ve hukukçu incelemesiyle kesinleşecektir:",
        ],
        maddeler: [
          "Sipariş, fatura ve diğer ticari kayıtlar: Türk Ticaret Kanunu ve Vergi Usul Kanunu gereği 10 yıla kadar (taslak).",
          "İletişim formu mesajları: 2 yıl (taslak).",
          "Sunucu kayıtları (IP adresi ve teknik kayıtlar): 2 yıl (taslak).",
        ],
      },
      {
        baslik: "Haklarınız",
        paragraflar: ["KVKK'nın 11. maddesi uyarınca bize başvurarak şunları isteyebilirsiniz:"],
        maddeler: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme.",
          "İşlenmişse buna ilişkin bilgi isteme.",
          "İşlenme amacını ve verilerin bu amaca uygun kullanılıp kullanılmadığını öğrenme.",
          "Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme.",
          "Eksik veya yanlış işlenmişse düzeltilmesini isteme.",
          "KVKK'nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme.",
          "Düzeltme, silme ve yok etme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme.",
          "Verilerin yalnız otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme.",
          "Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini isteme.",
        ],
      },
      {
        baslik: "Başvuru yolu",
        paragraflar: [
          "Başvurunuzu, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğe uygun olarak Türkçe ve yazılı şekilde şu yollardan biriyle yapabilirsiniz:",
        ],
        maddeler: kvkkBasvuruYollari(),
      },
      {
        baslik: "Başvuruda bulunması gereken bilgiler",
        paragraflar: ["Başvurunuzu doğru kişiye yanıtlayabilmemiz için başvuruda şunlar yer almalıdır:"],
        maddeler: [
          "Ad, soyad ve yazılı başvurularda imza.",
          "Türkiye Cumhuriyeti vatandaşları için T.C. kimlik numarası; yabancılar için uyruk ile pasaport numarası ya da varsa kimlik numarası.",
          "Tebligata esas yerleşim yeri ya da iş yeri adresi.",
          "Varsa bildirime esas e-posta adresi, telefon ya da faks numarası.",
          "Talebinizin konusu.",
        ],
      },
      {
        baslik: "Yanıt süresi ve Kurula şikâyet",
        paragraflar: [
          "Başvurunuzu niteliğine göre en kısa sürede ve en geç 30 gün içinde ücretsiz olarak sonuçlandırırız. İşlemin ayrıca bir maliyet gerektirmesi hâlinde Kişisel Verileri Koruma Kurulunun belirlediği tarifedeki ücret alınabilir. Yanıtımızı yazılı olarak ya da elektronik ortamda iletiriz.",
          "Başvurunuz reddedilir, yanıtımızı yetersiz bulursunuz ya da süresinde yanıt verilmezse, yanıtı öğrendiğiniz tarihten itibaren 30 gün ve her hâlde başvuru tarihinden itibaren 60 gün içinde Kişisel Verileri Koruma Kuruluna şikâyette bulunabilirsiniz.",
        ],
      },
      {
        baslik: "Metnin güncellenmesi",
        paragraflar: [
          "Bu metni, işleme faaliyetlerimiz ya da mevzuat değiştiğinde güncelleriz. Güncel metin bu sayfada, güncelleme tarihiyle yayımlanır.",
        ],
      },
    ],
  },

  // 2. Gizlilik ve çerez politikası
  {
    slug: "gizlilik-ve-cerez",
    kisaAd: "Gizlilik ve çerez politikası",
    baslik: "Gizlilik ve çerez politikası",
    guncelleme: GUNCELLEME,
    ozet: "Sitede analiz ya da reklam çerezi ve üçüncü taraf izleme yoktur. Sepet ve favoriler yalnız tarayıcınızda saklanır; nasıl silineceği burada.",
    bolumler: [
      TASLAK_NOTU,
      {
        baslik: "Kısaca",
        paragraflar: [
          `${MAGAZA.ad} sitesi analiz, reklam ya da pazarlama amaçlı çerez kullanmaz. Sitede üçüncü taraf izleme aracı, reklam pikseli ya da ziyaretçi analizi servisi yoktur.`,
          "Sepetiniz ve favori listeniz yalnız kendi cihazınızda, tarayıcının yerel depolama alanında tutulur. Bu bilgiler siz sipariş verene kadar sunucumuza gönderilmez.",
        ],
      },
      {
        baslik: "Sipariş ve iletişim formlarındaki bilgiler",
        paragraflar: [
          `Sipariş verirken ya da iletişim formunu doldururken yazdığınız bilgileri hangi amaçla işlediğimiz, kime aktardığımız ve haklarınız, kişisel verilerin işlenmesine ilişkin aydınlatma metninde anlatılır: ${kvkkSayfasi}`,
        ],
      },
      {
        baslik: "Tarayıcınızda saklanan bilgiler",
        paragraflar: ["Site, çalışması için gereken iki kaydı tarayıcınızın yerel depolama alanında (localStorage) tutar:"],
        maddeler: [
          `"zh-sepet-v1": sepetinizdeki ürünler (ürün adı, seçeneği, adedi, sepete eklendiği andaki fiyatı ve görsel bilgisi).`,
          `"zh-favori-v1": favorilerinize eklediğiniz ürünlerin listesi.`,
        ],
      },
      {
        baslik: "Bu kayıtlar ne zaman bize ulaşır",
        paragraflar: [
          "Yerel depolamadaki bilgiler, çerezler gibi her ziyarette sunucuya gönderilmez. Sepetinizin içeriği yalnız sipariş verdiğinizde, siparişin parçası olarak bize ulaşır. Favori listeniz bize gönderilmez.",
          "Bu kayıtların belirli bir bitiş tarihi yoktur. Siz ya da tarayıcınız silene kadar cihazınızda kalır. Başka bir cihazda ya da tarayıcıda sepetiniz ve favorileriniz görünmez.",
        ],
      },
      {
        baslik: "Yazı tipleri ve dış bağlantılar",
        paragraflar: [
          "Sitedeki yazı tipleri sitenin kendi sunucusundan yüklenir. Google Fonts gibi dış servislere istek gönderilmez.",
          "Sitede Instagram hesabımıza ve pazar yeri mağazalarımıza bağlantılar bulunur. Bu bağlantılara tıkladığınızda ilgili sitenin kendi gizlilik ve çerez kuralları geçerli olur.",
        ],
      },
      {
        baslik: "Sunucu kayıtları",
        paragraflar: [
          "Siteyi ziyaret ettiğinizde sunucu, güvenlik ve hata takibi için IP adresi, istek zamanı ve istenen sayfa gibi teknik kayıtlar tutar. Bu kayıtlar reklam ya da profil çıkarma amacıyla kullanılmaz ve 2 yıl saklanır (taslak süre, hukukçu incelemesiyle kesinleşecektir).",
        ],
      },
      {
        baslik: "Neden çerez onay penceresi yok",
        paragraflar: [
          "Site yalnız, istediğiniz hizmetin (sepet ve favoriler) sağlanması için zorunlu olan yerel depolamayı kullanır. Bu nedenle çerez onay penceresi gösterilmez.",
          "İleride analiz ya da benzeri bir araç eklenirse, bu araç onayınız alınmadan çalıştırılmaz ve bu politika önceden güncellenir.",
        ],
      },
      {
        baslik: "Yerel depolamayı nasıl silersiniz",
        paragraflar: ["Sepet ve favori kayıtlarını istediğiniz zaman silebilirsiniz:"],
        maddeler: [
          "Sepetten ürünleri çıkararak ve favorilerden ürünleri kaldırarak ilgili kaydı güncelleyebilirsiniz.",
          `Tarayıcınızın ayarlarında "çerezler ve site verileri" ya da "web sitesi verileri" bölümünden bu siteye ait verileri silebilirsiniz. Bu işlem sepetinizi ve favorilerinizi birlikte siler.`,
          "Chrome ve Edge'de adres çubuğunun solundaki simgeden site ayarlarını açarak bu siteye ait verileri silebilirsiniz.",
          "Gizli ya da özel pencerede gezinirseniz bu kayıtlar pencereyi kapattığınızda silinir.",
        ],
      },
      {
        baslik: "Değişiklikler",
        paragraflar: [
          "Bu politikayı, sitede kullanılan araçlar değiştiğinde güncelleriz. Güncel metin bu sayfada, güncelleme tarihiyle yayımlanır.",
        ],
      },
      {
        baslik: "İletişim",
        paragraflar: ["Bu politika hakkındaki sorularınız için:"],
        maddeler: iletisimYollari(),
      },
    ],
  },

  // 3. Mesafeli satış sözleşmesi
  {
    slug: "mesafeli-satis-sozlesmesi",
    kisaAd: "Mesafeli satış sözleşmesi",
    baslik: "Mesafeli satış sözleşmesi",
    guncelleme: GUNCELLEME,
    ozet: `${MAGAZA.ad} sitesinden verilen siparişlerde ödeme, teslimat, cayma hakkı ve uyuşmazlık çözümüne ilişkin satıcı ve alıcı hakları.`,
    bolumler: [
      TASLAK_NOTU,
      {
        baslik: "Satıcı",
        paragraflar: [
          `Bu sözleşmede "satıcı", aşağıda bilgileri yazılı ${s.unvan} anlamına gelir. MERSİS numarası satıcı tarafından eklenecektir.`,
        ],
        maddeler: saticiBilgileri(),
      },
      {
        baslik: "Alıcı",
        paragraflar: [
          `"Alıcı", ${MAGAZA.siteAdresi} üzerinden sipariş veren ve siparişte adı, teslimat adresi ve iletişim bilgileri yazılı olan kişidir. Fatura başka bir kişi ya da şirket adına düzenlenecekse bu bilgiler de siparişte yer alır.`,
        ],
      },
      {
        baslik: "Sözleşmenin konusu",
        paragraflar: [
          `Bu sözleşme, alıcının ${MAGAZA.siteAdresi} üzerinden elektronik ortamda sipariş ettiği ürünlerin satışını ve teslimini düzenler. Tarafların hak ve yükümlülükleri 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine göre belirlenir.`,
          "Ön bilgilendirme formu ve sipariş özeti bu sözleşmenin ayrılmaz parçalarıdır.",
        ],
      },
      {
        baslik: "Ürün ve fiyat",
        paragraflar: [
          "Sözleşme konusu ürünlerin adı, seçenekleri, adedi ve fiyatı sipariş özetinde yazılıdır. Ürünlerin temel nitelikleri ürün sayfalarında yer alır.",
          "Fiyatlar Türk lirası olarak ve KDV dahil gösterilir. Siparişin toplam tutarı, varsa kargo ücretiyle birlikte, sipariş onaylanmadan önce sipariş özetinde gösterilir. Sipariş anında gösterilen fiyat geçerlidir.",
        ],
      },
      {
        baslik: "Ödeme",
        paragraflar: ["Alıcı, siparişte aşağıdaki ödeme yöntemlerinden birini seçer. Site kart bilgisi almaz."],
        maddeler: [
          "Havale/EFT: hesap bilgileri sipariş verildikten sonra gösterilir. Sipariş, ödeme satıcının hesabına geçtikten sonra hazırlanır. Ödeme için tanınan süre satıcı tarafından belirlenecektir.",
          `Kapıda ödeme: alıcı, ödemeyi ürünü teslim alırken kargo görevlisine yapar. ${kapidaOdemeNotu}`,
        ],
      },
      {
        baslik: "Teslimat",
        paragraflar: [
          `Ürünler, alıcının siparişte bildirdiği teslimat adresine kargo ile gönderilir. Satıcı, siparişi ${MAGAZA.kargoyaVerilis} içinde kargoya verir. Havale/EFT ile ödenen siparişlerde bu süre, ödemenin satıcının hesabına geçtiği gün başlar.`,
          "Teslimat, her durumda siparişin satıcıya ulaştığı tarihten itibaren yasal azami süre olan 30 günü geçmez.",
          kargoKurali,
          "Ürün, alıcıya ya da alıcının belirlediği kişiye teslim edilene kadar oluşan kayıp ve hasardan satıcı sorumludur. Alıcı, satıcının belirlediği kargo firması dışında bir taşıyıcı isterse, ürün o taşıyıcıya teslim edildikten sonra oluşan kayıp ve hasardan satıcı sorumlu değildir.",
          "Satıcı, siparişi yerine getiremeyeceğini anlarsa bu durumu öğrendiği tarihten itibaren 3 gün içinde alıcıya bildirir. Teslimat ücreti dahil tahsil ettiği bütün ödemeleri bildirim tarihinden itibaren en geç 14 gün içinde iade eder.",
        ],
      },
      {
        baslik: "Cayma hakkı",
        paragraflar: [
          `Alıcı, ürünü teslim aldığı günden itibaren ${iadeGun} gün içinde, gerekçe göstermeden ve cezai şart ödemeden sözleşmeden cayabilir. Tek siparişte ayrı ayrı teslim edilen ürünlerde süre, son ürünün teslim alındığı gün başlar. Alıcı, cayma hakkını ürün teslim edilmeden önce de kullanabilir.`,
          "Cayma bildiriminin süre dolmadan yazılı olarak ya da kalıcı veri saklayıcısıyla satıcıya yöneltilmesi yeterlidir. Alıcı, Mesafeli Sözleşmeler Yönetmeliği ekindeki örnek cayma formunu kullanabilir ya da cayma kararını açıkça bildiren bir beyan gönderebilir. Bildirim şu yollardan biriyle yapılır:",
        ],
        maddeler: bildirimYollari(),
      },
      {
        baslik: "Cayma hâlinde ürünün ve ödemenin iadesi",
        paragraflar: [
          "Alıcı, cayma bildirimini gönderdiği tarihten itibaren 10 gün içinde ürünü satıcıya geri gönderir.",
          "Satıcı, cayma bildiriminin kendisine ulaştığı tarihten itibaren en geç 14 gün içinde, teslimat ücreti dahil tahsil ettiği bütün ödemeleri alıcıya iade eder. İade, ödeme yöntemine uygun şekilde, tek seferde ve alıcıya masraf çıkarmadan yapılır. Havale/EFT ya da kapıda ödemeyle yapılan alışverişlerde iade, alıcının bildireceği banka hesabına (IBAN) gönderilir.",
          "Alıcı, cayma süresi içinde ürünü işleyişine, teknik özelliklerine ve kullanım talimatına uygun kullanması nedeniyle oluşan değişiklik ve bozulmalardan sorumlu değildir.",
        ],
      },
      {
        baslik: "İade kargo masrafı",
        paragraflar: iadeKargoTaslagi,
      },
      {
        baslik: "Cayma hakkının kullanılamadığı hâller",
        paragraflar: [
          "Mesafeli Sözleşmeler Yönetmeliğinin 15. maddesinde sayılan hâllerde cayma hakkı kullanılamaz. Satıcı, bir ürünün bu istisnalardan birine girdiğini sipariş verilmeden önce ürün sayfasında açıkça belirtir.",
          "Bu sitede satılan ürün türleri bakımından söz konusu olabilecek istisnalar şunlardır:",
        ],
        maddeler: caymaIstisnalari,
      },
      {
        baslik: "Ayıplı ürün",
        paragraflar: [
          "Satıcı, ürünü siparişe ve sözleşmeye uygun olarak teslim etmekle yükümlüdür. Teslim edilen ürün ayıplıysa alıcı, 6502 sayılı Kanunun 11. maddesine göre şu seçimlik haklardan birini kullanabilir:",
        ],
        maddeler: [
          "Sözleşmeden dönme.",
          "Satış bedelinden ayıp oranında indirim isteme.",
          "Ürünün ücretsiz onarılmasını isteme.",
          "Ürünün ayıpsız bir benzeriyle değiştirilmesini isteme.",
        ],
      },
      {
        baslik: "Hasarlı teslimat ve zamanaşımı",
        paragraflar: [
          "Cam ve seramik ürünlerde kargo hasarına karşı, alıcının teslim sırasında paketi kontrol etmesi, hasar varsa kargo görevlisine tutanak tutturması ve fotoğraf çekmesi önerilir. Tutanak tutulmamış olması alıcının yasal haklarını ortadan kaldırmaz. Alıcının fark ettiği hasarı gecikmeden satıcıya bildirmesi işlemi hızlandırır.",
          "Ayıplı ürüne ilişkin sorumluluk, ayıp daha sonra ortaya çıksa bile teslim tarihinden itibaren 2 yıllık zamanaşımına tabidir. Ayıbın satıcının ağır kusuru ya da hilesiyle gizlenmesi hâli saklıdır.",
        ],
      },
      {
        baslik: "Uyuşmazlıkların çözümü",
        paragraflar: uyusmazlikParagraflari,
      },
      {
        baslik: "Bildirimler",
        paragraflar: [
          "Satıcı, alıcıya yapacağı bildirimleri siparişte verilen iletişim bilgilerine yapar. Alıcı, satıcıya yapacağı bildirimleri cayma hakkı bölümünde sayılan yollarla gönderebilir.",
        ],
      },
      {
        baslik: "Yürürlük",
        paragraflar: [
          "Bu sözleşme, alıcının ön bilgilendirme formunu okuduğunu onaylayıp siparişi onaylamasıyla elektronik ortamda kurulur ve yürürlüğe girer.",
          "Satıcı, bu sözleşmeyi ve ön bilgilendirme formunu en geç teslimata kadar alıcıya kalıcı veri saklayıcısıyla (örneğin e-posta) iletir.",
        ],
      },
    ],
  },

  // 4. Ön bilgilendirme formu
  {
    slug: "on-bilgilendirme-formu",
    kisaAd: "Ön bilgilendirme formu",
    baslik: "Ön bilgilendirme formu",
    guncelleme: GUNCELLEME,
    ozet: "Sipariş vermeden önce bilmeniz gerekenler: satıcı bilgileri, toplam fiyat ve kargo, ödeme, teslimat, cayma hakkı ve şikâyet yolları.",
    bolumler: [
      TASLAK_NOTU,
      {
        baslik: "Bu formun amacı",
        paragraflar: [
          "Bu form, Mesafeli Sözleşmeler Yönetmeliğinin 5. maddesi uyarınca alıcıyı sipariş vermeden önce bilgilendirmek için hazırlanmıştır. Siparişe özel ürün, adet ve tutar bilgileri sipariş özetinde yer alır ve bu formun parçasıdır.",
          "Alıcı, siparişi onaylamadan önce bu formu okuduğunu elektronik ortamda onaylar.",
        ],
      },
      {
        baslik: "Satıcı bilgileri",
        paragraflar: [
          "Satıcı ve cayma bildiriminin yöneltileceği kişi aşağıdaki şirkettir. MERSİS numarası satıcı tarafından eklenecektir.",
        ],
        maddeler: saticiBilgileri(),
      },
      {
        baslik: "Ürünün temel nitelikleri",
        paragraflar: [
          "Ürünün malzemesi, ölçüleri, rengi ve kullanım bilgileri ürün sayfasında yer alır. Sipariş özetinde seçilen ürünler, seçenekleri ve adetleri gösterilir.",
          "Doğal ahşaptan (örneğin mango ağacından) yapılan ürünlerde damar ve renk tonu üründen ürüne farklılık gösterebilir.",
        ],
      },
      {
        baslik: "Toplam fiyat ve kargo ücreti",
        paragraflar: [
          "Fiyatlar Türk lirası olarak ve KDV dahil gösterilir. Vergiler dahil toplam tutar, sipariş onaylanmadan önce sipariş özetinde gösterilir.",
          kargoKurali,
          `${kapidaOdemeNotu} Bunların dışında alıcıdan ek bir bedel istenmez.`,
        ],
      },
      {
        baslik: "Ödeme",
        paragraflar: ["Site kart bilgisi almaz. Alıcı şu ödeme yöntemlerinden birini seçebilir:"],
        maddeler: [
          "Havale/EFT: hesap bilgileri sipariş verildikten sonra gösterilir. Sipariş, ödeme satıcının hesabına geçtikten sonra hazırlanır.",
          "Kapıda ödeme: alıcı, ödemeyi ürünü teslim alırken kargo görevlisine yapar.",
        ],
      },
      {
        baslik: "Teslimat",
        paragraflar: [
          `Sipariş, satıcıya ulaştıktan sonra ${MAGAZA.kargoyaVerilis} içinde kargoya verilir. Havale/EFT ile ödenen siparişlerde bu süre, ödemenin satıcının hesabına geçtiği gün başlar. Teslimat her durumda yasal azami süre olan 30 günü geçmez.`,
          "Ürün, alıcıya ya da alıcının belirlediği kişiye teslim edilene kadar oluşan kayıp ve hasardan satıcı sorumludur.",
          "Satıcı, siparişi yerine getiremeyeceğini anlarsa bu durumu 3 gün içinde alıcıya bildirir ve tahsil ettiği bütün ödemeleri en geç 14 gün içinde iade eder.",
        ],
      },
      {
        baslik: "Cayma hakkı",
        paragraflar: [
          `Alıcı, ürünü teslim aldığı günden itibaren ${iadeGun} gün içinde, gerekçe göstermeden ve cezai şart ödemeden sözleşmeden cayabilir. Cayma hakkı ürün teslim edilmeden önce de kullanılabilir.`,
          "Cayma bildiriminin süre dolmadan yazılı olarak ya da kalıcı veri saklayıcısıyla satıcıya yöneltilmesi yeterlidir. Alıcı, Mesafeli Sözleşmeler Yönetmeliği ekindeki örnek cayma formunu kullanabilir ya da cayma kararını açıkça bildiren bir beyan gönderebilir. Bildirim şu yollardan biriyle yapılır:",
        ],
        maddeler: bildirimYollari(),
      },
      {
        baslik: "Cayma hâlinde iade",
        paragraflar: [
          "Alıcı, cayma bildirimini gönderdiği tarihten itibaren 10 gün içinde ürünü satıcıya geri gönderir. Satıcı, cayma bildiriminin kendisine ulaştığı tarihten itibaren en geç 14 gün içinde, teslimat ücreti dahil bütün ödemeleri tek seferde ve masrafsız olarak iade eder.",
          ...iadeKargoTaslagi,
        ],
      },
      {
        baslik: "Cayma hakkının istisnaları",
        paragraflar: [
          "Mesafeli Sözleşmeler Yönetmeliğinin 15. maddesinde sayılan hâllerde cayma hakkı kullanılamaz. Bir ürün bu istisnalardan birine giriyorsa bu durum sipariş verilmeden önce ürün sayfasında açıkça belirtilir. Bu sitedeki ürün türleri bakımından söz konusu olabilecek istisnalar şunlardır:",
        ],
        maddeler: caymaIstisnalari,
      },
      {
        baslik: "Şikâyet ve itiraz yolları",
        paragraflar: uyusmazlikParagraflari,
      },
    ],
  },

  // 5. İade ve cayma hakkı (müşteriler için sade anlatım)
  {
    slug: "iade-ve-cayma",
    kisaAd: "İade ve cayma hakkı",
    baslik: "İade ve cayma hakkı",
    guncelleme: GUNCELLEME,
    ozet: `Siparişinizden teslimden itibaren ${iadeGun} gün içinde gerekçe göstermeden cayabilirsiniz. Başvuru, ürünü geri gönderme ve para iadesi adımları.`,
    bolumler: [
      TASLAK_NOTU,
      {
        baslik: "Kısaca",
        paragraflar: [
          `Ürünü teslim aldığınız günden itibaren ${iadeGun} gün içinde, gerekçe göstermeden ve ceza ödemeden siparişinizden cayabilirsiniz. Bu hak 6502 sayılı Tüketicinin Korunması Hakkında Kanundan ve Mesafeli Sözleşmeler Yönetmeliğinden doğar.`,
          "Bu sayfa kuralları sade bir dille özetler. Ayrıntılı kurallar mesafeli satış sözleşmesinde yer alır.",
        ],
      },
      {
        baslik: "Nasıl başvurursunuz",
        paragraflar: [
          "Cayma kararınızı süre dolmadan bize yazılı olarak bildirmeniz yeterlidir. Bildiriminizde adınızı, sipariş bilgilerinizi ve cayma istediğiniz ürünleri yazmanız işlemi hızlandırır. Şu yollardan birini kullanabilirsiniz:",
        ],
        maddeler: bildirimYollari(),
      },
      {
        baslik: "Ürünü geri gönderme",
        paragraflar: [
          "Cayma bildiriminizi gönderdiğiniz günden itibaren 10 gün içinde ürünü bize geri gönderin.",
          "İade gönderiminin masrafı ve kullanılacak kargo firması ya da anlaşmalı kargo kodu satıcı tarafından belirlenecektir. Satıcının iade için belirttiği kargo firmasıyla gönderdiğinizde sizden kargo ücreti istenmez.",
          "Ürünü kullanmadan ve mümkünse orijinal ambalajıyla göndermenizi öneririz. Bu bir öneridir ve cayma hakkınızı sınırlamaz. Ürünü olağan şekilde incelemeniz ve kullanım talimatına uygun kullanmanız nedeniyle oluşan değişikliklerden sorumlu tutulmazsınız.",
          "Cam ve seramik ürünleri sağlam bir kutuda, boşlukları doldurarak paketleyin.",
        ],
      },
      {
        baslik: "Paranızın iadesi",
        paragraflar: [
          "Cayma bildiriminiz bize ulaştıktan sonra en geç 14 gün içinde, varsa ödediğiniz teslimat ücreti dahil bütün ödemenizi tek seferde ve masrafsız olarak iade ederiz.",
          "Havale/EFT ya da kapıda ödemeyle yaptığınız alışverişlerde iade, bize bildireceğiniz banka hesabına (IBAN) gönderilir.",
        ],
      },
      {
        baslik: "Hasarlı, kırık ya da yanlış ürün",
        paragraflar: [
          "Bu durum cayma hakkından ayrıdır. Ürün size teslim edilene kadar oluşan kayıp ve hasardan satıcı sorumludur.",
          "Teslim sırasında paketi kargo görevlisinin yanında kontrol etmenizi öneririz. Paket ezik, ıslak ya da açılmışsa kargo görevlisine hasar tespit tutanağı tutturun. Ürünün ve paketin fotoğrafını çekin.",
          "Hasarı ya da yanlış ürünü sonradan fark ederseniz de gecikmeden bize bildirin. Tutanak tutulmamış olması yasal haklarınızı ortadan kaldırmaz. Yeni ürün gönderilmesini, ücretin iadesini ya da kanunda sayılan diğer seçimlik haklardan birini isteyebilirsiniz.",
          "Kırık cam ve seramik parçalarına dokunurken dikkatli olun. Ürünü atmadan önce bize bildirin.",
        ],
      },
      {
        baslik: "Cayma hakkının kullanılamadığı ürünler",
        paragraflar: [
          "Mevzuat bazı ürünlerde cayma hakkını kapsam dışında bırakır. Örneğin size özel hazırlanan ürünler ile tesliminden sonra koruyucu ambalajı açılmış ve iadesi sağlık ve hijyen açısından uygun olmayan ürünler bu kapsamdadır.",
          "Bir ürün bu kapsamdaysa bu durum sipariş vermeden önce ürün sayfasında belirtilir. Tam liste mesafeli satış sözleşmesindedir.",
        ],
      },
      {
        baslik: "İletişim",
        paragraflar: ["İade ve cayma ile ilgili sorularınız için:"],
        maddeler: iletisimYollari(),
      },
    ],
  },

  // 6. Kullanım koşulları
  {
    slug: "kullanim-kosullari",
    kisaAd: "Kullanım koşulları",
    baslik: "Site kullanım koşulları",
    guncelleme: GUNCELLEME,
    ozet: `${MAGAZA.ad} sitesinin kullanım kuralları: tanıtım sürümü notu, fikri mülkiyet, fiyat ve stok bilgileri, sorumluluk ve uygulanacak hukuk.`,
    bolumler: [
      TASLAK_NOTU,
      {
        baslik: "Tanıtım (demo) sürümü",
        paragraflar: [
          "Bu site tanıtım (demo) sürümüdür; verilen siparişler işleme alınmaz. Ürün gönderilmez ve sizden ödeme istenmez.",
          "Demo sürümünde formlara yazdığınız bilgiler sunucuda kaydedilebilir. Bu nedenle gerçek kişisel bilgilerinizi girmemenizi öneririz.",
        ],
      },
      {
        baslik: "Kapsam",
        paragraflar: [
          `Bu koşullar ${MAGAZA.siteAdresi} adresindeki sitenin kullanımını düzenler. Site ${s.unvan} tarafından işletilir. Bu koşullarda "biz" bu şirketi ifade eder. Siteyi kullanarak bu koşulları kabul etmiş olursunuz.`,
          "Sipariş verdiğinizde ayrıca ön bilgilendirme formu ve mesafeli satış sözleşmesi uygulanır. Bu koşullar ile sözleşme arasında fark olursa sözleşme esas alınır.",
        ],
      },
      {
        baslik: "Fikri mülkiyet",
        paragraflar: [
          `Sitedeki ürün fotoğrafları, metinler ve marka unsurları ${MAGAZA.ad}'a aittir ve fikri mülkiyet mevzuatıyla korunur. Bunlar yazılı izin alınmadan kopyalanamaz, çoğaltılamaz ya da ticari amaçla kullanılamaz.`,
          "Ürün sayfalarının bağlantısını paylaşabilirsiniz.",
        ],
      },
      {
        baslik: "Ürün bilgileri, fiyat ve stok",
        paragraflar: [
          "Ürün bilgilerini, fiyatlarını ve stok durumunu doğru tutmaya özen gösteririz. Fotoğraflardaki renkler ekran ayarlarına göre farklı görünebilir. Doğal ahşap ürünlerde damar ve renk tonu üründen ürüne değişebilir.",
          "Sitede açıkça hatalı bir fiyat ya da stok bilgisi yer alırsa durumu size gecikmeden bildiririz. Siparişinizi doğru fiyatla sürdürmeyi ya da iptal etmeyi seçebilirsiniz. İptal hâlinde ödediğiniz tutarın tamamı iade edilir.",
          "Siparişiniz stok yetersizliği nedeniyle karşılanamazsa bunu öğrendiğimiz tarihten itibaren 3 gün içinde size bildiririz. Ödediğiniz tutarın tamamını en geç 14 gün içinde iade ederiz.",
        ],
      },
      {
        baslik: "Siteyi kullanırken",
        paragraflar: ["Siteyi hukuka ve bu koşullara uygun kullanmanız gerekir. Aşağıdakiler yasaktır:"],
        maddeler: [
          "Siparişte ya da formlarda başkasına ait ya da gerçeğe aykırı bilgi vermek.",
          "Sitenin çalışmasını bozmaya, yavaşlatmaya ya da güvenlik önlemlerini aşmaya yönelik girişimlerde bulunmak.",
          "Site içeriğini otomatik araçlarla toplu olarak kopyalamak.",
        ],
      },
      {
        baslik: "Başka sitelere bağlantılar",
        paragraflar: [
          "Sitede Instagram hesabımıza ve pazar yeri mağazalarımıza bağlantılar bulunur. Bu siteler kendi kurallarına ve gizlilik politikalarına tabidir. İçeriklerinden biz sorumlu değiliz.",
        ],
      },
      {
        baslik: "Sorumluluğun sınırı",
        paragraflar: [
          "Siteyi erişilebilir tutmaya çalışırız. Bakım, teknik arıza ya da elimizde olmayan nedenlerle site geçici olarak kullanılamayabilir.",
          "Sitenin kullanılamamasından ya da site içeriğinden doğan dolaylı zararlardan, kastımız ya da ağır ihmalimiz bulunmadıkça sorumlu değiliz. Kanunen sınırlandırılamayan sorumluluklarımız ve tüketici mevzuatından doğan haklarınız saklıdır.",
        ],
      },
      {
        baslik: "Değişiklikler",
        paragraflar: [
          "Bu koşulları gerektiğinde güncelleyebiliriz. Güncel metin bu sayfada, güncelleme tarihiyle yayımlanır. Verilmiş siparişlere, sipariş tarihinde geçerli olan metinler uygulanır.",
        ],
      },
      {
        baslik: "Uygulanacak hukuk ve yetkili merciler",
        paragraflar: [
          "Bu koşullara Türk hukuku uygulanır.",
          "Uyuşmazlıklarda İstanbul mahkemeleri ve icra daireleri yetkilidir. Tüketicilerin 6502 sayılı Kanundan doğan hakları, özellikle tüketici hakem heyetlerine ve tüketici mahkemelerine başvurma hakları saklıdır.",
        ],
      },
      {
        baslik: "İletişim",
        paragraflar: ["Bu koşullar hakkındaki sorularınız için:"],
        maddeler: iletisimYollari(),
      },
    ],
  },
];

export function yasalMetinBul(slug: string) {
  return YASAL_METINLER.find((m) => m.slug === slug);
}
