import type { Broadcast } from '@/lib/products';

type BroadcastTickerProps = {
  broadcasts: Broadcast[];
};

export function BroadcastTicker({ broadcasts }: BroadcastTickerProps) {
  // tidak ada pengumuman -> bar tidak muncul sama sekali
  if (broadcasts.length === 0) return null;

  const items = broadcasts
    .slice(0, 5)
    .map((b) => (b.message.length > 120 ? `${b.message.slice(0, 117)}...` : b.message));

  const group = (
    <div className="flex items-center gap-10 whitespace-nowrap px-5 py-2.5">
      {items.map((message, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="flex items-center gap-2 font-mono text-[0.74rem] font-bold tracking-wide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 11l18-7-4 16-6-5-3 4-1-6z" />
            </svg>
            {message}
          </span>
          <span className="text-accent-ink/40">//</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="relative z-[1] overflow-hidden bg-accent text-accent-ink"
      role="status"
      aria-label="Pengumuman"
    >
      <div className="marquee-track">
        {group}
        {group}
      </div>
    </div>
  );
}
