'use client';

import { useState, useEffect } from 'react';
import type { Settings } from '@/lib/products';
import { waLink } from '@/lib/utils';

type HeroProps = {
  settings: Pick<Settings, 'tagline' | 'waNumber' | 'waGroup' | 'waDefaultMessage'>;
};

export function Hero({ settings }: HeroProps) {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="relative z-[1] overflow-hidden">
      {/* ambient glow: nempel ke tepi viewport biar kiri-kanan seimbang */}
      <div
        aria-hidden
        className="hero-glow glow-lime animate-drift -left-40 -top-40 h-[560px] w-[560px]"
      />
      <div
        aria-hidden
        className="hero-glow glow-green animate-drift-slow -right-32 top-32 h-[480px] w-[480px]"
      />

      <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-6 pb-16 pt-[130px] lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:pt-[150px]">
        <div className="relative">
        <span className="mb-6 inline-flex items-center gap-2.5 rounded-md border border-ink-strong bg-accent-dim px-3.5 py-[7px] font-mono text-[0.72rem] font-medium uppercase tracking-[0.1em] text-accent">
          <span className="h-[7px] w-[7px] animate-blink rounded-full bg-accent" />
          {settings.tagline}
        </span>

        <h1 className="font-disp text-[clamp(2.3rem,5.2vw,3.7rem)] font-bold leading-[1.08] tracking-[-0.03em]">
          Semua aplikasi premium.{' '}
          <span
            style={{ animation: 'hackerNeonFlicker 2s infinite' }}
            className="relative inline-block text-accent animate-cyber-glow"
          >
            Harga mulai Rp1rb.
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-accent via-accent-bright to-transparent opacity-80" />
          </span>
        </h1>

        <p className="mb-8 mt-5 max-w-[480px] leading-[1.75] text-muted">
          Akses <strong className="font-semibold text-body">Netflix, Spotify, Canva, CapCut</strong>, dan
          lainnya. Cukup <strong className="font-semibold text-body">chat admin via WhatsApp</strong>,
          tanpa perlu daftar akun di web ini.
        </p>

        <div className="mb-11 flex flex-wrap items-center gap-3">
          <a
            href={waLink(settings.waNumber, settings.waDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Chat Admin
          </a>
          <a
            href={settings.waGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Join Grup
          </a>
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent-dim/60 px-5 py-3 font-mono text-sm font-bold text-accent shadow-[0_0_15px_rgba(201,241,88,0.1)] transition-all hover:border-accent hover:bg-accent hover:text-accent-ink"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-xs">▶</span>
            Tonton Video Promo
          </button>
        </div>

        {/* stats */}
        <div className="relative grid w-fit grid-cols-2 overflow-hidden rounded-[10px] border border-ink-border bg-ink-surface/80 backdrop-blur-sm sm:grid-cols-4">
          {[
            { value: '10+', label: 'Aplikasi' },
            { value: 'Rp1rb', label: 'Harga mulai' },
            { value: 'WA', label: 'Transaksi manual' },
            { value: 'Penuh', label: 'Garansi sesuai aplikasi' },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`border-ink-border px-5 py-3.5 ${
                i < 3 ? 'border-r' : ''
              } max-sm:border-b max-sm:odd:border-r max-sm:even:border-r-0`}
            >
              <p className="font-mono text-xl font-bold tracking-[-0.02em] text-accent">
                {s.value}
              </p>
              <p className="mt-[3px] font-mono text-[0.62rem] uppercase tracking-[0.06em] text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* terminal card: ilustrasi alur order, bukan testimoni */}
      <div className="relative overflow-hidden rounded-xl border border-ink-strong bg-ink-inset/90 font-mono shadow-[10px_10px_0_rgba(201,241,88,0.06)] backdrop-blur-sm">
        <div className="flex items-center gap-[7px] border-b border-ink-border bg-ink-surface px-3.5 py-[11px]">
          <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
          <span className="ml-auto text-[0.68rem] tracking-[0.04em] text-muted">
            order.log — contoh alur
          </span>
        </div>
        <div className="p-[18px] text-[0.76rem] leading-[1.75]">
          <p>
            <span className="text-accent">$</span>{' '}
            <span className="text-body">chat admin</span>
          </p>
          <p className="mt-3 text-muted">&gt; &quot;bang, netflix 3 bulan ready?&quot;</p>
          <p className="text-body">&lt; &quot;ready kak, 65rb. proses sekarang?&quot;</p>
          <p className="mt-3 text-muted">&gt; &quot;gas, bayar dana&quot;</p>
          <p className="text-body">&lt; &quot;siap kak, scan QRIS-nya dulu ya&quot;</p>
          <p className="mt-3 text-[#00d68f]">✓ bukti bayar terkirim</p>
          <p className="text-body">&lt; &quot;akun dikirim: n****@mail.com&quot;</p>
          <p className="mt-3 text-[#5f665a]">
            ● order selesai <span className="text-accent">— garansi sesuai aplikasi</span>
          </p>
          <p className="mt-2 flex items-center gap-1.5">
            <span className="font-bold text-accent">$</span>{' '}
            <span
              className={`inline-block h-[1.1em] w-[9px] rounded-[1px] bg-accent align-middle transition-opacity duration-75 ${
                cursorVisible
                  ? 'opacity-100 shadow-[0_0_8px_rgba(201,241,88,0.9)]'
                  : 'opacity-0'
              }`}
            />
          </p>
        </div>
      </div>
      {/* Modal Video Promo Commercial */}
      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-ink-strong bg-ink-card shadow-[0_0_50px_rgba(201,241,88,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink-border bg-ink-surface px-5 py-3">
              <div className="flex items-center gap-2 font-mono text-xs text-accent">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span>RFMSTORE // OFFICIAL PROMO VIDEO</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-ink-border hover:text-white"
                aria-label="Tutup Video"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <video
                src="/rfm_store_commercial.mp4"
                controls
                autoPlay
                className="h-full w-full object-contain"
              >
                Browser Anda tidak mendukung tag video.
              </video>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
