import type { Settings } from '@/lib/products';
import { waLink } from '@/lib/utils';
import { Reveal } from './Reveal';

type CTASectionProps = {
  settings: Pick<
    Settings,
    'waNumber' | 'waGroup' | 'waChannel' | 'waDefaultMessage'
  >;
};

export function CTASection({ settings }: CTASectionProps) {
  return (
    <section
      id="kontak"
      className="relative z-[1] mx-auto max-w-[1150px] px-6 pb-[90px] pt-10"
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-[14px] border border-ink-strong bg-ink-surface px-8 py-[52px] text-center">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(rgba(201,241,88,.07) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          <div className="relative">
            <p className="mb-3.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">
              {'// siap order?'}
            </p>
            <h2 className="font-disp text-[clamp(1.5rem,3.4vw,2rem)] font-bold tracking-[-0.02em]">
              Siap mulai?
            </h2>
            <p className="mx-auto mb-7 mt-2.5 max-w-[440px] text-[0.9rem] text-muted">
              Chat admin langsung via WhatsApp, atau join grup untuk info stok
              dan promo terbaru.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={waLink(settings.waNumber, settings.waDefaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Chat Admin Sekarang
              </a>
              <a
                href={settings.waGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Join Grup
              </a>
            </div>
            {settings.waChannel && (
              <p className="mt-6 font-mono text-xs text-muted">
                Ikuti{' '}
                <a
                  href={settings.waChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-accent hover:underline"
                >
                  saluran WA kami
                </a>{' '}
                biar gak ketinggalan info stok & bagi-bagi aplikasi gratis.
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
