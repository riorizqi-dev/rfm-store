import type { Product } from '@/lib/products';

type TickerProps = {
  products: Product[];
};

export function Ticker({ products }: TickerProps) {
  const names = products.slice(0, 6).map((p) => p.name);
  const items = [
    ...names,
    'mulai Rp1rb',
    'bayar via QRIS · E-wallet · Transfer',
    'garansi sesuai aplikasi',
    'info & bagi-bagi aplikasi di saluran WA',
  ];

  const group = (
    <div className="flex items-center gap-[42px] whitespace-nowrap px-[21px] py-[13px] font-mono text-[0.74rem] font-medium tracking-[0.05em] text-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-[42px]">
          {i % 2 === 0 ? (
            <b className="font-bold text-body">{item}</b>
          ) : (
            <span>{item}</span>
          )}
          <span className="text-accent">//</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative z-[1] overflow-hidden border-y border-ink-border bg-ink-surface">
      <div className="marquee-track">
        {group}
        {group}
      </div>
    </div>
  );
}
