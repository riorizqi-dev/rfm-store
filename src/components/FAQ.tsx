import { Reveal } from './Reveal';

const faqs = [
  {
    q: 'Akunnya legal dan aman dipakai?',
    a: 'Semua akun adalah akun premium resmi yang dijalankan sesuai ketentuan masing-masing layanan (skema family/sharing atau seat resmi). Sebagian besar produk bergaransi selama masa berlangganan, dengan ketentuan yang beda tiap aplikasi.',
  },
  {
    q: 'Pembayarannya lewat apa aja?',
    a: 'QRIS, scan pakai aplikasi e-wallet apa aja (DANA, GoPay, OVO, ShopeePay) atau m-banking. QRIS dikasih admin pas order. Kirim bukti bayar, akun langsung diproses.',
  },
  {
    q: 'Berapa lama prosesnya sampai akun dikirim?',
    a: 'Begitu pembayaran dikonfirmasi admin, akun langsung dikirim ke WhatsApp kamu. Selama admin online, prosesnya hitungan menit.',
  },
  {
    q: 'Kalau akun bermasalah di tengah jalan gimana?',
    a: 'Ketenanganmu prioritas kami. Produk yang termasuk garansi langsung diganti kalau ada masalah selama masa berlangganan (logout paksa, error, tidak bisa dipakai). Karena ketentuan garansi beda tiap aplikasi, tanya admin dulu sebelum order buat mastiin produk yang kamu mau included.',
  },
  {
    q: 'Apakah harus daftar akun di website ini?',
    a: 'Tidak perlu. Website ini cuma katalog produk. Semua transaksi, tanya jawab, dan pengiriman akun dilakukan langsung via WhatsApp admin atau grup.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative z-[1] mx-auto max-w-[1150px] px-6 py-[84px]">
      <Reveal>
        <div className="mb-11 flex flex-wrap items-end justify-between gap-6 border-b border-ink-border pb-[22px]">
          <div>
            <p className="section-tag">04 — FAQ</p>
            <h2 className="font-disp text-[clamp(1.55rem,3.4vw,2.05rem)] font-bold leading-[1.15] tracking-[-0.025em]">
              Pertanyaan umum
            </h2>
          </div>
          <p className="max-w-[380px] pb-1 text-[0.88rem] text-muted sm:text-right">
            Masih bingung? Cek dulu di sini, atau langsung chat admin.
          </p>
        </div>
      </Reveal>

      <div className="space-y-2.5">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <div className="rounded-[10px] border border-ink-border bg-ink-card transition-colors hover:border-ink-strong">
              <p className="px-5 pb-2 pt-[17px] text-[0.9rem] font-semibold">{f.q}</p>
              <p className="px-5 pb-[18px] text-[0.85rem] leading-[1.75] text-muted">
                {f.a}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
