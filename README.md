# RFMstore — Landing Page Jualan Akun Premium

**Live:** [www.ryuuka.web.id](https://www.ryuuka.web.id)

Landing page katalog produk digital (akun/aplikasi premium) dengan alur transaksi manual via WhatsApp. Pengunjung tidak perlu daftar, tidak ada cart, dan tidak ada payment gateway: mereka lihat produk, klik detail, lalu lanjut chat admin atau join grup WhatsApp.

Di belakangnya ada dashboard admin tersembunyi untuk kelola produk, kirim broadcast, dan ubah info halaman tanpa menyentuh kode.

## Fitur

**Halaman publik**

- Hero dengan efek terminal + glow bergerak, harga termurah dihitung otomatis dari data produk
- Ticker berjalan berisi nama produk, harga mulai, metode bayar, dan info saluran WA
- Section alasan beli, grid produk, cara order 4 langkah, FAQ, dan CTA
- Modal detail produk: deskripsi lengkap, pilihan durasi, daftar fitur, dan tombol yang mengarah ke WhatsApp dengan pesan otomatis berisi nama produk dan varian yang dipilih
- Logo aplikasi asli diambil dari [Logo.dev](https://logo.dev) berdasarkan domain produk, dengan fallback inisial kalau logo gagal dimuat
- Mobile-first, keyboard accessible, punya empty state dan error state

**Dashboard admin (tersembunyi)**

- URL rahasia yang tidak di-link dari mana pun di halaman publik
- CRUD produk lengkap: nama, domain logo, kategori, deskripsi, varian durasi/harga dinamis, daftar fitur, status aktif, dan penanda terlaris
- Buat pesan broadcast dan generate link WhatsApp siap kirim, plus riwayatnya
- Ubah nama toko, tagline, teks about, nomor WA, link grup, dan link saluran

## Tech Stack

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Actions) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS |
| Font | Space Grotesk (judul), Inter (body), JetBrains Mono (angka & label) |
| Auth admin | bcryptjs + JWT (jose) di HTTP-only cookie |
| Validasi | Zod |
| Data | Postgres kalau `POSTGRES_URL` diisi, kalau tidak fallback ke file JSON lokal |
| Logo produk | Logo.dev image API |

## Menjalankan Secara Lokal

```bash
git clone https://github.com/riorizqi-dev/rfm-store.git
cd rfm-store
npm install
cp .env.example .env.local
```

Isi `.env.local`, lalu:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Environment Variables

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `ADMIN_SECRET` | ya | Path rahasia dashboard admin. Jangan pernah commit nilai aslinya ke repo |
| `ADMIN_USERNAME` | ya | Username login admin |
| `ADMIN_PASSWORD_HASH` | ya | Hash bcrypt password admin |
| `JWT_SECRET` | ya | String acak panjang untuk menandatangani session |
| `NEXT_PUBLIC_WA_NUMBER` | ya | Nomor WA admin format internasional, mis. `6285810383881` |
| `NEXT_PUBLIC_WA_MESSAGE` | ya | Pesan default saat pengunjung klik Chat Admin |
| `NEXT_PUBLIC_WA_GROUP` | ya | Link invite grup WhatsApp |
| `NEXT_PUBLIC_WA_CHANNEL` | tidak | Link saluran WhatsApp |
| `NEXT_PUBLIC_LOGO_DEV_API_KEY` | ya | Publishable key Logo.dev, diawali `pk_` |
| `POSTGRES_URL` | tidak | Connection string Postgres. Wajib kalau deploy ke Vercel agar admin bisa simpan data |

### Membuat hash password admin

```bash
node -e "console.log(require('bcryptjs').hashSync('passwordbaru',12))"
```

Hash bcrypt mengandung karakter `$`, dan Next.js akan menganggapnya sebagai variabel. **Escape setiap `$` menjadi `\$`** saat menempel ke file env:

```env
ADMIN_PASSWORD_HASH=\$2a\$12\$contohhashnyapanjangsekali
```

Kalau tidak di-escape, hash terpotong saat dibaca dan login akan selalu gagal.

### Logo.dev key

Endpoint gambar Logo.dev hanya menerima **publishable key** (`pk_...`). Secret key (`sk_...`) akan ditolak dengan pesan `invalid api token`.

## Akses Dashboard Admin

Dashboard admin tidak di-link dari mana pun di halaman publik. Aksesnya lewat path rahasia yang lo tentuin sendiri lewat environment variable `ADMIN_SECRET`:

```
https://domain-kamu.com/<ADMIN_SECRET>
```

Path `/admin` dan `/admin/*` sengaja dialihkan ke halaman utama, jadi satu-satunya jalan masuk adalah lewat path rahasia. Halaman admin juga diberi `noindex` supaya tidak muncul di hasil pencarian.

> **Praktik keamanan:** jangan pernah tulis nilai `ADMIN_SECRET` asli di README, screenshot, atau tempat publik lainnya. Kalau tidak sengaja kebocor, langsung ganti nilainya di environment variable lalu redeploy — path lama otomatis mati.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Import project di Vercel.
3. Tambahkan semua environment variable di atas pada Settings, termasuk `POSTGRES_URL`.
4. Deploy.

Filesystem Vercel bersifat read-only, jadi tanpa `POSTGRES_URL` halaman publik tetap tampil normal tetapi tombol simpan di dashboard admin akan gagal. Database gratis bisa diambil dari Vercel Postgres, Neon, atau Supabase. Tabel dibuat otomatis pada request pertama, dan isi `src/data/products.json` dipakai sebagai data awal.

## Catatan Keamanan

- Password admin disimpan sebagai hash bcrypt (12 rounds), tidak pernah dalam bentuk plain text dan tidak pernah ada di kode frontend
- Session memakai JWT di cookie `httpOnly` dengan masa berlaku 8 jam
- Form login dibatasi 5 percobaan per menit per IP
- Semua input admin melewati sanitasi penghapusan tag HTML dan validasi schema Zod
- Tidak ada data pembayaran yang disimpan di aplikasi ini
- Semua file `.env*` masuk `.gitignore` kecuali `.env.example`

## Struktur Proyek

```
src/
├── app/
│   ├── admin/
│   │   ├── actions.ts        Server Actions: login, CRUD, broadcast, settings
│   │   ├── dashboard/        Dashboard admin (butuh session)
│   │   └── page.tsx          Halaman login admin
│   ├── globals.css           Design tokens, komponen, animasi
│   ├── layout.tsx
│   └── page.tsx              Landing page
├── components/
│   ├── admin/                UI dashboard admin
│   ├── Hero.tsx  Ticker.tsx  WhyUs.tsx  ProductSection.tsx
│   ├── HowToBuy.tsx  FAQ.tsx  CTASection.tsx  Footer.tsx
│   ├── Logo.tsx              Logo produk via Logo.dev + fallback
│   └── Reveal.tsx            Animasi muncul saat scroll
├── data/products.json        Data awal / penyimpanan mode lokal
├── lib/
│   ├── auth.ts               Verifikasi kredensial & session JWT
│   ├── products.ts           Layer data: Postgres atau JSON
│   ├── rateLimit.ts          Pembatas percobaan login
│   └── validate.ts           Schema Zod & sanitasi input
└── middleware.ts             Penjaga path rahasia admin
```

## Disclaimer

Proyek ini adalah template landing page. Semua merek dan logo aplikasi yang tampil adalah milik pemiliknya masing-masing. Pastikan penjualan yang kamu lakukan mematuhi ketentuan layanan dari masing-masing penyedia aplikasi.
