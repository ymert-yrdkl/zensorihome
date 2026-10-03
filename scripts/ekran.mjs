// Tasarım denetimi için tam sayfa ekran görüntüsü (sistemdeki Chrome, DevTools protokolü; ek paket yok).
// Kullanım: node scripts/ekran.mjs <klasör> /yol[@genişlik] [/yol2@390 ...]
// Örnek:    node scripts/ekran.mjs .ekran / /urunler@390
// Ortam: EKRAN_ADRES (varsayılan http://localhost:3200), CHROME (chrome.exe yolu)

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [klasor = ".ekran", ...hedefler] = process.argv.slice(2);
const ADRES = process.env.EKRAN_ADRES ?? "http://localhost:3200";
const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;

fs.mkdirSync(klasor, { recursive: true });
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "zh-ekran-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profil}`,
  "--hide-scrollbars",
  "--no-first-run",
  "--force-device-scale-factor=1",
  "about:blank",
]);

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

async function sayfaSoketi() {
  for (let i = 0; i < 50; i++) {
    try {
      const liste = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const sayfa = liste.find((s) => s.type === "page");
      if (sayfa) return sayfa.webSocketDebuggerUrl;
    } catch {}
    await bekle(200);
  }
  throw new Error("Chrome açılmadı");
}

const soket = new WebSocket(await sayfaSoketi());
await new Promise((r) => soket.addEventListener("open", r, { once: true }));
let sayac = 0;
const bekleyen = new Map();
const olayDinleyiciler = [];
soket.addEventListener("message", (m) => {
  const veri = JSON.parse(m.data);
  if (veri.id && bekleyen.has(veri.id)) {
    bekleyen.get(veri.id)(veri);
    bekleyen.delete(veri.id);
  } else if (veri.method) {
    for (const d of olayDinleyiciler) d(veri);
  }
});
function gonder(method, params = {}) {
  const id = ++sayac;
  soket.send(JSON.stringify({ id, method, params }));
  return new Promise((r) => bekleyen.set(id, (v) => r(v.result ?? v)));
}

await gonder("Page.enable");
// EKRAN_SEPET=1 ise örnek bir sepet localStorage'a konur (ödeme ve sepet sayfaları için)
if (process.env.EKRAN_SEPET) {
  const ornek = [
    {
      slug: "sessiz-kureler-mum",
      kod: "10-cm-krem",
      ad: "Sessiz Küreler Mum",
      etiket: "10 cm, Krem",
      fiyat: 54900,
      gorsel: { src: "/urun/sessiz-kureler-mum/10-cm-krem-1.webp", renk: "#c9a27e" },
      adet: 2,
    },
    {
      slug: "dramatic-cool-bonbon-vazo",
      kod: "krem",
      ad: "Dramatic Cool Bonbon Vazo",
      etiket: "",
      fiyat: 159900,
      gorsel: { src: "/urun/dramatic-cool-bonbon-vazo/krem-1.webp", renk: "#b9c4ae" },
      adet: 1,
    },
  ];
  await gonder("Page.addScriptToEvaluateOnNewDocument", {
    source: `localStorage.setItem("zh-sepet-v1", ${JSON.stringify(JSON.stringify(ornek))})`,
  });
}
await gonder("Runtime.enable");
const hatalar = [];
olayDinleyiciler.push((o) => {
  if (o.method === "Runtime.exceptionThrown") hatalar.push(o.params.exceptionDetails?.exception?.description ?? "hata");
  if (o.method === "Runtime.consoleAPICalled" && o.params.type === "error")
    hatalar.push(o.params.args.map((a) => a.value ?? a.description).join(" "));
});

for (const hedef of hedefler.length ? hedefler : ["/"]) {
  const [yol, genislikMetni] = hedef.split("@");
  const genislik = Number(genislikMetni ?? 1440);
  const mobil = genislik < 768;
  await gonder("Emulation.setDeviceMetricsOverride", {
    width: genislik,
    height: mobil ? 844 : 900,
    deviceScaleFactor: 1,
    mobile: mobil,
  });
  await gonder("Page.navigate", { url: ADRES + yol });
  await bekle(1500);
  // Tembel görseller yüklensin diye sayfayı aşağı kadar kaydır
  await gonder("Runtime.evaluate", {
    expression: `(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}scrollTo(0,0);await document.fonts.ready;await new Promise(r=>setTimeout(r,800));return document.documentElement.scrollWidth+'x'+document.body.scrollHeight})()`,
    awaitPromise: true,
    returnByValue: true,
  }).then((r) => {
    const [gen, yuk] = String(r.result?.value ?? "0x0")
      .split("x")
      .map(Number);
    if (gen > genislik) console.log(`  ! yatay taşma: ${gen}px > ${genislik}px (${yol})`);
    return yuk;
  });
  const { result } = await gonder("Runtime.evaluate", { expression: "document.body.scrollHeight", returnByValue: true });
  const yukseklik = Math.min(result.value, 16000);
  await gonder("Emulation.setDeviceMetricsOverride", { width: genislik, height: yukseklik, deviceScaleFactor: 1, mobile: mobil });
  await bekle(400);
  const cekim = await gonder("Page.captureScreenshot", { format: "jpeg", quality: 82, captureBeyondViewport: true });
  const ad = `${yol.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "ana"}-${genislik}.jpg`;
  fs.writeFileSync(path.join(klasor, ad), Buffer.from(cekim.data, "base64"));
  console.log(`✓ ${ad} (${genislik}×${yukseklik})`);
}

if (hatalar.length) console.log("Konsol hataları:\n- " + [...new Set(hatalar)].join("\n- "));
soket.close();
chrome.kill();
