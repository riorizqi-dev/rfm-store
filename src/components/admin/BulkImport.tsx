'use client';

import { useState, useTransition } from 'react';
import { ProductLogo } from '@/components/Logo';
import { parsePricelist, type ParsedProduct } from '@/lib/parsePricelist';
import { formatPrice } from '@/lib/validate';
import { bulkImportAction } from '@/app/admin/actions';

const CONTOH = `NETFLIX PREMIUM
1 bulan 25k
3 bulan 65k
1 tahun 200k

SPOTIFY
1 bulan 15rb
3 bulan 40rb

Canva Pro 1 tahun 95.000
CapCut Pro 1 bulan 15k
Viu Premium 1 bulan 12k`;

export function BulkImport({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState<ParsedProduct[] | null>(null);
  const [replaceAll, setReplaceAll] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleParse = () => {
    setError('');
    const result = parsePricelist(text);
    if (result.length === 0) {
      setError(
        'Tidak ada produk yang terbaca. Pastikan tiap baris ada nama dan harga, contoh: "Netflix 1 bulan 25k".'
      );
      setParsed(null);
      return;
    }
    setParsed(result);
  };

  const updateItem = (idx: number, patch: Partial<ParsedProduct>) => {
    if (!parsed) return;
    setParsed(parsed.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const removeItem = (idx: number) => {
    if (!parsed) return;
    setParsed(parsed.filter((_, i) => i !== idx));
  };

  const handleImport = () => {
    if (!parsed || parsed.length === 0) return;
    setError('');
    const payload = parsed.map((p) => ({
      name: p.name,
      domain: p.domain,
      category: p.category,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
      variants: p.variants,
      features: p.features.length > 0 ? p.features : ['Akun siap pakai'],
      active: true,
      popular: false,
    }));

    const fd = new FormData();
    fd.set('items', JSON.stringify(payload));
    fd.set('replaceAll', String(replaceAll));

    startTransition(async () => {
      const res = await bulkImportAction(fd);
      if (res?.error) setError(res.error);
      else onDone();
    });
  };

  const inputClass =
    'w-full rounded-lg border border-ink-border bg-ink px-3 py-2 text-sm text-white focus:border-accent';

  if (parsed) {
    const unmatched = parsed.filter((p) => !p.matched).length;
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold">
            Pratinjau {parsed.length} produk
          </h3>
          <button
            onClick={() => setParsed(null)}
            className="text-sm text-zinc-400 hover:text-white"
          >
            Kembali edit teks
          </button>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <p className="text-sm text-zinc-400">
          Logo, kategori, dan deskripsi diisi otomatis untuk aplikasi yang
          dikenali.
          {unmatched > 0 && (
            <>
              {' '}
              <span className="text-yellow-400">
                {unmatched} produk belum dikenali
              </span>
              , cek kolom domain biar logonya muncul.
            </>
          )}
        </p>

        <div className="space-y-2">
          {parsed.map((p, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-ink-border bg-ink-card p-4"
            >
              <div className="flex items-start gap-3">
                <ProductLogo domain={p.domain} name={p.name} size={40} />
                <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                  <input
                    value={p.name}
                    onChange={(e) => updateItem(idx, { name: e.target.value })}
                    placeholder="Nama produk"
                    className={inputClass}
                  />
                  <input
                    value={p.domain}
                    onChange={(e) => updateItem(idx, { domain: e.target.value })}
                    placeholder="domain, cth: netflix.com"
                    className={inputClass}
                  />
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  className="p-1 text-red-400 hover:text-red-300"
                  aria-label={`Hapus ${p.name}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 pl-[52px]">
                {p.variants.map((v) => (
                  <span
                    key={v.label}
                    className="rounded-md border border-ink-border px-2 py-1 font-mono text-xs text-zinc-300"
                  >
                    {v.label} = {formatPrice(v.price)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <label className="flex items-start gap-2 rounded-lg border border-ink-border bg-ink-card p-3 text-sm">
          <input
            type="checkbox"
            checked={replaceAll}
            onChange={(e) => setReplaceAll(e.target.checked)}
            className="mt-0.5 accent-accent"
          />
          <span>
            Hapus semua produk lama dulu
            <span className="block text-xs text-zinc-500">
              Kalau tidak dicentang, produk hasil impor ditambahkan ke daftar
              yang sudah ada.
            </span>
          </span>
        </label>

        <button
          onClick={handleImport}
          disabled={isPending || parsed.length === 0}
          className="btn-primary w-full disabled:opacity-50"
        >
          {isPending
            ? 'Mengimpor...'
            : `Impor ${parsed.length} Produk Sekarang`}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold">Impor Cepat dari Pricelist</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Paste pricelist dari grup WhatsApp, sistem baca nama produk, durasi,
          dan harganya sekaligus.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        placeholder={CONTOH}
        className="w-full rounded-lg border border-ink-border bg-ink px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 focus:border-accent"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleParse}
          disabled={!text.trim()}
          className="btn-primary disabled:opacity-50"
        >
          Baca Pricelist
        </button>
        <button
          onClick={() => setText(CONTOH)}
          className="btn-secondary"
        >
          Isi Contoh
        </button>
      </div>

      <div className="rounded-lg border border-ink-border bg-ink-card p-4 text-xs text-zinc-400">
        <p className="mb-1.5 font-bold text-zinc-300">Format yang didukung</p>
        <ul className="space-y-1">
          <li>Nama di baris sendiri, lanjut varian: <code className="text-accent">NETFLIX</code> lalu <code className="text-accent">1 bulan 25k</code></li>
          <li>Satu baris satu produk: <code className="text-accent">Netflix 1 bulan 25k</code></li>
          <li>Harga: <code className="text-accent">25k</code>, <code className="text-accent">25rb</code>, <code className="text-accent">25.000</code>, <code className="text-accent">Rp25,000</code>, <code className="text-accent">1,5jt</code></li>
          <li>Durasi: <code className="text-accent">1 bulan</code>, <code className="text-accent">3 bln</code>, <code className="text-accent">1 tahun</code>, <code className="text-accent">7 hari</code></li>
        </ul>
      </div>
    </div>
  );
}
