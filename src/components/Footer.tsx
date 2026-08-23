import type { Settings } from '@/lib/products';
import { waLink } from '@/lib/utils';

type FooterProps = {
  settings: Settings;
};

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] border-t border-ink-border">
      <div className="mx-auto flex max-w-[1150px] flex-wrap items-center justify-between gap-3 px-6 py-[26px] font-mono text-[0.7rem] text-muted">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-body">{settings.storeName}</span>
          <span>{settings.tagline}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={waLink(settings.waNumber, settings.waDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-body transition-colors hover:text-accent"
          >
            WhatsApp
          </a>
          <a
            href={settings.waGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-body transition-colors hover:text-accent"
          >
            Grup
          </a>
          {settings.waChannel && (
            <a
              href={settings.waChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-body transition-colors hover:text-accent"
            >
              Saluran
            </a>
          )}
          <span className="flex items-center gap-1.5">
            status: <span className="text-[#00d68f]">● online</span>
          </span>
        </div>
      </div>
      <div className="border-t border-ink-border">
        <p className="mx-auto max-w-[1150px] px-6 py-4 font-mono text-[0.68rem] text-muted">
          {'\u00A9'} {year} {settings.storeName}. Semua merek dagangan milik
          pemiliknya masing-masing. Transaksi dilakukan di luar website via
          WhatsApp.
        </p>
      </div>
    </footer>
  );
}
