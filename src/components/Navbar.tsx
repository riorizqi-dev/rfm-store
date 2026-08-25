'use client';

import { useState, useEffect } from 'react';
import { RFMLogo } from './RFMLogo';

type NavbarProps = {
  storeName: string;
};

const navLinks = [
  { href: '#kenapa', label: 'Kenapa' },
  { href: '#produk', label: 'Produk' },
  { href: '#cara', label: 'Cara Beli' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar({ storeName }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-ink-border bg-ink/90 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[62px] max-w-[1180px] items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2.5">
          <RFMLogo size={38} />
          <span className="font-disp text-[1.05rem] font-bold tracking-tight text-body">
            {storeName}
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[0.74rem] font-medium uppercase tracking-[0.05em] text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontak"
            className="btn-primary px-4 py-2 text-[0.76rem]"
          >
            Chat Admin
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-strong text-body transition-colors hover:border-accent hover:text-accent md:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-border bg-ink/95 backdrop-blur-md md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-ink-border py-3 font-mono text-[0.82rem] font-medium uppercase tracking-wider text-muted hover:text-accent"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#kontak"
              onClick={() => setOpen(false)}
              className="btn-primary mt-3 w-full"
            >
              Chat Admin
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
