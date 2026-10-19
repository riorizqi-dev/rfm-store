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
    keys: ['netflix', 'nflix', 'nf', 'netcark', 'netcrack'],
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
    keys: ['creativecloud', 'adobecc', 'photoshop', 'ps'],
    name: 'Adobe Creative Cloud',
    domain: 'adobe.com',
    category: 'Design',
    short: 'Adobe CC: Photoshop, Illustrator, Premiere Pro.',
    long: 'Akun Adobe Creative Cloud dengan akses aplikasi Adobe: Photoshop, Illustrator, Premiere Pro, After Effects, Lightroom, dan lainnya. Termasuk cloud storage dan Adobe Fonts.',
    features: ['Semua aplikasi Adobe', 'Cloud storage', 'Adobe Fonts', 'Update versi terbaru'],
  },
  {
    keys: ['lightroom', 'lr', 'adobelightroom'],
    name: 'Adobe Lightroom',
    domain: 'adobe.com',
    category: 'Design',
    short: 'Adobe Lightroom: preset premium, cloud storage, edit RAW.',
    long: 'Akun Adobe Lightroom Premium dengan akses semua preset, masking cerdas, healing brush, dan edit foto RAW.',
    features: ['Preset premium', 'Edit RAW & masking cerdas', 'Healing brush', 'Multi perangkat'],
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
  if (['tahun', 'thn', 'year', 'yr'].includes(u)) return `${n} Tahun`;
  if (['minggu', 'mgg', 'week', 'wk'].includes(u)) return `${n} Minggu`;
  return `${n} Bulan`;
}

function cleanLine(line: string): string {
  let s = line.trim();
  // Strip outer formatting wrappers like _text_, *text*, ~text~
  s = s.replace(/^([_*~]+)(.*?)\1$/u, '$2').trim();
  return s
    // buang bullet, emoji, quote guillemets, dan simbol hias di awal baris
    .replace(/^[\s\-*=>•·▪◆★☆✅✔️🔥💥📌👉→»›«‹_~]+/u, '')
    .replace(/[\s\-*=:•·_~]+$/u, '')
    .trim();
}

function looksLikeHeader(line: string): boolean {
  const l = line.toLowerCase();
  return (
    /^(list|price ?list|daftar|harga|promo|ready|stok|open|order|format|notes?|note's|catatan|syarat|ketentuan|kebijakan|snk|garansi|benefit|keunggulan|fitur|wa|admin|info)\b/.test(
      l
    ) || /^[=\-–—_~*]{3,}$/.test(line)
  );
}

