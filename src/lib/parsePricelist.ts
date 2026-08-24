/**
 * Parser pricelist WhatsApp -> produk.
 * Tujuan: admin cukup paste teks pricelist mentah dari grup, tidak input satu-satu.
 */

export type ParsedVariant = { label: string; price: string };

export type ParsedProduct = {
  name: string;
  domain: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  variants: ParsedVariant[];
  features: string[];
  matched: boolean;
};

type KnownApp = {
  keys: string[];
  name: string;
  domain: string;
  category: string;
  short: string;
  long: string;
  features: string[];
};

/**
 * Katalog aplikasi yang umum dijual di Indonesia.
 * Dipakai untuk mengisi domain, kategori, dan deskripsi otomatis
 * supaya admin tidak perlu menulis ulang tiap produk.
 */
const KNOWN_APPS: KnownApp[] = [
  {
    keys: ['netflix', 'nflix', 'nf'],
    name: 'Netflix Premium',
    domain: 'netflix.com',
    category: 'Streaming',
    short: 'Netflix Premium 4K Ultra HD, nonton tanpa iklan.',
    long: 'Akun Netflix Premium dengan kualitas sampai 4K Ultra HD dan HDR. Tonton ribuan film, series, anime, dan dokumenter tanpa iklan, termasuk download untuk offline.',
    features: ['Kualitas sampai 4K HDR', 'Tanpa iklan', 'Download offline', 'Semua perangkat'],
  },
  {
    keys: ['spotify', 'spoti', 'sptf'],
    name: 'Spotify Premium',
    domain: 'spotify.com',
    category: 'Music',
    short: 'Spotify Premium tanpa iklan, bisa download lagu.',
    long: 'Akun Spotify Premium. Dengarkan jutaan lagu dan podcast tanpa iklan, download untuk offline, kualitas audio tinggi, dan skip tanpa batas.',
    features: ['Tanpa iklan', 'Download lagu offline', 'Kualitas audio tinggi', 'Skip tanpa batas'],
  },
  {
    keys: ['youtube', 'yt', 'ytpremium'],
    name: 'YouTube Premium',
    domain: 'youtube.com',
    category: 'Streaming',
    short: 'YouTube Premium tanpa iklan, background play, YouTube Music.',
    long: 'Akun YouTube Premium. Tonton tanpa iklan, putar di background saat layar mati, download video untuk offline, dan akses YouTube Music Premium.',
    features: ['Tanpa iklan', 'Background play', 'Download video', 'YouTube Music'],
  },
  {
    keys: ['disney', 'disneyplus', 'hotstar', 'dhs'],
    name: 'Disney+ Hotstar',
    domain: 'disneyplus.com',
    category: 'Streaming',
    short: 'Disney+ Hotstar: Disney, Marvel, Star Wars, Pixar.',
    long: 'Akun Disney+ Hotstar dengan akses katalog Disney, Marvel, Star Wars, Pixar, dan National Geographic. Kualitas sampai 4K, bisa download offline.',
    features: ['Kualitas sampai 4K', 'Disney, Marvel, Star Wars', 'Download offline', 'Multi perangkat'],
  },
  {
    keys: ['viu'],
    name: 'Viu Premium',
    domain: 'viu.com',
    category: 'Streaming',
    short: 'Viu Premium: drama Korea dan Asia tanpa iklan.',
    long: 'Akun Viu Premium untuk nonton drama Korea, Jepang, Thailand, dan variety show tanpa iklan. Subtitle Indonesia, rilis cepat, bisa download offline.',
    features: ['Tanpa iklan', 'Subtitle Indonesia', 'Download offline', 'Rilis cepat drakor'],
  },
  {
    keys: ['wetv', 'we tv'],
    name: 'WeTV VIP',
    domain: 'wetv.vip',
    category: 'Streaming',
    short: 'WeTV VIP: drama China dan Asia tanpa iklan.',
    long: 'Akun WeTV VIP untuk nonton drama China, Korea, Thailand, dan original series tanpa iklan. Akses episode lebih awal dan kualitas HD.',
    features: ['Tanpa iklan', 'Episode lebih awal', 'Kualitas HD', 'Subtitle Indonesia'],
  },
  {
    keys: ['iqiyi', 'iq'],
    name: 'iQIYI VIP',
    domain: 'iq.com',
    category: 'Streaming',
    short: 'iQIYI VIP: drama Asia dan anime tanpa iklan.',
    long: 'Akun iQIYI VIP untuk nonton drama China, Korea, anime, dan original series tanpa iklan. Kualitas sampai 4K dan akses episode lebih awal.',
    features: ['Tanpa iklan', 'Kualitas sampai 4K', 'Episode lebih awal', 'Anime dan drama Asia'],
  },
  {
    keys: ['vidio'],
    name: 'Vidio Platinum',
    domain: 'vidio.com',
    category: 'Streaming',
    short: 'Vidio Platinum: liga bola, film, dan series.',
    long: 'Akun Vidio Platinum untuk nonton siaran olahraga, film, series Indonesia dan internasional. Termasuk akses siaran langsung liga.',
    features: ['Siaran olahraga langsung', 'Film dan series', 'Tanpa iklan', 'Kualitas HD'],
  },
  {
    keys: ['prime', 'primevideo', 'amazon'],
    name: 'Prime Video',
    domain: 'primevideo.com',
    category: 'Streaming',
    short: 'Prime Video: film dan original series.',
    long: 'Akun Prime Video untuk nonton film, series, dan Amazon Originals. Kualitas sampai 4K dan bisa download untuk offline.',
    features: ['Kualitas sampai 4K', 'Amazon Originals', 'Download offline', 'Multi perangkat'],
  },
  {
    keys: ['hbo', 'hbomax', 'max'],
    name: 'HBO Max',
    domain: 'hbomax.com',
    category: 'Streaming',
    short: 'HBO Max: film dan series HBO Original.',
    long: 'Akun HBO Max untuk nonton film box office, HBO Original series, dan konten Warner Bros. Kualitas sampai 4K tanpa iklan.',
    features: ['Tanpa iklan', 'HBO Originals', 'Kualitas sampai 4K', 'Download offline'],
  },
  {
    keys: ['canva'],
    name: 'Canva Pro',
    domain: 'canva.com',
    category: 'Design',
    short: 'Canva Pro: template premium, Background Remover, Brand Kit.',
    long: 'Akun Canva Pro dengan akses jutaan template premium, elemen, stok foto dan video, Background Remover, Magic Resize, dan Brand Kit.',
    features: ['Template premium', 'Background Remover', 'Magic Resize', 'Stok foto dan video'],
  },
  {
    keys: ['capcut', 'cap cut'],
    name: 'CapCut Pro',
    domain: 'capcut.com',
    category: 'Video Editor',
    short: 'CapCut Pro: export tanpa watermark, efek premium.',
    long: 'Akun CapCut Pro dengan akses semua efek, filter, transisi, dan font premium. Export tanpa watermark sampai 4K, plus fitur AI seperti auto caption.',
    features: ['Export tanpa watermark', 'Efek dan filter premium', 'Auto caption AI', 'Kualitas sampai 4K'],
  },
  {
    keys: ['adobe', 'photoshop', 'ps', 'creativecloud'],
    name: 'Adobe Creative Cloud',
    domain: 'photoshop.com',
    category: 'Design',
    short: 'Adobe CC: Photoshop, Illustrator, Premiere Pro.',
    long: 'Akun Adobe Creative Cloud dengan akses aplikasi Adobe: Photoshop, Illustrator, Premiere Pro, After Effects, Lightroom, dan lainnya. Termasuk cloud storage dan Adobe Fonts.',
    features: ['Semua aplikasi Adobe', 'Cloud storage', 'Adobe Fonts', 'Update versi terbaru'],
  },
  {
    keys: ['chatgpt', 'gpt', 'openai'],
    name: 'ChatGPT Plus',
    domain: 'chatgpt.com',
    category: 'AI Tools',
    short: 'ChatGPT Plus: model terbaru, priority access.',
    long: 'Akun ChatGPT Plus dengan akses model terbaru, image generation, browsing, dan data analysis. Priority access saat server sibuk.',
    features: ['Model terbaru', 'Image generation', 'Browsing dan analisis data', 'Priority access'],
  },
  {
    keys: ['gemini', 'googleone', 'google one', 'bard'],
    name: 'Gemini Advanced',
    domain: 'gemini.google.com',
    category: 'AI Tools',
    short: 'Gemini Advanced: model Google terbaru + storage.',
    long: 'Akun Gemini Advanced dengan akses model Gemini terbaru, integrasi Gmail dan Docs, serta tambahan Google Drive storage.',
    features: ['Model Gemini terbaru', 'Integrasi Gmail dan Docs', 'Google Drive storage', 'Akses fitur baru'],
  },
  {
    keys: ['alight', 'alightmotion', 'am'],
    name: 'Alight Motion Pro',
    domain: 'alightmotion.com',
    category: 'Video Editor',
    short: 'Alight Motion Pro: tanpa watermark, semua efek.',
    long: 'Akun Alight Motion Pro untuk edit video dan motion graphics. Export tanpa watermark, akses semua efek, dan cloud project.',
    features: ['Tanpa watermark', 'Semua efek premium', 'Motion graphics', 'Cloud project'],
  },
  {
    keys: ['picsart'],
    name: 'Picsart Gold',
    domain: 'picsart.com',
    category: 'Design',
    short: 'Picsart Gold: aset premium, tanpa watermark.',
    long: 'Akun Picsart Gold dengan akses ribuan template, sticker, font, dan efek premium. Edit foto dan video tanpa watermark.',
    features: ['Aset premium', 'Tanpa watermark', 'Remove background', 'Template eksklusif'],
  },
  {
    keys: ['duolingo'],
    name: 'Duolingo Super',
    domain: 'duolingo.com',
    category: 'Edukasi',
    short: 'Duolingo Super: tanpa iklan, nyawa tak terbatas.',
    long: 'Akun Duolingo Super untuk belajar bahasa tanpa iklan, dengan nyawa tak terbatas, latihan personal, dan progress quiz.',
    features: ['Tanpa iklan', 'Nyawa tak terbatas', 'Latihan personal', 'Progress quiz'],
  },
  {
    keys: ['office', 'microsoft', 'm365', 'office365'],
    name: 'Microsoft 365',
    domain: 'microsoft.com',
    category: 'Produktivitas',
    short: 'Microsoft 365: Word, Excel, PowerPoint + OneDrive.',
    long: 'Akun Microsoft 365 dengan aplikasi Word, Excel, PowerPoint, dan Outlook versi lengkap, plus OneDrive cloud storage.',
    features: ['Word, Excel, PowerPoint', 'OneDrive storage', 'Multi perangkat', 'Update versi terbaru'],
  },
  {
    keys: ['zoom'],
    name: 'Zoom Pro',
    domain: 'zoom.com',
    category: 'Produktivitas',
    short: 'Zoom Pro: meeting tanpa batas 40 menit.',
    long: 'Akun Zoom Pro untuk meeting tanpa batas durasi 40 menit, peserta lebih banyak, cloud recording, dan fitur host lanjutan.',
    features: ['Tanpa batas 40 menit', 'Peserta lebih banyak', 'Cloud recording', 'Fitur host lanjutan'],
  },
  {
    keys: ['telegram', 'tele', 'tg'],
    name: 'Telegram Premium',
    domain: 'telegram.org',
    category: 'Sosial',
    short: 'Telegram Premium: upload 4GB, badge, sticker eksklusif.',
    long: 'Akun Telegram Premium dengan upload file sampai 4GB, download lebih cepat, sticker dan reaksi eksklusif, serta badge premium.',
    features: ['Upload sampai 4GB', 'Download lebih cepat', 'Sticker eksklusif', 'Badge premium'],
  },
  {
    keys: ['tinder'],
    name: 'Tinder Gold',
    domain: 'tinder.com',
    category: 'Sosial',
    short: 'Tinder Gold: lihat yang nge-like, swipe tanpa batas.',
    long: 'Akun Tinder Gold dengan fitur lihat siapa yang menyukai profilmu, swipe tanpa batas, Super Like, dan Passport ke lokasi lain.',
    features: ['Lihat yang nge-like', 'Swipe tanpa batas', 'Super Like', 'Passport lokasi'],
  },
  {
    keys: ['vpn', 'nordvpn', 'expressvpn', 'surfshark'],
    name: 'VPN Premium',
    domain: 'nordvpn.com',
    category: 'Tools',
    short: 'VPN Premium: server global, tanpa batas kuota.',
    long: 'Akun VPN Premium dengan server di banyak negara, koneksi tanpa batas kuota, dan enkripsi untuk menjaga privasi saat browsing.',
    features: ['Server global', 'Tanpa batas kuota', 'Enkripsi koneksi', 'Multi perangkat'],
  },
];

function normalizeKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchApp(rawName: string): KnownApp | null {
  const flat = normalizeKey(rawName);
  if (!flat) return null;

  // cocokkan key terpanjang dulu supaya "youtube" tidak tertangkap "yt"
  const sorted = KNOWN_APPS.flatMap((app) =>
    app.keys.map((k) => ({ app, key: normalizeKey(k) }))
  ).sort((a, b) => b.key.length - a.key.length);

  for (const { app, key } of sorted) {
    if (flat.includes(key)) return app;
  }
  return null;
}

/** "25k" / "25rb" / "25.000" / "Rp 25,000" / "1,5jt" -> "25000" */
function parsePrice(raw: string): string | null {
  const cleaned = raw.toLowerCase().replace(/rp\.?/g, '').trim();
  const m = cleaned.match(/([\d]+(?:[.,][\d]+)*)\s*(jt|juta|k|rb|ribu)?/);
  if (!m) return null;

  const numRaw = m[1];
  const unit = m[2];

  let num: number;
  if (unit === 'jt' || unit === 'juta') {
    num = parseFloat(numRaw.replace(',', '.')) * 1_000_000;
  } else if (unit === 'k' || unit === 'rb' || unit === 'ribu') {
    num = parseFloat(numRaw.replace(',', '.')) * 1_000;
  } else {
    // tanpa satuan: titik/koma dianggap pemisah ribuan
    num = parseInt(numRaw.replace(/[.,]/g, ''), 10);
    // angka kecil tanpa satuan di pricelist biasanya ribuan (mis. "25" = 25rb)
    if (num > 0 && num < 1000) num = num * 1000;
  }

  if (!isFinite(num) || num <= 0) return null;
  return String(Math.round(num));
}

