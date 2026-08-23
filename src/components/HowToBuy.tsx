import { Reveal } from './Reveal';

const steps = [
  {
    num: '01',
    title: 'Pilih Produk',
    desc: 'Lihat daftar produk, klik detail, pilih durasi yang kamu butuhkan.',
    meta: '~ 1 menit',
  },
  {
    num: '02',
    title: 'Chat Admin',
    desc: 'Klik tombol Chat Admin, pesan otomatis terisi nama produk. Atau join grup untuk tanya stok dulu.',
    meta: 'instan',
  },
  {
    num: '03',
    title: 'Bayar via QRIS',
    desc: 'Scan QRIS pakai e-wallet atau m-banking apa aja, kirim bukti bayar ke admin.',
    meta: '~ 2 menit',
  },
  {
    num: '04',
    title: 'Akun Dikirim',
    desc: 'Akun premium dikirim langsung ke WhatsApp kamu. Login, langsung pakai.',
    meta: 'langsung aktif',
  },
];

export function HowToBuy() {
  return (
    <section id="cara" className="relative z-[1] mx-auto max-w-[1150px] px-6 py-[84px]">
      <Reveal>
        <div className="mb-11 flex flex-wrap items-end justify-between gap-6 border-b border-ink-border pb-[22px]">
          <div>
            <p className="section-tag">03 — Cara Beli</p>
            <h2 className="font-disp text-[clamp(1.55rem,3.4vw,2.05rem)] font-bold leading-[1.15] tracking-[-0.025em]">
              Cara order
            </h2>
          </div>
          <p className="max-w-[380px] pb-1 text-[0.88rem] text-muted sm:text-right">
            Gampang banget, cuma 4 langkah. Semua transaksi via WhatsApp.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="flex flex-col">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group flex items-baseline gap-[26px] border-b border-ink-border px-1 py-6 transition-[padding] duration-200 first:border-t hover:pl-3.5"
            >
              <span className="min-w-[56px] font-mono text-[1.6rem] font-bold text-accent">
                {step.num}
              </span>
              <div>
                <h3 className="mb-1 font-disp text-base font-bold">{step.title}</h3>
                <p className="text-[0.85rem] text-muted">{step.desc}</p>
              </div>
              <span className="ml-auto hidden shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-muted sm:block">
                {step.meta}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
