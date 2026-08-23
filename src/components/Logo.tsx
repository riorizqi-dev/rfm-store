'use client';

import { useState } from 'react';

type LogoProps = {
  domain?: string;
  name: string;
  size?: number;
  className?: string;
};

const LOGO_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_API_KEY;

function FallbackTile({
  name,
  size,
  className,
}: {
  name: string;
  size: number;
  className?: string;
}) {
  const letter = (name || '?').charAt(0).toUpperCase();
  return (
    <span
      className={className}
      role="img"
      aria-label={name}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 10,
        background: '#252b1e',
        border: '1px solid #39412c',
        color: '#e9ede0',
        fontFamily: 'var(--font-disp), sans-serif',
        fontWeight: 700,
        fontSize: size * 0.42,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {letter}
    </span>
  );
}

export function ProductLogo({ domain, name, size = 48, className }: LogoProps) {
  const [failed, setFailed] = useState(false);

  if (!domain || failed || !LOGO_KEY) {
    return <FallbackTile name={name} size={size} className={className} />;
  }

  return (
    // pakai <img> biasa: logo.dev adalah CDN gambar eksternal dengan token di URL
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://img.logo.dev/${domain}?token=${LOGO_KEY}&size=128&format=png`}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      style={{
        borderRadius: 10,
        display: 'inline-block',
        objectFit: 'contain',
        flexShrink: 0,
        background: '#e9ede0',
        padding: Math.max(3, Math.round(size * 0.09)),
      }}
    />
  );
}