const DURATION_RE =
  /(\d+)\s*(bulan|bln|bl|mo|month|hari|hr|day|days|tahun|thn|year|yr|minggu|mgg|week|wk)\b/i;

function normalizeDuration(count: string, unit: string): string {
  const n = parseInt(count, 10);
  const u = unit.toLowerCase();
  if (['bulan', 'bln', 'bl', 'mo', 'month'].includes(u)) {
    return n === 12 ? '12 Bulan' : `${n} Bulan`;
  }
  if (['hari', 'hr', 'day', 'days'].includes(u)) return `${n} Hari`;
  if (['tahun', 'thn', 'year', 'yr'].includes(u)) return `${n * 12} Bulan`;
  if (['minggu', 'mgg', 'week', 'wk'].includes(u)) return `${n} Minggu`;
  return `${n} Bulan`;
}

function cleanLine(line: string): string {
  return line
    // buang bullet, emoji, dan simbol hias di awal baris
    .replace(/^[\s\-*=>•·▪◆★☆✅✔️🔥💥📌👉→]+/u, '')
    .replace(/[\s\-*=:•·]+$/u, '')
    .trim();
}

function looksLikeHeader(line: string): boolean {
  const l = line.toLowerCase();
  return (
    /^(list|price ?list|daftar|harga|promo|ready|stok|open|order|format|note|catatan|syarat|garansi|wa|admin|info)\b/.test(
      l
    ) || /^[=\-–—_~*]{3,}$/.test(line)
  );
}