function titleCase(s: string): string {
  return s.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

/**
 * Parse teks pricelist bebas menjadi daftar produk.
 */
export function parsePricelist(text: string): ParsedProduct[] {
  const lines = text.split(/\r?\n/);
  const products: ParsedProduct[] = [];
  let current: ParsedProduct | null = null;

  const startFromApp = (app: KnownApp): ParsedProduct => ({
    name: app.name,
    domain: app.domain,
    category: app.category,
    shortDescription: app.short,
    longDescription: app.long,
    features: [...app.features],
    variants: [],
    matched: true,
  });

  const startProduct = (rawName: string): ParsedProduct => {
    const app = matchApp(rawName);
    if (app) return startFromApp(app);
    const tidyName = rawName.replace(/\s+/g, ' ').trim();
    return {
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

  // Konteks kategori tingkat utama (✦ NETFLIX LINK, ✦ NETFLIX EMPASS, ✦ NETCARK, dll)
  let mainSectionContext: string | null = null;
  // Konteks garansi ([Full Garansi], [No Garansi])
  let tierContext: string | null = null;
  // Konteks profil / tipe paket (1P2U, 1P1U, Semi Private, dll)
  let profileContext: string | null = null;
  // Konteks sub-kategori (HARIAN, BULANAN, NO GARANSI, SEMI PRIVATE, dll)
  let subSectionContext: string | null = null;
  let notesMode = false;
  let benefitMode = false;
  const notesBuffer: string[] = [];

  for (const rawLine of lines) {
    const line = cleanLine(rawLine);
    if (!line) continue;
    // baris dekoratif: ━ ╭ ╮ 〔 〕 dan kawan-kawan
    if (/[\u2500-\u257F\u3014\u3015]/u.test(line)) continue;

    // Deteksi baris header section ✦ / ✧
    if (/^\s*[✦✧]/u.test(rawLine)) {
      const headerText = line.replace(/^[✦✧]\s*/u, '').trim();
      const lower = headerText.toLowerCase();

      const NOTES_WORDS = ['note', 'kebijakan', 'snk', 'ketentuan', 'syarat'];
      if (headerText.endsWith(':') || NOTES_WORDS.some((w) => lower.includes(w))) {
        notesMode = true;
        benefitMode = false;
        mainSectionContext = null;
        subSectionContext = null;
        continue;
      }

      if (lower.includes('benefit') || lower.includes('keunggulan') || lower.includes('fitur')) {
        benefitMode = true;
        notesMode = false;
        continue;
      }

      notesMode = false;
      benefitMode = false;

      // Cek apakah header section ini membawa nama aplikasi baru / produk
      const appInHeader = matchApp(headerText);
      if (appInHeader) {
        if (!current || normalizeKey(current.name) !== normalizeKey(appInHeader.name)) {
          pushCurrent();
          current = startFromApp(appInHeader);
          if (lower.includes('reseller')) {
            current.name = titleCase(headerText);
          }
        }
      }

      // Identifikasi tipe khusus (misal NetCark / Crack)
      if (lower.includes('netcark') || lower.includes('netcrack') || lower.includes('crack')) {
        mainSectionContext = 'Crack';
        subSectionContext = null;
        continue;
      }

      // Ekstrak konteks dari header (misal GEMINI PRO 18 BULAN -> 18 Bulan, atau NETFLIX LINK -> Link)
      const durMatch = headerText.match(DURATION_RE);
      if (durMatch) {
        mainSectionContext = normalizeDuration(durMatch[1], durMatch[2]);
      } else {
        let rest = headerText;
        for (const app of KNOWN_APPS) {
          for (const k of app.keys) {
            const re = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
            if (re.test(rest)) rest = rest.replace(re, ' ');
          }
        }
        rest = rest.replace(/\s+/g, ' ').replace(/^[\s\-/&]+|[\s\-/&]+$/g, '').trim();
        const lowerRest = rest.toLowerCase();
        const CONTEXT_REJECT = [
          'harga', 'price', 'ready', 'stok', 'order', 'info', 'promo', 'open',
          'list', 'admin', 'whatsapp', 'format', 'policy', 'baru',
        ];

        if (rest.length >= 2 && rest.length <= 25 && !CONTEXT_REJECT.some((w) => lowerRest.includes(w))) {
          mainSectionContext = titleCase(rest);
        } else {
          mainSectionContext = null;
        }
      }
      subSectionContext = null;
      continue;
    }

    // 1) coba ekstrak harga di baris
    // PENTING: Jika hanya ada pemisah spasi tanpa "Rp" / "k" / "rb", jangan anggap nomor versi (seperti "Veo 3.1") sebagai harga.
    const priceMatch = line.match(
      /(?::|=|\s)\s*(?:rp\.?\s*)?([\d][\d.,]*)\s*(jt|juta|k|rb|ribu)?\s*$/i
    );

    if (priceMatch && priceMatch.index !== undefined) {
      const matchedSeparatorAndPrice = priceMatch[0];
      const hasCurrencyOrColon = /[:=]|rp|k|rb|ribu/i.test(matchedSeparatorAndPrice);
      const rawNumStr = priceMatch[1];
      const hasUnit = Boolean(priceMatch[2]);

      // Jika nomor bertitik satu digit (seperti "3.1" atau "2.0") tanpa "Rp" atau "k", ini nomor versi bukan harga
      const isVersionNumber = /^\d+\.\d{1,2}$/.test(rawNumStr) && !hasUnit && !/rp/i.test(matchedSeparatorAndPrice);
      // Resolusi video seperti "4K" atau "8K" tanpa colon/equals/rp bukan harga
      const isResolution = !/[:=]|rp/i.test(matchedSeparatorAndPrice) && (rawNumStr === '4' || rawNumStr === '8') && /^k$/i.test(priceMatch[2] ?? '');

      if (hasCurrencyOrColon && !isVersionNumber && !isResolution) {
        const price = parsePrice(`${rawNumStr}${priceMatch[2] ?? ''}`);

        if (price) {
          notesMode = false;
          benefitMode = false;
        let before = line.slice(0, priceMatch.index).replace(/\s+/g, ' ').trim();
        before = before.replace(/\s*rp\.?\s*$/i, '').replace(/[:=\-\s]+$/, '').trim();

        const isGenericVariant = /^(satuan|ecer|grosir|reseller|paket|harga|user|profile|privat|private|sharing|\d+p\d+u|semi)\b/i.test(before);

        if (before.length < 2 || isGenericVariant) {
          if (!current) current = startProduct('Produk');
          const durMatchInBefore = before.match(DURATION_RE);
          let label = before.length >= 2 ? before : '1 Bulan';
          if (durMatchInBefore && durMatchInBefore.index !== undefined) {
            const pref = before.slice(0, durMatchInBefore.index).trim();
            const suff = before.slice(durMatchInBefore.index + durMatchInBefore[0].length).trim();
            const normDur = normalizeDuration(durMatchInBefore[1], durMatchInBefore[2]);
            label = [pref, normDur, suff].filter(Boolean).join(' ');
          }
          if (profileContext && !label.toUpperCase().includes(profileContext.toUpperCase())) {
            label = `${profileContext} ${label}`.trim();
          }
          if (tierContext && !label.toUpperCase().includes(tierContext.toUpperCase())) {
            label = `${tierContext} ${label}`.trim();
          } else if (subSectionContext && !label.toLowerCase().includes(subSectionContext.toLowerCase())) {
            label = `${subSectionContext} ${label}`.trim();
          }
          if (
            mainSectionContext &&
            !label.toLowerCase().includes(mainSectionContext.toLowerCase()) &&
            !current?.name.toLowerCase().includes(mainSectionContext.toLowerCase())
          ) {
            label = `[${mainSectionContext}] ${label}`.trim();
          }
          current.variants.push({ label, price });
          continue;
        }

        const app = matchApp(before);
        if (app) {
          let label = before;
          for (const k of app.keys) {
            const re = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
            if (re.test(label)) {
              label = label.replace(re, ' ');
              break;
            }
          }
          label = label
            .replace(/^[\s:•·\-]+/, '')
            .replace(/[\s:=\-]+$/, '')
            .replace(/\s+/g, ' ')
            .trim();
          label = label.replace(/^(pro|premium|vip|gold)\s+/i, '').trim();
          if (!label) {
            const d = before.match(DURATION_RE);
            label = d ? normalizeDuration(d[1], d[2]) : (mainSectionContext || '1 Bulan');
          }

          let tierPrefix = '';
          const subLower = (subSectionContext || '').toLowerCase();
          const mainLower = (mainSectionContext || '').toLowerCase();

          if (subLower.includes('no garansi') || subLower.includes('nogar') || label.toLowerCase().includes('no garansi')) {
            tierPrefix = '[No Garansi]';
          } else if (mainLower.includes('crack') || subLower.includes('crack') || label.toLowerCase().includes('mixplan') || label.toLowerCase().includes('premplan')) {
            tierPrefix = '[Crack]';
          } else if (mainLower.includes('empass') || label.toLowerCase().includes('empass')) {
            tierPrefix = '[Empass]';
          } else if (mainLower.includes('link') || label.toLowerCase().includes('link')) {
            tierPrefix = '[Link]';
          } else if (mainLower.includes('anti limit') || subLower.includes('anti limit') || label.toLowerCase().includes('anti limit')) {
            tierPrefix = '[Anti Limit]';
          } else if (mainLower.includes('semi') || subLower.includes('semi') || label.toLowerCase().includes('semi')) {
            tierPrefix = '[Semiprivate]';
          } else if (mainLower.includes('private') || subLower.includes('private') || label.toLowerCase().includes('private')) {
            tierPrefix = '[Private]';
          } else if (mainSectionContext && !label.toLowerCase().includes(mainLower)) {
            tierPrefix = `[${mainSectionContext}]`;
          }

          if (tierPrefix && !label.includes(tierPrefix)) {
            const cleanTierWord = tierPrefix.replace(/[\[\]]/g, '');
            const reDup = new RegExp(`^${cleanTierWord}\\s*-\\s*`, 'i');
            label = label.replace(reDup, '').trim();
            label = `${tierPrefix} ${label}`;
          }

          if (!current || normalizeKey(current.name) !== normalizeKey(app.name)) {
            pushCurrent();
            current = startFromApp(app);
          }
          current.variants.push({ label, price });
          continue;
        }

        // tidak dikenal tapi ada durasi
        const durMatch = before.match(DURATION_RE);
        if (durMatch && durMatch.index !== undefined) {
          const prefix = before
            .slice(0, durMatch.index)
            .replace(/[\s:=\-]+$/, '')
            .trim();
          const suffix = before
            .slice(durMatch.index + durMatch[0].length)
            .replace(/^[\s:=\-]+/, '')
            .trim();
          let label = normalizeDuration(durMatch[1], durMatch[2]);
          if (suffix.length >= 2) {
            label = `${label} ${suffix}`;
          }

          const otherApp = prefix ? matchApp(prefix) : null;
          const isVariantAttribute =
            /^(\d+p\d+u|semi|private|sharing|profile|user|screen|garansi|nogar|full|anti\s*limit|crack|empass|link)\b/i.test(
              prefix
            ) ||
            prefix.startsWith('[') ||
            prefix.startsWith('(');

          if (otherApp && normalizeKey(otherApp.name) !== normalizeKey(current?.name || '')) {
            pushCurrent();
            current = startFromApp(otherApp);
          } else if (!current && !isVariantAttribute && prefix.length >= 2 && /[a-z]/i.test(prefix)) {
            pushCurrent();
            current = startProduct(prefix);
          } else if (!current) {
            current = startProduct(before);
          }

          if (prefix.length >= 2 && isVariantAttribute && !label.toLowerCase().includes(prefix.toLowerCase())) {
            label = `${prefix} ${label}`.trim();
          }

          if (profileContext && !label.toUpperCase().includes(profileContext.toUpperCase())) {
            label = `${profileContext} ${label}`.trim();
          }

          if (tierContext && !label.toUpperCase().includes(tierContext.toUpperCase())) {
            label = `${tierContext} ${label}`.trim();
          } else if (subSectionContext && !label.toLowerCase().includes(subSectionContext.toLowerCase())) {
            label = `${subSectionContext} ${label}`.trim();
          }

          if (
            mainSectionContext &&
            !label.toLowerCase().includes(mainSectionContext.toLowerCase()) &&
            !current?.name.toLowerCase().includes(mainSectionContext.toLowerCase())
          ) {
            label = `[${mainSectionContext}] ${label}`.trim();
          }

          current.variants.push({ label, price });
          continue;
        }

        // tanpa durasi: jika sudah ada produk berjalan, jadikan varian
        if (current) {
          let label = before;
          if (profileContext && !label.toUpperCase().includes(profileContext.toUpperCase())) {
            label = `${profileContext} ${label}`.trim();
          }
          if (tierContext && !label.toUpperCase().includes(tierContext.toUpperCase())) {
            label = `${tierContext} ${label}`.trim();
          }
          if (mainSectionContext) label = `${mainSectionContext} - ${label}`;
          current.variants.push({ label, price });
          continue;
        }

        let label = '1 Bulan';
        if (profileContext) label = `${profileContext} ${label}`;
        if (tierContext) label = `${tierContext} ${label}`;
        if (mainSectionContext) label = `${mainSectionContext} ${label}`;
        pushCurrent();
        current = startProduct(before);
        current.variants.push({ label, price });
        continue;
      }
    }
  }

    // baris bullet tanpa harga
    const isBulletLine =
      /^\s*([•·▪]|[\-*]\s)/u.test(rawLine) && !/^\s*\*[^*]+\*\s*$/.test(rawLine);
    if (isBulletLine) {
      const bulletText = cleanLine(rawLine).replace(/^[\s:]+/, '').trim();
      if (benefitMode && current) {
        if (!current.features.includes(bulletText)) {
          current.features.push(bulletText);
        }
        continue;
      }

      if (
        (notesMode || !current) &&
        bulletText.length >= 8 &&
        bulletText.length <= 300 &&
        !/(admin|payment|bayar|chat\b|grup|group|transaksi|stok|order|snk)/i.test(bulletText)
      ) {
        notesBuffer.push(bulletText);
      }
      continue;
    }

    // Jika dalam benefit/notes mode tapi bukan bullet, cek apakah berpindah section
    const isNotesHeader =
      /^(s&k|snk|syarat|ketentuan|kebijakan|notes?|catatan)\b/i.test(line);
    if (isNotesHeader) {
      notesMode = true;
      benefitMode = false;
      continue;
    }

    if (benefitMode || notesMode) {
      // jika ada subheader baru atau aplikasi baru, keluar dari notes/benefit mode
      const isHeaderTransition =
        /^(harian|bulanan|semi|no\s*garansi|full\s*garansi|garansi|\d+p\d+u)/i.test(line) ||
        Boolean(matchApp(line));
      if (!isHeaderTransition) continue;
      notesMode = false;
      benefitMode = false;
    }

    // Baris sub-header atau garansi / profil
    if (/^(full\s*garansi|garansi\s*penuh|bergaransi|garansi)/i.test(line)) {
      tierContext = '[Full Garansi]';
      profileContext = null;
      subSectionContext = '[Full Garansi]';
      continue;
    }
    if (/^(no\s*garansi|nogar|tanpa\s*garansi)/i.test(line)) {
      tierContext = '[No Garansi]';
      profileContext = null;
      subSectionContext = '[No Garansi]';
      continue;
    }

    if (/^(\d+p\d+u|semi\s*private|semi\s*limit|semi|private|anti\s*limit)$/i.test(line)) {
      if (/(\d+p\d+u)/i.test(line)) {
        profileContext = line.toUpperCase().replace(/(\d+)P(\d+)U/i, '$1P$2U');
      } else {
        profileContext = titleCase(line);
      }
      subSectionContext = profileContext;
      continue;
    }

    const isSubHeader =
      /^(harian|bulanan|mingguan|tahunan|crack|sharing|link|empass)\b/i.test(
        line
      );

    if (isSubHeader) {
      subSectionContext = titleCase(line);
      continue;
    }

    // Cek apakah baris teks biasa ini adalah nama aplikasi (misal: GEMINI AI PRO di header kotak)
    const app = matchApp(line);
    if (app) {
      if (!current || normalizeKey(current.name) !== normalizeKey(app.name)) {
        pushCurrent();
        current = startFromApp(app);
      }
      continue;
    }

    // Jika sedang dalam produk yang berjalan dan baris ini tidak ada harga, anggap fitur/deskripsi bukan produk baru
    if (current) {
      if (line.length >= 3 && line.length <= 60 && !current.features.includes(line)) {
        current.features.push(line);
      }
      continue;
    }

    // sisanya produk baru
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
        // jangan buang varian dengan label sama, beri akhiran biar unik
        let label = v.label;
        let n = 2;
        while (exist.variants.some((x) => x.label === label)) {
          label = `${v.label} (${n++})`;
        }
        exist.variants.push({ ...v, label });
      }
    } else {
      merged.set(key, p);
    }
  }

  const list = Array.from(merged.values()).map((p) => ({
    ...p,
    variants: p.variants
      .slice()
      .sort((a, b) => parseInt(a.price, 10) - parseInt(b.price, 10)),
  }));

  // catatan / SnK dari pricelist masuk ke deskripsi produk terakhir
  if (notesBuffer.length > 0 && list.length > 0) {
    const last = list[list.length - 1];
    const extra = notesBuffer
      .slice(0, 10)
      .map((s) => s.slice(0, 200))
      .join('\n');
    last.longDescription = `${last.longDescription}\n\nSnK & Ketentuan:\n${extra}`.slice(
      0,
      1900
    );
  }

  return list;
}
