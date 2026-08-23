import type { Settings } from '@/lib/products';
import { Reveal } from './Reveal';

type WhyUsProps = {
  settings: Pick<Settings, 'aboutTitle' | 'aboutText'>;
};

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    title: 'Harga Termurah',
    desc: 'Jauh lebih murah dari langganan langsung. Bayar sesuai durasi, tanpa biaya tersembunyi.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'Multi Aplikasi',
    desc: 'Streaming, desain, editor video, sampai AI tools. Semua bisa diorder dari satu tempat.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Proses Cepat',
    desc: 'Order langsung diproses. Akun dikirim begitu pembayaran dikonfirmasi admin.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Garansi Sesuai Aplikasi',
    desc: 'Ketentuan garansi beda tiap aplikasi. Yang termasuk coverage langsung diganti kalau bermasalah.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    title: 'Transaksi Mudah',
    desc: 'Bayar via WhatsApp tanpa perlu daftar akun atau checkout online yang ribet.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Support Responsif',
    desc: 'Butuh bantuan? Chat WhatsApp langsung. Dijawab admin beneran, bukan bot.',
  },
];

export function WhyUs({ settings }: WhyUsProps) {
  return (
    <section id="kenapa" className="relative z-[1] mx-auto max-w-[1150px] px-6 py-[84px]">
      <Reveal>
        <div className="mb-11 flex flex-wrap items-end justify-between gap-6 border-b border-ink-border pb-[22px]">
          <div>
            <p className="section-tag">01 — Kenapa Kami</p>
            <h2 className="font-disp text-[clamp(1.55rem,3.4vw,2.05rem)] font-bold leading-[1.15] tracking-[-0.025em]">
              Satu chat,
              <br />
              semua aplikasi.
            </h2>
          </div>
          <p className="max-w-[380px] pb-1 text-[0.88rem] text-muted sm:text-right">
            {settings.aboutText.split('.')[0]}. Gak perlu daftar ke banyak
            layanan. Cukup chat admin, pilih aplikasi, bayar, langsung pakai.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
            <div className="card-hover group relative h-full rounded-[10px] border border-ink-border bg-ink-card p-6">
              <span className="absolute right-4 top-3.5 font-mono text-[0.9rem] text-ink-strong transition-colors group-hover:text-accent">
                +
              </span>
              <div className="mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-ink-strong bg-accent-dim text-accent">
                {f.icon}
              </div>
              <h3 className="mb-[7px] font-disp text-[0.98rem] font-bold">{f.title}</h3>
              <p className="text-[0.83rem] leading-[1.7] text-muted">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