/**
 * Parse teks pricelist bebas menjadi daftar produk.
 * Mendukung dua gaya umum:
 *   A) nama di baris sendiri, varian di baris berikutnya
 *      NETFLIX
 *      1 bulan 25k
 *      3 bulan 65k
 *   B) satu baris satu produk
 *      Netflix 1 bulan 25k
 */
export function parsePricelist(text: string): ParsedProduct[] {
  const lines = text.split(/\r?\n/);
  const products: ParsedProduct[] = [];
  let current: ParsedProduct | null = null;

  const startProduct = (rawName: string): ParsedProduct => {
    const app = matchApp(rawName);
    const tidyName = rawName.replace(/\s+/g, ' ').trim();
    return app
      ? {
          name: app.name,
          domain: app.domain,
          category: app.category,
          shortDescription: app.short,
          longDescription: app.long,
          features: [...app.features],
          variants: [],
          matched: true,
        }
      : {
          name: tidyName,
          domain: '',
          category: 'Lainnya',
          shortDescription: `Akun ${tidyName} siap pakai.`,
          longDescription: `Akun ${tidyName}. Detail lengkap dan ketentuan garansi bisa ditanyakan ke admin sebelum order.`,
          features: [],
          variants: [],
          matched: false,
        };
  };

  const pushCurrent = () => {
    if (current && current.variants.length > 0) products.push(current);
    current = null;
  };

  for (const rawLine of lines) {
    const line = cleanLine(rawLine);
    if (!line) continue;
    if (looksLikeHeader(line)) continue;

    const durMatch = line.match(DURATION_RE);
    const hasDigit = /\d/.test(line);

    if (!hasDigit) {
      // baris tanpa angka: nama produk baru
      pushCurrent();
      current = startProduct(line);
      continue;
    }

    if (durMatch && durMatch.index !== undefined) {
      const prefix = line.slice(0, durMatch.index).trim();
      const after = line.slice(durMatch.index + durMatch[0].length);
      const price = parsePrice(after);

      if (!price) {
        // ada durasi tapi harga tidak terbaca, anggap baris nama
        pushCurrent();
        current = startProduct(line);
        continue;
      }

      const label = normalizeDuration(durMatch[1], durMatch[2]);

      // prefix cukup panjang dan mengandung huruf: produk baru di satu baris
      if (prefix.length >= 2 && /[a-z]/i.test(prefix)) {
        pushCurrent();
        current = startProduct(prefix);
      }
      if (!current) current = startProduct(prefix || 'Produk');

      current.variants.push({ label, price });
      continue;
    }

    // tidak ada durasi: coba ambil harga dari akhir baris
    const priceOnly = line.match(/([\d]+(?:[.,][\d]+)*\s*(?:jt|juta|k|rb|ribu)?)\s*$/i);
    if (priceOnly) {
      const price = parsePrice(priceOnly[1]);
      const prefix = line.slice(0, priceOnly.index).replace(/[=:\-]+$/, '').trim();
      if (price) {
        if (prefix.length >= 2 && /[a-z]/i.test(prefix)) {
          pushCurrent();
          current = startProduct(prefix);
        }
        if (!current) current = startProduct(prefix || 'Produk');
        current.variants.push({ label: '1 Bulan', price });
        continue;
      }
    }

    // sisanya diperlakukan sebagai nama produk
    pushCurrent();
    current = startProduct(line);
  }

  pushCurrent();

  // gabungkan produk dengan nama sama, urutkan varian dari termurah
  const merged = new Map<string, ParsedProduct>();
  for (const p of products) {
    const key = normalizeKey(p.name);
    const exist = merged.get(key);
    if (exist) {
      for (const v of p.variants) {
        if (!exist.variants.some((x) => x.label === v.label)) exist.variants.push(v);
      }
    } else {
      merged.set(key, p);
    }
  }

  return Array.from(merged.values()).map((p) => ({
    ...p,
    variants: p.variants
      .slice()
      .sort((a, b) => parseInt(a.price, 10) - parseInt(b.price, 10)),
  }));
}
