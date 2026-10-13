'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductLogo } from './Logo';
import { Reveal } from './Reveal';
import { formatPrice } from '@/lib/validate';
import { waLink } from '@/lib/utils';
import type { Product, Settings } from '@/lib/products';

type ProductSectionProps = {
  products: Product[];
  settings: Pick<Settings, 'waNumber' | 'waGroup'>;
};

function VariantSelector({
  variants,
  selectedIdx,
  onSelect,
}: {
  variants: Product['variants'];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}) {
  // Kelompokkan varian berdasarkan tipe & garansi
  const getCategory = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('no garansi') || l.includes('nogar')) return 'No Garansi';
    if (l.includes('crack') || l.includes('mixplan') || l.includes('premplan') || l.includes('netcark')) return 'Crack / Non-Garansi';
    if (l.includes('link')) return 'Garansi Link';
    if (l.includes('empass')) return 'Garansi Empass';
    if (l.includes('anti limit')) return 'Anti Limit';
    if (l.includes('private')) return 'Private';
    if (l.includes('semiprivate') || l.includes('semi private')) return 'Semiprivate';
    if (l.includes('harian')) return 'Harian';
    if (l.includes('bulanan')) return 'Bulanan';
    return 'Lainnya';
  };

  // Kumpulkan list kategori unik
  const rawCats = Array.from(new Set(variants.map((v) => getCategory(v.label))));
  const categories = rawCats.length > 1 ? ['Semua', ...rawCats] : ['Semua'];

  const [activeCategory, setActiveCategory] = useState('Semua');

  const filtered = variants
    .map((v, originalIdx) => ({ ...v, originalIdx }))
    .filter((v) => activeCategory === 'Semua' || getCategory(v.label) === activeCategory);

  return (
    <div className="space-y-3">
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-1.5 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1 font-mono text-[0.68rem] font-bold uppercase transition-all ${
                activeCategory === cat
                  ? 'bg-accent text-accent-ink shadow-sm'
                  : 'bg-ink-border/40 text-muted hover:bg-ink-border hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid max-h-56 gap-2 overflow-y-auto pr-1">
        {filtered.map((variant) => (
          <button
            key={variant.originalIdx}
            type="button"
            onClick={() => onSelect(variant.originalIdx)}
            className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-all ${
              selectedIdx === variant.originalIdx
                ? 'border-accent bg-accent-dim ring-1 ring-accent'
                : 'border-ink-border bg-ink hover:border-ink-strong'
            }`}
          >
            <span className="text-sm font-medium text-white">{variant.label}</span>
            <span className="font-mono text-sm font-bold text-accent">
              {formatPrice(variant.price)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onDetail,
}: {
  product: Product;
  onDetail: () => void;
}) {
  const prices = product.variants
    .map((v) => parseInt(v.price, 10))
    .filter((p) => !isNaN(p));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  return (
    <button
      onClick={onDetail}
      className="card-hover group relative flex w-full flex-col gap-4 rounded-[10px] border border-ink-border bg-ink-card p-5 text-left"
    >
      <span className="absolute right-4 top-3.5 font-mono text-[0.9rem] text-ink-strong transition-colors group-hover:text-accent">
        +
      </span>
      {product.popular && (
        <span className="absolute -top-[11px] left-5 rounded-[5px] bg-accent px-2.5 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.08em] text-accent-ink">
          Terlaris
        </span>
      )}
      <div className="flex items-center gap-3">
        <ProductLogo domain={product.domain} name={product.name} size={44} />
        <div className="min-w-0">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-muted">
            {product.category}
          </p>
          <h3 className="font-disp font-bold leading-tight">{product.name}</h3>
        </div>
      </div>
      <p className="line-clamp-2 flex-1 text-[0.83rem] leading-[1.7] text-muted">
        {product.shortDescription}
      </p>
      <div className="flex items-end justify-between border-t border-ink-border pt-3.5">
        <div>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.06em] text-muted">
            Mulai dari
          </span>
          <p className="font-mono text-[1.05rem] font-bold tracking-[-0.02em] text-accent">
            {formatPrice(String(minPrice))}
          </p>
        </div>
        <span className="font-mono text-[0.72rem] font-bold tracking-[0.04em] text-muted transition-colors group-hover:text-accent">
          DETAIL →
        </span>
      </div>
    </button>
  );
}

function ProductModal({
  product,
  settings,
  onClose,
}: {
  product: Product;
  settings: Pick<Settings, 'waNumber' | 'waGroup'>;
  onClose: () => void;
}) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const selectedVariant =
    product.variants[selectedVariantIdx] || product.variants[0];

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const waMessage = `Halo admin, saya mau beli ${product.name} - ${selectedVariant.label} (${formatPrice(
    selectedVariant.price
  )})`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${product.name}`}
    >
      <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm" />
      <div
        className="relative max-h-[90vh] w-full animate-scale-in overflow-y-auto rounded-t-xl border border-ink-strong bg-ink-card p-6 sm:max-w-lg sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 text-muted hover:text-body"
          aria-label="Tutup"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex items-center gap-4 pr-8">
          <ProductLogo domain={product.domain} name={product.name} size={60} />
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted">
              {product.category}
            </p>
            <h3 className="font-disp text-xl font-bold">{product.name}</h3>
          </div>
        </div>

        <p className="mt-4 text-[0.85rem] leading-[1.75] text-muted">
          {product.longDescription}
        </p>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-accent">
              Pilihan Paket & Varian
            </h4>
            <span className="font-mono text-xs text-muted">
              {product.variants.length} varian tersedia
            </span>
          </div>

          <VariantSelector
            variants={product.variants}
            selectedIdx={selectedVariantIdx}
            onSelect={setSelectedVariantIdx}
          />
        </div>

        {product.features.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-accent">
              Fitur
            </h4>
            <ul className="space-y-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c9f158" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={waLink(settings.waNumber, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full"
          >
            Chat Admin
          </a>
          <a
            href={settings.waGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full"
          >
            Join Grup
          </a>
        </div>
      </div>
    </div>
  );
}

export function ProductSection({ products, settings }: ProductSectionProps) {
  const [selected, setSelected] = useState<Product | null>(null);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <>
      <section id="produk" className="relative z-[1] mx-auto max-w-[1150px] px-6 py-[84px]">
        <Reveal>
          <div className="mb-11 flex flex-wrap items-end justify-between gap-6 border-b border-ink-border pb-[22px]">
            <div>
              <p className="section-tag">02 — Produk Tersedia</p>
              <h2 className="font-disp text-[clamp(1.55rem,3.4vw,2.05rem)] font-bold leading-[1.15] tracking-[-0.025em]">
                Daftar produk
              </h2>
            </div>
            <p className="max-w-[380px] pb-1 text-[0.88rem] text-muted sm:text-right">
              Klik produk untuk lihat detail, pilihan durasi, dan harga lengkap.
              Order langsung via WhatsApp.
            </p>
          </div>
        </Reveal>

        {products.length === 0 ? (
          <p className="py-12 text-center font-mono text-sm text-muted">
            Belum ada produk tersedia.
          </p>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <Reveal key={product.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <ProductCard
                  product={product}
                  onDetail={() => setSelected(product)}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>
      {selected && (
        <ProductModal
          product={selected}
          settings={settings}
          onClose={handleClose}
        />
      )}
    </>
  );
}
